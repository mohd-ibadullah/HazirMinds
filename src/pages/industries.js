// HazirMinds — /industries hub + 11 umbrella industry pages.
// Replaces the previous 8 flat trade pages (see src/data/industries.js for the redirect map).
const L = require('../lib');
const { nav, footer, chromeEnd, roiBar } = L;
const data = require('../data/industries');
const { industriesHub } = require('./industries/hub');
const { industryPage } = require('./industries/page');

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

module.exports = {
  pages: [
    { file: 'industries/index.html', html: shell(industriesHub(data)) },
    ...data.items.map(d => ({
      file: 'industries/' + d.key + '/index.html',
      html: shell(industryPage(d, data.items))
    }))
  ]
};
