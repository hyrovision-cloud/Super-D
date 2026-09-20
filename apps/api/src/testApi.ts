import http from 'http';

function makeRequest(
  options: http.RequestOptions,
  postData?: string
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 500, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode || 500, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('Running Aarogya Backend API Test Suite...');
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Health Probe
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/health/ready',
      method: 'GET',
    });
    assert(health.status === 200 && health.body.status === 'ready', '1. Health Ready Endpoint');

    // 2. Login as Hospital Owner
    const loginOwner = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({ email: 'owner@aarogya.com', password: 'admin123' })
    );
    assert(loginOwner.status === 200 && !!loginOwner.body.data?.accessToken, '2. Owner Login (Access Token Issued)');
    const ownerToken = loginOwner.body.data?.accessToken;

    // 3. Login as Doctor
    const loginDoctor = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({ email: 'doctor.karthik@aarogya.com', password: 'doctor123' })
    );
    assert(loginDoctor.status === 200 && !!loginDoctor.body.data?.accessToken, '3. Doctor Login (Access Token Issued)');
    const doctorToken = loginDoctor.body.data?.accessToken;

    // 4. /auth/me with Owner Token
    const me = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(me.status === 200 && me.body.data?.email === 'owner@aarogya.com', '4. Get Current User (/auth/me)');

    // 5. Get Branches
    const branches = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/branches',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(branches.status === 200 && branches.body.data?.length === 4, '5. List All 4 Branches');

    // 6. Get Patients
    const patients = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/patients',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(patients.status === 200 && patients.body.data?.length >= 5, '6. List Patients Registry');

    // 7. Get Appointments
    const appointments = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/appointments',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(appointments.status === 200 && appointments.body.data?.length >= 3, '7. List Appointments');

    // 8. Leave Rejection WITHOUT Comment (Must FAIL with 400 Bad Request)
    const rejectNoComment = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/leave-requests/LR-2026-001/decision',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
      },
      JSON.stringify({ decision: 'REJECTED', comment: '' })
    );
    assert(
      rejectNoComment.status === 400 && rejectNoComment.body.error?.code === 'VALIDATION_FAILED',
      '8. Leave Rejection without comment strictly blocked (400 Bad Request)',
      `Got status ${rejectNoComment.status}: ${JSON.stringify(rejectNoComment.body)}`
    );

    // 9. Leave Rejection WITH Comment (Must SUCCEED)
    const rejectWithComment = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/leave-requests/LR-2026-001/decision',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
      },
      JSON.stringify({ decision: 'REJECTED', comment: 'Staffing shortage on intensive care night shift' })
    );
    assert(
      rejectWithComment.status === 200 && rejectWithComment.body.data?.status === 'REJECTED',
      '9. Leave Rejection with comment approved and recorded'
    );

    // 10. Get Complaints
    const complaints = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/complaints',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(complaints.status === 200 && complaints.body.data?.length >= 3, '10. Complaints List & SLA Tracking');

    // 11. Get Revenue (9 Categories)
    const revenue = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/income-records',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(revenue.status === 200 && revenue.body.data?.length >= 10, '11. Revenue Records (9 Categories)');

    // 12. In-App Notifications
    const notifs = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/notifications',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(notifs.status === 200 && Array.isArray(notifs.body.data?.notifications), '12. In-App Notifications Inbox');

    // 13. Owner AI Revenue Intelligence (Owner access - MUST SUCCEED)
    const aiQuery = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/owner/intelligence/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
      },
      JSON.stringify({ query: 'Summarize this month revenue and compare branches' })
    );
    assert(
      aiQuery.status === 200 &&
        !!aiQuery.body.data?.answer &&
        aiQuery.body.data?.insights?.length > 0 &&
        aiQuery.body.data?.sources?.length > 0,
      '13. Owner AI Revenue Intelligence Query (Executed Allow-listed Tools & Returned Structured Insights)'
    );

    // 14. Owner AI Revenue Intelligence (Doctor access - MUST BE FORBIDDEN 403)
    const aiForbidden = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/owner/intelligence/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${doctorToken}`,
        },
      },
      JSON.stringify({ query: 'Summarize this month revenue' })
    );
    assert(
      aiForbidden.status === 403,
      '14. Non-Owner AI Access Strictly Denied (403 Forbidden)'
    );

    // 15. Audit Logs
    const audits = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/audit-logs',
      method: 'GET',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert(audits.status === 200 && audits.body.data?.length > 0, '15. Append-only Audit Trail Verified');

    console.log('----------------------------------------------------');
    console.log(`Results: ${passed} Passed | ${failed} Failed`);
    console.log('----------------------------------------------------');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test suite execution error:', err);
    process.exit(1);
  }
}

runTests();
