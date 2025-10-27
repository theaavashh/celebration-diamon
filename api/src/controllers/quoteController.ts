import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all quotes (public)
export const getAllQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(quotes);
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all quotes (admin)
export const getAllQuotesAdmin = async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(quotes);
  } catch (error) {
    console.error('Get quotes admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get quote by ID
export const getQuoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quote = await prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Get quote by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new quote
export const createQuote = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update quote
export const updateQuote = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete quote
export const deleteQuote = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle quote status
export const toggleQuoteStatus = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Toggle quote status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

















