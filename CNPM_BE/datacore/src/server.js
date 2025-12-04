require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Root health check (for Docker healthcheck)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'HCMUT DATACORE',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nSIGTERM received. Shutting down...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

connectDB()

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
      console.log(`DATACORE server running on http://localhost:${PORT}`);

});
