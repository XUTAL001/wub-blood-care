/**
 * WUB BloodConnect - Secure Donor Contact Controller
 * Implements two-way consent-based contact workflow to protect student phone & email privacy
 */

const crypto = require('crypto');
const db = require('../database/db');
const { createNotification } = require('../services/notificationService');
const { logAction } = require('../services/auditService');

// INITIATE CONTACT REQUEST
async function initiateContact(req, res) {
  try {
    const { donor_user_id, request_id, message } = req.body;

    if (!donor_user_id) {
      return res.status(400).json({ success: false, message: 'Donor ID is required.' });
    }

    if (donor_user_id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot initiate a contact request to yourself.' });
    }

    const store = db.getStore();
    const donorUser = store.users.find(u => u.id === donor_user_id);
    if (!donorUser) {
      return res.status(404).json({ success: false, message: 'Donor not found.' });
    }

    // Check if already contacted
    const existing = store.contact_requests.find(c => 
      c.requester_id === req.user.id && 
      c.donor_id === donor_user_id && 
      c.status === 'initiated'
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A contact request is already pending with this donor.'
      });
    }

    const contactId = `cnt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const newContact = {
      id: contactId,
      request_id: request_id || null,
      requester_id: req.user.id,
      donor_id: donor_user_id,
      status: 'initiated',
      message: message || 'Hello, I saw your donor profile on WUB BloodConnect. Could you please let me know if you are available to donate?',
      responded_at: null,
      created_at: new Date().toISOString()
    };

    store.contact_requests.push(newContact);
    db.saveStore();

    // Notify donor of incoming contact request
    await createNotification(
      donor_user_id,
      'New Blood Donor Contact Request',
      `${req.user.name} has requested your contact details for voluntary blood donation. View your dashboard to accept or decline.`,
      'contact',
      contactId
    );

    await logAction(req.user.id, 'INITIATE_CONTACT', 'CONTACT', contactId, { donor_id: donor_user_id }, req.ip);

    res.status(201).json({
      success: true,
      message: 'Contact request sent to donor! Once they accept, their direct contact details will be unlocked for you.',
      contact: newContact
    });
  } catch (err) {
    console.error('Contact initiation error:', err);
    res.status(500).json({ success: false, message: 'Server error initiating contact.' });
  }
}

// RESPOND TO CONTACT REQUEST (Accept or Decline)
async function respondContact(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be "accept" or "decline".' });
    }

    const store = db.getStore();
    const contact = store.contact_requests.find(c => c.id === id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact request not found.' });
    }

    if (contact.donor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not the designated recipient of this contact request.' });
    }

    contact.status = action === 'accept' ? 'accepted' : 'declined';
    contact.responded_at = new Date().toISOString();
    db.saveStore();

    const requester = store.users.find(u => u.id === contact.requester_id);

    if (action === 'accept') {
      await createNotification(
        contact.requester_id,
        'Donor Accepted Your Contact Request!',
        `${req.user.name} has accepted your request. Phone: ${req.user.phone}, Email: ${req.user.email}.`,
        'contact',
        contact.id
      );
    } else {
      await createNotification(
        contact.requester_id,
        'Contact Request Declined',
        `The donor is currently unable to donate blood at this time. Please browse other available donors.`,
        'contact',
        contact.id
      );
    }

    await logAction(req.user.id, 'RESPOND_CONTACT', 'CONTACT', id, { action }, req.ip);

    res.json({
      success: true,
      message: `Contact request ${action === 'accept' ? 'accepted' : 'declined'}.`,
      contact
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error responding to contact request.' });
  }
}

// GET MY CONTACTS (Incoming & Outgoing)
async function getMyContacts(req, res) {
  try {
    const store = db.getStore();

    const incoming = store.contact_requests
      .filter(c => c.donor_id === req.user.id)
      .map(c => {
        const requester = store.users.find(u => u.id === c.requester_id);
        const isAccepted = c.status === 'accepted';
        return {
          ...c,
          partner_name: requester ? requester.name : 'WUB Student',
          partner_phone: isAccepted && requester ? requester.phone : null,
          partner_email: isAccepted && requester ? requester.email : null,
          direction: 'incoming'
        };
      });

    const outgoing = store.contact_requests
      .filter(c => c.requester_id === req.user.id)
      .map(c => {
        const donor = store.users.find(u => u.id === c.donor_id);
        const isAccepted = c.status === 'accepted';
        return {
          ...c,
          partner_name: donor ? donor.name : 'WUB Donor',
          partner_phone: isAccepted && donor ? donor.phone : null,
          partner_email: isAccepted && donor ? donor.email : null,
          direction: 'outgoing'
        };
      });

    res.json({
      success: true,
      incoming,
      outgoing
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving contacts.' });
  }
}

module.exports = {
  initiateContact,
  respondContact,
  getMyContacts
};
