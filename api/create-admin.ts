import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'deepashahi@celebrationdiamon.com';
    const password = 'deepashahi123';
    const fullname = 'Deepa Shahi';
    const username = 'deepashahi';

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('Admin with this email already exists!');
      console.log('Updating password...');
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Update existing admin
      const updatedAdmin = await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword }
      });
      
      console.log('Admin password updated successfully!');
      console.log('Email:', updatedAdmin.email);
      console.log('Username:', updatedAdmin.username);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        fullname,
        username,
        email,
        password: hashedPassword,
        role: 'admin',
        isActive: true
      }
    });

    console.log('Admin created successfully!');
    console.log('ID:', admin.id);
    console.log('Full name:', admin.fullname);
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password: deepashahi123');
    console.log('Role:', admin.role);
    console.log('Status:', admin.isActive ? 'Active' : 'Inactive');
    
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

