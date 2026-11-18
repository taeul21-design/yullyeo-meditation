const fs = require('fs');
function patch(path, oldS, newS) {
  let src = fs.readFileSync(path, 'utf8');
  if (src.includes(newS)) { console.log(path, 'ALREADY-PATCHED'); return; }
  const count = src.split(oldS).length - 1;
  if (count !== 1) { console.log(path, 'MATCH-COUNT', count, JSON.stringify(oldS.slice(0, 60))); process.exit(1); }
  fs.writeFileSync(path, src.replace(oldS, newS), 'utf8');
  console.log(path, 'OK');
}
const base = 'C:/yullyeo-meditation/dist/';

// 1) index.html — 도공 따라하기를 단계별 상세로 강화 (천지조화 도공 참고)
patch(base + 'index.html',
  '<div id="listeningGuide" hidden><h3>도공수행 따라하기</h3><ol><li>어깨와 팔의 힘을 빼고 편안하게 서거나 앉아 숨을 고르게 쉬어요.</li><li>음악과 함께 몸이 원하는 대로 자연스럽게 움직여요. 억지로 만들지 않아도 괜찮아요.</li><li>좋고 나쁨을 판단하는 생각을 내려놓고, 움직임의 흐름에 그대로 맡겨요.</li><li>움직임이 잦아들면 눈을 감고 숨을 몇 번 고르게 쉬며 마무리해요.</li></ol><label>도공음악 파일 <input id="listeningFile" type="file" accept="audio/*"></label><p class="muted">준비한 음악을 선택하면 그 음악으로 도공수행을 체험할 수 있어요.</p></div>',
  '<div id="listeningGuide" hidden><h3>도공수행 따라하기</h3><ol><li><strong>가만히 기 감각 익히기</strong> — 어깨와 팔의 힘을 빼고 서거나 앉아 숨을 고르게 쉬며, 몸 어디가 뻐근하고 무거운지 살펴요.</li><li><strong>음악과 함께 몸 풀기</strong> — 어깨·팔·허리를 천천히 흔들며 몸을 풀어요. 억지로 만들기보다 몸이 원하는 대로 내두면 흐름이 생겨요.</li><li><strong>판단을 내려놓고 흐름에 맡기기</strong> — 좋고 나쁨을 따지는 생각을 내려놓아요. 처음에는 의지로 움직이던 몸이 점점 저절로 움직여요.</li><li><strong>잦아들며 마무리</strong> — 움직임이 잦아들면 눈을 감고 숨을 몇 번 고르게 쉬며 물처럼 가라앉아요.</li></ol><details class="dogong-tips"><summary>도공을 할 때 알아두면 좋아요</summary><p>몸의 긴장이 풀리는 자리에서 움직임이 커지거나 격해질 수 있어요. 몸의 상태가 그렇다는 뜻이니 무리하지 말고 편안할 때까지 이어가세요.</p><p>한 번으로 끝내려 하지 말고 꾸준히 이어가는 것이 중요해요. 처음에는 의지로 움직이지만, 익숙해지면 몸이 이끄는 대로 움직이게 됩니다.</p><p>어지럽거나 힘들면 멈추고 편하게 쉬세요. 명상은 편안함 안에서 자라납니다.</p></details><label>도공음악 파일 <input id="listeningFile" type="file" accept="audio/*"></label><button id="dogongToSession" class="primary">선택한 음악으로 명상 준비하기</button><p class="muted">음악을 선택하면 바로 체험하고, 명상 준비를 누르면 명상 시작과 함께 그 음악이 재생돼요.</p></div>');

// 2) practice.js — 도공 소개 문구 강화
patch(base + 'practice.js',
  "    description: '음악에 몸을 맡기고 편안하게 움직이는 역동 명상입니다. 좋고 나쁨을 판단하지 말고, 몸의 흐름에 그대로 맡겨보세요.'",
  "    description: '음악에 몸을 맡기고 편안하게 움직이는 역동 명상입니다. 판단을 내려놓고 흐름에 맡기면, 몸이 원하는 움직임이 저절로 펼쳐져요.'");

// 3) practice.js — 선택한 도공음악으로 명상 준비하는 연결 기능
patch(base + 'practice.js',
  "document.getElementById('dogongOpen').onclick = () => openListening('dogong');",
  "document.getElementById('dogongOpen').onclick = () => openListening('dogong');\n" +
  "document.getElementById('dogongToSession').onclick = () => {\n" +
  "  if (!listeningAudio.src) { listeningStatus.textContent = '먼저 도공음악 파일을 선택해 주세요.'; return; }\n" +
  "  music.pause();\n" +
  "  music.src = listeningAudio.src;\n" +
  "  document.getElementById('musicFile').value = '';\n" +
  "  music.load();\n" +
  "  musicStatus.textContent = '도공음악 · 명상을 시작하면 이 음악이 재생됩니다.';\n" +
  "  listening.close();\n" +
  "  window.scrollTo(0, 0);\n" +
  "};");

// 4) sw.js — 캐시 버전 v8 → v9
patch(base + 'sw.js', "const CACHE = 'bitkkot-shell-v8';", "const CACHE = 'bitkkot-shell-v9';");
