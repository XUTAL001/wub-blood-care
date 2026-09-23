/**
 * WUB BloodConnect - Email & Alert Dispatcher Service
 * Supports SMTP (Gmail / Brevo / SendGrid / Custom SMTP) with safe fallback
 */

const config = require('../config/env');

let transporter = null;

// Initialize SMTP transporter if credentials exist
function getTransporter() {
  if (transporter) return transporter;
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    return null;
  }

  try {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT || 587,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
      }
    });
    return transporter;
  } catch (err) {
    console.error('ℹ [Email] Nodemailer not active or not installed:', err.message);
    return null;
  }
}

/**
 * Send an email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 * @param {string} text - Plain text fallback
 */
async function sendEmail({ to, subject, html, text }) {
  const mailer = getTransporter();

  if (!mailer) {
    // Graceful logging if SMTP is not configured
    console.log(`📨 [Email Alert Log] To: ${to} | Subject: "${subject}"`);
    return { success: true, simulated: true };
  }

  try {
    const info = await mailer.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      text: text || subject,
      html
    });
    console.log(`✔ [Email] Alert dispatched to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`✖ [Email] Delivery failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Emergency Blood Alert to matched donors
 */
async function sendEmergencyBloodAlert(donorEmail, donorName, requestDetails) {
  const subject = `🚨 URGENT: Blood Request for ${requestDetails.blood_group} at ${requestDetails.hospital_name || 'Hospital'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #dc2626; margin-top: 0;">WUB BloodCare — Emergency Blood Alert</h2>
      <p>Hello <strong>${donorName || 'Valued Donor'}</strong>,</p>
      <p>An urgent blood request matching your blood group (<strong>${requestDetails.blood_group}</strong>) has been requested in the WUB campus community.</p>
      
      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 14px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 4px 0;"><strong>Blood Group:</strong> ${requestDetails.blood_group}</p>
        <p style="margin: 4px 0;"><strong>Hospital / Location:</strong> ${requestDetails.hospital_name || requestDetails.location_name || 'Dhaka'}</p>
        <p style="margin: 4px 0;"><strong>Required By:</strong> ${requestDetails.needed_date || 'Urgent'}</p>
        <p style="margin: 4px 0;"><strong>Contact:</strong> ${requestDetails.contact_number || 'See platform'}</p>
      </div>

      <p>If you are available to donate, please check the platform:</p>
      <a href="https://tanviralamshifat.me/find-blood.html" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 10px 22px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Details & Respond</a>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="font-size: 12px; color: #64748b;">World University of Bangladesh — WUB Blood Donation Network</p>
    </div>
  `;

  return sendEmail({
    to: donorEmail,
    subject,
    html,
    text: `Emergency blood needed: ${requestDetails.blood_group} at ${requestDetails.hospital_name}. Visit https://tanviralamshifat.me to respond.`
  });
}

module.exports = {
  sendEmail,
  sendEmergencyBloodAlert
};
