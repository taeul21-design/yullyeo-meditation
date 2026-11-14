const $ = id => document.getElementById(id);
let minutes = 10, mode = 'flower', remaining = 600, started = false, paused = false, deadline = 0, activeRecord = null;
let records = [];
try { const data = JSON.parse(localStorage.getItem('bitkkot-records') || '[]'); if (Array.isArray(data)) records = data.filter(r => r && Number.isFinite(r.minutes)); } catch {}
const titles = {flower:'빛꽃에 머무르기',breath:'숨 고르기',night:'고요한 밤'};
const guides = {
 flower:[['편안하게 앉아보세요','어깨의 힘을 풀고, 평소처럼 숨을 쉬어요.'],['마음에 꽃을 떠올려요','우주의 부드러운 빛이 꽃 한 송이에 머문다고 상상해요.'],['빛에 잠시 머물러요','자연스럽게 숨 쉬며 빛꽃의 따스함을 떠올려요.']],
 breath:[['숨을 느껴보세요','호흡을 바꾸려 애쓰지 않아도 괜찮아요.'],['들어오고, 나가는 숨','코끝을 지나는 공기를 가만히 느껴보세요.'],['다시, 지금의 호흡으로','생각을 알아차렸다면 천천히 숨으로 돌아와요.']],
 night:[['오늘 하루를 내려놓아요','편한 자세를 잡고 어깨의 힘을 풀어보세요.'],['몸을 천천히 느껴요','이마와 턱, 손에 남은 힘을 가볍게 풀어요.'],['고요 속에 머물러요','무언가를 해내지 않아도 좋은 시간이에요.']]
};
function show(id){for(const key of ['home','session','garden','done']) $(key).hidden = key !== id; $('homeNav').toggleAttribute('aria-current',id==='home'); $('gardenNav').toggleAttribute('aria-current',id==='garden');window.scrollTo(0,0);if(window.syncMusic)window.syncMusic(id==='session'&&!paused);}
function save(){try{localStorage.setItem('bitkkot-records',JSON.stringify(records));return true;}catch{return false;}}
function render(){const sec=Math.ceil(remaining);$('clock').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');const step=Math.min(2,Math.floor((1-remaining/(minutes*60))*3));$('guide').textContent=guides[mode][step][0];$('detail').textContent=guides[mode][step][1];}
function finish(complete){started=false;activeRecord=null;if(complete){activeRecord={date:new Date().toISOString(),minutes};records.push(activeRecord);const stored=save();$('doneText').textContent=stored?'정원에 빛꽃 한 송이가 피었어요.':'명상을 마쳤어요. 현재 브라우저에서 기록을 저장할 수 없어요.';}else{$('doneText').textContent='잠시 쉬어간 시간도 소중해요. 꽃은 전체 명상을 마치면 남겨져요.';}$('saved').textContent='';$('moods').hidden=!complete;for(const b of $('moods').children)b.classList.remove('selected');show('done');}
function start(){remaining=minutes*60;deadline=Date.now()+remaining*1000;started=true;paused=false;$('pause').textContent='잠시 멈추기';$('sessionTitle').textContent=titles[mode];render();show('session');}
setInterval(()=>{if(!started||paused)return;remaining=Math.max(0,(deadline-Date.now())/1000);render();if(remaining===0)finish(true);},250);
document.querySelectorAll('[data-min]').forEach(button=>button.onclick=()=>{minutes=Number(button.dataset.min);document.querySelectorAll('[data-min]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});});
$('start').onclick=()=>{mode='flower';start();};document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;start();});
$('pause').onclick=()=>{paused=!paused;if(paused)remaining=Math.max(0,(deadline-Date.now())/1000);else deadline=Date.now()+remaining*1000;$('pause').textContent=paused?'계속하기':'잠시 멈추기';if(window.syncMusic)window.syncMusic(!paused);};$('end').onclick=()=>finish(false);
function garden(){started=false;$('flowers').replaceChildren();records.slice(-60).forEach(()=>{const flower=document.createElement('span');flower.textContent='✺';$('flowers').append(flower);});$('stats').textContent=records.length?`${records.length}송이의 빛꽃 · ${records.reduce((sum,r)=>sum+r.minutes,0)}분의 명상`:'첫 명상을 마치고 꽃을 피워보세요.';show('garden');}
$('gardenNav').onclick=()=>{if(started&&!confirm('진행 중인 명상을 마치고 정원으로 이동할까요?'))return;garden();};$('homeNav').onclick=()=>{if(started&&!confirm('진행 중인 명상을 마치고 처음으로 이동할까요?'))return;started=false;show('home');};$('return').onclick=garden;
for(const button of $('moods').children)button.onclick=()=>{if(!activeRecord)return;activeRecord.mood=button.textContent;const stored=save();for(const b of $('moods').children)b.classList.toggle('selected',b===button);$('saved').textContent=stored?'오늘의 마음을 저장했어요.':'현재 브라우저에서 저장할 수 없어요.';};
$('about').onclick=()=>$('info').showModal();$('close').onclick=()=>$('info').close();
for(let i=0;i<12;i++){const petal=document.createElement('i');petal.className='petal';petal.style.setProperty('--r',`${i*30}deg`);$('flower').append(petal);}
