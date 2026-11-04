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
  console.log('Testing responsiveness across viewport breakpoints...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Preset user
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-pns-1');
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });

  // 1. Mobile (375x812 - iPhone X/12/13) - Closed Menu
  console.log('Capturing 1. Mobile 375x812 (Dashboard)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);
  await page.screenshot({ path: path.join(artifactDir, 'resp_1_mobile_dashboard.png') });

  // 2. Mobile (375x812) - Open Sidebar Drawer
  console.log('Capturing 2. Mobile 375x812 (Sidebar Drawer Open)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('header button'));
    const menuBtn = btns.find(b => b.textContent && b.textContent.includes('Menu'));
    if (menuBtn) menuBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(artifactDir, 'resp_2_mobile_drawer_open.png') });

  // Close drawer & navigate to Ajukan Cuti on mobile
  console.log('Capturing 3. Mobile 375x812 (Form Ajukan Cuti)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const ajukanBtn = btns.find(b => b.textContent && b.textContent.includes('Ajukan cuti'));
    if (ajukanBtn) ajukanBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(artifactDir, 'resp_3_mobile_form.png') });

  // 4. Tablet (768x1024 - iPad Portrait)
  console.log('Capturing 4. Tablet 768x1024 (iPad Portrait)...');
  await page.setViewport({ width: 768, height: 1024, isMobile: false, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);
  await page.screenshot({ path: path.join(artifactDir, 'resp_4_tablet_dashboard.png') });

  // 5. Laptop (1024x768 - Desktop Breakpoint lg)
  console.log('Capturing 5. Laptop 1024x768...');
  await page.setViewport({ width: 1024, height: 768, isMobile: false, deviceScaleFactor: 1.5 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);
  await page.screenshot({ path: path.join(artifactDir, 'resp_5_laptop_dashboard.png') });

  // 6. Admin Table on Mobile (Check horizontal table scrolling & filter stack)
  console.log('Capturing 6. Admin Table on Mobile 375x812...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', 'emp-admin-1');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1000);

  // Open drawer and click Rekap pengajuan
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('header button'));
    const menuBtn = btns.find(b => b.textContent && b.textContent.includes('Menu'));
    if (menuBtn) menuBtn.click();
  });
  await sleep(600);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const rekapBtn = btns.find(b => b.textContent && b.textContent.includes('Rekap pengajuan'));
    if (rekapBtn) rekapBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(artifactDir, 'resp_6_mobile_admin_table.png') });

  console.log('Responsiveness test completed successfully!');
  await browser.close();
}

run().catch(console.error);