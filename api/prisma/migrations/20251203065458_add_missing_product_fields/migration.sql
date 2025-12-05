/*
  Warnings:

  - You are about to drop the column `fullContent` on the `diamond_certifications` table. All the data in the column will be lost.
  - You are about to drop the column `diamondCaret` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `goldCaret` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `silverPurity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `about_us` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq_section_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `help_centers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `privacy_policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `retailers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `return_policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `terms_and_conditions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonial_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `top_banners` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `title` on table `gallery_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Made the column `comment` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "celebration_process_steps" ALTER COLUMN "order" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "diamond_certifications" DROP COLUMN "fullContent";

-- AlterTable
ALTER TABLE "gallery_items" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "diamondCaret",
DROP COLUMN "goldCaret",
DROP COLUMN "silverPurity",
ADD COLUMN     "diamondCaratWeight" TEXT,
ADD COLUMN     "diamondCertification" TEXT,
ADD COLUMN     "diamondClarityGrade" TEXT,
ADD COLUMN     "diamondColorGrade" TEXT,
ADD COLUMN     "diamondCutGrade" TEXT,
ADD COLUMN     "diamondMetalDetails" TEXT,
ADD COLUMN     "diamondOrigin" TEXT,
ADD COLUMN     "diamondShapeCut" TEXT,
ADD COLUMN     "diamondType" TEXT,
ADD COLUMN     "goldCraftsmanship" TEXT,
ADD COLUMN     "goldDesignDescription" TEXT,
ADD COLUMN     "goldFinishedType" TEXT,
ADD COLUMN     "goldPurity" TEXT,
ADD COLUMN     "goldStoneQuality" TEXT,
ADD COLUMN     "goldStones" TEXT,
ADD COLUMN     "goldType" TEXT,
ADD COLUMN     "platinumType" TEXT,
ADD COLUMN     "platinumWeight" TEXT,
ADD COLUMN     "silverType" TEXT;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "customerName",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "comment" SET NOT NULL;

-- DropTable
DROP TABLE "about_us";

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "faq_section_settings";

-- DropTable
DROP TABLE "help_centers";

-- DropTable
DROP TABLE "privacy_policies";

-- DropTable
DROP TABLE "retailers";

-- DropTable
DROP TABLE "return_policies";

-- DropTable
DROP TABLE "stores";

-- DropTable
DROP TABLE "team_members";

-- DropTable
DROP TABLE "terms_and_conditions";

-- DropTable
DROP TABLE "testimonial_sections";

-- DropTable
DROP TABLE "testimonials";

-- DropTable
DROP TABLE "top_banners";
