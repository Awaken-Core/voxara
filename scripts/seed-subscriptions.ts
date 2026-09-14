import "dotenv/config";
import { PrismaClient, type PlanType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

const env = z.object({
  DATABASE_URL: z.string().min(1),
}).parse(process.env);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

const plans: Array<{
  id: string;
  planType: PlanType;
  price: number;
  credits: number;
  benefits: string[];
  nonBenefits: string[];
}> = [
  {
    id: "plan_free",
    planType: "FREE",
    price: 0,
    credits: 3,
    benefits: ["Core text to speech", "Starter voice library", "Personal workspace"],
    nonBenefits: ["Custom voice cloning", "Priority processing"],
  },
  {
    id: "plan_premium",
    planType: "PREMIUM",
    price: 19,
    credits: 30,
    benefits: ["More monthly generations", "Custom voice cloning", "Commercial usage"],
    nonBenefits: ["Priority processing"],
  },
  {
    id: "plan_pro",
    planType: "PRO",
    price: 49,
    credits: 80,
    benefits: ["Highest usage limits", "Priority processing", "Priority support"],
    nonBenefits: [],
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.subscription.upsert({
      where: { planType: plan.planType },
      create: { ...plan, totalDuration: 30 },
      update: {
        price: plan.price,
        totalDuration: 30,
        benefits: plan.benefits,
        nonBenefits: plan.nonBenefits,
        credits: plan.credits
      },
    });
  }

  console.log("Seeded Free, Premium, and Pro subscription plans.");
}

main()
  .catch((error) => {
    console.error("Failed to seed subscription plans:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
