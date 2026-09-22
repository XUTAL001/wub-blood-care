/**
 * WUB BloodConnect - Anti-Scam & Commercial Protection Middleware
 * Strictly prohibits blood selling, payment demands, commissions, or fraudulent requests
 */

const crypto = require('crypto');
const db = require('../database/db');

const FORBIDDEN_KEYWORDS = [
  'bkash',
  'nagad',
  'rocket',
  'upay',
  'taka',
  '৳',
  'bdt',
  'payment',
  'paid donor',
  'sell blood',
  'buy blood',
  'price',
  'cost',
  'fee',
  'remuneration',
  'commission',
  'cash',
  'money'
];

async function antiScamCheck(req, res, next) {
  const payloadStr = JSON.stringify(req.body || {}).toLowerCase();

  const foundKeyword = FORBIDDEN_KEYWORDS.find(keyword => {
    // Regex word boundary or direct match
    const regex = new RegExp(`(^|\\W)${keyword}(\\W|$)`, 'i');
    return regex.test(payloadStr);
  });

  if (foundKeyword) {
    // Log abuse report automatically
    try {
      const reporterId = req.user ? req.user.id : 'anonymous';
      await db.query(`
        INSERT INTO reports (id, reporter_id, reported_user_id, report_type, description, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        `rep_scam_${crypto.randomBytes(4).toString('hex')}`,
        reporterId,
        req.user ? req.user.id : null,
        'commercial_selling',
        `Automated filter blocked submission containing commercial/financial keyword: "${foundKeyword}"`,
        'investigating'
      ]);
    } catch (e) {
      // Non-blocking log
    }

    return res.status(400).json({
      success: false,
      message: 'Policy Violation: Blood donation at World University of Bangladesh must be 100% voluntary. Requests or offers involving payments, bKash/Nagad, cash, or blood selling are strictly prohibited.',
      prohibitedKeyword: foundKeyword
    });
  }

  next();
}

module.exports = antiScamCheck;
