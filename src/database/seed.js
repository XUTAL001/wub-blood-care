/**
 * WUB BloodConnect - Development Seed Data Script
 * Pre-populates clean mock data for development & demonstration
 */

const bcrypt = require('bcryptjs');
const db = require('./db');
const { DEPARTMENTS, DHAKA_LOCATIONS } = require('../config/constants');

async function seed() {
  console.log('🌱 [SEED] Initializing development seed records...');
  await db.initDb();

  const store = db.getStore();

  // 1. Departments
  store.departments = DEPARTMENTS.map((d, idx) => ({
    id: idx + 1,
    code: d.code,
    name: d.name,
    created_at: new Date().toISOString()
  }));

  // 2. Locations
  store.locations = DHAKA_LOCATIONS.map((loc, idx) => ({
    id: idx + 1,
    name: loc,
    is_campus: loc.toLowerCase().includes('campus'),
    created_at: new Date().toISOString()
  }));

  // 3. Seed Users & Passwords
  const defaultHash = bcrypt.hashSync('student123', 10);
  const modHash = bcrypt.hashSync('mod123', 10);
  const adminHash = bcrypt.hashSync('admin123', 10);
  const superHash = bcrypt.hashSync('super123', 10);

  store.users = [
    {
      id: 'usr_superadmin',
      student_id: 'WUB-ADM-001',
      name: 'Prof. Dr. M. Rahman',
      email: 'superadmin@wub.edu.bd',
      phone: '01711000001',
      password_hash: superHash,
      role: 'super_admin',
      status: 'active',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_admin',
      student_id: 'WUB-ADM-002',
      name: 'Dr. Tanvir Ahmed',
      email: 'admin@wub.edu.bd',
      phone: '01711000002',
      password_hash: adminHash,
      role: 'admin',
      status: 'active',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_moderator',
      student_id: 'WUB-MOD-001',
      name: 'Nusrat Jahan',
      email: 'moderator@wub.edu.bd',
      phone: '01711000003',
      password_hash: modHash,
      role: 'moderator',
      status: 'active',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // 4. User Profiles (Admins only)
  store.profiles = [
    {
      user_id: 'usr_superadmin',
      avatar_url: null,
      blood_group: 'O+',
      dept_code: 'MPH',
      location_name: 'Uttara',
      bio: 'WUB Directorate of Health & Wellbeing Advisor.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_admin',
      avatar_url: null,
      blood_group: 'A+',
      dept_code: 'CSE',
      location_name: 'WUB Permanent Campus (Uttara)',
      bio: 'WUB BloodCare System Administrator.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_moderator',
      avatar_url: null,
      blood_group: 'B+',
      dept_code: 'BBA',
      location_name: 'Mirpur',
      bio: 'Student Volunteer & Verification Moderator.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // 5. Clean Empty Production Stores
  store.verification_requests = [];
  store.donor_profiles = [];
  store.blood_requests = [];
  store.request_matches = [];
  store.contact_requests = [];
  store.notifications = [
    {
      id: 'notif_welcome',
      user_id: 'all',
      title: 'Welcome to WUB BloodCare',
      message: 'The verified WUB student blood network is now open for real student donor registrations and requests.',
      type: 'announcement',
      is_read: false,
      reference_id: null,
      created_at: new Date().toISOString()
    }
  ];
  store.reports = [];

  // 6. System Settings
  store.system_settings = [
    { key: 'platform_name', value: 'WUB BloodCare', description: 'Official Platform Name' },
    { key: 'university_name', value: 'World University of Bangladesh', description: 'Institution' },
    { key: 'verification_required', value: 'true', description: 'Require student verification for protected features' },
    { key: 'anti_scam_strict_mode', value: 'true', description: 'Block monetary keywords and spam requests' },
    { key: 'request_auto_expire_hours', value: '72', description: 'Default request validity duration' }
  ];

  // 7. Clean Audit Log
  store.audit_logs = [
    {
      id: 'aud_01',
      actor_id: 'usr_superadmin',
      action: 'SYSTEM_INITIALIZED',
      target_type: 'SYSTEM',
      target_id: null,
      details: { message: 'WUB BloodCare production database initialized with clean records.' },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    }
  ];

  db.saveStore();
  console.log('✔ [SEED] Database initialized cleanly with administrative accounts ready for real student users!');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seed;
