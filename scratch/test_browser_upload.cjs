const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\0119372b-33a3-4b53-b0eb-fc7d9b2c515e';

async function testUploadInBrowser() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));

  console.log('Navigating to http://localhost:3000/admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });

  // Switch to "Add 1004 Listing" tab
  console.log('Clicking Add Listing tab...');
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text && text.includes('Add 1004 Listing')) {
      await b.click();
      console.log('Clicked Add 1004 Listing tab');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  // Find the file input
  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) {
    console.error('File input not found!');
    await browser.close();
    return;
  }

  const sampleImagePath = path.join(__dirname, '..', 'client', 'public', 'jk-cube-logo.png');
  console.log('Uploading sample image to fileInput:', sampleImagePath);
  await fileInput.uploadFile(sampleImagePath);

  // Wait 2 seconds for upload and state update
  await new Promise(r => setTimeout(r, 2000));

  // Check error message
  const errorText = await page.evaluate(() => {
    const el = document.querySelector('div[style*="color: rgb(185, 28, 28)"]');
    return el ? el.innerText : null;
  });
  console.log('Error on page:', errorText);

  // Take screenshot of the form with uploaded photo
  const screenshotPath = path.join(OUTPUT_DIR, 'brand_upload_success.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
}

testUploadInBrowser().catch(console.error);
