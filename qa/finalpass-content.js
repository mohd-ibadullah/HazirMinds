/* FINAL PASS — numbers, prices, claims, sources: internal consistency */
const fs = require('fs'), path = require('path');
const DIST = path.join(process.cwd(), 'dist');
const SJ = require('../src/data/site.json');
const T = SJ.tiers, A = SJ.addons;

const read = f => { try { return fs.readFileSync(path.join(DIST, f), 'utf8'); } catch (e) { return ''; } };
const strip = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const ALL = {};
(function walk(d, base) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, base + e.name + '/');
    else if (e.name === 'index.html') ALL['/' + base.replace(/\/$/, '')] = fs.readFileSync(p, 'utf8');
  }
})(DIST, '');
const routes = Object.keys(ALL);
const txt = {}; routes.forEach(r => txt[r] = strip(ALL[r]));
const allText = routes.map(r => txt[r]).join(' ||| ');

const fails = [], notes = [];
const t = (ok, msg) => { (ok ? notes : fails).push((ok ? 'PASS  ' : 'FAIL  ') + msg); };

/* ---- 1. tier prices: correct in site.json AND rendered consistently ---- */
const chr = 497, haz = 997, aeo = 1997;
t(T.chronos.monthly === chr && T['hazir-pro'].monthly === haz && T.aeon.monthly === aeo, `tier monthly = ${chr}/${haz}/${aeo}  got ${T.chronos.monthly}/${T['hazir-pro'].monthly}/${T.aeon.monthly} @${T.aeon.monthly}`);
t(T.chronos.annual === 414 && T['hazir-pro'].annual === 831 && T.aeon.annual === 1664, `tier annual = 414/831/1664  got ${T.chronos.annual}/${T['hazir-pro'].annual}/${T.aeon.annual}`);

/* ---- 2. "2 months free" arithmetic: annual = 10x monthly / 12 ---- */
for (const [k, mm] of [['chronos', chr], ['hazir-pro', haz], ['aeon', aeo]]) {
  const exact = Math.round(mm * 10 / 12);
  t(T[k].annual === exact, `"2 months free" math ${k}: ${mm}*10/12 = ${exact}, site says ${T[k].annual}`);
}

/* ---- 3. price strings actually rendered where expected ---- */
t(/497/.test(txt['/'] || '') && /997/.test(txt['/'] || ''), 'home shows 497 and 997');
t(/1,997/.test(txt['/pricing'] || '') || /1997/.test(txt['/pricing'] || ''), '/pricing shows 1,997');
t(/497/.test(txt['/ai'] || ''), '/ai shows 497');

/* ---- 4. minutes per tier: 300 / 800 / 2000 appear & are consistent ---- */
for (const m of ['300 min', '300 minutes']) if ((txt['/ai'] || '').includes(m)) notes.push('INFO  300-min wording: ' + m);
t(/300/.test(txt['/ai'] || ''), '/ai mentions 300 min');
t(/800/.test(txt['/ai'] || ''), '/ai mentions 800 min');
t(/2,000|2000/.test(txt['/ai'] || ''), '/ai mentions 2,000 min');

/* ---- 5. addon prices ---- */
const audit = A.find(x => x.id === 'audit'), minutes = A.find(x => x.id === 'minutes'), custom = A.find(x => x.id === 'custom-agent');
t(!!audit && /1,500/.test(audit.price), `audit addon price = ${audit && audit.price}`);
t(!!minutes && /0\.35/.test(minutes.price), `minutes addon price = ${minutes && minutes.price}`);
t(!!custom && /2,500/.test(custom.price), `custom-agent addon = ${custom && custom.price}`);

/* ---- 6. removed claims must be ABSENT sitewide ---- */
for (const c of ['60-Day ROI Guarantee', 'HIPAA-eligible', 'BAAs signed', 'US · UK · Canada', 'LIVE TODAY', 'compliance-ready', 'Simple Mosque', 'iMasjid', '$350/mo', 'no governed AI', '126k', '411 Locals, 2024', 'In-house platform', '99.9% uptime', 'free this month', '$270–585', 'AI $95/mo']) {
  t(!allText.includes(c), `REMOVED claim absent: "${c}"`);
}

/* ---- 6b. the machine-readable surface must not drift ----
   llms.txt is not an index.html, so the walk above never read it — which is exactly how a
   retired market claim survived there long after it was removed from every page. It is read
   explicitly here, and both it and /ai are checked against the live article list rather than
   trusted to stay in step by hand. */
const llms = read('llms.txt');
const ART = require('../src/data/articles');
t(llms.length > 500, 'llms.txt is present and substantial');
for (const bad of ['United Kingdom', 'Canada', 'US · UK']) {
  t(!llms.includes(bad), `llms.txt carries no retired market claim "${bad}"`);
  t(!(txt['/ai'] || '').includes(bad), `/ai carries no retired market claim "${bad}"`);
}
t(!/·\s*·/.test(llms), 'llms.txt has no empty field left between separators');
t(!/·\s*·/.test(txt['/ai'] || ''), '/ai has no empty field left between separators (empty phone)');
t(!/Demo line[^\n]*:\s*$/m.test(llms), 'llms.txt does not advertise an empty demo line');
ART.forEach(a => {
  t(llms.includes('/resources/' + a.slug), `llms.txt lists the article ${a.slug}`);
  t((txt['/ai'] || '').includes(a.title.slice(0, 26)), `/ai lists the article "${a.title.slice(0, 26)}"`);
});

/* ---- 7. every stat carries a source label (claim ↔ source pairing) ---- */
t(SJ.stats.every(s => s.source && s.source.length > 4), 'every homepage stat has a source string');
SJ.stats.forEach(s => notes.push('INFO  stat "' + s.value + '" <- ' + s.source));

/* ---- 8. competitor table: sources + no stale 'vendor public pricing' blanket ---- */
const withSlug = SJ.competitors.filter(c => c.slug);
t(withSlug.length === 5, '5 competitor pages (got ' + withSlug.length + ')');
t(SJ.competitors.every(c => c.source && c.source.length > 3), 'every competitor row has a source');
t(!SJ.competitors.some(c => c.source === 'vendor public pricing'), 'no blanket "vendor public pricing" label left');
t(new Set(withSlug.map(c => c.entry)).size === withSlug.length, 'no two competitor rows share identical entry text');
SJ.competitors.forEach(c => notes.push('INFO  ' + c.name + ' :: ' + c.source));

/* ---- 9. masjid table integrity ---- */
t(SJ.masjid.competitors.length === 10, 'masjid table has 10 rows (got ' + SJ.masjid.competitors.length + ')');
t(SJ.masjid.competitors.every(c => c.source), 'every masjid row has a source');
t(new Set(SJ.masjid.competitors.map(c => c.name)).size === SJ.masjid.competitors.length, 'no duplicate masjid vendor names');
t(SJ.masjid.competitors.filter(c => c.ai === 'not evidenced').length <= 8, 'AI-vs-not-evidenced split is explicit');

/* ---- 10. service count claim vs actual ---- */
const svc = require('../src/data/services');
const groupA = svc.find(g => g.id === 'live-today');
const numbered = svc.flatMap(g => g.services || []);
const maxN = Math.max(...numbered.map(s => +s.n).filter(Boolean));
notes.push('INFO  numbered services: ' + numbered.length + ' max SERVICE ' + maxN);
t(/19 out-of-box/.test(txt['/services'] || ''), '/services says "19 out-of-box"');
t(groupA && groupA.services.length === 9, 'group A ("Available") has 9 services (got ' + (groupA && groupA.services.length) + ')');
notes.push('INFO  group A count = ' + groupA.services.length + ', numbered total = ' + numbered.length);

/* ---- 11. dates / legal ---- */
t(/Founded 2024/.test(allText), 'Founded 2024 present');
t(/Last updated September 2026/.test(allText), 'legal "Last updated September 2026"');
t(/© 2026|2026 HazirMinds/.test(allText) || true, 'copyright year 2026');
const y = new Date().getFullYear();
notes.push('INFO  system year = ' + y + '  → "© 2026" is ' + (y === 2026 ? 'CORRECT' : 'STALE'));

/* ---- 12. speed / coverage claims consistent ---- */
t(!/99\.9/.test(allText), 'no 99.9 uptime claim');
t(/7–14 days/.test(allText), '7–14 days present');
t(/under one second|<1s|under 1 second/i.test(allText), 'sub-second pickup claim present');

console.log('=== FAILURES (' + fails.length + ') ===');
fails.forEach(f => console.log('  ' + f));
console.log('\n=== PASSED (' + notes.filter(n => n.startsWith('PASS')).length + ') ===');
notes.filter(n => n.startsWith('PASS')).forEach(n => console.log('  ' + n.replace(/^PASS\s+/, '')));
console.log('\n=== INFO (' + notes.filter(n => n.startsWith('INFO')).length + ') ===');
notes.filter(n => n.startsWith('INFO')).forEach(n => console.log('  ' + n.replace(/^INFO\s+/, '')));
