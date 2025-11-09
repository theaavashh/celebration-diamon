import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createRetailerAdmin() {
  try {
    const email = 'admin@retailer.com';
    const password = 'admin123';
    const fullname = 'Retailer Admin';
    const username = 'retailer_admin';

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingAdmin) {
      console.log('Retailer admin with this email or username already exists!');
      console.log('Updating password...');
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Update existing admin
      const updatedAdmin = await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { 
          password: hashedPassword,
          role: 'retailer_admin',
          isActive: true
        }
      });
      
      console.log('Retailer admin password updated successfully!');
      console.log('ID:', updatedAdmin.id);
      console.log('Full name:', updatedAdmin.fullname);
      console.log('Username:', updatedAdmin.username);
      console.log('Email:', updatedAdmin.email);
      console.log('Password:', password);
      console.log('Role:', updatedAdmin.role);
      console.log('Status:', updatedAdmin.isActive ? 'Active' : 'Inactive');
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create retailer admin
    const admin = await prisma.admin.create({
      data: {
        fullname,
        username,
        email,
        password: hashedPassword,
        role: 'retailer_admin',
        isActive: true
      }
    });

    console.log('Retailer admin created successfully!');
    console.log('ID:', admin.id);
    console.log('Full name:', admin.fullname);
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password:', password);
    console.log('Role:', admin.role);
    console.log('Status:', admin.isActive ? 'Active' : 'Inactive');
    console.log('\nYou can now use these credentials to login to the Retailer Admin Portal.');
    
  } catch (error) {
    console.error('Error creating retailer admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createRetailerAdmin();







