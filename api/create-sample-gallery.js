const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleGallery() {
  try {
    console.log('Creating sample gallery...');

    const sampleGallery = await prisma.gallery.create({
      data: {
        title: "Gallery",
        subtitle: "Discover the art of mindful living through our curated collection of peaceful moments.",
        isActive: true,
        sortOrder: 0,
        galleryItems: {
          create: [
            {
              title: "Moments of Tranquility",
              imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              description: "Experience the serene beauty of carefully crafted jewelry pieces that bring peace and tranquility to your moments.",
              sortOrder: 1,
              isActive: true
            },
            {
              title: "Natural Elegance",
              imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              description: "Embrace the natural elegance of precious stones and metals, harmoniously combined to create timeless pieces.",
              sortOrder: 2,
              isActive: true
            },
            {
              title: "Personal Wellness",
              imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
              description: "Celebrate personal wellness with jewelry that reflects your inner beauty and brings joy to your daily life.",
              sortOrder: 3,
              isActive: true
            }
          ]
        }
      },
      include: {
        galleryItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('Sample gallery created successfully:', sampleGallery);
  } catch (error) {
    console.error('Error creating sample gallery:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleGallery();

















