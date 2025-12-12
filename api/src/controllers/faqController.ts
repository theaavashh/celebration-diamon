import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all FAQs (public)
export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany();
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get all FAQs (admin)
export const getAllFAQsAdmin = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany();
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Get FAQs admin error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }

    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Get FAQ by ID error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Create new FAQ
export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ success: false, error: 'Answer is required' });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim()
      }
    });

    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Update FAQ
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

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
        answer: answer.trim()
      }
    });

    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }

    await prisma.fAQ.delete({
      where: { id }
    });

    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

 




















