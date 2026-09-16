import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AXE = fs.readFileSync(path.join(ROOT, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const EXE = 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe';
const routes = ['/', '/services', '/masjids', '/chief-of-staff', '/pricing', '/compare'];
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
for (const r of routes) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto('http://localhost:4173' + r, { waitUntil: 'networkidle2' });
  await p.addScriptTag({ content: AXE });
  const res = await p.evaluate(async () => {
    const o = await window.axe.run(document, { runOnly: ['color-contrast', 'aria-allowed-attr', 'heading-order'] });
    return o.violations.map(v => ({ id: v.id, imp: v.impact, n: v.nodes.map(x => ({ t: x.target.join(' '), h: x.html.slice(0, 120), s: (x.failureSummary || '').replace(/\n/g, ' ').slice(0, 100) })) }));
  });
  if (res.length) {
    console.log('--- ' + r);
    res.forEach(v => v.n.slice(0, 3).forEach(n => console.log(`   [${v.id}] ${n.t}\n       ${n.h}\n       ${n.s}`)));
  }
  await p.close();
}
await b.close();
