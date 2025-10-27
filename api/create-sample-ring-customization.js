const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleRingCustomization() {
  try {
    console.log('Creating sample ring customization...');

    const sampleRingCustomization = await prisma.ringCustomization.create({
      data: {
        title: "CREATE YOUR RING ONLINE",
        description: "If you have your heart set on a certain gemstone or cut, eden garden jewelry possesses the power to help customize your own unique, bespoke ring designs. the magic at your very fingertips.",
        ctaText: "START DESIGNING",
        ctaLink: "/design",
        processImageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        example1Title: "Ornate Band Design",
        example1Desc: "V-shaped with leaf carvings",
        example1ImageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        example2Title: "Salt & Pepper Diamond",
        example2Desc: "Unique speckled gemstone",
        example2ImageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        isActive: true,
        sortOrder: 0
      }
    });

    console.log('Sample ring customization created successfully:', sampleRingCustomization);
  } catch (error) {
    console.error('Error creating sample ring customization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleRingCustomization();

















