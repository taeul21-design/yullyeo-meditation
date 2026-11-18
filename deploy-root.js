// deploy-root: serve app from site ROOT too (PWABuilder-friendly), keep dist copy
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const root = 'C:/yullyeo-meditation/';
const dist = 'C:/yullyeo-meditation/dist/';
function run(cmd) {
  try { const out = execSync(cmd, { cwd: 'C:/yullyeo-meditation', encoding: 'utf8', timeout: 90000 }); console.log(cmd.slice(0, 40), '=>', (out || '').trim().slice(0, 300)); }
  catch (e) { console.log(cmd, 'ERROR:', (e.stderr || e.message || '').toString().slice(0, 300)); process.exit(1); }
}
// 1) copy app files to repo root (overwrite old stub index.html)
for (const f of ['index.html', 'style.css', 'app.js', 'practice.js', 'pwa.js', 'sw.js', 'manifest.webmanifest']) {
  fs.copyFileSync(dist + f, root + f);
}
for (const dir of ['icons', 'audio']) {
  fs.mkdirSync(root + dir, { recursive: true });
  for (const f of fs.readdirSync(dist + dir)) fs.copyFileSync(dist + dir + '/' + f, root + dir + '/' + f);
}
console.log('copied app files to repo root');
// 2) sanity: root index must reference manifest
if (!fs.readFileSync(root + 'index.html', 'utf8').includes('manifest.webmanifest')) { console.log('FAIL: root index missing manifest link'); process.exit(1); }
console.log('root index has manifest link');
// 3) commit + push
run('git add -A');
run('git commit -m "serve app at site root for PWABuilder analysis"');
run('git push origin main');
run('git ls-remote origin main');
console.log('ROOT DEPLOY DONE');
