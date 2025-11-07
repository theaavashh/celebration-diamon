-- CreateTable
CREATE TABLE "help_centers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Help Center',
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "help_centers_pkey" PRIMARY KEY ("id")
);
