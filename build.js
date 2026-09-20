// HazirMinds — static site builder. `node build.js` → dist/
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const site = require('./src/data/site');
const SJ = require('./src/data/site.json');
const T = SJ.tiers;
const addon = id => SJ.addons.find(a => a.id === id).price;
const L = require('./src/lib');

/* ---------- pages ---------- */
const home = require('./src/pages/home');
const services = require('./src/pages/services');
const misc = require('./src/pages/misc');        // about, resources, case-studies, demo, privacy, terms, 404
const industries = require('./src/pages/industries'); // /industries hub + 11 umbrella pages
const cosPage = require('./src/pages/chief-of-staff'); // /chief-of-staff flagship
const compare = require('./src/pages/compare');  // /compare hub + 5 competitor pages
const masjids = require('./src/pages/masjids');  // /masjids flagship (Masjid AI OS)

const pages = [
  { file: 'index.html', html: home.html },
  { file: 'services/index.html', html: services.html },
  ...misc.pages,
  ...industries.pages,
  { file: 'chief-of-staff/index.html', html: cosPage.html },
  { file: 'masjids/index.html', html: masjids.html },
  ...compare.pages
];

/* ---------- gate: the legacy industry redirects must match the taxonomy ---------- */
/* vercel.json is read by the platform before this build runs and deploy/htaccess.conf is copied into
   dist/, so neither can be generated here. Assert them against src/data/industries.js instead, or the
   taxonomy and the redirects drift and the old trade URLs start 404ing. */
{
  const { legacy } = require('./src/data/industries');
  const vc = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const ht = fs.readFileSync(path.join(ROOT, 'deploy', 'htaccess.conf'), 'utf8');
  const bad = [];
  Object.keys(legacy).forEach(old => {
    const dest = '/industries/' + legacy[old];
    /* A map entry whose target IS its source emits a 301 from a URL to itself. That is a loop, not a
       redirect, and it shipped here because the gate only asserted the redirects EXISTED — never that
       they went somewhere. Refuse to build one. */
    if (legacy[old] === old) { bad.push('legacy map: /industries/' + old + ' maps to itself — remove the entry, never redirect it'); return; }
    if (!(vc.redirects || []).some(r => r.source === '/industries/' + old && r.destination === dest && r.permanent)) bad.push('vercel.json: /industries/' + old);
    if (!ht.includes('RewriteRule ^industries/' + old + '/?$ ' + dest + ' [R=301,L]')) bad.push('htaccess.conf: /industries/' + old);
  });
  /* Same rule for both configs directly: no destination may equal its own source. */
  (vc.redirects || []).forEach(r => { if (r.source.replace(/\/$/, '') === (r.destination || '').replace(/\/$/, '')) bad.push('vercel.json: ' + r.source + ' redirects to itself'); });
  if (bad.length) {
    console.error('REDIRECT GATE FAIL — legacy industry URLs are not redirected in:\n  ' + bad.join('\n  '));
    process.exit(1);
  }
}

/* ---------- helpers ---------- */
function write(rel, content) {
  const dest = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const f of fs.readdirSync(srcDir)) {
    // og-card.png is an 896KB source duplicate of og-card.jpg (which pages reference) — never ship it
    if (srcDir.endsWith('img') && f === 'og-card.png') continue;
    const s = path.join(srcDir, f), d = path.join(destDir, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/* ---------- clean & build ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// static assets
copyDir(path.join(ROOT, 'img'), path.join(DIST, 'img'));
copyDir(path.join(ROOT, 'vendor'), path.join(DIST, 'vendor'));
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

/* ---------- Apache config + PHP lead endpoint (cPanel / SpaceShip) ----------
   The site is deployed by uploading the CONTENTS of dist/ into public_html, so anything the
   host needs at the document root has to live inside dist/ — not at the repo root. */
write('.htaccess', fs.readFileSync(path.join(ROOT, 'deploy', 'htaccess.conf'), 'utf8'));

/* The PHP endpoint exists only for cPanel-style hosting. Vercel runs api/lead.js as a
   serverless function and rejects a build in which two files claim the same route, so on
   Vercel the PHP copies are skipped and only the function is deployed. */
if (!process.env.VERCEL) {
  const API_DIR = path.join(DIST, 'api');
  fs.mkdirSync(API_DIR, { recursive: true });
  for (const f of ['lead.php', 'config.sample.php', '.htaccess']) {
    fs.copyFileSync(path.join(ROOT, 'api', f), path.join(API_DIR, f));
  }
}
/* api/config.php and api/leads.log are per-deployment and gitignored — never copied from the
   repo. Copying them here would overwrite a live configuration on rebuild. */

write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0F0D0B"/><text x="32" y="44" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#B98A2E" text-anchor="middle">H</text></svg>`);

// pages
let count = 0;
for (const p of pages) { write(p.file, p.html); count++; }

/* sitemap.xml, robots.txt, llms.txt and the /ai/ summary were removed by request. */


/* ---------- F4 gate: no price literals outside site.json ---------- */
const literalFiles = ['src/pages/home.js', 'src/pages/services.js', 'src/pages/misc.js', 'src/pages/chief-of-staff.js', 'src/pages/compare.js', 'src/lib.js', 'src/data/pricing.js', 'src/data/compare.js', 'src/data/services.js', 'src/data/industries.js', 'src/data/industries/group-1.js', 'src/data/industries/group-2.js', 'src/data/industries/group-3.js', 'src/data/site.js'];
const litRe = /\$\s?\d[\d,]*(?:\.\d+)?/;
const offenders = literalFiles.filter(f => litRe.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
if (offenders.length) {
  console.error('F4 GATE FAIL — price literals outside site.json in:\n  ' + offenders.join('\n  '));
  process.exit(1);
}

console.log('Built ' + count + ' pages → dist/');
