// HazirMinds — static site builder. `node build.js` → dist/
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const site = require('./src/data/site');
const SJ = require('./src/data/site.json');
const T = SJ.tiers;
const addon = id => SJ.addons.find(a => a.id === id).price;
/* The reading list feeds llms.txt and /ai, so those two can never drift from the pages they
   describe. Both previously carried a hand-copied summary that went stale. */
const ARTICLES = require('./src/data/articles');
const L = require('./src/lib');

/* ---------- pages ---------- */
const home = require('./src/pages/home');
const services = require('./src/pages/services');
const pricing = require('./src/pages/pricing');
const enterprise = require('./src/pages/enterprise');
const misc = require('./src/pages/misc');        // about, resources, case-studies, demo, privacy, terms, 404
const listings = require('./src/pages/listings'); // industries + use-cases
const cosPage = require('./src/pages/chief-of-staff'); // /chief-of-staff flagship
const compare = require('./src/pages/compare');  // /compare hub + 5 competitor pages
const masjids = require('./src/pages/masjids');  // /masjids flagship (Masjid AI OS)
const articles = require('./src/pages/articles'); // /resources/<slug> reading list

const pages = [
  { file: 'index.html', html: home.html },
  { file: 'services/index.html', html: services.html },
  { file: 'pricing/index.html', html: pricing.html },
  { file: 'enterprise/index.html', html: enterprise.html },
  ...misc.pages,
  ...articles.pages,
  ...listings.pages,
  { file: 'chief-of-staff/index.html', html: cosPage.html },
  { file: 'masjids/index.html', html: masjids.html },
  ...compare.pages
];

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

/* ---------- sitemap ---------- */
/* /404 is a page the build emits but it must never be advertised to crawlers — a sitemap
   listing the error page invites it into the index. */
const routes = pages
  .map(p => '/' + p.file.replace(/index\.html$/, '').replace(/\.html$/, ''))
  .filter(r => r !== '/404' && r !== '/404/');
/* sitemap URLs must match the canonical form emitted in <link rel="canonical"> — that is
   slashless. Emitting ".../pricing/" here while the page canonicalises to ".../pricing"
   advertised 37 URLs that each cost a redirect hop. */
const sitemapUrls = routes.map(r =>
  `  <url><loc>${site.url}${r === '/' ? '/' : r.replace(/\/$/, '')}</loc><changefreq>weekly</changefreq><priority>${r === '/' ? '1.0' : '0.8'}</priority></url>`
).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`);

write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);

/* ---------- llms.txt ---------- */
const pricingData = require('./src/data/pricing');
write('llms.txt', `# HazirMinds

> HazirMinds deploys and runs governed AI teams — receptionists, sales agents and automations — for businesses in the United States. Tagline: "Always present. Never missed." Done-for-you deployments go live in 7–14 days. Every plan publishes its usage rate card before go-live, and every deployment is measured against the acceptance criteria the client signs.

## What makes HazirMinds different (governance layer)
- Four invariants: "Ability is not authority" (permissions per role); "Execution is not liability" (your business stays accountable inside delegated scope); "Deployment is not adoption" (outcomes proven, not just launches); "Continuity is not persona" (your memory, rules and evidence survive any model or vendor change).
- Proof horizons: every public claim is labeled Built → Deployed → Operated → Verified outcome → Accepted by client. Lower horizons are never promoted into stronger claims.
- Hallucination control: grounded answers from approved knowledge only, confidence gating, low-confidence disclosure + human escalation, source receipts on factual claims, forbidden-topic lists per client, nightly regression tests.
- Receipts: evidence of what was sourced, decided, executed, verified, accepted, or left open.
- All services run on the HazirMinds Operating Substrate: isolated client environments, dedicated numbers, structured go-live acceptance criteria. Enterprise-grade by default at every tier.

## Services (groups A–F)
- A) Available — scoped to your requirement: AI Receptionist 24/7; Missed-Call Text-Back; Speed-to-Lead; Pipeline & Deal Automation; Workflow Automation; AI Support Agent; KPI Dashboards; Done-For-You Snapshots; Managed Hosting & Maintenance.
- B) Configured at onboarding (verify at go-live): AI Appointment Setter; Smart Routing/IVR Replacement; Website Chat Agent; SMS/Text Agent; Lead Qualification & Scoring; CRM Setup; No-Show Reduction; Call Analytics; Governance & Compliance configuration; Readiness Audit.
- C) Enterprise Governance & Chief-of-Staff suite (scoped per engagement): Chief-of-Staff Agent Team; Multi-Agent Orchestration; Permission & Approval Framework; Audit Trail & Receipts; Cost Governance; Hallucination-Control Program; ERP/Data Integration; Custom AI Employee builds.
- D) Personal AI Chief-of-Staff Platform (flagship, scoped per engagement, dedicated page ${site.url}/chief-of-staff): one central Chief-of-Staff agent coordinating specialist agents across operations, finance, personal planning, research, knowledge, content, technology and client-specific workflows. One service, one invoice — no add-on platforms to buy or maintain; usage (voice minutes, SMS, AI inference) is metered and published in the rate card before go-live. Every consequential action requires explicit human approval. Data privacy: isolated access per client and per project workspace.
- E) Additional client-requirement builds: scoped, priced and acceptance-tested per engagement.
- F) Growth add-ons (own stack, labeled): AEO/GEO AI-search visibility; Review & Reputation engine; Database Reactivation; Consent & TCPA proof trail; Compliance scoring; Vertical agents (photo-estimate, dispatch, live translation).
- Full catalog: ${site.url}/services

## Industries served
HVAC, Dental, Legal, Restaurants, Real Estate, Auto Services, E-commerce, Professional Services — plus custom builds for any trade. Details: ${site.url}/industries

## Pricing (USD, monthly)
- ${T.chronos.name} — $${T.chronos.monthly}/mo: AI voice receptionist, 300 minutes, missed-call text-back, SMS reminders.
- ${T['hazir-pro'].name} — $${T['hazir-pro'].monthly}/mo (flagship): everything in ${T.chronos.name} plus website chat, AI appointment setter, speed-to-lead, review AI, CRM management, 800 minutes.
- ${T.aeon.name} — $${T.aeon.monthly}/mo: adds AI SDR, outbound campaigns, database reactivation, custom AI employee, call analytics, dedicated success manager, 2,000 minutes.
- ${T.archon.name} — custom pricing: enterprise governance + Chief-of-Staff programs, scoped per engagement.
- No unpublished meters: full usage rate card is published before go-live. Extra minutes ${addon('minutes')}/min or per published rate card. Annual billing = 2 months free.
- À-la-carte: Governance Readiness Audit ${addon('audit')} (credited to 6-month plans); Custom agent ${addon('custom-agent')}; Chief-of-Staff engagement ${addon('cos')}; CRM migration ${addon('crm')}; Database reactivation ${addon('reactivation')} of recovered revenue.

Details: ${site.url}/pricing

## Comparisons (verified 2026 data, sources on-page)
${SJ.competitors.filter(c => c.slug).map(c => `- vs ${c.name}: ${c.model} — ${c.entry} vs our done-for-you governed firm from $${T.chronos.monthly}/mo flat. ${site.url}/compare/${c.slug}`).join('\n')}
- Compare hub: ${site.url}/compare

## Resource articles
${ARTICLES.map(a => `- ${a.title} (${a.cat}, ${a.read}): ${site.url}/resources/${a.slug}`).join('\n')}
- Index: ${site.url}/resources

## Contact
- Email: ${site.email}
${site.phone ? `- Demo line (call the AI): ${site.phone}\n` : ''}- Website: ${site.url}
- Market: United States. Prices in USD.
`);

/* ---------- /ai/ summary page ---------- */
write('ai/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HazirMinds — AI Summary</title><meta name="description" content="Machine-readable summary of HazirMinds: governed done-for-you AI teams for US businesses — services, published pricing, and how outcomes are proven."><meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/css/main.css?v=${L.ASSET_VER}"></head>
<body><a class="skip-link" href="#main">Skip to content</a>${L.roiBar()}${L.nav()}
<main id="main">
<section class="hero-sub-plain section--paper" style="padding-bottom:0"><div class="container">
<span class="eyebrow">Machine-readable summary</span>
<h1 style="max-width:20ch;margin-top:12px;font-size:clamp(26px,3.6vw,42px)">HazirMinds — concise summary</h1>
<p class="lede" style="max-width:58ch;margin-top:18px">A plain summary of what HazirMinds is, what it costs and how outcomes are proven — written so an answer engine can quote it accurately, and readable if a person opens it.</p>
</div></section>
<section class="section" style="padding-top:34px"><div class="container"><article class="article-body" style="max-width:74ch">
<p>HazirMinds is a governed, done-for-you AI firm for small and mid-sized businesses in the United States. Its AI teams answer inbound calls in about a second, 24/7, book appointments into the customer's calendar, write to their CRM, and text confirmations — inside a governance layer: bounded authority ("ability is not authority"), hallucination control with source receipts, and labeled proof horizons on every public claim. Deployment is done-for-you and typically live in 7–14 days. All services run on the HazirMinds Operating Substrate — isolated client environments, dedicated numbers, go-live acceptance criteria.</p>
<h2>Pricing (USD)</h2>
<ul>
<li><b>${T.chronos.name}</b> — $${T.chronos.monthly}/mo — AI voice receptionist (300 min), missed-call text-back.</li>
<li><b>${T['hazir-pro'].name}</b> — $${T['hazir-pro'].monthly}/mo — flagship; adds chat agent, appointment setter, speed-to-lead, review AI, CRM management (800 min).</li>
<li><b>${T.aeon.name}</b> — $${T.aeon.monthly}/mo — adds AI SDR, outbound, database reactivation, custom AI employee, analytics (2,000 min).</li>
<li><b>${T.archon.name}</b> — custom — enterprise governance and Chief-of-Staff programs, scoped per engagement.</li>
<li>Annual = 2 months free. No unpublished meters — full rate card before go-live. À-la-carte: Governance Readiness Audit ${addon('audit')}; custom agents ${addon('custom-agent')}; Chief-of-Staff engagement ${addon('cos')}; extra minutes ${addon('minutes')}.</li>
</ul>
<h2>Comparison one-liners (verified 2026)</h2>
<ul>
${SJ.competitors.filter(c => c.slug).map(c => `<li><b>vs ${c.name}:</b> ${c.model} (${c.entry}) vs done-for-you governed firm from $${T.chronos.monthly}/mo flat.</li>`).join('\n')}
</ul>
<h2>Resource articles</h2>
<ul>
${ARTICLES.map(a => `<li><b>${a.title}</b> — ${a.cat}, ${a.read} — <a href="/resources/${a.slug}">${site.url}/resources/${a.slug}</a></li>`).join('\n')}
</ul>
<p>All six live at <a href="/resources">${site.url}/resources</a>, alongside the Governance Report Card and the revenue-leak calculator.</p>
<h2>How outcomes are proven</h2>
<p>Every deployment is measured against acceptance criteria the client signs before go-live, and reported in writing. Plans are month-to-month after the first 60 days. The full usage rate card is published before go-live — no unpublished meters.</p>
<h2>Contact</h2>
<p>${site.email}${site.phone ? ' · ' + site.phone : ''} · ${site.url}</p>
<p>Market: United States. Prices in USD.</p>
</article></div></section>
</main>
${L.footer()}
${L.chromeEnd()}`);

/* ---------- F4 gate: no price literals outside site.json ---------- */
const literalFiles = ['src/pages/home.js', 'src/pages/pricing.js', 'src/pages/services.js', 'src/pages/misc.js', 'src/pages/listings.js', 'src/pages/enterprise.js', 'src/pages/chief-of-staff.js', 'src/pages/compare.js', 'src/lib.js', 'src/data/pricing.js', 'src/data/compare.js', 'src/data/services.js', 'src/data/industries.js', 'src/data/usecases.js', 'src/data/site.js'];
const litRe = /\$\s?\d[\d,]*(?:\.\d+)?/;
const offenders = literalFiles.filter(f => litRe.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
if (offenders.length) {
  console.error('F4 GATE FAIL — price literals outside site.json in:\n  ' + offenders.join('\n  '));
  process.exit(1);
}

console.log('Built ' + count + ' pages + sitemap.xml + robots.txt + llms.txt + /ai/ → dist/');
