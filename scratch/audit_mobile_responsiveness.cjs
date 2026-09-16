const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\0119372b-33a3-4b53-b0eb-fc7d9b2c515e';

const VIEWPORTS = [
  { name: '320px-portrait', width: 320, height: 650 },
  { name: '360px-portrait', width: 360, height: 740 },
  { name: '375px-portrait', width: 375, height: 667 },
  { name: '390px-portrait', width: 390, height: 844 },
  { name: '414px-portrait', width: 414, height: 896 },
  { name: '430px-portrait', width: 430, height: 932 },
  { name: '640px-landscape', width: 640, height: 360 }
];

const PAGES_TO_TEST = [
  { name: 'homepage', url: 'http://localhost:3000/' },
  { name: 'properties', url: 'http://localhost:3000/properties' },
  { name: 'category-2bed', url: 'http://localhost:3000/apartments/2-bedroom' },
  { name: 'property-detail', url: 'http://localhost:3000/properties/1' },
  { name: 'contact', url: 'http://localhost:3000/contact' },
  { name: 'admin', url: 'http://localhost:3000/admin' },
  { name: 'user-dashboard', url: 'http://localhost:3000/dashboard' }
];

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const hasHorizontalScroll = scrollWidth > docWidth || bodyScrollWidth > docWidth;
    
    // Find elements causing overflow
    const overflowingElements = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
        // Filter out hidden or SVG internal elements if parent is already captured
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className ? String(el.className).slice(0, 50) : '',
            rectWidth: Math.round(rect.width),
            rectRight: Math.round(rect.right),
            docWidth: docWidth,
            textSnippet: el.innerText ? el.innerText.slice(0, 40).replace(/\n/g, ' ') : ''
          });
        }
      }
    }

    return {
      hasHorizontalScroll,
      docWidth,
      scrollWidth,
      bodyScrollWidth,
      overflowingElements: overflowingElements.slice(0, 8) // return top 8
    };
  });
}

(async () => {
  console.log('Starting Mobile Responsiveness Audit across viewports & pages...\n');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const auditReport = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const p of PAGES_TO_TEST) {
      try {
        await page.goto(p.url, { waitUntil: 'networkidle0', timeout: 15000 });
        await new Promise(r => setTimeout(r, 600));

        const overflowResult = await checkOverflow(page);
        const status = overflowResult.hasHorizontalScroll ? 'FAIL (OVERFLOW)' : 'PASS';
        console.log(`[${status}] ${p.name} @ ${vp.width}px (scroll: ${overflowResult.scrollWidth}px vs doc: ${overflowResult.docWidth}px)`);

        if (overflowResult.hasHorizontalScroll) {
          console.log(`  Overflowing elements:`, JSON.stringify(overflowResult.overflowingElements, null, 2));
        }

        auditReport.push({
          viewport: vp.name,
          page: p.name,
          hasHorizontalScroll: overflowResult.hasHorizontalScroll,
          scrollWidth: overflowResult.scrollWidth,
          docWidth: overflowResult.docWidth,
          overflowingElements: overflowResult.overflowingElements
        });

        // Save screenshot for key viewports (320px and 390px)
        if (vp.width === 320 || vp.width === 390) {
          const ssPath = path.join(OUTPUT_DIR, `audit_${vp.name}_${p.name}.png`);
          await page.screenshot({ path: ssPath, fullPage: false });
        }
      } catch (err) {
        console.error(`  Error testing ${p.name} @ ${vp.width}px:`, err.message);
      }
    }
  }

  // Also test modals at 320px
  console.log(`\n========================================`);
  console.log(`TESTING MODALS @ 320px`);
  console.log(`========================================`);
  await page.setViewport({ width: 320, height: 650 });
  
  // 1. Open Auth Modal
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btn = document.querySelector('.nav-login-link') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Login'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  let modalOverflow = await checkOverflow(page);
  console.log(`[${modalOverflow.hasHorizontalScroll ? 'FAIL' : 'PASS'}] Auth Modal (Login) @ 320px`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, `audit_320px_modal_auth_login.png`) });

  // 2. Open Booking Modal
  await page.goto('http://localhost:3000/properties/1', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Book'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  modalOverflow = await checkOverflow(page);
  console.log(`[${modalOverflow.hasHorizontalScroll ? 'FAIL' : 'PASS'}] Booking Modal @ 320px`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, `audit_320px_modal_booking.png`) });

  // 3. Open Mobile Hamburger Drawer
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const hamburger = document.querySelector('.nav-mobile-toggle');
    if (hamburger) hamburger.click();
  });
  await new Promise(r => setTimeout(r, 500));
  modalOverflow = await checkOverflow(page);
  console.log(`[${modalOverflow.hasHorizontalScroll ? 'FAIL' : 'PASS'}] Mobile Drawer Navigation @ 320px`);
  await page.screenshot({ path: path.join(OUTPUT_DIR, `audit_320px_mobile_drawer.png`) });

  await browser.close();
  console.log('\nAudit complete! Check results above.');
})();
