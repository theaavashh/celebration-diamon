/*
  Warnings:

  - You are about to drop the column `adminId` on the `retailers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `retailers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `retailers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `retailers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `retailers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `retailers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `retailers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "retailers" DROP CONSTRAINT "retailers_adminId_fkey";

-- DropIndex
DROP INDEX "retailers_adminId_key";

-- AlterTable
ALTER TABLE "retailers" DROP COLUMN "adminId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "retailers_username_key" ON "retailers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "retailers_email_key" ON "retailers"("email");
