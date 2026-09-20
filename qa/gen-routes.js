/* Regenerate qa/routes.txt from dist/ so the contrast harness can never drift from the build.
   Run after every build: node qa/gen-routes.js */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const out = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') {
      const rel = p.slice(DIST.length).split(path.sep).join('/');
      out.push(rel === '/index.html' ? '/' : rel.replace(/\/index\.html$/, '/'));
    }
  }
})(DIST);
out.sort();
fs.writeFileSync(path.join(__dirname, 'routes.txt'), out.join(' ') + '\n');
console.log('routes.txt regenerated: ' + out.length + ' routes');
