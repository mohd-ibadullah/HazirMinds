import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXE = 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe';
const HTML = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;width:180px;height:180px}
  .ic{width:180px;height:180px;background:linear-gradient(160deg,#14110E 0%,#0F0D0B 70%);display:flex;align-items:center;justify-content:center;position:relative}
  .ic::after{content:"";position:absolute;inset:14px;border:2px solid #B98A2E;border-radius:26px}
  .t{font:800 96px/1 "Segoe UI",system-ui,sans-serif;color:#B98A2E;letter-spacing:-3px}
</style>
<div class="ic"><span class="t">H</span></div>`;

const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
await p.setContent(HTML, { waitUntil: 'load' });
const buf = await p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 180, height: 180 } });
fs.writeFileSync(path.join(ROOT, 'img', 'apple-touch-icon.png'), buf);
console.log('wrote img/apple-touch-icon.png', buf.length, 'bytes');
await b.close();
