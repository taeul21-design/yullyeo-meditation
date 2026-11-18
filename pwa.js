const installButton = document.getElementById('install');
const installStatus = document.getElementById('installStatus');
let installPrompt;
const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
installButton.hidden = !!standalone;
installStatus.textContent = standalone ? '홈 화면 앱으로 사용 중입니다.' :
  'iPhone은 Safari의 공유 메뉴에서 ‘홈 화면에 추가’를 선택하세요. Android는 브라우저 메뉴의 앱 설치를 이용하세요.';
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) {
    installStatus.textContent = '브라우저 메뉴의 ‘앱 설치’ 또는 공유 메뉴의 ‘홈 화면에 추가’를 이용하세요. 설치에는 HTTPS 주소가 필요합니다.';
    return;
  }
  const prompt = installPrompt;
  installPrompt = null;
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    installStatus.textContent = choice.outcome === 'accepted' ? '설치 요청을 보냈어요.' : '나중에 브라우저 메뉴에서 설치할 수 있어요.';
  } catch {
    installStatus.textContent = '브라우저 메뉴에서 설치를 다시 시도해 주세요.';
  }
});
window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
  installStatus.textContent = '홈 화면에 추가했어요.';
});
if ('serviceWorker' in navigator && ['https:', 'http:'].includes(location.protocol)) {
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready)
    .then(() => { document.getElementById('offlineStatus').textContent = '오프라인 명상 준비 완료'; })
    .catch(() => { document.getElementById('offlineStatus').textContent = '오프라인 준비에 실패했어요. 연결 상태를 확인하고 다시 열어 주세요.'; });
}
