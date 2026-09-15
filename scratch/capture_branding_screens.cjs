const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\0119372b-33a3-4b53-b0eb-fc7d9b2c515e';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Viewport (1600x1000)
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  
  console.log('Navigating to Desktop Homepage...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_desktop_home.png') });
  console.log('Saved brand_desktop_home.png');

  // 2. Desktop Properties Page
  console.log('Navigating to Desktop Properties Page...');
  await page.goto('http://localhost:3000/properties', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_desktop_properties.png') });
  console.log('Saved brand_desktop_properties.png');

  // 3. Open Auth Modal
  console.log('Opening Auth Modal...');
  await page.click('.nav-pill-item:has(svg)'); // Click the user circle in navbar or trigger auth modal
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_auth_modal.png') });
  console.log('Saved brand_auth_modal.png');

  // 4. Admin Dashboard
  console.log('Navigating to Admin Dashboard...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_admin_dashboard.png') });
  console.log('Saved brand_admin_dashboard.png');

  // 5. Mobile Viewport (iPhone 14 / standard mobile 390x844)
  console.log('Navigating to Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_mobile_home.png') });
  console.log('Saved brand_mobile_home.png');

  await browser.close();
  console.log('All branding screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
