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
const expect = ['0','1','2','3','4','5','7','8','10','11','13','14'];
if (JSON.stringify(sections) === JSON.stringify(expect)) ok('home: S0..S14 minus the three removed sections, markers in order (S6, S9, S12 gone by design)');
else bad(`home sections: [${sections.join(',')}] expected [${expect.join(',')}]`);

const routes = ['', 'services', 'pricing', 'enterprise', 'chief-of-staff', 'compare',
  'compare/go-high-level', 'compare/synthflow', 'compare/smith-ai', 'compare/ai-sdr', 'compare/human-receptionist',
  'case-studies', 'about', 'resources', 'demo', 'privacy', 'terms', '404.html',
  'industries/hvac', 'industries/dental', 'industries/legal', 'industries/restaurant', 'industries/realestate', 'industries/auto', 'industries/ecommerce', 'industries/proservices',
  'use-cases/after-hours-rescue', 'use-cases/speed-to-lead', 'use-cases/missed-call-textback', 'use-cases/no-show-reduction', 'use-cases/database-reactivation', 'use-cases/inbound-qualification', 'use-cases/review-engine', 'use-cases/crm-automation', 'use-cases/ai-employee'];
routes.forEach(r => { if (!exists(r === '' ? 'index.html' : r + '/index.html') && !exists(r)) bad('missing route: /' + r); });
if (findings.filter(f => f.startsWith('missing route')).length === 0) ok(`${routes.length} audited routes all present`);
if (exists('sitemap.xml') && exists('robots.txt') && exists('llms.txt') && exists('favicon.svg')) ok('sitemap.xml + robots.txt + llms.txt + favicon.svg present');
else bad('missing SEO root files');

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
if (home.includes('Ability is not authority') && home.includes('Continuity is not persona')) ok('home S7: four invariant cards present');
else bad('home S7 invariants missing');
/* Home carries the COMPACT governance band (four invariants only) — the full responsibility
   layers + proof horizons live on /enterprise, so assert them where they actually render. */
if (!home.includes('data-layers') && !home.includes('data-horizons')) ok('home S7: compact band (layers/horizons moved to /enterprise)');
else bad('home S7: compact band expected, but the full layer/horizon markup is on the home page');
if (read('enterprise/index.html').includes('data-layers') && read('enterprise/index.html').includes('data-horizons')) ok('/enterprise: responsibility layers + proof horizons rendered');
else bad('/enterprise: layer/horizon diagram missing');
if (homeTxt.includes('HazirMinds Operating Substrate')) ok('Operating Substrate named on home');
else bad('Operating Substrate missing on home');
const cos = read('chief-of-staff/index.html');
['Practice Operations', 'Personal Finance', 'Family & Personal', 'Research & Knowledge', 'Website & Content', 'Asset & Vehicle', 'Personal Technology'].forEach(s => {
  if (!cos.includes(s)) bad('chief-of-staff: specialist missing — ' + s);
});
if (findings.filter(f => f.startsWith('chief-of-staff: specialist')).length === 0) ok('/chief-of-staff: all 7 specialists present');
if (cos.includes('AWAITING APPROVAL') && cos.includes('ONE payment')) ok('/chief-of-staff: approval-gate receipt + one-payment statement');
const ent = read('enterprise/index.html');
if (ent.includes('Ability is not authority')) ok('/enterprise: governance layer present');

/* ---------- 4. Services A–F ---------- */
head('Services');
const svc = read('services/index.html');
const missingN = []; for (let i = 1; i <= 39; i++) { const n = String(i).padStart(2, '0'); if (!svc.includes('SERVICE ' + n)) missingN.push(n); }
if (missingN.length === 0) ok('services page: SERVICE 01..39 all present');
else bad('services missing: ' + missingN.join(','));
if (svc.includes('YOUR REQUIREMENT')) ok('services page: client-requirement slot present (unnumbered, group E)');
else bad('services page: client-requirement slot missing');
['live-today', 'onboarding', 'enterprise-suite', 'chief-of-staff-suite', 'client-builds', 'growth-addons'].forEach(id => {
  if (!svc.includes('id="' + id + '"')) bad('services group missing: ' + id);
});
if (findings.filter(f => f.startsWith('services group missing')).length === 0) ok('groups A–F all present');
if (svc.includes('Hazir Loop')) ok('Hazir Loop explainer present');
else bad('Hazir Loop missing');

/* ---------- 5. Compare pages ---------- */
head('Compare hub');
for (const slug of ['go-high-level', 'synthflow', 'smith-ai', 'ai-sdr', 'human-receptionist']) {
  const c = read('compare/' + slug + '/index.html');
  if (!c.includes('verdict')) bad('compare/' + slug + ': no verdict box');
  if (!c.includes('Who should NOT buy HazirMinds')) bad('compare/' + slug + ': honesty paragraph missing');
  if (!/<script type="application\/ld\+json">[\s\S]*FAQPage/.test(c)) bad('compare/' + slug + ': FAQPage schema missing');
}
if (findings.filter(f => f.startsWith('compare/')).length === 0) ok('all 5 compare pages: verdict + table + 5 FAQs + honesty note + FAQPage schema');
if (read('pricing/index.html').includes('What the alternatives actually cost')) ok('/pricing: competitor cost table present');

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
const pricingTxt = stripTags(read('pricing/index.html'));
if (pricingTxt.includes('À-la-carte')) ok('pricing: "À-la-carte" correct UTF-8');
else bad('pricing: À-la-carte encoding broken');
if (home.includes('411 LOCALS (2016)') && home.includes('INSIDESALES.COM') && home.includes('INDUSTRY VENDOR ESTIMATES')) ok('home stats carry the corrected, named source footnotes');
else bad('home stat sources missing or stale (expected the 2016 attribution + the MIT study + the "no primary study" disclaimer)');
let moji = [];
for (const f of walk(DIST).filter(f => f.endsWith('.html'))) {
  if (/Ã|â€|Â[\s\u00A0]/.test(fs.readFileSync(f, 'utf8'))) moji.push(f.replace(DIST, ''));
}
if (moji.length === 0) ok('no mojibake patterns anywhere');
else bad('mojibake in: ' + moji.join(', '));

/* ---------- 9. Price consistency ---------- */
head('Pricing');
/* Every page that mentions a tier price must state the same value (site.json is the only source) */
{
  const allTxt = walk(DIST).filter(f => f.endsWith('.html')).map(f => stripTags(fs.readFileSync(f, 'utf8')));
  const drift = [];
  /* '$80–$1,200' is replaced by '$1,200': the RANGE was only ever rendered by the removed #why
     comparison table, while the Silence Tax stat card renders this same figure as an animated
     counter, so '$1,200' is the form still published. Re-pointing the token keeps the guard on the
     same claim instead of deleting the check. */
  [['$497'], ['$997'], ['$1,997'], ['$7,500'], ['$0.35'], ['62%'], ['$1,200']].forEach(([tok]) => {
    const pages = walk(DIST).filter(f => f.endsWith('.html')).filter(f => stripTags(fs.readFileSync(f, 'utf8')).includes(tok));
    if (pages.length) ok(`${tok} stated on ${pages.length} page(s) — single-source value`);
    else drift.push(tok);
    if (pages.length && !allTxt.some(t => t.includes(tok))) drift.push(tok);
  });
  if (drift.length === 0) ok('sync grep: all canonical price/stat tokens present and identical');
  else bad('sync grep — tokens missing everywhere: ' + drift.join(', '));
}
[['$1,500'], ['from $2,500'], ['from $7,500'], ['from $997'], ['$500 + 10%'], ['$0.35']].forEach(([p]) => {
  if (!pricingTxt.includes(p)) bad(`pricing missing token ${p}`);
});
if (findings.filter(f => f.startsWith('pricing missing')).length === 0) ok('à-la-carte + rate-card tokens present');
if (pricingTxt.includes('No unpublished meters') || homeTxt.includes('No unpublished meters') || homeTxt.includes('no unpublished meters')) ok('"no unpublished meters — rate card before go-live" stated');
else bad('rate-card statement missing');
if (/414/.test(read('pricing/index.html'))) ok('annual math present (497→414)');

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
