/**
 * WUB BloodConnect - Donor Routes
 */

const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const antiScam = require('../middleware/antiScam');

router.get('/search', donorController.searchDonors);
router.post('/apply', optionalAuth, antiScam, donorController.applyDonor);
router.post('/availability/toggle', requireAuth, donorController.toggleAvailability);
router.get('/status', requireAuth, donorController.getDonorStatus);

module.exports = router;
