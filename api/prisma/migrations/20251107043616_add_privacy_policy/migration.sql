-- CreateTable
CREATE TABLE "privacy_policies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Privacy Policy',
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "privacy_policies_pkey" PRIMARY KEY ("id")
);
