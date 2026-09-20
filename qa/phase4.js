// HazirMinds — PHASE 4 verification: scorecard evidence from dist/ (static analysis)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST = path.join(__dirname, '..', 'dist');
const findings = [];
const bad = (s) => findings.push(s);
const ok = (s) => console.log('  ✓ ' + s);
const head = (s) => console.log('\n== ' + s + ' ==');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(DIST, rel));
const stripTags = (h) => h.replace(/<[^>]+>/g, '');

/* ---------- 1. Structure: home sections in order ---------- */
head('Structure');
const home = read('index.html');
const sections = [...home.matchAll(/<!-- S(\d+)[ ·]/g)].map(m => m[1]);
/* S6 (#why), S9 (proof band) and S12 (FAQ) were removed with the 2026-09-18 homepage update, and
   the homepage's ledger moves to the pricing page. Their absence is the expected state now — the
   content gate asserts each removed section stays gone, so a revert cannot pass here either. */
const expect = ['0','1','2','3','4','5','7','8','10','13','14'];   // S11 price strip removed too
if (JSON.stringify(sections) === JSON.stringify(expect)) ok('home: S0..S14 minus the three removed sections, markers in order (S6, S9, S12 gone by design)');
else bad(`home sections: [${sections.join(',')}] expected [${expect.join(',')}]`);

/* 'pricing' is gone: the page was removed by request and its absence is asserted separately. */
/* THE REAL ROUTE LIST. It must mirror what build.js emits: a stale entry here does not fail a check,
   it CRASHES the guard on a read of a page that no longer exists — which is how this list was found
   still carrying the 9 use-case routes and the 5 deleted compare pages long after both were removed. */
const routes = ['', 'services', 'chief-of-staff', 'compare',
  'case-studies', 'about', 'demo', 'privacy', 'terms', '404.html',
  'industries',
  'industries/home-field-services', 'industries/healthcare-dental', 'industries/legal',
  'industries/financial-professional-services', 'industries/real-estate-property',
  'industries/food-hospitality-events', 'industries/automotive-fleet',
  'industries/beauty-wellness-personal-care', 'industries/business-services-agencies',
  'industries/retail-ecommerce-order-taking', 'industries/education-nonprofits-community'];
routes.forEach(r => { if (!exists(r === '' ? 'index.html' : r + '/index.html') && !exists(r)) bad('missing route: /' + r); });
if (findings.filter(f => f.startsWith('missing route')).length === 0) ok(`${routes.length} audited routes all present`);
/* /resources, the reading list, llms.txt, robots.txt, sitemap.xml and /ai were removed by request. */
if (['sitemap.xml','robots.txt','llms.txt','ai/index.html'].every(f => !exists(f)) && exists('favicon.svg')) ok('removed SEO root files are gone; favicon still present');
else bad('a removed SEO root file is back, or favicon is missing');

/* ---------- 2. Rebrand: zero legacy strings ---------- */
head('Rebrand');
let legacyHits = [];
for (const f of walk(DIST)) {
  if (!/\.(html|css|js|txt|xml)$/.test(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
    if (/\b(white-?label|reseller|fulfil?lment partner|backend vendor|our platform partner)\b/i.test(src)) legacyHits.push(f.replace(DIST, ''));
}
if (legacyHits.length === 0) ok('zero partner/white-label disclosure strings anywhere in dist/');
else legacyHits.forEach(f => bad('LEGACY: ' + f));
const anyHtml = read('services/index.html');
if (anyHtml.includes('HazirMinds') && anyHtml.includes('hazirminds.ai')) ok('pages branded HazirMinds / hazirminds.ai');
const homeTxt = stripTags(home);
if (homeTxt.includes('Always present. Never missed.')) ok('tagline "Always present. Never missed." on home');
else bad('tagline missing on home');

/* ---------- 3. Governance layer ---------- */
head('Governance layer');
if (home.includes('Ability is not authority') && home.includes('Continuity is not persona')) ok('home S8: four invariant cards present');
else bad('home S8 invariants missing');
/* Home carries the COMPACT governance band (four invariants only). The full responsibility layers +
   proof horizons now render on /chief-of-staff, where /enterprise was merged. */
if (!home.includes('data-layers') && !home.includes('data-horizons')) ok('home S8: compact band (layers/horizons on /chief-of-staff)');
else bad('home S8: compact band expected, but the full layer/horizon markup is on the home page');
if (read('chief-of-staff/index.html').includes('data-layers') && read('chief-of-staff/index.html').includes('data-horizons')) ok('/chief-of-staff: responsibility layers + proof horizons rendered');
else bad('/chief-of-staff: layer/horizon diagram missing');
if (homeTxt.includes('HazirMinds Operating Substrate')) ok('Operating Substrate named on home');
else bad('Operating Substrate missing on home');
const cos = read('chief-of-staff/index.html');
['Practice Operations', 'Personal Finance', 'Family & Personal', 'Research & Knowledge', 'Website & Content', 'Asset & Vehicle', 'Personal Technology'].forEach(s => {
  if (!cos.includes(s)) bad('chief-of-staff: specialist missing — ' + s);
});
if (findings.filter(f => f.startsWith('chief-of-staff: specialist')).length === 0) ok('/chief-of-staff: all 7 specialists present');
if (cos.includes('AWAITING APPROVAL') && cos.includes('ONE payment')) ok('/chief-of-staff: approval-gate receipt + one-payment statement');
const ent = read('chief-of-staff/index.html');
/* The invariants were removed from the merged page by request — assert their ABSENCE there (their
   presence on home is asserted above), so the decision cannot silently reverse. */
if (!ent.includes('Ability is not authority')) ok('/chief-of-staff: removed invariants absent as requested');
else bad('/chief-of-staff: the removed invariants are back');

/* ---------- 4. Services A–F ---------- */
head('Services');
const svc = read('services/index.html');
const missingN = []; for (let i = 1; i <= 39; i++) { const n = String(i).padStart(2, '0'); if (!svc.includes('SERVICE ' + n)) missingN.push(n); }
if (missingN.length === 0) ok('services page: SERVICE 01..39 all present');
else bad('services missing: ' + missingN.join(','));
if (svc.includes('YOUR REQUIREMENT')) ok('services page: client-requirement slot present (unnumbered, group E)');
else bad('services page: client-requirement slot missing');
/* Groups A–E: the two Chief-of-Staff groups were merged into one unique group by request. */
['live-today', 'onboarding', 'chief-of-staff-platform', 'client-builds', 'growth-addons'].forEach(id => {
  if (!svc.includes('id="' + id + '"')) bad('services group missing: ' + id);
});
if (findings.filter(f => f.startsWith('services group missing')).length === 0) ok('groups A–E all present');
if (svc.includes('Hazir Loop')) ok('Hazir Loop explainer present');
else bad('Hazir Loop missing');

/* ---------- 5. Compare pages ---------- */
head('Compare hub');
/* The five individual comparison pages were deleted by request. This guard INVERTS: they must not
   come back, and the hub must not link to them — a silent revert cannot pass. */
const goneCompare = ['go-high-level', 'synthflow', 'smith-ai', 'ai-sdr', 'human-receptionist'];
for (const slug of goneCompare) {
  if (exists('compare/' + slug + '/index.html')) bad('compare/' + slug + ' is back after its removal');
}
if (!findings.some(f => f.includes('is back after its removal'))) ok('all 5 individual comparison pages stay removed');
const hub = read('compare/index.html');
for (const slug of goneCompare) if (hub.includes('/compare/' + slug)) bad('compare hub still links to /compare/' + slug);
if (!findings.some(f => f.includes('hub still links'))) ok('compare hub links to none of the removed pages');
if (!exists('pricing/index.html')) ok('/pricing removed by request — the route is no longer built');
else bad('/pricing is still being built after its removal');

/* ---------- 6. Links & anchors ---------- */
head('Links & anchors');
const pages = {};
routes.forEach(r => { pages['/' + r] = read(r === '' ? 'index.html' : r.endsWith('.html') ? r : r.replace(/\/?$/, '/index.html')); });
let hrefCount = 0, brokenHref = [], brokenAnchor = [];
for (const [route, html] of Object.entries(pages)) {
  const anchors = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    if (href.startsWith('http') && !href.includes('hazirminds.ai')) continue;
    hrefCount++;
    if (href.startsWith('#')) { if (!anchors.has(href.slice(1))) brokenAnchor.push(route + href); continue; }
    const [pRaw, frag] = href.split('#');
    const p = pRaw.split('?')[0];   /* strip ?v= cache-busting — it is not part of the path */
    const clean = p.replace(/\/$/, '') || '/';
    const file = clean === '/' ? 'index.html' : clean.replace(/^\//, '') + '/index.html';
    if (!exists(file) && !exists(clean.replace(/^\//, '')) && !exists(clean.replace(/^\//, '') + '.html')) { brokenHref.push(route + ' → ' + href); continue; }
    if (frag) {
      const target = clean === '/' ? pages['/'] : pages[clean];
      if (target && !(new Set([...target.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]))).has(frag)) brokenAnchor.push(route + ' → ' + href);
    }
  }
}
ok(`${hrefCount} internal hrefs scanned`);
if (brokenHref.length === 0) ok('all internal page links resolve');
else brokenHref.forEach(b => bad('broken href: ' + b));
if (brokenAnchor.length === 0) ok('all internal #anchors resolve');
else brokenAnchor.forEach(b => bad('broken anchor: ' + b));

/* ---------- 7. JSON-LD + canonicals ---------- */
head('SEO / JSON-LD');
let ldCount = 0, ldBad = 0, canon = 0, canonBad = 0;
const types = {};
for (const f of walk(DIST).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    ldCount++;
    try {
      const o = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
      types[o['@type']] = (types[o['@type']] || 0) + 1;
    } catch (e) { ldBad++; bad('invalid JSON-LD in ' + f.replace(DIST, '') + ': ' + e.message.slice(0, 80)); }
  }
  const c = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (c) { canon++; if (!c[1].startsWith('https://hazirminds.ai')) { canonBad++; bad('non-hazirminds canonical in ' + f.replace(DIST, '') + ': ' + c[1]); } }
  else if (!/name="robots" content="noindex"/.test(html) && !f.endsWith('404.html')) bad('no canonical on ' + f.replace(DIST, ''));
}
if (ldBad === 0) ok(`${ldCount} JSON-LD blocks, all parse; types: ${Object.entries(types).map(([k, v]) => k + '×' + v).join(', ')}`);
if (canonBad === 0) ok(`${canon} canonicals, all absolute to https://hazirminds.ai`);
else bad(`canonical problems: ${canonBad}`);

/* ---------- 8. Copy / UTF-8 + sourced stats ---------- */
head('Copy / evidence');
/* /pricing and /ai were both removed by request, and every customer-facing price with them. This
   block used to prove the published prices stayed IDENTICAL across pages; with no price published it
   proves the opposite — that no price, fee, rate or cost figure has crept back onto any page. */
const pricingTxt = stripTags(read('index.html'));
if (home.includes('411 LOCALS (2016)') && home.includes('INSIDESALES.COM')) ok('home stats carry the corrected, named source footnotes');
else bad('home stat sources missing or stale (expected the 411 Locals 2016 attribution + the MIT study)');
let moji = [];
for (const f of walk(DIST).filter(f => f.endsWith('.html'))) {
  if (/Ã|â€|Â[\s\u00A0]/.test(fs.readFileSync(f, 'utf8'))) moji.push(f.replace(DIST, ''));
}
if (moji.length === 0) ok('no mojibake patterns anywhere');
else bad('mojibake in: ' + moji.join(', '));

/* ---------- 9. No published pricing ---------- */
head('Pricing');
{
  const allTxt = walk(DIST).filter(f => f.endsWith('.html')).map(f => stripTags(fs.readFileSync(f, 'utf8')));
  const leaked = [];
  /* Customer-facing money: our rates, our tiers, our overage, and the third-party/comparison figures
     that used to fill the cost rows. The two sourced MARKET statistics (62%, ~5 min) are not prices
     and are asserted separately. */
  ['$497', '$997', '$1,997', '$7,500', '$2,500', '$1,500', '$0.35', '$120k', '$80–$1,200', '$35–45k',
   '$97/mo', '$150/mo', '$300/mo', '$500/mo', '$29/mo', '$199/mo', '$380/mo', '$1–2k'].forEach(tok => {
    const pages = walk(DIST).filter(f => f.endsWith('.html')).filter(f => stripTags(fs.readFileSync(f, 'utf8')).includes(tok));
    if (pages.length) leaked.push(tok + ' on ' + pages.length + ' page(s)');
  });
  if (leaked.length === 0) ok('no price, fee, rate or cost figure is published anywhere');
  else bad('customer-facing pricing is still published: ' + leaked.join(', '));
}
/* Commercial terms went with the prices: lock-in and month-to-month release language is gone too. */
{
  const joined = walk(DIST).filter(f => f.endsWith('.html')).map(f => stripTags(fs.readFileSync(f, 'utf8'))).join(' ||| ');
  const lockIn = ['month-to-month', 'Month-to-month', 'no lock-in', 'after day 60', 'first 60 days'].filter(t => joined.includes(t));
  if (lockIn.length === 0) ok('no lock-in / month-to-month commercial language anywhere');
  else bad('lock-in language still published: ' + lockIn.join(', '));
}
if (pricingTxt.includes('No unpublished meters') || homeTxt.includes('No unpublished meters') || homeTxt.includes('no unpublished meters')) ok('"no unpublished meters — rate card before go-live" stated');
else bad('rate-card statement missing');
/* The annual figures are no longer displayed anywhere (that was /pricing copy), so the guard moves
   to the single source of truth instead of disappearing. */
{
  const T4 = require('../src/data/site.json').tiers;
  if (T4.chronos.annual === 414 && T4['hazir-pro'].annual === 831 && T4.aeon.annual === 1664) ok('annual math holds in the data (497→414, 997→831, 1997→1664)');
  else bad('annual price math drifted in site.json');
}

/* ---------- 10. Concealment (self-only) ---------- */
head('Concealment');
const forbiddenSelf = /\b(resell(er|ing)?|fulfillment partner|our vendor|backend vendor|agency partner)\b/i;
let conceal = 0;
for (const f of walk(DIST)) {
  if (!/\.(html|css|js|txt|xml)$/.test(f)) continue;
  if (forbiddenSelf.test(fs.readFileSync(f, 'utf8'))) { conceal++; bad('CONCEALMENT: ' + f.replace(DIST, '')); }
}
if (conceal === 0) ok('no reseller/fulfillment/vendor framing of our own offering');

/* ---------- 11. Motion & a11y ---------- */
head('Motion & a11y');
const css = read('assets/css/main.css');
if (!css.includes('prefers-reduced-motion')) ok('no reduced-motion off-switch in CSS — motion runs for every visitor');
else bad('reduced-motion block still present');
const mainJs = read('assets/js/main.js');
if (!mainJs.includes('prefers-reduced-motion')) ok('main.js carries no reduced-motion branch');
else bad('main.js: reduced-motion guard still present');
const pinCount = (mainJs.match(/pin:\s*true/g) || []).length;
if (pinCount <= 1) ok('ONE pin only (Silence-Tax)');
else bad(`${pinCount} pins found — spec allows one`);
const imgNoDim = [];
for (const f of walk(DIST).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<img[^>]*>/g)) {
    if (!/width=/.test(m[0]) && !/aspect-ratio/.test(m[0])) imgNoDim.push(f.replace(DIST, '') + ' ' + m[0].slice(0, 60));
  }
}
if (imgNoDim.length === 0) ok('all <img> have width/height or aspect-ratio (CLS guard)');
else imgNoDim.forEach(b => bad('img without dimensions: ' + b));

/* ---------- 12. JS budget ---------- */
head('JS budget');
const gz = (f) => { try { return parseInt(execSync(`gzip -c "${path.join(DIST, f)}" | wc -c`).toString().trim(), 10); } catch { return -1; } };
const parts = ['vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/lenis.min.js', 'assets/js/main.js'].map(f => [f, gz(f)]);
const total = parts.reduce((a, [, b]) => a + b, 0);
parts.forEach(([f, b]) => console.log(`    ${f}: ${(b / 1024).toFixed(1)} KB gz`));
if (total >= 0 && total <= 150000) ok(`JS total ${(total / 1024).toFixed(1)} KB gz ≤ 150 KB budget`);
else bad(`JS total ${(total / 1024).toFixed(1)} KB gz over/unknown budget`);

/* ---------- 13. Perf heuristics ---------- */
head('Perf');
const extRefs = new Set();
for (const f of walk(DIST).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:\ssrc|\srel="(?:stylesheet|preload|preconnect|modulepreload)")="?(https?:\/\/[^\s">]+)/g)) {
    if (!m[1].includes('hazirminds.ai')) extRefs.add(m[1]);
  }
}
if (extRefs.size === 0) ok('zero external runtime dependencies');
else bad('external refs: ' + [...extRefs].slice(0, 5).join(', '));
let imgOver = 0, imgTotal = 0, overList = [];
for (const f of walk(DIST).filter(f => /\.(jpe?g|png|webp|svg)$/.test(f))) {
  const kb = fs.statSync(f).size / 1024; imgTotal++;
  if (kb > 300) { imgOver++; overList.push(`${f.replace(DIST, '')} ${(kb | 0)}KB`); }
}
if (imgOver === 0) ok(`all ${imgTotal} images ≤ 300KB (incl. regenerated og-card)`);
else bad('images over 300KB: ' + overList.join(', '));
if (home.includes('og-card.jpg')) ok('OG image referenced');
const heroSection = home.slice(home.indexOf('class="hero"'), home.indexOf('S3 ·'));
if (!/loading="lazy"/.test(heroSection)) ok('hero eager (LCP-safe)');
else bad('hero image lazy-loaded (LCP risk)');

/* ---------- verdict ---------- */
console.log('\n================ PHASE 4: ' + findings.length + ' FINDINGS ================');
findings.forEach(f => console.log(' • ' + f));
fs.writeFileSync(path.join(__dirname, 'phase4.json'), JSON.stringify(findings, null, 2));
process.exit(findings.length ? 1 : 0);
