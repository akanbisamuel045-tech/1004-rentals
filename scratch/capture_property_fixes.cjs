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

  console.log('Capturing full property detail page...');
  await page.goto('http://localhost:3000/properties/prop-1789509328166', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fixed_property_detail_full.png'), fullPage: true });
  console.log('Saved fixed_property_detail_full.png');

  console.log('Capturing properties listing page...');
  await page.goto('http://localhost:3000/properties', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'fixed_properties_page_full.png'), fullPage: true });
  console.log('Saved fixed_properties_page_full.png');

  await browser.close();
  console.log('All verification screenshots saved successfully!');
})().catch(console.error);
