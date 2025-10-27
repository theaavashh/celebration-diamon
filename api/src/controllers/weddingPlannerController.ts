import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all wedding planners (public)
export const getAllWeddingPlanners = async (req: Request, res: Response) => {
  try {
    const weddingPlanners = await prisma.weddingPlanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(weddingPlanners);
  } catch (error) {
    console.error('Get wedding planners error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all wedding planners (admin)
export const getAllWeddingPlannersAdmin = async (req: Request, res: Response) => {
  try {
    const weddingPlanners = await prisma.weddingPlanner.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(weddingPlanners);
  } catch (error) {
    console.error('Get wedding planners admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get wedding planner by ID
export const getWeddingPlannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const weddingPlanner = await prisma.weddingPlanner.findUnique({
      where: { id }
    });

    if (!weddingPlanner) {
      return res.status(404).json({ error: 'Wedding planner not found' });
    }

    res.json(weddingPlanner);
  } catch (error) {
    console.error('Get wedding planner by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new wedding planner
export const createWeddingPlanner = async (req: Request, res: Response) => {
  try {
    const { title, description, ctaText, ctaLink, imageUrl, badgeText, badgeSubtext, isActive, sortOrder } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!ctaText || ctaText.trim() === '') {
      return res.status(400).json({ error: 'CTA text is required' });
    }

    const weddingPlanner = await prisma.weddingPlanner.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        badgeText: badgeText?.trim() || null,
        badgeSubtext: badgeSubtext?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json(weddingPlanner);
  } catch (error) {
    console.error('Create wedding planner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update wedding planner
export const updateWeddingPlanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, ctaText, ctaLink, imageUrl, badgeText, badgeSubtext, isActive, sortOrder } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!ctaText || ctaText.trim() === '') {
      return res.status(400).json({ error: 'CTA text is required' });
    }

    const existingWeddingPlanner = await prisma.weddingPlanner.findUnique({
      where: { id }
    });

    if (!existingWeddingPlanner) {
      return res.status(404).json({ error: 'Wedding planner not found' });
    }

    const weddingPlanner = await prisma.weddingPlanner.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        badgeText: badgeText?.trim() || null,
        badgeSubtext: badgeSubtext?.trim() || null,
        isActive: isActive !== undefined ? isActive : existingWeddingPlanner.isActive,
        sortOrder: sortOrder !== undefined ? sortOrder : existingWeddingPlanner.sortOrder
      }
    });

    res.json(weddingPlanner);
  } catch (error) {
    console.error('Update wedding planner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete wedding planner
export const deleteWeddingPlanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingWeddingPlanner = await prisma.weddingPlanner.findUnique({
      where: { id }
    });

    if (!existingWeddingPlanner) {
      return res.status(404).json({ error: 'Wedding planner not found' });
    }

    await prisma.weddingPlanner.delete({
      where: { id }
    });

    res.json({ message: 'Wedding planner deleted successfully' });
  } catch (error) {
    console.error('Delete wedding planner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle wedding planner status
export const toggleWeddingPlannerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingWeddingPlanner = await prisma.weddingPlanner.findUnique({
      where: { id }
    });

    if (!existingWeddingPlanner) {
      return res.status(404).json({ error: 'Wedding planner not found' });
    }

    const weddingPlanner = await prisma.weddingPlanner.update({
      where: { id },
      data: {
        isActive: !existingWeddingPlanner.isActive
      }
    });

    res.json(weddingPlanner);
  } catch (error) {
    console.error('Toggle wedding planner status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

















