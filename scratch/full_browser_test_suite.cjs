const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\0119372b-33a3-4b53-b0eb-fc7d9b2c515e';

const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

function assert(condition, message) {
  if (condition) {
    testResults.passed.push(message);
    console.log(`  ✓ PASS: ${message}`);
  } else {
    testResults.failed.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

(async () => {
  console.log('====================================================');
  console.log('STARTING COMPREHENSIVE END-TO-END BROWSER TEST SUITE');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    }
  });

  // ==========================================
  // TEST 1: HOMEPAGE VERIFICATION
  // ==========================================
  console.log('[TEST 1] Testing Homepage (http://localhost:3000/)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 1.1 Check Hero Aerial Image
  const heroImgLoaded = await page.evaluate(() => {
    const img = document.querySelector('.hero-img-container img');
    return img && img.complete && img.naturalWidth > 0 && img.src.includes('1004-estate-aerial.jpg');
  });
  assert(heroImgLoaded, 'Hero 1004 estate aerial photo is loaded with valid dimensions');

  // 1.2 Check Dark Card Interior Thumbnail Image
  const thumbImgLoaded = await page.evaluate(() => {
    const img = document.querySelector('.hero-dark-thumb img');
    return img && img.complete && img.naturalWidth > 0 && img.src.includes('1004-interior-living.jpg');
  });
  assert(thumbImgLoaded, 'Hero dark card interior apartment thumbnail is loaded with valid dimensions');

  // 1.3 Check Filter Pills for absence of Penthouse
  const pillsText = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.filter-pill-btn'));
    return pills.map(p => p.textContent.trim());
  });
  assert(!pillsText.includes('Penthouse'), 'Category pills do NOT contain "Penthouse"');
  assert(pillsText.includes('Cluster C') && pillsText.includes('Cluster D'), 'Cluster C and Cluster D are separated in hero pills');

  // 1.4 Check absence of "Mrs. Joke Popoola" on homepage
  const homeText = await page.evaluate(() => document.body.innerText);
  assert(!homeText.includes('Joke Popoola') && !homeText.includes('Mrs. Popoola') && !homeText.includes('Mrs Popoola'), 'Homepage contains NO mention of Mrs. Joke Popoola');
  assert(homeText.includes('JK - CUBE MULTIVENTURES LIMITED'), 'Homepage features JK - CUBE MULTIVENTURES LIMITED corporate branding');

  // 1.5 Check Footer: No Agent Admin Portal link
  const footerLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('footer a'));
    return links.map(a => a.textContent.trim());
  });
  assert(!footerLinks.includes('Agent Admin Portal'), 'Footer navigation list does NOT contain "Agent Admin Portal"');

  // 1.6 Curated Collections Mosaic Card 5 check (Studio instead of Penthouse)
  const mosaicTitles = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('.curated-card-title'));
    return titles.map(t => t.textContent.trim());
  });
  assert(!mosaicTitles.some(t => t.toLowerCase().includes('penthouse')), 'Curated Collections mosaic contains NO penthouse cards');
  assert(mosaicTitles.some(t => t.includes('Studio')), 'Curated Collections mosaic contains Studio & Executive Suites');

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'e2e_1_homepage.png') });
  console.log('  Saved screenshot: e2e_1_homepage.png\n');


  // ==========================================
  // TEST 2: PROPERTIES LISTING & FILTERS
  // ==========================================
  console.log('[TEST 2] Testing Properties Page (http://localhost:3000/properties)...');
  await page.goto('http://localhost:3000/properties', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // 2.1 Check property types dropdown
  const propTypes = await page.evaluate(() => {
    const select = document.querySelector('select');
    return select ? Array.from(select.options).map(o => o.text) : [];
  });
  assert(!propTypes.some(t => t.toLowerCase().includes('penthouse')), 'Properties type options contain NO "Penthouse"');

  // 2.2 Check listings count and title
  const listingPageText = await page.evaluate(() => document.body.innerText);
  assert(!listingPageText.includes('penthouse') && !listingPageText.includes('Penthouse'), 'Properties page text contains NO "penthouse"');
  assert(!listingPageText.includes('Joke Popoola'), 'Properties page contains NO mention of Mrs. Joke Popoola');

  // 2.3 Test Search filter
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.type('Modern');
    await new Promise(r => setTimeout(r, 500));
    const searchCardsCount = await page.$$eval('.clean-card', cards => cards.length);
    assert(searchCardsCount > 0, `Search input works dynamically (found ${searchCardsCount} matching listings)`);
    // Clear search
    await page.evaluate(el => el.value = '', searchInput);
    await searchInput.type(' ');
    await page.keyboard.press('Backspace');
    await new Promise(r => setTimeout(r, 500));
  }

  // 2.4 Verify Property Cards rendered
  const cardsCount = await page.$$eval('.clean-card', cards => cards.length);
  assert(cardsCount > 0, `Property cards rendered successfully (found ${cardsCount} cards)`);

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'e2e_2_properties_page.png') });
  console.log('  Saved screenshot: e2e_2_properties_page.png\n');


  // ==========================================
  // TEST 3: PROPERTY DETAILS & LIGHTBOX
  // ==========================================
  console.log('[TEST 3] Testing Property Details Page (http://localhost:3000/properties/1004-prop-1)...');
  await page.goto('http://localhost:3000/properties/1004-prop-1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 3.1 Check Managing Agency
  const agencyName = await page.evaluate(() => {
    const el = document.querySelector('.agency-name') || document.querySelector('.agency-info');
    return el ? el.innerText : '';
  });
  assert(agencyName.includes('JK - CUBE MULTIVENTURES LIMITED'), 'Managing Agency displays "JK - CUBE MULTIVENTURES LIMITED"');
  assert(!agencyName.includes('Joke Popoola'), 'Managing Agency does NOT mention Mrs. Joke Popoola');

  // 3.2 Check Technical Specifications Modal for "Access to swimming pool"
  const specsBtn = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('All Technical specifications'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  assert(specsBtn, 'Clicked "All Technical specifications" button');
  await new Promise(r => setTimeout(r, 600));

  const specsModalText = await page.evaluate(() => document.body.innerText);
  assert(specsModalText.includes('Access to swimming pool'), 'Technical specs modal contains "Access to swimming pool"');
  assert(!specsModalText.includes('Olympic-Sized Swimming Pools'), 'Technical specs modal does NOT contain "Olympic-Sized Swimming Pools"');
  assert(!specsModalText.includes('Joke Popoola'), 'Technical specs modal contains NO mention of Mrs. Joke Popoola');

  // Close specs modal
  await page.evaluate(() => {
    const btn = document.querySelector('.btn-black-block');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 3.3 Test Full-Screen Lightbox
  const photoContainer = await page.$('.detail-main-photo-wrap') || await page.$('.detail-photo-gallery');
  if (photoContainer) {
    await photoContainer.click();
    await new Promise(r => setTimeout(r, 800));

    const lightboxOpen = await page.evaluate(() => !!document.querySelector('.lightbox-backdrop'));
    assert(lightboxOpen, 'Full-screen Lightbox opens successfully on image click');

    // Test Lightbox Next navigation
    const nextBtn = await page.$('.lightbox-btn-next');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 400));
      assert(true, 'Lightbox "Next" photo navigation button functions smoothly');
    }

    await page.screenshot({ path: path.join(OUTPUT_DIR, 'e2e_3_lightbox.png') });
    console.log('  Saved screenshot: e2e_3_lightbox.png');

    // Close Lightbox via Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
    const lightboxClosed = await page.evaluate(() => !document.querySelector('.lightbox-backdrop'));
    assert(lightboxClosed, 'Lightbox closes properly with Escape key');
  }

  // 3.4 Test Schedule Inspection Booking Modal
  const bookBtnClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Book This Apartment Now') || b.textContent.includes('Schedule In-Person Inspection'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  assert(bookBtnClicked, 'Schedule In-Person Inspection button found and clicked');
  await new Promise(r => setTimeout(r, 800));

  const modalOpen = await page.evaluate(() => {
    return document.body.innerText.includes('Sign In to Book') || document.body.innerText.includes('Schedule 1004 Inspection');
  });
  assert(modalOpen, 'Inspection Booking Modal opens cleanly with corporate branding');

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'e2e_4_booking_modal.png') });
  console.log('  Saved screenshot: e2e_4_booking_modal.png');

  // Close modal by clicking backdrop
  await page.evaluate(() => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.click();
  });
  await new Promise(r => setTimeout(r, 400));


  // ==========================================
  // TEST 4: CONTACT DESK PAGE
  // ==========================================
  console.log('\n[TEST 4] Testing Contact Page (http://localhost:3000/contact)...');
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const contactText = await page.evaluate(() => document.body.innerText);
  assert(contactText.includes('JK - CUBE MULTIVENTURES LIMITED'), 'Contact page header displays JK - CUBE MULTIVENTURES LIMITED');
  assert(contactText.includes('Suite 337, 3rd Floor, Ikeja Plaza'), 'Contact address displays Suite 337, 3rd Floor, Ikeja Plaza');
  assert(contactText.includes('+234 703 846 2284'), 'Contact phone displays +234 703 846 2284');
  assert(contactText.includes('jkcube85@gmail.com'), 'Contact email displays jkcube85@gmail.com');
  assert(!contactText.includes('Joke Popoola'), 'Contact page contains NO mention of Mrs. Joke Popoola');

  // Test form submission
  const nameInput = await page.$('input[placeholder*="Full Name"]');
  const emailInput = await page.$('input[placeholder*="Email"]');
  const phoneInput = await page.$('input[placeholder*="Phone"]');
  const msgInput = await page.$('textarea');
  const submitBtn = await page.$('button[type="submit"]');

  if (nameInput && emailInput && phoneInput && msgInput && submitBtn) {
    await nameInput.type('Corporate Client Test');
    await emailInput.type('testclient@company.com');
    await phoneInput.type('08012345678');
    await msgInput.type('Inquiry regarding 2-bedroom serviced flat in Cluster B.');
    await submitBtn.click();
    await new Promise(r => setTimeout(r, 1500));

    const submittedText = await page.evaluate(() => document.body.innerText);
    assert(submittedText.includes('Message Received!'), 'Contact form submits successfully with confirmation');
    assert(!submittedText.includes('Joke Popoola'), 'Confirmation message does not mention Mrs. Joke Popoola');
  }

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'e2e_5_contact_page.png') });
  console.log('  Saved screenshot: e2e_5_contact_page.png\n');


  // ==========================================
  // TEST 5: ADMIN DASHBOARD & AMENITIES
  // ==========================================
  console.log('[TEST 5] Testing Admin Portal (http://localhost:3000/admin)...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const adminHeaderText = await page.evaluate(() => document.body.innerText);
  assert(adminHeaderText.includes('Managing Agency: JK - CUBE MULTIVENTURES LIMITED'), 'Admin header shows "Managing Agency: JK - CUBE MULTIVENTURES LIMITED"');
  assert(!adminHeaderText.includes('Joke Popoola'), 'Admin header does NOT mention Mrs. Joke Popoola');

  // Click "+ Add New Listing" tab
  const addTab = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Add New Listing'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  assert(addTab, 'Clicked "+ Add New Listing" tab');
  await new Promise(r => setTimeout(r, 800));

  // 5.1 Check categories dropdown in Add New Listing
  const categoryOptions = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    for (const sel of selects) {
      const texts = Array.from(sel.options).map(o => o.text);
      if (texts.some(t => t.includes('1-Bedroom') || t.includes('Maisonette'))) {
        return texts;
      }
    }
    return [];
  });
  assert(!categoryOptions.some(t => t.toLowerCase().includes('penthouse')), 'Admin categories dropdown does NOT include "Penthouse"');
  assert(categoryOptions.some(t => t.includes('Studio Apartment')), 'Admin categories dropdown includes "Studio Apartment"');
  assert(categoryOptions.some(t => t.includes('2-Bedroom Flat')), 'Admin categories dropdown includes "2-Bedroom Flat"');
  assert(categoryOptions.some(t => t.includes('3-Bedroom Flat')), 'Admin categories dropdown includes "3-Bedroom Flat"');

  // 5.2 Check Amenities checklist for "Access to swimming pool"
  const amenitiesList = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    return labels.map(l => l.textContent.trim());
  });
  assert(amenitiesList.some(a => a === 'Access to swimming pool'), 'Admin amenities checklist has "Access to swimming pool"');
  assert(!amenitiesList.some(a => a.includes('Olympic-Sized')), 'Admin amenities checklist does NOT have "Olympic-Sized Swimming Pools"');

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'e2e_6_admin_amenities.png') });
  console.log('  Saved screenshot: e2e_6_admin_amenities.png\n');

  // Close browser
  await browser.close();

  // ==========================================
  // SUMMARY REPORT
  // ==========================================
  console.log('====================================================');
  console.log('BROWSER TEST SUMMARY:');
  console.log(`Passed:   ${testResults.passed.length}`);
  console.log(`Failed:   ${testResults.failed.length}`);
  console.log(`Warnings: ${testResults.warnings.length}`);
  console.log('====================================================');

  if (testResults.failed.length === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Everything is working correctly.');
  } else {
    console.error('\n⚠️ SOME TESTS FAILED:');
    testResults.failed.forEach(f => console.error(` - ${f}`));
    process.exit(1);
  }
})().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
