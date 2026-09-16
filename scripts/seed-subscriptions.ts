import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

const env = z.object({
  DATABASE_URL: z.string().min(1),
}).parse(process.env);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

const plans: Array<{
  price: number;
  credits: number;
  benefits: string[];
}> = [
  {
    price: 19,
    credits: 30,
    benefits: ["Highest usage limits", "Priority processing", "Priority support"],
  },
  {
    price: 49,
    credits: 80,
    benefits: ["Highest usage limits", "Priority processing", "Priority support"],
  },
  {
    price: 99,
    credits: 130,
    benefits: ["Highest usage limits", "Priority processing", "Priority support"],
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.pricing.create({
      data: { 
        price: plan.price,
        benefits: plan.benefits,
        credits: plan.credits,
        isActive: true,
      },
    });
  }

  console.log("Seeded credit pricing packs.");
}

main()
  .catch((error) => {
    console.error("Failed to seed subscription plans:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
