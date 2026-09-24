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
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
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
              <h2 >${g.name}</h2>
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



        <section class="section section--paper" id="free-website" style="padding-left:0;padding-right:0">
          <div class="sec-head" data-reveal="children">
            <span class="eyebrow">Included at no cost</span>
            <h2>A free static website — built for you, owned by you</h2>
            <p class="lede" style="max-width:74ch">Every engagement can start with a website, built and handed over at no charge. It is a basic site, and it stays yours.</p>
          </div>
          <div class="grid grid-2" style="align-items:stretch;margin-top:24px" data-reveal="children">
            <div class="card">
              <h3 style="font-size:18px">What we build, free of charge</h3>
              <ul style="display:flex;flex-direction:column;gap:9px;margin:14px 0 0;list-style:none;padding:0">
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>A basic static website, built for you</li>
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>Two rounds of revisions included</li>
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>Ready in 1&ndash;7 days</li>
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>The domain is registered in your business's name</li>
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>Ongoing — this is not a launch-only promotion</li>
              </ul>
            </div>
            <div class="card">
              <h3 style="font-size:18px">What stays in your hands</h3>
              <ul style="display:flex;flex-direction:column;gap:9px;margin:14px 0 0;list-style:none;padding:0">
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>Hosting is yours to arrange, on your own account — we do not hold it for you</li>
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>Your own server environment, including your database, kept private to you</li>
                <li style="display:flex;gap:9px;font-size:14.5px;line-height:1.55;color:var(--muted)"><span style="color:var(--ok);flex:none">${I('check')}</span>The site is handed over to you, with nothing held back</li>
              </ul>
            </div>
          </div>
          <p class="stat-note" style="margin-top:16px">The free part is the build. Everything beyond it — agents, automations, the platform — is a paid service, scoped around your workflow and quoted on the call.</p>
          <div style="margin-top:20px" data-reveal>${L.btnDemo('Start with the free website', 'free_website', 'btn--primary btn--lg', 'services')}</div>
        </section>

        <div id="loop" data-reveal="children">
          <span class="eyebrow">The Hazir Loop</span>
          <h2 >Catch → Train → Launch → Compound</h2>
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
