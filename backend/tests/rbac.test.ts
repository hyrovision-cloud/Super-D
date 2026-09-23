import http from 'http';
import app from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { seedAuthData } from '../src/seed/seedAuth';

const password = 'demo2026@superd';
let passed = 0;
let failed = 0;
function assert(condition: boolean, message: string) { if (!condition) throw new Error(message); }

async function run() {
  await connectDatabase();
  await seedAuthData();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const base = `http://127.0.0.1:${port}/api/v1`;

  async function token(email: string) {
    const response = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    assert(response.status === 200, `${email} login returned ${response.status}`);
    return (await response.json()).data.token as string;
  }
  async function request(authToken: string, path: string, init: RequestInit = {}) {
    return fetch(`${base}${path}`, { ...init, headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
  }
  async function test(name: string, fn: () => Promise<void>) {
    try { await fn(); passed += 1; console.log(`  [PASS] ${name}`); }
    catch (error: any) { failed += 1; console.error(`  [FAIL] ${name}: ${error.message}`); }
  }

  try {
    const owner = await token('owner@superd.demo');
    const globalAdmin = await token('admin@superd.demo');
    const manager = await token('manager.trichy@superd.demo');
    const doctor = await token('doctor.trichy@superd.demo');
    const hr = await token('hr@superd.demo');
    const finance = await token('finance@superd.demo');
    const marketing = await token('marketing@superd.demo');
    const complaints = await token('complaints@superd.demo');
    const employee = await token('employee.trichy@superd.demo');

    await test('Owner can access explicitly permitted organization finance', async () => assert((await request(owner, '/dashboard/finance/summary')).status === 200, 'owner finance denied'));
    await test('Global Admin is distinct and cannot access owner dashboard', async () => assert((await request(globalAdmin, '/dashboard/owner/summary')).status === 403, 'global admin received owner access'));
    await test('Branch Manager cannot assign themselves Owner', async () => {
      const me = await request(manager, '/auth/me'); const id = (await me.json()).data.id;
      assert((await request(manager, `/users/${id}`, { method: 'PATCH', body: JSON.stringify({ role: 'Hospital Owner' }) })).status === 403, 'privilege escalation was not rejected');
    });
    await test('Branch Manager cannot request another branch revenue', async () => assert((await request(manager, '/revenue?branchId=branch-chennai')).status === 403, 'cross-branch revenue was not rejected'));
    await test('Doctor can access appointments', async () => assert((await request(doctor, '/appointments')).status === 200, 'doctor appointments denied'));
    await test('Doctor cannot delete patients without patient.delete', async () => assert((await request(doctor, '/patients/UHID-TRY-2026-0001', { method: 'DELETE' })).status === 403, 'doctor patient delete was not rejected'));
    await test('HR can access employees', async () => assert((await request(hr, '/employees')).status === 200, 'HR employees denied'));
    await test('HR cannot access revenue', async () => assert((await request(hr, '/revenue')).status === 403, 'HR revenue allowed'));
    await test('Finance can access revenue', async () => assert((await request(finance, '/revenue')).status === 200, 'finance revenue denied'));
    await test('Finance cannot access roles', async () => assert((await request(finance, '/roles')).status === 403, 'finance roles allowed'));
    await test('Marketing can access advertisements', async () => assert((await request(marketing, '/advertisements')).status === 200, 'marketing advertisements denied'));
    await test('Marketing cannot access revenue', async () => assert((await request(marketing, '/revenue')).status === 403, 'marketing revenue allowed'));
    await test('Complaints manager can access complaints', async () => assert((await request(complaints, '/complaints')).status === 200, 'complaints access denied'));
    await test('Complaints manager cannot access employees', async () => assert((await request(complaints, '/employees')).status === 403, 'complaints manager employee access allowed'));
    await test('Normal employee cannot access roles', async () => assert((await request(employee, '/roles')).status === 403, 'employee role access allowed'));
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await disconnectDatabase();
  }
  console.log(`RBAC summary: ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

run().catch(async (error) => { console.error(error); await disconnectDatabase(); process.exit(1); });
