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
        isPremium: true,
      },
    });

    return {
      planType: user.isPremium ? "PREMIUM" as const : "FREE" as const,
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
