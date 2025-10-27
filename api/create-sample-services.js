const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleServices() {
  try {
    const sampleServices = [
      {
        title: 'In-house gemological lab',
        description: 'A store with its own lab to ensure the quality of the diamonds.',
        link: '/services/gemological-lab',
        isActive: true,
        sortOrder: 1
      },
      {
        title: 'Custom design services',
        description: 'From initial sketches to computer-aided design, we\'ll help you create the perfect diamond jewellery.',
        link: '/services/custom-design',
        isActive: true,
        sortOrder: 2
      },
      {
        title: 'Cleaning and maintenance',
        description: 'Provided complimentary cleaning and maintenance services to keep your jewellery looking its best.',
        link: '/services/cleaning-maintenance',
        isActive: true,
        sortOrder: 3
      },
      {
        title: 'Wedding Jewelry Planner',
        description: 'Ensure you have the perfect jewellery for your special day.',
        link: '/services/wedding-planner',
        isActive: true,
        sortOrder: 4
      },
      {
        title: 'Expert consultation',
        description: 'We\'ll help to decide through online consultation.',
        link: '/services/expert-consultation',
        isActive: true,
        sortOrder: 5
      },
      {
        title: 'Free Pick up service',
        description: 'From the store to your home or venue, we\'ll handle the delivery for you.',
        link: '/services/pickup-delivery',
        isActive: true,
        sortOrder: 6
      }
    ];

    for (const serviceData of sampleServices) {
      await prisma.service.create({
        data: serviceData
      });
    }
    
    console.log('✅ Sample services created successfully!');
    console.log('📋 Created Services:');
    sampleServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating sample services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleServices();


















