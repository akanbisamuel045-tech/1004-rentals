const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:/Users/USER/.gemini/antigravity-ide/brain/0119372b-33a3-4b53-b0eb-fc7d9b2c515e');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  // 1. Check Contact page
  console.log('Visiting contact page...');
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'contact_page_agent_desk.png') });

  const hasAgentDesk = await page.evaluate(() => {
    return document.body.innerText.includes('Agent Desk') && !document.body.innerText.includes('Estate Location');
  });
  console.log('Contact page has Agent Desk and no Estate Location:', hasAgentDesk);

  // 2. Clear localStorage so user is logged out
  await page.evaluate(() => {
    localStorage.clear();
  });

  // Open Auth Modal - Sign In tab
  console.log('Opening Auth Modal (Sign In)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  // Click .nav-login-link
  await page.waitForSelector('.nav-login-link', { timeout: 5000 });
  await page.click('.nav-login-link');

  await page.waitForSelector('.modal-content', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'auth_modal_signin_blank.png') });

  // Check inputs for sign in are blank
  const signInInputsState = await page.evaluate(() => {
    const modal = document.querySelector('.modal-content');
    if (!modal) return { modalFound: false };
    const inputs = Array.from(modal.querySelectorAll('input'));
    return {
      modalFound: true,
      inputs: inputs.map(i => ({
        type: i.type,
        value: i.value,
        placeholder: i.placeholder
      }))
    };
  });
  console.log('Sign In modal inputs:', JSON.stringify(signInInputsState, null, 2));

  // 3. Switch to Create Account tab
  console.log('Switching to Create Account tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.modal-header button'));
    const createTab = tabs.find(t => t.textContent.includes('Create Account'));
    if (createTab) createTab.click();
  });

  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'auth_modal_create_account_blank.png') });

  // Check inputs for create account are blank
  const createAccountInputsState = await page.evaluate(() => {
    const modal = document.querySelector('.modal-content');
    if (!modal) return { modalFound: false };
    const inputs = Array.from(modal.querySelectorAll('input'));
    return {
      modalFound: true,
      inputs: inputs.map(i => ({
        type: i.type,
        value: i.value,
        placeholder: i.placeholder
      }))
    };
  });
  console.log('Create Account modal inputs:', JSON.stringify(createAccountInputsState, null, 2));

  await browser.close();
  console.log('Finished capturing all verification screenshots.');
})();
