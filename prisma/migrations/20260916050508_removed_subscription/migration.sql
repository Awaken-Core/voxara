/*
  Warnings:

  - You are about to drop the column `userSubscriptionId` on the `CreditLog` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pricingId` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditLog" DROP CONSTRAINT "CreditLog_userSubscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_userId_fkey";

-- DropIndex
DROP INDEX "PaymentTransaction_subscriptionId_idx";

-- AlterTable
ALTER TABLE "CreditLog" DROP COLUMN "userSubscriptionId",
ADD COLUMN     "pricingId" UUID;

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "subscriptionId",
ADD COLUMN     "pricingId" UUID NOT NULL;

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "UserSubscription";

-- CreateTable
CREATE TABLE "Pricing" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "price" DECIMAL(10,2) NOT NULL,
    "credits" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPurchaseLog" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "pricingId" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "purchasedCredits" INTEGER NOT NULL,
    "purchasedAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPurchaseLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPurchaseLog_paymentId_key" ON "UserPurchaseLog"("paymentId");

-- CreateIndex
CREATE INDEX "UserPurchaseLog_userId_idx" ON "UserPurchaseLog"("userId");

-- CreateIndex
CREATE INDEX "UserPurchaseLog_pricingId_idx" ON "UserPurchaseLog"("pricingId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_pricingId_idx" ON "PaymentTransaction"("pricingId");

-- AddForeignKey
ALTER TABLE "UserPurchaseLog" ADD CONSTRAINT "UserPurchaseLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchaseLog" ADD CONSTRAINT "UserPurchaseLog_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchaseLog" ADD CONSTRAINT "UserPurchaseLog_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLog" ADD CONSTRAINT "CreditLog_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
