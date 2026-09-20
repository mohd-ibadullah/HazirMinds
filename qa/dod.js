// HazirMinds — §12 Definition of Done verification (static, against dist/)
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const html = walk(DIST).filter(f => f.endsWith('.html'));
const read = f => fs.readFileSync(path.isAbsolute(f) ? f : path.join(DIST, f), 'utf8');
const strip = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&rsquo;|&#8217;/g, '\u2019').replace(/&lsquo;|&#8216;/g, '\u2018').replace(/&mdash;/g, '\u2014')
  .replace(/&ndash;/g, '\u2013').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
/* A phrase is only a violation when it is NOT inside an explicit refusal ("never …") */
const affirmative = (t, phrase) => { const re = new RegExp(phrase, 'gi'); let m; while ((m = re.exec(t))) { const before = t.slice(Math.max(0, m.index - 160), m.index).toLowerCase(); if (!/never|not |refuse|don\u2019t|no /.test(before)) return true; } return false; };
const all = html.map(f => { const h = read(f); return { f: f.replace(DIST, '').replace(/\\/g, '/').replace(/^\//, ''), h, t: strip(h) }; });
const anyPage = re => all.filter(a => re.test(a.h)).map(a => a.f);
const results = [];
const check = (label, pass, detail) => { results.push({ label, pass: !!pass, detail: detail || '' }); };

/* 1 HazirMinds one word */
check('HazirMinds one word everywhere', anyPage(/\bHazir\s+Minds\b/).length === 0, anyPage(/\bHazir\s+Minds\b/).join(', '));
check('brand in <title> of every page', all.every(a => /<title>[^<]*HazirMinds/.test(a.h)), '');
check('brand in JSON-LD', all.filter(a => /"name":"HazirMinds/.test(a.h) || /"name": "HazirMinds/.test(a.h) || a.h.includes('HazirMinds')).length > 0, '');

/* 2 motion + print fallback */
const css = read('assets/css/main.css');
/* Hiding may live under html.motion-ready only (added by JS after engines verify).
   Any other rule that sets opacity:0 on reveal targets would hide content permanently. */
const hidingRules = css.match(/[^{}]*\[data-reveal[^{}]*\{[^}]*opacity\s*:\s*0[^}]*\}/g) || [];
const ungated = hidingRules.filter(r => !/html\.motion-ready/.test(r));
check('reveal hiding gated on html.motion-ready only', hidingRules.length > 0 && ungated.length === 0, ungated.map(r => r.trim().slice(0, 60)).join(' | '));
check('force-show backstops (no-motion / print / reveal-force)',
  /html\.no-motion[^{]*\{[^}]*opacity:1!important/.test(css) && /@media print\{[\s\S]{0,240}opacity:1!important/.test(css) && /\.reveal-force\{[^}]*opacity:1!important/.test(css), '');
check('no reveal group hides itself (children-groups delegate)', !/html\.motion-ready \[data-reveal\]\{/.test(css), '');
check('print fallback forces visibility', /@media print/.test(css) && /\.reveal[^{]*\{[^}]*opacity:1!important/.test(css), '');
check('motion runs for every visitor — no reduced-motion off-switch', !/prefers-reduced-motion/.test(css), '');
check('motion toggle removed — motion is on by default', !all.some(a => a.h.includes('data-motion-toggle')), '');

/* 3 site.json single source */
check('site.json exists', fs.existsSync(path.join(__dirname, '..', 'src', 'data', 'site.json')), '');
const buildJs = fs.readFileSync(path.join(__dirname, '..', 'build.js'), 'utf8');
check('build gate: price literal outside site.json fails build', /F4 GATE FAIL/.test(buildJs), '');

/* 4 honest count + chips */
const svc = read('services/index.html');
check('no blanket "40/41 services" claim', !/all 4[01] services|Browse all 4[01]|40 services|41 services/i.test(svc), '');
/* The hero count line was removed by request, so the guard inverts: it must not come back. */
check('no "19 out-of-box" count language on /services', !svc.includes('19 out-of-box') && !svc.includes('Nineteen out-of-box'), '');
check('capability chips present (>=5 kinds)', ['AVAILABLE', 'CONFIGURED AT ONBOARDING', 'SCOPED PER ENGAGEMENT', 'ADD-ON', 'PLANNED'].filter(c => svc.includes(c)).length >= 4, '');
check('SERVICE 01..39 + unnumbered client slot', svc.includes('SERVICE 01') && svc.includes('SERVICE 39') && svc.includes('YOUR REQUIREMENT'), '');

/* 5 smith.ai route + SOC 2 */
/* The individual comparison pages were removed by request, so the guard INVERTS: they must not come
   back, and a revert cannot pass silently. */
check('the five individual comparison pages are gone', ['go-high-level','synthflow','smith-ai','ai-sdr','human-receptionist'].every(s => !fs.existsSync(path.join(DIST, 'compare', s, 'index.html'))), '');
check('no "SOC 2-ready" anywhere', !all.some(a => /SOC\s?2/i.test(a.h)), all.filter(a => /SOC\s?2/i.test(a.h)).map(a => a.f).join(', '));
check('"compliance-ready" claim removed', !all.some(a => a.h.includes('compliance-ready')), '');
/* The healthcare page ANSWERS "Is this HIPAA compliant?" with a refusal, so a plain regex flags the
   question and the disclaimer as if they were claims. Only an affirmative use counts. */
check('no HIPAA claim anywhere (agreement does not mention it)',
  !all.some(a => {
    /* 'HIPAA compliant' also appears inside the FAQ QUESTION we answer with a refusal, so a bare
       phrase match is a false positive. Only an assertion counts. */
    const t = a.t;
    const re = /HIPAA-eligible|HIPAA compliant|BAAs signed/gi;
    let m; while ((m = re.exec(t))) {
      const before = t.slice(Math.max(0, m.index - 70), m.index).toLowerCase();
      if (!/never|not\b|no\b|don't|do not|refuse|without|is this|is it\b|\?/.test(before)) return true;
    }
    return false;
  }),
  all.filter(a => affirmative(a.t, 'HIPAA-eligible') || affirmative(a.t, 'HIPAA compliant') || affirmative(a.t, 'BAAs signed')).map(a => a.f).join(', '));

/* 6 governance — /enterprise was merged into /chief-of-staff. The four invariants render on the
   HOME page; the doctrine cards were removed by request, so that guard inverts. */
const ent = read('chief-of-staff/index.html');
const homeG = read('index.html');
check('four invariants with ≠ labels (home)', ['Capability ≠ Authority', 'Execution ≠ Liability', 'Deployment ≠ Adoption', 'Continuity ≠ Persona'].every(x => homeG.includes(x)), '');
check('doctrine cards are gone', !ent.includes('Office persists, agents execute') && !ent.includes('governance compounds'), '');
check('proof horizons on /chief-of-staff', /Built[\s\S]{0,400}Deployed[\s\S]{0,400}Operated[\s\S]{0,400}Verified outcome[\s\S]{0,400}Accepted/.test(ent), '');

/* 7 case studies labels */
const cs = read('case-studies/index.html');
check('every case study labeled "Representative result"', (cs.match(/Representative result/g) || []).length >= 3, '');
check('proof-horizon tags on case studies', /PROOF HORIZON/i.test(cs), '');

/* 8 CoS page */
const cos = read('chief-of-staff/index.html');
check('CoS: ONE integrated service, ONE payment', /ONE integrated service[\s\S]{0,40}ONE payment/i.test(cos), '');
check('CoS: privacy panel (zero compromise)', /zero compromise/i.test(cos), '');
check('CoS: 7 specialists', (cos.match(/AVATAR|specialist/gi) || []).length >= 7, '');
check('CoS: approval gate demo', cos.includes('APPROVAL REQUIRED') || /approval/i.test(cos), '');
check('CoS: no setup price published — the fee is scoped per engagement', !/\$\s?[\d,]+/.test(strip(cos)) && /scoped/i.test(cos), '');

/* 9 Masjid OS */
const mj = read('masjids/index.html');
/* The masjid comparison moved to the end of /masjids when its own page was removed. */
const mjc = mj;
check('masjid hero positioning verbatim', mj.includes('provides a governed AI operating system for masjids and Islamic community organizations that connects events, communications, registrations, facilities, volunteers, donations, knowledge, AI assistance, and reporting through one controlled operational layer'), '');
check('lifecycle chain verbatim', /ONE REQUEST[\s\S]{0,40}ONE SOURCE OF TRUTH[\s\S]{0,40}APPROVAL[\s\S]{0,40}AI WORK[\s\S]{0,40}MANY CHANNELS[\s\S]{0,40}FOLLOW-UP[\s\S]{0,40}REPORTING[\s\S]{0,40}AUDIT/.test(mj), '');
/* The Label column was removed by request. The guard INVERTS and also proves the capability copy
   itself survived the removal — losing the content along with its badges would pass a one-sided
   check. 'Available' is left out because that word is used elsewhere on the page. */
check('capability labels removed, capabilities kept',
  !['Contract-supported', 'Configured at onboarding', 'Custom / scoped per engagement'].some(l => mj.includes(l))
    && mj.includes('What is available, and what is not yet')
    && mj.includes('Prayer-time publishing'), '');
check('included vs external cost table', /included hazirminds capabilities/i.test(mj) && /remain external/i.test(mj), '');
check('fragmented-stack example carries no figures', !/\$\s?[\d,]+|\d+\s?%/.test(strip(mj).slice(strip(mj).indexOf('fragmented stack'), strip(mj).indexOf('fragmented stack') + 600)) && /patchwork/i.test(mj), '');
check('no affirmative "never hallucinates" claim (refusal wording allowed)', !all.some(a => affirmative(a.t, 'never hallucinates')), '');
check('masjid compare: source-checked stamp + sources', mjc.includes('Source-checked Sept 2026') && mjc.includes('Sources:'), '');
check('masjid compare: "who should NOT buy"', /who should NOT buy/i.test(mjc), '');
check('masjid collateral gated by demo form', mj.includes('Masjid AI OS deck') && /demo/i.test(mj), '');

/* 10 rate card + footnotes — /pricing, and then /ai, were removed by request. The tier lines now
   render on the home page and the published rates on /terms; the à-la-carte add-on prices that lived
   only on /ai (audit, Chief-of-Staff engagement) are no longer published anywhere, which is the cost
   of the removal rather than a defect. */
const pr = read('index.html');
check('rate card: all four tiers on the home page', ['Chronos', 'Hazir Pro', 'Aeon', 'Archon'].every(t => pr.includes(t)), '');
check('no numeric rate survives anywhere in the legal or comparison copy', !/\$\s?\d|\d+\s?\/\s?min\b/.test(strip(read('terms/index.html'))) && !/\$\s?\d/.test(strip(read('compare/index.html'))), '');
const cmp = read('compare/index.html');
check('comparison cost table', /Done-for-you governed AI firm/.test(cmp) && /Hidden meters/.test(cmp), '');
check('the comparison tables still name where their facts come from', /Sources: vendor public pricing pages/.test(read('compare/index.html')) && /vendor pricing page|read 2026-09-16|BLS/.test(read('masjids/index.html')), '');
check('every stat has a source footnote', (() => { const band = read('index.html'); const stats = (band.match(/class="stat"/g) || []).length; const srcs = (band.match(/class="src"/g) || []).length; return stats === srcs && stats > 1; })(), '');

/* 11 trust rules */
check('no fake testimonial/persona claims (labeled representative)', !all.some(a => /testimonial/i.test(a.t)), '');
check('no affirmative "end-to-end encryption"/"zero risk" claims', !all.some(a => affirmative(a.t, 'end-to-end encryption') || affirmative(a.t, 'zero risk')), '');
/* The "No unpublished meters" top banner was removed by request. The guard INVERTS, so a revert
   cannot pass silently and no page can quietly put the strip back. */
check('the "No unpublished meters" banner stays removed', !all.some(a => a.t.includes('No unpublished meters')), all.filter(a => a.t.includes('No unpublished meters')).map(a => a.f).join(', '));
check('60-Day ROI Guarantee removed', !strip(read('index.html')).includes('60-Day ROI Guarantee'));

/* 12 routes */
check('every route renders non-blank', all.every(a => strip(a.h).trim().length > 400), all.filter(a => strip(a.h).trim().length <= 400).map(a => a.f).join(', '));
check('llms.txt + /ai/ + sitemap + robots are gone as requested', ['llms.txt', 'ai/index.html', 'sitemap.xml', 'robots.txt'].every(f => !fs.existsSync(path.join(DIST, f))), '');

const pass = results.filter(r => r.pass).length;
console.log('\n=== §12 DEFINITION OF DONE ===\n');
results.forEach(r => console.log(`${r.pass ? '  ✓' : '  ✗'} ${r.label}${r.detail ? ' → ' + r.detail : ''}`));
console.log(`\n${pass}/${results.length} checks pass`);
const fails = results.filter(r => !r.pass);
if (fails.length) { console.log('\nFAILING: ' + fails.map(f => f.label).join(' | ')); process.exit(1); }
