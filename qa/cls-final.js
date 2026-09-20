const puppeteer = require('puppeteer-core');
const EXE = 'C:/Users/froms/.cache/puppeteer/chrome/win64-153.0.8010.36/chrome-win64/chrome.exe';
const routes = ['/', '/about', '/case-studies', '/chief-of-staff', '/compare', '/demo', '/industries', '/masjids', '/privacy', '/services', '/terms', '/industries/automotive-fleet', '/industries/beauty-wellness-personal-care'];
const vps = [{ n: '1440', w: 1440, h: 900 }, { n: '1024', w: 1024, h: 900 }, { n: '768', w: 768, h: 1024 }, { n: '390', w: 390, h: 844 }];
(async () => {
  const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
  const worst = {};
  for (const vp of vps) {
    const p = await b.newPage();
    /* observer installed ONCE per page (outside the route loop) — installing inside stacks observers */
    await p.evaluateOnNewDocument(() => {
      try { localStorage.setItem('hazirminds_consent', 'essential'); localStorage.setItem('hazirminds_motion', 'on'); } catch (e) {}
      window.__cls = 0; window.__mx = null;
      try {
        new PerformanceObserver(l => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) {
            window.__cls += e.value;
            if (!window.__mx || e.value > window.__mx.v) window.__mx = { v: +e.value.toFixed(4), src: (e.sources || []).map(s => String((s.node && s.node.className) || (s.node && s.node.nodeName) || '?').slice(0, 28)) };
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}
    });
    await p.setViewport({ width: vp.w, height: vp.h });
    for (const r of routes) {
      await p.goto('http://localhost:4173' + r, { waitUntil: 'networkidle2', timeout: 60000 });
      for (let y = 0; y < 8; y++) { await p.evaluate(s => window.scrollTo(0, s * 800), y); await new Promise(z => setTimeout(z, 150)); }
      await new Promise(z => setTimeout(z, 700));
      const c = await p.evaluate(() => ({ t: +(window.__cls || 0).toFixed(4), mx: window.__mx }));
      if (!worst[r] || c.t > worst[r].t) worst[r] = { t: c.t, at: vp.n, mx: c.mx };
    }
    await p.close();
  }
  const rows = Object.entries(worst).sort((a, b2) => b2[1].t - a[1].t);
  console.log('=== worst CLS per route (' + routes.length + ' routes x 4 widths) ===');
  for (const [r, v] of rows) console.log(`  ${String(v.t).padStart(7)}  @${String(v.at).padEnd(5)} ${r}${v.mx ? '   max=' + JSON.stringify(v.mx) : ''}`);
  const g = rows[0];
  console.log(`\n  WORST = ${g[1].t} at ${g[0]}@${g[1].at}`);
  console.log('  routes over 0.10 (needs improvement): ' + rows.filter(x => x[1].t > 0.10).length);
  console.log('  routes over 0.25 (poor): ' + rows.filter(x => x[1].t > 0.25).length);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(2); });
