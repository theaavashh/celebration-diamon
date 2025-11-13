import { Request, Response } from 'express';
import prisma from '../config/database';

export const getFaqSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.fAQSectionSettings.findFirst();

    res.json({
      success: true,
      data: settings || {
        title: '',
        subtitle: '',
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ settings:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching FAQ settings'
    });
  }
};

export const updateFaqSettings = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, isActive = true } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const existingSettings = await prisma.fAQSectionSettings.findFirst();

    const updatedSettings = existingSettings
      ? await prisma.fAQSectionSettings.update({
          where: { id: existingSettings.id },
          data: {
            title: title.trim(),
            subtitle: subtitle?.trim() || null,
            isActive,
            updatedAt: new Date()
          }
        })
      : await prisma.fAQSectionSettings.create({
          data: {
            title: title.trim(),
            subtitle: subtitle?.trim() || null,
            isActive
          }
        });

    res.json({
      success: true,
      data: updatedSettings,
      message: 'FAQ settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating FAQ settings:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating FAQ settings'
    });
  }
};

