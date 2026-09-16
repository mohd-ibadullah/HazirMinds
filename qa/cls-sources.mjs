import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXE = 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe';
const routes = ['/', '/compare', '/pricing', '/masjids'];
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
for (const r of routes) {
  const p = await b.newPage();
  await p.evaluateOnNewDocument(() => {
    window.__shifts = [];
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__shifts.push({
          value: +e.value.toFixed(4), start: e.startTime | 0,
          sources: (e.sources || []).map(s => ({
            node: s.node ? (s.node.nodeName + '.' + (s.node.className || '').toString().split(' ')[0].slice(0, 30)) : '?',
            prev: s.previousRect ? `${Math.round(s.previousRect.x)},${Math.round(s.previousRect.y)} ${Math.round(s.previousRect.width)}x${Math.round(s.previousRect.height)}` : '',
            cur: s.currentRect ? `${Math.round(s.currentRect.x)},${Math.round(s.currentRect.y)} ${Math.round(s.currentRect.width)}x${Math.round(s.currentRect.height)}` : ''
          }))
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto('http://localhost:4173' + r, { waitUntil: 'networkidle2', timeout: 30000 });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) { await p.evaluate(v => window.scrollTo(0, v), y); await new Promise(res => setTimeout(res, 120)); }
  await new Promise(res => setTimeout(res, 1500));
  const out = await p.evaluate(() => ({ total: +(window.__shifts.reduce((a, s) => a + s.value, 0)).toFixed(4), top: window.__shifts.sort((a, c) => c.value - a.value).slice(0, 5) }));
  console.log(`\n=== ${r} — CLS ${out.total}`);
  out.top.forEach(s => console.log(`  [${s.value}] t=${s.start}ms`, s.sources.map(x => `${x.node} ${x.prev} → ${x.cur}`).join(' | ')));
  await p.close();
}
await b.close();
