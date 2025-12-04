const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// Main initialization function
const initDB = async () => {
  try {
    // Load pre-transformed data from datacore_users.json
    const dataPath = path.join(__dirname, '../data/datacore_users.json');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`);
    }
    
    const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Check if database already has data
    const existingCount = await User.countDocuments();
    
    if (existingCount > 0) {
      console.log('Database already initialized with', existingCount, 'users');
      return;
    }

    await User.insertMany(usersData);
    console.log(`Database initialized successfully!`);
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = initDB;
