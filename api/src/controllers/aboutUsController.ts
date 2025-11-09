import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

// Get About Us content (public - only active)
export const getAboutUs = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const aboutUs = await prisma.aboutUs.findFirst({
      where: { isActive: true },
      include: {
        // Note: Team members are separate, we'll fetch them separately
      }
    });

    if (!aboutUs) {
      return res.status(404).json({
        success: false,
        message: 'About Us content not found'
      });
    }

    // Get active team members
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: {
        ...aboutUs,
        teamMembers
      }
    });
  } catch (error) {
    console.error('Error fetching About Us:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch About Us content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get About Us content (admin - all)
export const getAdminAboutUs = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const aboutUs = await prisma.aboutUs.findFirst();
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: {
        aboutUs: aboutUs || null,
        teamMembers
      }
    });
  } catch (error) {
    console.error('Error fetching About Us:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch About Us content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create or Update About Us content
export const upsertAboutUs = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const {
      heroTitle,
      heroSubtitle,
      storyTitle,
      storyContent,
      storyImageUrl,
      missionTitle,
      missionContent,
      visionTitle,
      visionContent,
      values,
      whyChooseUs,
      milestones,
      contactLocation,
      contactPhone,
      contactEmail,
      isActive
    } = req.body;

    // Handle image upload
    const imageUrl = req.file ? `/uploads/about-us/${req.file.filename}` : storyImageUrl;

    // Check if AboutUs exists
    const existing = await prisma.aboutUs.findFirst();

    let aboutUs;
    if (existing) {
      // Update existing
      aboutUs = await prisma.aboutUs.update({
        where: { id: existing.id },
        data: {
          heroTitle,
          heroSubtitle,
          storyTitle,
          storyContent,
          storyImageUrl: imageUrl,
          missionTitle,
          missionContent,
          visionTitle,
          visionContent,
          values: values ? JSON.parse(JSON.stringify(values)) : null,
          whyChooseUs: whyChooseUs ? JSON.parse(JSON.stringify(whyChooseUs)) : null,
          milestones: milestones ? JSON.parse(JSON.stringify(milestones)) : null,
          contactLocation,
          contactPhone,
          contactEmail,
          isActive: isActive !== undefined ? isActive : true
        }
      });
    } else {
      // Create new
      aboutUs = await prisma.aboutUs.create({
        data: {
          heroTitle,
          heroSubtitle,
          storyTitle,
          storyContent,
          storyImageUrl: imageUrl,
          missionTitle,
          missionContent,
          visionTitle,
          visionContent,
          values: values ? JSON.parse(JSON.stringify(values)) : null,
          whyChooseUs: whyChooseUs ? JSON.parse(JSON.stringify(whyChooseUs)) : null,
          milestones: milestones ? JSON.parse(JSON.stringify(milestones)) : null,
          contactLocation,
          contactPhone,
          contactEmail,
          isActive: isActive !== undefined ? isActive : true
        }
      });
    }

    res.json({
      success: true,
      message: existing ? 'About Us updated successfully' : 'About Us created successfully',
      data: aboutUs
    });
  } catch (error) {
    console.error('Error saving About Us:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save About Us content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all team members (admin)
export const getTeamMembers = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create team member
export const createTeamMember = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { name, role, bio, imageUrl, email, linkedin, sortOrder, isActive } = req.body;
    
    // Handle image upload
    const memberImageUrl = req.file ? `/uploads/about-us/${req.file.filename}` : imageUrl;

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        imageUrl: memberImageUrl,
        email,
        linkedin,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create team member',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update team member
export const updateTeamMember = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;
    const { name, role, bio, imageUrl, email, linkedin, sortOrder, isActive } = req.body;
    
    // Handle image upload
    const memberImageUrl = req.file ? `/uploads/about-us/${req.file.filename}` : imageUrl;

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        bio,
        imageUrl: memberImageUrl,
        email,
        linkedin,
        sortOrder,
        isActive
      }
    });

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team member',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete team member
export const deleteTeamMember = async (req: Request, res: Response<ApiResponse<void>>) => {
  try {
    const { id } = req.params;

    await prisma.teamMember.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle team member status
export const toggleTeamMemberStatus = async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const { id } = req.params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        isActive: !teamMember.isActive
      }
    });

    res.json({
      success: true,
      message: 'Team member status updated',
      data: updated
    });
  } catch (error) {
    console.error('Error toggling team member status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team member status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

