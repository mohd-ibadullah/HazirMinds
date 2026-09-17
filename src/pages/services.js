// HazirMinds — /services page
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site } = L;
const groups = require('../data/services');

// F2/F7: capability chip per group (contract alignment)
const GROUP_CHIP = {
  'live-today': { chip: 'AVAILABLE', cls: 'pill--ok' },
  'onboarding': { chip: 'CONFIGURED AT ONBOARDING', cls: 'pill--brass' },
  'enterprise-suite': { chip: 'SCOPED PER ENGAGEMENT', cls: 'pill--rust' },
  'chief-of-staff-suite': { chip: 'SCOPED PER ENGAGEMENT', cls: 'pill--rust' },
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
  title: 'All Services A–F — Governed AI Receptionists, Agents & Automations',
  path: '/services',
  desc: 'The contract-aligned HazirMinds catalog: groups A–F, from AI reception and speed-to-lead to the Personal AI Chief-of-Staff platform — every service on the governed substrate.',
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
      <p class="lede" style="margin-top:18px;max-width:60ch">Nineteen out-of-box (9 live today + 10 configured at onboarding), everything else scoped per engagement — every card labeled. Plus two flagship platforms: the Personal AI Chief-of-Staff and the Masjid AI OS. All of it runs on the HazirMinds Operating Substrate.</p>
      <div class="chips" style="margin:22px 0 34px">
        <span class="pill pill--ok">19 out-of-box</span>
        <span class="pill pill--rust">everything else scoped — every card labeled</span>
        <span class="pill">Live in 7–14 days (groups A–B)</span>
        <span class="pill">Acceptance criteria you sign</span>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:44px">
    <div class="container svc-layout">
      <aside class="svc-rail" aria-label="Service groups">
        ${groups.map(g => `<a href="#${g.id}">${g.num} · ${g.name}</a>`).join('')}
      </aside>
      <div>
        ${groups.map(g => `
        <div class="svc-group" id="${g.id}">
          <div class="svc-group-head" data-reveal="children">
            <span class="gn">${g.num}</span>
            <div>
              <h2 style="font-size:clamp(24px,2.6vw,34px)">${g.name}</h2>
              <p class="muted" style="max-width:62ch;margin-top:8px">${g.promise}</p>
            </div>
          </div>
          <div class="svc-cards" data-reveal="children">
            ${g.services.map(s => `
            <article class="svc-card" id="${s.slug}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
                <span class="sn">${s.n ? 'SERVICE ' + s.n : 'YOUR REQUIREMENT'}</span>
                <span class="pill ${GROUP_CHIP[g.id].cls}" style="font-size:10.5px;padding:4px 10px;white-space:normal">${GROUP_CHIP[g.id].chip}</span>
              </div>
              <h3>${s.name}</h3>
              <p><b style="color:var(--ink)">${s.outcome}</b></p>
              <ul style="display:flex;flex-direction:column;gap:7px;margin-bottom:13px">
                ${s.points.map(p => `<li style="display:flex;gap:9px;font-size:14px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none;margin-top:1px">${I('check')}</span>${p}</li>`).join('')}
              </ul>
              ${s.gov ? `<p style="font-size:13px;line-height:1.6;color:var(--brass-text);border-top:1px solid var(--hairline);padding-top:11px;margin:0 0 13px"><b>GOVERNANCE:</b> ${s.gov}</p>` : ''}

              <a class="link-arrow" href="/demo" data-cta="svc_${s.n}">Get this running ${I('arrow')}</a>
            </article>`).join('')}
          </div>
        </div>`).join('')}

        <div class="svc-media">
          <figure class="media-panel media-panel--paper" data-reveal>
            <div class="flow-figure">
              ${loop.map((s, i) => `
              <div class="flow-step">
                <span class="num">STEP ${s.n}</span>
                <b>${s.name}</b>
                <span>${['Every call, chat, text and form — captured in under a second.', 'Your services, pricing, tone and boundaries, approved by you before go-live.', 'Live on your number, supervised, with weekly tuning from real transcripts.', 'Monthly reviews add capability — the team improves every month it runs.'][i]}</span>
              </div>`).join('')}
              <span class="flow-loop">↻ the loop repeats — this is the Hazir Loop</span>
            </div>
            <figcaption>How a deployment works, end to end — drawn in markup, not a picture, so it stays sharp and screen-readable at any size</figcaption>
          </figure>
        </div>

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
          <p class="serif-accent" style="margin-top:26px">“Hazir” — present, ready, attentive. It's what your AI team always is. It's also the name of our flagship plan.</p>
          <div style="margin-top:22px">${L.btnDemo('Deploy your first service', 'services_final', 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
${chromeEnd()}`;

module.exports = { html };
