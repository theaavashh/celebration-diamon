/*
  Warnings:

  - You are about to drop the column `description` on the `hero` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hero" DROP COLUMN "description",
ADD COLUMN     "buttonBgColor" TEXT DEFAULT '#f59e0b',
ADD COLUMN     "buttonRadius" INTEGER DEFAULT 9999,
ADD COLUMN     "buttonTextColor" TEXT DEFAULT '#ffffff';
