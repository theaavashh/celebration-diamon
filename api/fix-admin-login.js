const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAdminLogin() {
  try {
    console.log('🔧 Fixing admin login...\n');

    // First, delete the existing admin
    const deleted = await prisma.admin.deleteMany({
      where: {
        OR: [
          { email: 'aavash.ganeju@gmail.com' },
          { username: 'theaavashh' }
        ]
      }
    });
    
    console.log('Deleted existing admins:', deleted.count);

    // Create a fresh admin with hashed password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.admin.create({
      data: {
        fullname: 'Aavash Ganeju',
        username: 'theaavashh',
        email: 'aavash.ganeju@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    });

    console.log('✅ New admin created!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('ID:', admin.id);
    
    // Verify the password works
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password verification:', isValid ? '✅ Valid' : '❌ Invalid');
    
    console.log('\n✅ Login credentials:');
    console.log('Email:', admin.email);
    console.log('Password:', password);
    console.log('Role:', admin.role);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminLogin();

