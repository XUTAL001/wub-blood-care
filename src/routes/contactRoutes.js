/**
 * WUB BloodConnect - Contact Workflow Routes
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAuth } = require('../middleware/auth');
const { requireVerified } = require('../middleware/rbac');
const antiScam = require('../middleware/antiScam');

router.post('/', requireAuth, requireVerified, antiScam, contactController.initiateContact);
router.post('/:id/respond', requireAuth, contactController.respondContact);
router.get('/my', requireAuth, contactController.getMyContacts);

module.exports = router;
