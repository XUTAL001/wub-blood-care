/**
 * WUB BloodConnect - User & Profile Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const antiScam = require('../middleware/antiScam');

router.put('/profile', requireAuth, antiScam, userController.updateProfile);
router.post('/avatar', requireAuth, upload.single('avatar'), userController.uploadAvatar);
router.post('/verification', requireAuth, upload.single('id_card_document'), userController.submitVerification);
router.get('/verification/status', requireAuth, userController.getVerificationStatus);

module.exports = router;
