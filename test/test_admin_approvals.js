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
  console.log('--- Starting Admin Approvals Integration Test ---');

  // 1. Login as admin
  const loginRes = await request('POST', '/api/auth/login', {
    identifier: 'admin',
    password: 'admin123'
  });
  console.log('1. Admin Login:', loginRes.status, loginRes.data.success ? 'SUCCESS' : 'FAILED');
  if (!loginRes.data.token) {
    throw new Error('No token returned');
  }
  const token = loginRes.data.token;

  // 2. Fetch verifications
  const verifRes = await request('GET', '/api/admin/verifications', null, token);
  console.log('2. GET Verifications:', verifRes.status, 'Count:', verifRes.data.verifications ? verifRes.data.verifications.length : 0);

  // 3. Approve a verification (test with user ID or composite ID)
  const targetVerifId = verifRes.data.verifications && verifRes.data.verifications.length > 0 
    ? verifRes.data.verifications[0].id 
    : 'ver_WUB-2024-0319';
  
  const approveVerifRes = await request('PUT', `/api/admin/verifications/${targetVerifId}/review`, {
    action: 'approve',
    admin_notes: 'Automated test approval'
  }, token);
  console.log(`3. Approve Verification (${targetVerifId}):`, approveVerifRes.status, approveVerifRes.data);

  // 4. Fetch donors
  const donorRes = await request('GET', '/api/admin/donors', null, token);
  console.log('4. GET Donors:', donorRes.status, 'Count:', donorRes.data.donors ? donorRes.data.donors.length : 0);

  // 5. Approve donor (test with donor ID or composite ID)
  const targetDonorId = donorRes.data.donors && donorRes.data.donors.length > 0 
    ? donorRes.data.donors[0].id 
    : 'donor-1';
  
  const approveDonorRes = await request('PUT', `/api/admin/donors/${targetDonorId}/review`, {
    action: 'approve',
    admin_notes: 'Verified donor'
  }, token);
  console.log(`5. Approve Donor (${targetDonorId}):`, approveDonorRes.status, approveDonorRes.data);

  // 6. Fetch requests
  const reqRes = await request('GET', '/api/admin/requests', null, token);
  console.log('6. GET Blood Requests:', reqRes.status, 'Count:', reqRes.data.requests ? reqRes.data.requests.length : 0);

  // 7. Approve blood request
  const targetReqId = reqRes.data.requests && reqRes.data.requests.length > 0 
    ? reqRes.data.requests[0].id 
    : 'req_emergency_1';
  
  const approveReqRes = await request('PUT', `/api/admin/requests/${targetReqId}/review`, {
    action: 'approve',
    admin_notes: 'Approved broadcast'
  }, token);
  console.log(`7. Approve Blood Request (${targetReqId}):`, approveReqRes.status, approveReqRes.data);

  // 8. Test Reject blood request
  const rejectReqRes = await request('PUT', `/api/admin/requests/${targetReqId}/review`, {
    action: 'reject',
    admin_notes: 'Declined broadcast'
  }, token);
  console.log(`8. Reject Blood Request (${targetReqId}):`, rejectReqRes.status, rejectReqRes.data);

  console.log('--- ALL ADMIN APPROVAL TESTS COMPLETED ---');
}

runTest().catch(console.error);
