const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\0119372b-33a3-4b53-b0eb-fc7d9b2c515e';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  console.log('Capturing homepage hero & pills...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'homepage_hero_corporate.png') });
  console.log('Saved homepage_hero_corporate.png');

  console.log('Capturing corporate card on homepage...');
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'homepage_about_corporate.png') });
  console.log('Saved homepage_about_corporate.png');

  console.log('Capturing properties page...');
  await page.goto('http://localhost:3000/properties', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'properties_no_penthouse.png') });
  console.log('Saved properties_no_penthouse.png');

  console.log('Capturing admin dashboard...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_corporate.png') });
  console.log('Saved admin_corporate.png');

  await browser.close();
  console.log('Verification done!');
})().catch(console.error);
