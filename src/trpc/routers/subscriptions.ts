import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { dodopayments } from "@/lib/dodopayments";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { authProcedure, createTRPCRouter } from "../init";

export const subscriptionsRouter = createTRPCRouter({
  getPlans: authProcedure.query(async ({ ctx }) => {
    const [plans, activeSubscription, user] = await Promise.all([
      prisma.subscription.findMany({ orderBy: { price: "asc" } }),
      prisma.userSubscription.findFirst({
        where: {
          userId: ctx.userId,
          isActive: true,
          OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
        },
        orderBy: { createdAt: "desc" },
        select: { subscriptionId: true },
      }),
      prisma.user.findUniqueOrThrow({
        where: { id: ctx.userId },
        select: { continueWithPlanType: true },
      }),
    ]);

    const fallbackPlan = plans.find((plan) => plan.planType === user.continueWithPlanType)
      ?? plans.find((plan) => plan.planType === "FREE");

    return {
      currentPlanId: activeSubscription?.subscriptionId ?? fallbackPlan?.id ?? null,
      plans: plans.map((plan) => ({
        id: plan.id,
        planType: plan.planType,
        price: Number(plan.price),
        totalDuration: plan.totalDuration,
        benefits: plan.benefits,
        nonBenefits: plan.nonBenefits,
        canCheckout: plan.planType !== "FREE",
      })),
    };
  }),

  createCheckout: authProcedure
    .input(z.object({ planId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [plan, user] = await Promise.all([
        prisma.subscription.findUnique({ where: { id: input.planId } }),
        prisma.user.findUnique({
          where: { id: ctx.userId },
          select: { id: true, email: true, name: true },
        }),
      ]);

      if (!plan || plan.planType === "FREE") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Select a paid plan." });
      }
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }

      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          amount: plan.price,
          currency: "USD",
          transaction: { create: { subscriptionId: plan.id } },
        },
        select: { id: true },
      });

      try {
        const checkout = await dodopayments.checkoutSessions.create({
          product_cart: [{
            product_id: env.DODOPAYMENTS_PRODUCT_ID,
            quantity: 1,
            amount: Math.round(Number(plan.price) * 100),
          }],
          customer: { email: user.email, name: user.name },
          return_url: env.DODO_PAYMENTS_RETURN_URL,
          cancel_url: `${env.APP_URL.replace(/\/$/, "")}/pricing`,
          customization: { theme: "dark" },
          metadata: {
            user_id: user.id,
            plan_id: plan.id,
            local_payment_id: payment.id,
          },
        });

        if (!checkout.checkout_url) {
          throw new Error("Dodo Payments did not return a checkout URL.");
        }

        return { checkoutUrl: checkout.checkout_url };
      } catch (error) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Could not start checkout.",
          cause: error,
        });
      }
    }),
});
