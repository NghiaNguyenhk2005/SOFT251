/**
 * Database Initialization
 * 
 * This module automatically seeds the database with default users
 * when the database is empty (first-time setup).
 */
const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Initialize database with default users if empty
 */
async function initDB() {
  try {
    // Load pre-transformed data from datacore_users.json
    const dataPath = path.join(__dirname, '../data/users.json');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`);
    }

    const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Check if database already has users
    const count = await User.countDocuments();
    
    if (count > 0) {
      console.log('Database already initialized with', count, 'users');
      return;
    }

    // Hash password once for all users (default: 'password')
    const hashedPassword = await bcrypt.hash('password', 10);

    const usersToCreate = [];

    for (const user of usersData) {
      usersToCreate.push({
        username: user.username,
        password: hashedPassword,
        email: user.email
      })
    }
    await User.insertMany(usersToCreate);
    console.log(`Database initialized successfully!`);

  } catch (error) {
    console.error('Database initialization failed:', error );
    throw error;
  }
}

module.exports = initDB;
