import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { dodopayments } from "@/lib/dodopayments";

export const runtime = "nodejs";

const inactiveEvents = new Set([
  "subscription.cancelled",
  "subscription.expired",
  "subscription.failed",
]);

function readMetadata(data: unknown) {
  if (!data || typeof data !== "object" || !("metadata" in data)) {
    return {} as Record<string, string>;
  }
  const metadata = data.metadata;
  return metadata && typeof metadata === "object"
    ? metadata as Record<string, string>
    : {} as Record<string, string>;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookId = request.headers.get("webhook-id");
  const webhookSignature = request.headers.get("webhook-signature");
  const webhookTimestamp = request.headers.get("webhook-timestamp");

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return NextResponse.json({ error: "Missing webhook headers." }, { status: 400 });
  }

  let event: ReturnType<typeof dodopayments.webhooks.unwrap>;
  try {
    event = dodopayments.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const existing = await prisma.dodoWebhookEvent.findUnique({ where: { eventId: webhookId } });
  if (existing?.processed) {
    return NextResponse.json({ received: true });
  }

  await prisma.dodoWebhookEvent.upsert({
    where: { eventId: webhookId },
    create: {
      eventId: webhookId,
      eventType: event.type,
      payload: event as unknown as Prisma.InputJsonValue,
    },
    update: {},
  });

  try {
    await prisma.$transaction(async (tx) => {
      const metadata = readMetadata(event.data);
      const userId = metadata.user_id;
      const planId = metadata.plan_id;
      const localPaymentId = metadata.local_payment_id;

      if (event.type === "payment.succeeded" && localPaymentId && userId) {
        const payment = await tx.payment.findFirst({
          where: {
            id: localPaymentId,
            userId,
            transaction: planId ? { subscriptionId: planId } : undefined,
          },
          select: { id: true },
        });
        const plan = planId
          ? await tx.subscription.findUnique({ where: { id: planId } })
          : null;

        if (payment && plan && plan.planType !== "FREE") {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setUTCDate(endDate.getUTCDate() + plan.totalDuration);

          await tx.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED", dodoPaymentId: event.data.payment_id },
          });
          await tx.userSubscription.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
          });
          await tx.userSubscription.create({
            data: {
              id: crypto.randomUUID(),
              userId,
              subscriptionId: plan.id,
              isActive: true,
              startDate,
              endDate,
            },
          });
          await tx.user.update({
            where: { id: userId },
            data: { continueWithPlanType: plan.planType, isPremium: true },
          });
        }
      }

      if (event.type === "payment.failed" && localPaymentId && userId) {
        await tx.payment.updateMany({
          where: { id: localPaymentId, userId },
          data: { status: "FAILED", dodoPaymentId: event.data.payment_id },
        });
      }

      if ((event.type === "subscription.active" || event.type === "subscription.renewed") && userId && planId) {
        const plan = await tx.subscription.findUnique({ where: { id: planId } });
        if (plan && plan.planType !== "FREE") {
          await tx.userSubscription.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
          });
          await tx.userSubscription.upsert({
            where: { dodoSubscriptionId: event.data.subscription_id },
            create: {
              id: crypto.randomUUID(),
              dodoSubscriptionId: event.data.subscription_id,
              userId,
              subscriptionId: plan.id,
              isActive: true,
              startDate: new Date(event.data.previous_billing_date),
              endDate: new Date(event.data.next_billing_date),
            },
            update: {
              subscriptionId: plan.id,
              isActive: true,
              startDate: new Date(event.data.previous_billing_date),
              endDate: new Date(event.data.next_billing_date),
            },
          });
          await tx.user.update({
            where: { id: userId },
            data: { continueWithPlanType: plan.planType, isPremium: true },
          });
        }
      }

      const endedSubscriptionId = "subscription_id" in event.data
        ? event.data.subscription_id
        : null;
      if (inactiveEvents.has(event.type) && endedSubscriptionId) {
        const ended = await tx.userSubscription.findUnique({
          where: { dodoSubscriptionId: endedSubscriptionId },
          select: { userId: true },
        });
        if (ended) {
          await tx.userSubscription.update({
            where: { dodoSubscriptionId: endedSubscriptionId },
            data: { isActive: false, endDate: new Date() },
          });
          await tx.user.update({
            where: { id: ended.userId },
            data: { continueWithPlanType: "FREE", isPremium: false },
          });
        }
      }

      await tx.dodoWebhookEvent.update({
        where: { eventId: webhookId },
        data: { processed: true },
      });
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Dodo Payments webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
