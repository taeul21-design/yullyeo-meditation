const music = document.getElementById('music');
const musicStatus = document.getElementById('musicStatus');
let musicUrl;
window.syncMusic = active => {
  if (!active) { music.pause(); return; }
  if (music.getAttribute('src')) music.play().catch(() => {
    musicStatus.textContent = '음악 재생 버튼을 누르거나 다른 음원을 선택해 주세요.';
  });
};
document.getElementById('musicFile').onchange = event => {
  const file = event.target.files[0];
  if (!file) return;
  music.pause();
  if (musicUrl) URL.revokeObjectURL(musicUrl);
  musicUrl = URL.createObjectURL(file);
  music.src = musicUrl;
  musicStatus.textContent = file.name + ' · 명상을 시작하면 재생됩니다.';
};
music.onerror = () => { musicStatus.textContent = '재생할 수 없는 음원입니다. MP3 또는 M4A 파일을 선택해 주세요.'; };
const musicButtons = document.querySelectorAll('#musicList [data-track]');
musicButtons.forEach(button => button.onclick = () => {
  music.pause();
  if (musicUrl) { URL.revokeObjectURL(musicUrl); musicUrl = undefined; }
  document.getElementById('musicFile').value = '';
  music.src = button.dataset.track;
  musicButtons.forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  musicStatus.textContent = '명상음악(' + button.textContent + ') · 명상을 시작하면 재생됩니다.';
  music.load();
});
const learn = document.getElementById('learn');
document.getElementById('learnOpen').onclick = () => learn.showModal();
document.getElementById('learnClose').onclick = () => learn.close();

const chant = document.getElementById('chant');
const choice = document.getElementById('chantChoice');
const chantRead = document.getElementById('chantRead');
const chantStatus = document.getElementById('chantStatus');
const voice = new Audio();
const texts = {
  sicheon: '시천주 조화정\n영세불망 만사지\n지기금지 원위대강',
  taeeul: '훔치훔치 태을천 상원군\n훔리치야도래\n훔리함리 사파하'
};
const counts = {sicheon: 0, taeeul: 0};
const files = {};
let playing = false;
function updateChant() {
  const count = counts[choice.value];
  document.getElementById('chantText').textContent = texts[choice.value];
  document.getElementById('chantCount').textContent = count === 21 ? '21독을 마쳤어요.' : `${count} / 21독`;
  chantRead.disabled = playing || count >= 21;
}
function stopChant() {
  playing = false;
  voice.pause();
  updateChant();
}
async function playChant() {
  playing = true;
  music.pause();
  updateChant();
  try { await voice.play(); }
  catch { stopChant(); chantStatus.textContent = '재생하지 못했어요. 음원 파일을 확인하고 다시 시작해 주세요.'; }
}
document.getElementById('chantOpen').onclick = () => { music.pause(); updateChant(); chant.showModal(); };
document.getElementById('chantClose').onclick = () => chant.close();
chant.addEventListener('close', stopChant);
choice.onchange = () => {
  stopChant();
  voice.removeAttribute('src');
  voice.load();
  document.getElementById('chantFile').value = '';
  chantStatus.textContent = files[choice.value] ? '이 주문의 음원이 준비되어 있어요.' : '이 주문의 1독 음원을 선택해 주세요.';
};
chantRead.onclick = () => {
  if (playing || counts[choice.value] >= 21) return;
  voice.currentTime = 0;
  counts[choice.value]++;
  updateChant();
};
document.getElementById('chantReset').onclick = () => {
  stopChant();
  voice.currentTime = 0;
  counts[choice.value] = 0;
  chantStatus.textContent = '';
  updateChant();
};
document.getElementById('chantFile').onchange = event => {
  const file = event.target.files[0];
  if (!file) return;
  stopChant();
  if (files[choice.value]) URL.revokeObjectURL(files[choice.value]);
  files[choice.value] = URL.createObjectURL(file);
  voice.src = files[choice.value];
  counts[choice.value] = 0;
  chantStatus.textContent = file.name + ' · 1독 음원인지 확인해 주세요.';
  updateChant();
};
document.getElementById('chantPlay').onclick = () => {
  if (playing) return;
  if (!files[choice.value]) { chantStatus.textContent = '먼저 이 주문의 1독 음원을 선택해 주세요.'; return; }
  if (counts[choice.value] >= 21) { chantStatus.textContent = '다시 연습하려면 처음부터 읽기를 눌러 주세요.'; return; }
  if (voice.src !== files[choice.value]) voice.src = files[choice.value];
  chantStatus.textContent = '한 번의 재생이 끝나면 1독을 셉니다.';
  playChant();
};
document.getElementById('chantPause').onclick = stopChant;
voice.onended = () => {
  if (!playing) return;
  counts[choice.value]++;
  updateChant();
  if (counts[choice.value] >= 21) { stopChant(); return; }
  voice.currentTime = 0;
  playChant();
};
voice.onerror = () => { stopChant(); chantStatus.textContent = '음원을 읽을 수 없어요. 다른 파일을 선택해 주세요.'; };
updateChant();


const listening = document.getElementById('listening');
const listeningAudio = document.getElementById('listeningAudio');
const listeningStatus = document.getElementById('listeningStatus');
const listeningTracks = {
  chant: {
    source: 'audio/chant-21.mp3',
    title: '주문수행 체험',
    description: '시천주주·태을주 21독 음원을 들으며 편안한 속도로 따라 읽어보세요.'
  },
  wisdom: {
    source: 'audio/youngboguk.mp3',
    title: '영보국 정정지법',
    description: '말씀에 귀 기울이고, 마음에 와닿는 구절에 잠시 머물러보세요.'
  }
};
function openListening(key) {
  const track = listeningTracks[key];
  music.pause();
  stopChant();
  listeningAudio.pause();
  listeningAudio.src = track.source;
  document.getElementById('listeningTitle').textContent = track.title;
  document.getElementById('listeningDescription').textContent = track.description;
  document.getElementById('listeningWords').hidden = key !== 'chant';
  listeningStatus.textContent = '음원을 준비하고 있어요.';
  listening.showModal();
  listeningAudio.play().catch(() => {
    listeningStatus.textContent = '재생 버튼을 눌러 주세요. 재생되지 않으면 연결 상태를 확인해 주세요.';
  });
}
listeningAudio.onplaying = () => { listeningStatus.textContent = '듣는 중 · 재생 막대에서 위치와 음량을 조절할 수 있어요.'; };
listeningAudio.onended = () => { listeningStatus.textContent = '음원을 끝까지 들었어요. 잠시 고요하게 머물러보세요.'; };
listeningAudio.onerror = () => { listeningStatus.textContent = '음원을 불러오지 못했어요. 연결 상태를 확인하고 다시 열어 주세요.'; };
listening.addEventListener('close', () => listeningAudio.pause());
document.getElementById('listeningClose').onclick = () => listening.close();
document.getElementById('chantTrackOpen').onclick = () => openListening('chant');
document.getElementById('wisdomOpen').onclick = () => openListening('wisdom');
