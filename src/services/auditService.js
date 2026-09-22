/**
 * WUB BloodConnect - Audit Logging Service
 */

const crypto = require('crypto');
const db = require('../database/db');

async function logAction(actorId, action, targetType, targetId, details = {}, ip = '127.0.0.1') {
  try {
    const logId = `aud_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    await db.query(`
      INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, details, ip_address, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [logId, actorId, action, targetType, targetId, JSON.stringify(details), ip, new Date().toISOString()]);
  } catch (err) {
    console.error('[AUDIT ERROR]', err.message);
  }
}

async function getRecentLogs(limit = 50) {
  const result = await db.query(`
    SELECT a.*, u.name as actor_name, u.email as actor_email, u.role as actor_role
    FROM audit_logs a
    LEFT JOIN users u ON a.actor_id = u.id
    ORDER BY a.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
}

module.exports = {
  logAction,
  getRecentLogs
};
