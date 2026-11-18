// add + commit + push + 원격 확인
const { execSync } = require('child_process');
const run = (cmd) => {
  try { const out = execSync(cmd, { cwd: 'C:/yullyeo-meditation', encoding: 'utf8', timeout: 30000 }); console.log(cmd, '=>', (out || '').trim().slice(0, 400)); }
  catch (e) { console.log(cmd, 'ERROR:', (e.stderr || e.message || '').toString().slice(0, 400)); process.exit(1); }
};
run('git add dist');
run('git commit -m "도공음악 3곡 내장, 걷기 명상 모드와 저녁 수면 명상 추가"');
console.log('--- pushing ---');
try { const out = execSync('git push origin main', { cwd: 'C:/yullyeo-meditation', encoding: 'utf8', timeout: 120000 }); console.log('push =>', (out || '').trim().slice(0, 400)); }
catch (e) { console.log('push ERROR:', (e.stderr || e.message || '').toString().slice(0, 400)); process.exit(1); }
run('git ls-remote origin main');
run('git log --oneline -2');
console.log('GIT DONE');
