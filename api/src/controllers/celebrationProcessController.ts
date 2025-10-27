import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all celebration processes (public)
export const getAllCelebrationProcesses = async (req: Request, res: Response) => {
  try {
    const celebrationProcesses = await prisma.celebrationProcess.findMany({
      where: { isActive: true },
      include: {
        steps: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(celebrationProcesses);
  } catch (error) {
    console.error('Get celebration processes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all celebration processes (admin)
export const getAllCelebrationProcessesAdmin = async (req: Request, res: Response) => {
  try {
    const celebrationProcesses = await prisma.celebrationProcess.findMany({
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(celebrationProcesses);
  } catch (error) {
    console.error('Get celebration processes admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get celebration process by ID
export const getCelebrationProcessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const celebrationProcess = await prisma.celebrationProcess.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!celebrationProcess) {
      return res.status(404).json({ error: 'Celebration process not found' });
    }

    res.json(celebrationProcess);
  } catch (error) {
    console.error('Get celebration process by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new celebration process
export const createCelebrationProcess = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, isActive, sortOrder, steps } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const celebrationProcess = await prisma.celebrationProcess.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        steps: steps ? {
          create: steps.map((step: any, index: number) => ({
            title: step.title.trim(),
            description: step.description.trim(),
            icon: step.icon.trim(),
            order: step.order || index + 1,
            isActive: step.isActive !== undefined ? step.isActive : true
          }))
        } : undefined
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json(celebrationProcess);
  } catch (error) {
    console.error('Create celebration process error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update celebration process
export const updateCelebrationProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, isActive, sortOrder, steps } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const existingCelebrationProcess = await prisma.celebrationProcess.findUnique({
      where: { id }
    });

    if (!existingCelebrationProcess) {
      return res.status(404).json({ error: 'Celebration process not found' });
    }

    // Use transaction to update process and steps
    const celebrationProcess = await prisma.$transaction(async (tx) => {
      // Update the main process
      const updatedProcess = await tx.celebrationProcess.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          imageUrl: imageUrl?.trim() || null,
          isActive: isActive !== undefined ? isActive : existingCelebrationProcess.isActive,
          sortOrder: sortOrder !== undefined ? sortOrder : existingCelebrationProcess.sortOrder
        }
      });

      // Update steps if provided
      if (steps) {
        // Delete existing steps
        await tx.celebrationProcessStep.deleteMany({
          where: { celebrationProcessId: id }
        });

        // Create new steps
        await tx.celebrationProcessStep.createMany({
          data: steps.map((step: any, index: number) => ({
            celebrationProcessId: id,
            title: step.title.trim(),
            description: step.description.trim(),
            icon: step.icon.trim(),
            order: step.order || index + 1,
            isActive: step.isActive !== undefined ? step.isActive : true
          }))
        });
      }

      // Return the updated process with steps
      return await tx.celebrationProcess.findUnique({
        where: { id },
        include: {
          steps: {
            orderBy: { order: 'asc' }
          }
        }
      });
    });

    res.json(celebrationProcess);
  } catch (error) {
    console.error('Update celebration process error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete celebration process
export const deleteCelebrationProcess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCelebrationProcess = await prisma.celebrationProcess.findUnique({
      where: { id }
    });

    if (!existingCelebrationProcess) {
      return res.status(404).json({ error: 'Celebration process not found' });
    }

    await prisma.celebrationProcess.delete({
      where: { id }
    });

    res.json({ message: 'Celebration process deleted successfully' });
  } catch (error) {
    console.error('Delete celebration process error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle celebration process status
export const toggleCelebrationProcessStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCelebrationProcess = await prisma.celebrationProcess.findUnique({
      where: { id }
    });

    if (!existingCelebrationProcess) {
      return res.status(404).json({ error: 'Celebration process not found' });
    }

    const celebrationProcess = await prisma.celebrationProcess.update({
      where: { id },
      data: {
        isActive: !existingCelebrationProcess.isActive
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json(celebrationProcess);
  } catch (error) {
    console.error('Toggle celebration process status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

















