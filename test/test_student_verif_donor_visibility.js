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
  console.log('--- Testing Student ID Verification Approval -> Find Blood Visibility ---');

  const rand = Math.floor(1000 + Math.random() * 9000);
  const studentId = `WUB-2024-${rand}`;
  const studentEmail = `verif_student_${rand}@wub.edu.bd`;

  // 1. Register student with B+ blood
  const regRes = await request('POST', '/api/auth/register', {
    name: `Student Verif ${rand}`,
    student_id: studentId,
    email: studentEmail,
    phone: '01811223344',
    department: 'CSE',
    password: 'password123',
    blood_group: 'B+',
    location: 'Mirpur'
  });
  console.log('1. Registration:', regRes.status, regRes.data.success ? 'SUCCESS' : 'FAILED');
  const studentUserId = regRes.data.user.id;
  const studentToken = regRes.data.token;

  // 2. Submit student ID verification
  const verifSubmit = await request('POST', '/api/users/verification', {
    student_id: studentId,
    id_card_document: 'uploads/id_cards/sample.jpg'
  }, studentToken);
  console.log('2. Verification Submit:', verifSubmit.status, verifSubmit.data.message);

  // 3. Admin login
  const adminLogin = await request('POST', '/api/auth/login', {
    identifier: 'admin',
    password: 'admin123'
  });
  const adminToken = adminLogin.data.token;

  // 4. Admin approves Student ID verification
  const verifApprove = await request('PUT', `/api/admin/verifications/${studentUserId}/review`, {
    action: 'approve',
    admin_notes: 'Verified WUB student ID'
  }, adminToken);
  console.log('4. Admin Approve Verification:', verifApprove.status, verifApprove.data.message);

  // 5. Check if user is now visible in Find Blood under B+ and Mirpur
  const searchRes = await request('GET', '/api/donors/search?blood_group=B+&location=Mirpur');
  console.log('5. Search Result count:', searchRes.data.donors ? searchRes.data.donors.length : 0);
  const found = searchRes.data.donors.find(d => d.user_id === studentUserId || d.name.includes(rand));
  console.log('6. Is Student visible in Find Blood?', found ? 'YES (SUCCESS!)' : 'NO (FAILED)');

  if (!found) {
    throw new Error('Student did not appear in Find Blood after verification approval!');
  }

  console.log('--- TEST PASSED SUCCESSFULLY ---');
}

runTest().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
