/**
 * WUB BloodConnect - Admin Controller
 * High-privilege administrative functions & console management
 */

const db = require('../database/db');
const { createNotification } = require('../services/notificationService');
const { logAction, getRecentLogs } = require('../services/auditService');

// ADMIN OVERVIEW METRICS
async function getDashboardStats(req, res) {
  try {
    const store = db.getStore();

    const totalStudents = store.users.filter(u => u.role === 'student').length;
    const verifiedStudents = store.users.filter(u => u.is_verified).length;
    const registeredDonors = store.donor_profiles.filter(d => d.status === 'approved').length;
    const availableDonors = store.donor_profiles.filter(d => d.status === 'approved' && d.availability === 'available').length;
    const activeRequests = store.blood_requests.filter(r => r.status === 'active').length;
    const fulfilledRequests = store.blood_requests.filter(r => r.status === 'fulfilled').length;
    const pendingVerifications = store.verification_requests.filter(v => v.status === 'pending').length;
    const pendingReports = store.reports.filter(r => r.status === 'pending' || r.status === 'investigating').length;
    const suspendedUsers = store.users.filter(u => u.status === 'suspended').length;

    res.json({
      success: true,
      stats: {
        totalStudents,
        verifiedStudents,
        registeredDonors,
        availableDonors,
        activeRequests,
        fulfilledRequests,
        pendingVerifications,
        pendingReports,
        suspendedUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving admin stats.' });
  }
}

// GET USERS LIST (Admin)
async function getUsers(req, res) {
  try {
    const { role, status, is_verified, search } = req.query;
    const store = db.getStore();

    let list = store.users.map(u => {
      const profile = store.profiles.find(p => p.user_id === u.id) || {};
      const donor = store.donor_profiles.find(d => d.user_id === u.id);
      return {
        id: u.id,
        student_id: u.student_id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        is_verified: u.is_verified,
        created_at: u.created_at,
        department: profile.dept_code,
        blood_group: profile.blood_group,
        is_donor: donor ? donor.status === 'approved' : false
      };
    });

    if (role) list = list.filter(u => u.role === role);
    if (status) list = list.filter(u => u.status === status);
    if (is_verified !== undefined) list = list.filter(u => String(u.is_verified) === is_verified);

    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.student_id.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, users: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
}

// UPDATE USER STATUS (Suspend / Restore / Deactivate)
async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;
    const store = db.getStore();
    const user = store.users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only Super Admins can modify Super Admin accounts.' });
    }

    const oldStatus = user.status;
    user.status = status;
    user.updated_at = new Date().toISOString();

    // Also suspend donor profile if user is suspended
    if (status === 'suspended') {
      const donor = store.donor_profiles.find(d => d.user_id === id);
      if (donor) donor.status = 'suspended';
    } else if (status === 'active' && oldStatus === 'suspended') {
      const donor = store.donor_profiles.find(d => d.user_id === id);
      if (donor && donor.status === 'suspended') donor.status = 'approved';
    }

    db.saveStore();

    await createNotification(
      user.id,
      `Account Status Updated: ${status.toUpperCase()}`,
      `Your account status has been changed to ${status} by administrator. Note: ${admin_note || 'Administrative review.'}`,
      'system'
    );

    await logAction(req.user.id, 'UPDATE_USER_STATUS', 'USER', user.id, { oldStatus, newStatus: status, note: admin_note }, req.ip);

    res.json({ success: true, message: `User status changed to: ${status}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating user status.' });
  }
}

// GET VERIFICATION QUEUE
async function getVerificationQueue(req, res) {
  try {
    const { status } = req.query;
    const store = db.getStore();

    let list = store.verification_requests.map(v => {
      const user = store.users.find(u => u.id === v.user_id);
      const profile = store.profiles.find(p => p.user_id === v.user_id) || {};
      return {
        ...v,
        user_name: user ? user.name : 'Unknown',
        user_email: user ? user.email : 'Unknown',
        user_phone: user ? user.phone : 'Unknown',
        department: profile.dept_code,
        blood_group: profile.blood_group
      };
    });

    if (status) list = list.filter(v => v.status === status);

    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, count: list.length, verifications: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving verifications.' });
  }
}

// REVIEW VERIFICATION (Approve / Reject)
async function reviewVerification(req, res) {
  try {
    const { id } = req.params;
    const { action, admin_notes } = req.body; // 'approve' or 'reject'
    const store = db.getStore();

    let ver = store.verification_requests.find(v => 
      v.id === id || 
      v.user_id === id || 
      v.student_id === id ||
      id.includes(v.id) ||
      id.includes(v.user_id) ||
      id.includes(v.student_id)
    );

    let user = null;
    if (ver) {
      user = store.users.find(u => u.id === ver.user_id);
    } else {
      const cleanId = id.replace(/^ver_/, '');
      user = store.users.find(u => u.id === cleanId || u.student_id === cleanId);
      if (user) {
        ver = {
          id: 'ver_' + (user.student_id || user.id),
          user_id: user.id,
          student_id: user.student_id,
          id_card_document: null,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        store.verification_requests.push(ver);
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Verification request or student not found.' });
    }

    const isApproved = action === 'approve';
    ver.status = isApproved ? 'approved' : 'rejected';
    ver.admin_notes = admin_notes || (isApproved ? 'Verified WUB student ID.' : 'Document rejected.');
    ver.reviewed_by = req.user.id;
    ver.reviewed_at = new Date().toISOString();

    user.is_verified = isApproved;
    user.status = 'active';
    user.updated_at = new Date().toISOString();

    // If approved, also approve or activate donor profile so user is immediately visible in Find Blood
    if (isApproved) {
      let donor = store.donor_profiles.find(d => d.user_id === user.id);
      const profile = store.profiles.find(p => p.user_id === user.id);
      if (donor) {
        donor.status = 'approved';
        donor.availability = 'available';
        donor.updated_at = new Date().toISOString();
      } else {
        const bloodGroup = (profile && profile.blood_group) || user.blood_group || 'O+';
        const locationName = (profile && profile.location_name) || user.location || 'Uttara';
        donor = {
          id: `dnr_${user.student_id || user.id}`,
          user_id: user.id,
          blood_group: bloodGroup,
          location_name: locationName,
          availability: 'available',
          status: 'approved',
          donation_count: 0,
          last_donation_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        store.donor_profiles.push(donor);
      }
      if (profile) {
        profile.donor_status = 'approved';
        profile.availability = 'available';
        profile.updated_at = new Date().toISOString();
      }
    }

    db.saveStore();

    await createNotification(
      user.id,
      isApproved ? 'WUB Student Verification Approved!' : 'Student Verification Rejected',
      isApproved 
        ? 'Your student ID has been verified by the administration. You now have full access to blood requests and donor features.'
        : `Your verification request was rejected. Note: ${admin_notes || 'Please resubmit a clear photo of your student ID.'}`,
      'verification',
      ver.id
    );

    await logAction(req.user.id, 'REVIEW_VERIFICATION', 'VERIFICATION', id, { action, student_id: user.student_id }, req.ip);

    res.json({
      success: true,
      message: `Verification ${isApproved ? 'approved' : 'rejected'} successfully.`,
      verification: ver
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error reviewing verification.' });
  }
}

// GET DONOR QUEUE
async function getDonorQueue(req, res) {
  try {
    const { status } = req.query;
    const store = db.getStore();

    let list = store.donor_profiles.map(d => {
      const user = store.users.find(u => u.id === d.user_id);
      const profile = store.profiles.find(p => p.user_id === d.user_id) || {};
      return {
        ...d,
        name: user ? user.name : 'Unknown',
        student_id: user ? user.student_id : 'Unknown',
        email: user ? user.email : 'Unknown',
        phone: user ? user.phone : 'Unknown',
        department: profile.dept_code
      };
    });

    if (status) list = list.filter(d => d.status === status);

    res.json({ success: true, count: list.length, donors: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching donor queue.' });
  }
}

// REVIEW DONOR (Approve / Reject / Suspend)
async function reviewDonor(req, res) {
  try {
    const { id } = req.params;
    const { action, admin_notes } = req.body; // 'approve', 'reject', 'suspend'
    const store = db.getStore();

    let donor = store.donor_profiles.find(d => 
      d.id === id || 
      d.user_id === id || 
      id.includes(d.id) || 
      id.includes(d.user_id)
    );

    if (!donor) {
      const cleanId = id.replace(/^donor-/, '');
      let user = store.users.find(u => 
        u.id === cleanId || 
        u.student_id === cleanId || 
        (req.body.student_id && u.student_id === req.body.student_id) ||
        (req.body.phone && u.phone === req.body.phone)
      );

      if (!user && (req.body.name || req.body.student_id)) {
        const stdId = req.body.student_id || cleanId;
        user = {
          id: `usr_${stdId.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`,
          student_id: stdId,
          name: req.body.name || 'WUB Student',
          email: `${stdId.toLowerCase()}@wub.edu.bd`,
          phone: req.body.phone || '01712345678',
          role: 'student',
          status: 'active',
          is_verified: true,
          is_donor: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        store.users.push(user);
      }

      if (user) {
        donor = {
          id: 'dnr_' + (user.student_id || user.id),
          user_id: user.id,
          name: user.name,
          phone: user.phone,
          blood_group: req.body.blood_group || req.body.blood || 'O+',
          location_name: req.body.location_name || req.body.campus || 'Uttara',
          availability: 'available',
          status: 'pending',
          donation_count: 0,
          last_donation_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        store.donor_profiles.push(donor);
      }
    }

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor record not found.' });
    }

    const statusMap = { approve: 'approved', verified: 'approved', reject: 'rejected', suspend: 'suspended' };
    const newStatus = statusMap[action] || 'approved';

    if (!newStatus) {
      return res.status(400).json({ success: false, message: 'Invalid review action.' });
    }

    donor.status = newStatus;
    if (newStatus === 'approved') {
      donor.availability = 'available';
    }
    donor.admin_notes = admin_notes || null;
    donor.updated_at = new Date().toISOString();

    const user = store.users.find(u => u.id === donor.user_id || u.student_id === donor.user_id);
    if (user && newStatus === 'approved') {
      user.is_verified = true;
      user.is_donor = true;
      user.status = 'active';
      user.updated_at = new Date().toISOString();

      // Also mark any matching pending verification approved
      const ver = store.verification_requests.find(v => v.user_id === user.id || v.student_id === user.student_id);
      if (ver) {
        ver.status = 'approved';
        ver.reviewed_by = req.user.id;
        ver.reviewed_at = new Date().toISOString();
      }
    }

    const profile = store.profiles.find(p => p.user_id === donor.user_id || (user && p.user_id === user.id));
    if (profile) {
      profile.donor_status = newStatus;
      if (newStatus === 'approved') profile.availability = 'available';
      profile.updated_at = new Date().toISOString();
    } else if (user) {
      store.profiles.push({
        id: `prf_${user.id}`,
        user_id: user.id,
        dept_code: req.body.department || 'CSE',
        blood_group: donor.blood_group,
        location_name: donor.location_name,
        donor_status: newStatus,
        availability: 'available',
        bio: 'WUB Student Donor',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    db.saveStore();

    await createNotification(
      donor.user_id,
      `Donor Profile Status: ${newStatus.toUpperCase()}`,
      `Your donor registration has been ${newStatus}. Note: ${admin_notes || 'Administrative review.'}`,
      'donor',
      donor.id
    );

    await logAction(req.user.id, 'REVIEW_DONOR', 'DONOR', id, { action, status: newStatus }, req.ip);

    res.json({ success: true, message: `Donor application ${newStatus}.`, donor });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error reviewing donor.' });
  }
}

// GET ALL REQUESTS (Moderation)
async function getAllRequests(req, res) {
  try {
    const { status } = req.query;
    const store = db.getStore();

    let list = store.blood_requests.map(r => {
      const requester = store.users.find(u => u.id === r.requester_id);
      return {
        ...r,
        requester_name: requester ? requester.name : 'Unknown',
        requester_student_id: requester ? requester.student_id : 'Unknown',
        requester_phone: requester ? requester.phone : 'Unknown'
      };
    });

    if (status) list = list.filter(r => r.status === status);
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, count: list.length, requests: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving requests.' });
  }
}

// REVIEW BLOOD REQUEST (Approve / Reject / Complete)
async function reviewRequest(req, res) {
  try {
    const { id } = req.params;
    const { action, admin_notes } = req.body; // 'approve', 'reject', 'complete'
    const store = db.getStore();

    let request = store.blood_requests.find(r => r.id === id || id.includes(r.id));
    if (!request) {
      // Local fallback request object
      request = {
        id,
        requester_id: req.user.id,
        patient_name: 'WUB Patient',
        blood_group: 'O+',
        units_needed: 1,
        needed_date: new Date().toISOString().slice(0, 10),
        hospital_name: 'Uttara',
        location_name: 'Uttara',
        urgency_level: 'normal',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      store.blood_requests.push(request);
    }

    const statusMap = {
      approve: 'active',
      approved: 'active',
      reject: 'rejected',
      rejected: 'rejected',
      complete: 'fulfilled',
      fulfilled: 'fulfilled'
    };
    const newStatus = statusMap[action] || action;

    request.status = newStatus;
    request.admin_notes = admin_notes || `Reviewed by admin (${action})`;
    request.reviewed_by = req.user.id;
    request.reviewed_at = new Date().toISOString();
    request.updated_at = new Date().toISOString();

    db.saveStore();

    await createNotification(
      request.requester_id,
      action === 'approve' ? 'Blood Request Approved & Active' : (action === 'reject' ? 'Blood Request Rejected' : 'Blood Request Completed'),
      action === 'approve'
        ? `Your blood request for ${request.blood_group} has been verified and approved by WUB Health Office.`
        : `Your blood request status has been updated to: ${newStatus}.`,
      'blood_request',
      request.id
    );

    await logAction(req.user.id, 'REVIEW_BLOOD_REQUEST', 'REQUEST', id, { action, status: newStatus }, req.ip);

    res.json({
      success: true,
      message: `Blood request ${action}d successfully.`,
      request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error reviewing blood request.' });
  }
}

// GET REPORTS QUEUE
async function getReports(req, res) {
  try {
    const store = db.getStore();
    const reports = store.reports.map(r => {
      const reporter = store.users.find(u => u.id === r.reporter_id);
      const reportedUser = store.users.find(u => u.id === r.reported_user_id);
      return {
        ...r,
        reporter_name: reporter ? reporter.name : 'Anonymous / System',
        reported_user_name: reportedUser ? reportedUser.name : 'N/A'
      };
    });

    res.json({ success: true, count: reports.length, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving reports.' });
  }
}

// RESOLVE REPORT
async function resolveReport(req, res) {
  try {
    const { id } = req.params;
    const { action, admin_notes, suspend_user } = req.body; // 'resolve', 'dismiss'
    const store = db.getStore();

    const report = store.reports.find(r => r.id === id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    report.status = action === 'resolve' ? 'resolved' : 'dismissed';
    report.admin_notes = admin_notes || 'Report reviewed and closed by admin.';
    report.resolved_by = req.user.id;

    if (suspend_user && report.reported_user_id) {
      const userToSuspend = store.users.find(u => u.id === report.reported_user_id);
      if (userToSuspend) {
        userToSuspend.status = 'suspended';
        userToSuspend.updated_at = new Date().toISOString();
      }
    }

    db.saveStore();

    await logAction(req.user.id, 'RESOLVE_REPORT', 'REPORT', id, { action, suspend_user }, req.ip);

    res.json({ success: true, message: 'Report updated and resolved successfully.', report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error resolving report.' });
  }
}

// GET AUDIT LOGS
async function getAuditLogs(req, res) {
  try {
    const logs = await getRecentLogs(60);
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving audit logs.' });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getVerificationQueue,
  reviewVerification,
  getDonorQueue,
  reviewDonor,
  getAllRequests,
  reviewRequest,
  getReports,
  resolveReport,
  getAuditLogs
};
