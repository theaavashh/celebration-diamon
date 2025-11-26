"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleQuoteStatus = exports.deleteQuote = exports.updateQuote = exports.createQuote = exports.getQuoteById = exports.getAllQuotesAdmin = exports.getAllQuotes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllQuotes = async (req, res) => {
    try {
        const quotes = await prisma.quote.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(quotes);
    }
    catch (error) {
        console.error('Get quotes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllQuotes = getAllQuotes;
const getAllQuotesAdmin = async (req, res) => {
    try {
        const quotes = await prisma.quote.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(quotes);
    }
    catch (error) {
        console.error('Get quotes admin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllQuotesAdmin = getAllQuotesAdmin;
const getQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await prisma.quote.findUnique({
            where: { id }
        });
        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        res.json(quote);
    }
    catch (error) {
        console.error('Get quote by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getQuoteById = getQuoteById;
const createQuote = async (req, res) => {
    try {
        const { text, author, isActive, sortOrder } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Quote text is required' });
        }
        const quote = await prisma.quote.create({
            data: {
                text: text.trim(),
                author: author?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                sortOrder: sortOrder || 0
            }
        });
        res.status(201).json(quote);
    }
    catch (error) {
        console.error('Create quote error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createQuote = createQuote;
const updateQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, author, isActive, sortOrder } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Quote text is required' });
        }
        const existingQuote = await prisma.quote.findUnique({
            where: { id }
        });
        if (!existingQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        const quote = await prisma.quote.update({
            where: { id },
            data: {
                text: text.trim(),
                author: author?.trim() || null,
                isActive: isActive !== undefined ? isActive : existingQuote.isActive,
                sortOrder: sortOrder !== undefined ? sortOrder : existingQuote.sortOrder
            }
        });
        res.json(quote);
    }
    catch (error) {
        console.error('Update quote error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateQuote = updateQuote;
const deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const existingQuote = await prisma.quote.findUnique({
            where: { id }
        });
        if (!existingQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        await prisma.quote.delete({
            where: { id }
        });
        res.json({ message: 'Quote deleted successfully' });
    }
    catch (error) {
        console.error('Delete quote error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteQuote = deleteQuote;
const toggleQuoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingQuote = await prisma.quote.findUnique({
            where: { id }
        });
        if (!existingQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }
        const quote = await prisma.quote.update({
            where: { id },
            data: {
                isActive: !existingQuote.isActive
            }
        });
        res.json(quote);
    }
    catch (error) {
        console.error('Toggle quote status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleQuoteStatus = toggleQuoteStatus;
//# sourceMappingURL=quoteController.js.map