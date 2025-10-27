-- CreateTable
CREATE TABLE "moments_of_serenity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moments_of_serenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serenity_moments" (
    "id" TEXT NOT NULL,
    "momentsOfSerenityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "serenity_moments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "serenity_moments" ADD CONSTRAINT "serenity_moments_momentsOfSerenityId_fkey" FOREIGN KEY ("momentsOfSerenityId") REFERENCES "moments_of_serenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
