const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    required: true,
    enum: ['student', 'lecturer', 'researcher', 'staff']
  },
  student_id: {
    type: String,
    unique: true,
    sparse: true, // Allow null values, only unique when present
    match: /^[0-9]{7}$/
  },
  staff_id: {
    type: String,
    unique: true,
    sparse: true,
    match: /^[0-9]{6}$/
  },
  faculty: {
    type: String,
    default: null
  },
  department: {
    type: String,
    default: null
  },
  major: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for user_type (student_id and staff_id already have unique indexes)
userSchema.index({ user_type: 1 });

module.exports = mongoose.model('User', userSchema);
