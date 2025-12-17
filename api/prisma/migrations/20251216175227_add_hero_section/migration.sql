/*
  Warnings:

  - You are about to drop the `about_us` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `banners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `celebration_process_steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `celebration_processes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cultures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diamond_certifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `galleries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gallery_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hero` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `popup_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quote_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ring_customizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wedding_planners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "celebration_process_steps" DROP CONSTRAINT "celebration_process_steps_celebrationProcessId_fkey";

-- DropForeignKey
ALTER TABLE "gallery_items" DROP CONSTRAINT "gallery_items_galleryId_fkey";

-- DropForeignKey
ALTER TABLE "quote_requests" DROP CONSTRAINT "quote_requests_productId_fkey";

-- DropTable
DROP TABLE "about_us";

-- DropTable
DROP TABLE "banners";

-- DropTable
DROP TABLE "celebration_process_steps";

-- DropTable
DROP TABLE "celebration_processes";

-- DropTable
DROP TABLE "cultures";

-- DropTable
DROP TABLE "diamond_certifications";

-- DropTable
DROP TABLE "faqs";

-- DropTable
DROP TABLE "galleries";

-- DropTable
DROP TABLE "gallery_items";

-- DropTable
DROP TABLE "hero";

-- DropTable
DROP TABLE "popup_images";

-- DropTable
DROP TABLE "quote_requests";

-- DropTable
DROP TABLE "quotes";

-- DropTable
DROP TABLE "ring_customizations";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "stores";

-- DropTable
DROP TABLE "team_members";

-- DropTable
DROP TABLE "wedding_planners";

-- CreateTable
CREATE TABLE "hero_sections" (
    "id" TEXT NOT NULL,
    "leftContentType" TEXT NOT NULL,
    "rightContentType" TEXT NOT NULL,
    "leftContent" TEXT NOT NULL,
    "rightContent" TEXT NOT NULL,
    "leftBg" TEXT NOT NULL,
    "rightBg" TEXT NOT NULL,
    "leftWidth" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_sections_pkey" PRIMARY KEY ("id")
);
