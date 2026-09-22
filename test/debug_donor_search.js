const db = require('../src/database/db');

async function debug() {
  await db.initDb();
  const store = db.getStore();

  console.log('Total users:', store.users.length);
  console.log('Total donor profiles:', store.donor_profiles.length);

  const lastDonor = store.donor_profiles[store.donor_profiles.length - 1];
  console.log('Last donor profile:', lastDonor);

  const user = store.users.find(u => u.id === lastDonor.user_id);
  console.log('Matching user:', user);

  const profile = store.profiles.find(p => p.user_id === lastDonor.user_id);
  console.log('Matching profile:', profile);

  console.log('donor.status:', lastDonor.status);
  console.log('donor.availability:', lastDonor.availability);
  console.log('donor.blood_group:', lastDonor.blood_group);
  console.log('user.status:', user ? user.status : 'NO USER');
  console.log('user.is_verified:', user ? user.is_verified : 'NO USER');
}

debug().catch(console.error);
