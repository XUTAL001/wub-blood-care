/**
 * WUB BloodConnect - Donor Matching Service
 * Algorithmic matching for voluntary donor coordination
 * NOTE: The matching system aids voluntary coordination only and is NOT a medical diagnosis.
 * Final compatibility and cross-matching must always be conducted by qualified healthcare professionals.
 */

const db = require('../database/db');
const { createNotification } = require('./notificationService');

// General compatible donor reference
const COMPATIBLE_DONORS = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

async function findMatchingDonors(bloodRequest) {
  const store = db.getStore();
  const neededGroup = bloodRequest.blood_group;
  const compatibleGroups = COMPATIBLE_DONORS[neededGroup] || [neededGroup];

  // Fetch approved, available donors whose user accounts are active and verified
  const matched = [];

  for (const donor of store.donor_profiles) {
    if (donor.status !== 'approved' || donor.availability !== 'available') continue;
    if (!compatibleGroups.includes(donor.blood_group)) continue;

    const user = store.users.find(u => u.id === donor.user_id);
    if (!user || user.status !== 'active' || !user.is_verified) continue;

    // Do not match the requester to themselves
    if (user.id === bloodRequest.requester_id) continue;

    const profile = store.profiles.find(p => p.user_id === donor.user_id);

    // Calculate match score
    let score = 50;
    if (donor.blood_group === neededGroup) score += 30; // exact match
    if (donor.location_name === bloodRequest.location_name) score += 20; // local proximity

    matched.push({
      donor_id: donor.id,
      user_id: user.id,
      name: user.name,
      blood_group: donor.blood_group,
      location_name: donor.location_name,
      dept_code: profile ? profile.dept_code : 'WUB',
      donation_count: donor.donation_count || 0,
      match_score: score
    });
  }

  // Sort by match score descending
  matched.sort((a, b) => b.match_score - a.match_score);
  return matched;
}

async function notifyMatchingDonors(bloodRequest) {
  const matches = await findMatchingDonors(bloodRequest);
  const topMatches = matches.slice(0, 5);

  for (const match of topMatches) {
    await createNotification(
      match.user_id,
      `Urgent Blood Request for ${bloodRequest.blood_group}`,
      `A fellow WUB student needs ${bloodRequest.blood_group} blood at ${bloodRequest.hospital_name}. Click to view request details.`,
      'match',
      bloodRequest.id
    );
  }
}

module.exports = {
  findMatchingDonors,
  notifyMatchingDonors,
  COMPATIBLE_DONORS
};
