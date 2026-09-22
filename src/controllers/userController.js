/**
 * WUB BloodConnect - User & Profile Controller
 */

const crypto = require('crypto');
const db = require('../database/db');
const { createNotification } = require('../services/notificationService');
const { logAction } = require('../services/auditService');

// Update personal profile
async function updateProfile(req, res) {
  try {
    const { name, phone, blood_group, department, location, bio, avatar_url, availability, is_available } = req.body;
    const store = db.getStore();
    let profile = store.profiles.find(p => p.user_id === req.user.id);
    const user = store.users.find(u => u.id === req.user.id);

    if (user) {
      if (name) user.name = name.trim();
      if (phone) user.phone = phone.trim();
      if (blood_group) user.blood_group = blood_group;
      if (department) user.department = department;
      if (avatar_url) user.avatar_url = avatar_url;
      user.updated_at = new Date().toISOString();
    }

    if (!profile) {
      profile = {
        id: `prf_${req.user.id}`,
        user_id: req.user.id,
        dept_code: department || 'CSE',
        blood_group: blood_group || 'O+',
        location_name: location || 'Main Campus (Uttara)',
        availability: (availability || (is_available === false ? 'unavailable' : 'available')),
        bio: bio || 'WUB Student Member',
        avatar_url: avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.profiles.push(profile);
    } else {
      if (blood_group) profile.blood_group = blood_group;
      if (department) profile.dept_code = department;
      if (location) profile.location_name = location;
      if (bio !== undefined) profile.bio = bio;
      if (avatar_url) profile.avatar_url = avatar_url;
      if (availability) profile.availability = availability;
      if (is_available !== undefined) profile.availability = is_available ? 'available' : 'unavailable';
      profile.updated_at = new Date().toISOString();
    }

    // Also update donor profile if active
    const donor = store.donor_profiles.find(d => d.user_id === req.user.id);
    if (donor) {
      if (name) donor.name = name.trim();
      if (phone) donor.phone = phone.trim();
      if (department) donor.department = department;
      if (blood_group) donor.blood_group = blood_group;
      if (location) donor.location_name = location;
      if (availability) donor.availability = availability;
      if (is_available !== undefined) donor.availability = is_available ? 'available' : 'unavailable';
      if (avatar_url) donor.avatar_url = avatar_url;
      donor.updated_at = new Date().toISOString();
    }

    db.saveStore();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user,
      profile,
      donor
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
}

// Upload Avatar
async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const avatarUrl = `uploads/avatars/${req.file.filename}`;
    const store = db.getStore();
    const profile = store.profiles.find(p => p.user_id === req.user.id);

    if (profile) {
      profile.avatar_url = avatarUrl;
      profile.updated_at = new Date().toISOString();
      db.saveStore();
    }

    res.json({
      success: true,
      message: 'Profile photo updated.',
      avatarUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error uploading avatar.' });
  }
}

// Submit Student ID Verification Request
async function submitVerification(req, res) {
  try {
    const studentId = (req.body.student_id || req.user.student_id).trim();
    let docPath = null;

    if (req.file) {
      docPath = `uploads/documents/${req.file.filename}`;
    }

    const store = db.getStore();

    // Check if pending verification exists
    const existing = store.verification_requests.find(v => v.user_id === req.user.id && v.status === 'pending');
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending verification request under administrative review.'
      });
    }

    const verId = `ver_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const newRequest = {
      id: verId,
      user_id: req.user.id,
      student_id: studentId,
      id_card_document: docPath,
      status: 'pending',
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    };

    store.verification_requests.push(newRequest);
    db.saveStore();

    await createNotification(
      req.user.id,
      'Verification Submitted',
      'Your student ID verification document has been submitted for administrative review.',
      'verification',
      verId
    );

    await logAction(req.user.id, 'SUBMIT_VERIFICATION', 'VERIFICATION', verId, { student_id: studentId }, req.ip);

    res.status(201).json({
      success: true,
      message: 'Student ID verification request submitted successfully. The administration will verify your document shortly.',
      verification: newRequest
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ success: false, message: 'Server error submitting verification.' });
  }
}

// Get Verification Status
async function getVerificationStatus(req, res) {
  try {
    const store = db.getStore();
    const requests = store.verification_requests
      .filter(v => v.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const latest = requests[0];

    res.json({
      success: true,
      is_verified: req.user.is_verified,
      verification: latest || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching verification status.' });
  }
}

module.exports = {
  updateProfile,
  uploadAvatar,
  submitVerification,
  getVerificationStatus
};
