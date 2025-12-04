const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Allow requests from BOTH clients (main + admin) and allow credentials (cookies)
// This enables SSO across multiple applications
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000', 'http://localhost:5173'],
    credentials: true,
  })
);

// Serve static files (login page)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session with Mongo-backed store
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_dev_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: false, // set to true if using HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Health check endpoint (for Docker healthcheck)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'CAS SSO Server',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CAS server running on http://localhost:${PORT}`);
});
