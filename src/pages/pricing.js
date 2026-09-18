// HazirMinds — /pricing page
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site } = L;
const pricing = require('../data/pricing');
const JS = require('../data/site.json');
const T = JS.tiers;

const fmt = n => '$' + n.toLocaleString('en-US');
const cell = v => {
  if (v === true) return '<span class="tick">✓</span>';
  if (v === false) return '<span class="cross">—</span>';
  if (v === 'core') return '<span class="tick">✓</span> core';
  return v;
};

/* The first five entries of pricing.faqs are general objections (voice quality, hallucinations,
   compliance, integrations, "what is governed AI") and are already the home page's FAQ. This
   page shows only the commercial questions — contract, minutes, go-live, and the guarantee —
   so the same answer is never published on two URLs. */
const faq = L.faqBlock(pricing.faqs.slice(5));
const bc = L.breadcrumbs([['Home', '/'], ['Pricing', '/pricing']]);

const html = `<!doctype html>
<html lang="en">
${L.head({
  title: 'Pricing — Chronos, Hazir Pro, Aeon & Archon Plans',
  path: '/pricing',
  desc: `HazirMinds pricing: ${T.chronos.name} $${T.chronos.monthly}/mo, ${T['hazir-pro'].name} $${T['hazir-pro'].monthly}/mo (most popular), ${T.aeon.name} $${T.aeon.monthly}/mo, ${T.archon.name} custom. Annual = 2 months free. Every plan publishes its usage rate card before go-live.`,
  ld: [L.orgLd(), bc.ld, faq.ld,
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: 'HazirMinds AI Platform Plans', serviceType: 'AI automation platform',
      provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url },
      areaServed: ['US', 'GB', 'CA'],
      offers: pricing.tiers.map(t => ({
        '@type': 'Offer', name: 'HazirMinds ' + t.name,
        ...(t.monthly ? { price: String(t.monthly), priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: site.url + '/pricing#' + t.id } : { priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: site.url + '/pricing#archon', priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD' } })
      }))
    }]
})}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container center">
      <div style="display:inline-block;text-align:left">${bc.html}</div>
      <h1 style="margin-inline:auto;max-width:18ch">Pricing you can do the math on.</h1>
      <p class="lede center" style="margin:18px auto 0">Every plan is month-to-month after 60 days, publishes its usage rate card before go-live, and goes live in 7–14 days. Prices in USD.</p>
      <div class="toggle-wrap" style="justify-content:center">
        <span data-show-monthly>Monthly</span>
        <button class="switch" data-annual role="switch" aria-checked="false" aria-label="Toggle annual billing (two months free)"></button>
        <span data-show-monthly>Annual</span>
        <span class="pill pill--ok save-pill">2 months free</span>
        <span class="pill pill--brass save-pill" data-show-annual hidden>Two months free applied</span>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:28px">
    <div class="container">
      <div class="band-media" data-reveal>
        <img src="/img/pr/pr-calm-1200.webp"
             srcset="/img/pr/pr-calm-800.webp 800w, /img/pr/pr-calm-1200.webp 1200w, /img/pr/pr-calm-1600.webp 1600w, /img/pr/pr-calm-2400.webp 2400w"
             sizes="(max-width: 900px) 100vw, 1200px" width="2400" height="1600"
             loading="lazy" decoding="async"
             alt="A calm, ordered workspace — what an unbilled invoice month is supposed to feel like.">
      </div>
      <p class="stat-note center" style="margin-top:12px">Flat published rates. No unpublished meters. No surprise invoices.</p>
    </div>
  </section>

  <section class="section" id="tiers" style="padding-top:34px">
    <div class="container">
      <div class="price-table-wrap" data-reveal>
        <table>
          <thead>
            <tr>
              <th scope="col">What's included</th>
              ${pricing.tiers.map(t => `<th scope="col" id="${t.id}">
                <span>${t.name}</span>
                ${t.monthly
                  ? `<span class="amount">$<span data-price-m data-monthly="${t.monthly}" data-annual="${t.annual}">${t.monthly.toLocaleString('en-US')}</span></span><span class="per">per month</span>`
                  : `<span class="amount">Custom</span><span class="per">scoped to your org</span>`}
              </th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${pricing.featureRows.map(r => `<tr><td>${r.label}</td>${pricing.tiers.map(t => `<td>${cell(r[t.id])}</td>`).join('')}</tr>`).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              ${pricing.tiers.map(t => `<td>${L.btnDemo(t.monthly ? 'Choose ' + t.name : 'Talk to us', 'pricing_' + t.id, t.best ? 'btn--primary btn--sm' : 'btn--ghost btn--sm')}</td>`).join('')}
            </tr>
          </tfoot>
        </table>
      </div>
      <p class="center form-note" style="margin-top:14px">All plans: 24/7/365 coverage · &lt;1s pickup · full transcripts · CRM sync · month-to-month after day 60. Extra minutes ${JS.addons.find(a => a.id === 'minutes').price} or per the published rate card. <b>No unpublished meters — the full usage rate card is in your hands before go-live.</b></p>
    </div>
  </section>

  <section class="section section--paper" id="market">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">The market, honestly</span> <span class="pill pill--brass" style="font-size:11px;vertical-align:middle;margin-left:8px">✓ Source-checked Sept 2026</span>
        <h2>What the alternatives actually cost</h2>
        <p class="lede center" style="margin-inline:auto">Same verified 2026 data as our comparison pages — because a rate card only means something next to the alternatives. Sources cited on-page.</p>
      </div>
      <div class="compare-wrap" data-reveal>
        <table class="compare compare-table">
          <thead><tr><th scope="col">Dimension</th><th scope="col" style="background:var(--rust);color:#fff">HazirMinds</th><th scope="col">GoHighLevel</th><th scope="col">Synthflow</th><th scope="col">Smith.ai</th><th scope="col">Artisan / 11x</th><th scope="col">Human</th></tr></thead>
          <tbody data-row-reveal>
            ${[['Model', 'model'], ['Entry price', 'entry'], ['~100 calls/mo', 'at100'], ['Hidden meters', 'meters'], ['Governance', 'gov']].map(([label, key]) => `<tr><td>${label}</td>${JS.competitors.map((c, i) => `<td${i === 0 ? ' class="col-hazir"' : ''}>${c[key]}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p class="src-note center" style="margin-top:10px">Sources: vendor pricing pages where published, each row dated — Artisan and 11x publish no pricing. Read live 16 Sept 2026 · full breakdowns on /compare</p>
      <p class="center" style="margin-top:18px"><a class="link-arrow" href="/compare" data-cta="pricing_compare">Read the full comparisons ${I('arrow')}</a></p>
    </div>
  </section>

  <section class="section section--paper" id="alacarte">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">À-la-carte</span>
        <h2>One-off projects, priced plainly</h2>
      </div>
      <div class="alc-grid" data-reveal="children">
        ${pricing.alc.map(a => `
        <div class="card alc-card">
          <span class="amount">${a.price}</span>
          <b style="font-family:var(--font-display)">${a.name}</b>
          <p>${a.note}</p>
          <a class="link-arrow" href="/services#${a.slug}" data-cta="alc_${a.slug}">See the service ${I('arrow')}</a>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" id="calculator">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow eyebrow--rust">ROI calculator</span>
        <h2>What would your AI team earn?</h2>
      </div>
      <div class="calc" data-calc data-reveal>
        <div class="calc-controls">
          <div class="calc-field">
            <label for="pc-calls">Missed calls per month <output for="pc-calls" data-out-calls>${JS.calc.calls}</output></label>
            <input id="pc-calls" type="range" min="0" max="200" step="1" value="${JS.calc.calls}" data-calc-calls>
          </div>
          <div class="calc-field">
            <label for="pc-value">Average job value <output for="pc-value" data-out-value>$${JS.calc.value}</output></label>
            <input id="pc-value" type="range" min="50" max="5000" step="50" value="${JS.calc.value}" data-calc-value>
          </div>
          <div class="calc-field">
            <label for="pc-conv">Booking rate on rescued calls <output for="pc-conv" data-out-conv>${JS.calc.conv}%</output></label>
            <input id="pc-conv" type="range" min="5" max="80" step="5" value="${JS.calc.conv}" data-calc-conv>
          </div>
          <p class="form-note">We assume a ${T['hazir-pro'].name} plan ($${T['hazir-pro'].monthly}/mo) as the cost baseline. Drag any slider.</p>
        </div>
        <div class="calc-result">
          <span class="eyebrow">Net monthly gain</span>
          <div class="big" data-calc-net>$${((JS.calc.calls * JS.calc.value * JS.calc.conv / 100) - JS.calc.plan).toLocaleString('en-US')}</div>
          <p>Rescued revenue <b data-calc-rescued>$${(JS.calc.calls * JS.calc.value * JS.calc.conv / 100).toLocaleString('en-US')}</b> − plan cost <b>$${JS.calc.plan}</b> = <b data-calc-net2>$${((JS.calc.calls * JS.calc.value * JS.calc.conv / 100) - JS.calc.plan).toLocaleString('en-US')}</b>/mo, or <b data-calc-year2>$${(((JS.calc.calls * JS.calc.value * JS.calc.conv / 100) - JS.calc.plan) * 12).toLocaleString('en-US')}</b>/yr.</p>
          <span class="note">Illustrative — your demo includes a business-specific model.</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--paper" id="measurement">
    <div class="container">
      <div class="card card--panel card--hairline-top center" data-reveal style="max-width:820px;margin-inline:auto">
        <div class="seal" style="margin-inline:auto">PROOF</div>
        <span class="eyebrow" style="justify-content:center">How we measure it</span>
        <h2 style="font-size:clamp(26px,3vw,38px)">We prove outcomes against acceptance criteria you sign.</h2>
        <p class="lede" style="margin:16px auto 0">Before we go live, we agree — in writing — the criteria that define success for your business. Every deployment is then measured against them and reported to you, built from real transcripts. Your plan stays month-to-month after the first 60 days, so you can leave on 30 days' notice if the outcomes aren't there.</p>
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          ${L.btnDemo('See what we measure', 'measurement_pricing', 'btn--primary btn--lg')}
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="faq">
    <div class="container">
      <div class="sec-head center" data-reveal="children">
        <span class="eyebrow">Pricing questions</span>
        <h2>Nine honest answers</h2>
      </div>
      <div class="faq" data-reveal="children">
        ${faq.html}
      </div>
    </div>
  </section>

  <section class="section section--paper" style="padding-top:0">
    <div class="container">
      <div class="final-cta" data-reveal>
        <div class="inner" style="max-width:640px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>Pick a plan. Hear it answer. Decide with your own ears.</h2>
          <div class="hero-ctas">${L.btnDemoPlain('Book a Free Demo', 'pricing_final', 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
${chromeEnd()}`;

module.exports = { html };
