/**
 * WUB BloodConnect - System Constants
 * World University of Bangladesh
 */

const ROLES = {
  STUDENT: 'student',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

const ACCOUNT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected',
  DEACTIVATED: 'deactivated'
};

const VERIFICATION_STATUS = {
  NOT_SUBMITTED: 'not_submitted',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const DONOR_STATUS = {
  NOT_APPLIED: 'not_applied',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
};

const REQUEST_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  MATCHED: 'matched',
  CONTACTED: 'contacted',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  REJECTED: 'rejected'
};

const URGENCY_LEVEL = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  EMERGENCY: 'emergency'
};

const CONTACT_STATUS = {
  INITIATED: 'initiated',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed'
};

const NOTIFICATION_TYPES = {
  VERIFICATION: 'verification',
  DONOR: 'donor',
  BLOOD_REQUEST: 'blood_request',
  MATCH: 'match',
  CONTACT: 'contact',
  SYSTEM: 'system'
};

const REPORT_TYPES = {
  COMMERCIAL_SELLING: 'commercial_selling',
  FAKE_REQUEST: 'fake_request',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  OTHER: 'other'
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DHAKA_LOCATIONS = [
  'Agargaon',
  'Badda',
  'Banani',
  'Bashundhara',
  'Dhanmondi',
  'Farmgate',
  'Gulshan',
  'Jatrabari',
  'Khilkhet',
  'Mirpur',
  'Mohakhali',
  'Mohammadpur',
  'Motijheel',
  'Old Dhaka (Puran Dhaka)',
  'Rampura',
  'Shahbagh / DMCH',
  'Tejgaon',
  'Uttara',
  'WUB Permanent Campus (Uttara)'
];

const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'EEE', name: 'Electrical & Electronic Engineering' },
  { code: 'BBA', name: 'Business Administration' },
  { code: 'ENG', name: 'English' },
  { code: 'PHARM', name: 'Pharmacy' },
  { code: 'CIVIL', name: 'Civil Engineering' },
  { code: 'LAW', name: 'Law' },
  { code: 'MPH', name: 'Public Health' },
  { code: 'THM', name: 'Tourism & Hospitality Management' },
  { code: 'ME', name: 'Mechatronics Engineering' }
];

module.exports = {
  ROLES,
  ACCOUNT_STATUS,
  VERIFICATION_STATUS,
  DONOR_STATUS,
  AVAILABILITY_STATUS,
  REQUEST_STATUS,
  URGENCY_LEVEL,
  CONTACT_STATUS,
  NOTIFICATION_TYPES,
  REPORT_TYPES,
  BLOOD_GROUPS,
  DHAKA_LOCATIONS,
  DEPARTMENTS
};
