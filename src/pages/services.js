// HazirMinds — /services page
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site } = L;
const groups = require('../data/services');

// F2/F7: capability chip per group (contract alignment)
const GROUP_CHIP = {
  'live-today': { chip: 'AVAILABLE', cls: 'pill--ok' },
  'onboarding': { chip: 'CONFIGURED AT ONBOARDING', cls: 'pill--brass' },
  'chief-of-staff-platform': { chip: 'SCOPED PER ENGAGEMENT', cls: 'pill--rust' },
  'client-builds': { chip: 'SCOPED PER ENGAGEMENT', cls: 'pill--rust' },
  'growth-addons': { chip: 'ADD-ON', cls: '' }
};

const svcLd = {
  '@context': 'https://schema.org', '@type': 'ItemList',
  name: 'HazirMinds Services',
  itemListElement: groups.flatMap(g => g.services.map(s => ({
    '@type': 'ListItem', position: parseInt(s.n, 10),
    item: { '@type': 'Service', name: s.name, description: s.outcome + ' ' + (s.gov || ''), provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url }, url: site.url + '/services#' + s.slug, areaServed: ['US', 'GB', 'CA'] }
  })))
};

const loop = require('../data/loop');

const html = `<!doctype html>
<html lang="en">
${L.head({
  title: 'All Services A–E — Governed AI Receptionists, Agents & Automations',
  path: '/services',
  desc: 'The contract-aligned HazirMinds catalog: groups A–E, from AI reception and speed-to-lead to the Chief-of-Staff Platform — every service on the governed substrate.',
  ld: [L.orgLd(), svcLd]
})}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">
  <section class="hero-sub-plain" style="padding-bottom:0">
    <div class="container">
      <p class="crumbs"><a href="/">Home</a> <span>/</span> <span aria-current="page">Services</span></p>
      <h1 style="max-width:16ch">Every service. One governed team that runs it for you.</h1>
    </div>
  </section>

  <section class="section" style="padding-top:44px">
    <div class="container svc-layout">
      <aside class="svc-rail" aria-label="Service groups">
        ${groups.map(g => `<a href="#${g.id}">${g.num} · ${g.name}</a>`).join('')}
      </aside>
      <div>
        ${groups.map(g => `
        <details class="svc-group" id="${g.id}" open>
          <summary class="svc-group-head">
            <span class="gn">${g.num}</span>
            <div>
              <h2 style="font-size:clamp(24px,2.6vw,34px)">${g.name}</h2>
              <p class="muted" style="max-width:62ch;margin-top:8px">${g.promise}</p>
            </div>
          </summary>
          <div class="svc-cards" data-reveal="children">
            ${g.services.map(s => `
            <article class="svc-card" id="${s.slug}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
                <span class="sn">${s.n ? 'SERVICE ' + s.n : 'YOUR REQUIREMENT'}</span>
                <span class="pill ${GROUP_CHIP[g.id].cls}" style="font-size:10.5px;padding:4px 10px;white-space:normal">${GROUP_CHIP[g.id].chip}</span>
              </div>
              <h3>${s.name}</h3>
              <p><b style="color:var(--ink)">${s.outcome}</b></p>
              <ul style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px">
                ${s.points.map(p => `<li style="display:flex;gap:9px;font-size:14px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none;margin-top:0px">${I('check')}</span>${p}</li>`).join('')}
              </ul>
              ${s.gov ? `<p style="font-size:13px;line-height:1.6;color:var(--brass-text);border-top:1px solid var(--hairline);padding-top:12px;margin:0 0 13px"><b>GOVERNANCE:</b> ${s.gov}</p>` : ''}

              <a class="link-arrow" href="/demo?for=service-${s.slug}" data-cta="svc_${s.n}">Get this running ${I('arrow')}</a>
            </article>`).join('')}
          </div>
        </details>`).join('')}



        <div id="loop" data-reveal="children">
          <span class="eyebrow">The Hazir Loop</span>
          <h2 style="font-size:clamp(26px,3vw,40px)">Catch → Train → Launch → Compound</h2>
          <div data-tabs>
            <div class="loop-tabs" role="tablist" aria-label="The Hazir Loop">
              ${loop.map((s, i) => `<button class="loop-tab" role="tab" aria-selected="${i === 0}" aria-controls="loop-p${i}" id="loop-t${i}">${s.n}. ${s.name}</button>`).join('')}
            </div>
            ${loop.map((s, i) => `
            <div class="loop-panel${i === 0 ? ' active' : ''}" role="tabpanel" id="loop-p${i}" aria-labelledby="loop-t${i}" ${i === 0 ? '' : 'hidden'}>
              <span class="step-n">${s.n}</span>
              <p>${s.text}</p>
            </div>`).join('')}
          </div>
          <p class="serif-accent" style="margin-top:24px">“Hazir” — present, ready, attentive. It's what your AI team always is. It's also the name of our flagship plan.</p>
          <div style="margin-top:20px">${L.btnDemo('Deploy your first service', 'services_final', 'btn--primary btn--lg', 'services')}</div>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
${chromeEnd()}`;

module.exports = { html };
