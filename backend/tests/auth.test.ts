import http from 'http';
import app from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { seedAuthData } from '../src/seed/seedAuth';
import { logger } from '../src/utils/logger';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTestSuite() {
  logger.info('========================================================');
  logger.info(' Super D Hospital Platform - Auth Test Suite Starting   ');
  logger.info('========================================================');

  // 1. Ensure DB connection and fresh seed data
  await connectDatabase();
  await seedAuthData();

  // 2. Start server on ephemeral port for integration testing
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address() as any;
  const baseUrl = `http://127.0.0.1:${addr.port}/api/v1`;

  let authCookie = '';
  let authToken = '';

  async function testCase(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      results.push({ name, passed: true });
      console.log(`  [PASS] ${name}`);
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Valid Login (POST /auth/login)
    // -------------------------------------------------------------
    await testCase('1. Valid login with correct credentials', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'superadmin@superd.demo',
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const rawCookie = res.headers.get('set-cookie');
      assert(!!rawCookie, 'Set-Cookie header must be present');
      assert(rawCookie!.includes('superd_auth_token'), 'Cookie must contain superd_auth_token');
      assert(rawCookie!.toLowerCase().includes('httponly'), 'Cookie must be HttpOnly');

      authCookie = rawCookie!.split(';')[0]; // Extract "superd_auth_token=..."

      const json = await res.json();
      assert(json.success === true, 'Response must be success: true');
      assert(json.data.email === 'superadmin@superd.demo', 'Email must match');
      assert(json.data.role === 'Super Admin', 'Role must match Super Admin');
      assert(!json.data.password, 'Password must never be returned');
      assert(!json.data.passwordHash, 'PasswordHash must never be returned');
      assert(Array.isArray(json.data.permissions), 'Permissions must be an array');
      assert(json.data.permissions.includes('user.manage'), 'Super admin must have user.manage');
      assert(json.data.assignedBranches.length === 4, 'Super admin must have all 4 branches');

      authToken = json.data.token;
      assert(!!authToken, 'Token must be provided in response for API consumers');
    });

    // -------------------------------------------------------------
    // Test 2: Wrong Password
    // -------------------------------------------------------------
    await testCase('2. Wrong password returns 401 INVALID_CREDENTIALS', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'superadmin@superd.demo',
          password: 'WrongPassword123!',
        }),
      });

      assert(res.status === 401, `Expected 401, got ${res.status}`);
      const json = await res.json();
      assert(json.success === false, 'success must be false');
      assert(json.error.code === 'INVALID_CREDENTIALS', `Expected INVALID_CREDENTIALS, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 3: Unknown User
    // -------------------------------------------------------------
    await testCase('3. Unknown user email returns 401 INVALID_CREDENTIALS', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent.doctor@superd.demo',
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 401, `Expected 401, got ${res.status}`);
      const json = await res.json();
      assert(json.success === false, 'success must be false');
      assert(json.error.code === 'INVALID_CREDENTIALS', `Expected INVALID_CREDENTIALS, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 4: Inactive User
    // -------------------------------------------------------------
    await testCase('4. Inactive user returns 403 ACCOUNT_INACTIVE', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'inactive@superd.demo',
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 403, `Expected 403, got ${res.status}`);
      const json = await res.json();
      assert(json.error.code === 'ACCOUNT_INACTIVE', `Expected ACCOUNT_INACTIVE, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 5: Suspended User
    // -------------------------------------------------------------
    await testCase('5. Suspended user returns 403 ACCOUNT_DISABLED', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'suspended@superd.demo',
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 403, `Expected 403, got ${res.status}`);
      const json = await res.json();
      assert(json.error.code === 'ACCOUNT_DISABLED', `Expected ACCOUNT_DISABLED, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 6: Missing Email
    // -------------------------------------------------------------
    await testCase('6. Missing email returns 400 VALIDATION_ERROR', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 400, `Expected 400, got ${res.status}`);
      const json = await res.json();
      assert(json.error.code === 'VALIDATION_ERROR', `Expected VALIDATION_ERROR, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 7: Missing Password
    // -------------------------------------------------------------
    await testCase('7. Missing password returns 400 VALIDATION_ERROR', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'superadmin@superd.demo',
        }),
      });

      assert(res.status === 400, `Expected 400, got ${res.status}`);
      const json = await res.json();
      assert(json.error.code === 'VALIDATION_ERROR', `Expected VALIDATION_ERROR, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 8: Malformed Email
    // -------------------------------------------------------------
    await testCase('8. Malformed email returns 400 VALIDATION_ERROR', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 400, `Expected 400, got ${res.status}`);
      const json = await res.json();
      assert(json.error.code === 'VALIDATION_ERROR', `Expected VALIDATION_ERROR, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 9: Password Policy (Short password < 8 chars)
    // -------------------------------------------------------------
    await testCase('9. Password shorter than 8 characters returns 400 VALIDATION_ERROR', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'superadmin@superd.demo',
          password: 'short',
        }),
      });

      assert(res.status === 400, `Expected 400, got ${res.status}`);
      const json = await res.json();
      assert(json.error.code === 'VALIDATION_ERROR', `Expected VALIDATION_ERROR, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 10: Authenticated /me via Cookie
    // -------------------------------------------------------------
    await testCase('10. GET /auth/me with HttpOnly cookie returns user profile', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          Cookie: authCookie,
        },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = await res.json();
      assert(json.success === true, 'Response must be success: true');
      assert(json.data.email === 'superadmin@superd.demo', 'Email must match');
      assert(json.data.role === 'Super Admin', 'Role must match Super Admin');
      assert(json.data.status === 'ACTIVE', 'User status must be ACTIVE');
    });

    // -------------------------------------------------------------
    // Test 11: Authenticated /me via Bearer Token Header
    // -------------------------------------------------------------
    await testCase('11. GET /auth/me with Bearer token header returns user profile', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = await res.json();
      assert(json.success === true, 'Response must be success: true');
      assert(json.data.email === 'superadmin@superd.demo', 'Email must match');
    });

    // -------------------------------------------------------------
    // Test 12: Unauthenticated /me (No credentials)
    // -------------------------------------------------------------
    await testCase('12. GET /auth/me with no session returns 401 UNAUTHORIZED', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: 'GET',
      });

      assert(res.status === 401, `Expected 401, got ${res.status}`);
      const json = await res.json();
      assert(json.success === false, 'success must be false');
      assert(json.error.code === 'UNAUTHORIZED', `Expected UNAUTHORIZED, got ${json.error.code}`);
    });

    // -------------------------------------------------------------
    // Test 13: Invalid/Forged Token
    // -------------------------------------------------------------
    await testCase('13. GET /auth/me with forged token returns 401 UNAUTHORIZED', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer forged.tampered.signature123',
        },
      });

      assert(res.status === 401, `Expected 401, got ${res.status}`);
      const json = await res.json();
      assert(json.success === false, 'success must be false');
    });

    // -------------------------------------------------------------
    // Test 14: Logout Clears Cookie (POST /auth/logout)
    // -------------------------------------------------------------
    await testCase('14. POST /auth/logout clears HttpOnly session cookie', async () => {
      const res = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Cookie: authCookie,
        },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const setCookie = res.headers.get('set-cookie');
      assert(!!setCookie, 'Set-Cookie header must be present on logout');
      assert(
        setCookie!.includes('Max-Age=0') || setCookie!.includes('Expires=Thu, 01 Jan 1970'),
        'Cookie must be instructed to expire immediately'
      );
    });

    // -------------------------------------------------------------
    // Test 15 & 16: Role & Permissions from Database (Branch Doctor)
    // -------------------------------------------------------------
    let doctorToken = '';
    await testCase('15 & 16. Doctor login receives database-authoritative role & clinical permissions', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'doctor.trichy@superd.demo',
          password: 'demo2026@superd',
        }),
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = await res.json();
      assert(json.data.role === 'Branch Doctor', 'Role must be Branch Doctor');
      assert(json.data.permissions.includes('patient.view'), 'Must have patient.view');
      assert(json.data.permissions.includes('medical_record.view'), 'Must have medical_record.view');
      assert(json.data.permissions.includes('patient.discharge'), 'Must have patient.discharge');
      assert(!json.data.permissions.includes('user.manage'), 'Doctor must NOT have user.manage');
      assert(!json.data.permissions.includes('advertisement.create'), 'Doctor must NOT have advertisement.create');

      doctorToken = json.data.token;
    });

    // -------------------------------------------------------------
    // Test 17: Branch Scope Integrity
    // -------------------------------------------------------------
    await testCase('17. Doctor login branch scope strictly limited to primary branch', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
      });

      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = await res.json();
      assert(json.data.primaryBranchId === 'branch-trichy', 'Primary branch must be branch-trichy');
      assert(
        json.data.assignedBranches.length === 1 && json.data.assignedBranches[0] === 'branch-trichy',
        'Assigned branches must strictly be [branch-trichy]'
      );
    });

    // -------------------------------------------------------------
    // Test 18: Privilege Escalation Prevention
    // -------------------------------------------------------------
    await testCase('18. Privilege Escalation Prevention: Doctor cannot access non-assigned branch records', async () => {
      // Doctor attempts to query patient records specifying unauthorized branch (e.g. branch-chennai)
      const res = await fetch(`${baseUrl}/patients?branchId=branch-chennai`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
      });

      // Backend scope middleware must return 403 Forbidden
      assert(res.status === 403, `Expected 403 Forbidden for cross-branch access, got ${res.status}`);
      const json = await res.json();
      assert(json.success === false, 'Must be rejected');
      assert(json.error.code === 'FORBIDDEN', `Expected FORBIDDEN, got ${json.error.code}`);
    });
  } finally {
    // 3. Graceful Teardown
    server.close();
    await disconnectDatabase();
  }

  // Summary
  console.log('\n========================================================');
  console.log(` Test Summary: ${results.filter((r) => r.passed).length}/${results.length} tests passed`);
  console.log('========================================================\n');

  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
