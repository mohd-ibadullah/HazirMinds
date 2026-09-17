/* Resource articles — /resources/<slug>.
 *
 * These pages exist so the reading list on /resources is real rather than six cards that say
 * "Not published yet". Every number in them is either (a) arithmetic the reader can redo with
 * their own inputs, or (b) a source named at the point of use with its limits stated. Nothing
 * here carries an invented statistic, an unnamed study, or a claim about a client we do not
 * have — see the content rules in README.md. */
const L = require('../lib');
const articles = require('../data/articles');
const { head, roiBar, nav, footer, chromeEnd, breadcrumbs, btnDemo } = L;

function shell(o) {
  return `<!doctype html>
<html lang="en">
${head(o)}
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

function articlePage(a) {
  const bc = breadcrumbs([['Home', '/'], ['Resources', '/resources'], [a.title, '/resources/' + a.slug]]);
  return shell({
    title: a.title + ' — HazirMinds',
    path: '/resources/' + a.slug,
    desc: a.desc,
    ld: [{
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.desc,
      articleSection: a.cat,
      datePublished: '2026-09-17',
      dateModified: '2026-09-17',
      author: { '@type': 'Organization', name: 'HazirMinds' },
      publisher: { '@type': 'Organization', name: 'HazirMinds' },
      mainEntityOfPage: 'https://hazirminds.ai/resources/' + a.slug
    }],
    main: `
  <section class="hero-sub-plain section--paper" style="padding-bottom:0">
    <div class="container">
      ${bc.html}
      <span class="eyebrow">${a.cat} · ${a.read} read</span>
      <h1 style="max-width:22ch;margin-top:12px">${a.title}</h1>
      <p class="lede" style="margin-top:18px;max-width:60ch">${a.lede}</p>
    </div>
  </section>

  <section class="section" style="padding-top:38px">
    <div class="container">
      <article class="article-body" style="max-width:72ch">
${a.body}
      </article>
    </div>
  </section>

  <section class="section section--paper">
    <div class="container">
      <div class="card card--panel" style="max-width:72ch;margin-inline:auto;text-align:center" data-reveal>
        <h2 style="font-size:clamp(22px,2.4vw,30px)">Want this running on your phone line?</h2>
        <p class="lede" style="margin-top:10px;font-size:15px">15 minutes, no commitment, includes a walkthrough of exactly what we measure.</p>
        <div class="cta-row" style="justify-content:center;margin-top:18px">
          ${btnDemo('article_demo')}
          <a class="btn btn--ghost" href="/resources">Back to the reading list</a>
        </div>
      </div>
    </div>
  </section>`
  });
}

module.exports = { pages: articles.map(a => ({ file: 'resources/' + a.slug + '/index.html', html: articlePage(a) })) };
