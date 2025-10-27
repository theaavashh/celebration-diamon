import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all FAQs (public)
export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all FAQs (admin)
export const getAllFAQsAdmin = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQs admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get FAQ by ID
export const getFAQById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json(faq);
  } catch (error) {
    console.error('Get FAQ by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new FAQ
export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer, category, isActive, sortOrder } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ error: 'Answer is required' });
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

    res.status(201).json(faq);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update FAQ
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, category, isActive, sortOrder } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
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

    res.json(faq);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete FAQ
export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await prisma.fAQ.delete({
      where: { id }
    });

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle FAQ status
export const toggleFAQStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        isActive: !existingFAQ.isActive
      }
    });

    res.json(faq);
  } catch (error) {
    console.error('Toggle FAQ status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

















