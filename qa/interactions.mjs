/* Interaction guards for the three functional fixes from the 2026-09-18 homepage update.
   Each of these is a behaviour no layout sweep can see, and each is cheap to regress:
     FX-01  the Chief-of-Staff button takes no magnetic offset on hover (data-no-magnet)
     FX-02  the trade picker CTA label follows the selection, including on a ?trade= cold load
     FX-03  the mobile menu closes on an outside click and on Escape, aria-expanded in sync
   Needs the local server (node server.js 4173). Exits 1 on failure. */
import { webkit } from 'playwright';
const B = process.env.QA_BASE || 'http://localhost:4173';
const b = await webkit.launch();
const p = await b.newPage();
await p.addInitScript(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); } catch (e) { } });
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
let fail = 0;
const chk = (ok, msg) => { console.log((ok ? '  ok    ' : '  FAIL  ') + msg); if (!ok) fail++; };

// ============ FX-03: mobile menu closes on outside click + Escape ============
await p.setViewportSize({ width: 390, height: 844 });
await p.goto(B + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.click('.nav-burger');
await p.waitForTimeout(350);
chk(await p.evaluate(() => document.querySelector('.nav-mobile').classList.contains('open')), 'FX-03 menu opens');
await p.mouse.click(195, 700);   // well below the panel
await p.waitForTimeout(350);
const afterOutside = await p.evaluate(() => ({ open: document.querySelector('.nav-mobile').classList.contains('open'), aria: document.querySelector('.nav-burger').getAttribute('aria-expanded') }));
chk(!afterOutside.open, 'FX-03 closes on OUTSIDE click');
chk(afterOutside.aria === 'false', 'FX-03 aria-expanded back to false (' + afterOutside.aria + ')');

await p.click('.nav-burger');
await p.waitForTimeout(300);
await p.keyboard.press('Escape');
await p.waitForTimeout(300);
const afterEsc = await p.evaluate(() => ({ open: document.querySelector('.nav-mobile').classList.contains('open'), aria: document.querySelector('.nav-burger').getAttribute('aria-expanded'), focus: document.activeElement.className }));
chk(!afterEsc.open, 'FX-03 closes on Escape');
chk(afterEsc.aria === 'false', 'FX-03 Escape syncs aria-expanded');
chk(/nav-burger/.test(afterEsc.focus), 'FX-03 Escape returns focus to the burger (' + afterEsc.focus + ')');

// tapping a link still closes it
await p.click('.nav-burger'); await p.waitForTimeout(250);
await p.evaluate(() => document.querySelector('.nav-mobile details.m-group').open = true);
await p.waitForTimeout(200);
await p.evaluate(() => document.querySelector('.nav-mobile .m-kids a').click());
await p.waitForTimeout(900);
chk(await p.evaluate(() => !document.querySelector('.nav-mobile').classList.contains('open')), 'FX-03 tapping a link still closes it');

// ============ FX-02: trade picker CTA label follows the selection ============
await p.setViewportSize({ width: 1440, height: 950 });
await p.goto(B + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
const lbl0 = await p.textContent('[data-trade-cta-label]');
chk(lbl0.trim() === 'See the HVAC playbook', 'FX-02 default label = "' + lbl0.trim() + '"');
await p.click('.trade-chip[data-trade="dental"]');
await p.waitForTimeout(500);
const st = await p.evaluate(() => ({ label: document.querySelector('[data-trade-cta-label]').textContent.trim(), href: document.querySelector('[data-trade-cta]').getAttribute('href'), url: location.search }));
chk(st.label === 'See the Dental playbook', 'FX-02 label follows selection = "' + st.label + '"');
chk(st.href === '/industries/dental', 'FX-02 href follows too = ' + st.href);
chk(st.url.includes('trade=dental'), 'FX-02 deep-link param written = ' + st.url);

// deep link on load
await p.goto(B + '/?trade=legal', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
const dl = await p.evaluate(() => ({ label: document.querySelector('[data-trade-cta-label]').textContent.trim(), href: document.querySelector('[data-trade-cta]').getAttribute('href'), pressed: document.querySelector('.trade-chip[data-trade="legal"]').getAttribute('aria-pressed') }));
chk(dl.label === 'See the Legal playbook', 'FX-02 ?trade=legal renders the right label on load = "' + dl.label + '"');
chk(dl.pressed === 'true', 'FX-02 the matching chip is aria-pressed');

// masjid chip is a plain link, unaffected
const masjid = await p.evaluate(() => { const a = document.querySelector('.trade-chip--link'); return { tag: a.tagName, href: a.getAttribute('href'), hasLabel: !!a.querySelector('[data-trade-cta-label]') }; });
chk(masjid.tag === 'A' && masjid.href === '/masjids' && !masjid.hasLabel, 'FX-02 the Masjid chip is still a plain link');

// ============ FX-01: the Chief-of-Staff button does not move on hover ============
/* Scroll with the WHEEL. scrollIntoView/scrollBy do nothing here: the page runs Lenis, which owns
   the scroll position, so the band's 'top 85%' reveal trigger never fires and the element sits in
   its 24px CSS PRE-state — which measures as residue on a reveal that is working correctly. */
const cos = p.locator('[data-cta="gov_cos_arch"]');
await p.mouse.move(720, 500);
for (let i = 0; i < 40; i++) {
  const bb = await cos.boundingBox();
  if (bb && bb.y > 120 && bb.y < 600) break;
  await p.mouse.wheel(0, 420);
  await p.waitForTimeout(160);
}
await p.waitForTimeout(1800);
{
  const pre = await cos.evaluate(el => getComputedStyle(el).transform);
  chk(/matrix\(1, 0, 0, 1, 0, 0\)|none/.test(pre), 'FX-01 the reveal settles at zero offset (computed=' + pre + ')');
}

const box = await cos.boundingBox();
const top0 = box.y;
await p.mouse.move(box.x + 4, box.y + box.height / 2);
await p.waitForTimeout(120);
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 3, { steps: 8 });
await p.waitForTimeout(120);
await p.mouse.move(box.x + box.width - 4, box.y + box.height / 2, { steps: 8 });
await p.waitForTimeout(300);
const hov = await cos.evaluate(el => ({ inline: el.style.transform, bg: getComputedStyle(el).backgroundColor }));
const box2 = await cos.boundingBox();
/* A settled reveal legitimately leaves GSAP's own `translate(0px, 0px)`. What must NOT be there is a
   magnetic OFFSET, so parse the numbers and require them to be zero. */
const off = (hov.inline.match(/-?[\d.]+px/g) || []).map(v => Math.abs(parseFloat(v)));
chk(off.every(v => v < 0.5), 'FX-01 CoS button takes no magnetic offset on hover (' + (hov.inline || 'no inline transform') + ')');
chk(Math.abs(box2.y - top0) < 1, 'FX-01 CoS button does not move (' + top0.toFixed(1) + ' -> ' + box2.y.toFixed(1) + ')');
chk(/^rgb/.test(hov.bg), 'FX-01 hover feedback is colour only: ' + hov.bg);

// the magnetic effect must still work elsewhere, or "no jump" is indistinguishable from "feature dead"
const prim = p.locator('[data-cta="final_cta"]');
for (let i = 0; i < 60; i++) {
  const bb = await prim.boundingBox();
  if (bb && bb.y > 120 && bb.y < 600) break;
  await p.mouse.wheel(0, 500);
  await p.waitForTimeout(160);
}
await p.waitForTimeout(1200);
const pb = await prim.boundingBox();
/* Finish at the RIGHT EDGE MIDPOINT: a corner is outside a pill button's rounded shape, so the
   cursor "leaves" there, mouseleave resets the transform, and it reads as magnetism being dead. */
await p.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
await p.mouse.move(pb.x + pb.width - 3, pb.y + pb.height / 2, { steps: 8 });
await p.waitForTimeout(250);
const pt = await prim.evaluate(el => el.style.transform);
const poff = (pt.match(/-?[\d.]+px/g) || []).map(v => Math.abs(parseFloat(v)));
chk(poff.some(v => v > 1), 'FX-01 ordinary primary CTAs are still magnetic ("' + pt + '")');

console.log('\nJS errors:', errs.length ? errs : 'none');
console.log(fail ? `\nFIXES: ${fail} FAILURE(S)` : '\nFIXES: PASS');
await b.close();
process.exit(fail ? 1 : 0);
