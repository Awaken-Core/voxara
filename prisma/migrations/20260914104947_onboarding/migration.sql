-- CreateEnum
CREATE TYPE "UsingFor" AS ENUM ('OFFICE', 'STUDENT', 'FREELANCE', 'PERSONAL', 'OTHERS');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PREMIUM', 'PRO');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "planType" "PlanType" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "continueWithPlanType" "PlanType" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noteForUs" TEXT,
ADD COLUMN     "primaryGoals" TEXT,
ADD COLUMN     "usingFor" "UsingFor" DEFAULT 'PERSONAL';
