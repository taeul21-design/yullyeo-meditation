// patch4: 도공음악 3곡 내장 + 걷기 명상 + 저녁 수면 명상 (앵커 실측 검증판)
// 사용법: C:\yullyeo-meditation 에서  node patch4.js
const fs = require('fs');
function patch(path, oldS, newS) {
  let src = fs.readFileSync(path, 'utf8');
  if (src.includes(newS)) { console.log(path, 'ALREADY-PATCHED'); return; }
  const count = src.split(oldS).length - 1;
  if (count !== 1) { console.log('FAIL', path, 'MATCH-COUNT', count, JSON.stringify(oldS.slice(0, 50))); process.exit(1); }
  fs.writeFileSync(path, src.replace(oldS, newS), 'utf8');
  console.log(path, 'OK');
}
const base = 'C:/yullyeo-meditation/dist/';
const audioSrc = 'C:/Users/taeul/AppData/Roaming/gensparkaio/workspace/yullyeo-audio/';

// ===== 0) 도공음악 3곡 복사 =====
for (const f of ['dogong', 'sichonjuju', 'taeulju']) {
  const to = base + 'audio/' + f + '.mp3';
  if (!fs.existsSync(to)) { fs.copyFileSync(audioSrc + f + '.mp3', to); console.log('copied', f + '.mp3'); }
  else console.log(f + '.mp3 exists');
}

// ===== 1) 도공 내장 음원: 기본 음원 지정 =====
patch(base + 'practice.js',
  "dogong: {\r\n    source: '',",
  "dogong: {\r\n    source: 'audio/dogong.mp3',");

// ===== 2) 도공 내장 음원: 3곡 선택 버튼 동작 =====
patch(base + 'practice.js',
  "document.getElementById('dogongOpen').onclick = () => openListening('dogong');",
  "document.getElementById('dogongOpen').onclick = () => openListening('dogong');\n" +
  "document.querySelectorAll('#dogongTracks [data-dogong]').forEach(button => button.onclick = () => {\n" +
  "  listeningAudio.pause();\n" +
  "  listeningAudio.src = button.dataset.dogong;\n" +
  "  document.getElementById('listeningFile').value = '';\n" +
  "  document.querySelectorAll('#dogongTracks [data-dogong]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });\n" +
  "  listeningAudio.play().catch(() => { listeningStatus.textContent = '\\uc7ac\\uc0dd \\ubc84\\ud2bc\\uc744 \\ub20c\\ub7ec \\uc8fc\\uc138\\uc694.'; });\n" +
  "});");

// ===== 3) 도공 대화상자에 내장 음악 선택 UI 추가 =====
patch(base + 'index.html',
  '<label>\ub3c4\uacf5\uc74c\uc545 \ud30c\uc77c <input id="listeningFile" type="file" accept="audio/*"></label>',
  '<div class="durations" id="dogongTracks" role="group" aria-label="\ub0b4\uc7a5 \ub3c4\uacf5\uc74c\uc545 \uc120\ud0dd"><button data-dogong="audio/dogong.mp3" class="selected" aria-pressed="true">\ub3c4\uacf5\uc74c\uc545</button><button data-dogong="audio/sichonjuju.mp3" aria-pressed="false">\uc2dc\ucc9c\uc8fc\uc8fc</button><button data-dogong="audio/taeulju.mp3" aria-pressed="false">\ud0dc\uc744\uc8fc\uc8fc</button></div><label>\ub3c4\uacf5\uc74c\uc545 \ud30c\uc77c <input id="listeningFile" type="file" accept="audio/*"></label>');

// ===== 4) 걷기 명상: 제목 =====
patch(base + 'app.js',
  "const titles = {flower:'\ube5b\uaf43\uc5d0 \uba38\ubb34\ub974\uae30',breath:'\uc228 \uace0\ub974\uae30',night:'\uace0\uc694\ud55c \ubc24'};",
  "const titles = {flower:'\ube5b\uaf43\uc5d0 \uba38\ubb34\ub974\uae30',breath:'\uc228 \uace0\ub974\uae30',night:'\uace0\uc694\ud55c \ubc24',walk:'\uac77\uae30 \uba85\uc0c1'};");

// ===== 5) 걷기 명상: 3단계 안내 =====
patch(base + 'app.js',
  "\ubb34\uc5b8\uac00\ub97c \ud574\ub0b4\uc9c0 \uc54a\uc544\ub3c4 \uc88b\uc740 \uc2dc\uac04\uc774\uc5d0\uc694.']]\r\n};",
  "\ubb34\uc5b8\uac00\ub97c \ud574\ub0b4\uc9c0 \uc54a\uc544\ub3c4 \uc88b\uc740 \uc2dc\uac04\uc774\uc5d0\uc694.'],\r\n walk:[['\ubc1c\uac78\uc744\uc5d0 \ub9c8\uc74c\uc744 \ubaa8\uc544\uc694','\ub290\ub9ac\uac8c \uac77\uc73c\uba70 \ubc1c\ubc14\ub2e5\uc774 \ub565\uc5d0 \ub2ff\ub294 \ub290\ub08c\uc744 \ub290\ub07c\uc138\uc694.'],['\uc228\uc5d0 \uac78\uc74c\uc744 \ub9de\ucdb0\uc694','\ub4e4\uc774\uc26c\uba44 \ub450 \uac78\uc74c, \ub0b4\uc26c\uc5ec\uba44 \ub450 \uac78\uc74c. \ud3b8\ud55c \ub9ac\ub4ec\uc744 \ucc3e\uc544\ubcf4\uc138\uc694.'],['\ub9ac\ub4ec\uc5d0 \ubab8\uc744 \ub9f4\uaca8\uc694','\uc790\uc5f0\uc2a4\ub7fd\uac74 \uac77\uc74c\uc758 \ud754\ub984\uc5d0 \uadf8\ub300\ub85c \ub9f4\uae30\uace0 \uac77\uc5b4\uc694.']]]\r\n};");

// ===== 6) 밤 모드 화면 전환 (저녁 수면 명상 시 어두운 화면) =====
patch(base + 'app.js',
  "window.scrollTo(0,0);",
  "window.scrollTo(0,0);document.body.classList.toggle('night-mode', id==='session'&&mode==='night');");

// ===== 7) 저녁 수면 명상 시작 (밤 모드 15분) =====
patch(base + 'app.js',
  "$('about').onclick=()=>$('info').showModal();",
  "const sleepStart=document.getElementById('sleepStart');if(sleepStart)sleepStart.onclick=()=>{mode='night';minutes=15;document.querySelectorAll('[data-min]').forEach(b=>{const sel=Number(b.dataset.min)===15;b.classList.toggle('selected',sel);b.setAttribute('aria-pressed',String(sel));});start();};\r\n$('about').onclick=()=>$('info').showModal();");

// ===== 8) 홈 화면 카드 2개 추가 (걷기 명상 + 저녁 수면 명상) =====
patch(base + 'index.html',
  '<button data-mode="night"><span>\ud558\ub8e8\ub97c \ub9c8\uce58\uba70</span><strong>\uace0\uc694\ud55c \ubc24</strong><small>\ubab8\uc758 \uae34\uc7a5\uc744 \ub0b4\ub824\ub193\ub294 \uc2dc\uac04</small></button>',
  '<button data-mode="night"><span>\ud558\ub8e8\ub97c \ub9c8\uce58\uba70</span><strong>\uace0\uc694\ud55c \ubc24</strong><small>\ubab8\uc758 \uae34\uc7a5\uc744 \ub0b4\ub824\ub193\ub294 \uc2dc\uac04</small></button><button data-mode="walk"><span>\ucc9c\ucc9c\ud788 \uac77\uc73c\uba70</span><strong>\uac77\uae30 \uba85\uc0c1</strong><small>\ubc1c\uac78\uc74c\uacfc \uc228\uc744 \ub9de\ucdb0\ub294 \uc2dc\uac04</small></button><button id="sleepStart"><span>\ud558\ub8e8\ub97c \ub2eb\ub294 \uba85\uc0c1</span><strong>\uc800\ub141 \uc218\uba74 \uba85\uc0c1</strong><small>\uace0\uc694\ud55c \ubc24 15\ubd84 \u00b7 \uc5b4\ub450\uc6b4 \ud654\uba74</small></button>');

// ===== 9) 밤 모드 어두운 테마 (style.css 끝에 추가) =====
let css = fs.readFileSync(base + 'style.css', 'utf8');
if (!css.includes('body.night-mode')) {
  css += '\r\n/* --- \uc800\ub141 \uc218\uba74 \uba85\uc0c1: \uc5b4\ub450\uc6b4 \ud654\uba74 --- */\r\n' +
    'body.night-mode{background:#0a1118;color:#e8eef2;}\r\n' +
    'body.night-mode main{background:#0a1118;}\r\n' +
    'body.night-mode header,body.night-mode section,body.night-mode .panel,body.night-mode .smallcards button,body.night-mode nav{background-color:#101b26 !important;color:#e8eef2;}\r\n' +
    'body.night-mode h1,body.night-mode h2,body.night-mode h3,body.night-mode p,body.night-mode small,body.night-mode span{color:#e8eef2;}\r\n' +
    'body.night-mode .eyebrow,body.night-mode .muted,body.night-mode .text{color:#9fb3c0 !important;}\r\n' +
    'body.night-mode .durations button{border-color:#2a4157;color:#9fb3c0;}\r\n' +
    'body.night-mode .durations .selected{border-color:var(--gold);color:var(--gold);}\r\n' +
    'body.night-mode .orb{color:#c6d8e8;text-shadow:0 0 70px #9db8d877;}\r\n' +
    'body.night-mode #clock{color:#e8eef2;}\r\n' +
    'body.night-mode button.primary{background:#2a4157;color:#e8eef2;}\r\n' +
    'body.night-mode dialog{background:#0e1822;border-color:#2a4157;}\r\n';
  fs.writeFileSync(base + 'style.css', css, 'utf8');
  console.log('style.css OK');
} else console.log('style.css ALREADY-PATCHED');

// ===== 10) sw.js: 새 음원 캐시 추가 + 버전 v9 → v10 =====
let sw = fs.readFileSync(base + 'sw.js', 'utf8');
if (!sw.includes('audio/dogong.mp3')) {
  const m = sw.match(/(['"])(?:\.\/)?audio\/[A-Za-z0-9._-]+\1/);
  if (m) {
    sw = sw.replace(m[0], "'audio/dogong.mp3','audio/sichonjuju.mp3','audio/taeulju.mp3'," + m[0]);
    console.log('sw.js audio entries OK');
  } else console.log('sw.js: audio entry not found (runtime cache \ubc29\uc2dd\uc774\uba74 \uad1c\ucc2e\uc74c)');
}
if (sw.includes("bitkkot-shell-v9")) {
  sw = sw.replace("bitkkot-shell-v9", "bitkkot-shell-v10");
  console.log('sw.js v10 OK');
} else console.log('sw.js version: ' + (sw.match(/bitkkot-shell-v\d+/) || ['NOT-FOUND'])[0]);
fs.writeFileSync(base + 'sw.js', sw, 'utf8');

console.log('ALL DONE');
