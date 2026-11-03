import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';

const outputDir = path.resolve('screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

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

async function clickSidebarItem(page, text) {
  await page.evaluate((targetText) => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const btn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase().includes(targetText.toLowerCase()));
    if (btn) btn.click();
  }, text);
  await sleep(1000);
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

  // 1. Login Page (Masuk)
  console.log('1. Capturing Halaman Masuk (Login Split Screen)...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('lawethub_is_logged_in', 'false');
    localStorage.removeItem('lawethub_user_id');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await saveScreenshot(page, '12_halaman_login_simpeg.png', false);

  // Login as Ahmad Fauzi (Pegawai)
  console.log('Logging in as Ahmad Fauzi (Pegawai)...');
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', '1');
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);

  // 2. Dashboard (Ringkasan Cuti)
  console.log('2. Capturing Dashboard Pegawai (Ringkasan Cuti)...');
  await saveScreenshot(page, '03_dashboard_dayoff.png', false);

  // 3. Saldo dan Hak Cuti
  console.log('3. Capturing Saldo dan Hak Cuti...');
  await clickSidebarItem(page, 'Saldo dan hak cuti');
  await saveScreenshot(page, '04_sisa_cuti_matriks_bkn.png', false);

  // 4. Ajukan Cuti
  console.log('4. Capturing Formulir Pengajuan Cuti...');
  await clickSidebarItem(page, 'Ajukan cuti');
  await saveScreenshot(page, '05_form_pengajuan_cuti.png', false);

  // 5. Riwayat Pengajuan
  console.log('5. Capturing Riwayat Pengajuan...');
  await clickSidebarItem(page, 'Riwayat pengajuan');
  await saveScreenshot(page, '02_beranda_alur_dan_komparasi.png', false);

  // 6. Kalender Unit
  console.log('6. Capturing Kalender Unit...');
  await clickSidebarItem(page, 'Kalender unit');
  await saveScreenshot(page, '06_kalender_cuti_bersama.png', false);

  // 7. Aturan Cuti (BKN) Buku Saku
  console.log('7. Capturing Aturan Cuti (Buku Saku BKN)...');
  await clickSidebarItem(page, 'Aturan cuti (BKN)');
  await saveScreenshot(page, '07_buku_saku_bkn_modal.png', false);

  // 8. Chatbot WhatsApp Drawer
  console.log('8. Capturing WhatsApp Chatbot Drawer...');
  await clickSidebarItem(page, 'Tanya via WhatsApp');
  await sleep(1000);
  await saveScreenshot(page, '08_chatbot_whatsapp.png', false);

  // Close WhatsApp Drawer
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.getAttribute('aria-label') === 'Tutup');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);

  // 9. Pertimbangan Atasan (Switch to Atasan Role)
  console.log('9. Switching to Atasan Role...');
  await page.evaluate(async () => {
    const res = await fetch('/api/employees');
    const employees = await res.json();
    const atasan = employees.find(e => e.role === 'atasan') || employees[1];
    localStorage.setItem('lawethub_user_id', String(atasan.id));
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);

  console.log('10. Capturing Pertimbangan Atasan...');
  await clickSidebarItem(page, 'Pertimbangan atasan');
  await saveScreenshot(page, '09_persetujuan_atasan.png', false);

  // 10. Rekap Pengajuan Admin (Switch to Admin Role)
  console.log('11. Switching to Admin Role...');
  await page.evaluate(async () => {
    const res = await fetch('/api/employees');
    const employees = await res.json();
    const admin = employees.find(e => e.role === 'admin') || employees.find(e => e.role === 'ppk') || employees[0];
    localStorage.setItem('lawethub_user_id', String(admin.id));
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);

  console.log('12. Capturing Rekap Pengajuan Admin...');
  await clickSidebarItem(page, 'Rekap pengajuan');
  await saveScreenshot(page, '10_rekapitulasi_admin.png', false);

  // 11. Cetak Formulir Lampiran II BKN
  console.log('13. Capturing Lampiran II BKN Print Preview...');
  await clickSidebarItem(page, 'Riwayat pengajuan');
  await sleep(600);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const docBtn = btns.find(b => b.textContent && (b.textContent.includes('Lihat formulir') || b.textContent.includes('Unduh PDF')));
    if (docBtn) docBtn.click();
  });
  await sleep(1200);
  await saveScreenshot(page, '11_formulir_lampiran_ii_bkn.png', false);

  // Reset to default pegawai
  await page.evaluate(() => {
    localStorage.setItem('lawethub_user_id', '1');
    localStorage.setItem('lawethub_is_logged_in', 'true');
  });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
