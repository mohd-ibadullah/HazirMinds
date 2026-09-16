/* FINAL PASS — structural integrity across all built pages */
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
})(DIST);

const routeOf = f => { const r = f.replace(DIST, '').replace(/\\/g, '/').replace(/\/index\.html$/, ''); return r || '/'; };
const exists = r => {
  const clean = r.split('#')[0].split('?')[0];
  let f = path.join(DIST, clean.replace(/^\//, ''));
  if (clean.endsWith('/') || clean === '') f = path.join(f, 'index.html');
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return true;
  if (fs.existsSync(path.join(f, 'index.html'))) return true;
  if (fs.existsSync(f + '.html')) return true;
  return false;
};

const idsByRoute = {};
const raw = {};
for (const f of pages) {
  const r = routeOf(f);
  raw[r] = fs.readFileSync(f, 'utf8');
  idsByRoute[r] = new Set([...raw[r].matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
}

const problems = { deadLinks: [], deadAnchors: [], dupIds: [], imgIssues: [], headingIssues: [], metaDup: { title: {}, desc: {} }, altMissing: [] };

for (const f of pages) {
  const r = routeOf(f);
  const h = raw[r];

  /* duplicate ids */
  const all = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const seen = {}, dup = [];
  for (const id of all) { if (seen[id]) dup.push(id); seen[id] = 1; }
  if (dup.length) problems.dupIds.push(r + ' -> ' + [...new Set(dup)].join(', '));

  /* links */
  for (const m of h.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(href)) continue;
    const [pth, anc] = href.split('#');
    if (pth && !exists(pth)) problems.deadLinks.push(r + ' -> ' + href);
    if (anc) {
      const target = pth ? (pth.replace(/\/$/, '') || '/') : r;
      if (idsByRoute[target] && !idsByRoute[target].has(anc)) problems.deadAnchors.push(r + ' -> ' + href);
      else if (!idsByRoute[target]) problems.deadAnchors.push(r + ' -> ' + href + '  (target page not found)');
    }
  }

  /* images */
  for (const m of h.matchAll(/<img\b[^>]*>/g)) {
    const t = m[0];
    const src = (t.match(/src="([^"]+)"/) || [])[1];
    if (!/width="/.test(t) || !/height="/.test(t)) problems.imgIssues.push(r + ' missing dims: ' + String(src).slice(0, 50));
    if (!/alt=/.test(t)) problems.altMissing.push(r + ' -> ' + String(src).slice(0, 50));
    if (src && !/^https?:/.test(src)) {
      const f2 = path.join(DIST, src.replace(/^\//, ''));
      if (!fs.existsSync(f2)) problems.imgIssues.push(r + ' MISSING FILE: ' + src);
    }
  }

  /* headings */
  const hs = [...h.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  const h1n = hs.filter(x => x === 1).length;
  if (h1n !== 1) problems.headingIssues.push(r + ' h1 count = ' + h1n);
  for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) { problems.headingIssues.push(r + ' skips h' + hs[i - 1] + '->h' + hs[i]); break; }

  /* meta */
  const ti = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const de = (h.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  if (!problems.metaDup.title[ti]) problems.metaDup.title[ti] = [];
  problems.metaDup.title[ti].push(r);
  if (!problems.metaDup.desc[de]) problems.metaDup.desc[de] = [];
  problems.metaDup.desc[de].push(r);
}

const P = (label, arr) => {
  console.log('\n### ' + label + '  (' + arr.length + ')');
  arr.slice(0, 14).forEach(x => console.log('   ' + x));
  if (arr.length > 14) console.log('   … +' + (arr.length - 14) + ' more');
};

console.log('pages audited: ' + pages.length);
P('DEAD INTERNAL LINKS', problems.deadLinks);
P('DEAD ANCHORS', problems.deadAnchors);
P('DUPLICATE IDs', problems.dupIds);
P('IMAGE ISSUES', problems.imgIssues);
P('MISSING alt', problems.altMissing);
P('HEADING ISSUES', problems.headingIssues);
P('DUPLICATE TITLES', Object.entries(problems.metaDup.title).filter(([k, v]) => v.length > 1).map(([k, v]) => v.join(', ') + '  ::  ' + k.slice(0, 60)));
P('DUPLICATE DESCRIPTIONS', Object.entries(problems.metaDup.desc).filter(([k, v]) => v.length > 1).map(([k, v]) => v.join(', ') + '  ::  ' + k.slice(0, 60)));
const empty = Object.entries(problems.metaDup.desc).filter(([k]) => !k.trim()).map(([, v]) => v.join(', '));
P('EMPTY DESCRIPTIONS', empty);
