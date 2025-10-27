const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    const username = 'theaavashh';
    const email = 'aavash.ganeju@gmail.com';
    const password = 'admin123';

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email }
    });

    if (existingAdmin) {
      console.log('Found existing admin, updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update admin with new password
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          isActive: true
        }
      });
      
      console.log('✅ Admin password updated successfully!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
    } else {
      console.log('Admin not found, creating new admin...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create admin
      const admin = await prisma.admin.create({
        data: {
          fullname: 'Aavash Ganeju',
          username: username,
          email: email,
          password: hashedPassword,
          role: 'admin',
          isActive: true
        }
      });
      
      console.log('✅ Admin created successfully!');
      console.log('Username:', admin.username);
      console.log('Email:', admin.email);
    }

    console.log('\n✅ You can now login with:');
    console.log('Email:', email);
    console.log('Password:', password);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();

