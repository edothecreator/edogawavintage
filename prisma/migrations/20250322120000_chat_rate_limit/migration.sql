-- CreateTable
CREATE TABLE "ChatRequestLog" (
    "id" TEXT NOT NULL,
    "ipKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatRequestLog_ipKey_createdAt_idx" ON "ChatRequestLog"("ipKey", "createdAt");
