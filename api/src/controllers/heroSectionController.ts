import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllHeroSections = async (req: Request, res: Response) => {
  try {
    const heroSections = await prisma.heroSection.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: heroSections });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hero sections' });
  }
};

export const createHeroSection = async (req: Request, res: Response) => {
  try {
    const { 
      leftContentType, 
      rightContentType, 
      leftContent, 
      rightContent, 
      leftBg, 
      rightBg, 
      leftWidth 
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let leftContentValue = leftContent;
    if (leftContentType === 'image' && files?.['leftImage']?.[0]) {
      leftContentValue = `/uploads/hero-section/${files['leftImage'][0].filename}`;
    }

    let rightContentValue = rightContent;
    if (rightContentType === 'image' && files?.['rightImage']?.[0]) {
      rightContentValue = `/uploads/hero-section/${files['rightImage'][0].filename}`;
    }

    const heroSection = await prisma.heroSection.create({
      data: {
        leftContentType,
        rightContentType,
        leftContent: leftContentValue,
        rightContent: rightContentValue,
        leftBg,
        rightBg,
        leftWidth,
        isActive: true
      }
    });

    res.json({ success: true, data: heroSection });
  } catch (error) {
    console.error('Error creating hero section:', error);
    res.status(500).json({ success: false, message: 'Failed to create hero section' });
  }
};

export const updateHeroSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      leftContentType, 
      rightContentType, 
      leftContent, 
      rightContent, 
      leftBg, 
      rightBg, 
      leftWidth,
      isActive
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let leftContentValue = leftContent;
    if (leftContentType === 'image' && files?.['leftImage']?.[0]) {
      leftContentValue = `/uploads/hero-section/${files['leftImage'][0].filename}`;
    }

    let rightContentValue = rightContent;
    if (rightContentType === 'image' && files?.['rightImage']?.[0]) {
      rightContentValue = `/uploads/hero-section/${files['rightImage'][0].filename}`;
    }

    const heroSection = await prisma.heroSection.update({
      where: { id },
      data: {
        leftContentType,
        rightContentType,
        leftContent: leftContentValue,
        rightContent: rightContentValue,
        leftBg,
        rightBg,
        leftWidth,
        isActive: isActive !== undefined ? String(isActive) === 'true' : undefined
      }
    });

    res.json({ success: true, data: heroSection });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ success: false, message: 'Failed to update hero section' });
  }
};

export const deleteHeroSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.heroSection.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Hero section deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({ success: false, message: 'Failed to delete hero section' });
  }
};
