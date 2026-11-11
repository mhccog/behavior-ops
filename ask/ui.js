/* Ask tab UI: chat over the local Hughes knowledge base (no server, no AI API). */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='bo.ask.v1';
const CAT={cues:'Body cue',bte:'Reading behaviour',profiling:'Profiling',influence:'Influence',authority:'Authority',models:'Model',foundations:'Foundations',pillars:'Foundations',language:'Language',biases:'Cognitive bias',neurology:'Neuroscience',neuro:'Neuroscience',training:'Training',defensive:'Protect yourself',glossary:'Glossary',about:'About Hughes'};
const STARTERS=['What does it mean when someone touches their neck?','How do I build rapport with a skeptical person?','What’s the word for hiding info between two emotional peaks?','How can I tell if someone is lying?','What is the Six-Axis Model?','Am I being manipulated?','How do I calm down an angry person?','What is the Needs Map?'];
let ready=false,loading=null,state={},hist=[];
function load(){
  if(ready)return Promise.resolve();if(loading)return loading;
  const add=src=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)});
  loading=add('ask/kb.js').then(()=>add('ask/engine.js')).then(()=>{ASK_ENGINE.build(window.ASK_KB);ready=true;restore()}).catch(e=>{log().innerHTML='<div class="msg bot"><div class="bub">Couldn’t load the knowledge base. Check your connection and reopen this tab.</div></div>';console.warn(e)});
  return loading;
}
const log=()=>$('#askLog');
function save(){try{localStorage.setItem(KEY,JSON.stringify(hist.slice(-60)))}catch(e){}}
function restore(){
  try{hist=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){hist=[]}
  log().innerHTML='';welcome();
  hist.forEach(h=>h.r==='u'?drawUser(h.q,false):drawBot(h.res,false));
  const lb=[...hist].reverse().find(h=>h.r==='b'&&h.res&&h.res.main);if(lb)state={last:lb.res.main,recent:[lb.res.main]};
  scrollEnd(false);
}
function welcome(){
  const d=document.createElement('div');d.className='msg bot welcome';
  d.innerHTML=`<div class="bub"><div class="bt">Ask me about Chase Hughes’ work</div><p>I answer only from <b>The Behavior Ops Manual</b> and Hughes’ own videos and site, in my own words with page refs and links. Ask about a gesture, a term, a model or a situation, then tap a follow-up to go further.</p><div class="chips">${STARTERS.map(s=>`<button class="chip fu" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`;
  log().appendChild(d);
}
function scrollEnd(smooth=true){requestAnimationFrame(()=>{const l=log().lastElementChild;if(l)l.scrollIntoView({behavior:smooth?'smooth':'auto',block:'end'})})}
function drawUser(q,anim=true){const d=document.createElement('div');d.className='msg user'+(anim?' in':'');d.innerHTML=`<div class="bub">${esc(q)}</div>`;log().appendChild(d)}
function srcPills(e){
  const p=e.src.filter(s=>s.p).map(s=>s.p);const out=[];
  if(p.length)out.push(`<span class="pill book" title="The Behavior Ops Manual (book page numbers)">📘 Ops Manual ${p.length>1||/[-–]/.test(p[0])?'pp.':'p.'} ${esc(p.join(', '))}</span>`);
  e.src.filter(s=>s.u).forEach(s=>{const lab=s.l||(/youtube/.test(s.u)?'YouTube':s.u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0]);out.push(`<a class="pill web" href="${esc(s.u)}" target="_blank" rel="noopener">${/youtube|youtu\.be/.test(s.u)?'▶':'🔗'} ${esc(lab)}${s.ts?' · '+esc(s.ts):''}</a>`)});
  return out.join('');
}
function links(e){
  const b=[];const KB=window.ASK_KB;
  if(e.cue)b.push(`<button class="lnk" data-cue="${esc(e.cue)}">👁 See it in Body</button>`);
  (e.r||[]).filter(r=>r.startsWith('play:')).forEach(r=>{const g=KB.goals.find(g=>'play:'+g.id===r);if(g)b.push(`<button class="lnk" data-goal="${esc(g.id)}">💬 Talk: ${esc(g.t)}</button>`)});
  (e.r||[]).filter(r=>r.startsWith('cue-')).slice(0,2).forEach(r=>{const c=ASK_ENGINE.byId(r);if(c&&c.cue)b.push(`<button class="lnk" data-cue="${esc(c.cue)}">👁 ${esc(c.cue)}</button>`)});
  return b.length?`<div class="lnks">${b.join('')}</div>`:'';
}
function chipsFor(e,extra){
  const c=[];(e.f||[]).slice(0,3).forEach(f=>c.push(`<button class="chip fu" data-q="${esc(f)}">${esc(f)}</button>`));
  (e.r||[]).filter(r=>!r.startsWith('play:')).map(r=>ASK_ENGINE.byId(r)).filter(Boolean).slice(0,c.length?2:4).forEach(x=>c.push(`<button class="chip fu rel" data-id="${esc(x.i)}">→ ${esc(x.t)}</button>`));
  if(extra)c.push(...extra);
  return c.length?`<div class="fus"><div class="lbl">Ask a follow-up</div><div class="chips">${c.join('')}</div></div>`:'';
}
function deeper(e,open){
  const parts=[];if(e.d)parts.push(`<p>${esc(e.d)}</p>`);
  if(e.u)parts.push(`<p class="use"><b>Using it well:</b> ${esc(e.u)}</p>`);
  if(e.e&&e.e.length)parts.push(`<div class="ex"><b>Examples</b><ul>${e.e.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`);
  if(!parts.length)return '';
  return `<details class="deep"${open?' open':''}><summary>Go deeper</summary>${parts.join('')}</details>`;
}
function body(res){
  const E=ASK_ENGINE.byId;
  if(res.kind==='unsure'){
    const alts=(res.alts||[]).map(E).filter(Boolean);
    return `<p>I couldn’t find that in Hughes’ work. I only answer from his book, videos and site, so I won’t guess.</p>${alts.length?`<div class="lbl">Closest topics</div><div class="chips">${alts.map(x=>`<button class="chip fu rel" data-id="${esc(x.i)}">${esc(x.t)}</button>`).join('')}</div>`:''}<p class="tip">💡 ${esc(res.tip||'')}</p>`;
  }
  const e=E(res.main);if(!e)return '<p>That entry is no longer available.</p>';
  const head=`<div class="bt"><span class="cat">${esc(CAT[e.c]||e.c)}</span>${esc(e.t)}</div>`;
  if(res.kind==='related'){const alts=(res.alts||[]).map(E).filter(Boolean);return head+`<p>Topics connected to <b>${esc(e.t)}</b>:</p><div class="chips">${alts.map(x=>`<button class="chip fu rel" data-id="${esc(x.i)}">${esc(x.t)}</button>`).join('')}</div>`}
  if(res.kind==='follow'){
    let t='';
    if(res.mode==='example'){t=e.e&&e.e.length?`<ul>${e.e.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:(e.u?`<p>${esc(e.u)}</p>`:`<p>${esc(e.d||e.s)}</p>`);if(!(e.e&&e.e.length))t='<p class="mute">Hughes doesn’t give a set example here, but this is how to apply it:</p>'+t}
    else if(res.mode==='use'){t=`<p>${esc(e.u||e.d||e.s)}</p>`}
    else{t=`<p>${esc(e.d||e.s)}</p>${e.u?`<p class="use"><b>Using it well:</b> ${esc(e.u)}</p>`:''}`}
    return head+t+links(e)+`<div class="pills">${srcPills(e)}</div>`+chipsFor(e);
  }
  const sec=res.second&&E(res.second);
  let h=head+(res.conf==='low'?'<p class="mute">Closest match I have:</p>':'')+`<p>${esc(e.s)}</p>`;
  if(sec)h+=`<p class="also"><b>Also relevant: ${esc(sec.t)}.</b> ${esc((sec.s||'').split(/(?<=[.!?])\s/)[0])}</p>`;
  h+=deeper(e,false)+links(e)+`<div class="pills">${srcPills(e)}${sec?srcPills(sec):''}</div>`;
  const altChips=(res.alts||[]).map(E).filter(x=>x&&x.i!==e.i&&(!sec||x.i!==sec.i)&&!(e.r||[]).includes(x.i)).slice(0,1).map(x=>`<button class="chip fu rel" data-id="${esc(x.i)}">→ ${esc(x.t)}</button>`);
  return h+chipsFor(e,altChips);
}
function drawBot(res,anim=true){
  const d=document.createElement('div');d.className='msg bot'+(anim?' in':'');
  const say=('speechSynthesis' in window)?'<button class="speak" aria-label="Read aloud" title="Read aloud">🔊</button>':'';
  d.innerHTML=`<div class="bub">${body(res)}${say}</div>`;log().appendChild(d);
}
function ask(q,id){
  q=(q||'').trim();if(!q&&!id)return;if(!ready){load().then(()=>ask(q,id));return}
  let res;
  if(id){const e=ASK_ENGINE.byId(id);if(!e)return;q=q||('Tell me about '+e.t);res={kind:'answer',main:e.i,alts:[]}}
  else{const r=ASK_ENGINE.answer(q,state);res={kind:r.kind,mode:r.mode,conf:r.conf,main:r.main&&r.main.i,second:r.second&&r.second.i,alts:(r.alts||[]).map(x=>x.i),tip:r.tip}}
  drawUser(q);hist.push({r:'u',q});
  const typing=document.createElement('div');typing.className='msg bot typing';typing.innerHTML='<div class="bub"><i></i><i></i><i></i></div>';log().appendChild(typing);scrollEnd();
  setTimeout(()=>{typing.remove();drawBot(res);hist.push({r:'b',res});save();
    if(res.main){state={last:res.main,recent:[res.main,...(state.recent||[])].slice(0,3)}}
    const last=log().lastElementChild;last.scrollIntoView({behavior:'smooth',block:'start'});},260);
}
const tab=t=>{const b=document.querySelector('.tabs button[data-tab="'+t+'"]');if(b)b.click()};
function goCue(name){tab('cues');const s=$('#cueSearch');if(s){s.value=name;s.oninput&&s.oninput();s.dispatchEvent(new Event('input'))}}
function goGoal(id){tab('talk');const KB=window.ASK_KB;const i=KB.goals.findIndex(g=>g.id===id);const el=$('#goalList')&&$('#goalList').children[i];if(el){el.open=true;setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'center'}),80)}}
function speakText(bub){
  const ss=window.speechSynthesis;if(ss.speaking){ss.cancel();return}
  const c=bub.cloneNode(true);c.querySelectorAll('.pills,.fus,.lnks,button,.chips,.lbl,summary').forEach(x=>x.remove());
  const u=new SpeechSynthesisUtterance(c.textContent.replace(/\s+/g,' ').trim());u.lang='en-GB';u.rate=1;ss.speak(u);
}
function gloss(){
  if(!ready){load().then(gloss);return}
  const g=window.ASK_KB.glossary.slice().sort((a,b)=>a[0].localeCompare(b[0]));
  const dlg=$('#dlg'),b=$('#dlgBody');
  b.innerHTML=`<h3>Glossary of Hughes’ terms</h3><p class="caveat">${g.length} terms. Tap one to ask about it.</p><div class="gloss">${g.map(([t,i])=>`<button class="chip" data-gid="${esc(i)}" data-gt="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
  b.querySelectorAll('[data-gid]').forEach(x=>x.onclick=()=>{dlg.close();ask('What is '+x.dataset.gt+'?',x.dataset.gid)});
  dlg.showModal?dlg.showModal():dlg.setAttribute('open','');
}
function initMic(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const m=$('#askMic');
  if(!SR){m.hidden=true;return}
  let rec=null;
  m.onclick=()=>{
    if(rec){rec.stop();return}
    rec=new SR();rec.lang='en-GB';rec.interimResults=true;rec.maxAlternatives=1;
    m.classList.add('on');const inp=$('#askInput');
    rec.onresult=ev=>{let t='';for(const r of ev.results)t+=r[0].transcript;inp.value=t;if(ev.results[ev.results.length-1].isFinal){rec.stop();ask(t);inp.value=''}};
    rec.onend=()=>{m.classList.remove('on');rec=null};rec.onerror=()=>{m.classList.remove('on');rec=null};
    try{rec.start()}catch(e){m.classList.remove('on');rec=null}
  };
}
function init(){
  const root=$('#tab-ask');if(!root)return;
  $('#askBar').addEventListener('submit',ev=>{ev.preventDefault();const i=$('#askInput');ask(i.value);i.value=''});
  root.addEventListener('click',ev=>{
    const t=ev.target.closest('button,a');if(!t)return;
    if(t.dataset.q){ask(t.dataset.q)}else if(t.dataset.id){const e=ASK_ENGINE.byId(t.dataset.id);ask(e?('Tell me about '+e.t):'',t.dataset.id)}
    else if(t.dataset.cue)goCue(t.dataset.cue);else if(t.dataset.goal)goGoal(t.dataset.goal);
    else if(t.classList.contains('speak'))speakText(t.closest('.bub'));
  });
  $('#askClear').onclick=()=>{if(!hist.length)return;if(!confirm('Clear this chat history? (Your People data is not affected.)'))return;hist=[];state={};save();try{localStorage.removeItem(KEY)}catch(e){};if(ready)restore()};
  $('#askGloss').onclick=gloss;
  initMic();
  document.addEventListener('tabshow',e=>{if(e.detail==='ask')load()});
  if(location.hash==='#ask')load();
}
window.ASK_UI={ask,load};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
