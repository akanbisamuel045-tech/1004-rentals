const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\0119372b-33a3-4b53-b0eb-fc7d9b2c515e';

async function captureModalAndFooter() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // 1. Click Login/Sign up button
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text && text.includes('Login/Sign up')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_auth_modal_open.png') });
  console.log('Saved brand_auth_modal_open.png');

  // 2. Scroll to footer
  await page.keyboard.press('Escape'); // close modal
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand_footer.png') });
  console.log('Saved brand_footer.png');

  await browser.close();
}

captureModalAndFooter().catch(console.error);
