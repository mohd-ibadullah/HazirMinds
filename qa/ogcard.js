// Regenerate og-card.jpg (1200x630) with HazirMinds wordmark
const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;width:1200px;height:630px;background:#14110E;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
    .glow{position:absolute;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(185,138,46,.14) 0%,transparent 60%);top:-200px;right:-200px}
    .glow2{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(198,65,16,.10) 0%,transparent 60%);bottom:-250px;left:-150px}
    .wrap{text-align:center;position:relative}
    .mark{width:96px;height:96px;border-radius:24px;background:#0F0D0B;border:1.5px solid rgba(185,138,46,.6);color:#B98A2E;font-size:52px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;letter-spacing:0}
    h1{color:#FAF7F2;font-size:88px;font-weight:800;letter-spacing:-.035em;margin:26px 0 10px}
    h1 em{font-style:normal;color:#B98A2E}
    .tag{color:rgba(250,247,242,.72);font-size:30px;font-weight:500;letter-spacing:-.01em}
    .hair{width:120px;height:2px;background:#B98A2E;margin:30px auto 0}
    .dom{color:rgba(185,138,46,.9);font-family:ui-monospace,Menlo,monospace;font-size:17px;letter-spacing:.18em;margin-top:22px;text-transform:uppercase}
    .band{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#C64110,#B98A2E)}
  </style></head><body>
  <div class="band"></div><div class="glow"></div><div class="glow2"></div>
  <div class="wrap">
    <span class="mark">H</span>
    <h1>Hazir<em>Minds</em></h1>
    <div class="tag">Always present. Never missed.</div>
    <div class="hair"></div>
    <div class="dom">hazirminds.ai</div>
  </div>
  </body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'img', 'og-card.jpg'), type: 'jpeg', quality: 90 });
  await browser.close();
  console.log('og-card.jpg regenerated (1200x630)');
})().catch(e => { console.error('CRASH:', e.message); process.exit(2); });
