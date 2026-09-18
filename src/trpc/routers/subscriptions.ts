import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { dodopayments } from "@/lib/dodopayments";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { authProcedure, createTRPCRouter } from "../init";

export const subscriptionsRouter = createTRPCRouter({
  getPlans: authProcedure.query(async ({ ctx }) => {
    const [plans, credits] = await Promise.all([
      prisma.pricing.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
      }),
      prisma.userCredits.findUnique({
        where: { userId: ctx.userId },
        select: { totalCredits: true },
      }),
    ]);

    return {
      totalCredits: credits?.totalCredits ?? 0,
      plans: plans.map((pricing) => ({
        id: pricing.id,
        price: Number(pricing.price),
        currency: pricing.currency,
        credits: pricing.credits,
        benefits: pricing.benefits,
      })),
    };
  }),

  createCheckout: authProcedure
    .input(z.object({ pricingId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [pricing, user] = await Promise.all([
        prisma.pricing.findFirst({
          where: { id: input.pricingId, isActive: true },
        }),
        prisma.user.findUnique({
          where: { id: ctx.userId },
          select: { id: true, email: true, name: true },
        }),
      ]);

      if (!pricing || pricing.credits <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Select a valid credit pack." });
      }
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }

      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          amount: pricing.price,
          currency: pricing.currency,
          transaction: { create: { pricingId: pricing.id } },
        },
        select: { id: true },
      });

      try {
        const checkout = await dodopayments.checkoutSessions.create({
          product_cart: [{
            product_id: env.DODOPAYMENTS_PRODUCT_ID,
            quantity: 1,
            amount: Math.round(Number(pricing.price) * 100),
          }],
          customer: { email: user.email, name: user.name },
          feature_flags: {
            always_create_new_customer: env.DODO_PAYMENTS_ENVIRONMENT === "test_mode",
          },
          return_url: env.DODO_PAYMENTS_RETURN_URL,
          cancel_url: `${env.APP_URL.replace(/\/$/, "")}/pricing`,
          customization: { theme: "dark" },
          metadata: {
            user_id: user.id,
            pricing_id: pricing.id,
            local_payment_id: payment.id,
          },
        });

        if (!checkout.checkout_url) throw new Error("Dodo Payments did not return a checkout URL.");
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
