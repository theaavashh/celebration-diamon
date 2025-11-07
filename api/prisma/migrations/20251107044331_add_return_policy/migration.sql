-- CreateTable
CREATE TABLE "return_policies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Return Policy',
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_policies_pkey" PRIMARY KEY ("id")
);
