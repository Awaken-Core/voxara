-- CreateTable
CREATE TABLE "Policies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isAgreed" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Policies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Policies" ADD CONSTRAINT "Policies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
