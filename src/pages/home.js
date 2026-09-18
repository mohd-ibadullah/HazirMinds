// HazirMinds — home page (13 sections)
const L = require('../lib');
const { esc, jsonAttr, I, head, roiBar, nav, footer, chromeEnd, site, TEL, CALL_LABEL, CALL_TEXT, CALL_ICON } = L;
const pricing = require('../data/pricing');
const industries = require('../data/industries');
const C = require('../data/compare');
const JS = require('../data/site.json');
const loop = require('../data/loop');

const tradeData = industries.map(d => ({ key: d.key, name: d.name, img: d.img, alt: d.name + ' — HazirMinds AI team at work', line: `<h3>${esc(d.pain)}</h3><p class="lede">${esc(d.sub)}</p>`, href: '/industries/' + d.key }));

const faqs = pricing.faqs.slice(0, 5);
const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };

const svcLd = pricing.tiers.map(t => ({
  '@context': 'https://schema.org', '@type': 'Service',
  name: 'HazirMinds ' + t.name, serviceType: 'AI automation platform',
  provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url },
  areaServed: ['US', 'GB', 'CA'],
  offers: { '@type': 'Offer', price: t.monthly ? String(t.monthly) : undefined, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: site.url + '/pricing', ...(t.monthly ? {} : { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD', valueAddedTaxIncluded: false } }) }
}));

const html = `${head({ rawTitle: 'HazirMinds — Governed AI Receptionists & Sales Agents | Always Present. Never Missed.', path: '/', desc: site.desc, ld: [L.orgLd(), L.websiteLd(), svcLd[0], svcLd[1], svcLd[2], svcLd[3], faqLd] })}
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
          <span class="micro">Want to hear it on <b>your</b> business? <a href="/demo" data-cta="demo_micro">Book a demo</a></span>
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
      <div style="margin-top:22px" data-reveal="children">
        <div class="calc" data-calc>
          <div class="calc-controls">
            <span class="eyebrow">What is silence costing you?</span>
            <div class="calc-field">
              <label for="calc-calls">Missed calls per month <output for="calc-calls" data-out-calls>${JS.calc.calls}</output></label>
              <input id="calc-calls" type="range" min="0" max="200" step="1" value="${JS.calc.calls}" data-calc-calls>
            </div>
            <div class="calc-field">
              <label for="calc-value">Average job value <output for="calc-value" data-out-value>$${JS.calc.value}</output></label>
              <input id="calc-value" type="range" min="50" max="5000" step="50" value="400" data-calc-value>
            </div>
            <p class="form-note">Conservative estimate: each missed call is a job you never quoted. Drag the sliders.</p>
          </div>
          <div class="calc-result">
            <span class="eyebrow">Monthly revenue leak</span>
            <div class="big" data-calc-out>$${(JS.calc.calls * JS.calc.value).toLocaleString('en-US')}</div>
            <p>That's <b data-calc-year>$${(JS.calc.calls * JS.calc.value * 12).toLocaleString('en-US')}</b> a year walking out the door.</p>
            <span class="note">Illustrative estimate — your demo includes a business-specific ROI model.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- S3b · AFTER-HOURS PHOTOGRAPH -->
<section class="section" style="padding-bottom:0">
  <div class="container">
    <div class="band-media" data-reveal>
      <img src="/img/hm/hm-afterhours-1600.webp"
           srcset="/img/hm/hm-afterhours-800.webp 800w, /img/hm/hm-afterhours-1200.webp 1200w, /img/hm/hm-afterhours-1600.webp 1600w, /img/hm/hm-afterhours-2400.webp 2400w"
           sizes="(max-width: 900px) 100vw, 1200px" width="2400" height="1600"
           loading="lazy" decoding="async"
           alt="An empty front desk at last light — the moment an unanswered call becomes a lost job.">
    </div>
    <p class="stat-note center" style="margin-top:12px">6:42 PM. The business is closed. The customer is not.</p>
  </div>
</section>

<!-- S4 · THE HAZIR LOOP (PINNED STORY) -->
<section class="section" id="loop" data-pin-story="loop" style="padding-top:64px">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">The Hazir Loop</span>
      <h2>Catch → Train → Launch → Compound</h2>
      <p class="lede center" style="margin-inline:auto">The four-step loop every HazirMinds deployment runs — and keeps running. Your AI team gets measurably better every month it works.</p>
    </div>
    <div class="grid grid-4 pin-stage" data-reveal="children">
      ${loop.map(s => `<div class="card" style="text-align:center"><span class="num">${s.n}</span><h3 style="font-size:19px;margin-top:8px">${s.name}</h3></div>`).join('')}
    </div>
    <p class="center" style="margin-top:22px"><a class="link-arrow" href="/services#loop" data-cta="home_loop">See the full loop on the services page ${I('arrow')}</a></p>
  </div>
</section>

<!-- S5 · MARQUEE -->
<section class="marquee-band" aria-label="Tools HazirMinds works with">
  <div class="marquee-label">Plugs into your stack</div>
  <div class="marquee"><div class="marquee-track">${site.marquee1.map(t => `<span class="pill">${I('workflow')}${t}</span>`).join('')}</div></div>
  <div class="marquee"><div class="marquee-track">${site.marquee2.map(t => `<span class="pill">${I('chat')}${t}</span>`).join('')}</div></div>
</section>

<!-- S6 · PROBLEM → SOLUTION -->
<section class="section" id="why">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">Why this keeps happening</span>
      <h2>You built a great business. The phone didn't get the memo.</h2>
    </div>
    <div class="split-grid" data-reveal="children">
      <div class="split-card bad">
        <h3 style="margin-bottom:14px">Without HazirMinds</h3>
        <ul>
          <li><span class="x">${I('x')}</span><span><b>Voicemail at 6:01 PM.</b> <span>After-hours callers become tomorrow's regret.</span></span></li>
          <li><span class="x">${I('x')}</span><span><b>Hold music and phone tag.</b> <span>Hot leads cool off in minutes.</span></span></li>
          <li><span class="x">${I('x')}</span><span><b>Notes that never get written.</b> <span>What was said lives only in memory.</span></span></li>
          <li><span class="x">${I('x')}</span><span><b>Seasonal spikes break the desk.</b> <span>Hiring for peaks punishes your payroll.</span></span></li>
        </ul>
      </div>
      <div class="split-card good">
        <h3 style="margin-bottom:14px;color:var(--cream)">With HazirMinds</h3>
        <ul>
          <li><span class="c">${I('check')}</span><span><b>Every call answered in &lt;1s.</b> <span>Midnight, holiday, peak hour — same hello.</span></span></li>
          <li><span class="c">${I('check')}</span><span><b>Booked, not just answered.</b> <span>Live calendar access, confirmed on the call.</span></span></li>
          <li><span class="c">${I('check')}</span><span><b>Every word logged.</b> <span>Transcripts and outcomes in your CRM automatically.</span></span></li>
          <li><span class="c">${I('check')}</span><span><b>Infinite capacity.</b> <span>One call or two hundred — same cost, same quality.</span></span></li>
        </ul>
      </div>
    </div>
    <div class="compare-wrap" data-reveal="children">
      <table class="compare">
        <thead><tr><th scope="col"><span style="position:absolute;left:-9999px">Scenario</span></th><th scope="col">Missed calls</th><th scope="col">Human receptionist</th><th scope="col">HazirMinds AI team</th></tr></thead>
        <tbody>
          <tr><td>Cost</td><td>${JS.stats[1].value} per miss</td><td>${JS.competitors.find(c => c.slug === 'human-receptionist').at100}</td><td class="col-hazir">from $${JS.tiers.chronos.monthly}/mo flat</td></tr>
          <tr><td>Hours</td><td>Nobody home</td><td>40 hrs/week, plus PTO</td><td class="col-hazir">24/7/365</td></tr>
          <tr><td>Consistency</td><td>—</td><td>Varies by day &amp; workload</td><td class="col-hazir">Identical on every call</td></tr>
          <tr><td>Logging</td><td>Nothing captured</td><td>Hand-written notes</td><td class="col-hazir">Full transcript + CRM sync</td></tr>
          <tr><td>Scalability</td><td>Lost revenue</td><td>Hire &amp; train per seat</td><td class="col-hazir">Instant, unlimited</td></tr>
        </tbody>
      </table>
      <p class="src-note center" style="margin-top:10px">"Missed calls" cost is ${JS.stats[1].value} lost per missed call — <b>${JS.stats[1].source}</b>. Human-receptionist cost is a loaded salary estimate. Both are indicative, not audited.</p>
    </div>
  </div>
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
        <div class="door-foot"><span class="price">from $${JS.tiers.chronos.monthly}<small>/month</small></span>${L.btnDemo('Book', 'door_answer', 'btn--sm')}</div>
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
        <div class="door-foot"><span class="price">from $${JS.tiers['hazir-pro'].monthly}<small>/month</small></span>${L.btnDemo('Book', 'door_sell', 'btn--sm')}</div>
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
        <div class="door-foot"><span class="price">Custom<small>scoped to your ops</small></span><a class="btn btn--ghost btn--sm" href="/chief-of-staff" data-cta="door_run">Explore ${I('arrow')}</a></div>
      </div>
    </div>
  </div>
</section>

<!-- S8 · GOVERNANCE LAYER -->
<section class="section gov-band on-dark" id="governance">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">The Governance Layer</span>
      <h2>We publish it. Nobody has to take our word.</h2>
      <p class="lede center" style="margin-inline:auto">Four invariants every deployment inherits — part of the HazirMinds Operating Substrate, not bolted on as policy. Responsibility layers, hallucination control, source receipts and proof horizons are documented in full on the enterprise page.</p>
    </div>
    ${L.governanceBand({ compact: true })}
    <div class="hero-ctas" style="justify-content:center;margin-top:52px" data-reveal="children">
      <a class="btn btn--brass btn--lg" href="/enterprise" data-cta="gov_cos_arch"><span class="shine"></span>See the Chief-of-Staff architecture ${I('arrow')}</a>
      <a class="btn btn--outline-light btn--lg" href="/chief-of-staff" data-cta="gov_front_door">One front door to your AI team ${I('arrow')}</a>
    </div>
  </div>
</section>

<!-- S9 · PROOF BAND -->
<section class="section proof-band on-dark">
  <div class="proof-bg kenburns" aria-hidden="true">
    <img src="/img/sunrise-yard.webp" alt="" width="1600" height="900" loading="lazy" decoding="async">
  </div>
  <div class="container proof-inner">
    <div class="proof-card proof-card--top" data-reveal>
      <div class="seal" aria-hidden="true">PROOF</div>
      <span class="eyebrow">How we prove it</span>
      <h3>We prove outcomes against acceptance criteria you sign.</h3>
      <p>Going live proves nothing by itself. At kickoff we agree — in writing — the criteria that define success for your business, and every deployment is measured and reported against them, from real transcripts.</p>
      <ul class="guarantee-list">
        <li>${I('check')}<span>Live in 7–14 days, tuned weekly by our team</span></li>
        <li>${I('check')}<span>Every call transcribed, every booking tracked</span></li>
        <li>${I('check')}<span>Month-to-month after day 60 — no lock-in</span></li>
      </ul>
      <div style="margin-top:20px">${L.btnDemo('See what we measure', 'proof', 'btn--brass')}</div>
    </div>
    <div class="proof-card" data-reveal>
      <span class="eyebrow">${site.phone ? 'Try it right now' : 'Talk to us'}</span>
      <h3>${site.phone ? "Call our AI. It's awake." : 'Email us — a person answers.'}</h3>
      <p>${site.phone
        ? "This is a live HazirMinds deployment — the same voice, the same sub-second pickup your customers would get. Ask it to book a demo. It will."
        : "Tell us what you want the AI to handle first and we'll show you what a governed deployment looks like in your business."}</p>
      <a class="callcard-num" href="${TEL}" data-cta="${site.phone ? 'call_demo_line' : 'email_us'}">
        <span class="ic">${I(CALL_ICON)}</span>
        <span><b>${CALL_LABEL}</b><span>${site.phone ? 'Toll-free · answers in under one second' : 'We reply by email'}</span></span>
      </a>
      <a class="link-arrow" href="#demo" data-cta="replay_demo">Or watch the transcript demo again ${I('arrow')}</a>
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
        ${industries.map(d => `<button class="trade-chip" data-trade="${d.key}" aria-pressed="false">${I('phone')}${d.name}</button>`).join('')}
        <a class="trade-chip trade-chip--link" href="/masjids" data-cta="trade_masjid">${I('building')}Masjids &amp; Islamic Centers</a>
      </div>
      <div class="trade-preview">
        <div class="txt" data-trade-line></div>
        <div class="img"><img data-trade-img src="/img/trade-hvac.webp" alt="HVAC" width="640" height="480" loading="lazy" decoding="async"></div>
      </div>
      <div style="margin-top:24px;display:flex;justify-content:center">
        <a class="btn btn--primary" data-trade-cta href="/industries/hvac" data-cta="trade_page"><span class="shine"></span>See the HVAC playbook ${I('arrow')}</a>
      </div>
    </div>
    <script type="application/json" id="trade-data">${JSON.stringify(tradeData)}</script>
  </div>
</section>

<!-- S11 · PRICE STRIP -->
<section class="section section--paper" id="plans">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">Simple pricing</span>
      <h2>Four plans. Published rate card. No unpublished meters.</h2>
      <p class="lede center" style="margin-inline:auto">Every plan publishes its usage rate card before go-live, and every deployment is measured against the acceptance criteria you sign. Annual billing gets two months free.</p>
    </div>
    <div class="price-strip" data-reveal="children">
      ${pricing.tiers.map(t => `
      <div class="card price-card${t.best ? ' price-card--featured' : ''}">
        <span class="tier">${t.name}</span>
        ${t.monthly
          ? `<span class="amount">$<span data-price-m data-monthly="${t.monthly}" data-annual="${t.annual}">${t.monthly.toLocaleString('en-US')}</span><sup>/mo</sup></span>`
          : `<span class="amount">Custom</span>`}
        <span class="desc">${t.tagline}</span>
        <a class="btn ${t.best ? 'btn--primary' : 'btn--ghost'} btn--sm" href="/pricing#${t.id}" data-cta="price_${t.id}"><span class="shine"></span>${t.monthly ? 'See plan' : 'Talk to us'}</a>
      </div>`).join('')}
    </div>
    <p class="center" style="margin-top:22px"><a class="link-arrow" href="/pricing" data-cta="pricing_link">Full feature comparison, à-la-carte &amp; calculator ${I('arrow')}</a></p>
  </div>
</section>

<!-- S12 · OBJECTIONS FAQ -->
<section class="section" id="faq">
  <div class="container">
    <div class="sec-head center" data-reveal="children">
      <span class="eyebrow">Fair questions</span>
      <h2>The objections, answered plainly</h2>
    </div>
    <div class="faq" data-reveal="children">
      ${faqs.map(f => `
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">${f.q}<span class="ind">${I('plus')}</span></button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join('')}
      <p class="center" style="margin-top:18px"><a class="link-arrow" href="/pricing#faq" data-cta="faq_more">All pricing questions answered ${I('arrow')}</a></p>
    </div>
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
        <p style="color:rgba(250,247,242,.75)">Fifteen minutes. We'll build a version that answers as <em>your business</em> — and let you call it before you spend a dollar.</p>
        <div class="hero-ctas">
          ${L.btnDemoPlain('Book My Demo', 'final_cta', 'btn--primary btn--lg')}
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
