/**
 * WUB BloodConnect - Automated Test Suite
 * Validates Authentication, RBAC, Verification, Donor, Request, Matching, Contact & Anti-Scam APIs
 */

const BASE_URL = 'http://localhost:5000/api';

const results = [];
function test(name, pass, detail = '') {
  if (pass) {
    results.push({ name, status: 'PASS' });
    console.log(`  ✔ PASS: ${name}`);
  } else {
    results.push({ name, status: 'FAIL', detail });
    console.error(`  ❌ FAIL: ${name} — ${detail}`);
  }
}

async function request(endpoint, method = 'GET', data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  });

  const json = await res.json().catch(() => ({}));
  return { status: res.status, data: json };
}

async function runAllTests() {
  console.log('====================================================');
  console.log('🧪 Starting WUB BloodConnect End-to-End Test Suite');
  console.log('====================================================');

  // 1. Health Check
  const health = await request('/health');
  test('API Health Check', health.status === 200 && health.data.status === 'online');

  // 2. Admin Login
  const adminLogin = await request('/auth/login', 'POST', {
    identifier: 'admin@wub.edu.bd',
    password: 'admin123'
  });
  test('Admin Login Authentication', adminLogin.status === 200 && adminLogin.data.token, adminLogin.data.message);
  const adminToken = adminLogin.data.token;

  // 3. Student Registration
  const testStudentId = `WUB-TEST-${Date.now().toString().slice(-4)}`;
  const regRes = await request('/auth/register', 'POST', {
    name: 'Tamim Iqbal',
    student_id: testStudentId,
    email: `tamim_${Date.now()}@wub.edu.bd`,
    phone: '01700998877',
    department: 'CSE',
    blood_group: 'O+',
    location: 'Uttara',
    password: 'password123',
    confirm_password: 'password123'
  });
  test('Student Registration with Unique Student ID', regRes.status === 201 && regRes.data.token, regRes.data.message);
  const studentToken = regRes.data.token;
  const studentUser = regRes.data.user;

  // 4. Duplicate Student ID Registration (Should be blocked)
  const dupReg = await request('/auth/register', 'POST', {
    name: 'Tamim Clone',
    student_id: testStudentId,
    email: `tamim_clone_${Date.now()}@wub.edu.bd`,
    phone: '01700998878',
    department: 'CSE',
    password: 'password123'
  });
  test('Duplicate Student ID Blocked', dupReg.status === 409);

  // 5. Anti-Scam & Commercial Blood Selling Protection
  const scamRes = await request('/requests', 'POST', {
    patient_name: 'Imran Hossain',
    blood_group: 'A+',
    needed_date: '2026-09-30',
    hospital_name: 'Apollo Hospital',
    location_name: 'Uttara',
    reason: 'Will pay 5000 taka via bkash for emergency donor.'
  }, studentToken);
  test('Anti-Scam Filter blocks financial & bKash keywords', scamRes.status === 400 && scamRes.data.message.includes('Policy Violation'));

  // 6. RBAC: Student blocked from Admin Endpoints
  const forbiddenAdminRes = await request('/admin/stats', 'GET', null, studentToken);
  test('Role Restriction: Student cannot access Admin Stats', forbiddenAdminRes.status === 403);

  // 7. Admin can access Admin Stats
  const adminStats = await request('/admin/stats', 'GET', null, adminToken);
  test('RBAC: Admin has access to Admin Stats', adminStats.status === 200 && adminStats.data.stats.totalStudents >= 1);

  // 8. Student ID Verification Request
  const verReq = await request('/users/verification', 'POST', {
    student_id: testStudentId
  }, studentToken);
  test('Student Verification Request Submission', verReq.status === 201 && verReq.data.verification);
  const verId = verReq.data.verification.id;

  // 9. Admin Review & Approval of Verification
  const approveVer = await request(`/admin/verifications/${verId}/review`, 'PUT', {
    action: 'approve',
    admin_notes: 'WUB Student Registry verified.'
  }, adminToken);
  test('Admin Verification Review & Approval', approveVer.status === 200 && approveVer.data.verification.status === 'approved');

  // 10. Student Donor Registration (Approved student)
  const donorApp = await request('/donors/apply', 'POST', {
    blood_group: 'O+',
    location: 'WUB Permanent Campus (Uttara)',
    availability: 'available'
  }, studentToken);
  test('Donor Application Registration', donorApp.status === 201 && donorApp.data.donor);

  // 11. Donor Availability Toggle
  const toggleRes = await request('/donors/availability/toggle', 'POST', {}, studentToken);
  test('Donor Availability Toggle (to unavailable)', toggleRes.status === 200 && toggleRes.data.availability === 'unavailable');
  // Toggle back to available
  const toggleBack = await request('/donors/availability/toggle', 'POST', {}, studentToken);
  test('Donor Availability Toggle (back to available)', toggleBack.status === 200 && toggleBack.data.availability === 'available');

  // 12. Dynamic Donor Search
  const searchRes = await request('/donors/search?blood_group=O%2B&location=Uttara');
  test('Dynamic Donor Search by Blood Group & Location', searchRes.status === 200 && Array.isArray(searchRes.data.donors));

  // 13. Verified Student creates Valid Blood Request
  const validRequest = await request('/requests', 'POST', {
    patient_name: 'Sharmin Akter',
    blood_group: 'O+',
    units_needed: 1,
    needed_date: '2026-09-28',
    needed_time: '10:30 AM',
    hospital_name: 'Uttara Crescent Hospital',
    location_name: 'Uttara',
    urgency_level: 'emergency',
    reason: 'Emergency operation requirements.'
  }, studentToken);
  test('Valid Blood Request Creation & Matching Broadcast', validRequest.status === 201 && validRequest.data.request.status === 'active');
  const reqId = validRequest.data.request.id;

  // 14. Contact Workflow Initiation
  const contactRes = await request('/contacts', 'POST', {
    donor_user_id: 'usr_std_01',
    request_id: reqId,
    message: 'Hello, I need voluntary blood for surgery at Uttara Crescent Hospital.'
  }, studentToken);
  test('Secure Contact Workflow Initiation', contactRes.status === 201 && contactRes.data.contact);

  // 15. In-App Notifications
  const notifs = await request('/notifications', 'GET', null, studentToken);
  test('In-App Notification Center delivery', notifs.status === 200 && notifs.data.notifications.length >= 1);

  // 16. Audit Logs inspection (Admin)
  const auditRes = await request('/admin/audit-logs', 'GET', null, adminToken);
  test('Audit Logs records security & administrative actions', auditRes.status === 200 && auditRes.data.logs.length >= 1);

  console.log('====================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const total = results.length;
  console.log(`🏁 Test Summary: ${passed}/${total} tests passed (${Math.round((passed/total)*100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED! Application is 100% verified.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
