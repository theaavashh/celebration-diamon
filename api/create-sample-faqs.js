const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleFAQs() {
  try {
    console.log('Creating sample FAQs...');

    const sampleFAQs = [
      {
        question: "Where is Celebration Diamonds located?",
        answer: "Celebration Diamonds is located in the heart of Kathmandu, Nepal. Our flagship store is situated in Thamel, the bustling tourist and cultural hub of the city. We also have a showroom in New Road, making it convenient for both locals and visitors to experience our exquisite jewelry collections.",
        category: "Location",
        isActive: true,
        sortOrder: 1
      },
      {
        question: "Do you provide certificates with your jewelry?",
        answer: "Yes, we provide comprehensive certificates with all our jewelry pieces. Every diamond in our collection comes with certification from the International Gemological Institute (IGI), guaranteeing the quality, authenticity, and value of your fine jewelry. Our certification process ensures that each diamond meets the highest standards of excellence.",
        category: "Certification",
        isActive: true,
        sortOrder: 2
      },
      {
        question: "Can I custom-make a jewelry design?",
        answer: "Absolutely! We specialize in custom jewelry design and offer a comprehensive consultation process. Our skilled artisans can bring your vision to life, whether it's a unique engagement ring, a special necklace, or any other jewelry piece. We work closely with you throughout the design process to ensure your custom piece exceeds your expectations.",
        category: "Custom",
        isActive: true,
        sortOrder: 3
      },
      {
        question: "Do you ship outside Kathmandu or internationally?",
        answer: "Yes, we offer shipping services both within Nepal and internationally. For domestic shipping within Nepal, we provide secure and insured delivery to all major cities. For international shipping, we work with trusted courier services to ensure your jewelry arrives safely at its destination. All shipments are fully insured and tracked.",
        category: "Shipping",
        isActive: true,
        sortOrder: 4
      },
      {
        question: "How long does it take to make a custom piece?",
        answer: "The timeline for custom jewelry depends on the complexity of the design and the materials involved. Generally, custom pieces take between 2-4 weeks to complete. For more intricate designs or special gemstone sourcing, it may take up to 6-8 weeks. We'll provide you with a detailed timeline during the consultation process.",
        category: "Custom",
        isActive: true,
        sortOrder: 5
      },
      {
        question: "Is your store safe for high-value transactions?",
        answer: "Yes, our store is equipped with state-of-the-art security systems and follows strict security protocols for all transactions. We have secure vaults, 24/7 monitoring, and trained security personnel. Additionally, we offer various secure payment options including bank transfers, credit cards, and other verified payment methods to ensure your transaction is completely safe.",
        category: "Payment",
        isActive: true,
        sortOrder: 6
      }
    ];

    for (const faqData of sampleFAQs) {
      const faq = await prisma.fAQ.create({
        data: faqData
      });
      console.log('Created FAQ:', faq.question);
    }

    console.log('Sample FAQs created successfully!');
  } catch (error) {
    console.error('Error creating sample FAQs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleFAQs();

















