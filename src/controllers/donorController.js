/**
 * WUB BloodConnect - Donor Controller
 * Manages donor registration, availability toggles, and privacy-protected search
 */

const crypto = require('crypto');
const db = require('../database/db');
const { createNotification } = require('../services/notificationService');
const { logAction } = require('../services/auditService');

// SEARCH DONORS (Privacy-Aware)
async function searchDonors(req, res) {
  try {
    let { blood_group, location, department, availability, search } = req.query;
    if (blood_group) {
      blood_group = blood_group.replace(/\s+/g, '+').trim().toUpperCase();
    }
    const store = db.getStore();
    const isAuth = !!req.user;

    let results = [];

    for (const donor of store.donor_profiles) {
      // Only approved donors appear in public search
      if (donor.status !== 'approved') continue;

      // Filter by availability if requested (default to available)
      if (availability && donor.availability !== availability) continue;
      
      // Filter by blood group (case & plus sign insensitive)
      if (blood_group && blood_group !== 'SELECT BLOOD GROUP' && blood_group !== '') {
        const dBlood = (donor.blood_group || '').toUpperCase().replace(/\s+/g, '+');
        if (dBlood !== blood_group) continue;
      }
      
      // Filter by location (case & substring insensitive)
      if (location && !location.toLowerCase().includes('all') && !location.toLowerCase().includes('select')) {
        const dLoc = (donor.location_name || '').toLowerCase();
        const qLoc = location.toLowerCase().trim();
        if (!dLoc.includes(qLoc) && !qLoc.includes(dLoc)) continue;
      }

      const user = store.users.find(u => u.id === donor.user_id || u.student_id === donor.user_id || (u.phone && donor.phone && u.phone === donor.phone));
      if (user && user.status === 'suspended') continue;

      const profile = store.profiles.find(p => p.user_id === donor.user_id || (user && p.user_id === user.id)) || {};

      const userName = user ? user.name : (donor.name || 'WUB Student Donor');
      const userDept = profile.dept_code || (user ? user.department : '') || donor.department || 'WUB';
      const userPhone = user ? user.phone : (donor.phone || '01712345678');
      const userAvatar = profile.avatar_url || (user ? user.avatar_url : null) || donor.avatar_url || null;

      // Filter by department
      if (department && !department.toLowerCase().includes('all') && !department.toLowerCase().includes('select')) {
        const qDept = department.toLowerCase().trim();
        const dDept = userDept.toLowerCase();
        if (!dDept.includes(qDept) && !qDept.includes(dDept)) continue;
      }

      // Search keyword filter (name, department, location, blood group, student ID)
      if (search) {
        const q = search.trim().toLowerCase();
        const matchesName = userName.toLowerCase().includes(q);
        const matchesDept = userDept.toLowerCase().includes(q);
        const matchesLoc = (donor.location_name || '').toLowerCase().includes(q);
        const matchesBlood = (donor.blood_group || '').toLowerCase().includes(q);
        const matchesId = (user && user.student_id ? user.student_id.toLowerCase().includes(q) : false);
        if (!matchesName && !matchesDept && !matchesLoc && !matchesBlood && !matchesId) continue;
      }

      results.push({
        donor_id: donor.id,
        user_id: user ? user.id : donor.user_id,
        student_id: user ? (isAuth ? user.student_id : 'WUB-Verified') : null,
        name: userName,
        blood_group: donor.blood_group,
        department: userDept,
        location: donor.location_name,
        availability: donor.availability,
        donation_count: donor.donation_count || 0,
        last_donation_date: donor.last_donation_date,
        bio: profile.bio || 'WUB Student Donor',
        phone: isAuth ? userPhone : null,
        is_contact_protected: !isAuth,
        avatar_url: userAvatar
      });
    }

    res.json({
      success: true,
      count: results.length,
      donors: results
    });
  } catch (err) {
    console.error('Donor search error:', err);
    res.status(500).json({ success: false, message: 'Server error searching donors.' });
  }
}

// APPLY AS DONOR
async function applyDonor(req, res) {
  try {
    const { 
      blood_group, 
      location, 
      availability, 
      last_donation_date,
      name, 
      student_id, 
      studentId, 
      phone, 
      department, 
      dept 
    } = req.body;

    const stdId = student_id || studentId;
    const stdName = name;
    const stdDept = department || dept;
    const stdPhone = phone;

    if (!blood_group || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blood group and preferred campus/location.'
      });
    }

    const store = db.getStore();
    let targetUser = req.user;

    // If not authenticated, find or create student user record
    if (!targetUser) {
      if (!stdId || !stdName || !stdPhone) {
        return res.status(400).json({
          success: false,
          message: 'Please provide Full Name, Student ID, and Phone Number.'
        });
      }

      targetUser = store.users.find(u => 
        (u.student_id && u.student_id.toLowerCase() === stdId.toLowerCase()) || 
        (u.phone && u.phone === stdPhone)
      );

      if (!targetUser) {
        const newUserId = `usr_${stdId.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
        targetUser = {
          id: newUserId,
          student_id: stdId,
          name: stdName,
          email: `${stdId.toLowerCase()}@wub.edu.bd`,
          phone: stdPhone,
          role: 'student',
          status: 'active',
          is_verified: false,
          is_donor: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        store.users.push(targetUser);
      } else {
        targetUser.is_donor = true;
        if (stdName) targetUser.name = stdName;
        if (stdPhone) targetUser.phone = stdPhone;
        targetUser.updated_at = new Date().toISOString();
      }
    } else {
      targetUser.is_donor = true;
      targetUser.updated_at = new Date().toISOString();
    }

    // Check or update profile
    let profile = store.profiles.find(p => p.user_id === targetUser.id);
    if (!profile) {
      profile = {
        id: `prf_${targetUser.id}`,
        user_id: targetUser.id,
        dept_code: stdDept || 'CSE',
        blood_group: blood_group,
        location_name: location,
        donor_status: targetUser.is_verified ? 'approved' : 'pending',
        availability: availability || 'available',
        bio: 'WUB Student Donor',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.profiles.push(profile);
    } else {
      profile.blood_group = blood_group;
      profile.location_name = location;
      if (stdDept) profile.dept_code = stdDept;
      profile.donor_status = targetUser.is_verified ? 'approved' : 'pending';
      profile.availability = availability || 'available';
      if (last_donation_date) profile.last_donation_date = last_donation_date;
      profile.updated_at = new Date().toISOString();
    }

    // Check or create donor profile
    let donor = store.donor_profiles.find(d => 
      d.user_id === targetUser.id || 
      (targetUser.student_id && d.user_id === targetUser.student_id)
    );

    if (donor) {
      donor.blood_group = blood_group;
      donor.location_name = location;
      donor.availability = availability || 'available';
      if (last_donation_date) donor.last_donation_date = last_donation_date;
      if (targetUser.is_verified) donor.status = 'approved';
      donor.updated_at = new Date().toISOString();
    } else {
      const donorId = `dnr_${targetUser.student_id || targetUser.id}`;
      donor = {
        id: donorId,
        user_id: targetUser.id,
        name: targetUser.name,
        phone: targetUser.phone,
        department: profile.dept_code,
        blood_group,
        location_name: location,
        availability: availability || 'available',
        status: targetUser.is_verified ? 'approved' : 'pending',
        donation_count: 0,
        last_donation_date: last_donation_date || null,
        admin_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.donor_profiles.push(donor);
    }

    // If pending verification, queue a verification request
    if (!targetUser.is_verified) {
      let ver = store.verification_requests.find(v => v.user_id === targetUser.id || v.student_id === targetUser.student_id);
      if (!ver) {
        ver = {
          id: `ver_${targetUser.student_id || targetUser.id}`,
          user_id: targetUser.id,
          student_id: targetUser.student_id,
          id_card_document: null,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        store.verification_requests.push(ver);
      }
    }

    db.saveStore();

    const isAutoApproved = donor.status === 'approved';

    await createNotification(
      targetUser.id,
      isAutoApproved ? 'Donor Registration Approved!' : 'Donor Application Submitted',
      isAutoApproved 
        ? `You are now an active registered blood donor (${blood_group}) in the WUB Blood Network.`
        : 'Your application has been received. Once your student verification is completed by admin, your profile will be active in Find Blood.',
      'donor',
      donor.id
    );

    await logAction(targetUser.id, 'DONOR_APPLICATION', 'DONOR', donor.id, { blood_group, status: donor.status }, req.ip);

    res.status(201).json({
      success: true,
      message: isAutoApproved 
        ? 'Congratulations! You are now an active registered donor.' 
        : 'Donor application submitted. Awaiting verification review.',
      donor
    });
  } catch (err) {
    console.error('Donor application error:', err);
    res.status(500).json({ success: false, message: 'Server error processing donor registration.' });
  }
}

// TOGGLE AVAILABILITY
async function toggleAvailability(req, res) {
  try {
    const store = db.getStore();
    const donor = store.donor_profiles.find(d => d.user_id === req.user.id);
    const profile = store.profiles.find(p => p.user_id === req.user.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'You are not yet registered as a donor. Please complete the Become Donor form first.'
      });
    }

    const newStatus = donor.availability === 'available' ? 'unavailable' : 'available';
    donor.availability = newStatus;
    donor.updated_at = new Date().toISOString();

    if (profile) {
      profile.availability = newStatus;
      profile.updated_at = new Date().toISOString();
    }

    db.saveStore();

    await logAction(req.user.id, 'TOGGLE_AVAILABILITY', 'DONOR', donor.id, { availability: newStatus }, req.ip);

    res.json({
      success: true,
      message: `Your donor status is now: ${newStatus.toUpperCase()}`,
      availability: newStatus
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating availability.' });
  }
}

// GET DONOR STATUS
async function getDonorStatus(req, res) {
  try {
    const store = db.getStore();
    const donor = store.donor_profiles.find(d => d.user_id === req.user.id);

    res.json({
      success: true,
      is_donor: !!donor,
      donor: donor || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching donor status.' });
  }
}

module.exports = {
  searchDonors,
  applyDonor,
  toggleAvailability,
  getDonorStatus
};
