/**
 * WUB BloodConnect - Blood Request Controller
 */

const crypto = require('crypto');
const db = require('../database/db');
const { notifyMatchingDonors, findMatchingDonors } = require('../services/matchingService');
const { createNotification } = require('../services/notificationService');
const { logAction } = require('../services/auditService');

// CREATE BLOOD REQUEST
async function createRequest(req, res) {
  try {
    const {
      patient_name,
      blood_group,
      units_needed,
      needed_date,
      needed_time,
      hospital_name,
      location_name,
      urgency_level,
      reason,
      additional_notes
    } = req.body;

    if (!patient_name || !blood_group || !needed_date || !hospital_name || !location_name) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Patient Name, Blood Group, Date, Hospital, Location).'
      });
    }

    const store = db.getStore();
    const requestId = `req_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    // Calculate expiration timestamp (needed_date + 24 hours)
    const neededDateObj = new Date(needed_date);
    const expiresAt = new Date(neededDateObj.getTime() + 48 * 3600000).toISOString();

    const newRequest = {
      id: requestId,
      requester_id: req.user.id,
      patient_name: patient_name.trim(),
      blood_group: blood_group.trim(),
      units_needed: parseInt(units_needed, 10) || 1,
      needed_date,
      needed_time: needed_time || 'Immediate / Flexible',
      hospital_name: hospital_name.trim(),
      location_name: location_name.trim(),
      urgency_level: urgency_level || 'normal',
      reason: reason || null,
      additional_notes: additional_notes || null,
      status: 'active',
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.blood_requests.push(newRequest);
    db.saveStore();

    // Confirmation notification to requester
    await createNotification(
      req.user.id,
      'Blood Request Published',
      `Your request for ${newRequest.blood_group} (${newRequest.units_needed} unit/s) at ${newRequest.hospital_name} is now active.`,
      'blood_request',
      requestId
    );

    // Notify matching available donors
    try {
      await notifyMatchingDonors(newRequest);
    } catch (e) {
      console.error('Matching notification error:', e);
    }

    await logAction(req.user.id, 'CREATE_BLOOD_REQUEST', 'REQUEST', requestId, { blood_group, urgency: urgency_level }, req.ip);

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully and broadcasted to matching WUB donors!',
      request: newRequest
    });
  } catch (err) {
    console.error('Blood request creation error:', err);
    res.status(500).json({ success: false, message: 'Server error creating blood request.' });
  }
}

// GET ACTIVE PUBLIC REQUESTS (Privacy Protected)
async function getActiveRequests(req, res) {
  try {
    const { blood_group, location, urgency } = req.query;
    const store = db.getStore();
    const now = new Date();

    let list = store.blood_requests.filter(r => {
      // Auto-expire requests past expiration date
      if (new Date(r.expires_at) < now && r.status === 'active') {
        r.status = 'expired';
      }

      if (r.status !== 'active') return false;
      if (blood_group && r.blood_group !== blood_group) return false;
      if (location && r.location_name !== location) return false;
      if (urgency && r.urgency_level !== urgency) return false;
      return true;
    });

    db.saveStore();

    // Sort by emergency first, then by creation date descending
    const urgencyWeight = { emergency: 4, high: 3, normal: 2, low: 1 };
    list.sort((a, b) => {
      const diff = (urgencyWeight[b.urgency_level] || 0) - (urgencyWeight[a.urgency_level] || 0);
      if (diff !== 0) return diff;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Mask sensitive requester data
    const sanitized = list.map(r => {
      const requester = store.users.find(u => u.id === r.requester_id);
      return {
        id: r.id,
        requester_name: requester ? requester.name : 'WUB Student',
        patient_name: r.patient_name,
        blood_group: r.blood_group,
        units_needed: r.units_needed,
        needed_date: r.needed_date,
        needed_time: r.needed_time,
        hospital_name: r.hospital_name,
        location_name: r.location_name,
        urgency_level: r.urgency_level,
        reason: r.reason,
        additional_notes: r.additional_notes,
        status: r.status,
        created_at: r.created_at
      };
    });

    res.json({
      success: true,
      count: sanitized.length,
      requests: sanitized
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching requests.' });
  }
}

// GET MY REQUESTS (For authenticated user dashboard)
async function getMyRequests(req, res) {
  try {
    const store = db.getStore();
    const myRequests = store.blood_requests
      .filter(r => r.requester_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (!store.request_matches) store.request_matches = [];

    // Attach match counts and actual responded donors
    const enriched = await Promise.all(myRequests.map(async r => {
      const matches = await findMatchingDonors(r);
      const responses = store.request_matches.filter(m => m.request_id === r.id);
      return {
        ...r,
        match_count: matches.length,
        responses: responses
      };
    }));

    res.json({
      success: true,
      requests: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching your requests.' });
  }
}

// GET REQUEST BY ID (With match list for owner or admin)
async function getRequestById(req, res) {
  try {
    const { id } = req.params;
    const store = db.getStore();
    const request = store.blood_requests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found.' });
    }

    const requester = store.users.find(u => u.id === request.requester_id);
    const isOwnerOrAdmin = req.user && (req.user.id === request.requester_id || ['admin', 'super_admin'].includes(req.user.role));

    if (!store.request_matches) store.request_matches = [];
    const responses = store.request_matches.filter(m => m.request_id === id);
    const matches = isOwnerOrAdmin ? await findMatchingDonors(request) : [];

    res.json({
      success: true,
      request: {
        ...request,
        requester_name: requester ? requester.name : 'WUB Student',
        requester_phone: isOwnerOrAdmin && requester ? requester.phone : null,
        requester_email: isOwnerOrAdmin && requester ? requester.email : null
      },
      matches,
      responses: isOwnerOrAdmin ? responses : []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching request details.' });
  }
}

// UPDATE REQUEST STATUS (Fulfill or Cancel)
async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const store = db.getStore();
    const request = store.blood_requests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isOwner = req.user.id === request.requester_id;
    const isAdmin = ['admin', 'super_admin', 'moderator'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this request.' });
    }

    const validStatuses = ['active', 'matched', 'contacted', 'fulfilled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid request status.' });
    }

    request.status = status;
    request.updated_at = new Date().toISOString();
    db.saveStore();

    await logAction(req.user.id, 'UPDATE_REQUEST_STATUS', 'REQUEST', id, { status }, req.ip);

    res.json({
      success: true,
      message: `Blood request status updated to: ${status.toUpperCase()}`,
      request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating request status.' });
  }
}

// RESPOND TO REQUEST ("I CAN DONATE")
async function respondCanDonate(req, res) {
  try {
    const { id } = req.params;
    const store = db.getStore();
    const request = store.blood_requests.find(r => r.id === id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found.' });
    }

    if (request.status === 'fulfilled' || request.status === 'cancelled' || request.status === 'expired') {
      return res.status(400).json({ success: false, message: `This blood request is already ${request.status}.` });
    }

    // Check donor identity
    const donorUser = store.users.find(u => u.id === req.user.id) || req.user;
    const donorProfile = store.profiles.find(p => p.user_id === req.user.id) || {};
    const donorRecord = store.donor_profiles.find(d => d.user_id === req.user.id) || {};

    if (!store.request_matches) {
      store.request_matches = [];
    }

    // Check if already responded
    const existing = store.request_matches.find(m => m.request_id === id && m.donor_id === req.user.id);
    if (existing && existing.status === 'accepted') {
      return res.status(200).json({
        success: true,
        message: 'You have already accepted and offered to donate for this request!',
        match: existing
      });
    }

    const donorName = donorUser.name || 'WUB Donor';
    const donorPhone = donorUser.phone || donorRecord.phone || 'Contact via BloodConnect';
    const donorBlood = donorRecord.blood_group || donorProfile.blood_group || donorUser.blood_group || 'Compatible';
    const donorDept = donorProfile.dept_code || donorRecord.department || donorUser.department || 'WUB';

    const matchId = existing ? existing.id : `match_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const matchData = {
      id: matchId,
      request_id: id,
      donor_id: req.user.id,
      donor_name: donorName,
      donor_phone: donorPhone,
      donor_blood_group: donorBlood,
      donor_department: donorDept,
      status: 'accepted',
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existing) {
      Object.assign(existing, matchData);
    } else {
      store.request_matches.push(matchData);
    }

    if (request.status === 'active') {
      request.status = 'matched';
      request.updated_at = new Date().toISOString();
    }

    db.saveStore();

    // Notify requester with donor's contact details
    await createNotification(
      request.requester_id,
      'Donor Found: I Can Donate! 🩸',
      `${donorName} (${donorBlood}, ${donorDept}) has volunteered to donate blood at ${request.hospital_name}. Call donor: ${donorPhone}`,
      'match_accepted',
      request.id
    );

    // Notify donor confirmation
    await createNotification(
      req.user.id,
      'Donation Commitment Recorded',
      `Thank you for volunteering to donate for ${request.patient_name} at ${request.hospital_name}. The requester has been notified with your contact details.`,
      'donation_commitment',
      request.id
    );

    await logAction(req.user.id, 'DONOR_RESPOND_CAN_DONATE', 'REQUEST', id, { donor_name: donorName }, req.ip);

    res.json({
      success: true,
      message: 'Thank you! Your willingness to donate has been recorded and the requester has been notified with your contact info.',
      match: matchData
    });
  } catch (err) {
    console.error('Respond can donate error:', err);
    res.status(500).json({ success: false, message: 'Server error registering donation response.' });
  }
}

module.exports = {
  createRequest,
  getActiveRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
  respondCanDonate
};

