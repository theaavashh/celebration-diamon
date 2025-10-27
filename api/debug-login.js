const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugLogin() {
  try {
    const email = 'aavash.ganeju@gmail.com';
    const password = 'admin123';

    console.log('🔍 Debugging login...\n');

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      
      // Try case variations
      const allAdmins = await prisma.admin.findMany({
        select: { email: true, username: true }
      });
      console.log('Available admins:', allAdmins);
      return;
    }

    console.log('✅ Admin found:', admin.username);
    console.log('Email:', admin.email);
    console.log('Email in DB:', admin.email);
    console.log('Looking for:', email);
    console.log('Match:', admin.email.toLowerCase() === email.toLowerCase());

    // Try password comparison with debug
    console.log('\n🔑 Testing password...');
    console.log('Stored password hash:', admin.password.substring(0, 20) + '...');
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('\n✅ Password is valid! Login should work.');
      console.log('Try checking:');
      console.log('1. Email case sensitivity');
      console.log('2. Password has special characters that need escaping');
    } else {
      console.log('\n❌ Password is invalid');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();

