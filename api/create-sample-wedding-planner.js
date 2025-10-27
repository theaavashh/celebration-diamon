const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleWeddingPlanner() {
  try {
    console.log('Creating sample wedding planner...');

    const sampleWeddingPlanner = await prisma.weddingPlanner.create({
      data: {
        title: "YOURS WEDDING JEWELRY PLANNER",
        description: "Step into confidence with our comprehensive bride planning service. Inspired by the art of dental restoration, this process features detailed consultations and personalized designs that bring harmony to your smile. Each planning session is a gentle reminder to prioritize your oral health and find the perfect solution for your unique dental needs.",
        ctaText: "SCHEDULE CONSULTATION",
        ctaLink: "/consultation",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badgeText: "BRIDE PLANNING",
        badgeSubtext: "Expert Service",
        isActive: true,
        sortOrder: 0
      }
    });

    console.log('Sample wedding planner created successfully:', sampleWeddingPlanner);
  } catch (error) {
    console.error('Error creating sample wedding planner:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleWeddingPlanner();

















