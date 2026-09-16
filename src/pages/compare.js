// HazirMinds — /compare hub + 5 competitor pages + masjid-platforms lane
const L = require('../lib');
const { I, nav, footer, chromeEnd, roiBar, site } = L;
const C = require('../data/compare');
const SJ = require('../data/site.json');

function tableFor(rowIdxs) {
  const dims = C.matrix.dims;
  const rows = rowIdxs.map(i => C.matrix.rows[i]);
  return `
  <div class="compare-wrap" data-reveal>
    <table class="compare compare-table">
      <thead><tr><th scope="col">Dimension</th>${rows.map(r => `<th scope="col"${r.slug === null ? ' style="background:var(--rust);color:#fff"' : ''}>${r.name}</th>`).join('')}</tr></thead>
      <tbody data-row-reveal>
        ${dims.map((d, di) => `
        <tr><td>${d}</td>${rows.map(r => `<td${r.slug === null ? ' class="col-hazir"' : ''}>${r.cells[di]}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>
  <p class="src-note" style="margin-top:10px">Sources: vendor public pricing pages and published rate documentation, verified Q3 2026. Vendor prices change — verify before deciding.</p>`;
}

function comparePage(slug) {
  const p = C.pages[slug];
  const rows = p.rows.map(i => C.matrix.rows[i]);
  const faq = L.faqBlock(p.faqs);
  const bc = L.breadcrumbs([['Home', '/'], ['Compare', '/compare'], ['vs ' + p.name, '']]);
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container" style="max-width:860px">
      ${bc.html}
      <span class="eyebrow eyebrow--rust">Verified 2026 comparison</span> <span class="pill pill--brass stamp-verified" style="font-size:11px;vertical-align:middle;margin-left:8px">✓ Verified Sept 2026</span>
      <h1 style="font-size:clamp(32px,4vw,52px)">HazirMinds vs ${p.name}</h1>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container" style="max-width:860px">
      <div class="verdict-box" data-reveal>
        <h2 style="font-size:18px;margin-bottom:8px">The verdict</h2>
        <p style="margin:0;font-size:15.5px">${p.verdict}</p>
      </div>
      ${tableFor(p.rows)}
      <div style="margin-top:44px" data-reveal="children">
        <span class="eyebrow">Straight answers</span>
        <h2 class="sr-only" style="position:absolute;left:-9999px">FAQs</h2>
        <div class="faq" style="max-width:none">
          ${faq.html}
        </div>
      </div>
      <div class="honesty-note" data-reveal style="margin-top:36px">
        <h3>Who should NOT buy HazirMinds</h3>
        <p>${p.notFor}</p>
      </div>
      <div class="final-cta" data-reveal style="margin-top:48px">
        <div class="inner" style="max-width:620px">
          <span class="serif-accent">${site.tagline}</span>
          <h2 style="font-size:clamp(24px,2.6vw,34px)">Hear the difference yourself</h2>
          <div class="hero-ctas">${L.btnDemoPlain('Book a Free Demo', 'compare_' + slug, 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>`;
  return shell({
    title: p.title,
    path: '/compare/' + slug,
    desc: p.verdict.slice(0, 155),
    ld: [L.orgLd(), bc.ld, faq.ld],
    main
  });
}

function shell(o) {
  return `<!doctype html>
<html lang="en">
${L.head(o)}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">
${o.main}
</main>
${footer()}
${chromeEnd()}`;
}

function compareHub() {
  const bc = L.breadcrumbs([['Home', '/'], ['Compare', '/compare']]);
  const cards = [
    ['go-high-level', 'GoHighLevel', 'DIY platform you operate', 'Strong if you want to build it yourself. Flat tiers + governance if you don\'t.'],
    ['synthflow', 'Synthflow', 'Metered minutes, DIY builder', 'Minute-level control for operators; flat outcomes with receipts for owners.'],
    ['smith-ai', 'Smith.ai', 'Per-call buckets, human option', 'Good humans per call; flat governed AI per outcome.'],
    ['ai-sdr', 'Artisan / 11x', 'Outbound SDR contracts', 'Annual lock-ins for outbound volume vs month-to-month governed teams.'],
    ['human-receptionist', 'Human receptionist', 'Payroll, 40 hrs/week', 'Irreplaceable warmth, limited coverage math.']
  ];
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container" style="max-width:860px">
      ${bc.html}
      <span class="eyebrow eyebrow--rust">The whole market, honestly</span> <span class="pill pill--brass" style="font-size:11px;vertical-align:middle;margin-left:8px">✓ Verified Sept 2026</span>
      <h1 style="font-size:clamp(32px,4vw,52px)">HazirMinds vs everyone</h1>
      <p class="lede" style="margin-top:18px">Every competitor sells a different shape: DIY platforms, metered minutes, per-call buckets, contract SDRs, or payroll. We sell governed outcomes at flat tiers — and we publish the honest trade-offs, including who should <em>not</em> buy us.</p>
    </div>
  </section>
  <section class="section" style="padding-top:28px">
    <div class="container">
      <div class="band-media" data-reveal>
        <img src="/img/cp/cp-desks-1200.webp"
             srcset="/img/cp/cp-desks-800.webp 800w, /img/cp/cp-desks-1200.webp 1200w, /img/cp/cp-desks-1600.webp 1600w, /img/cp/cp-desks-2400.webp 2400w"
             sizes="(max-width: 900px) 100vw, 1200px" width="2400" height="1600"
             loading="lazy" decoding="async"
             alt="Two working positions side by side — the comparison, before any claim is made.">
      </div>
      <p class="stat-note center" style="margin-top:12px">Every comparison below is drawn from published competitor pricing, verified and dated on the page.</p>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container">
      ${tableFor([0, 1, 2, 3, 4, 5])}
      <h2 class="sr-only" style="position:absolute;left:-9999px">Comparison pages</h2>
      <div class="grid grid-3" style="margin-top:52px" data-reveal="children">
        ${cards.map(c => `
        <a class="card card--hover" href="/compare/${c[0]}" data-cta="cmp_${c[0]}" style="text-decoration:none;display:flex;flex-direction:column;gap:8px">
          <span class="num">COMPARISON</span>
          <h3 style="font-size:18px">vs ${c[1]}</h3>
          <span class="muted" style="font-size:13px">${c[2]}</span>
          <span style="font-size:14px;margin-top:4px">${c[3]}</span>
          <span class="link-arrow" style="margin-top:auto">Read the comparison ${I('arrow')}</span>
        </a>`).join('')}
      </div>
    </div>
  </section>`;
  return shell({
    title: 'Compare HazirMinds — vs GoHighLevel, Synthflow, Smith.ai, AI SDRs & Humans',
    path: '/compare',
    desc: 'Verified 2026 comparison tables: HazirMinds vs GoHighLevel, Synthflow, Smith.ai, Artisan/11x and human receptionists — costs, meters, governance, honesty.',
    ld: [L.orgLd(), bc.ld],
    main
  });
}

/* -------- /compare/masjid-platforms — verified masjid market table -------- */
function masjidPlatforms() {
  const M = SJ.masjid;
  const bc = L.breadcrumbs([['Home', '/'], ['Compare', '/compare'], ['Masjid platforms', '']]);
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container" style="max-width:900px">
      ${bc.html}
      <span class="eyebrow eyebrow--rust">Verified 2026 comparison</span> <span class="pill pill--brass" style="font-size:11px;vertical-align:middle;margin-left:8px">✓ Verified Sept 2026</span>
      <h1 style="font-size:clamp(32px,4vw,52px)">HazirMinds Masjid AI OS vs masjid platforms</h1>
      <p class="lede" style="margin-top:18px">The established masjid platforms solve communications, donations and apps. None of them offer governed AI, one-record→many-channels lifecycle with approval gates, audit receipts or isolated multi-masjid tenancy. That is the layer we build. Re-verify any vendor price at publish time — rows marked are directory-sourced.</p>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container">
      <div class="compare-wrap" data-reveal>
        <table class="compare compare-table">
          <thead><tr><th scope="col">Platform</th><th scope="col">Entry price</th><th scope="col">Model</th><th scope="col">Governed AI</th></tr></thead>
          <tbody data-row-reveal>
            ${M.competitors.map(c => `<tr><td><b>${c.name}</b>${c.flag ? ` <span class="stat-note" style="display:inline">(${c.flag})</span>` : ''}</td><td>${c.entry}</td><td>${c.model}</td><td>${c.ai}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="src-note" style="margin-top:10px">Sources: ${[...new Set(M.competitors.map(c => c.source))].join(' · ')}. Verified Sept 2026. Vendor prices change — verify before deciding.</p>

      <div style="margin-top:52px" data-reveal="children">
        <span class="eyebrow">What no reviewed platform offers together</span>
        <h2 style="font-size:clamp(24px,2.6vw,34px);margin-top:8px">The gap list</h2>
        <div class="grid grid-2" style="margin-top:22px">
          ${M.gaps.map(g => `<div class="card"><span class="icon-tile icon-tile--ok">${I('check')}</span><p style="font-size:15px;margin:0">${g}</p></div>`).join('')}
        </div>
      </div>

      <div class="honesty-note" data-reveal style="margin-top:44px">
        <h3>Who should NOT buy HazirMinds</h3>
        <p>If your masjid needs a display-only website and app with prayer times and announcements — and budget is the deciding factor — Masjidal/CMZ-style free or low-cost tiers are honest choices. For campaign crowdfunding reach, LaunchGood does that one job well. If you want to own the code of a custom-branded app outright, a build shop like Buildify is the right lane. HazirMinds is for organizations that want the <em>operating layer</em>: governed AI, one record to every channel, approvals, receipts — priced and acceptance-tested per engagement.</p>
      </div>

      <div style="margin-top:44px" data-reveal="children">
        <span class="eyebrow">Straight answers</span>
        <h3 style="margin:8px 0 0">The product questions live with the product</h3>
        <p class="muted" style="font-size:15px;margin-top:10px;max-width:70ch">Hijri dates, WhatsApp conversation fees, zakat routing, who owns the data, and what multi-masjid isolation means in practice are answered in full on the Masjid AI OS page — this page is only the market comparison.</p>
        <p style="margin-top:16px"><a class="link-arrow" href="/masjids#faq-masjid" data-cta="masjid_faq_link">Read the seven straight answers ${I('arrow')}</a></p>
      </div>

      <div class="final-cta" data-reveal style="margin-top:48px">
        <div class="inner" style="max-width:620px">
          <span class="serif-accent">Always present. Never missed.</span>
          <h2>See the lifecycle live</h2>
          <div class="hero-ctas" style="justify-content:center">${L.btnDemoPlain('Book a Masjid Demo', 'masjid_cmp', 'btn--brass btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>`;
  return shell({
    title: 'Masjid AI OS vs Masjid Platforms (2026) — ConnectMazjid, MOHID, Masjidal & More',
    path: '/compare/masjid-platforms',
    desc: 'Verified Sept 2026 comparison: HazirMinds Masjid AI OS vs ConnectMazjid, MOHID, Masjidal/Athan+, The Masjid App, Ummah, Donorbox and more — vendor-published prices read live, and where a governed agent layer differs from donor AI and advisory chatbots.',
    ld: [L.orgLd(), bc.ld],
    main
  });
}

module.exports = {
  pages: [
    { file: 'compare/index.html', html: compareHub() },
    { file: 'compare/masjid-platforms/index.html', html: masjidPlatforms() },
    ...Object.keys(C.pages).map(slug => ({ file: `compare/${slug}/index.html`, html: comparePage(slug) }))
  ]
};
