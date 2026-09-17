import fs from 'fs';
import puppeteer from 'puppeteer-core';
const AXE = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const EXE = 'C:/Users/froms/.cache/puppeteer/chrome/win64-153.0.8010.36/chrome-win64/chrome.exe';
const routes = ['/', '/services', '/pricing', '/masjids', '/enterprise', '/chief-of-staff', '/compare', '/compare/masjid-platforms', '/compare/smith-ai', '/about', '/demo', '/resources', '/resources/missed-call-cost', '/resources/speed-to-lead', '/resources/ai-vs-human-receptionist', '/resources/consent-disclosure-recording', '/resources/database-reactivation', '/resources/voicemail-to-booked-job', '/case-studies', '/privacy', '/terms', '/use-cases/after-hours-rescue', '/industries/dental'];
const RULES = ['color-contrast', 'aria-allowed-attr', 'aria-required-children', 'aria-valid-attr-value', 'heading-order', 'label', 'duplicate-id', 'listitem', 'table-duplicate-name', 'th-has-data-cells', 'td-headers-attr', 'scope-attr-valid', 'link-name', 'button-name', 'image-alt', 'landmark-one-main', 'page-has-heading-one'];
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.evaluateOnNewDocument(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); } catch (e) {} });
await p.setViewport({ width: 1440, height: 900 });
let bad = 0;
for (const r of routes) {
  await p.goto('http://localhost:4173' + r, { waitUntil: 'networkidle2', timeout: 60000 });
  await p.addScriptTag({ content: AXE });
  /* Colour-contrast must be measured on the settled painting, never on a frame mid-reveal.
     The reveal choreography animates opacity, so a run that happens to sample while a label is
     still fading reports a colour the reader never sees (the /enterprise ✓ LABELED stamp reads
     1.12:1 mid-flight and 9.75:1 settled). Waiting for animations is not enough on its own — the
     result then depends on how fast the machine happened to be, and the suite flaps between 0
     and 2 failing pages on identical code. So ask the site for its own "motion unavailable"
     state: html.no-motion is a real state the CSS defines (everything revealed, transforms off,
     and it is what the engine-failure fallback applies). Contrast is measured on the colours the
     reader ends up seeing, and a genuine contrast defect is still caught. */
  await p.evaluate(() => document.documentElement.classList.add('no-motion', 'motion-done'));
  await p.waitForFunction(() => document.getAnimations().every(a => {
    if (a.playState !== 'running') return true;
    const t = a.effect && a.effect.getTiming && a.effect.getTiming();
    return !!(t && t.iterations === Infinity);
  }), { timeout: 10000, polling: 100 }).catch(() => { });
  await new Promise(res => setTimeout(res, 250));
  const v = await p.evaluate(async (rules) => {
    const o = await window.axe.run(document, { runOnly: rules });
    return o.violations.map(x => x.id + '(' + x.impact + ':' + x.nodes.length + ')');
  }, RULES);
  if (v.length) bad++;
  console.log('  ' + r.padEnd(34) + (v.length ? v.join(' ') : 'AXE CLEAN'));
}
console.log('\n  pages with violations: ' + bad + '/' + routes.length);
await b.close();
