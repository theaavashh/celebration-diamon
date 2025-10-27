const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'aavash.ganeju@gmail.com';
    const password = 'admin123';

    console.log('Testing login with:', { email, password });

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (admin) {
      console.log('Admin details:', {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        isActive: admin.isActive,
        passwordHash: admin.password.substring(0, 20) + '...'
      });

      // Check if admin is active
      if (!admin.isActive) {
        console.log('❌ Account is deactivated');
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      console.log('Password valid:', isPasswordValid);

      if (isPasswordValid) {
        console.log('✅ Login would be successful');
      } else {
        console.log('❌ Password is invalid');
      }
    } else {
      console.log('❌ Admin not found with email:', email);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();

