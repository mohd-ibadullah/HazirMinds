// HazirMinds — umbrella industry page template.
// No images by design: the page is built from typography, a services table, workflow markup,
// sub-sector cards and a sourced statistic (or none at all).
const L = require('../../lib');
const { I, site } = L;
const CTX = require('../../data/context');

function industryPage(d, all) {
  const ctx = CTX[d.key] || CTX.fallback;
  const bc = L.breadcrumbs([['Home', '/'], ['Industries', '/industries'], [d.name, '']]);
    const ld = [{
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'HazirMinds for ' + d.name,
    serviceType: 'AI receptionist, sales and workflow automation for ' + d.name,
    provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url },
    areaServed: 'US',
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: d.name + ' sub-sectors',
      itemListElement: d.subsectors.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s[0], description: s[1] } }))
    }
  }, bc.ld];

  const others = all.filter(x => x.key !== d.key);

  const main = `
  <section class="hero-sub-plain section--paper">
    <div class="container" style="max-width:900px">
      <div data-reveal="children">
        ${bc.html}
        <span class="eyebrow eyebrow--rust">Industry ${d.n} of 11</span>
        <h1 style="font-size:clamp(34px,4.6vw,58px)">${d.name}</h1>
        <p class="lede" style="margin-top:16px">${d.serves}</p>
        <div class="hero-ctas" style="margin-top:24px">
          ${L.btnDemo(ctx.label, 'ind_' + d.key, 'btn--primary btn--lg', d.key)}
          <a class="btn btn--ghost btn--lg" href="#services">See the services</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="subsectors">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Who this serves</span>
        <h2>The sub-sectors inside ${d.name.toLowerCase()}</h2>
        <p class="lede" style="max-width:74ch">Each of these is here because the same thing is true of it: calls and messages decide revenue, and somebody is busy doing the work when they arrive.</p>
      </div>
      <div class="grid grid-3" data-reveal="children">
        ${d.subsectors.map(s => `
        <div class="card">
          <h3 style="font-size:17px;margin:0">${s[0]}</h3>
          <p class="muted" style="font-size:13.5px;margin:8px 0 0">${s[1]}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container" style="max-width:820px">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">What goes wrong today</span>
        <h2>Why this costs money</h2>
      </div>
      <div class="card card--panel card--hairline-top" data-reveal>
        <p style="margin:0;font-size:16.5px;line-height:1.65">${d.failure}</p>
      </div>
      ${d.statObj ? `
      <div class="card card--panel" data-reveal style="margin-top:20px;display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:space-between">
        <div>
          <span class="num">SOURCED FIGURE</span>
          <div style="font-family:var(--font-display);font-weight:800;font-size:clamp(30px,3.6vw,46px);color:var(--rust-text);letter-spacing:-.02em;line-height:1.1;margin:8px 0 4px">${d.statObj.value}</div>
          <span class="stat-note">${d.statObj.label}</span>
          <p class="src-note" style="margin-top:8px">Source: ${d.statObj.source}</p>
        </div>
      </div>` : `
      <p class="stat-note center" style="margin-top:20px">No usable figure is published for this sector specifically, so we state the problem in words rather than borrow a number that does not apply.</p>`}
    </div>
  </section>

  <section class="section" id="services">
    <div class="container" style="max-width:980px">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Relevant services</span>
        <h2>What we deploy here</h2>
        <p class="lede" style="max-width:74ch">A subset of the catalogue — the services that actually apply to this sector.</p>
      </div>
      <div class="compare-wrap" data-reveal>
        <table class="compare compare-table">
          <thead><tr><th scope="col">Service</th><th scope="col">What it does here</th></tr></thead>
          <tbody>
            ${d.services.map(s => `<tr><td><b>${s[0]}</b></td><td>${s[1]}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="src-note" style="margin-top:8px">The full catalogue, including what each service is scoped at, is on the <a href="/services">services page</a>.</p>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Practical workflows</span>
        <h2>How it actually runs</h2>
      </div>
      ${d.workflows.map(w => `
      <div style="margin-top:32px" data-reveal="children">
        <h3 style="font-size:19px;margin-bottom:12px">${w.t}</h3>
        <div class="flow-figure">
          ${w.steps.map(s => `<div class="flow-step"><span class="num">${s[0]}</span><b>${s[1]}</b><span>${s[2]}</span></div>`).join('')}
        </div>
      </div>`).join('')}
      <p class="stat-note center" style="margin-top:20px">Drawn in markup, not a picture — it stays sharp and readable at any size.</p>
    </div>
  </section>
  ${d.governance ? `
  <section class="section section--paper">
    <div class="container" style="max-width:860px">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Governance</span>
        <h2>What applies in this sector</h2>
      </div>
      <ul class="gov-chips" style="list-style:none;padding:0;margin:0" data-reveal>
        ${d.governance.map(g => `<li>${I('shield')}<span>${g}</span></li>`).join('')}
      </ul>
    </div>
  </section>` : ''}
  <section class="section section--paper">
    <div class="container">
      <div class="grid grid-2" style="align-items:start;gap:40px">
        <div data-reveal="children">
          <span class="eyebrow">Other industries</span>
          <h2 style="margin-top:8px">Not your sector?</h2>
          <p class="muted" style="font-size:15px;max-width:52ch">Eleven umbrellas cover the US market we actually serve. Anything outside them is a sector we do not claim.</p>
          <p style="margin-top:12px"><a class="link-arrow" href="/industries">See all industries ${I('arrow')}</a></p>
        </div>
        <div class="int-line" data-reveal>${others.map(o => `<a class="pill" href="${o.href}" style="text-decoration:none">${o.name}</a>`).join('')}</div>
      </div>
      <div class="final-cta" data-reveal style="margin-top:52px">
        <div class="inner" style="max-width:660px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>See it running on your phones</h2>
          <p style="color:rgba(250,247,242,.75)">Scoped, priced and acceptance-tested per engagement — we agree the success criteria in writing before work begins.</p>
          <div class="hero-ctas">${L.btnDemoPlain(ctx.label, 'ind_final_' + d.key, 'btn--primary btn--lg', d.key)}</div>
        </div>
      </div>
    </div>
  </section>`;

  return {
    title: 'AI for ' + d.name + ' — HazirMinds',
    path: '/industries/' + d.key,
    desc: d.serves,
    ld: [L.orgLd(), ...ld],
    main
  };
}

module.exports = { industryPage };
