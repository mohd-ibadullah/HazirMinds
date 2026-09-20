// HazirMinds — /industries hub. States the taxonomy, the test behind it, and what we do NOT claim.
const L = require('../../lib');
const { I, site } = L;
const CTX = require('../../data/context');

function industriesHub(data) {
  const { items, exclusions, STAT } = data;
  const bc = L.breadcrumbs([['Home', '/'], ['Industries', '']]);
  const ld = [{
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Industries HazirMinds serves',
    description: 'Eleven umbrella industries, the sub-sectors inside each, and the sectors we do not claim.',
    provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url }
  }, bc.ld];

  const main = `
  <section class="hero-sub-plain section--paper">
    <div class="container" style="max-width:900px">
      <div data-reveal="children">
        ${bc.html}
        <span class="eyebrow eyebrow--rust">Eleven umbrellas, not a list of every trade</span>
        <h1 style="font-size:clamp(34px,4.6vw,58px)">Industries we actually serve</h1>
        <p class="lede" style="margin-top:16px">A business qualifies for this list only if calls and messages genuinely decide its revenue, and somebody is genuinely busy doing the work when they arrive. Eleven umbrellas cover that market. We have also written down the sectors that do not qualify, and why.</p>
      </div>
    </div>
  </section>

  <section class="section" id="umbrellas">
    <div class="container">
      <div class="grid grid-3" data-reveal="children">
        ${items.map(d => `
        <a class="card card--hover" href="${d.href}" style="text-decoration:none;display:flex;flex-direction:column;gap:8px">
          <span class="num">INDUSTRY ${d.n}</span>
          ${/* h2, not h3: each umbrella is a major section directly under the h1, and an h1→h3 jump is a
                 heading-order violation. The inline size keeps the card looking exactly as it did. */ ''}
            <h2 class="ind-card-name" style="margin:0">${d.name}</h2>
          <span class="muted" style="font-size:13.5px">${d.subsectors.length} sub-sectors — ${d.subsectors.slice(0, 3).map(s => s[0]).join(' · ')}${d.subsectors.length > 3 ? ' …' : ''}</span>
          <span class="link-arrow" style="margin-top:auto">See this industry ${I('arrow')}</span>
        </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container" style="max-width:860px">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">How the list was built</span>
        <h2>The test a sector has to pass</h2>
      </div>
      <div class="grid grid-2" data-reveal="children">
        <div class="card">
          <span class="num">IN</span>
          <h3 style="font-size:18px">A sector is included when it has</h3>
          <ul style="margin:12px 0 0;padding-left:18px;font-size:14.5px;line-height:1.7" class="muted">
            <li>High inbound call or message volume</li>
            <li>Appointment- or booking-driven work</li>
            <li>After-hours or emergency demand</li>
            <li>A front-desk bottleneck when the work is happening</li>
            <li>High value attached to a single captured lead</li>
            <li>Optionally: regulated handling, or several locations</li>
          </ul>
        </div>
        <div class="card">
          <span class="num">OUT</span>
          <h3 style="font-size:18px">A sector is excluded when</h3>
          <ul style="margin:12px 0 0;padding-left:18px;font-size:14.5px;line-height:1.7" class="muted">
            <li>Buying is enterprise and B2B procurement</li>
            <li>There is no competitive call to capture</li>
            <li>Demand is seasonal or commodity-driven</li>
            <li>There is no front desk to relieve</li>
            <li>Only a thin slice would fit, and a page would overstate it</li>
          </ul>
        </div>
      </div>
      <p class="src-note" style="margin-top:16px">Sub-sectors were checked against the industry navigation of Smith.ai (9 verticals), Ruby (6), AnswerConnect (48) and Dialzara (82), and against US Census NAICS sector structure. A sub-sector appears here only if it is in at least one of those or in the federal sector data.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">The market case</span>
        <h2>Four figures, all sourced</h2>
        <p class="lede center" style="margin-inline:auto;max-width:74ch">These are the only performance numbers this site publishes, and each one carries its source. Nothing on an industry page is a number invented for that page.</p>
      </div>
      <div class="grid grid-2" data-reveal="children">
        ${[STAT.unanswered, STAT.response].map(s => `
        <div class="card card--panel">
          <div style="font-family:var(--font-display);font-weight:800;font-size:clamp(26px,3vw,38px);color:var(--rust-text);letter-spacing:-.02em;line-height:1.1">${s.value}</div>
          <p style="margin:8px 0 0;font-size:14.5px">${s.label}</p>
          <p class="src-note" style="margin-top:8px">Source: ${s.source}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section--paper" id="not-claimed">
    <div class="container" style="max-width:980px">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">What we do not claim</span>
        <h2>Sectors we are not selling to</h2>
        <p class="lede" style="max-width:74ch">These are real, large parts of the US economy. They are not on our list because our services do not fit them — and saying so is more useful than a page that pretends otherwise.</p>
      </div>
      <div class="compare-wrap" data-reveal>
        <table class="compare compare-table">
          <thead><tr><th scope="col">Sector</th><th scope="col">US small businesses</th><th scope="col">Why it is not on the list</th></tr></thead>
          <tbody>
            ${exclusions.map(e => `<tr><td><b>${e.name}</b></td><td class="muted">${e.count}</td><td>${e.why}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="src-note" style="margin-top:8px">Counts: small businesses per sector, SBA Office of Advocacy, "United States 2026".</p>
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width:860px">
      <div class="card card--panel card--hairline-top center" data-reveal>
        <span class="eyebrow" style="justify-content:center">Not on the list?</span>
        <h2 >If your sector is not here, tell us why it should be</h2>
        <p class="lede" style="margin:16px auto 0;max-width:64ch">The taxonomy is built to take new sectors without rework. If we have missed a fit, the reason will be the same one that qualifies every page here — calls decide revenue, and nobody is free to answer them.</p>
        <div class="hero-ctas" style="justify-content:center;margin-top:24px">${L.btnDemo(CTX.industries.label, 'ind_hub_cta', 'btn--primary btn--lg', 'industries')}</div>
      </div>
    </div>
  </section>`;

  return {
    title: 'Industries — 11 Sectors HazirMinds Serves',
    path: '/industries',
    desc: 'Eleven umbrella industries with the sub-sectors inside each, the test a sector has to pass, and the US sectors we do not claim — with sourced figures.',
    ld: [L.orgLd(), ...ld],
    main
  };
}

module.exports = { industriesHub };
