import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AXE = fs.readFileSync(path.join(ROOT, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const EXE = 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe';
const routes = ['/', '/services', '/masjids', '/pricing', '/chief-of-staff', '/case-studies'];
const BASE = 'http://localhost:4173';

const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
const tally = new Map();
for (const r of routes) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(BASE + r, { waitUntil: 'networkidle2' });
  await p.addScriptTag({ content: AXE });
  const res = await p.evaluate(async () => {
    const out = await window.axe.run(document, { runOnly: ['color-contrast', 'aria-allowed-attr', 'heading-order', 'region'] });
    return out.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target.join(' '), summary: (n.failureSummary || '').replace(/\n/g, ' ').slice(0, 160), html: (n.html || '').slice(0, 120) })) }));
  });
  for (const v of res) {
    for (const n of v.nodes) {
      const key = `${v.id} | ${n.summary}`;
      if (!tally.has(key)) tally.set(key, { count: 0, example: n.target, html: n.html, routes: new Set() });
      const t = tally.get(key); t.count++; t.routes.add(r);
    }
  }
  await p.close();
}
await b.close();
console.log('\n=== AXE DETAIL (grouped) ===\n');
[...tally.entries()].sort((a, b2) => b2[1].count - a[1].count).slice(0, 22).forEach(([k, v]) => {
  console.log(`[${v.count}×] ${k}`);
  console.log(`      selector: ${v.example}`);
  console.log(`      html: ${v.html}`);
});
