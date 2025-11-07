-- CreateTable
CREATE TABLE "terms_and_conditions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Terms & Conditions',
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terms_and_conditions_pkey" PRIMARY KEY ("id")
);
