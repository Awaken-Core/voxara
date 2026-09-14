import { z } from "zod";

import { prisma } from "@/lib/db";
import { authProcedure, createTRPCRouter } from "../init";

const onboardingInput = z.object({
  usingFor: z.enum(["OFFICE", "STUDENT", "FREELANCE", "PERSONAL", "OTHERS"]),
  primaryGoals: z.string().trim().min(3, "Tell us a little about your goal.").max(500),
  noteForUs: z.string().trim().max(1000).optional(),
  continueWithPlanType: z.enum(["FREE", "PREMIUM", "PRO"]),
});

export const onboardingRouter = createTRPCRouter({
  getCurrentPlan: authProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.userId },
      select: {
        continueWithPlanType: true,
        subscriptions: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { subscription: { select: { planType: true } } },
        },
      },
    });

    return {
      planType: user.subscriptions[0]?.subscription.planType ?? user.continueWithPlanType,
    };
  }),

  complete: authProcedure
    .input(onboardingInput)
    .mutation(async ({ ctx, input }) => {
      await prisma.user.update({
        where: { id: ctx.userId },
        data: {
          ...input,
          noteForUs: input.noteForUs || null,
          isOnboarded: true,
        },
      });

      return { success: true };
    }),
});
