const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleCelebrationProcess() {
  try {
    console.log('Creating sample celebration process...');

    const sampleCelebrationProcess = await prisma.celebrationProcess.create({
      data: {
        title: "The Celebration Diamond process is in the details",
        description: "Experience our comprehensive celebration diamond process designed to make your special moments unforgettable.",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        isActive: true,
        sortOrder: 0,
        steps: {
          create: [
            {
              title: "Jewelry Selection",
              description: "Select the perfect jewelry for your special moment.",
              icon: "diamond",
              order: 1,
              isActive: true
            },
            {
              title: "Book Appointment",
              description: "Choose a date and time for your appointment.",
              icon: "star",
              order: 2,
              isActive: true
            },
            {
              title: "Store Visit",
              description: "In specific date and time, visit the store to try on the jewelry.",
              icon: "shield",
              order: 3,
              isActive: true
            },
            {
              title: "Luxury Experience",
              description: "Enjoy the luxury jewelry shopping experience",
              icon: "heart",
              order: 4,
              isActive: true
            }
          ]
        }
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });

    console.log('Sample celebration process created successfully:', sampleCelebrationProcess);
  } catch (error) {
    console.error('Error creating sample celebration process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleCelebrationProcess();

















