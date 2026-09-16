/*
  Warnings:

  - A unique constraint covering the columns `[generationId]` on the table `CreditLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source]` on the table `CreditLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CreditLog" ADD COLUMN     "generationId" TEXT,
ADD COLUMN     "source" TEXT,
ALTER COLUMN "userSubscriptionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CreditLog_generationId_key" ON "CreditLog"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditLog_source_key" ON "CreditLog"("source");

-- AddForeignKey
ALTER TABLE "CreditLog" ADD CONSTRAINT "CreditLog_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
