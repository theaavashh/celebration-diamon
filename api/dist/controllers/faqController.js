"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFAQStatus = exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.getFAQById = exports.getAllFAQsAdmin = exports.getAllFAQs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllFAQs = async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: faqs
        });
    }
    catch (error) {
        console.error('Get FAQs error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getAllFAQs = getAllFAQs;
const getAllFAQsAdmin = async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json({
            success: true,
            data: faqs
        });
    }
    catch (error) {
        console.error('Get FAQs admin error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getAllFAQsAdmin = getAllFAQsAdmin;
const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await prisma.fAQ.findUnique({
            where: { id }
        });
        if (!faq) {
            return res.status(404).json({ success: false, error: 'FAQ not found' });
        }
        res.json({
            success: true,
            data: faq
        });
    }
    catch (error) {
        console.error('Get FAQ by ID error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.getFAQById = getFAQById;
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category, isActive, sortOrder } = req.body;
        if (!question || question.trim() === '') {
            return res.status(400).json({ success: false, error: 'Question is required' });
        }
        if (!answer || answer.trim() === '') {
            return res.status(400).json({ success: false, error: 'Answer is required' });
        }
        const faq = await prisma.fAQ.create({
            data: {
                question: question.trim(),
                answer: answer.trim(),
                category: category?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                sortOrder: sortOrder || 0
            }
        });
        res.status(201).json({
            success: true,
            data: faq
        });
    }
    catch (error) {
        console.error('Create FAQ error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.createFAQ = createFAQ;
const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, category, isActive, sortOrder } = req.body;
        if (!question || question.trim() === '') {
            return res.status(400).json({ success: false, error: 'Question is required' });
        }
        if (!answer || answer.trim() === '') {
            return res.status(400).json({ success: false, error: 'Answer is required' });
        }
        const existingFAQ = await prisma.fAQ.findUnique({
            where: { id }
        });
        if (!existingFAQ) {
            return res.status(404).json({ success: false, error: 'FAQ not found' });
        }
        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                question: question.trim(),
                answer: answer.trim(),
                category: category?.trim() || null,
                isActive: isActive !== undefined ? isActive : existingFAQ.isActive,
                sortOrder: sortOrder !== undefined ? sortOrder : existingFAQ.sortOrder
            }
        });
        res.json({
            success: true,
            data: faq
        });
    }
    catch (error) {
        console.error('Update FAQ error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.updateFAQ = updateFAQ;
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const existingFAQ = await prisma.fAQ.findUnique({
            where: { id }
        });
        if (!existingFAQ) {
            return res.status(404).json({ success: false, error: 'FAQ not found' });
        }
        await prisma.fAQ.delete({
            where: { id }
        });
        res.json({ success: true, message: 'FAQ deleted successfully' });
    }
    catch (error) {
        console.error('Delete FAQ error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.deleteFAQ = deleteFAQ;
const toggleFAQStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingFAQ = await prisma.fAQ.findUnique({
            where: { id }
        });
        if (!existingFAQ) {
            return res.status(404).json({ success: false, error: 'FAQ not found' });
        }
        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                isActive: !existingFAQ.isActive
            }
        });
        res.json({
            success: true,
            data: faq
        });
    }
    catch (error) {
        console.error('Toggle FAQ status error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.toggleFAQStatus = toggleFAQStatus;
//# sourceMappingURL=faqController.js.map