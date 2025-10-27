import express from 'express';

const router = express.Router();

// Get FAQ settings
router.get('/', async (_req, res) => {
  try {
    res.json({
      success: true,
      message: 'FAQ settings endpoint',
      data: {}
    });
  } catch (error) {
    console.error('Error fetching FAQ settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQ settings'
    });
  }
});

// Update FAQ settings
router.put('/', async (_req, res) => {
  try {
    res.json({
      success: true,
      message: 'FAQ settings updated',
      data: _req.body
    });
  } catch (error) {
    console.error('Error updating FAQ settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating FAQ settings'
    });
  }
});

export default router;



