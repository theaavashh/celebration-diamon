import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, Hero, CreateHeroRequest, UpdateHeroRequest } from '../types';

// Get all hero sections (public)
export const getAllHeroSections = async (req: Request, res: Response<ApiResponse<Hero[]>>) => {
  try {
    const heroSections = await prisma.hero.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: heroSections,
      count: heroSections.length
    });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero sections',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all hero sections (admin)
export const getAdminHeroSections = async (req: Request, res: Response<ApiResponse<Hero[]>>) => {
  try {
    const heroSections = await prisma.hero.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: heroSections,
      count: heroSections.length
    });
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero sections',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get hero section by ID
export const getHeroSectionById = async (req: Request, res: Response<ApiResponse<Hero>>) => {
  try {
    const { id } = req.params;
    const heroSection = await prisma.hero.findUnique({
      where: { id }
    });

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    res.json({
      success: true,
      data: heroSection
    });
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create hero section
export const createHeroSection = async (req: Request<{}, ApiResponse<Hero>, CreateHeroRequest>, res: Response<ApiResponse<Hero>>) => {
  try {
    const {
      heading,
      subHeading,
      ctaTitle,
      ctaLink,
      backgroundColor,
      textColor,
      imageAlignment,
      buttonBgColor,
      buttonTextColor,
      buttonRadius,
      isActive = true
    } = req.body;

    const isActiveBoolean = isActive === 'true' || isActive === true;

    // Get uploaded file path
    const imageUrl = req.file ? `/uploads/hero/${req.file.filename}` : null;

    const heroSection = await prisma.hero.create({
      data: {
        heading,
        subHeading: subHeading || null,
        ctaTitle: ctaTitle || null,
        ctaLink: ctaLink || null,
        imageUrl,
        backgroundColor: backgroundColor || null,
        textColor: textColor || null,
        imageAlignment: imageAlignment || 'left',
        buttonBgColor: buttonBgColor || null,
        buttonTextColor: buttonTextColor || null,
        buttonRadius: buttonRadius !== undefined ? Number(buttonRadius) : 9999,
        isActive: isActiveBoolean
      } as any
    });

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: heroSection
    });
  } catch (error) {
    console.error('Error creating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hero section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update hero section
export const updateHeroSection = async (req: Request<{ id: string }, ApiResponse<Hero>, UpdateHeroRequest>, res: Response<ApiResponse<Hero>>) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const isActiveBoolean = updateData.isActive === 'true' || updateData.isActive === true;

    // Get uploaded file path if new image is uploaded
    const imageUrl = req.file ? `/uploads/hero/${req.file.filename}` : updateData.imageUrl;

    const heroSection = await prisma.hero.update({
      where: { id },
      data: {
        ...updateData,
        subHeading: updateData.subHeading || null,
        ctaTitle: updateData.ctaTitle || null,
        ctaLink: updateData.ctaLink || null,
        imageUrl: imageUrl || null,
        backgroundColor: updateData.backgroundColor || null,
        textColor: updateData.textColor || null,
        imageAlignment: updateData.imageAlignment || 'left',
        buttonBgColor: updateData.buttonBgColor || null,
        buttonTextColor: updateData.buttonTextColor || null,
        buttonRadius: updateData.buttonRadius !== undefined ? Number(updateData.buttonRadius) : 9999,
        isActive: isActiveBoolean
      } as any
    });

    res.json({
      success: true,
      message: 'Hero section updated successfully',
      data: heroSection
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete hero section
export const deleteHeroSection = async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;

    await prisma.hero.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hero section',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle hero section status
export const toggleHeroSectionStatus = async (req: Request, res: Response<ApiResponse<Hero>>) => {
  try {
    const { id } = req.params;

    const heroSection = await prisma.hero.findUnique({
      where: { id }
    });

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    const updatedHeroSection = await prisma.hero.update({
      where: { id },
      data: { isActive: !heroSection.isActive }
    });

    res.json({
      success: true,
      message: `Hero section ${updatedHeroSection.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedHeroSection
    });
  } catch (error) {
    console.error('Error toggling hero section status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle hero section status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
