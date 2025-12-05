-- AlterTable
ALTER TABLE "products" ADD COLUMN     "jewelryType" TEXT,
ADD COLUMN     "materialType" TEXT;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL;
