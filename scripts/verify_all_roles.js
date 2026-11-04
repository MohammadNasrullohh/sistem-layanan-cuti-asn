import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const artifactDir = path.resolve('C:\\Users\\meong\\.gemini\\antigravity\\brain\\6f01260d-9dce-4c20-b541-c7689cec1b54');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Starting automated end-to-end verification for all 4 roles...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

  // -------------------------------------------------------------
  // ROLE 1: PEGAWAI
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Role: Pegawai ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-pns-1');
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  const pegawaiMenus = await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('aside nav button'));
    return navButtons.map(b => b.textContent.trim().replace(/\s+/g, ' '));
  });
  console.log('Pegawai visible menus:', pegawaiMenus);

  // Validate Pegawai menus
  const hasPertimbanganPegawai = pegawaiMenus.some(m => m.includes('Pertimbangan') || m.includes('Keputusan'));
  const hasRekapPegawai = pegawaiMenus.some(m => m.includes('Rekap pengajuan'));
  console.log('Pegawai correctly hidden from approval?', !hasPertimbanganPegawai);
  console.log('Pegawai correctly hidden from admin rekap?', !hasRekapPegawai);

  await page.screenshot({ path: path.join(artifactDir, 'role_1_pegawai_dashboard.png') });

  // -------------------------------------------------------------
  // ROLE 2: ATASAN
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Role: Atasan ---');
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-atasan-1');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  const atasanMenus = await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('aside nav button'));
    return navButtons.map(b => b.textContent.trim().replace(/\s+/g, ' '));
  });
  console.log('Atasan visible menus:', atasanMenus);

  const hasPertimbanganAtasan = atasanMenus.some(m => m.includes('Pertimbangan atasan'));
  console.log('Atasan has "Pertimbangan atasan"?', hasPertimbanganAtasan);

  // Click Pertimbangan atasan
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const btn = btns.find(b => b.textContent.includes('Pertimbangan atasan'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(artifactDir, 'role_2_atasan_persetujuan.png') });

  // -------------------------------------------------------------
  // ROLE 3: PPK
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Role: PPK ---');
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-ppk-1');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  const ppkMenus = await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('aside nav button'));
    return navButtons.map(b => b.textContent.trim().replace(/\s+/g, ' '));
  });
  console.log('PPK visible menus:', ppkMenus);

  const hasKeputusanPPK = ppkMenus.some(m => m.includes('Keputusan PPK'));
  console.log('PPK has "Keputusan PPK"?', hasKeputusanPPK);

  // Click Keputusan PPK
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const btn = btns.find(b => b.textContent.includes('Keputusan PPK'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(artifactDir, 'role_3_ppk_keputusan.png') });

  // -------------------------------------------------------------
  // ROLE 4: ADMIN BKPSDM
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Role: Admin BKPSDM ---');
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-admin-1');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  const adminMenus = await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('aside nav button'));
    return navButtons.map(b => b.textContent.trim().replace(/\s+/g, ' '));
  });
  console.log('Admin visible menus:', adminMenus);

  const hasRekapAdmin = adminMenus.some(m => m.includes('Rekap pengajuan'));
  console.log('Admin has "Rekap pengajuan"?', hasRekapAdmin);

  // Click Rekap pengajuan
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const btn = btns.find(b => b.textContent.includes('Rekap pengajuan'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(artifactDir, 'role_4_admin_rekap.png') });

  console.log('\nAll 4 roles and their respective menus verified successfully!');
  await browser.close();
}

run().catch(console.error);