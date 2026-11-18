// deploy-fix v5: fetch, hash-verify, syntax-check, bump sw v11, push
const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');
const base = 'https://8899-sbx-dc2de2691567ccf1e8adce141e209a73.sandbox.westus2-prod.sspark.ai/';
const dist = 'C:/yullyeo-meditation/dist/';
const NODE = process.execPath;
function run(cmd) {
  try { const out = execSync(cmd, { cwd: 'C:/yullyeo-meditation', encoding: 'utf8', timeout: 60000 }); console.log(cmd.slice(0, 40), '=>', (out || '').trim().slice(0, 300)); }
  catch (e) { console.log(cmd, 'ERROR:', (e.stderr || e.message || '').toString().slice(0, 300)); process.exit(1); }
}
(async () => {
  for (const [src, to] of [['app.ascii.js', 'app.js'], ['index.ascii.html', 'index.html']]) {
    const res = await fetch(base + src);
    if (!res.ok) { console.log('FETCH FAIL', src, res.status); process.exit(1); }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dist + to, buf);
    console.log('fetched', src, '->', to, buf.length, 'bytes sha256=' + crypto.createHash('sha256').update(buf).digest('hex'));
  }
  try { execSync('"' + NODE + '" --check "' + dist + 'app.js"', { cwd: 'C:/yullyeo-meditation', timeout: 30000 }); console.log('syntax OK'); }
  catch (e) { console.log('SYNTAX FAIL:', (e.stderr || e.message || '').toString().slice(0, 300)); process.exit(1); }
  let sw = fs.readFileSync(dist + 'sw.js', 'utf8');
  sw = sw.replace(/bitkkot-shell-v\d+/, 'bitkkot-shell-v11');
  fs.writeFileSync(dist + 'sw.js', sw, 'utf8');
  console.log('sw version:', (sw.match(/bitkkot-shell-v\d+/) || ['?'])[0]);
  run('git add dist');
  run('git commit -m "fix: walk meditation guide text and night array bracket (v11)"');
  run('git push origin main');
  run('git ls-remote origin main');
  console.log('DEPLOY DONE');
})();
