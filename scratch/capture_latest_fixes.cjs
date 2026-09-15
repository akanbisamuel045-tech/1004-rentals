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

  console.log('Capturing homepage hero with new images...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'homepage_hero_new_images.png') });
  console.log('Saved homepage_hero_new_images.png');

  console.log('Capturing footer section...');
  const footerElement = await page.$('footer');
  if (footerElement) {
    await footerElement.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'footer_no_admin_portal.png') });
    console.log('Saved footer_no_admin_portal.png');
  }

  console.log('Capturing admin dashboard amenities list...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click on "+ Add New Listing" button/tab
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Add New Listing')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 800));
      break;
    }
  }

  // Scroll to amenities
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const amLabel = labels.find(l => l.textContent.includes('Amenities'));
    if (amLabel) amLabel.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_amenities_list.png') });
  console.log('Saved admin_amenities_list.png');

  await browser.close();
  console.log('Verification finished!');
})().catch(console.error);
