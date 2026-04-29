// Simple smoke test script for PrepVault backend
// Usage: node testing/api_smoke_test.js

// Use global fetch if available (Node 18+), otherwise dynamically import node-fetch
let fetch
try {
  fetch = global.fetch || require('node-fetch')
} catch (e) {
  fetch = (...args) => import('node-fetch').then(({default: fn}) => fn(...args))
}
const BASE = process.env.BASE_URL || 'http://localhost:5000';

async function run() {
  console.log('PrepVault smoke test starting against', BASE);

  // 1) Register
  const registerRes = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name: 'Smoke Tester', email: `smoke${Date.now()}@test.com`, password: 'Smoke1234' })
  });
  const regBody = await registerRes.json().catch(()=>null);
  console.log('Register:', registerRes.status, regBody?.message || regBody);

  // 2) Login
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email: regBody?.data?.email || regBody?.email || '', password: 'Smoke1234' })
  });
  const loginBody = await loginRes.json().catch(()=>null);
  console.log('Login:', loginRes.status, loginBody?.message || loginBody?.data ? 'ok' : loginBody);
  const token = loginBody?.data?.token || loginBody?.token || null;
  if (!token) { console.error('No token, stopping tests'); return; }

  // 3) Create an experience
  const expRes = await fetch(`${BASE}/api/experiences`, {
    method: 'POST', headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({ company: 'SmokeCorp', role: 'Tester', rounds: 1, difficulty: 2, questions: ['Q1?'], tags: ['Smoke'], tips: 'none' })
  });
  const expBody = await expRes.json().catch(()=>null);
  console.log('Create experience:', expRes.status, expBody?.data? 'created' : expBody);

  // 4) Get experiences
  const listRes = await fetch(`${BASE}/api/experiences`);
  const listBody = await listRes.json().catch(()=>null);
  console.log('List experiences:', listRes.status, Array.isArray(listBody?.data) ? `${listBody.data.length} items` : listBody);

  // 5) Get profile
  const profileRes = await fetch(`${BASE}/api/users/me`, { headers: {'Authorization': `Bearer ${token}`} });
  const profileBody = await profileRes.json().catch(()=>null);
  console.log('Profile:', profileRes.status, profileBody?.data ? profileBody.data.email : profileBody);

  console.log('Smoke test finished');
}

run().catch(err => { console.error('Smoke test error', err); process.exit(1); });
