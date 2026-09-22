const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTest() {
  console.log('--- Testing Approved Donor Visibility in Find Blood ---');

  const rand = Math.floor(1000 + Math.random() * 9000);
  const studentId = `WUB-2024-${rand}`;
  const studentEmail = `student_${rand}@wub.edu.bd`;

  // 1. Register a new student who wants to donate
  const regRes = await request('POST', '/api/auth/register', {
    name: `Test Donor ${rand}`,
    student_id: studentId,
    email: studentEmail,
    phone: '01799887766',
    department: 'CSE',
    password: 'password123',
    blood_group: 'AB+',
    location: 'Uttara'
  });
  console.log('1. Student Registration:', regRes.status, regRes.data.success ? 'SUCCESS' : 'FAILED');
  const studentToken = regRes.data.token;
  const studentUserId = regRes.data.user.id;

  // 2. Student applies as donor
  const applyRes = await request('POST', '/api/donors/apply', {
    blood_group: 'AB+',
    location: 'Uttara',
    availability: 'available'
  }, studentToken);
  console.log('2. Apply Donor:', applyRes.status, applyRes.data.success ? 'SUCCESS' : 'FAILED');

  // 3. Check Find Blood before admin approval: new donor should NOT appear yet
  const beforeSearchRes = await request('GET', '/api/donors/search?blood_group=AB+');
  const beforeFound = beforeSearchRes.data.donors.some(d => d.user_id === studentUserId || d.name.includes(rand));
  console.log('3. Before Approval: Is new donor in Find Blood?', beforeFound ? 'YES (Unexpected)' : 'NO (Expected)');

  // 4. Admin logs in
  const adminLogin = await request('POST', '/api/auth/login', {
    identifier: 'admin',
    password: 'admin123'
  });
  const adminToken = adminLogin.data.token;

  // 5. Admin approves the donor in Donor Queue
  const approveRes = await request('PUT', `/api/admin/donors/${studentUserId}/review`, {
    action: 'approve',
    admin_notes: 'Approved during test'
  }, adminToken);
  console.log('5. Admin Approve Donor:', approveRes.status, approveRes.data.message);

  // 6. Check Find Blood after admin approval: new donor MUST appear!
  const afterSearchRes = await request('GET', '/api/donors/search?blood_group=AB+');
  console.log('Search returned donors count:', afterSearchRes.data.donors ? afterSearchRes.data.donors.length : 0);
  console.log('Search returned donors:', afterSearchRes.data.donors);
  const afterFound = afterSearchRes.data.donors.find(d => d.user_id === studentUserId || d.name.includes(rand));
  console.log('6. After Approval: Is new donor in Find Blood?', afterFound ? 'YES (SUCCESS!)' : 'NO (FAILED)');

  if (afterFound) {
    console.log('   Donor details found in search:', {
      name: afterFound.name,
      blood: afterFound.blood_group,
      location: afterFound.location,
      availability: afterFound.availability
    });
  } else {
    throw new Error('Approved donor did not appear in search results!');
  }

  console.log('--- TEST PASSED SUCCESSFULLY ---');
}

runTest().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
