/*
  Warnings:

  - A unique constraint covering the columns `[dodoProductId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[planType]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dodoSubscriptionId]` on the table `UserSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "dodoProductId" TEXT;

-- AlterTable
ALTER TABLE "UserSubscription" ADD COLUMN     "dodoSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_dodoProductId_key" ON "Subscription"("dodoProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_planType_key" ON "Subscription"("planType");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_dodoSubscriptionId_key" ON "UserSubscription"("dodoSubscriptionId");
