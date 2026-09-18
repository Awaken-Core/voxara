/*
  Warnings:

  - You are about to drop the column `creditsAdded` on the `CreditLog` table. All the data in the column will be lost.
  - Added the required column `creditsOps` to the `CreditLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreditOps" AS ENUM ('ADDED', 'REMOVED');

-- AlterTable
ALTER TABLE "CreditLog" DROP COLUMN "creditsAdded",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "creditsOps" "CreditOps" NOT NULL;

-- AlterTable
ALTER TABLE "UserCredits" ALTER COLUMN "totalCredits" SET DEFAULT 3;
