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
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });

  // Click Add Listing tab
  const btns = await page.$$('button');
  for (const b of btns) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text && text.includes('Add 1004 Listing')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  const fileInput = await page.$('input[type="file"]');
  const sampleImagePath = path.join(__dirname, '..', 'client', 'public', 'jk-cube-logo.png');
  await fileInput.uploadFile(sampleImagePath);
  await new Promise(r => setTimeout(r, 1500));

  // Scroll to Image Uploader
  await page.evaluate(() => {
    const el = document.querySelector('input[type="file"]');
    if (el) el.parentElement.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_upload_preview.png') });
  console.log('Saved brand_upload_preview.png');
  await browser.close();
})().catch(console.error);
