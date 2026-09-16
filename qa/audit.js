// HazirMinds — PHASE 2 QA audit (Puppeteer)
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:4173';
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'tablet-sm', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small', width: 360, height: 780 }
];

const routes = [
  '/', '/services', '/pricing', '/enterprise', '/chief-of-staff', '/compare', '/masjids', '/compare/masjid-platforms',
  '/compare/go-high-level', '/compare/synthflow', '/compare/smith-ai', '/compare/ai-sdr', '/compare/human-receptionist',
  '/case-studies', '/about', '/resources', '/demo',
  '/privacy', '/terms', '/ai',
  '/industries/hvac', '/industries/dental', '/industries/legal', '/industries/restaurant',
  '/industries/realestate', '/industries/auto', '/industries/ecommerce', '/industries/proservices',
  '/use-cases/after-hours-rescue', '/use-cases/speed-to-lead', '/use-cases/missed-call-textback',
  '/use-cases/no-show-reduction', '/use-cases/database-reactivation', '/use-cases/inbound-qualification',
  '/use-cases/review-engine', '/use-cases/crm-automation', '/use-cases/ai-employee',
  '/definitely-missing'
];

const bugs = [];
const log = (s) => console.log(s);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  let consoleErrors = [];

  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', r => consoleErrors.push('REQFAIL: ' + r.url()));

  // Simulate a returning visitor: consent already chosen and motion forced on, so the
  // first-visit consent sheet and OS reduced-motion never intercept the interaction tests.
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('hazirminds_consent', 'essential');
      localStorage.setItem('hazirminds_motion', 'on');
    } catch (e) { }
  });

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    for (const route of routes) {
      consoleErrors = [];
      const url = BASE + route;
      let status = 200;
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        status = resp ? resp.status() : 0;
      } catch (e) {
        bugs.push(`[${vp.name}] ${route} — NAV FAIL: ${e.message}`);
        continue;
      }
      const label = `[${vp.name}] ${route}`;

      // expected 404s
      if (route === '/definitely-missing' && status !== 404) bugs.push(`${label} — expected 404, got ${status}`);

      // console errors (ignore favicon; ignore the intentional 404 document response)
      let realErrors = consoleErrors.filter(e => !e.includes('favicon'));
      if (route === '/definitely-missing') realErrors = realErrors.filter(e => !(e.includes('404') && e.includes('load resource')));
      if (realErrors.length) bugs.push(`${label} — CONSOLE: ${realErrors.slice(0, 3).join(' | ')}`);

      // horizontal overflow
      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        const ow = d.scrollWidth - d.clientWidth;
        if (ow <= 1) return null;
        // deepest element crossing the right edge (most specific offender)
        let worst = null, best = -1;
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right > d.clientWidth + 1) {
            let depth = 0, n = el;
            while (n = n.parentElement) depth++;
            if (depth > best) { best = depth; worst = el; }
          }
        });
        const desc = worst ? worst.tagName + '.' + String(worst.getAttribute && worst.getAttribute('class') || '').split(' ')[0] + ' «' + (worst.textContent || '').trim().slice(0, 40) + '»' : '?';
        return { ow, worst: desc };
      });
      if (overflow) bugs.push(`${label} — H-OVERFLOW +${overflow.ow}px worst=${overflow.worst || '?'}`);

      // scroll the whole page (reveals, pin, sticky)
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 400));

      // blank-zone check: after full scroll, hero H1 + last section text must be visible
      const blank = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return 'no h1';
        const r = h1.getBoundingClientRect();
        if (r.width < 10) return 'h1 invisible';
        return null;
      });
      if (blank) bugs.push(`${label} — BLANK: ${blank}`);

      // screenshots for key pages
      const shotName = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
      if (['home', 'services', 'pricing', 'enterprise', 'case-studies', 'definitely-missing', 'industries_hvac', 'use-cases_after-hours-rescue', 'demo'].includes(shotName)) {
        await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${shotName}.png`) });
      }
    }

    // ---------- interaction tests (desktop + mobile) ----------
    if (vp.name === 'desktop' || vp.name === 'mobile') {
      // HOME interactions
      await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));

      // transcript tabs
      const tabs = await page.$$('.demo-tab');
      if (tabs.length !== 3) bugs.push(`[${vp.name}] home — expected 3 transcript tabs, got ${tabs.length}`);
      if (tabs[1]) { await tabs[1].click(); await new Promise(r => setTimeout(r, 900)); }
      const bubbleCount = await page.evaluate(() => document.querySelectorAll('.demo-body .bubble').length);
      if (bubbleCount < 1) bugs.push(`[${vp.name}] home — transcript did not render bubbles after tab switch`);

      // FAQ accordions
      const faqQ = await page.$('.faq .faq-q');
      if (faqQ) {
        await page.evaluate(() => document.querySelector('#faq').scrollIntoView());
        await new Promise(r => setTimeout(r, 300));
        await faqQ.click();
        await new Promise(r => setTimeout(r, 500));
        const open = await page.evaluate(() => {
          const it = document.querySelector('.faq-item');
          return it.classList.contains('open') && it.querySelector('.faq-a').getBoundingClientRect().height > 20;
        });
        if (!open) bugs.push(`[${vp.name}] home — FAQ accordion did not open`);
      } else bugs.push(`[${vp.name}] home — no FAQ found`);

      // trade picker + ?trade= param
      await page.goto(BASE + '/?trade=dental', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 400));
      const dentalSel = await page.evaluate(() => {
        const chip = document.querySelector('.trade-chip[data-trade="dental"]');
        return chip && chip.getAttribute('aria-pressed') === 'true';
      });
      if (!dentalSel) bugs.push(`[${vp.name}] home — ?trade=dental did not preselect dental`);
      const dentalImg = await page.evaluate(() => document.querySelector('[data-trade-img]').getAttribute('src'));
      if (!dentalImg.includes('trade-dental')) bugs.push(`[${vp.name}] home — trade image did not switch to dental`);

      // leak calculator
      const calcVal = await page.evaluate(() => {
        const c = document.querySelector('[data-calc-calls]');
        if (!c) return null;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(c, '100');
        c.dispatchEvent(new Event('input', { bubbles: true }));
        return document.querySelector('[data-calc-out]').textContent;
      });
      if (!calcVal || !/^\$[\d,]+$/.test(calcVal) || calcVal === '$10,000') {
        if (calcVal !== '$40,000') bugs.push(`[${vp.name}] home — calculator output not updating: ${calcVal}`);
      }

      // marquee count
      const marq = await page.evaluate(() => document.querySelectorAll('.marquee-track .pill').length);
      if (marq < 24) bugs.push(`[${vp.name}] home — marquee pills low: ${marq}`);

      // pricing toggle
      await page.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
      const swCount = await page.evaluate(() => document.querySelectorAll('[data-annual]').length);
      if (!swCount) {
        bugs.push(`[${vp.name}] pricing — annual toggle not found`);
      } else {
        await page.evaluate(() => document.querySelector('[data-annual]').scrollIntoView({ block: 'center' }));
        await new Promise(r => setTimeout(r, 400));
        const sw = await page.$('[data-annual]');
        await sw.click();
        await new Promise(r => setTimeout(r, 400));
        const annualPrice = await page.evaluate(() => document.querySelector('[data-price-m]').textContent);
        if (annualPrice !== '414') bugs.push(`[${vp.name}] pricing — annual toggle did not switch price: ${annualPrice}`);
      }

      // demo form validation + success
      await page.goto(BASE + '/demo', { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.querySelector('#demo-form').scrollIntoView({ block: 'center' }));
      await new Promise(r => setTimeout(r, 400));
      // submit empty → inline errors
      await page.click('#demo-form button[type=submit]');
      await new Promise(r => setTimeout(r, 300));
      const errShown = await page.evaluate(() => document.querySelectorAll('#demo-form .form-field.invalid').length);
      if (errShown < 4) bugs.push(`[${vp.name}] demo — inline validation did not flag empty fields (${errShown})`);
      // fill and submit
      await page.type('#d-name', 'QA Tester');
      await page.type('#d-email', 'qa@example.com');
      await page.type('#d-company', 'Test Co');
      await page.type('#d-phone', '+1 555 000 1111');
      await page.select('#d-industry', 'Dental');
      await page.select('#d-size', '2–10');
      await page.click('#demo-form button[type=submit]');
      await new Promise(r => setTimeout(r, 500));
      const success = await page.evaluate(() => document.querySelector('#demo-form .form-success').classList.contains('show'));
      if (!success) bugs.push(`[${vp.name}] demo — form success state did not show`);

      // nav mega menu (desktop only)
      if (vp.name === 'desktop') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
        await page.hover('.nav-item');
        await new Promise(r => setTimeout(r, 400));
        const megaVisible = await page.evaluate(() => {
          const m = document.querySelector('.nav-item.open .mega');
          return !!m && getComputedStyle(m).visibility === 'visible';
        });
        if (!megaVisible) bugs.push('[desktop] home — mega menu did not open on hover');
      }

      // UTF-8 copy checks (pricing page must contain proper à-la-carte — check raw DOM, CSS uppercases innerText)
      await page.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
      const hasAlc = await page.evaluate(() => document.documentElement.innerHTML.includes('À-la-carte'));
      if (!hasAlc) bugs.push(`[${vp.name}] pricing — "À-la-carte" rendered wrong (encoding?)`);
      // extra-minutes price belongs on pricing
      const has035 = await page.evaluate(() => document.documentElement.innerHTML.includes('0.35'));
      if (!has035) bugs.push(`[${vp.name}] pricing — missing $0.35/min extra-minutes price`);
    }

    // sticky CTA appears after 600px on mobile
    if (vp.name === 'mobile') {
      await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
      await page.evaluate(() => window.scrollTo(0, 900));
      await new Promise(r => setTimeout(r, 600));
      const sticky = await page.evaluate(() => document.querySelector('.sticky-cta').classList.contains('show'));
      if (!sticky) bugs.push('[mobile] home — sticky CTA did not appear after 600px');
    }
  }

  await browser.close();

  /* ---------- static content checks ---------- */
  const dist = path.join(__dirname, '..', 'dist');
  const homeHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  // price consistency
  [['497', 'home'], ['997', 'home'], ['1,997', 'home']].forEach(([p]) => {
    if (!homeHtml.includes(p)) bugs.push(`home — missing price token ${p}`);
  });
  const pricingHtml = fs.readFileSync(path.join(dist, 'pricing/index.html'), 'utf8');
  [['497'], ['997'], ['1,997'], ['0.35'], ['$1,500'], ['from $2,500'], ['from $7,500'], ['from $997'], ['$500 + 10%']].forEach(([p]) => {
    if (!pricingHtml.includes(p)) bugs.push(`pricing — missing price token ${p}`);
  });
  const servicesHtml = fs.readFileSync(path.join(dist, 'services/index.html'), 'utf8');
  for (let i = 1; i <= 40; i++) {
    const n = String(i).padStart(2, '0');
    if (!servicesHtml.includes('SERVICE ' + n)) bugs.push(`services — missing service ${n}`);
  }
  if (!servicesHtml.includes('YOUR REQUIREMENT')) bugs.push('services — client-requirement slot (unnumbered) missing');
  // HazirMinds structural checks
  const compareHub = fs.readFileSync(path.join(dist, 'compare/index.html'), 'utf8');
  if (!compareHub.includes('vs GoHighLevel') || !compareHub.includes('vs Smith.ai')) bugs.push('compare hub — competitor links missing');
  const cosHtml = fs.readFileSync(path.join(dist, 'chief-of-staff/index.html'), 'utf8');
  if (!cosHtml.includes('ONE payment') && !cosHtml.includes('ONE payment.')) bugs.push('chief-of-staff — commercial shape statement missing');
  if (!homeHtml.includes('GOVERNANCE') && !homeHtml.includes('Governance Layer')) bugs.push('home — S7 governance band missing');
  ['497', '997', '1,997'].forEach(p => { if (!homeHtml.replace(/<[^>]+>/g, '').includes(p)) bugs.push(`home — missing price token ${p}`); });
  const files = (function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); })(dist);
  // concealment rule (HazirMinds brief: never frame OUR offering via vendors/white-label).
  // Competitor facts inside comparison data (e.g. "Synthflow ... white-label $2k/mo") are required by the brief — allowed.
  const forbidden = /\b(resell(er|ing)?|fulfillment partner|third[- ]party platform|our vendor|backend vendor|agency partner)\b/i;
  const whiteLabelSelf = /\b(our|HazirMinds)[' ]*s? white[- ]label|white[- ]label(?:ed)? (?:version|program|plan|offering) of (?:ours|HazirMinds)/i;
  // legacy brand strings must be gone
  const legacy = /white-?label|reseller|fulfil?lment partner|backend vendor|our platform partner/i;
  for (const f of files) {
    if (!/\.(html|css|js|txt|xml)$/.test(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    if (forbidden.test(src)) bugs.push('CONCEALMENT: ' + f.replace(dist, '') + ' mentions forbidden term');
    if (whiteLabelSelf.test(src)) bugs.push('CONCEALMENT: ' + f.replace(dist, '') + ' white-labels our own offering');
    if (/\.html$/.test(f) && legacy.test(src)) bugs.push('PARTNER LEAK: ' + f.replace(dist, '') + ' mentions a partner or white-label term');
  }
  for (const f of files) {
    if (!/\.(html|css|js|txt|xml)$/.test(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    if (forbidden.test(src)) bugs.push('CONCEALMENT: ' + f.replace(dist, '') + ' mentions forbidden term');
  }

  // JS weight budget
  const gz = (f) => { const { execSync } = require('child_process'); try { const out = execSync(`gzip -c "${f}" | wc -c`).toString().trim(); return parseInt(out, 10); } catch (e) { return -1; } };
  const jsTotal = ['vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/lenis.min.js', 'assets/js/main.js']
    .reduce((a, f) => a + gz(path.join(dist, f)), 0);
  log(`\nJS gz total (libs + main): ${jsTotal} bytes (budget 150,000)`);

  log(`\n================ BUGS: ${bugs.length} ================`);
  bugs.forEach(b => log(' • ' + b));
  fs.writeFileSync(path.join(__dirname, 'bugs.json'), JSON.stringify(bugs, null, 2));
  process.exit(bugs.length ? 1 : 0);
})().catch(e => { console.error('AUDIT CRASH:', e); process.exit(2); });
