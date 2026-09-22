/**
 * WUB BloodConnect - Auth Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const antiScam = require('../middleware/antiScam');

router.post('/register', antiScam, authController.register);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
