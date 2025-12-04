const User = require('../models/User');

// GET /api/users/sync - Sync all users
exports.syncUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-__v');
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// GET /api/users/profile/:id - Get user by student_id, staff_id, or username
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by student_id, staff_id, or username
    const user = await User.findOne({
      $or: [
        { student_id: id },
        { staff_id: id },
        { username: id }
      ]
    }).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with identifier: ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message
    });
  }
};
