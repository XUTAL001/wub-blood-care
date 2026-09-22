/**
 * WUB BloodConnect - Notification Routes
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, notificationController.getNotifications);
router.put('/:id/read', requireAuth, notificationController.markNotificationRead);
router.put('/read-all', requireAuth, notificationController.markAllNotificationsRead);

module.exports = router;
