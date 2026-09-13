/*
  Warnings:

  - You are about to drop the column `orgId` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Voice` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Generation" DROP CONSTRAINT "Generation_orgId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationUser" DROP CONSTRAINT "OrganizationUser_orgId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationUser" DROP CONSTRAINT "OrganizationUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Voice" DROP CONSTRAINT "Voice_orgId_fkey";

-- DropIndex
DROP INDEX "Generation_orgId_idx";

-- DropIndex
DROP INDEX "Voice_orgId_idx";

-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "orgId";

-- AlterTable
ALTER TABLE "Voice" DROP COLUMN "orgId";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationUser";

-- DropEnum
DROP TYPE "OrganizationRole";
