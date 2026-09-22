/**
 * WUB BloodConnect - Blood Request Routes
 */

const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { requireVerified } = require('../middleware/rbac');
const antiScam = require('../middleware/antiScam');

// Anti-scam filter runs first so commercial scams are flagged and blocked immediately
router.post('/', requireAuth, antiScam, requireVerified, requestController.createRequest);
router.get('/', optionalAuth, requestController.getActiveRequests);
router.get('/my', requireAuth, requestController.getMyRequests);
router.get('/:id', optionalAuth, requestController.getRequestById);
router.put('/:id/status', requireAuth, requestController.updateRequestStatus);
router.post('/:id/respond', requireAuth, requestController.respondCanDonate);

module.exports = router;

