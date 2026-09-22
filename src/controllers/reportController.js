/**
 * WUB BloodConnect - Reports & Anti-Abuse Controller
 */

const crypto = require('crypto');
const db = require('../database/db');
const { logAction } = require('../services/auditService');

async function createReport(req, res) {
  try {
    const { reported_user_id, reported_request_id, report_type, description } = req.body;

    if (!report_type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Report type and description are required.'
      });
    }

    const reportId = `rep_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const store = db.getStore();

    const newReport = {
      id: reportId,
      reporter_id: req.user.id,
      reported_user_id: reported_user_id || null,
      reported_request_id: reported_request_id || null,
      report_type,
      description: description.trim(),
      status: 'pending',
      admin_notes: null,
      resolved_by: null,
      created_at: new Date().toISOString()
    };

    store.reports.push(newReport);
    db.saveStore();

    await logAction(req.user.id, 'SUBMIT_REPORT', 'REPORT', reportId, { report_type }, req.ip);

    res.status(201).json({
      success: true,
      message: 'Thank you for your report. The WUB Health Center administration will investigate promptly.',
      reportId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error submitting report.' });
  }
}

module.exports = {
  createReport
};
