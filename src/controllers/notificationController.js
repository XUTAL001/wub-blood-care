/**
 * WUB BloodConnect - Notifications Controller
 */

const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require('../services/notificationService');

async function getNotifications(req, res) {
  try {
    const list = await getUserNotifications(req.user.id);
    const unread = await getUnreadCount(req.user.id);

    res.json({
      success: true,
      unread_count: unread,
      notifications: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving notifications.' });
  }
}

async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    await markAsRead(id, req.user.id);
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error marking notification.' });
  }
}

async function markAllNotificationsRead(req, res) {
  try {
    await markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error marking notifications.' });
  }
}

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
};
