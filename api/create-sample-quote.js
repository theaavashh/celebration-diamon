const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleQuote() {
  try {
    console.log('Creating sample quote...');

    const sampleQuote = await prisma.quote.create({
      data: {
        text: "Thoughtfully crafted designs, inclusive sizing, and colors inspired by you. This isn't just jewelry. It's self-expression.",
        author: "Celebration Diamond",
        isActive: true,
        sortOrder: 0
      }
    });

    console.log('Sample quote created successfully:', sampleQuote);
  } catch (error) {
    console.error('Error creating sample quote:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleQuote();

















