/* Ask engine: client-side search + answer composer over window.ASK_KB.
   Hand-rolled BM25F + aliases + synonyms + fuzzy matching. No network, no AI API. */
(function(){
'use strict';
const STOP=new Set('a an the and or but if of to in on at by for with from as is are was were be been being am do does did doing have has had having i me my we our you your he him his she her they them their it its this that these those what which who whom whose why how when where can could would should will shall may might must just so very really about into over under than then there here also any some such not no yes please tell explain say says mean means meaning know want get got thing things something someone somebody person people one ones like give show let lets us im youre dont does doesnt isnt whats hows chase hughes hughes\'s according book manual his kind sort way ways use using used'.split(' '));
const KEEP=new Set(['no','not','yes','they','we','i']); // keep inside alias phrases only
// spelling + synonym normalisation (single tokens)
const NORM={behaviour:'behavior',behaviours:'behavior',behavioural:'behavioral',colour:'color',favour:'favor',favourite:'favorite',organise:'organize',recognise:'recognize',realise:'realize',apologise:'apologize',apologising:'apologize',hypnotise:'hypnotize',hypnotised:'hypnotize',sympathise:'sympathize',socialise:'socialize',criticise:'criticize',minimise:'minimize',rationalise:'rationalize',kinaesthetic:'kinesthetic',centre:'center',defence:'defense',judgement:'judgment',programme:'program',mum:'mom',sceptical:'skeptical',arguement:'argument'};
const SYN={
 lie:['deception','lying'],lies:['deception','lying'],lying:['deception','lie'],liar:['deception','lying'],liars:['deception','lying'],deceive:['deception'],deceiving:['deception'],dishonest:['deception'],honest:['truth','deception'],truthful:['truth'],
 neck:['throat'],throat:['neck'],touches:['touch'],touching:['touch'],rubs:['rub'],rubbing:['rub'],scratch:['hushing'],nose:['hushing','nostril'],mouth:['hushing','lip'],lips:['lip'],eyes:['eye','blink'],eye:['blink','eyes'],blinking:['blink'],blinks:['blink'],stare:['blink','eye'],staring:['blink','eye'],
 arms:['arm'],crossed:['cross'],crosses:['cross'],folded:['cross'],feet:['foot'],foot:['feet'],legs:['leg'],hands:['hand'],palms:['palm'],fingers:['finger'],shoulders:['shoulder'],shrugs:['shrug'],shrugging:['shrug'],
 nervous:['stress','anxiety'],anxious:['anxiety','stress'],stressed:['stress'],scared:['fear'],afraid:['fear'],angry:['anger','calm'],mad:['anger'],furious:['anger','calm'],upset:['calm','anger'],shouting:['anger','calm'],yelling:['anger','calm'],
 boss:['authority','leader'],manager:['authority','leader'],confident:['confidence'],shy:['open','confidence'],insecure:['insecurity','confidence'],charismatic:['charisma'],
 rapport:['connection','rapport'],connect:['connection'],trust:['connection','trust'],bond:['connection'],
 persuade:['persuasion','influence'],convince:['persuasion','influence'],influencing:['influence'],manipulate:['manipulation','influence'],manipulated:['manipulation'],manipulating:['manipulation'],manipulative:['manipulation','manipulator'],manipulation:['manipulation','circle'],
 sell:['sales'],selling:['sales'],salesman:['sales'],customer:['sales'],client:['sales'],buyer:['sales','decision'],
 skeptical:['objection','skeptical'],doubt:['objection'],hesitant:['objection'],hesitation:['objection'],pushback:['objection'],
 girlfriend:['partner','relationship'],boyfriend:['partner','relationship'],wife:['partner','relationship'],husband:['partner','relationship'],spouse:['partner','relationship'],date:['attraction'],dating:['attraction'],flirting:['attraction'],attracted:['attraction','attract'],
 kid:['child'],kids:['child'],children:['child'],son:['child'],daughter:['child'],
 talk:['conversation'],chat:['conversation'],conversations:['conversation'],stranger:['strangers','small'],strangers:['small','talk'],
 remember:['memory'],memories:['memory'],brain:['neurology','brain'],
 cult:['cult'],cults:['cult'],group:['tribe'],peer:['tribe','social'],
 word:['term'],term:['glossary'],define:['glossary'],definition:['glossary'],
 practise:['practice','training'],practice:['training'],learn:['training'],improve:['training'],
 habit:['habits'],habits:['habit'],goals:['goal'],discipline:['discipline'],
 interrogation:['interrogation','confession'],police:['interrogation','confession'],cop:['interrogation'],
 narcissist:['narcissist','manipulator'],narcissistic:['narcissist'],toxic:['manipulator'],gaslighting:['manipulator','false memory'],
 bias:['biases'],biases:['bias'],fallacy:['bias'],
 hypnotize:['hypnosis'],trance:['hypnosis'],
 argument:['conflict','argument'],arguing:['conflict','argument'],fight:['conflict'],disagree:['conflict'],
 pause:['pause'],pauses:['pause'],stutter:['pause'],
 smile:['smile'],smiling:['smile'],frown:['brow'],eyebrow:['brow','eyebrow'],eyebrows:['brow','eyebrow'],
};
function stem(w){
  if(w.length<=4)return w;
  if(/ies$/.test(w))return w.slice(0,-3)+'y';
  if(/(ss|us|is)$/.test(w))return w;
  if(/ing$/.test(w)&&w.length>5){w=w.slice(0,-3);if(/(.)\1$/.test(w))w=w.slice(0,-1);return w}
  if(/ed$/.test(w)&&w.length>5){w=w.slice(0,-2);if(/(.)\1$/.test(w))w=w.slice(0,-1);return w}
  if(/es$/.test(w)&&/(ch|sh|x|z)es$/.test(w))return w.slice(0,-2);
  if(/s$/.test(w))return w.slice(0,-1);
  return w;
}
function clean(s){return (Array.isArray(s)?s.join(' '):String(s||'')).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function toks(s,keepStop){return clean(s).split(' ').filter(w=>w&&(keepStop||!STOP.has(w))).map(w=>NORM[w]||w)}
function stems(s){return toks(s).map(stem)}
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;const m=a.length,n=b.length;let p=new Array(n+1),c=new Array(n+1);for(let j=0;j<=n;j++)p[j]=j;for(let i=1;i<=m;i++){c[0]=i;let best=c[0];for(let j=1;j<=n;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));if(c[j]<best)best=c[j]}if(best>max)return max+1;[p,c]=[c,p]}return p[n]}

let E=[],IDX=null,BYID={},VOCAB=[],DF={},N=0,AVG={};
const FW={t:4,a:3.2,k:2.2,s:1.3,d:.6,x:.35}; // field weights
function build(kb){
  E=kb.entries;BYID={};E.forEach(e=>BYID[e.i]=e);N=E.length;
  const lens={t:0,a:0,k:0,s:0,d:0,x:0};
  IDX=E.map(e=>{
    const f={t:stems(e.t),a:stems(e.a.join(' ')),k:stems(e.k),s:stems(e.s),d:stems(e.d),x:stems([e.u,(e.e||[]).join(' '),(e.f||[]).join(' ')].join(' '))};
    const tf={};for(const k in f){lens[k]+=f[k].length;const m={};f[k].forEach(w=>m[w]=(m[w]||0)+1);tf[k]=m}
    const all=new Set();for(const k in f)f[k].forEach(w=>all.add(w));all.forEach(w=>DF[w]=(DF[w]||0)+1);
    const phr=[clean(e.t),...e.a.map(clean)].filter(Boolean);
    return {tf,len:Object.fromEntries(Object.keys(f).map(k=>[k,f[k].length])),phr};
  });
  for(const k in lens)AVG[k]=lens[k]/N||1;
  VOCAB=Object.keys(DF);
}
function idf(w){const df=DF[w]||0;return Math.log(1+(N-df+.5)/(df+.5))}
function expand(q){
  // returns map stem->weight
  const out={};const raw=toks(q);
  const add=(w,wt)=>{const s=stem(w);if(!s||STOP.has(s))return;out[s]=Math.max(out[s]||0,wt)};
  raw.forEach(w=>{add(w,1);(SYN[w]||SYN[stem(w)]||[]).forEach(x=>x.split(' ').forEach(y=>add(y,.6)))});
  // fuzzy for unknown stems
  Object.keys(out).forEach(s=>{
    if(DF[s]||s.length<4)return;const max=s.length>=7?2:1;let best=null,bd=9;
    for(const v of VOCAB){if(Math.abs(v.length-s.length)>max||v[0]!==s[0])continue;const d=lev(s,v,max);if(d<bd){bd=d;best=v}if(bd===0)break}
    if(best&&bd<=max){out[best]=Math.max(out[best]||0,out[s]*(bd===1?.85:.65))}
  });
  return out;
}
function intent(q){
  const s=' '+clean(q)+' ';
  return {
    cue:/ when (someone|somebody|they|he|she|people|a person|my \w+)|(what does|what do) .*(mean|signal|indicate)| (means|meaning) | body language | gesture | sign of |signs of/.test(s),
    term:/ word for | term for | what is the (word|term|name)| called |^ define | definition| glossary| stand for | acronym/.test(s),
    how:/ how (do|can|should|would) (i|you|we)| how to | tips | what should i (say|do)| what do i say| help me | technique/.test(s),
    def:/ is (this|it|he|she|that) (manipulat|lying|a cult|hypnot)| am i being | protect | defend | spot | recognise | recognize | red flag/.test(s),
    about:/ who is | who s | his books | about him | background /.test(s),
  };
}
const CATB={cue:{cues:1.35,bte:1.15},term:{glossary:1.5,models:1.15,foundations:1.1},how:{influence:1.15,training:1.15,authority:1.1,profiling:1.05},def:{defensive:1.35,biases:1.1},about:{about:2}};
function score(q,opt={}){
  if(!IDX)return [];
  const qs=expand(q);const qc=' '+clean(q)+' ';const it=intent(q);
  const k1=1.2,b=.72;const res=[];
  for(let n=0;n<N;n++){
    const ix=IDX[n];let sc=0,hit=0;
    for(const w in qs){
      const id=idf(w);let tfw=0;
      for(const f in FW){const t=ix.tf[f][w];if(t)tfw+=FW[f]*t/(1-b+b*ix.len[f]/AVG[f])}
      if(tfw>0){hit+=qs[w];sc+=qs[w]*id*(tfw*(k1+1))/(tfw+k1)}
    }
    // phrase boosts: alias/title fully inside query, or query inside alias
    let pb=0;for(const p of ix.phr){if(p.length<3)continue;
      if(qc.includes(' '+p+' ')){pb=Math.max(pb,p.split(' ').length>1?6+p.length/6:3)}
      else if(p.split(' ').length>1&&(' '+p+' ').includes(qc)&&qc.trim().split(' ').length>1)pb=Math.max(pb,4)}
    sc+=pb;
    if(sc<=0)continue;
    const cov=hit/Math.max(1,Object.keys(qs).length);sc*=(.55+.45*Math.min(1,cov));
    const e=E[n];for(const k in it)if(it[k]&&CATB[k][e.c])sc*=CATB[k][e.c];
    if(opt.ctx&&opt.ctx.includes(e.i))sc*=1.08;
    res.push({e,sc});
  }
  res.sort((a,b)=>b.sc-a.sc);return res;
}
// follow-up handling ---------------------------------------------------------
const FU={deeper:/^(more|tell me more|more please|go deeper|deeper|explain( more| that| it| this)?|elaborate|why( is that| does that work| does it work)?|and|details?|go on|continue|keep going|expand( on (it|that|this))?|say more)$/,
  example:/\b(examples?|for instance|show me|what would (i|that) say|what do i say|script|phrasing|phrase it|sound like)\b/,
  use:/\b(how do i (use|apply|do|practi[cs]e) (it|this|that)|use it|apply (it|this)|in practice|practically|what should i do)\b/,
  related:/\b(related|similar|what else|anything else|other)\b/};
function isFollow(q){const w=clean(q).split(' ');const pron=/\b(it|this|that|they|them|those|these|he|she|him|her)\b/.test(clean(q));return w.length<=7&&(pron||Object.values(FU).some(r=>r.test(clean(q))))}
function answer(q,state){
  state=state||{};const last=state.last&&BYID[state.last];const cq=clean(q);
  if(last&&isFollow(q)){
    let mode=null;for(const k in FU)if(FU[k].test(cq)){mode=k;break}
    // a follow-up that clearly names a new topic is treated as a new question
    const bare=score(q);const nw=cq.split(' ').length;
    const strong=bare[0]&&bare[0].e.i!==last.i&&(bare[0].sc>(mode?11:9))&&nw>3;
    if(!strong){
      if(mode==='related')return {kind:'related',main:last,alts:(last.r||[]).filter(r=>BYID[r]).slice(0,5).map(r=>BYID[r])};
      if(mode||!bare[0]||bare[0].sc<9){
        if(!mode){const sc=score(q+' '+last.t+' '+(last.a[0]||''),{ctx:[last.i]});if(sc[0]&&sc[0].e.i!==last.i&&sc[0].sc>12)return pack(sc,q,'follow');mode='deeper'}
        return {kind:'follow',mode,main:last,alts:[]};
      }
    }
  }
  const sc=score(q,{ctx:state.recent||[]});
  return pack(sc,q);
}
function pack(sc,q,kind){
  if(!sc.length||sc[0].sc<5){
    // try fuzzy suggestions from looser scoring
    return {kind:'unsure',alts:sc.slice(0,4).map(x=>x.e),tip:tipFor(q)};
  }
  const top=sc[0];const alts=[];
  for(const x of sc.slice(1,8)){if(alts.length>=3)break;if(x.sc>=top.sc*.5)alts.push(x.e)}
  const second=sc[1]&&sc[1].sc>=top.sc*.78&&sc[1].e.c!==top.e.c?sc[1].e:null;
  return {kind:kind||'answer',main:top.e,second,alts,conf:top.sc<8?'low':'ok',score:top.sc};
}
function tipFor(q){
  const w=clean(q).split(' ').length;
  if(w<=2)return 'Try a fuller question, such as “what does it mean when someone ___”, or a term like “baseline” or “Six-Axis”.';
  if(/\b(he|she|they)\b/.test(clean(q)))return 'Try naming the behaviour itself (“touches their neck”, “pauses before answering”) or the situation (“my boss keeps interrupting”).';
  return 'Hughes’ terms work best: needs, decision styles, frames, authority, elicitation, baseline, clusters, cognitive biases.';
}
window.ASK_ENGINE={build,score,answer,expand,clean,byId:id=>BYID[id],all:()=>E};
})();
