-- CreateTable
CREATE TABLE "ring_customizations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaLink" TEXT,
    "processImageUrl" TEXT,
    "example1Title" TEXT,
    "example1Desc" TEXT,
    "example1ImageUrl" TEXT,
    "example2Title" TEXT,
    "example2Desc" TEXT,
    "example2ImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ring_customizations_pkey" PRIMARY KEY ("id")
);
