const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleDiamondCertification() {
  try {
    console.log('Creating sample diamond certification...');

    const sampleDiamondCertification = await prisma.diamondCertification.create({
      data: {
        title: "DIAMOND CERTIFICATION",
        description: "Every diamond in our collection is certified by the International Gemological Institute (IGI), guaranteeing the quality, authenticity, and value of your fine jewelry. Our certification process ensures that each diamond meets the highest standards of excellence, providing you with complete peace of mind and detailed documentation of your investment.",
        ctaText: "SHOP CERTIFIED COLLECTION",
        ctaLink: "/certified-collection",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        isActive: true,
        sortOrder: 0
      }
    });

    console.log('Sample diamond certification created successfully:', sampleDiamondCertification);
  } catch (error) {
    console.error('Error creating sample diamond certification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleDiamondCertification();

















