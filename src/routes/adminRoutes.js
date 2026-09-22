/**
 * WUB BloodConnect - Admin Routes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All admin endpoints require at least moderator/admin privileges
router.use(requireAuth);
router.use(requireRole(['moderator', 'admin', 'super_admin']));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

router.get('/verifications', adminController.getVerificationQueue);
router.put('/verifications/:id/review', adminController.reviewVerification);

router.get('/donors', adminController.getDonorQueue);
router.put('/donors/:id/review', adminController.reviewDonor);

router.get('/requests', adminController.getAllRequests);
router.put('/requests/:id/review', adminController.reviewRequest);

router.get('/reports', adminController.getReports);
router.put('/reports/:id/resolve', adminController.resolveReport);

router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
