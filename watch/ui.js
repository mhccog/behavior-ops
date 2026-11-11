/* Watch tab: real-life profiling videos, embedded via youtube-nocookie (thumbnail-first facade). */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ready=false,loading=null,group='hughes',concept='All',cue='';
const KEY='bo.watch.v1';
try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');if(s.g==='others')group='others'}catch(e){}
function load(){
  if(ready)return Promise.resolve();if(loading)return loading;
  loading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='watch/videos.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})
    .then(()=>{ready=true;render()}).catch(e=>{$('#watchList').innerHTML='<p class="caveat">Couldn’t load the video list. Check your connection and reopen this tab.</p>';console.warn(e)});
  return loading;
}
const secs=t=>t.split(':').reduce((a,b)=>a*60+(+b),0);
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function list(){return (window.WATCH&&window.WATCH[group])||[]}
function filtered(){
  return list().filter(v=>(concept==='All'||v.concepts.includes(concept))&&(!cue||v.moments.some(m=>m.cue===cue)));
}
function renderSeg(){
  document.querySelectorAll('#watchSeg button').forEach(b=>{const on=b.dataset.g===group;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $('#watchSeg').classList.toggle('right',group==='others');
  const W=window.WATCH||{};
  $('#watchNote').innerHTML=group==='hughes'?(W.noteHughes||''):(W.noteOthers||'');
}
function renderFilters(){
  const vs=list();const cs=['All',...(window.WATCH.concepts||[]).filter(c=>vs.some(v=>v.concepts.includes(c)))];
  if(!cs.includes(concept))concept='All';
  $('#watchConcepts').innerHTML=cs.map(c=>`<button class="${c===concept?'on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
  const cues=[...new Set(vs.flatMap(v=>v.moments.map(m=>m.cue).filter(Boolean)))].sort();
  if(cue&&!cues.includes(cue))cue='';
  $('#watchCue').innerHTML='<option value="">Any cue</option>'+cues.map(c=>`<option ${c===cue?'selected':''}>${esc(c)}</option>`).join('');
}
function card(v){
  const n=v.moments.length;
  const mom=v.moments.map(m=>`<li class="mom${cue&&m.cue===cue?' hit':''}">
    <button class="ts" data-seek="${secs(m.t)}" aria-label="Play from ${esc(m.t)}">▶ ${esc(m.t)}</button>
    <div class="mtx"><b>${esc(m.label)}</b>${m.note?`<span>${esc(m.note)}</span>`:''}
    <div class="mlinks">${m.cue?`<button class="lnk" data-cue="${esc(m.cue)}">👁 ${esc(m.cue)}</button>`:''}${m.ask?`<button class="lnk" data-ask="${esc(m.ask)}">✦ Ask</button>`:''}</div></div></li>`).join('');
  return `<article class="vcard" id="v-${esc(v.id)}">
    <div class="vframe" data-yt="${esc(v.id)}">
      <img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="Thumbnail: ${esc(v.title)}">
      <button class="vplay" data-seek="${v.start?secs(v.start):0}" aria-label="Play ${esc(v.title)}"><span>▶</span></button>
      <span class="vdur">${esc(v.dur||'')}</span>
    </div>
    <div class="vbody">
      <div class="vsrc">${esc(v.src)}${v.date?' · '+esc(v.date):''}</div>
      <h3>${esc(v.title)}</h3>
      <p class="vby">${esc(v.by||'')}</p>
      <p class="vwho"><b>Who:</b> ${esc(v.who)}</p>
      <p class="vsum">${esc(v.sum)}</p>
      <div class="vtags">${v.concepts.map(c=>`<span>${esc(c)}</span>`).join('')}</div>
      <details class="vmom" ${cue?'open':''}><summary>Cue moments <span class="count">${n}</span></summary><ol>${mom}</ol></details>
      <a class="vext" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">Open on YouTube ↗</a>
    </div></article>`;
}
function render(){
  if(!ready)return;renderSeg();renderFilters();
  const vs=filtered();
  $('#watchCount').textContent=vs.length+(vs.length===1?' video':' videos');
  $('#watchList').innerHTML=vs.length?vs.map(card).join(''):'<p class="caveat">No videos match those filters.</p>';
}
function play(frame,s){
  const id=frame.dataset.yt;
  const src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1&start=${s|0}`;
  let f=frame.querySelector('iframe');
  if(!f){f=document.createElement('iframe');f.title='YouTube video player';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';frame.innerHTML='';frame.appendChild(f);frame.classList.add('live')}
  f.src=src;
  frame.scrollIntoView({behavior:'smooth',block:'start'});
}
const tab=t=>{const b=document.querySelector('.tabs button[data-tab="'+t+'"]');if(b)b.click()};
function goCue(name){tab('cues');const s=$('#cueSearch');if(s){s.value=name;s.dispatchEvent(new Event('input'))}}
function goAsk(id){tab('ask');if(window.ASK_UI)window.ASK_UI.ask('',id)}
function init(){
  const root=$('#tab-watch');if(!root)return;
  root.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(!b)return;
    if(b.dataset.g){group=b.dataset.g;concept='All';cue='';try{localStorage.setItem(KEY,JSON.stringify({g:group}))}catch(e){};render();return}
    if(b.dataset.c){concept=b.dataset.c;render();return}
    if(b.dataset.seek!=null){const art=b.closest('.vcard');play(art.querySelector('.vframe'),+b.dataset.seek);return}
    if(b.dataset.cue){goCue(b.dataset.cue);return}
    if(b.dataset.ask){goAsk(b.dataset.ask);return}
  });
  $('#watchCue').addEventListener('change',e=>{cue=e.target.value;render()});
  document.addEventListener('tabshow',e=>{if(e.detail==='watch')load()});
  if(location.hash==='#watch')load();
}
window.WATCH_UI={load};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
