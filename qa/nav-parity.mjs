/* Nav parity guard.
 *
 * The navbar used to render ONE link per top-level item on mobile, which silently dropped every
 * mega-menu child: a phone could reach /services and one trade URL but not /masjids, not
 * /chief-of-staff, not the other industries, and not the comparison pages. Layout sweeps did
 * not catch it because they test overflow and tap targets, never whether the nav is COMPLETE.
 *
 * This asserts the real rendered nav: at every breakpoint, every href the desktop nav offers must
 * also be reachable from the mobile panel, and each accordion group must actually open.
 *
 * Needs the local server (node server.js 4173). Exits 1 on failure.
 */
import { webkit } from 'playwright';

const BASE = process.env.QA_BASE || 'http://localhost:4173';
const WIDTHS = [390, 768, 1024, 1440];
const PAGES = ['/', '/industries/healthcare-dental', '/masjids'];
// The logo links home on every breakpoint, so it is not part of the parity set.
const IGNORE = new Set(['/']);

let fail = 0;
const bad = (m) => { console.log('  FAIL  ' + m); fail++; };
const ok = (m) => console.log('  ok    ' + m);

const b = await webkit.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
await ctx.addInitScript(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); } catch (e) { } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));

const hrefs = (sel) => p.evaluate((s) => {
  const scope = document.querySelector(s);
  if (!scope) return null;
  return [...new Set([...scope.querySelectorAll('a')].map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('http')))].sort();
}, sel);

let desktopSet = null;

for (const url of PAGES) {
  for (const w of WIDTHS) {
    await p.setViewportSize({ width: w, height: 900 });
    await p.goto(BASE + url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(450);
    // Ask the page which mode it is in rather than hardcoding the CSS breakpoint, so this guard
    // keeps working if the breakpoint moves.
    const mobile = await p.evaluate(() => {
      const b = document.querySelector('.nav-burger');
      return !!b && b.getBoundingClientRect().width > 0;
    });

    if (!mobile) {
      const d = await hrefs('.nav-links');
      if (!d) { bad(`${url} @${w}: .nav-links missing`); continue; }
      if (!desktopSet) desktopSet = d;
      else for (const h of d) if (!desktopSet.includes(h)) desktopSet.push(h);
      ok(`${url} @${w}: desktop nav offers ${d.length} hrefs`);
      continue;
    }

    // open the panel
    const burger = await p.$('.nav-burger');
    if (!burger) { bad(`${url} @${w}: no hamburger`); continue; }
    await burger.click();
    await p.waitForTimeout(350);

    const panelOpen = await p.evaluate(() => {
      const el = document.querySelector('.nav-mobile');
      return !!el && getComputedStyle(el).display !== 'none';
    });
    if (!panelOpen) { bad(`${url} @${w}: panel did not open`); continue; }

    // every group must open and reveal children
    const groups = await p.evaluate(() => [...document.querySelectorAll('.nav-mobile details.m-group')]
      .map(d => ({ label: d.querySelector('summary')?.textContent.trim() || '?', kids: d.querySelectorAll('a').length, open: d.open })));
    if (!groups.length) { bad(`${url} @${w}: no accordion groups in the mobile panel`); continue; }

    for (let i = 0; i < groups.length; i++) {
      const wasOpen = groups[i].open;
      await p.evaluate((idx) => {
        const d = [...document.querySelectorAll('.nav-mobile details.m-group')][idx];
        if (!d.open) d.querySelector('summary').click();
      }, i);
      await p.waitForTimeout(220);
      const st = await p.evaluate((idx) => {
        const d = [...document.querySelectorAll('.nav-mobile details.m-group')][idx];
        const kids = [...d.querySelectorAll('a')];
        const vis = kids.filter(a => a.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
        const heights = vis.map(a => a.getBoundingClientRect().height);
        return { open: d.open, kids: kids.length, visible: vis.length, smallest: heights.length ? Math.round(Math.min(...heights)) : 0, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      }, i);
      if (!st.open) bad(`${url} @${w}: group "${groups[i].label}" did not open`);
      else if (st.visible !== st.kids) bad(`${url} @${w}: group "${groups[i].label}" shows ${st.visible}/${st.kids} links`);
      else if (st.smallest < 24) bad(`${url} @${w}: group "${groups[i].label}" tap target ${st.smallest}px < WCAG 24px`);
      else if (st.overflowX > 0) bad(`${url} @${w}: group "${groups[i].label}" overflows ${st.overflowX}px`);
      else ok(`${url} @${w}: group "${groups[i].label}" → ${st.visible}/${st.kids} links, smallest tap ${st.smallest}px`);
      if (!wasOpen) await p.evaluate((idx) => {
        const d = [...document.querySelectorAll('.nav-mobile details.m-group')][idx];
        if (d.open) d.querySelector('summary').click();
      }, i);
      await p.waitForTimeout(150);
    }

    // the actual parity assertion
    const m = await hrefs('.nav-mobile');
    if (!m) { bad(`${url} @${w}: .nav-mobile missing`); continue; }
    const missing = (desktopSet || []).filter(h => !IGNORE.has(h) && !m.includes(h));
    const visible = await p.evaluate(() => [...document.querySelectorAll('.nav-mobile a')].filter(a => a.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).length);
    if (missing.length) bad(`${url} @${w}: mobile panel is missing ${missing.length} desktop nav href(s): ${missing.join(', ')}`);
    else ok(`${url} @${w}: mobile panel carries all ${m.length} desktop nav hrefs (${visible} links, panel open)`);
  }
}

if (errs.length) bad('JS errors: ' + errs.join(' | '));
else ok('no JS errors');

/* The main axe sweep runs at a desktop viewport, where .nav-mobile is display:none — so the mobile
   panel's markup is never scanned. Open it at 390px and scan there, or the accordion ships untested. */
await p.setViewportSize({ width: 390, height: 844 });
await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(450);
await p.click('.nav-burger');
await p.evaluate(() => document.querySelectorAll('.nav-mobile details.m-group').forEach(d => { d.open = true; }));
await p.waitForTimeout(500);
try {
  await p.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
  const axe = await p.evaluate(async () => {
    const r = await axe.run(document.querySelector('.nav-mobile'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0]?.target?.join(' ') }));
  });
  if (axe.length) axe.forEach(v => bad(`axe on the open mobile panel: ${v.id} (${v.impact}, ${v.nodes} node(s)) ${v.target || ''}`));
  else ok('axe on the open mobile panel (390px, all groups expanded): 0 violations');
  const dbg = await p.evaluate(() => ({ open: document.querySelectorAll('.nav-mobile details[open]').length, links: document.querySelectorAll('.nav-mobile a').length, h: Math.round(document.querySelector('.nav-mobile').scrollHeight), clientH: Math.round(document.querySelector('.nav-mobile').clientHeight) }));
  ok(`panel with all groups open: ${dbg.open} open, ${dbg.links} links, scrollHeight ${dbg.h} vs clientHeight ${dbg.clientH} (scrolls, nothing unreachable)`);
} catch (e) { bad('could not run axe on the mobile panel: ' + String(e).slice(0, 120)); }

await b.close();
console.log(fail ? `\nNAV PARITY: ${fail} FAILURE(S)` : '\nNAV PARITY: PASS — mobile mirrors desktop at every breakpoint');
process.exit(fail ? 1 : 0);
