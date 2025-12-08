/*
  Warnings:

  - You are about to drop the column `description` on the `gallery_items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `gallery_items` table. All the data in the column will be lost.
  - You are about to drop the column `caret` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `otherGemstones` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `settingType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stoneType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stoneWeight` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gallery_items" DROP COLUMN "description",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "caret",
DROP COLUMN "color",
DROP COLUMN "otherGemstones",
DROP COLUMN "settingType",
DROP COLUMN "size",
DROP COLUMN "stoneType",
DROP COLUMN "stoneWeight";

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
