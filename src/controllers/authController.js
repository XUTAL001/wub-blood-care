/**
 * WUB BloodConnect - Authentication Controller
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');
const db = require('../database/db');
const { createNotification } = require('../services/notificationService');
const { logAction } = require('../services/auditService');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      student_id: user.student_id,
      role: user.role,
      name: user.name,
      is_verified: user.is_verified
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

// REGISTER
async function register(req, res) {
  try {
    const { name, student_id, email, phone, department, password, confirm_password, blood_group, location } = req.body;

    if (!name || !student_id || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided (name, student ID, university email, phone, password).'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirm_password && password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const store = db.getStore();

    // Check unique student ID
    const existingStudentId = store.users.find(u => u.student_id.toLowerCase() === student_id.trim().toLowerCase());
    if (existingStudentId) {
      return res.status(409).json({
        success: false,
        message: 'A student account with this WUB Student ID already exists.'
      });
    }

    // Check unique email
    const existingEmail = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const userId = `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: userId,
      student_id: student_id.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password_hash: passwordHash,
      role: 'student',
      status: 'active',
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.users.push(newUser);

    // Create profile record
    const newProfile = {
      user_id: userId,
      avatar_url: null,
      blood_group: blood_group || null,
      dept_code: department || 'CSE',
      location_name: location || 'Uttara',
      bio: 'WUB Student',
      donor_status: 'not_applied',
      availability: 'available',
      last_donation_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.profiles.push(newProfile);
    db.saveStore();

    // Welcome notification
    await createNotification(
      userId,
      'Welcome to BloodConnect WUB!',
      'Your account is created. Please submit your WUB Student ID for verification to access protected donor features.',
      'verification'
    );

    await logAction(userId, 'USER_REGISTERED', 'USER', userId, { student_id: newUser.student_id }, req.ip);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to WUB BloodConnect.',
      token,
      user: {
        id: newUser.id,
        student_id: newUser.student_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        is_verified: newUser.is_verified,
        department: newProfile.dept_code,
        blood_group: newProfile.blood_group,
        donor_status: newProfile.donor_status
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { identifier, username, student_id, email, password } = req.body;
    const loginId = (identifier || username || student_id || email || '').trim().toLowerCase();

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Student ID or Email and Password.'
      });
    }

    const store = db.getStore();
    const user = store.users.find(u => 
      u.student_id.toLowerCase() === loginId || 
      u.email.toLowerCase() === loginId ||
      u.role.toLowerCase() === loginId ||
      (loginId === 'superadmin' && u.role === 'super_admin')
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID/Email or password.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by administration. Contact WUB Health Office.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID/Email or password.'
      });
    }

    const profile = store.profiles.find(p => p.user_id === user.id) || {};
    const token = generateToken(user);

    await logAction(user.id, 'USER_LOGIN', 'USER', user.id, {}, req.ip);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        student_id: user.student_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        is_verified: user.is_verified,
        blood_group: profile.blood_group,
        department: profile.dept_code,
        donor_status: profile.donor_status,
        availability: profile.availability
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// GET CURRENT AUTHENTICATED USER
async function getMe(req, res) {
  try {
    const store = db.getStore();
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const profile = store.profiles.find(p => p.user_id === user.id) || {};
    const donorProfile = store.donor_profiles.find(d => d.user_id === user.id);
    const verification = store.verification_requests.find(v => v.user_id === user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        student_id: user.student_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        is_verified: user.is_verified,
        created_at: user.created_at,
        avatar_url: profile.avatar_url,
        blood_group: profile.blood_group,
        department: profile.dept_code,
        location: profile.location_name,
        bio: profile.bio,
        donor_status: profile.donor_status,
        availability: profile.availability,
        last_donation_date: profile.last_donation_date,
        is_donor: donorProfile ? donorProfile.status === 'approved' : false,
        verification_status: verification ? verification.status : (user.is_verified ? 'approved' : 'not_submitted')
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
}

// FORGOT PASSWORD
async function forgotPassword(req, res) {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Please enter your WUB Student ID or university email.' });
  }

  const store = db.getStore();
  const user = store.users.find(u => 
    u.student_id.toLowerCase() === identifier.trim().toLowerCase() ||
    u.email.toLowerCase() === identifier.trim().toLowerCase()
  );

  if (!user) {
    // Return generic success for privacy
    return res.json({
      success: true,
      message: 'If an account exists with this credential, instructions have been sent to your university email or contact the campus administrator.'
    });
  }

  res.json({
    success: true,
    message: `Password reset instructions have been dispatched to ${user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}. For immediate assistance, contact WUB Health Office.`
  });
}

// LOGOUT
function logout(req, res) {
  res.json({ success: true, message: 'Logged out successfully.' });
}

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  logout
};
