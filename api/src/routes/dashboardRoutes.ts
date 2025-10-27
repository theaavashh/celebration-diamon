import express from 'express';

const router = express.Router();

// Get dashboard data
router.get('/', async (_req, res) => {
  try {
    res.json({
      success: true,
      message: 'Dashboard endpoint',
      data: {
        stats: {},
        recent: []
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

export default router;



