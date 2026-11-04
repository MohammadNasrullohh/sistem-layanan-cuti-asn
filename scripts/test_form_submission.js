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
  console.log('Testing form submission with FormData...');
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

  // Navigate to Ajukan cuti
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Ajukan cuti'));
    if (btn) btn.click();
  });
  await sleep(1000);

  // Click Submit button: "Kirim ke atasan"
  console.log('Clicking "Kirim ke atasan"...');
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.includes('Kirim ke atasan')
    );
    if (submitBtn) submitBtn.click();
  });

  await sleep(2000);

  // Check if error banner exists
  const errorText = await page.evaluate(() => {
    const banner = document.querySelector('.bg-\\[\\#fbf3e2\\].border-\\[\\#e3cf9c\\].text-\\[\\#1c2530\\]');
    return banner ? banner.textContent : null;
  });

  console.log('Error banner on submission:', errorText);

  // Check if success header exists
  const successTitle = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(
      el => el.textContent && el.textContent.includes('berhasil didaftarkan')
    );
    return h2 ? h2.textContent : null;
  });

  console.log('Success title:', successTitle);

  const screenshotPath = path.join(artifactDir, 'form_submission_success.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
}

run().catch(console.error);