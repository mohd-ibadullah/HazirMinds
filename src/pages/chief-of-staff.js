// HazirMinds — /chief-of-staff flagship product page
const L = require('../lib');
const { I, nav, footer, chromeEnd, roiBar, site } = L;
const JS = require('../data/site.json');

const specialists = [
  { icon: 'chart', name: 'Practice Operations & CFO', d: 'KPIs, pipelines and the cash view — maintained, source-linked, reported with receipts.' },
  { icon: 'wallet', name: 'Personal Finance & Planning', d: 'Budgets, plans and reminders inside permission scopes you define.' },
  { icon: 'user', name: 'Family & Personal Coordination', d: 'Schedules, logistics and prep — one less mental tab, private by default.' },
  { icon: 'stack', name: 'Research & Knowledge Management', d: 'Your documents indexed and searchable — answers with citations, not guesses.' },
  { icon: 'globe', name: 'Website & Content Operations', d: 'Content calendar and drafts ready; publishing always gated by your approval.' },
  { icon: 'package', name: 'Asset & Vehicle Management', d: 'Maintenance cadences, logs and reminders for the assets that don\'t manage themselves.' },
  { icon: 'workflow', name: 'Personal Technology & Google Workspace', d: 'Workspace administered inside your delegated scope — every external action approved.' }
];

function cosDiagram() {
  const hub = { x: 500, y: 270 };
  const nodes = [
    { x: 500, y: 70, label: 'Voice' },
    { x: 850, y: 170, label: 'Ops & CFO' },
    { x: 850, y: 390, label: 'Research' },
    { x: 500, y: 480, label: 'Content' },
    { x: 150, y: 390, label: 'Finance' },
    { x: 150, y: 170, label: 'Workspace' }
  ];
  const edges = nodes.map(n => {
    const mx = (hub.x + n.x) / 2, my = (hub.y + n.y) / 2;
    return `<path class="edge" d="M ${hub.x} ${hub.y} Q ${mx + (n.x - hub.x) * 0.12} ${my + (n.y - hub.y) * 0.12} ${n.x} ${n.y}"/>`;
  }).join('');
  const spokes = nodes.map(n => `
    <g>
      <rect class="node" x="${n.x - 72}" y="${n.y - 26}" width="144" height="52" rx="14"/>
      <text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-size="15">${n.label}</text>
    </g>`).join('');
  return `
  <svg class="cos-svg cos-diagram-lg" viewBox="0 0 1000 574" role="img" aria-labelledby="cosc-title" style="width:100%;height:auto">
    <title id="cosc-title">Chief-of-Staff orchestration: one central agent coordinating specialist agents</title>
    ${edges}
    <g>
      <rect class="node node-hub" x="${hub.x - 168}" y="${hub.y - 42}" width="336" height="84" rx="20"/>
      <text class="t-hub" x="${hub.x}" y="${hub.y - 2}" text-anchor="middle" font-size="18">Chief-of-Staff</text>
      <text class="t-hub-sub" x="${hub.x}" y="${hub.y + 22}" text-anchor="middle" font-size="12">ONE INTERFACE · HOLD CONTEXT</text>
    </g>
    ${spokes}
    <text class="t-cap" x="500" y="552" text-anchor="middle" font-size="12">ROUTES TASKS · COMBINES RESULTS · MANAGES APPROVALS · DECISION-READY OUTPUTS</text>
  </svg>`;
}

const capabilities = [
  ['workflow', 'Multi-agent orchestration', 'Tasks routed to the right specialist, results combined.'],
  ['book', 'Source-linked knowledge', 'Searchable, cited, always current.'],
  ['calendar', 'Google Workspace integration', 'Mail, calendar, docs — inside delegated scope.'],
  ['package', 'Document & data management', 'Organized, permissioned, audit-trailed.'],
  ['zap', 'Workflow automation', 'Cross-app handoffs without copy-paste.'],
  ['search', 'Research', 'Grounded answers with source receipts.'],
  ['chart', 'Reporting & reminders', 'Decision-ready summaries on your cadence.'],
  ['shield', 'Controlled external actions', 'Nothing leaves the system without your approval.']
];

const bc = L.breadcrumbs([['Home', '/'], ['Chief-of-Staff Platform', '/chief-of-staff']]);

const html = `<!doctype html>
<html lang="en">
${L.head({
  title: 'Personal AI Chief-of-Staff — One Front Door to Your AI Team',
  path: '/chief-of-staff',
  desc: 'A secure, enterprise-grade multi-agent workspace: one Chief-of-Staff agent orchestrating specialists across operations, finance, research, content and technology. One service, one payment. Every consequential action requires your approval.',
  ld: [L.orgLd(), bc.ld, {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'HazirMinds Personal AI Chief-of-Staff Platform',
    serviceType: 'Multi-agent AI workspace with Chief-of-Staff orchestration',
    provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url },
    areaServed: ['US', 'GB', 'CA']
  }]
})}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">

  <section class="section section--dark on-dark" style="padding-top:96px">
    <div class="container">
      <div style="max-width:840px" data-reveal="children">
        <p class="crumbs" style="color:rgba(250,247,242,.55)"><a href="/" style="color:inherit">Home</a> <span>/</span> <span aria-current="page">Chief-of-Staff Platform</span></p>
        <span class="eyebrow">The flagship · scoped per engagement</span>
        <h1 style="font-size:clamp(38px,5vw,64px);color:var(--cream)">One front door to your AI team</h1>
        <p class="lede" style="color:rgba(250,247,242,.72)">A secure, enterprise-grade multi-agent workspace. One central Chief-of-Staff agent coordinates specialized AI agents across operations, finance, planning, research, knowledge, content, technology and your client-specific workflows — behind one simple interface.</p>
        <div class="hero-ctas" style="margin-top:28px">
          ${L.btnDemo('Book a scoped-engagement call', 'cos_hero', 'btn--brass btn--lg')}
          <a class="btn btn--outline-light btn--lg" href="#orchestration" data-cta="cos_arch">See the orchestration</a>
        </div>
        <div class="chip-row" style="margin-top:26px">
          <span class="pill">isolated workspace per client</span>
          <span class="pill">permission scopes</span>
          <span class="pill">audit trails</span>
          <span class="pill">zero-compromise privacy</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--dark on-dark">
    <div class="container">
      <div class="band-media" data-reveal>
        <img src="/img/cos/cos-desk-1600.webp"
             srcset="/img/cos/cos-desk-600.webp 600w, /img/cos/cos-desk-900.webp 900w, /img/cos/cos-desk-1600.webp 1600w, /img/cos/cos-desk-2400.webp 2400w"
             sizes="(max-width: 900px) 100vw, 1200px" width="2400" height="1600"
             loading="lazy" decoding="async"
             alt="A quiet working desk in daylight — where the routing decisions land.">
      </div>
      <p class="stat-note center" style="margin-top:12px">One desk. One queue. Every specialist reads from the same record.</p>
    </div>
  </section>

  <section class="section section--dark on-dark" id="orchestration" style="padding-top:0">
    <div class="container">
      <div class="cos-panel" data-reveal style="background:rgba(250,247,242,.04);border-color:rgba(250,247,242,.12)">
        ${cosDiagram()}
      </div>
      <p class="lede center" style="margin:26px auto 0;max-width:720px;color:rgba(250,247,242,.7)">The Chief-of-Staff maintains context, routes tasks to the correct agent, combines results, manages approvals, and produces concise decision-ready outputs — <span style="color:var(--brass)">without you managing dozens of independent assistants.</span></p>
    </div>
  </section>

  <section class="section" id="specialists">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">The specialists</span>
        <h2>Seven dedicated agents. One orchestrator.</h2>
        <p class="lede center" style="margin-inline:auto">Each specialist is a bounded role with its own permissions and knowledge — coordinated, never autonomous.</p>
      </div>
      <div class="grid grid-3" data-reveal="children">
        ${specialists.map(s => `
        <div class="card card--hover">
          <span class="icon-tile">${I(s.icon)}</span>
          <h3 style="font-size:17.5px;margin-top:12px">${s.name}</h3>
          <p class="muted" style="font-size:14px;margin:8px 0 0">${s.d}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section--paper" id="approval">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">The hard rule</span>
        <h2>Every consequential action requires explicit human approval</h2>
        <p class="lede center" style="margin-inline:auto">Sending messages, publishing content, purchasing, deleting files, moving money, modifying records — the agent proposes; you dispose. Try it:</p>
      </div>
      <div class="approval-demo" style="max-width:720px;margin-inline:auto" data-approval-demo>
        <div class="card card--panel" data-reveal>
          <span class="eyebrow">Approval-gate demo</span>
          <p style="font-size:14.5px;margin-bottom:14px">The agent wants to act. Toggle an action and watch the gate:</p>
          <div class="trade-chips">
            <button class="trade-chip" data-action="publish" aria-pressed="true">Publish blog post</button>
            <button class="trade-chip" data-action="email">Email a client</button>
            <button class="trade-chip" data-action="purchase">Purchase software</button>
            <button class="trade-chip" data-action="summarize">Summarize a document</button>
            <button class="trade-chip" data-action="delete">Delete old files</button>
          </div>
          <div class="ad-state" data-ad-state aria-live="polite"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" data-pin-story="orchestration">
    <div class="container">
      <div class="grid grid-2" style="align-items:stretch">
        <div data-reveal>
          <span class="eyebrow">Core capabilities</span>
          <h2 style="font-size:clamp(24px,2.6vw,34px);margin-bottom:22px">What the platform does</h2>
          <div class="grid grid-2" style="gap:14px">
            ${capabilities.map(c => `
            <div class="card" style="padding:18px">
              <span class="icon-tile" style="width:38px;height:38px;border-radius:11px">${I(c[0])}</span>
              <b style="display:block;font-family:var(--font-display);font-size:14px;margin-top:10px">${c[1]}</b>
              <span class="muted" style="font-size:12.5px">${c[2]}</span>
            </div>`).join('')}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card card--panel" data-reveal>
            <span class="eyebrow">Sample receipt / audit entry</span>
            <div class="receipt" data-receipt>
              <div class="rc-head"><span class="rc-pulse" aria-hidden="true"></span><span>Live receipt</span><span class="rc-time">today · 09:30</span></div>
              <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Sourced</b><span>workspace://finance/q3-planning · doc rev 7</span></div><code>src-ok</code></div>
              <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Decided</b><span>draft budget summary — rule: forward-to-principal only</span></div><code>gate-pass</code></div>
              <div class="rc-row open"><span class="rc-dot wait" aria-hidden="true"></span><div><b>Awaiting approval</b><span>send to accountant (external) — gate: explicit human approval</span></div><code>queued</code></div>
              <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Executed</b><span>calendar hold created · 09:00–09:30</span></div><code>held</code></div>
              <div class="rc-row"><span class="rc-dot ok" aria-hidden="true"></span><div><b>Verified</b><span>figures cross-checked vs source doc — 0 mismatches</span></div><code>0 diff</code></div>
              <div class="rc-row open"><span class="rc-dot wait" aria-hidden="true"></span><div><b>Open</b><span>research thread: vendor comparison — back tomorrow 9 AM</span></div><code>queued</code></div>
            </div>
          </div>
          <div class="hallucination-panel" data-reveal>
            <span class="eyebrow">Reliability stack</span>
            <ul style="margin-top:10px">
              <li>${I('check')}<span style="color:var(--muted)">Cost controls, model routing, caching — predictable spend</span></li>
              <li>${I('check')}<span style="color:var(--muted)">Confidence levels + source requirements on every answer</span></li>
              <li>${I('check')}<span style="color:var(--muted)">Privacy boundaries and full auditability, by construction</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="grid grid-2" style="align-items:center">
        <div data-reveal="children">
          <span class="eyebrow">The commercial shape</span>
          <h2>ONE integrated service. ONE payment.</h2>
          <p class="muted" style="font-size:15.5px">The client never purchases or subscribes to supporting tools or platforms separately — no add-on platforms, no separate tooling bills. One service, one invoice: all required tools, infrastructure, integrations and agent capabilities are included and scoped per engagement. Usage (voice minutes, SMS, AI inference) is metered and published in your rate card before go-live — nothing unpublished.</p>
          <p class="muted" style="font-size:15.5px"><b style="color:var(--brass-text)">Data privacy is a top priority with zero compromise:</b> strict privacy controls, isolated access per client and per project workspace, permission scopes, secure data handling, and governance safeguards keep client information confidential throughout.</p>
        </div>
        <div class="chip-row" data-reveal="children" style="justify-content:flex-end">
          <span class="pill">strict privacy controls</span>
          <span class="pill">isolated access per client</span>
          <span class="pill">per-project workspaces</span>
          <span class="pill">permission scopes</span>
          <span class="pill">secure data handling</span>
          <span class="pill">governance safeguards</span>
          <span class="pill">controlled external actions</span>
          <span class="pill">full auditability</span>
        </div>
      </div>
      <div class="final-cta" data-reveal style="margin-top:56px">
        <div class="inner" style="max-width:660px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>Scope your Chief-of-Staff engagement</h2>
          <p style="color:rgba(250,247,242,.75)">Scoped, priced and acceptance-tested per engagement — we define success criteria in writing before work begins. Chief-of-Staff engagements start at ${JS.addons.find(a => a.id === 'cos').price.replace('from ', '')} setup, then a monthly plan scoped to the deployment.</p>
          <div class="hero-ctas">${L.btnDemoPlain('Book a scoped-engagement call', 'cos_final', 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
${chromeEnd()}`;

module.exports = { html };
