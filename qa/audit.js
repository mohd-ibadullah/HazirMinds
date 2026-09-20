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
  /* The five individual comparison pages and /compare/masjid-platforms were removed by request;
     the masjid comparison now renders at the end of /masjids. */
  '/', '/services', '/chief-of-staff', '/compare', '/masjids',   // /enterprise merged into /chief-of-staff
  '/case-studies', '/about', '/demo', '/privacy', '/terms',
  /* The 11 umbrella industries replaced the 8 flat trade pages; the hub is new. The old trade URLs
     now 301 to their umbrella and are asserted in build.js, not crawled here. */
  '/industries', '/industries/home-field-services', '/industries/healthcare-dental', '/industries/legal',
  '/industries/financial-professional-services', '/industries/real-estate-property', '/industries/food-hospitality-events',
  '/industries/automotive-fleet', '/industries/beauty-wellness-personal-care', '/industries/business-services-agencies',
  '/industries/retail-ecommerce-order-taking', '/industries/education-nonprofits-community',
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
      if (['home', 'services', 'chief-of-staff', 'case-studies', 'definitely-missing', 'industries_hub', 'use-cases_after-hours-rescue', 'demo'].includes(shotName)) {
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

      // The homepage FAQ section was removed by request, so this guard flips: a FAQ accordion on the
      // home page now means the removal was reverted. (Its answers live in the assistant KB instead.)
      const faqQ = await page.$('.faq .faq-q');
      if (faqQ) bugs.push(`[${vp.name}] home — FAQ accordion is back after its removal`);

      // trade picker + ?trade= param
      await page.goto(BASE + '/?trade=healthcare-dental', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 400));
      const dentalSel = await page.evaluate(() => {
        const chip = document.querySelector('.trade-chip[data-trade="healthcare-dental"]');
        return chip && chip.getAttribute('aria-pressed') === 'true';
      });
      if (!dentalSel) bugs.push(`[${vp.name}] home — ?trade=healthcare-dental did not preselect that industry`);
      /* Industry pages are image-free by design now, so the trade picker has no image to switch.
         What must follow the selection is the CTA target and its label. */
      const dentalCta = await page.evaluate(() => {
        const a = document.querySelector('[data-trade-cta]');
        const l = document.querySelector('[data-trade-cta-label]');
        return { href: a ? a.getAttribute('href') : '', label: l ? l.textContent.trim() : '' };
      });
      if (dentalCta.href !== '/industries/healthcare-dental') bugs.push(`[${vp.name}] home — trade CTA href did not follow to healthcare-dental (got ${dentalCta.href})`);
      if (!/Healthcare & Dental/.test(dentalCta.label)) bugs.push(`[${vp.name}] home — trade CTA label did not follow (got ${dentalCta.label})`);

      /* The ROI calculator computes a revenue LEAK from the visitor's own inputs — it is not a price
         of ours, and it was restored by request. Assert it exists AND that its maths still follows the
         sliders, which is the thing that silently breaks when the markup is touched. */
      const calc = await page.evaluate(() => {
        const c = document.querySelector('[data-calc-calls]');
        if (!c) return null;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(c, '100');
        c.dispatchEvent(new Event('input', { bubbles: true }));
        return { out: document.querySelector('[data-calc-out]').textContent, year: document.querySelector('[data-calc-year]').textContent };
      });
      if (!calc) bugs.push(`[${vp.name}] home — ROI calculator is missing`);
      else if (calc.out === '$10,000' || !/^\$[\d,]+$/.test(calc.out)) bugs.push(`[${vp.name}] home — calculator output not following the sliders (${calc.out})`);

      // marquee count
      const marq = await page.evaluate(() => document.querySelectorAll('.marquee-track .pill').length);
      if (marq < 24) bugs.push(`[${vp.name}] home — marquee pills low: ${marq}`);

      // annual price math — the /pricing annual toggle was removed with that page, so the guard reads
      // the single source of truth instead of a control that no longer exists.
      const annualOk = require('../src/data/site.json').tiers.chronos.annual === 414;
      if (!annualOk) bugs.push(`[${vp.name}] annual price math drifted in site.json`);

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
      /* The industry and size controls are custom listboxes over display:none <select>s, and the
         industry labels now come from the umbrella taxonomy. Drive them like a visitor does. */
      for (const [id, want] of [['d-industry', 'Healthcare & Dental'], ['d-size', '2–10']]) {
        await page.click('#' + id + '-btn');
        await new Promise(r => setTimeout(r, 250));
        const picked = await page.evaluate((id, want) => {
          const opts = [...document.querySelectorAll('#' + id + '-btn ~ .dd-list .dd-opt')];
          const o = opts.find(x => x.textContent.trim() === want) || opts[1];
          if (!o) return false;
          o.click(); return true;
        }, id, want);
        if (!picked) bugs.push(`[${vp.name}] demo — could not pick ${want} in ${id}`);
        await new Promise(r => setTimeout(r, 200));
      }
      await page.click('#demo-form button[type=submit]');
      await new Promise(r => setTimeout(r, 1200));
      /* This runs against `node server.js`, which serves static files and has NO /api/lead
         function — production does. So the only correct outcome here is the FAILURE panel:
         the form fails closed, keeps the inputs mounted and offers a mailto. Asserting the
         success panel locally (as this check used to) tests the wrong thing, and if it ever
         passed it would mean the success path had gone optimistic — the exact defect the
         whole gate exists to catch. Verify the endpoint really is absent first, so the check
         cannot quietly become meaningless on a machine where it happens to exist. */
      const endpointStatus = await page.evaluate(async () => {
        try { const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); return r.status; }
        catch (e) { return 0; }
      });
      if (endpointStatus !== 404 && endpointStatus !== 0) {
        bugs.push(`[${vp.name}] demo — /api/lead answered ${endpointStatus} locally, so this check proves nothing`);
      } else {
        const afterSubmit = await page.evaluate(() => {
          const q = s => document.querySelector(s);
          const shown = el => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;
          return {
            success: shown(q('#demo-form .form-success')),
            error: shown(q('#demo-form .form-error')),
            alert: !!q('#demo-form .form-error[role=alert]'),
            mailto: (q('#demo-form a[href^="mailto:"]') || {}).getAttribute ? q('#demo-form a[href^="mailto:"]').getAttribute('href') : null,
            inputs: document.querySelectorAll('#demo-form input').length,
          };
        });
        if (afterSubmit.success) bugs.push(`[${vp.name}] demo — success shown without a confirmed send (optimistic success path)`);
        if (!afterSubmit.error) bugs.push(`[${vp.name}] demo — no failure panel after a failed send`);
        if (!afterSubmit.alert) bugs.push(`[${vp.name}] demo — failure panel is not role=alert`);
        if (!afterSubmit.mailto || !/^mailto:/.test(afterSubmit.mailto)) bugs.push(`[${vp.name}] demo — failure panel offers no mailto fallback`);
        if (afterSubmit.inputs < 4) bugs.push(`[${vp.name}] demo — inputs unmounted after failure, so the visitor cannot retry (${afterSubmit.inputs})`);
      }

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

      /* /resources, the reading list, llms.txt, robots.txt, sitemap.xml and /ai are gone by request.
         Assert they are ABSENT, so the removal cannot silently reverse. */
      for (const gone of ['/ai/', '/resources/']) {
        const rr = await page.goto(BASE + gone, { waitUntil: 'domcontentloaded' });
        if (rr.status() !== 404) bugs.push(`[${vp.name}] ${gone} still serves after its removal (${rr.status()})`);
      }
      // no customer-facing rate may render on the legal pages either
      await page.goto(BASE + '/terms/', { waitUntil: 'networkidle0' });
      const hasRate = await page.evaluate(() => /\$\s?\d/.test(document.body.innerText));
      if (hasRate) bugs.push(`[${vp.name}] /terms — a numeric rate is still published`);
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
  /* EVERY customer-facing price was removed by request — our tiers, our setup fees, our overage, and
     the third-party figures that filled the comparison cost rows. The guard INVERTS: nothing may
     bring a price back, on any page, in text or in structured data. */
  const htmlFiles = (function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); })(dist).filter(f => f.endsWith('.html'));
  for (const f of htmlFiles) {
    let body = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
    /* The ROI calculator renders figures computed from the VISITOR'S OWN inputs. That is arithmetic,
       not a price of ours, and it is the one place a dollar sign is allowed to appear — so its own
       outputs come out before the scan. Everything else on the page is still held to the rule. */
    body = body.replace(/<output[^>]*data-out-(?:calls|value)[^>]*>[\s\S]*?<\/output>/g, ' ')
               .replace(/<div class="big" data-calc-out[^>]*>[\s\S]*?<\/div>/g, ' ')
               .replace(/<b data-calc-year[^>]*>[\s\S]*?<\/b>/g, ' ')
               .replace(/value="\d+"(\s+data-calc-(?:calls|value))?/g, 'value="" ');
    const txt = body.replace(/<[^>]+>/g, ' ');
    const hit = txt.match(/\$\s?\d[\d,.]*|\d+\s?(?:%\s?of|\/\s?min\b)/);
    if (hit) bugs.push(`price still published on ${path.relative(dist, f).replace(/\\/g, '/')} — "${hit[0].trim()}"`);
  }
  const servicesHtml = fs.readFileSync(path.join(dist, 'services/index.html'), 'utf8');
  for (let i = 1; i <= 39; i++) {   // 39 numbered + one unnumbered client slot
    const n = String(i).padStart(2, '0');
    if (!servicesHtml.includes('SERVICE ' + n)) bugs.push(`services — missing service ${n}`);
  }
  if (!servicesHtml.includes('YOUR REQUIREMENT')) bugs.push('services — client-requirement slot (unnumbered) missing');
  // HazirMinds structural checks
  const compareHub = fs.readFileSync(path.join(dist, 'compare/index.html'), 'utf8');
  if (!compareHub.includes('Sources: vendor public pricing pages')) bugs.push('compare hub — source note for the comparison facts missing');
  const cosHtml = fs.readFileSync(path.join(dist, 'chief-of-staff/index.html'), 'utf8');
  if (!cosHtml.includes('ONE payment') && !cosHtml.includes('ONE payment.')) bugs.push('chief-of-staff — commercial shape statement missing');
  if (!homeHtml.includes('GOVERNANCE') && !homeHtml.includes('Governance Layer')) bugs.push('home — S7 governance band missing');
  /* The homepage price strip was removed by request — the home page must NOT quote tiers now. */
  ['497', '997', '1,997'].forEach(p => { if (homeHtml.replace(/<[^>]+>/g, '').includes(p)) bugs.push(`home — still quotes price token ${p}`); });
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
