// HazirMinds — shared layout library: head/SEO, nav, footer, components
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const site = require('./data/site');
const SJ = require('./data/site.json');

/* Cache-busting version for the two assets that have no hash in their filename.
   main.css / main.js never change name, so without this a browser or CDN keeps serving the old
   copy after a deploy — the classic "I pushed the fix and nothing changed" bug. Derived from the
   file contents, so the URL changes exactly when the file does and the assets can then be cached
   for a year in .htaccess. */
const ASSET_VER = (() => {
  const h = f => {
    try {
      return crypto.createHash('sha1').update(fs.readFileSync(path.join(__dirname, '..', f))).digest('hex').slice(0, 10);
    } catch (e) {
      return 'dev';
    }
  };
  return h('assets/css/main.css') + '.' + h('assets/js/main.js');
})();

/* ---------------- contact routing ----------------
   The site shipped "+1 (888) 555-0142". The 555-01xx range is reserved for fiction, so a
   phone-shaped link that cannot connect is worse than no link: it reads as a false claim and
   fails every visitor who taps it. site.phone is empty until a real working number exists and
   every contact CTA below resolves to email in the meantime. Set site.phone in
   src/data/site.js and all of them switch back to the call wording automatically. */
const TEL = site.phone ? 'tel:' + String(site.phone).replace(/[^\d+]/g, '') : 'mailto:' + site.email;
const CALL_LABEL = site.phone ? site.phone : site.email;
const CALL_TEXT = site.phone ? 'Call AI' : 'Email us';
const CALL_ICON = site.phone ? 'phone' : 'message';

/* ---------------- tiny helpers ---------------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonAttr = obj => JSON.stringify(obj).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/'/g, '&#39;');

/* ---------------- icons (inline SVG, stroke style) ---------------- */
const I = (name, cls) => {
  const paths = {
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    menu: '<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    workflow: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h7a1 1 0 0 1 1 1V14"/><path d="M14 17.5H7a1 1 0 0 1-1-1V10"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    package: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
    chev: '<polyline points="6 9 12 15 18 9"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A5.5 5.5 0 0 1 16 8z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    x_social: '<path d="M4 4l16 16M20 4L4 20"/>',
    youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.92 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="7" x2="10" y2="7"/><line x1="14" y1="7" x2="15" y2="7"/><line x1="9" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="15" y2="12"/><path d="M9 22v-4h6v4"/>',
    wallet: '<path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7"/><circle cx="17" cy="15" r="1.2" fill="currentColor" stroke="none"/>',
    stack: '<path d="M12 3 3 7.5 12 12l9-4.5L12 3z"/><path d="m3 12.5 9 4.5 9-4.5"/><path d="m3 17 9 4.5 9-4.5"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>',
    dollar: '<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 6.5C17 4.6 14.8 3 12 3S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>'
  };
  if (!paths[name]) throw new Error('Unknown icon "' + name + '" — add it to the I() path map in src/lib.js');
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
};

/* ---------------- head / SEO ---------------- */
/* The current path is recorded by head() and read by nav(), so every page marks its own
   nav item automatically instead of each of the 37 page files having to pass it in.
   Nothing set aria-current before, so neither screen readers nor sighted users were told
   which page they were on. */
let CURRENT_PATH = '/';
const normPath = p => '/' + String(p || '').split('#')[0].replace(/^\/+|\/+$/g, '');
const isCurrentHref = href => (href ? normPath(href) === normPath(CURRENT_PATH) : false);

/* Which context does the CURRENT page belong to? Derived from the path rather than passed in by every
   page, so the nav, the mobile bar and the sticky CTA cannot be forgotten — they all render through
   here. Returns '' when the page has no context (privacy, terms, the demo page itself). */
const ctxFromPath = () => {
  const CTX = require('./data/context');
  const parts = normPath(CURRENT_PATH).replace(/^\/|\/$/g, '').split('/');
  if (!parts[0]) return 'home';
  if (parts[0] === 'industries') return parts[1] && CTX[parts[1]] ? parts[1] : 'industries';
  return CTX[parts[0]] ? parts[0] : '';
};

function head(o) {
  CURRENT_PATH = o.path || '/';
  const title = o.rawTitle || (o.title + ' | HazirMinds');
  const url = site.url + o.path;
  const desc = o.desc || site.desc;
  const ld = (o.ld || []).map(x => '<script type="application/ld+json">' + JSON.stringify(x) + '</script>').join('\n  ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preload" as="font" type="font/woff2" href="/vendor/fonts/plus-jakarta-sans-latin-700-normal.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/vendor/fonts/plus-jakarta-sans-latin-800-normal.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/vendor/fonts/inter-latin-400-normal.woff2" crossorigin>
<!-- 500 was missing: .svc-rail a / .nav-link / .btn--ghost set font-weight:500, so those
     elements rendered in the fallback, then re-wrapped when Inter 500 finally swapped in —
     a measured 48px layout shift on /services at 768px. Preload the weight that is actually
     painted above the fold. -->
<link rel="preload" as="font" type="font/woff2" href="/vendor/fonts/inter-latin-500-normal.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/vendor/fonts/jetbrains-mono-latin-400-normal.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/vendor/fonts/jetbrains-mono-latin-500-normal.woff2" crossorigin>
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="HazirMinds">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.ogBase}/img/og-card.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${site.ogBase}/img/og-card.jpg">
<meta property="og:image:alt" content="${esc(title)} — HazirMinds">
<meta name="theme-color" content="#FAF7F2">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
${ld}
<link rel="stylesheet" href="/assets/css/main.css?v=${ASSET_VER}">
<style>
@font-face{font-family:"Plus Jakarta Sans";font-style:normal;font-weight:700;font-display:swap;src:url(/vendor/fonts/plus-jakarta-sans-latin-700-normal.woff2)format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-style:normal;font-weight:800;font-display:swap;src:url(/vendor/fonts/plus-jakarta-sans-latin-800-normal.woff2)format("woff2")}
@font-face{font-family:"Fraunces";font-style:italic;font-weight:400;font-display:swap;src:url(/vendor/fonts/fraunces-latin-400-italic.woff2)format("woff2")}
@font-face{font-family:"Fraunces";font-style:italic;font-weight:600;font-display:swap;src:url(/vendor/fonts/fraunces-latin-600-italic.woff2)format("woff2")}
@font-face{font-family:"Inter";font-style:normal;font-weight:400;font-display:swap;src:url(/vendor/fonts/inter-latin-400-normal.woff2)format("woff2")}
@font-face{font-family:"Inter";font-style:normal;font-weight:500;font-display:swap;src:url(/vendor/fonts/inter-latin-500-normal.woff2)format("woff2")}
@font-face{font-family:"JetBrains Mono";font-style:normal;font-weight:400;font-display:swap;src:url(/vendor/fonts/jetbrains-mono-latin-400-normal.woff2)format("woff2")}
@font-face{font-family:"JetBrains Mono";font-style:normal;font-weight:500;font-display:swap;src:url(/vendor/fonts/jetbrains-mono-latin-500-normal.woff2)format("woff2")}
</style>
<script>document.documentElement.className+=' js';</script>
</head>`;
}

/* ---------------- page chrome ---------------- */
function roiBar() {
  return `<!-- S0 · GUARANTEE BAR -->
<aside class="roi-bar" aria-label="No unpublished meters"><strong>No unpublished meters</strong> — the full usage rate card is in your hands before go-live.</aside>`;
}

function nav(active) {
  /* If a top-level item is the current page, it owns the marker — the same destination can
     also appear as a mega-menu child ("/chief-of-staff" sits under Products as well), and without
     this gate the parent lit up too, marking two nav items on one page. */
  const topMatch = site.nav.some(n => !n.mega && isCurrentHref(n.href));
  const items = site.nav.map(n => {
    if (n.mega) {
      const childOn = !topMatch && n.mega.some(m => m.col.some(l => isCurrentHref(l.href)));
      const links = n.mega.flatMap(m => m.col)
        .map(l => `<a href="${l.href}"${(!topMatch && isCurrentHref(l.href)) ? ' aria-current="page"' : ''}><b>${esc(l.name)}</b><span>${esc(l.desc)}</span></a>`).join('');
      return `<li class="nav-item${childOn ? ' is-current' : ''}"><button class="nav-link" aria-expanded="false">${n.label} ${I('chev', 'chev')}</button><div class="mega mega--2">${links}</div></li>`;
    }
    const on = isCurrentHref(n.href);
    return `<li class="nav-item${on ? ' is-current' : ''}"><a class="nav-link" href="${n.href}"${on ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('');
  /* The mobile panel used to render ONE link per top-level item, which silently dropped every
     mega-menu child: on a phone "Products" went to /services and "Industries" to /industries/home-field-services
     only, so /masjids, /chief-of-staff, seven industries and six comparison pages were unreachable
     from the navbar. It now mirrors the desktop nav exactly, as native <details> accordions — no
     JS needed, keyboard-operable, and it opens the group the current page belongs to. */
  const mobile = site.nav.map(n => {
    const flat = n.mega ? n.mega.flatMap(m => m.col) : [];
    const on = isCurrentHref(n.href) || flat.some(l => isCurrentHref(l.href));
    if (!n.mega) return `<a class="m-link" href="${n.href}"${isCurrentHref(n.href) ? ' aria-current="page"' : ''}>${n.label}</a>`;
    const kids = flat.map(l => `<a class="m-child" href="${l.href}"${isCurrentHref(l.href) ? ' aria-current="page"' : ''}><b>${esc(l.name)}</b><span>${esc(l.desc)}</span></a>`).join('');
    return `<details class="m-group"${on ? ' open' : ''}><summary>${n.label}<span class="m-n">${flat.length}</span></summary><div class="m-kids">${kids}</div></details>`;
  }).join('');
  return `<!-- S1 · NAV -->
<header class="nav-wrap">
  <div class="scroll-progress" aria-hidden="true"></div>
  <nav class="nav" aria-label="Primary">
    <div class="container nav-inner">
      <a class="brand" href="/"><span class="mark">H</span>Hazir<em>Minds</em></a>
      <ul class="nav-links">${items}</ul>
      <div class="nav-cta">
        <a class="btn btn--primary btn--sm" href="/demo${ctxFromPath() ? '?for=' + ctxFromPath() : ''}" data-cta="nav_book_demo"><span class="shine"></span>Book a Demo</a>
      </div>
      <button class="nav-burger" aria-expanded="false" aria-label="Open menu">${I('menu')}</button>
    </div>
    <div class="nav-mobile">
      ${mobile}
      <a class="btn btn--primary" href="/demo${ctxFromPath() ? '?for=' + ctxFromPath() : ''}" data-cta="mobile_book_demo"><span class="shine"></span>Book a Free Demo</a>
    </div>
  </nav>
</header>`;
}

function footer() {
  const col = (h, links) => `<div><div class="fcol-h">${h}</div><ul>${links.map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}</ul></div>`;
  return `
<!-- S14 · FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="top">
      <div>
        <a class="brand" href="/"><span class="mark">H</span>Hazir<em>Minds</em></a>
        <p>${site.tagline} HazirMinds deploys and runs governed AI teams for businesses in the United States — bounded authority, evidence receipts, audit trails, on the HazirMinds Operating Substrate.</p>
        <div class="chips" style="margin-top:16px"><span class="pill pill--dark">Serving the United States</span></div>
      </div>
      ${col('Products', [['/services', 'All services A–E'], ['/chief-of-staff', 'Chief-of-Staff Platform'], ['/masjids', 'Masjid AI OS (For Masjids)']])}
      ${col('Company', [['/about', 'About HazirMinds'], ['/case-studies', 'Case Studies']])}
      ${col('Legal & Contact', [['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Service'], ['mailto:' + site.email, site.email]].concat(site.phone ? [[TEL, CALL_LABEL]] : []))}
    </div>
    <div class="bottom">
      <span>© 2026 HazirMinds. All rights reserved.</span>
      <div class="socials">
        <a href="https://www.linkedin.com/company/hazirminds" aria-label="LinkedIn" rel="noopener">${I('linkedin')}</a>
        <a href="https://x.com/hazirminds" aria-label="X" rel="noopener">${I('x_social')}</a>
        <a href="https://www.youtube.com/@hazirminds" aria-label="YouTube" rel="noopener">${I('youtube')}</a>
      </div>
    </div>
  </div>
</footer>`;
}

function stickyCTA() {
  const k = ctxFromPath();
  const CTX = require('./data/context');
  const c = (k && CTX[k]) || CTX.fallback;
  return `<div class="sticky-cta"><a class="btn btn--primary" href="/demo${k ? '?for=' + k : ''}" data-cta="sticky_mobile"><span class="shine"></span>${c.short || 'Book a Free Demo'}</a><a class="btn btn--ghost" href="${TEL}" data-cta="sticky_call">${I(CALL_ICON)} ${CALL_TEXT}</a></div>`;
}

/* ---------------- royal chrome: back-to-top · consent · assistant · toasts ---------------- */
function backToTop() {
  return `
<button class="to-top" id="to-top" type="button" aria-label="Back to top">${I('arrow')}</button>`;
}

function consentBanner() {
  return `
<div class="consent" id="consent" role="region" aria-label="Privacy choices" hidden>
  <p><b>Privacy-first by default.</b> No ad trackers, no third-party cookies, nothing sold. We store one local preference on your device: this choice. <a href="/privacy" style="color:var(--rust-text)">Privacy</a> · <a href="/terms" style="color:var(--rust-text)">Terms</a></p>
  <div class="consent-actions">
    <button class="btn btn--primary btn--sm" type="button" data-consent="essential">Essential only</button>
    <button class="btn btn--ghost btn--sm" type="button" data-consent="all">Allow anonymous analytics</button>
  </div>
</div>`;
}

/* Governed website assistant — answers come from approved site knowledge only.
   Everything is built from site.json, so it can never quote a stale price, and
   anything outside the approved set is disclosed and escalated, never guessed. */
function assistant() {
  const kb = [
    {
      q: 'What does HazirMinds actually do?',
      a: 'We run a managed AI team for your business — 24/7 AI receptionist, missed-call text-back, speed-to-lead, booking, pipeline and workflow automation, support deflection and reporting. Deployed and operated for you, with approval gates and a full audit trail.',
      href: '/services', label: 'Services catalog'
    },
    {
      q: 'Can the AI make things up?',
      a: 'Answers are grounded in your approved knowledge base only, with confidence gating: when something is unknown, outdated or out of scope, the assistant says so and escalates to a human. Every factual claim carries a source receipt, and call flows run nightly regression tests.',
      href: '/chief-of-staff', label: 'Governance layer'
    },
    {
      q: 'How is this different from GoHighLevel or Smith.ai?',
      a: 'They sell you a DIY platform or per-call buckets. We sell a governed, done-for-you outcome: flat transparent tiers, published usage rates, managed deployment, and a governance layer — bounded authority, hallucination control, receipts and proof horizons — that the DIY and per-call models do not offer.',
      href: '/compare', label: 'Comparison hub'
    },
    {
      q: 'Do you build for masjids and Islamic centers?',
      a: 'Yes — the HazirMinds AI Operating System for Masjids connects events, communications, registrations, facilities, volunteers, donations, knowledge and reporting through one controlled operational layer, with committee routing, approval chains and audit receipts.',
      href: '/masjids', label: 'Masjid AI OS'
    }
  ];
  return `
<button class="asst-btn" id="asst-btn" type="button" aria-expanded="false" aria-controls="asst-panel" aria-label="Open the governed website assistant">${I('chat')}<span class="dot" aria-hidden="true"></span></button>
<div class="asst-panel" id="asst-panel" role="dialog" aria-label="Governed website assistant">
  <div class="asst-head">
    <div><b>HazirMinds assistant</b><div style="font-size:12.5px;color:var(--muted)">Governed · source-linked</div></div>
    <button class="asst-x" type="button" data-asst-close aria-label="Close assistant">${I('close')}</button>
  </div>
  <p class="asst-note">Approved site knowledge only — unknown questions are escalated, never guessed</p>
  <div id="asst-log" aria-live="polite">
    ${kb.map((k, i) => `<button class="asst-q" type="button" data-asst-q="${i}">${esc(k.q)}</button>`).join('')}
  </div>
  <form class="asst-bar" id="asst-form">
    <label for="asst-input" style="position:absolute;left:-9999px">Ask a question</label>
    <input id="asst-input" name="q" autocomplete="off" placeholder="Ask about services, governance…">
    <button class="btn btn--primary btn--sm" type="submit">Ask</button>
  </form>
</div>
<script type="application/json" id="asst-kb">${JSON.stringify(kb)}</script>`;
}

function chromeEnd() {
  return `
${stickyCTA()}
${backToTop()}
${consentBanner()}
${assistant()}
<div class="cursor-glow" aria-hidden="true"></div>
<div class="toast-host" id="toast-host" role="status" aria-live="polite"></div>
${exitModal()}
<script src="/vendor/gsap.min.js" defer></script>
<script src="/vendor/ScrollTrigger.min.js" defer></script>
<script src="/vendor/lenis.min.js" defer></script>
<script src="/assets/js/main.js?v=${ASSET_VER}" defer></script>
</body>
</html>`;
}

/* ---------------- the Governance Report Card form, in ONE place ----------------
   It renders twice: inside the exit-intent modal on every page, and as its own /demo section below
   the demo form. Two copies of a form with ids would collide (the modal is on /demo too), so the
   field prefix is a parameter and the copy is written once. */
function auditForm(prefix, id) {
  const P = prefix;
  return `
    <form data-validate${id ? ' id="' + id + '"' : ''} data-endpoint="${site.leadEndpoint}">
      <div data-fields class="form-grid">
        <div class="form-field"><label for="${P}-name">Name</label><input id="${P}-name" name="name" required autocomplete="name"><span class="err">Please enter your name</span></div>
        <div class="form-field"><label for="${P}-email">Work email</label><input id="${P}-email" name="email" type="email" required autocomplete="email"><span class="err">Enter a valid email</span></div>
        <div class="form-field full"><label for="${P}-company">Company</label><input id="${P}-company" name="company" required autocomplete="organization"><span class="err">Please enter your company</span></div>
        <div class="form-field full"><button class="btn btn--primary" type="submit"${id ? '' : ' style="width:100%"'}><span class="shine"></span>Send me the audit</button></div>
      </div>
      <div class="form-success">
        ${I('check')}
        <div><b>Request received.</b><p class="muted" style="font-size:13.5px;margin:4px 0 0">We'll email your Governance Report Card to the address you entered. Questions first? Email <a href="mailto:${site.email}" style="color:var(--rust-text)">${site.email}</a>.</p></div>
      </div>
      <div class="form-error" role="alert">
        ${I('info')}
        <div><b>That didn't send.</b><p class="muted" style="font-size:13.5px;margin:4px 0 0">Something failed on our end — your details are still in the form above, so you can try again. Or email <a data-mailto="${site.email}" href="mailto:${site.email}" style="color:var(--rust-text)">${site.email}</a> and we'll send the report card from there.</p></div>
      </div>
    </form>`;
}

/* ---------------- exit-intent modal ---------------- */
function exitModal() {
  return `
<div class="modal-root" id="exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-title">
  <div class="veil" data-modal-close></div>
  <div class="modal">
    <button class="close" data-modal-close aria-label="Close">${I('close')}</button>
    <span class="eyebrow eyebrow--rust">Before you go</span>
    <h3 id="exit-title" style="font-size:26px;margin-bottom:10px">Get your free Governance Report Card</h3>
    <p class="muted" style="font-size:14.5px">A scored read on your AI risk, consent trail, audit readiness and escalation gaps.</p>
    ${auditForm('ex', 'audit-form')}
  </div>
</div>`;
}

/* ---------------- governance layer partial (home S8, /chief-of-staff) ---------------- */
function governanceBand(opts) {
  const C = require('./data/compare');
  const compact = opts && opts.compact;
  /* The four invariants render on the home page. The merged Chief-of-Staff page takes the rest of
     the governance body WITHOUT them — they were removed from that page by request. */
  const invariants = !(opts && opts.noInvariants);
  return `
${invariants ? `<div class="invariant-grid" data-reveal="children">
  ${C.invariants.map((iv, i) => `
  <div class="invariant">
    <span class="inv-n">INVARIANT ${'0' + (i + 1)}</span>
    <h3>“${iv.t}”</h3>
    <p>${iv.d}</p>
  </div>`).join('')}
</div>` : ''}
${compact ? '' : `
<div class="grid grid-2" style="margin-top:56px;align-items:start">
  <div class="card on-dark" data-reveal style="background:rgba(250,247,242,.04);border-color:rgba(250,247,242,.12)">
    <span class="eyebrow">Responsibility layers</span>
    <h3 style="color:var(--cream);font-size:22px;margin-bottom:14px">Who holds authority — and where the boundary sits</h3>
    <div class="layers-diagram" data-layers>
      ${C.layers.map(l => `
      <div class="layer-row">
        <span class="ln">${l.n}</span>
        <div class="fcol-h" style="font-family:var(--font-mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);margin-bottom:8px">${l.t}</div>
        <p>${l.d}</p>
      </div>`).join('')}
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:20px">
    <div class="hallucination-panel" data-reveal>
      <span class="eyebrow">Hallucination control</span>
      <h3 style="color:var(--cream);font-size:20px;margin-bottom:12px">Grounded answers, or an honest “I don't know”</h3>
      <ul>
        <li>${I('check')}<span>Grounded answers only from <b style="color:var(--cream)">your approved knowledge</b> — no open improvisation.</span></li>
        <li>${I('check')}<span><b style="color:var(--cream)">Confidence gating:</b> low-confidence moments are disclosed and escalated to a human.</span></li>
        <li>${I('check')}<span>Every factual claim carries a <b style="color:var(--cream)">source receipt</b>.</span></li>
        <li>${I('check')}<span><b style="color:var(--cream)">Forbidden-topic list</b> per client, enforced at the substrate level.</span></li>
        <li>${I('check')}<span><b style="color:var(--cream)">Nightly regression tests</b> on call flows — scripts drift, we catch it.</span></li>
      </ul>
    </div>
    <div class="hallucination-panel" data-reveal style="padding:24px 30px">
      <span class="eyebrow">Sample evidence receipt</span>
      <div class="receipt" data-receipt>
        <div class="rc-head"><span class="rc-pulse" aria-hidden="true"></span><span>Live receipt</span><span class="rc-time">today · 14:02</span></div>
        <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Sourced</b><span>pricing_tiers.json · rev 14</span></div><code>src-ok</code></div>
        <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Decided</b><span>quote accepted — rule: owner approval above ${SJ.sampleReceipt.approvalRule}</span></div><code>gate-pass</code></div>
        <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Executed</b><span>booking written → CRM #8412</span></div><code>14:02:11</code></div>
        <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Verified</b><span>transcript + sentiment attached</span></div><code>2 files</code></div>
        <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Accepted</b><span>client sign-off · audit export #2026-06</span></div><code>signed</code></div>
        <div class="rc-row open"><span class="rc-dot wait" aria-hidden="true"></span><div><b>Open</b><span>callback requested — routed to Operative (human)</span></div><code>queued</code></div>
      </div>
    </div>
  </div>
</div>
<div style="margin-top:56px" data-reveal="children">
  <span class="eyebrow">Proof horizons — our public honesty standard</span>
  <h3 style="color:var(--cream);font-size:22px;margin-bottom:16px">Every claim we publish is labeled. We never promote a lower horizon into a stronger claim.</h3>
  <div class="horizons" data-horizons>
    ${C.horizons.map((h, i) => `
    <div class="horizon${i < 2 ? ' done' : ''}">
      <span class="hn">${'0' + (i + 1)}</span>
      <b>${h.t}</b>
      <span>${h.d}</span>
      <span class="stamp">✓ LABELED</span>
    </div>`).join('')}
  </div>
</div>
<div class="chip-row" style="margin-top:44px" data-reveal="children">
  ${C.chips.map(c => `<span class="pill">${I('shield')} ${c}</span>`).join('')}
</div>`}`;
}

/* ---------------- shared components ---------------- */
/* `ctx` is a key into src/data/context.js. It rides along as ?for=<key> so the demo page knows what
   the visitor was reading and can carry it into the form — a contextual CTA that loses its context on
   click is just a differently worded generic button. */
/* Wherever a price used to be published, this is what stands in its place. One constant, so the
   wording cannot drift page to page. It promises nothing numeric: scope is configured per workflow
   and quoted per engagement. */
const QUOTE = "Tell us what you need. We'll configure the right solution around your workflow and provide a custom quote.";
const QUOTE_SHORT = "Configured to your workflow — custom quote, no published rate card.";

const btnDemo = (label, cta, cls, ctx) => `<a class="btn ${cls || 'btn--primary'}" href="/demo${ctx ? '?for=' + ctx : ''}" data-cta="${cta}"><span class="shine"></span>${label || 'Book a Free Demo'} ${I('arrow')}</a>`;
const btnDemoPlain = (label, cta, cls, ctx) => `<a class="btn ${cls || 'btn--primary'}" href="/demo${ctx ? '?for=' + ctx : ''}" data-cta="${cta}"><span class="shine"></span>${label || 'Book a Free Demo'}</a>`;

function faqBlock(faqs, jsonLdPath) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } }))
  };
  const html = faqs.map(f => `
    <div class="faq-item">
      <button class="faq-q" aria-expanded="false">${f.q}<span class="ind">${I('plus')}</span></button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>`).join('');
  return { ld, html };
}

function breadcrumbs(items) {
  return {
    ld: {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: site.url + it[1] }))
    },
    html: `<nav class="crumbs" aria-label="Breadcrumb">${items.map((it, i) => i < items.length - 1
      ? `<a href="${it[1]}">${it[0]}</a> <span>/${' '}</span> `
      : `<span aria-current="page">${it[0]}</span>`).join('')}</nav>`
  };
}

function orgLd() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: 'HazirMinds', url: site.url, logo: site.ogBase + '/img/og-card.jpg', email: site.email, telephone: site.phone || undefined,
    sameAs: ['https://www.linkedin.com/company/hazirminds', 'https://x.com/hazirminds', 'https://www.youtube.com/@hazirminds'],
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: site.email, availableLanguage: ['en'] }],
    slogan: site.tagline
  };
}
function websiteLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: 'HazirMinds', url: site.url };
}

module.exports = {
  QUOTE, QUOTE_SHORT, esc, jsonAttr, I, head, roiBar, nav, footer, chromeEnd, exitModal, auditForm, btnDemo, btnDemoPlain, faqBlock, breadcrumbs, orgLd, websiteLd, governanceBand, site, TEL, CALL_LABEL, CALL_TEXT, CALL_ICON, ASSET_VER };
