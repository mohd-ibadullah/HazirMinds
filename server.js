// HazirMinds — static file server for local QA (node server.js [port])
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = parseInt(process.argv[2] || '4173', 10);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(DIST, p);
  if (!path.normalize(file).startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    const clean = p.replace(/\.html$/, '') + '.html';
    if (fs.existsSync(path.join(DIST, clean))) file = path.join(DIST, clean);
    else { file = path.join(DIST, '404.html'); res.statusCode = 404; }
  }
  res.writeHead(res.statusCode === 404 ? 404 : 200, {
    'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('QA server on http://localhost:' + PORT));
