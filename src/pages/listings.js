// HazirMinds — industries ×8 and use-cases ×9 page generators
const L = require('../lib');
const { esc, I, nav, footer, chromeEnd, roiBar, site } = L;
const industries = require('../data/industries');
const usecases = require('../data/usecases');
const services = require('../data/services');

const allServices = services.flatMap(g => g.services);
const svcBySlug = Object.fromEntries(allServices.map(s => [s.slug, s]));

function shell(o) {
  return `<!doctype html>
<html lang="en">
${L.head(o)}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${roiBar()}
${nav()}
<main id="main">
${o.main}
</main>
${footer()}
${chromeEnd()}`;
}

/* ---------------- industries ---------------- */
function industryPage(d) {
  const bc = L.breadcrumbs([['Home', '/'], ['Industries', '/industries/' + d.key], [d.name, '']]);
  const ld = [{
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'HazirMinds AI for ' + d.name, serviceType: 'AI receptionists & automation for ' + d.name,
    provider: { '@type': 'Organization', name: 'HazirMinds', url: site.url },
    areaServed: ['US', 'GB', 'CA']
  }];
  const main = `
  <section class="hero-sub-plain section--paper">
    <div class="container hero-split">
      <div data-reveal="children">
        ${bc.html}
        <span class="eyebrow eyebrow--rust">${d.name} · AI that answers</span>
        <h1 style="font-size:clamp(34px,4.6vw,58px)">${d.pain}</h1>
        <p class="lede" style="margin-top:16px">${d.sub}</p>
        <div class="hero-ctas" style="margin-top:26px">
          ${L.btnDemo('Book a Free Demo', 'ind_' + d.key, 'btn--primary btn--lg')}
          <a class="btn btn--ghost btn--lg" href="#outcomes">See the outcomes</a>
        </div>
        <div class="chips" style="margin-top:22px"><span class="pill pill--brass">${I('shield')} ${d.compliance}</span></div>
      </div>
      <figure class="media-panel" data-reveal>
        <img src="${d.img}" alt="${d.name} business receiving an AI-answered call from HazirMinds" width="640" height="480" loading="lazy" decoding="async">
      </figure>
    </div>
  </section>

  <section class="section" id="outcomes">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Three outcomes</span>
        <h2>What changes in month one</h2>
      </div>
      <div class="grid grid-3" data-reveal="children">
        ${d.outcomes.map(o => `
        <div class="card card--hover outcome-card">
          <span class="icon-tile">${I(o.icon)}</span>
          <div><h3 style="font-size:18px">${o.t}</h3><p>${o.d}</p></div>
        </div>`).join('')}
      </div>
      <div class="card card--panel card--hairline-top" data-reveal style="margin-top:26px;display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:space-between">
        <div><span class="num">ILLUSTRATIVE STAT</span><div class="stat-value" style="font-family:var(--font-display);font-weight:800;font-size:clamp(34px,4vw,52px);color:var(--rust-text);letter-spacing:-.02em">${d.stat}</div><span class="stat-note">${d.statLabel}</span></div>
        ${L.btnDemo('Get this for your ' + d.name.toLowerCase() + ' business', 'ind_stat_' + d.key, 'btn--primary btn--lg')}
      </div>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="sec-head" data-reveal="children">
        <span class="eyebrow">Fits your stack</span>
        <h2>Works with the tools ${d.name.toLowerCase()} teams already run</h2>
      </div>
      <div class="int-line" data-reveal>${d.integrations.split(', ').map(t => `<span class="pill">${I('workflow')}${t}</span>`).join('')}</div>
      <div class="final-cta" data-reveal style="margin-top:48px">
        <div class="inner" style="max-width:640px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>Your next missed call is your competitor's next customer</h2>
          <div class="hero-ctas">${L.btnDemoPlain('Book a Free Demo', 'ind_final_' + d.key, 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>`;

  return shell({
    title: `AI for ${d.name} — Answer Every Call, Book Every Job`,
    path: '/industries/' + d.key,
    desc: d.pain + ' ' + d.sub,
    ld: [L.orgLd(), ...ld],
    main
  });
}

/* ---------------- use cases ---------------- */
/* Only two of the nine use-case pages have a matching photograph in the library, so the band
   is keyed rather than shared. The other seven deliberately render with the UC geometry
   template only — stretching one of these two across pages it does not match would show. */
const UC_PHOTO = {
  'after-hours-rescue': { base: 'uc-rescue', alt: 'An after-hours scene — the window in which a missed call is still recoverable.' },
  'review-engine':      { base: 'uc-review', alt: 'A customer-facing moment after the work is done.' }
};

function useCasePage(u) {
  const bc = L.breadcrumbs([['Home', '/'], ['Use Cases', '/use-cases/' + u.key], [u.name, '']]);
  const rel = u.services.map(s => svcBySlug[s]).filter(Boolean);
  const main = `
  <section class="hero-sub-plain section--paper">
    <div class="container">
      <div style="max-width:820px" data-reveal="children">
        ${bc.html}
        <span class="eyebrow eyebrow--rust">Use case</span>
        <h1 style="font-size:clamp(34px,4.6vw,58px)">${u.name}</h1>
      </div>
      <div class="grid grid-3" style="margin-top:38px" data-reveal="children">
        <div class="card"><span class="num">THE PAIN</span><p class="serif-accent" style="font-size:17px;margin:10px 0 0">${u.pain}</p></div>
        <div class="card"><span class="num">THE MECHANIC</span><p style="margin:10px 0 0;font-size:15px">${u.fix}</p></div>
        <div class="card" style="background:var(--dark);color:var(--cream);border-color:var(--dark)"><span class="num" style="color:var(--brass)">THE OUTCOME</span><p style="margin:10px 0 0;font-size:15px;color:rgba(250,247,242,.85)">${u.outcome}</p></div>
      </div>
    </div>
  </section>
  ${(() => { const ph = UC_PHOTO[u.key]; return ph ? `
  <section class="section" style="padding-bottom:0">
    <div class="container" style="max-width:860px">
      <div class="band-media" data-reveal>
        <img src="/img/uc/${ph.base}-1200.webp"
             srcset="/img/uc/${ph.base}-600.webp 600w, /img/uc/${ph.base}-900.webp 900w, /img/uc/${ph.base}-1200.webp 1200w, /img/uc/${ph.base}-1600.webp 1600w"
             sizes="(max-width: 900px) 100vw, 860px" width="1600" height="1200"
             loading="lazy" decoding="async" alt="${ph.alt}">
      </div>
    </div>
  </section>` : ''; })()}
  <section class="section">
    <div class="container" style="max-width:860px">
      <div class="card card--panel card--hairline-top center" data-reveal>
        <span class="num">ILLUSTRATIVE STAT</span>
        <div style="font-family:var(--font-display);font-weight:800;font-size:clamp(40px,5vw,64px);color:var(--rust-text);letter-spacing:-.02em;line-height:1;margin:8px 0">${u.stat}</div>
        <span class="stat-note">${u.statLabel}</span>
      </div>
      <div class="sec-head" data-reveal="children" style="margin-top:64px">
        <span class="eyebrow">Deploy it with</span>
        <h2 style="font-size:clamp(24px,2.6vw,34px)">The services behind this use case</h2>
      </div>
      <div class="grid grid-3" data-reveal="children">
        ${rel.map(s => `
        <div class="card card--hover">
          <span class="sn">SERVICE ${s.n}</span>
          <h3 style="font-size:17px;margin-top:6px">${s.name}</h3>
          <p class="muted" style="font-size:13.5px">${s.desc}</p>
          <a class="link-arrow" href="/services#${s.slug}">Details ${I('arrow')}</a>
        </div>`).join('')}
      </div>
      <div class="final-cta" data-reveal style="margin-top:56px">
        <div class="inner" style="max-width:640px">
          <span class="serif-accent">${site.tagline}</span>
          <h2>See this running on your phones</h2>
          <div class="hero-ctas">${L.btnDemoPlain('Book a Free Demo', 'uc_final_' + u.key, 'btn--primary btn--lg')}</div>
        </div>
      </div>
    </div>
  </section>`;
  return shell({
    title: u.name + ' — HazirMinds Use Case',
    path: '/use-cases/' + u.key,
    desc: u.pain + ' ' + u.outcome,
    ld: [L.orgLd(), bc.ld],
    main
  });
}

module.exports = {
  pages: [
    ...industries.map(d => ({ file: `industries/${d.key}/index.html`, html: industryPage(d) })),
    ...usecases.map(u => ({ file: `use-cases/${u.key}/index.html`, html: useCasePage(u) }))
  ]
};
