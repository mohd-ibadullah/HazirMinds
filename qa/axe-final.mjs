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
  /* Colour-contrast has to be measured on the SETTLED page. The reveal choreography tints
     some labels while they animate in, so running axe mid-flight reports a transient colour
     (e.g. the /enterprise ✓ LABELED stamp reads 1.12:1 at opacity 0.4, 9.75:1 once settled)
     and the suite flaps between 0 and 2 failing pages on identical code. Wait for every
     finite animation to finish, ignoring the deliberately infinite marquee. */
  await p.waitForFunction(() => document.getAnimations().every(a => {
    if (a.playState !== 'running') return true;
    const t = a.effect && a.effect.getTiming && a.effect.getTiming();
    return !!(t && t.iterations === Infinity);
  }), { timeout: 10000, polling: 100 }).catch(() => { });
  await new Promise(res => setTimeout(res, 350));
  const v = await p.evaluate(async (rules) => {
    const o = await window.axe.run(document, { runOnly: rules });
    return o.violations.map(x => x.id + '(' + x.impact + ':' + x.nodes.length + ')');
  }, RULES);
  if (v.length) bad++;
  console.log('  ' + r.padEnd(34) + (v.length ? v.join(' ') : 'AXE CLEAN'));
}
console.log('\n  pages with violations: ' + bad + '/' + routes.length);
await b.close();
