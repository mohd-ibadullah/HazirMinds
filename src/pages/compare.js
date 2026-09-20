// HazirMinds — /compare hub (the individual comparison pages were removed by request)
const L = require('../lib');
const { nav, footer, chromeEnd, roiBar, site } = L;
const C = require('../data/compare');

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
  <p class="src-note" style="margin-top:8px">Sources: vendor public pricing pages and published rate documentation, verified Q3 2026. Vendor prices change — verify before deciding.</p>`;
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
  const main = `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container" style="max-width:860px">
      ${bc.html}
      <span class="eyebrow eyebrow--rust">The whole market, honestly</span> <span class="pill pill--brass" style="font-size:11px;vertical-align:middle;margin-left:8px">✓ Source-checked Sept 2026</span>
      <h1 style="font-size:clamp(32px,4vw,52px)">HazirMinds vs everyone</h1>
      <p class="lede" style="margin-top:16px">Every competitor sells a different shape: DIY platforms, metered minutes, per-call buckets, contract SDRs, or payroll. We sell governed outcomes at flat tiers — and we publish the honest trade-offs, including who should <em>not</em> buy us.</p>
    </div>
  </section>
  <section class="section" style="padding-top:44px">
    <div class="container">
      ${tableFor([0, 1, 2, 3, 4, 5])}
  <section class="section section--paper" id="measurement">
    <div class="container">
      <div class="card card--panel card--hairline-top center" data-reveal style="max-width:820px;margin-inline:auto">
        <div class="seal" style="margin-inline:auto">PROOF</div>
        <span class="eyebrow" style="justify-content:center">How we measure it</span>
        <h2 >We prove outcomes against acceptance criteria you sign.</h2>
        <p class="lede" style="margin:16px auto 0">Before we go live, we agree — in writing — the criteria that define success for your business. Every deployment is then measured against them and reported to you, built from real transcripts. If the measured outcomes aren't there, you can say so and leave — the exit terms live in the agreement you sign, not in a retention clause.</p>
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          ${L.btnDemo('See what we measure', 'measurement_compare', 'btn--primary btn--lg', 'compare')}
        </div>
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

module.exports = {
  /* The five individual comparison pages and /compare/masjid-platforms were removed by request;
     the hub keeps the one table across every alternative. Masjid comparison content now renders
     at the end of /masjids. */
  pages: [
    { file: 'compare/index.html', html: compareHub() }
  ]
};
