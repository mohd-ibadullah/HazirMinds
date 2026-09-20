// HazirMinds — home page (13 sections)
const L = require('../lib');
const { esc, jsonAttr, I, head, roiBar, nav, footer, chromeEnd, site, TEL, CALL_LABEL, CALL_TEXT, CALL_ICON } = L;
const pricing = require('../data/pricing');
const C = require('../data/compare');
const JS = require('../data/site.json');
const loop = require('../data/loop');

const IND = require('../data/industries').items;
/* The picker is built from the taxonomy, so it cannot list an industry the rest of the site does not
   have. No image: the industry pages carry none, and the preview reads as text instead. */
const tradeData = IND.map(d => ({
  key: d.key,
  name: d.name,
  line: `<h3>${esc(d.name)}</h3><p class="lede">${esc(d.serves)}</p><p class="stat-note">${d.subsectors.length} sub-sectors — ${esc(d.subsectors.slice(0, 4).map(x => x[0]).join(' · '))}${d.subsectors.length > 4 ? ' …' : ''}</p>`,
  href: d.href
}));

/* The homepage FAQ section is gone — those five answers now live in the assistant knowledge base
   (src/lib.js). Google requires FAQPage markup to match visible content on the same URL, so the
   JSON-LD goes with the section. */
const svcLd = pricing.tiers.map(t => ({
  '@context': 'https://schema.org', '@type': 'Service',
  name: 'HazirMinds ' + t.name, serviceType: 'AI automation platform',
  provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url },
  areaServed: ['US', 'GB', 'CA'],
  /* No offers block: the pricing page was removed by request, and structured data must describe
     what the page actually shows. Advertising a tier price Google can read but a visitor cannot see
     is the same defect as FAQPage markup for a FAQ that is no longer on the page. */
}));

const html = `${head({ rawTitle: 'HazirMinds — Governed AI Receptionists & Sales Agents | Always Present. Never Missed.', path: '/', desc: site.desc, ld: [L.orgLd(), L.websiteLd(), svcLd[0], svcLd[1], svcLd[2], svcLd[3]] })}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}

<main id="main">

<!-- S2 · HERO -->
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="hero-kicker"><span class="dot"></span>ALWAYS PRESENT. NEVER MISSED.</span>
      <h1>
        <span class="line"><span>Answer every call.</span></span>
        <span class="line"><span>Book the job.</span></span>
        <span class="line"><span class="accent">Never miss the moment.</span></span>
      </h1>
      <p class="hero-sub">${esc(site.desc)}</p>
      <div class="hero-chips" style="margin-top:0">
        <span class="pill">24/7</span><span class="pill">&lt;1s pickup</span><span class="pill">isolated per client</span><span class="pill">audit trail</span>
      </div>
    </div>
    <div class="demo-shell" id="demo">
      <div class="demo-window" data-transcript='${jsonAttr(site.transcript)}'>
        <div class="demo-titlebar">
          <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <b style="font-size:13.5px">Live call — HazirMinds AI receptionist</b>
          <span class="live"><i></i>LIVE</span>
        </div>
        <div class="demo-tabs" role="tablist" aria-label="Choose an industry">
          ${site.transcript.map((s, i) => `<button class="demo-tab" role="tab" id="demo-tab-${i}" aria-controls="demo-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}">${s.name}</button>`).join('')}
        </div>
        <div class="demo-body" role="tabpanel" id="demo-panel" aria-labelledby="demo-tab-0" aria-live="polite"></div>
        <div class="demo-chips"></div>
        <div class="demo-foot">
          <span class="micro">Want to hear it on <b>your</b> business? <a href="/demo?for=home" data-cta="demo_micro">Book a demo</a></span>
          <span class="micro" style="white-space:nowrap">Avg. pickup <b style="color:var(--ok-text)">&lt;1s</b></span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- S3 · SILENCE TAX (pinned) -->
<section class="section section--paper" id="silence-tax">
  <div class="container">
    <div data-pin>
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow eyebrow--rust">The Silence Tax</span>
        <h2>Every unanswered call is money leaving the building.</h2>
        <p class="lede center" style="margin-inline:auto">Research keeps finding the same thing: customers call, nobody picks up, and the revenue quietly walks to a competitor.</p>
      </div>
      <div class="stats-band" data-reveal="children">
        ${JS.stats.map(s => `
        <div class="stat">
          <div class="value">${s.prefix ? esc(s.prefix) : ''}${s.count ? `<span data-count="${s.count}"${s.dec ? ` data-dec="${s.dec}"` : ''}${s.suf ? ` data-suf="${esc(s.suf)}"` : ''}>${Number(s.count).toLocaleString('en-US')}${s.suf ? esc(s.suf) : ''}</span>` : esc(s.value)}</div>
          <div class="label">${s.label}</div>
          <div class="src">${s.source.toUpperCase()}</div>
        </div>`).join('')}
      </div>
      <div style="margin-top:24px" data-reveal="children">
        <div class="calc" data-calc>
          <div class="calc-controls">
            <span class="eyebrow">What is silence costing you?</span>
            <div class="calc-field">
              <label for="calc-calls">Missed calls per month <output for="calc-calls" data-out-calls>${JS.calc.calls}</output></label>
              <input id="calc-calls" type="range" min="0" max="200" step="1" value="${JS.calc.calls}" data-calc-calls>
            </div>
            <div class="calc-field">
              <label for="calc-value">Average job value <output for="calc-value" data-out-value>$${JS.calc.value}</output></label>
              <input id="calc-value" type="range" min="50" max="5000" step="50" value="${JS.calc.value}" data-calc-value>
            </div>
            <p class="form-note">Conservative estimate: each missed call is a job you never quoted. Drag the sliders.</p>
          </div>
          <div class="calc-result">
            <span class="eyebrow">Monthly revenue leak</span>
            <div class="big" data-calc-out>$${(JS.calc.calls * JS.calc.value).toLocaleString('en-US')}</div>
            <p>That's <b data-calc-year>$${(JS.calc.calls * JS.calc.value * 12).toLocaleString('en-US')}</b> a year walking out the door.</p>
            <span class="note">Your own numbers, illustrative — the ROI model we build for you is specific to your business.</span>
          </div>
        </div>
        <p class="lede center" style="margin-inline:auto;margin-top:24px">${L.QUOTE}</p>
      </div>
    </div>
  </div>
</section>

<!-- S4 · THE HAZIR LOOP (PINNED STORY) -->
<section class="section" id="loop" data-pin-story="loop" style="padding-top:24px;padding-bottom:28px">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">The Hazir Loop</span>
      <h2>Catch → Train → Launch → Compound</h2>
      <p class="lede center" style="margin-inline:auto">The four-step loop every HazirMinds deployment runs — and keeps running. Your AI team gets measurably better every month it works.</p>
    </div>
    <div class="grid grid-4 pin-stage" data-reveal="children">
      ${loop.map(s => `<div class="card" style="text-align:center"><span class="num">${s.n}</span><h3 style="font-size:19px;margin-top:8px;margin-bottom:8px">${s.name}</h3></div>`).join('')}
    </div>
    <p class="center" style="margin-top:20px;margin-bottom:20px"><a class="link-arrow" href="/services#loop" data-cta="home_loop">See the full loop on the services page ${I('arrow')}</a></p>
  </div>
</section>

<!-- S5 · MARQUEE -->
<section class="marquee-band" aria-label="Tools HazirMinds works with">
  <div class="marquee-label">Plugs into your stack</div>
  <div class="marquee"><div class="marquee-track">${site.marquee1.map(t => `<span class="pill">${I('workflow')}${t}</span>`).join('')}</div></div>
  <div class="marquee"><div class="marquee-track">${site.marquee2.map(t => `<span class="pill">${I('chat')}${t}</span>`).join('')}</div></div>
</section>

<!-- S7 · THREE DOORS -->
<section class="section section--paper" id="doors">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">The Three Doors</span>
      <h2>Three ways teams put HazirMinds to work</h2>
      <p class="lede center" style="margin-inline:auto">Start with the door that hurts most. Most teams add the others once the first one has paid for itself.</p>
    </div>
    <div class="grid grid-3" data-reveal="children">
      <div class="card card--hover door">
        <span class="icon-tile">${I('headset')}</span>
        <h3>Answer &amp; Book</h3>
        <p class="muted" style="font-size:14.5px">Your AI front desk: reception, voice, chat and booking — always on.</p>
        <ul>
          <li>${I('check')}<span>24/7 AI receptionist books straight into your calendar</span></li>
          <li>${I('check')}<span>Chat, WhatsApp and SMS answered in seconds</span></li>
          <li>${I('check')}<span>Missed-call text-back rescues every slip</span></li>
        </ul>
      </div>
      <div class="card card--hover door">
        <span class="icon-tile icon-tile--brass">${I('zap')}</span>
        <h3>Sell &amp; Grow</h3>
        <p class="muted" style="font-size:14.5px">A revenue engine: outbound, reactivation, follow-up and reputation.</p>
        <ul>
          <li>${I('check')}<span>Speed-to-lead under 60 seconds</span></li>
          <li>${I('check')}<span>AI SDR books meetings while you sleep</span></li>
          <li>${I('check')}<span>Review engine keeps your stars climbing</span></li>
        </ul>
      </div>
      <div class="card card--hover door">
        <span class="icon-tile icon-tile--ok">${I('building')}</span>
        <h3>Run &amp; Scale</h3>
        <p class="muted" style="font-size:14.5px">Operations on autopilot: CRM, workflows, AI employees, enterprise.</p>
        <ul>
          <li>${I('check')}<span>CRM that updates itself, pipelines that move</span></li>
          <li>${I('check')}<span>Custom AI employees for any role</span></li>
          <li>${I('check')}<span><a href="/masjids" style="color:inherit;text-decoration:underline;text-decoration-color:var(--brass)">Masjid AI OS</a> for masjids &amp; Islamic centers</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- S8 · GOVERNANCE LAYER -->
<section class="section gov-band on-dark" id="governance" style="padding-top:48px;padding-bottom:48px">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">The Governance Layer</span>
      <h2>We publish it. Nobody has to take our word.</h2>
      <p class="lede center" style="margin-inline:auto">Four invariants every deployment inherits — part of the HazirMinds Operating Substrate, not bolted on as policy. Responsibility layers, hallucination control, source receipts and proof horizons are documented in full on the Chief-of-Staff page.</p>
    </div>
    ${L.governanceBand({ compact: true })}
    <div class="hero-ctas" style="justify-content:center;margin-top:48px" data-reveal="children">
      <a class="btn btn--brass btn--lg" data-no-magnet href="/chief-of-staff" data-cta="gov_cos_arch"><span class="shine"></span>See the Chief-of-Staff architecture ${I('arrow')}</a>
      <a class="btn btn--outline-light btn--lg" href="/chief-of-staff" data-cta="gov_front_door">One front door to your AI team ${I('arrow')}</a>
    </div>
  </div>
</section>

<!-- S10 · TRADE PICKER -->
<section class="section" id="your-trade">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow eyebrow--rust">Built for your trade</span>
      <h2>Pick your industry. See your AI team.</h2>
    </div>
    <div data-trade-picker data-reveal="children">
      <div class="trade-chips" role="group" aria-label="Choose your industry">
        ${IND.map(d => `<button class="trade-chip" data-trade="${d.key}" aria-pressed="false">${I('phone')}${d.name}</button>`).join('')}
        <a class="trade-chip trade-chip--link" href="/masjids" data-cta="trade_masjid">${I('building')}Masjids &amp; Islamic Centers</a>
      </div>
      <div class="trade-preview trade-preview--text">
        <div class="txt" data-trade-line></div>
      </div>
      <div style="margin-top:24px;display:flex;justify-content:center">
        <a class="btn btn--primary" data-trade-cta href="${IND[0].href}" data-cta="trade_page"><span class="shine"></span><span data-trade-cta-label>See the ${IND[0].name} playbook</span> ${I('arrow')}</a>
      </div>
    </div>
    <script type="application/json" id="trade-data">${JSON.stringify(tradeData)}</script>
  </div>
</section>

<!-- S13 · FINAL CTA -->
<section class="section section--paper" style="padding-top:0">
  <div class="container">
    <div class="final-cta" data-reveal>
      <div class="bg kenburns-slow" aria-hidden="true">
        <img src="/img/sunrise-yard.webp" alt="" width="1600" height="900" loading="lazy" decoding="async">
      </div>
      <div class="inner">
        <span class="serif-accent">${site.tagline}</span>
        <h2>Hear your own AI receptionist answer a live call</h2>
        <p style="color:rgba(250,247,242,.75)">We'll build a version that answers as <em>your business</em> — and let you call it before you spend a dollar.</p>
        <p style="color:rgba(250,247,242,.75)">A done-for-you deployment — trained on your services, your working hours and your exceptions, and tuned weekly by our team.</p>
        <div class="hero-ctas">
          ${L.btnDemoPlain('See it on your own line', 'final_cta', 'btn--primary btn--lg', 'home')}
          <a class="btn btn--outline-light btn--lg" href="${TEL}" data-cta="final_call">${I(CALL_ICON)} ${CALL_LABEL}</a>
        </div>
        <div class="contact">
          <a href="mailto:${site.email}">${site.email}</a>
          <span>Acceptance criteria you sign before we go live.</span>
        </div>
      </div>
    </div>
  </div>
</section>

</main>

${footer()}
${chromeEnd()}
`;

module.exports = { html };
