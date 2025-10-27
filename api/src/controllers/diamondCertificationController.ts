import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all diamond certifications (public)
export const getAllDiamondCertifications = async (req: Request, res: Response) => {
  try {
    const diamondCertifications = await prisma.diamondCertification.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(diamondCertifications);
  } catch (error) {
    console.error('Get diamond certifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all diamond certifications (admin)
export const getAllDiamondCertificationsAdmin = async (req: Request, res: Response) => {
  try {
    const diamondCertifications = await prisma.diamondCertification.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(diamondCertifications);
  } catch (error) {
    console.error('Get diamond certifications admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get diamond certification by ID
export const getDiamondCertificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const diamondCertification = await prisma.diamondCertification.findUnique({
      where: { id }
    });

    if (!diamondCertification) {
      return res.status(404).json({ error: 'Diamond certification not found' });
    }

    res.json(diamondCertification);
  } catch (error) {
    console.error('Get diamond certification by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new diamond certification
export const createDiamondCertification = async (req: Request, res: Response) => {
  try {
    const { title, description, fullContent, ctaText, ctaLink, imageUrl, isActive, sortOrder } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!ctaText || ctaText.trim() === '') {
      return res.status(400).json({ error: 'CTA text is required' });
    }

    const diamondCertification = await prisma.diamondCertification.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        fullContent: fullContent || null,
        ctaText: ctaText.trim(),
        ctaLink: ctaLink?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json(diamondCertification);
  } catch (error) {
    console.error('Create diamond certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update diamond certification
export const updateDiamondCertification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, fullContent, ctaText, ctaLink, imageUrl, isActive, sortOrder } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!ctaText || ctaText.trim() === '') {
      return res.status(400).json({ error: 'CTA text is required' });
    }

    const existingDiamondCertification = await prisma.diamondCertification.findUnique({
      where: { id }
    });

    if (!existingDiamondCertification) {
      return res.status(404).json({ error: 'Diamond certification not found' });
    }

    const diamondCertification = await prisma.diamondCertification.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        fullContent: fullContent || null,
        ctaText: ctaText.trim(),
        ctaLink: ctaLink?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive !== undefined ? isActive : existingDiamondCertification.isActive,
        sortOrder: sortOrder !== undefined ? sortOrder : existingDiamondCertification.sortOrder
      }
    });

    res.json(diamondCertification);
  } catch (error) {
    console.error('Update diamond certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete diamond certification
export const deleteDiamondCertification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingDiamondCertification = await prisma.diamondCertification.findUnique({
      where: { id }
    });

    if (!existingDiamondCertification) {
      return res.status(404).json({ error: 'Diamond certification not found' });
    }

    await prisma.diamondCertification.delete({
      where: { id }
    });

    res.json({ message: 'Diamond certification deleted successfully' });
  } catch (error) {
    console.error('Delete diamond certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle diamond certification status
export const toggleDiamondCertificationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingDiamondCertification = await prisma.diamondCertification.findUnique({
      where: { id }
    });

    if (!existingDiamondCertification) {
      return res.status(404).json({ error: 'Diamond certification not found' });
    }

    const diamondCertification = await prisma.diamondCertification.update({
      where: { id },
      data: {
        isActive: !existingDiamondCertification.isActive
      }
    });

    res.json(diamondCertification);
  } catch (error) {
    console.error('Toggle diamond certification status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
















