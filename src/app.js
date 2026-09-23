/**
 * WUB BloodConnect - Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Permit local SVG/inline assets and fonts
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Dynamic CORS to support tanviralamshifat.me, github.io, localhost & custom domains
const allowedOrigins = [
  'https://tanviralamshifat.me',
  'https://www.tanviralamshifat.me',
  'http://tanviralamshifat.me',
  'http://www.tanviralamshifat.me',
  'https://xutal001.github.io',
  'http://localhost:5000',
  'http://127.0.0.1:5500',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || config.CORS_ORIGIN === '*' || (config.CORS_ORIGIN && config.CORS_ORIGIN.split(',').map(s => s.trim()).includes(origin))) {
      return callback(null, true);
    }
    if (origin.endsWith('.github.io') || origin.endsWith('.onrender.com') || origin.endsWith('.tanviralamshifat.me')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting on API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests from this IP. Please try again in 15 minutes.' }
});
app.use('/api', apiLimiter);

// Serve uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'WUB BloodConnect',
    institution: 'World University of Bangladesh',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files
app.use(express.static(path.resolve(__dirname, '..')));

// Centralized error handler
app.use(errorHandler);

module.exports = app;
