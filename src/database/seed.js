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
    },
    {
      id: 'usr_std_tanvir',
      student_id: 'WUB-2023-0842',
      name: 'Tanvir Alam',
      email: 'tanvir.alam@wub.edu.bd',
      phone: '01712345678',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    // Verified Student Donors
    {
      id: 'usr_std_01',
      student_id: 'WUB-2022-CSE-0045',
      name: 'Abrar Fahim',
      email: 'abrar.fahim@wub.edu.bd',
      phone: '01812345678',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_std_02',
      student_id: 'WUB-2023-EEE-0112',
      name: 'Sabrina Mostofa',
      email: 'sabrina.eee@wub.edu.bd',
      phone: '01723456789',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_std_03',
      student_id: 'WUB-2021-BBA-0089',
      name: 'Tariqul Islam',
      email: 'tariqul.bba@wub.edu.bd',
      phone: '01934567890',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_std_04',
      student_id: 'WUB-2023-PHARM-0021',
      name: 'Faria Tasnim',
      email: 'faria.pharm@wub.edu.bd',
      phone: '01645678901',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_std_05',
      student_id: 'WUB-2022-CSE-0099',
      name: 'Mahir Faisal',
      email: 'mahir.cse@wub.edu.bd',
      phone: '01556789012',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_std_06',
      student_id: 'WUB-2024-ENG-0015',
      name: 'Raisa Chowdhury',
      email: 'raisa.eng@wub.edu.bd',
      phone: '01767890123',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: true,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'usr_std_07',
      student_id: 'WUB-2024-LAW-0033',
      name: 'Hasan Al Banna',
      email: 'hasan.law@wub.edu.bd',
      phone: '01878901234',
      password_hash: defaultHash,
      role: 'student',
      status: 'active',
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // 4. User Profiles
  store.profiles = [
    {
      user_id: 'usr_std_tanvir',
      avatar_url: null,
      blood_group: 'B+',
      dept_code: 'CSE',
      location_name: 'Uttara',
      bio: 'WUB CSE Student, voluntary donor.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2026-06-15',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_superadmin',
      avatar_url: null,
      blood_group: 'O+',
      dept_code: 'MPH',
      location_name: 'Uttara',
      bio: 'WUB Directorate of Health & Wellbeing Advisor.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2025-11-15',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_admin',
      avatar_url: null,
      blood_group: 'A+',
      dept_code: 'CSE',
      location_name: 'WUB Permanent Campus (Uttara)',
      bio: 'WUB BloodConnect System Administrator.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2026-01-10',
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
      last_donation_date: '2025-12-05',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_01',
      avatar_url: null,
      blood_group: 'O+',
      dept_code: 'CSE',
      location_name: 'Uttara',
      bio: 'Regular blood donor, 4th year CSE student.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2025-10-12',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_02',
      avatar_url: null,
      blood_group: 'A+',
      dept_code: 'EEE',
      location_name: 'Mirpur',
      bio: 'Ready to help fellow students in emergency.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2025-09-20',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_03',
      avatar_url: null,
      blood_group: 'B+',
      dept_code: 'BBA',
      location_name: 'Dhanmondi',
      bio: 'BBA 6th semester student.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2025-11-28',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_04',
      avatar_url: null,
      blood_group: 'AB+',
      dept_code: 'PHARM',
      location_name: 'Mohakhali',
      bio: 'Universal recipient, proud AB+ donor.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2025-12-18',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_05',
      avatar_url: null,
      blood_group: 'O-',
      dept_code: 'CSE',
      location_name: 'WUB Permanent Campus (Uttara)',
      bio: 'Universal donor (O Negative). Available 24/7 for urgent campus calls.',
      donor_status: 'approved',
      availability: 'available',
      last_donation_date: '2025-08-14',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_06',
      avatar_url: null,
      blood_group: 'B-',
      dept_code: 'ENG',
      location_name: 'Uttara',
      bio: 'English Department student, voluntary donor.',
      donor_status: 'approved',
      availability: 'unavailable',
      last_donation_date: '2026-02-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'usr_std_07',
      avatar_url: null,
      blood_group: 'A-',
      dept_code: 'LAW',
      location_name: 'Mohammadpur',
      bio: 'Freshman law student.',
      donor_status: 'pending',
      availability: 'available',
      last_donation_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // 5. Donor Profiles
  store.donor_profiles = [
    {
      id: 'dnr_tanvir',
      user_id: 'usr_std_tanvir',
      blood_group: 'B+',
      location_name: 'Uttara',
      availability: 'available',
      status: 'approved',
      donation_count: 4,
      last_donation_date: '2026-06-15',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dnr_01',
      user_id: 'usr_std_01',
      blood_group: 'O+',
      location_name: 'Uttara',
      availability: 'available',
      status: 'approved',
      donation_count: 4,
      last_donation_date: '2025-10-12',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dnr_02',
      user_id: 'usr_std_02',
      blood_group: 'A+',
      location_name: 'Mirpur',
      availability: 'available',
      status: 'approved',
      donation_count: 2,
      last_donation_date: '2025-09-20',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dnr_03',
      user_id: 'usr_std_03',
      blood_group: 'B+',
      location_name: 'Dhanmondi',
      availability: 'available',
      status: 'approved',
      donation_count: 3,
      last_donation_date: '2025-11-28',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dnr_04',
      user_id: 'usr_std_04',
      blood_group: 'AB+',
      location_name: 'Mohakhali',
      availability: 'available',
      status: 'approved',
      donation_count: 1,
      last_donation_date: '2025-12-18',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dnr_05',
      user_id: 'usr_std_05',
      blood_group: 'O-',
      location_name: 'WUB Permanent Campus (Uttara)',
      availability: 'available',
      status: 'approved',
      donation_count: 5,
      last_donation_date: '2025-08-14',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'dnr_06',
      user_id: 'usr_std_06',
      blood_group: 'B-',
      location_name: 'Uttara',
      availability: 'unavailable',
      status: 'approved',
      donation_count: 2,
      last_donation_date: '2026-02-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // 6. Verification Requests
  store.verification_requests = [
    {
      id: 'ver_01',
      user_id: 'usr_std_07',
      student_id: 'WUB-2024-LAW-0033',
      id_card_document: 'uploads/documents/sample_id_wub.pdf',
      status: 'pending',
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    }
  ];

  // 7. Blood Requests
  store.blood_requests = [
    {
      id: 'req_01',
      requester_id: 'usr_std_01',
      patient_name: 'Kazi Mizanur Rahman',
      blood_group: 'O+',
      units_needed: 2,
      needed_date: '2026-09-20',
      needed_time: '11:00 AM',
      hospital_name: 'Uttara Ahsania Mission Cancer Hospital',
      location_name: 'Uttara',
      urgency_level: 'emergency',
      reason: 'Urgent bypass heart surgery. Replacement units required immediately.',
      additional_notes: 'Please contact immediately if available. Hospital bed: Ward 4, Bed 12.',
      status: 'active',
      expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'req_02',
      requester_id: 'usr_std_02',
      patient_name: 'Amena Begum',
      blood_group: 'B+',
      units_needed: 1,
      needed_date: '2026-09-22',
      needed_time: '02:30 PM',
      hospital_name: 'Kurmitola General Hospital',
      location_name: 'WUB Permanent Campus (Uttara)',
      urgency_level: 'high',
      reason: 'Scheduled orthopedic bone fracture operation.',
      additional_notes: 'Donor should have eaten light meal before donating.',
      status: 'active',
      expires_at: new Date(Date.now() + 72 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'req_03',
      requester_id: 'usr_std_03',
      patient_name: 'Shakil Anwar',
      blood_group: 'A+',
      units_needed: 1,
      needed_date: '2026-09-25',
      needed_time: '10:00 AM',
      hospital_name: 'Popular Diagnostic & Medical College, Dhanmondi',
      location_name: 'Dhanmondi',
      urgency_level: 'normal',
      reason: 'Thalassemia patient routine transfusion.',
      additional_notes: 'Regular cross-matched blood needed.',
      status: 'active',
      expires_at: new Date(Date.now() + 120 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // 8. Notifications
  store.notifications = [
    {
      id: 'notif_01',
      user_id: 'usr_std_01',
      title: 'Welcome to BloodConnect WUB!',
      message: 'Your student account has been verified. You can now donate blood or create blood requests.',
      type: 'verification',
      is_read: true,
      reference_id: null,
      created_at: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: 'notif_02',
      user_id: 'usr_std_01',
      title: 'Emergency Blood Request Posted',
      message: 'Your emergency blood request for O+ has been broadcasted to verified donors.',
      type: 'blood_request',
      is_read: false,
      reference_id: 'req_01',
      created_at: new Date(Date.now() - 2 * 3600000).toISOString()
    }
  ];

  // 9. System Settings
  store.system_settings = [
    { key: 'platform_name', value: 'WUB BloodConnect', description: 'Official Platform Name' },
    { key: 'university_name', value: 'World University of Bangladesh', description: 'Institution' },
    { key: 'verification_required', value: 'true', description: 'Require student verification for protected features' },
    { key: 'anti_scam_strict_mode', value: 'true', description: 'Block monetary keywords and spam requests' },
    { key: 'request_auto_expire_hours', value: '72', description: 'Default request validity duration' }
  ];

  // 10. Audit Logs
  store.audit_logs = [
    {
      id: 'aud_01',
      actor_id: 'usr_superadmin',
      action: 'SYSTEM_INITIALIZED',
      target_type: 'SYSTEM',
      target_id: null,
      details: { message: 'WUB BloodConnect database seeded and verified successfully.' },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    }
  ];

  db.saveStore();
  console.log('✔ [SEED] Database seeded successfully with 8 users, 6 verified donors, 3 blood requests, and initial settings!');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seed;
