"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDiamondCertificationStatus = exports.deleteDiamondCertification = exports.updateDiamondCertification = exports.createDiamondCertification = exports.getDiamondCertificationById = exports.getAllDiamondCertificationsAdmin = exports.getAllDiamondCertifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllDiamondCertifications = async (req, res) => {
    try {
        const diamondCertifications = await prisma.diamondCertification.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(diamondCertifications);
    }
    catch (error) {
        console.error('Get diamond certifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllDiamondCertifications = getAllDiamondCertifications;
const getAllDiamondCertificationsAdmin = async (req, res) => {
    try {
        const diamondCertifications = await prisma.diamondCertification.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(diamondCertifications);
    }
    catch (error) {
        console.error('Get diamond certifications admin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllDiamondCertificationsAdmin = getAllDiamondCertificationsAdmin;
const getDiamondCertificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const diamondCertification = await prisma.diamondCertification.findUnique({
            where: { id }
        });
        if (!diamondCertification) {
            return res.status(404).json({ error: 'Diamond certification not found' });
        }
        res.json(diamondCertification);
    }
    catch (error) {
        console.error('Get diamond certification by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getDiamondCertificationById = getDiamondCertificationById;
const createDiamondCertification = async (req, res) => {
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
    }
    catch (error) {
        console.error('Create diamond certification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createDiamondCertification = createDiamondCertification;
const updateDiamondCertification = async (req, res) => {
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
    }
    catch (error) {
        console.error('Update diamond certification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateDiamondCertification = updateDiamondCertification;
const deleteDiamondCertification = async (req, res) => {
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
    }
    catch (error) {
        console.error('Delete diamond certification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteDiamondCertification = deleteDiamondCertification;
const toggleDiamondCertificationStatus = async (req, res) => {
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
    }
    catch (error) {
        console.error('Toggle diamond certification status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleDiamondCertificationStatus = toggleDiamondCertificationStatus;
//# sourceMappingURL=diamondCertificationController.js.map