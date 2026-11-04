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
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-pns-1');
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  // 1. Click role dropdown trigger in sidebar
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const roleBtn = btns.find(b => b.textContent && b.textContent.includes('Pegawai'));
    if (roleBtn) roleBtn.click();
  });
  await sleep(600);

  const sidebarDropdownPath = path.join(artifactDir, 'sidebar_dropdown_open.png');
  await page.screenshot({ path: sidebarDropdownPath });
  console.log('Saved sidebar dropdown open:', sidebarDropdownPath);

  // 2. Navigate to Ajukan Cuti
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ajukanBtn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'ajukan cuti');
    if (ajukanBtn) ajukanBtn.click();
  });
  await sleep(1000);

  // 3. Open jenis cuti dropdown
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const jenisBtn = btns.find(b => b.textContent && b.textContent.includes('Cuti Tahunan'));
    if (jenisBtn) jenisBtn.click();
  });
  await sleep(600);

  const formDropdownPath = path.join(artifactDir, 'form_dropdown_open.png');
  await page.screenshot({ path: formDropdownPath });
  console.log('Saved form dropdown open:', formDropdownPath);

  // 4. Navigate to Rekap Admin
  // First switch to admin
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-admin-1');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const rekapBtn = btns.find(b => b.textContent && b.textContent.includes('Rekap pengajuan'));
    if (rekapBtn) rekapBtn.click();
  });
  await sleep(1000);

  // Open status filter dropdown
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const statusBtn = btns.find(b => b.textContent && b.textContent.includes('Semua status'));
    if (statusBtn) statusBtn.click();
  });
  await sleep(600);

  const adminDropdownPath = path.join(artifactDir, 'admin_dropdown_open.png');
  await page.screenshot({ path: adminDropdownPath });
  console.log('Saved admin dropdown open:', adminDropdownPath);

  await browser.close();
}

run().catch(console.error);