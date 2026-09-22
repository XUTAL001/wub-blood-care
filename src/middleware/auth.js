/**
 * WUB BloodConnect - Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const db = require('../database/db');

async function requireAuth(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user not found.'
      });
    }

    const user = result.rows[0];

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by administration. Contact WUB Health Office.'
      });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
}

async function optionalAuth(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
      if (result.rows.length > 0 && result.rows[0].status === 'active') {
        req.user = result.rows[0];
      }
    }
  } catch (ignored) {
    // Optional auth silently proceeds
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};
