-- CreateEnum
CREATE TYPE "GuardRailType" AS ENUM ('USERPROMPT', 'USERVOICE');

-- CreateTable
CREATE TABLE "GuardRailsMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkPass" BOOLEAN,
    "guardrailType" "GuardRailType" NOT NULL DEFAULT 'USERPROMPT',
    "response" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "GuardRailsMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuardRailsMessage" ADD CONSTRAINT "GuardRailsMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
