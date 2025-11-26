"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTeamMemberStatus = exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getTeamMembers = exports.upsertAboutUs = exports.getAdminAboutUs = exports.getAboutUs = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAboutUs = async (req, res) => {
    try {
        const aboutUs = await database_1.default.aboutUs.findFirst({
            where: { isActive: true },
            include: {}
        });
        if (!aboutUs) {
            return res.status(404).json({
                success: false,
                message: 'About Us content not found'
            });
        }
        const teamMembers = await database_1.default.teamMember.findMany({
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
    }
    catch (error) {
        console.error('Error fetching About Us:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch About Us content',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAboutUs = getAboutUs;
const getAdminAboutUs = async (req, res) => {
    try {
        const aboutUs = await database_1.default.aboutUs.findFirst();
        const teamMembers = await database_1.default.teamMember.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: {
                aboutUs: aboutUs || null,
                teamMembers
            }
        });
    }
    catch (error) {
        console.error('Error fetching About Us:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch About Us content',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAdminAboutUs = getAdminAboutUs;
const upsertAboutUs = async (req, res) => {
    try {
        const { heroTitle, heroSubtitle, storyTitle, storyContent, storyImageUrl, missionTitle, missionContent, visionTitle, visionContent, values, whyChooseUs, milestones, contactLocation, contactPhone, contactEmail, isActive } = req.body;
        const imageUrl = req.file ? `/uploads/about-us/${req.file.filename}` : storyImageUrl;
        const existing = await database_1.default.aboutUs.findFirst();
        let aboutUs;
        if (existing) {
            aboutUs = await database_1.default.aboutUs.update({
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
        }
        else {
            aboutUs = await database_1.default.aboutUs.create({
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
    }
    catch (error) {
        console.error('Error saving About Us:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save About Us content',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.upsertAboutUs = upsertAboutUs;
const getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await database_1.default.teamMember.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: teamMembers
        });
    }
    catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team members',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getTeamMembers = getTeamMembers;
const createTeamMember = async (req, res) => {
    try {
        const { name, role, bio, imageUrl, email, linkedin, sortOrder, isActive } = req.body;
        const memberImageUrl = req.file ? `/uploads/about-us/${req.file.filename}` : imageUrl;
        const teamMember = await database_1.default.teamMember.create({
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
    }
    catch (error) {
        console.error('Error creating team member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create team member',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createTeamMember = createTeamMember;
const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, bio, imageUrl, email, linkedin, sortOrder, isActive } = req.body;
        const memberImageUrl = req.file ? `/uploads/about-us/${req.file.filename}` : imageUrl;
        const teamMember = await database_1.default.teamMember.update({
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
    }
    catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update team member',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateTeamMember = updateTeamMember;
const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.teamMember.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Team member deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete team member',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteTeamMember = deleteTeamMember;
const toggleTeamMemberStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await database_1.default.teamMember.findUnique({
            where: { id }
        });
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }
        const updated = await database_1.default.teamMember.update({
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
    }
    catch (error) {
        console.error('Error toggling team member status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update team member status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleTeamMemberStatus = toggleTeamMemberStatus;
//# sourceMappingURL=aboutUsController.js.map