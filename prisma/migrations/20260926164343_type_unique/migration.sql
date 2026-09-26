/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Policies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Policies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policies" ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Policies_type_key" ON "Policies"("type");
