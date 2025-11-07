-- CreateTable
CREATE TABLE "about_us" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT,
    "storyTitle" TEXT NOT NULL,
    "storyContent" TEXT NOT NULL,
    "storyImageUrl" TEXT,
    "missionTitle" TEXT NOT NULL,
    "missionContent" TEXT NOT NULL,
    "visionTitle" TEXT NOT NULL,
    "visionContent" TEXT NOT NULL,
    "values" JSONB,
    "whyChooseUs" JSONB,
    "milestones" JSONB,
    "contactLocation" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_us_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "imageUrl" TEXT,
    "email" TEXT,
    "linkedin" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "team_members_isActive_idx" ON "team_members"("isActive");

-- CreateIndex
CREATE INDEX "team_members_sortOrder_idx" ON "team_members"("sortOrder");
