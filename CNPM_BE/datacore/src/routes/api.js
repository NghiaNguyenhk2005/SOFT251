const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Sync endpoint - Get all users
router.get('/users/sync', userController.syncUsers);

// Get user profile by ID (student_id, staff_id, or username)
router.get('/users/profile/:id', userController.getUserProfile);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HCMUT Datacore API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
