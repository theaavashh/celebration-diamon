-- AlterTable
ALTER TABLE "products" ADD COLUMN     "digitalBrowser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "distributor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "website" BOOLEAN NOT NULL DEFAULT false;
