/**
 * WUB BloodConnect - Notification Service
 */

const crypto = require('crypto');
const db = require('../database/db');

async function createNotification(userId, title, message, type = 'system', referenceId = null) {
  const notifId = `notif_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  await db.query(`
    INSERT INTO notifications (id, user_id, title, message, type, is_read, reference_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [notifId, userId, title, message, type, false, referenceId, new Date().toISOString()]);
  return notifId;
}

async function getUserNotifications(userId, limit = 20) {
  const result = await db.query(`
    SELECT * FROM notifications 
    WHERE user_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2
  `, [userId, limit]);
  return result.rows;
}

async function getUnreadCount(userId) {
  const result = await db.query(`
    SELECT * FROM notifications 
    WHERE user_id = $1 AND is_read = false
  `, [userId]);
  return result.rows.length;
}

async function markAsRead(id, userId) {
  await db.query(`
    UPDATE notifications 
    SET is_read = true 
    WHERE id = $1 AND user_id = $2
  `, [id, userId]);
}

async function markAllAsRead(userId) {
  await db.query(`
    UPDATE notifications 
    SET is_read = true 
    WHERE user_id = $1
  `, [userId]);
}

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
