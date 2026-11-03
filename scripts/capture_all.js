import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';

const outputDir = path.resolve('screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Artifact directory if present
const artifactDir = path.resolve('C:\\Users\\meong\\.gemini\\antigravity\\brain\\6f01260d-9dce-4c20-b541-c7689cec1b54');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveScreenshot(page, filename, fullPage = false) {
  const localPath = path.join(outputDir, filename);
  await page.screenshot({ path: localPath, fullPage });
  console.log(`Saved screenshot: ${localPath}`);

  if (fs.existsSync(artifactDir)) {
    const artPath = path.join(artifactDir, filename);
    fs.copyFileSync(localPath, artPath);
  }
}

async function run() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

  // 1. Beranda (Landing Page)
  console.log('1. Capturing Beranda...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Take Hero screenshot
  await saveScreenshot(page, '01_beranda_hero.png', false);

  // Scroll to flow & comparison section
  await page.evaluate(() => window.scrollBy(0, 950));
  await sleep(800);
  await saveScreenshot(page, '02_beranda_alur_dan_komparasi.png', false);

  // 2. Dashboard
  console.log('2. Capturing Dashboard...');
  await page.evaluate(() => {
    // Click on nav button with text "Dashboard"
    const btns = Array.from(document.querySelectorAll('button'));
    const dashBtn = btns.find(b => b.textContent && b.textContent.includes('Dashboard') && !b.textContent.includes('LawetHub'));
    if (dashBtn) dashBtn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '03_dashboard_dayoff.png', false);

  // 3. Sisa Cuti
  console.log('3. Capturing Sisa Cuti...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sisa Cuti'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '04_sisa_cuti_matriks_bkn.png', false);

  // 4. Formulir Pengajuan Cuti
  console.log('4. Capturing Formulir Pengajuan Cuti...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Ajukan Cuti'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '05_form_pengajuan_cuti.png', false);

  // 5. Kalender Cuti Bersama
  console.log('5. Capturing Kalender Cuti Bersama...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Kalender'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '06_kalender_cuti_bersama.png', false);

  // 6. Buku Saku BKN Modal
  console.log('6. Capturing Buku Saku BKN...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Buku Saku'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await saveScreenshot(page, '07_buku_saku_bkn_modal.png', false);

  // Close Buku Saku modal if open
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.title === 'Tutup' || (b.textContent && b.textContent.includes('Tutup')));
    if (closeBtn) closeBtn.click();
  });
  await sleep(800);

  // 7. Chatbot WhatsApp Drawer
  console.log('7. Capturing Chatbot WhatsApp...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Chatbot WA'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await saveScreenshot(page, '08_chatbot_whatsapp.png', false);

  // Close WA drawer
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const btn = closeBtns.find(b => b.querySelector('svg') && b.closest('[class*="fixed"]'));
    if (btn) btn.click();
  });
  await sleep(800);

  // 8. Persetujuan & Rekapitulasi (Switch to Admin Role)
  console.log('8. Switching to Admin user for Persetujuan & Rekapitulasi...');
  await page.evaluate(async () => {
    const res = await fetch('/api/employees');
    const employees = await res.json();
    const admin = employees.find(e => e.role === 'admin') || employees[0];
    localStorage.setItem('cuti_auth_user', JSON.stringify(admin));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);

  // Capture Persetujuan
  console.log('9. Capturing Persetujuan Atasan/PPK...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Persetujuan'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '09_persetujuan_atasan.png', false);

  // Capture Rekapitulasi
  console.log('10. Capturing Rekapitulasi Admin...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Rekapitulasi'));
    if (btn) btn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '10_rekapitulasi_admin.png', false);

  // 11. Formulir Lampiran II BKN (Export Print preview)
  console.log('11. Capturing Formulir Lampiran II BKN...');
  // Click first cetak button in Rekapitulasi or requests
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cetakBtn = btns.find(b => b.textContent && b.textContent.includes('Cetak') || b.title === 'Ekspor Dokumen Cuti BKN');
    if (cetakBtn) cetakBtn.click();
  });
  await sleep(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await saveScreenshot(page, '11_formulir_lampiran_ii_bkn.png', false);

  // 12. Switch to standard user back
  await page.evaluate(async () => {
    const res = await fetch('/api/employees');
    const employees = await res.json();
    const pns = employees.find(e => e.role === 'pegawai') || employees[0];
    localStorage.setItem('cuti_auth_user', JSON.stringify(pns));
  });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
