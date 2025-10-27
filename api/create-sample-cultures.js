const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleCultures() {
  try {
    console.log('Creating sample cultures...');

    const cultures = [
      {
        name: "Newari",
        title: "Explore Our Culture Collection",
        subtitle: "Discover the rich traditions and exquisite craftsmanship of Himalayan cultures",
        description: "Ancient traditions of the Kathmandu Valley",
        ctaText: "EXPLORE →",
        ctaLink: "/cultures/newari",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        isActive: true,
        sortOrder: 0
      },
      {
        name: "Bhutanese",
        title: "Explore Our Culture Collection",
        subtitle: "Discover the rich traditions and exquisite craftsmanship of Himalayan cultures",
        description: "Sacred symbols and spiritual elegance",
        ctaText: "EXPLORE →",
        ctaLink: "/cultures/bhutanese",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        isActive: true,
        sortOrder: 1
      },
      {
        name: "Tamang",
        title: "Explore Our Culture Collection",
        subtitle: "Discover the rich traditions and exquisite craftsmanship of Himalayan cultures",
        description: "Mountain heritage and tribal artistry",
        ctaText: "EXPLORE →",
        ctaLink: "/cultures/tamang",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        isActive: true,
        sortOrder: 2
      }
    ];

    for (const cultureData of cultures) {
      const culture = await prisma.culture.create({
        data: cultureData
      });
      console.log(`Created culture: ${culture.name}`);
    }

    console.log('Sample cultures created successfully!');
  } catch (error) {
    console.error('Error creating sample cultures:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleCultures();

















