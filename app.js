(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY="bo.people.v1", CUR="bo.current.v1";
let sel=new Set(JSON.parse(localStorage.getItem(CUR)||"[]"));
let editing=null; // id of saved person being edited
const chipById={}; BO.profileGroups.forEach(g=>g.chips.forEach(c=>chipById[c.id]=c));

function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1600)}
function copyBtn(t){return `<div class="say">“${esc(t)}”<button data-copy="${esc(t)}">copy</button></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b){navigator.clipboard&&navigator.clipboard.writeText(b.dataset.copy);toast('Copied')}});

/* ---------- tabs ---------- */
function show(t){$$('.tab').forEach(x=>x.classList.toggle('active',x.id==='tab-'+t));$$('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));$('#card').style.display=t==='profile'?'':'none';window.scrollTo(0,0);location.hash=t;document.dispatchEvent(new CustomEvent('tabshow',{detail:t}))}
$$('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));

/* ---------- drill ---------- */
const day=Math.floor(Date.now()/864e5);
$('#drill').innerHTML=`<b>Today's drill</b> · ${esc(BO.drills[day%BO.drills.length])}`;

/* ---------- profile chips ---------- */
function renderGroups(){
  $('#groups').innerHTML=BO.profileGroups.map((g,i)=>{
    const n=g.chips.filter(c=>sel.has(c.id)).length;
    return `<details class="group" ${i===0||n?'open':''}><summary>${esc(g.title)}<span class="count">${n?n+' picked':'tap ▸'}</span></summary>
    <div class="hint">${esc(g.hint)}</div>
    <div class="chips">${g.chips.map(c=>`<button class="chip ${c.good?'good':(c.s.stress?'bad':'')} ${sel.has(c.id)?'on':''}" data-chip="${c.id}">${esc(c.l)}</button>`).join('')}</div></details>`}).join('');
  $$('[data-chip]').forEach(b=>b.onclick=()=>{const id=b.dataset.chip;sel.has(id)?sel.delete(id):sel.add(id);b.classList.toggle('on');localStorage.setItem(CUR,JSON.stringify([...sel]));
    const g=b.closest('.group'),n=g.querySelectorAll('.chip.on').length;g.querySelector('.count').textContent=n?n+' picked':'tap ▸';renderCard()});
}

function compute(ids){
  const sc={};[...ids].forEach(id=>{const c=chipById[id];if(c)for(const k in c.s)sc[k]=(sc[k]||0)+c.s[k]});
  const top=(keys,n=1)=>keys.filter(k=>sc[k]).sort((a,b)=>sc[b]-sc[a]).slice(0,n);
  return {sc,
    needs:top(Object.keys(BO.needs),2),
    dec:top(Object.keys(BO.decisions),1)[0],
    val:top(Object.keys(BO.values),1)[0],
    sen:top(['V','A','K'],1)[0],
    pro:top(['self','team','others'],1)[0],
    comfort:sc.comfort||0, stress:sc.stress||0,
    tips:[...ids].map(id=>chipById[id]).filter(c=>c&&c.tip)};
}

function cardHTML(P,full){
  const N=BO.needs, out=[];
  const pills=[];
  P.needs.forEach(k=>pills.push(`${N[k].emoji} ${N[k].name}`));
  if(P.dec)pills.push(`${BO.decisions[P.dec].emoji} ${BO.decisions[P.dec].name}`);
  if(P.val)pills.push(`${BO.values[P.val].emoji} ${BO.values[P.val].name}`);
  if(P.sen)pills.push(`🎧 ${BO.sensory[P.sen].name}`);
  if(P.pro)pills.push(`🗣 ${BO.pronouns[P.pro].name.split(' (')[0]}`);
  out.push(`<div>${pills.map(p=>`<span class="pill">${esc(p)}</span>`).join('')||'<span class="caveat">Nothing picked yet.</span>'}</div>`);
  if(P.comfort||P.stress){const pos=Math.round(50+50*(P.comfort-P.stress)/Math.max(P.comfort+P.stress,1));
    out.push(`<div class="blk"><h4>Comfort ↔ stress right now</h4><div class="meter"><i style="left:${pos}%"></i></div><div class="caveat">${P.stress>P.comfort?'Stress is up. Slow down, find the topic that caused it, and lower the pressure.':P.comfort>P.stress?'Comfortable. Good moment to deepen the conversation or make your ask.':'Mixed signals. Keep watching for changes from their baseline.'}</div></div>`)}
  const n=P.needs[0];
  if(n){const x=N[n];
    out.push(`<div class="blk"><h4>${x.emoji} Their core need: ${esc(x.name)} <small>(p. ${x.p})</small></h4>
      <div>They're asking: <i>${esc(x.q)}</i></div><div class="caveat">Fear: ${esc(x.fear)}</div><div><b>Give them:</b> ${esc(x.give)}</div></div>`);
    out.push(`<div class="blk"><h4>Things to say</h4>${x.say.map(copyBtn).join('')}${P.needs[1]?`<div class="caveat">Also showing ${esc(N[P.needs[1]].name)}: ${esc(N[P.needs[1]].give)}</div>`:''}</div>`);
    out.push(`<div class="blk"><h4>Avoid</h4><ul>${x.avoid.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div>`);
  }
  const ask=[];
  if(n)ask.push(N[n].ask);
  if(P.dec)ask.push(BO.decisions[P.dec].frame);
  if(P.val)ask.push(BO.values[P.val].tie);
  if(P.pro)ask.push(BO.pronouns[P.pro].frame);
  if(ask.length)out.push(`<div class="blk"><h4>How to frame a request</h4><ul>${ask.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>${P.dec?BO.decisions[P.dec].lines.map(copyBtn).join(''):''}</div>`);
  if(P.sen){const s=BO.sensory[P.sen];out.push(`<div class="blk"><h4>Speak their sense: ${esc(s.name)}</h4><div class="caveat">Use words like: ${esc(s.words)}</div>${s.open.map(copyBtn).join('')}</div>`)}
  if(P.tips.length)out.push(`<div class="blk"><h4>What their body is telling you</h4><ul>${P.tips.map(c=>`<li><b>${esc(c.l)}:</b> ${esc(c.tip)}</li>`).join('')}</ul><div class="caveat">Reads are about this topic, at this moment, compared with their baseline. Not proof of lying.</div></div>`);
  if(full&&n)out.push(`<div class="blk"><h4>Rapport moves</h4><ul><li>Eyebrow flash and slow, relaxed movement.</li><li>Small-talk loop: listen, react, ask a little more, share something related.</li><li>Feed their need (${esc(N[n].name)}) early and often.</li></ul></div>`);
  return out.join('');
}

function renderCard(){
  const P=compute(sel);
  const bits=[];P.needs[0]&&bits.push(BO.needs[P.needs[0]].emoji+' '+BO.needs[P.needs[0]].name);P.dec&&bits.push(BO.decisions[P.dec].name);P.sen&&bits.push(BO.sensory[P.sen].name);
  if(P.stress>P.comfort)bits.push('⚠ stress');
  $('#cardSummary').textContent=sel.size?(bits.join(' · ')||'Keep tapping…'):'Tap what you notice. Your read builds here.';
  $('#cardBody').innerHTML=(sel.size?cardHTML(P,true):'<p class="caveat">Start with “What they talk about”. Two or three taps are enough to get a first read.</p>')+
    `<div class="row" style="margin-top:10px"><button class="primary" id="saveBtn">${editing?'Update person':'Save to People'}</button><button class="ghost" id="clearBtn">Clear</button></div>`;
  $('#saveBtn').onclick=savePerson; $('#clearBtn').onclick=()=>{sel.clear();editing=null;localStorage.setItem(CUR,'[]');renderGroups();renderCard()};
}
$('#cardToggle').onclick=()=>$('#card').classList.toggle('collapsed');

/* ---------- people ---------- */
const people=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
const setPeople=a=>localStorage.setItem(KEY,JSON.stringify(a));
function dialog(html){$('#dlgBody').innerHTML=html;$('#dlg').showModal()}
function savePerson(){
  const ex=editing&&people().find(p=>p.id===editing)||{};
  dialog(`<h3 style="margin-top:0">${editing?'Update':'Save'} person</h3>
   <p><input id="pName" placeholder="Name" value="${esc(ex.name||'')}"></p>
   <p><input id="pWhere" placeholder="Where / how you know them" value="${esc(ex.where||'')}"></p>
   <p><textarea id="pNotes" placeholder="Notes: baseline, topics they light up on, their positive words…">${esc(ex.notes||'')}</textarea></p>
   <button class="primary" id="pSave" type="button">Save</button>`);
  $('#pSave').onclick=()=>{const name=$('#pName').value.trim()||'Unnamed';let a=people();
    const rec={id:editing||Date.now().toString(36),name,where:$('#pWhere').value.trim(),notes:$('#pNotes').value.trim(),chips:[...sel],updated:new Date().toISOString()};
    a=a.filter(p=>p.id!==rec.id);a.unshift(rec);setPeople(a);editing=rec.id;$('#dlg').close();toast('Saved '+name);renderPeople();renderCard()};
}
function renderPeople(){
  const a=people();
  $('#peopleList').innerHTML=a.length?a.map(p=>{const P=compute(new Set(p.chips));
    return `<div class="person"><b>${esc(p.name)}</b><div class="meta">${esc(p.where||'')}${p.where?' · ':''}${new Date(p.updated).toLocaleDateString('en-GB')}</div>
    <div>${P.needs.map(k=>`<span class="pill">${BO.needs[k].emoji} ${BO.needs[k].name}</span>`).join('')}${P.dec?`<span class="pill">${BO.decisions[P.dec].emoji} ${BO.decisions[P.dec].name}</span>`:''}${P.sen?`<span class="pill">${BO.sensory[P.sen].name}</span>`:''}</div>
    ${p.notes?`<div class="caveat">${esc(p.notes)}</div>`:''}
    <div class="row"><button class="ghost" data-view="${p.id}">How to talk to them</button><button class="ghost" data-edit="${p.id}">Edit</button><button class="ghost" data-del="${p.id}">Delete</button></div></div>`}).join('')
   :'<div class="empty">No one saved yet.<br>Build a read on the Profile tab, then tap “Save to People”.</div>';
  $$('[data-view]').forEach(b=>b.onclick=()=>{const p=people().find(x=>x.id===b.dataset.view);dialog(`<h3 style="margin-top:0">${esc(p.name)}</h3>${cardHTML(compute(new Set(p.chips)),true)}`)});
  $$('[data-edit]').forEach(b=>b.onclick=()=>{const p=people().find(x=>x.id===b.dataset.edit);sel=new Set(p.chips);editing=p.id;localStorage.setItem(CUR,JSON.stringify(p.chips));renderGroups();renderCard();show('profile');$('#card').classList.remove('collapsed')});
  $$('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('Delete this person?')){setPeople(people().filter(x=>x.id!==b.dataset.del));renderPeople()}});
}
$('#newProfile').onclick=()=>{sel.clear();editing=null;localStorage.setItem(CUR,'[]');renderGroups();renderCard();show('profile')};
$('#exportBtn').onclick=()=>{const b=new Blob([JSON.stringify(people(),null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='people-backup.json';a.click()};
$('#importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const inc=JSON.parse(t);const m=new Map(people().map(p=>[p.id,p]));inc.forEach(p=>p&&p.id&&m.set(p.id,p));setPeople([...m.values()]);renderPeople();toast('Imported '+inc.length)}catch(err){toast('Not a valid backup')}})};

/* ---------- cues ---------- */
let region='All';
const regions=['All',...new Set(BO.cues.map(c=>c.r))];
const lvl=['Comfort','Low','Medium','High'];
function renderRegions(){$('#regions').innerHTML=regions.map(r=>`<button class="${r===region?'on':''}" data-r="${esc(r)}">${esc(r)}</button>`).join('');$$('[data-r]').forEach(b=>b.onclick=()=>{region=b.dataset.r;renderRegions();renderCues()})}
function renderCues(){
  const q=$('#cueSearch').value.toLowerCase().trim();
  const list=BO.cues.filter(c=>(region==='All'||c.r===region)&&(!q||(c.n+' '+c.m+' '+c.r).toLowerCase().includes(q)));
  $('#cueList').innerHTML=`<div class="legend">${lvl.map((l,i)=>`<span><i class="dot s${i}"></i>${l}${i?' stress':''}</span>`).join('')}</div>`+
   (list.map(c=>`<div class="cue"><i class="dot s${c.s}"></i><div><b>${esc(c.n)}</b><div class="m">${esc(c.m)}</div><div class="ref">${esc(c.r)} · ${lvl[c.s]}${c.s?' stress':''}${c.drs?` · rated ${c.drs}/4 on the book's deception scale`:''} · p. ${esc(c.p)}</div>${cueActs(c)}</div></div>`).join('')||'<div class="empty">No cues match.</div>');
  figList=list.filter(c=>has3d(c)||hasPhoto(c)).map(c=>BO.cues.indexOf(c));
  $$('[data-fig]').forEach(b=>b.onclick=()=>openFig(+b.dataset.fig,'3d'));
  $$('[data-photo]').forEach(b=>b.onclick=()=>openFig(+b.dataset.photo,'photo'));
}

/* ---------- 3D "Show me" figure (three.js + figure code load only when first opened) ---------- */
const F3=window.BO3D;
function has3d(c){return !!(F3&&F3.cues[F3.key(c.n)])}
const PH=window.BO_PHOTOS||{};
function photosOf(c){return F3?PH[F3.key(c.n)]||[]:[]}
function hasPhoto(c){return photosOf(c).length>0}
function credit(p,long){return `Photo: ${p.byUrl?`<a href="${esc(p.byUrl)}" target="_blank" rel="noopener">${esc(p.by)}</a>`:esc(p.by)} · ${p.licUrl?`<a href="${esc(p.licUrl)}" target="_blank" rel="noopener">${esc(p.lic)}</a>`:esc(p.lic)}${long?` · <a href="${esc(p.src)}" target="_blank" rel="noopener">source</a>`:''}`}
function cueActs(c){
  const i=BO.cues.indexOf(c),ph=photosOf(c),b3=has3d(c);
  if(!b3&&!ph.length)return '';
  const p=ph[0];
  return `<div class="cue-acts">${b3?`<button class="show3d" data-fig="${i}">▶ Show me in 3D</button>`:''}${ph.length?`<button class="show3d alt" data-photo="${i}">Real example${ph.length>1?` (${ph.length})`:''}</button>`:''}</div>`+
   (p?`<figure class="cue-photo"><button data-photo="${i}" aria-label="Open the real example photo"><img src="${esc(p.f)}" alt="${esc(p.cap)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async"></button><figcaption>${credit(p)}</figcaption></figure>`:'');
}
let figList=[],figIdx=-1,figCtl=null,figLoading=null;
function figShell(){
  let el=$('#fig');if(el)return el;
  el=document.createElement('div');el.id='fig';el.className='fig';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Cue demo');
  el.innerHTML=`<div class="fig-panel"><div class="fig-grab" aria-hidden="true"></div>
   <div class="fig-top"><button class="icon-btn" id="figPrev" aria-label="Previous cue">‹</button><div class="fig-title"><b id="figName"></b><small id="figMeta"></small></div><button class="icon-btn" id="figNext" aria-label="Next cue">›</button><button class="icon-btn" id="figClose" aria-label="Close">✕</button></div>
   <div class="fig-seg" id="figSeg" role="tablist" aria-label="View"><button role="tab" data-mode="3d">3D</button><button role="tab" data-mode="photo">Photo</button><i aria-hidden="true"></i></div>
   <div class="fig-stage" id="figStage"><div class="fig-photo" id="figPhoto" hidden><div class="ph-track" id="phTrack"></div><div class="ph-dots" id="phDots"></div></div><div class="fig-load" id="figLoad">Loading 3D figure…</div><div class="fig-phase" id="figPhase">Baseline</div><div class="fig-hint">Drag to turn · pinch or scroll to zoom</div></div>
   <div class="fig-bar"><i id="figProg"></i></div>
   <div class="fig-ctrl"><button id="figReplay">↺ Replay</button><button id="figPause">❚❚ Pause</button><button id="figSlow">½× speed</button><button id="figHl" class="on">✦ Highlight</button><button id="figView">Reset view</button></div>
   <div class="fig-info"><div id="figMeaning"></div><div id="figNote" class="caveat"></div><p class="caveat" id="figCav3d">The figure starts at a neutral <b>baseline</b>, shows the cue, then returns. One cue is never proof: compare with their baseline, look for clusters of 3+, and consider context.</p><p class="caveat" id="figCavPh">The photo shows what the gesture looks like, not what this person was thinking or feeling. One cue is never proof: compare with someone's baseline, look for clusters of 3+, and consider context.</p></div></div>`;
  document.body.appendChild(el);
  $('#figClose').onclick=()=>closeFig();
  $('#figPrev').onclick=()=>stepFig(-1);$('#figNext').onclick=()=>stepFig(1);
  $('#figReplay').onclick=()=>figCtl&&figCtl.replay();
  $('#figPause').onclick=e=>{if(!figCtl)return;const on=figCtl.toggle();e.currentTarget.textContent=on?'❚❚ Pause':'▶ Play'};
  $('#figSlow').onclick=e=>{if(!figCtl)return;const b=e.currentTarget,slow=!b.classList.contains('on');b.classList.toggle('on',slow);figCtl.setSpeed(slow?0.5:1)};
  $('#figHl').onclick=e=>{if(!figCtl)return;const b=e.currentTarget,on=!b.classList.contains('on');b.classList.toggle('on',on);figCtl.setHighlight(on)};
  $('#figView').onclick=()=>figCtl&&figCtl.resetView();
  $$('#figSeg button').forEach(b=>b.onclick=()=>openFig(figIdx,b.dataset.mode));
  const tr=$('#phTrack');tr.addEventListener('scroll',()=>{const k=Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth));$$('#phDots i').forEach((d,j)=>d.classList.toggle('on',j===k));const c=$$('#phTrack figure')[k];if(c)$('#figNote').innerHTML=c.dataset.cred},{passive:true});
  document.addEventListener('keydown',e=>{if(!el.classList.contains('open'))return;if(e.key==='Escape')closeFig();else if(e.key==='ArrowRight')stepFig(1);else if(e.key==='ArrowLeft')stepFig(-1)});
  window.addEventListener('popstate',()=>{if(el.classList.contains('open'))closeFig(true)});
  el.addEventListener('click',e=>{if(e.target===el)closeFig()});
  // swipe the sheet down by its header to dismiss (phone)
  const top=el.querySelector('.fig-top'),pan=el.querySelector('.fig-panel');let y0=null;
  top.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;pan.style.transition='none'},{passive:true});
  top.addEventListener('touchmove',e=>{if(y0==null)return;const dy=Math.max(0,e.touches[0].clientY-y0);pan.style.transform=`translateY(${dy}px)`},{passive:true});
  top.addEventListener('touchend',e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;y0=null;pan.style.transition='';pan.style.transform='';if(dy>90)closeFig()});
  return el;
}
function webglOK(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}}
let figMode='3d';
function openFig(i,mode){
  const el=figShell(),c=BO.cues[i];if(!c)return;
  const b3=has3d(c),ph=photosOf(c);
  mode=mode||figMode;if(mode==='3d'&&!b3)mode='photo';if(mode==='photo'&&!ph.length)mode='3d';figMode=mode;
  const same=figIdx===i;figIdx=i;
  if(!el.classList.contains('open')){clearTimeout(figHide);el.classList.add('open');document.body.classList.add('fig-open');requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('shown')));history.pushState({fig:1},'')}
  $('#figName').textContent=c.n;$('#figMeta').textContent=`${c.r} · ${lvl[c.s]}${c.s?' stress':''} · p. ${c.p}`;
  $('#figMeaning').innerHTML=`<b>What it can mean:</b> ${esc(c.m)}`;
  const pos=figList.indexOf(i);$('#figPrev').disabled=pos<=0;$('#figNext').disabled=pos<0||pos>=figList.length-1;
  const seg=$('#figSeg');seg.hidden=!(b3&&ph.length);seg.dataset.mode=mode;
  $$('#figSeg button').forEach(b=>{const on=b.dataset.mode===mode;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  el.classList.toggle('photo-mode',mode==='photo');
  const pane=$('#figPhoto');pane.hidden=mode!=='photo';
  $('#figCav3d').hidden=mode!=='3d';$('#figCavPh').hidden=mode!=='photo';
  if(mode==='photo'){
    figCtl&&figCtl.stop();
    if(!same||pane.dataset.cue!==String(i)){pane.dataset.cue=i;
      $('#phTrack').innerHTML=ph.map((p,k)=>`<figure data-cred="${esc(credit(p,true))}"><img src="${esc(p.f)}" alt="${esc(p.cap)}" width="${p.w}" height="${p.h}" decoding="async" ${k?'loading="lazy"':''}><figcaption>${esc(p.cap)}</figcaption></figure>`).join('');
      $('#phTrack').scrollLeft=0;
      $('#phDots').innerHTML=ph.length>1?ph.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join(''):'';}
    $('#figNote').innerHTML=credit(ph[0],true);$('#figNote').dataset.v='';
    return;
  }
  $('#figNote').innerHTML='';$('#figNote').dataset.v='';
  figCtl&&figCtl.start();
  const spec=F3.cues[F3.key(c.n)];
  if(!webglOK()){const l=$('#figLoad');if(l)l.textContent='Sorry, this browser can’t show 3D graphics.';return}
  if(!figLoading)figLoading=import('./figure/viewer.js').then(m=>m.mount($('#figStage'),{onTick:s=>{const ph=$('#figPhase');ph.textContent=s.label;ph.classList.toggle('cue',s.cue);$('#figProg').style.width=(100*s.t/s.total).toFixed(1)+'%';const n=$('#figNote');if(figMode==='3d'&&n.dataset.v!==(s.note||'')){n.dataset.v=s.note||'';n.textContent=s.note||''}}})).then(ctl=>{
    figCtl=ctl;const l=$('#figLoad');if(l)l.remove();return figCtl});
  figLoading.then(ctl=>{if(figIdx!==i||figMode!=='3d')return;ctl.start();ctl.play(spec);$('#figPause').textContent='❚❚ Pause';ctl.setHighlight($('#figHl').classList.contains('on'));ctl.setSpeed($('#figSlow').classList.contains('on')?0.5:1)})
   .catch(err=>{console.warn(err);figLoading=null;const l=$('#figLoad');if(l)l.textContent='Couldn’t load the 3D figure. Check your connection and try again.'});
}
function stepFig(d){const pos=figList.indexOf(figIdx)+d;if(pos>=0&&pos<figList.length)openFig(figList[pos])}
let figHide=0;
function closeFig(fromPop){const el=$('#fig');if(!el||!el.classList.contains('open'))return;el.classList.remove('shown');document.body.classList.remove('fig-open');
  const ms=matchMedia('(prefers-reduced-motion: reduce)').matches?0:380;figHide=setTimeout(()=>{el.classList.remove('open');figCtl&&figCtl.stop()},ms);
  if(!fromPop&&history.state&&history.state.fig)history.back()}
$('#cueSearch').oninput=renderCues;

/* ---------- talk ---------- */
function acc(sum,inner){return `<details class="acc"><summary>${sum}</summary><div class="in">${inner}</div></details>`}
function renderTalk(){
  $('#goalList').innerHTML=BO.goals.map(g=>acc(`${g.e} ${esc(g.t)}`,`<ol>${g.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="caveat">pp. ${esc(g.p)}</div>`)).join('');
  $('#needList').innerHTML=Object.values(BO.needs).map(x=>acc(`${x.emoji} ${esc(x.name)} <small>${esc(x.tier)}</small>`,
    `<div class="q">${esc(x.q)}</div><b>Signs</b><ul>${x.signs.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><b>Give them:</b> ${esc(x.give)}<br><b>Fear:</b> ${esc(x.fear)}<br>${x.say.map(copyBtn).join('')}<b>Avoid</b><ul>${x.avoid.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><b>Asking:</b> ${esc(x.ask)}<div class="caveat">p. ${x.p}</div>`)).join('');
  $('#decList').innerHTML=Object.values(BO.decisions).map(x=>acc(`${x.emoji} ${esc(x.name)}`,`<div class="q">${esc(x.q)}</div><b>Signs</b><ul>${x.signs.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><b>Frame:</b> ${esc(x.frame)}${x.lines.map(copyBtn).join('')}<div class="caveat">p. ${x.p}</div>`)).join('');
  $('#valList').innerHTML=Object.values(BO.values).map(x=>acc(`${x.emoji} ${esc(x.name)}`,`<div class="q">You'll hear: ${esc(x.hear)}</div>${esc(x.tie)}<div class="caveat">pp. 386–389</div>`)).join('');
  $('#animalList').innerHTML=acc('🐾 The 8 conflict animals',`<p class="caveat">How people protect themselves under pressure (p. 284). Spot theirs and meet the fear underneath.</p><ul>${BO.animals.map(a=>`<li>${a.e} <b>${esc(a.n)}</b>: ${esc(a.m)}</li>`).join('')}</ul>`);
}

/* ---------- about ---------- */
$('#infoBtn').onclick=()=>dialog(`<h3 style="margin-top:0">About this guide</h3>
<p>A pocket study aid built from <b>Chase Hughes, <i>The Behavior Ops Manual</i></b>. Everything here is summarised in my own words, with book page references (p.), so you can go back to the source. All credit for the frameworks goes to Hughes. Buy the book for the full depth.</p>
<p><b>Covered:</b> the Six-Minute X-Ray (Needs, Decision, Values maps, sensory words, pronouns), body-language cues and the Behavioral Table of Elements, elicitation, de-escalation, rapport and the 25-week drills.</p>
<p><b>Ethics:</b> use this to understand people and connect better, not to manipulate them. Covert-coercion material from the book (interrogation, false-memory and "enhanced" tactics) is deliberately left out. No single cue proves a lie. Always baseline, look for clusters, and consider context.</p>
<p class="caveat">Your saved people stay in this browser only. Nothing is sent anywhere.</p>`);

renderGroups();renderCard();renderRegions();renderCues();renderTalk();renderPeople();
const h=location.hash.slice(1);if(['profile','cues','talk','ask','watch','people'].includes(h))show(h);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
