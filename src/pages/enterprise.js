// HazirMinds — /enterprise page
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site } = L;
const JS = require('../data/site.json');
const C = require('../data/compare');

function cosDiagram() {
  const hub = { x: 500, y: 260 };
  const nodes = [
    { x: 500, y: 60, label: 'Voice' },
    { x: 850, y: 160, label: 'Ops' },
    { x: 850, y: 380, label: 'Research' },
    { x: 500, y: 470, label: 'Comms' },
    { x: 150, y: 380, label: 'Analytics' },
    { x: 150, y: 160, label: 'Sales' }
  ];
  const edges = nodes.map(n => {
    const mx = (hub.x + n.x) / 2, my = (hub.y + n.y) / 2;
    return `<path class="edge" d="M ${hub.x} ${hub.y} Q ${mx + (n.x - hub.x) * 0.12} ${my + (n.y - hub.y) * 0.12} ${n.x} ${n.y}"/>`;
  }).join('');
  const spokes = nodes.map(n => `
    <g>
      <rect class="node" x="${n.x - 62}" y="${n.y - 26}" width="124" height="52" rx="14"/>
      <text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-size="15">${n.label}</text>
    </g>`).join('');
  return `
  <svg class="cos-svg" viewBox="0 0 1000 540" role="img" aria-labelledby="cos-title" style="width:100%;height:auto">
    <title id="cos-title">Chief-of-Staff architecture: a router agent delegating to specialist agents</title>
    ${edges}
    <g>
      <rect class="node node-hub" x="${hub.x - 110}" y="${hub.y - 40}" width="220" height="80" rx="20"/>
      <text class="t-hub" x="${hub.x}" y="${hub.y - 4}" text-anchor="middle" font-size="18">Chief-of-Staff</text>
      <text class="t-hub-sub" x="${hub.x}" y="${hub.y + 20}" text-anchor="middle" font-size="12">ROUTER AGENT</text>
    </g>
    ${spokes}
    <text class="t-cap" x="500" y="520" text-anchor="middle" font-size="12">ONE INTENT IN · SIX SPECIALISTS ORCHESTRATED · HUMAN APPROVAL GATES ON SENSITIVE ACTIONS</text>
  </svg>`;
}

const gov = [
  ['Permission scopes', 'Every agent operates inside least-privilege scopes you define — by role, system and data class.'],
  ['Approval gates', 'Sensitive actions — refunds, contracts, data deletion — pause for human sign-off, by policy.'],
  ['Audit trail', 'Every action, decision and handoff is logged immutably and exportable to your SIEM.'],
  ['Cost governance', 'Per-agent budgets, hard ceilings and alerts keep spend predictable at any scale.']
];

const bc = L.breadcrumbs([['Home', '/'], ['Enterprise', '/enterprise']]);

const html = `<!doctype html>
<html lang="en">
${L.head({
  title: 'Enterprise AI — Chief-of-Staff Agent Teams & Governance',
  path: '/enterprise',
  desc: 'HazirMinds Enterprise: a Chief-of-Staff router agent orchestrating specialist agents across your organisation — with permission scopes, approval gates, audit trails and cost governance.',
  ld: [L.orgLd(), bc.ld]
})}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">

  <section class="section section--dark on-dark" style="padding-top:96px">
    <div class="container">
      <div style="max-width:820px" data-reveal="children">
        <p class="crumbs" style="color:rgba(250,247,242,.55)"><a href="/" style="color:inherit">Home</a> <span>/</span> <span aria-current="page">Enterprise</span></p>
        <span class="eyebrow">HazirMinds Enterprise</span>
        <h1 style="font-size:clamp(38px,5vw,64px);color:var(--cream)">One intent in. A whole team of specialists on it.</h1>
        <p class="lede" style="color:rgba(250,247,242,.72)">The Chief-of-Staff model: a router agent that understands the ask, delegates to the right specialist agents, enforces your policies, and reports back — like a digital chief of staff with an unlimited bench.</p>
        <div class="hero-ctas" style="margin-top:28px">
          ${L.btnDemo('Book an enterprise demo', 'ent_hero', 'btn--brass btn--lg')}
          <a class="btn btn--outline-light btn--lg" href="#architecture" data-cta="ent_arch">See the architecture</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--dark on-dark">
    <div class="container">
      <div class="band-media" data-reveal>
        <img src="/img/gv/gv-ops-1600.webp"
             srcset="/img/gv/gv-ops-800.webp 800w, /img/gv/gv-ops-1200.webp 1200w, /img/gv/gv-ops-1600.webp 1600w, /img/gv/gv-ops-2400.webp 2400w"
             sizes="(max-width: 900px) 100vw, 1200px" width="2400" height="1600"
             loading="lazy" decoding="async"
             alt="An operations floor in daylight — the environment governance is applied to.">
      </div>
      <p class="stat-note center" style="margin-top:12px">Governance is not a policy document. It is the environment the work happens in.</p>
    </div>
  </section>

  <section class="section section--dark on-dark" id="architecture" style="padding-top:0">
    <div class="container" id="governance">
      <div class="cos-panel" data-reveal style="background:rgba(250,247,242,.04);border-color:rgba(250,247,242,.12)">
        ${cosDiagram()}
      </div>
      <div class="grid grid-2" style="margin-top:26px;align-items:stretch">
        <div class="card on-dark" data-reveal>
          <span class="eyebrow">Governance, built in</span>
          <h2 style="color:var(--cream);font-size:22px;margin-bottom:6px">Enterprise controls on every workflow</h2>
          <ul class="gov-chips">
            ${gov.map(g => `<li>${I('shield')}<span><b>${g[0]}.</b> <span style="color:rgba(250,247,242,.65)">${g[1]}</span></span></li>`).join('')}
          </ul>
        </div>
        <div data-reveal>
          <figure class="media-panel" style="border-radius:var(--r-panel);overflow:hidden;border:1px solid rgba(250,247,242,.12);background:rgba(250,247,242,.04)">
            <div class="flow-figure flow-figure--dark">
              <div class="flow-step"><span class="num">PHASE 1</span><b>Readiness audit</b><span>What you have, what is missing, and what each gap costs you.</span></div>
              <div class="flow-step"><span class="num">PHASE 2</span><b>Architecture</b><span>Permission scopes, approval gates and data boundaries — in writing.</span></div>
              <div class="flow-step"><span class="num">PHASE 3</span><b>Pilot</b><span>One team, one workflow, measured against acceptance criteria you sign.</span></div>
              <div class="flow-step"><span class="num">PHASE 4</span><b>Scale</b><span>Widen scope only after the pilot's criteria are met and signed off.</span></div>
            </div>
          </figure>
          <figcaption class="stat-note" style="margin-top:10px;color:rgba(250,247,242,.72)">From readiness audit to scaled rollout in four phases — drawn in markup, not a picture</figcaption>
        </div>
      </div>
      <div style="margin-top:72px">
        <div class="sec-head" data-reveal="children" style="margin-bottom:36px">
          <span class="eyebrow">The Governance Layer — our doctrine</span>
          <h2 style="color:var(--cream);font-size:clamp(26px,3vw,40px)">Four invariants. One honesty standard.</h2>
        </div>
        ${L.governanceBand()}
        <div class="grid grid-3" style="margin-top:44px" data-reveal="children">
          ${C.doctrine.map(d => `<div class="invariant"><span class="inv-n">DOCTRINE</span><h3>${d.t}</h3><p>${d.d}</p></div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Who this is for</span>
        <h2>Built for complexity, priced for outcomes</h2>
      </div>
      <div class="grid grid-3" data-reveal="children">
        <div class="card card--hover">
          <span class="icon-tile">${I('building')}</span>
          <h3>Multi-location operators</h3>
          <p class="muted" style="font-size:14.5px">One AI team per location or one shared brain with local rules — your choice, centrally governed.</p>
        </div>
        <div class="card card--hover">
          <span class="icon-tile icon-tile--brass">${I('headset')}</span>
          <h3>High-volume contact operations</h3>
          <p class="muted" style="font-size:14.5px">Thousands of daily conversations across voice and text, with SLAs, overflow logic and full observability.</p>
        </div>
        <div class="card card--hover">
          <span class="icon-tile icon-tile--ok">${I('shield')}</span>
          <h3>Regulated teams</h3>
          <p class="muted" style="font-size:14.5px">Isolated per-client environments, consent capture on every interaction, and audit trails you can export.</p>
        </div>
      </div>
      <div class="final-cta" data-reveal style="margin-top:64px">
        <div class="inner" style="max-width:660px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>Put a chief of staff on every workflow</h2>
          <p style="color:rgba(250,247,242,.75)">We'll map your highest-leverage workflows and price the rollout — Enterprise Agent Teams start at ${JS.addons.find(a => a.id === 'cos').price.replace('from ', '')}.</p>
          <div class="hero-ctas">${L.btnDemoPlain('Book an enterprise demo', 'ent_final', 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
${chromeEnd()}`;

module.exports = { html };
