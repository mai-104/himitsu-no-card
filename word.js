/* 秘密のカード：グループ分けソリティア（試作） */
(()=>{
const {$,load,save,del,pref,BG,show,fmt,BACKS,openSheet}=window.HC;

/* ---------- 仮置きのグループ（あとで差し替え） ---------- */
const WORDS=[
 {t:'果物',w:['りんご','みかん','ぶどう','もも','バナナ']},
 {t:'野菜',w:['にんじん','キャベツ','玉ねぎ','ピーマン','大根']},
 {t:'動物園',w:['ライオン','ゾウ','キリン','パンダ','ゴリラ']},
 {t:'水族館',w:['イルカ','クラゲ','ラッコ','マンボウ','ウミガメ']},
 {t:'鳥',w:['スズメ','カラス','ツバメ','フクロウ','インコ']},
 {t:'虫',w:['カブトムシ','チョウ','トンボ','セミ','テントウムシ']},
 {t:'花',w:['ひまわり','チューリップ','バラ','アサガオ','タンポポ']},
 {t:'天気',w:['晴れ','くもり','雨','雪','雷']},
 {t:'乗り物',w:['電車','バス','飛行機','自転車','船']},
 {t:'スイーツ',w:['プリン','ショートケーキ','パフェ','シュークリーム','ドーナツ']},
 {t:'楽器',w:['ピアノ','ギター','バイオリン','たいこ','トランペット']},
 {t:'文房具',w:['えんぴつ','消しゴム','じょうぎ','ホッチキス','のり']},
 {t:'調理道具',w:['フライパン','ボウル','おたま','まな板','ほうちょう']},
 {t:'スポーツ',w:['サッカー','野球','テニス','水泳','バスケットボール']},
 {t:'仕事',w:['医者','パイロット','警察官','消防士','大工']},
 {t:'宝石',w:['ダイヤモンド','ルビー','サファイア','エメラルド','しんじゅ']},
 {t:'星座',w:['おひつじ座','ふたご座','しし座','さそり座','うお座']},
 {t:'体の部分',w:['目','耳','口','手','足']},
 {t:'家具',w:['ソファ','ベッド','たんす','テーブル','本だな']},
 {t:'イベント',w:['お正月','節分','成人式','誕生日','クリスマス']},
 {t:'レストラン',w:['ナポリタン','オムライス','ハンバーグ','カレーライス','グラタン']},
 {t:'本屋',w:['絵本','まんが','ずかん','辞書','雑誌']},
 {t:'学校',w:['国語','算数','理科','社会','音楽']},
];
/* モードの設定（数字を変えるだけで調整できる） */
const MODES={
 n:{name:'ふつう',groups:10,per:5,ups:[5,4,3,2,1],hint:3,shuf:1,undo:3},
 h:{name:'むずかしい',groups:12,per:6,ups:[5,4,3,2,1],hint:3,shuf:1,undo:3},
};
const NSLOT=4, NCOL=5, NEED=5;

/* ---------- 画面（HTML） ---------- */
const css=`
#wgame .wcard{position:absolute;left:0;top:0;width:var(--ww);height:var(--wh);transition:transform .17s ease;will-change:transform}
#wgame .wcard.dragging{transition:none}
#wgame .wcard .in{position:absolute;inset:0}
#wgame .wcard .bk{position:absolute;left:50%;top:50%;width:var(--wh);height:var(--ww);transform:translate(-50%,-50%) rotate(90deg);background:var(--back) center/100% 100% no-repeat;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))}
#wgame .wcard .fc{position:absolute;inset:0;display:none;background:#fffdf7;border:1px solid #cdbfae;border-radius:calc(var(--wh)*.14);box-shadow:0 1px 2px rgba(0,0,0,.3);overflow:hidden;color:#3a3150}
#wgame .wcard.up .fc{display:block}
#wgame .wcard.up .bk{display:none}
#wgame .wcard .wd{position:absolute;left:4%;right:4%;top:0;height:calc(var(--wh)*.46);display:flex;align-items:center;justify-content:center;font-weight:700;white-space:nowrap;line-height:1}
#wgame .wcard.ttl .fc{background:linear-gradient(180deg,#fff2c4,#ffd98a);border-color:#d9a640;color:#6b3e00}
#wgame .wcard.ttl .wd{font-weight:800}
#wgame .wcard .lb{position:absolute;left:0;right:0;bottom:8%;text-align:center;font-size:calc(var(--wh)*.2);opacity:.75;font-weight:700}
#wgame .wcard.hint .fc{box-shadow:0 0 0 3px #ffd34d,0 1px 2px rgba(0,0,0,.3)}
#wgame .wcard.shake .in{animation:shake .3s}
#wgame .wcard.gone{transition:transform .35s ease,opacity .35s ease;opacity:0}
#wgame .wslot{position:absolute;left:0;top:0;width:var(--ww);height:var(--wh);border:2px dashed var(--slot);border-radius:calc(var(--wh)*.14);display:flex;align-items:center;justify-content:center;color:var(--slot);font-size:calc(var(--wh)*.24);font-weight:700;text-align:center;line-height:1.2}
/* マスキングテープ（同じグループがつながったとき） */
#wgame .wcard.tape::before,#wgame .wcard.tape::after{content:"";position:absolute;top:calc(var(--wh)*-.13);width:calc(var(--ww)*.13);height:calc(var(--wh)*.36);z-index:2;
 background-color:var(--tapeA);background-image:linear-gradient(90deg,var(--tapeB) 50%,transparent 50%),linear-gradient(var(--tapeB) 50%,transparent 50%);background-size:6px 6px;opacity:.88;
 clip-path:polygon(0 8%,20% 0,40% 8%,60% 0,80% 8%,100% 0,100% 92%,80% 100%,60% 92%,40% 100%,20% 92%,0 100%)}
#wgame .wcard.tape::before{left:6%;transform:rotate(-6deg)}
#wgame .wcard.tape::after{right:6%;transform:rotate(5deg)}
body.t0{--tapeA:#ff9fbf;--tapeB:rgba(255,255,255,.55)}
body.t1{--tapeA:#2c3f8f;--tapeB:rgba(255,215,120,.6)}
body.t2{--tapeA:#59c4ee;--tapeB:rgba(210,255,150,.6)}
#wDone{position:absolute;left:0;right:0;bottom:6px;display:flex;flex-wrap:wrap;justify-content:center;gap:5px;padding:0 6px;z-index:5;pointer-events:none}
#wDone .chip{background:linear-gradient(180deg,#fff2c4,#ffd98a);border:1px solid #d9a640;color:#6b3e00;border-radius:8px;font-size:12px;font-weight:800;padding:5px 2px;text-align:center;white-space:nowrap;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pop .4s ease}
#wDone .chip::before{content:"✓ ";color:#2f9a4a}
@keyframes pop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
#wwin{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);z-index:3000}
#wwin.on{display:flex}
#wwin .box{background:var(--btn);color:var(--btnInk);border-radius:22px;padding:24px 22px;width:84%;max-width:340px;text-align:center}
#wwin h2{margin:0 0 8px;font-size:28px}
#wwin p{margin:4px 0 12px;font-size:15px}
#wwin .big{background:var(--btnInk);color:var(--btn)}
#wwin .big.sub2{background:rgba(0,0,0,.08);color:var(--btnInk)}
#wPauseLbl{position:absolute;left:50%;top:78%;white-space:nowrap;transform:translate(-50%,-50%);z-index:1500;background:var(--bar);color:var(--ink);padding:14px 22px;border-radius:16px;font-size:16px;font-weight:700;text-align:center;display:none;pointer-events:none;backdrop-filter:blur(4px)}
#wPauseLbl small{display:block;font-size:12px;font-weight:400;margin-top:4px}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const sec=document.createElement('section');
sec.id='wgame';sec.className='screen play';
sec.innerHTML=`
 <div class="tools">
  <button class="tb menu" id="wSheetBtn" aria-label="メニュー">≡</button>
  <span id="wHints"></span>
  <span class="sp"></span>
  <span id="wShufs"></span>
  <span id="wUndos"></span>
 </div>
 <div class="info"><span id="wMoves">0手</span><span id="wTime">0:00</span></div>
 <div id="wboard" style="position:relative;flex:1;overflow:hidden;touch-action:none"><div id="wDone"></div><div id="wPauseLbl">一時停止中<small>カードにさわると再開します</small></div></div>
 <div class="bar">
  <button id="wMenuBtn" style="flex:2"><small>⌂</small>タイトルへ戻る</button>
  <button id="wPauseBtn"><small>⏸</small>一時停止</button>
  <button id="wNewBtn"><small>✦</small>NEW</button>
 </div>`;
document.body.insertBefore(sec,$('sheet'));
const win=document.createElement('div');win.id='wwin';
win.innerHTML=`<div class="box"><h2>クリア！</h2><p id="wWinTxt"></p><button class="big" id="wAgainBtn">もう一度あそぶ</button><button class="big sub2" id="wToMenuBtn">メニューへ</button></div>`;
document.body.appendChild(win);
['#wHints','#wShufs','#wUndos'].forEach(q=>{const e=document.querySelector(q);e.style.display='contents'});

/* ---------- 状態 ---------- */
let G=null, undo=[], busy=false, paused=false, els={}, pos={}, CARD={};
const board=$('wboard');
const key=m=>'hc_word_'+m;

function newGame(mode){
 const M=MODES[mode];
 const pick=WORDS.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,M.groups);
 const cards=[];
 pick.forEach(wi=>{
  cards.push({id:cards.length,g:wi,t:1,label:WORDS[wi].t});
  WORDS[wi].w.forEach(w=>cards.push({id:cards.length,g:wi,t:0,label:w}));
 });
 const deck=cards.map(c=>c.id);
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
 const tab=[];
 for(let c=0;c<NCOL;c++){
  const up=M.ups[c], down=M.per-up, col=[];
  for(let k=0;k<down;k++)col.push({id:deck.pop(),up:false});
  for(let k=0;k<up;k++)col.push({id:deck.pop(),up:true});
  tab.push(col);
 }
 G={mode,cards,groups:pick.length,stock:deck.map(id=>({id,up:false})),waste:[],slots:[null,null,null,null],tab,done:0,cleared:[],
    moves:0,time:0,started:false,won:false,hint:M.hint,shuf:M.shuf,undo:M.undo};
 undo=[];
 buildEls(); persist();
}
function persist(){if(G)save(key(G.mode),G)}
function snap(){undo.push(JSON.stringify({stock:G.stock,waste:G.waste,slots:G.slots,tab:G.tab,done:G.done,cleared:G.cleared,moves:G.moves}));if(undo.length>300)undo.shift()}

/* ---------- カードの見た目 ---------- */
function buildEls(){
 board.querySelectorAll('.wcard,.wslot').forEach(e=>e.remove());
 els={};pos={};CARD={};
 G.cards.forEach(c=>{
  CARD[c.id]=c;
  const el=document.createElement('div');
  el.className='wcard'+(c.t?' ttl':'');
  el.innerHTML=`<div class="in"><div class="bk"></div><div class="fc"><div class="wd">${c.label}</div>${c.t?'<div class="lb">タイトル</div>':''}</div></div>`;
  board.appendChild(el); els[c.id]=el;
 });
 for(let i=0;i<NSLOT;i++){const d=document.createElement('div');d.className='wslot';d.dataset.pile='slot';d.dataset.pi=i;d.textContent='タイトルを\n置く';d.style.whiteSpace='pre';board.appendChild(d);slotEls[i]=d}
 const s=document.createElement('div');s.className='wslot';s.dataset.pile='stock';s.textContent='↻';board.appendChild(s);slotEls.stock=s;
}
const slotEls={};

/* ---------- レイアウト ---------- */
let cw=70,ch=46,gap=5,offX=0,y0=6,yW=60,tabTop=120,os=20;
const colX=i=>offX+gap+i*(cw+gap);
function layout(){
 if(!G)return;
 const W=board.clientWidth, H=board.clientHeight, bw=Math.min(W,600);
 gap=Math.max(4,Math.round(bw*.014));
 cw=Math.floor((bw-gap*(NCOL+1))/NCOL); ch=Math.round(cw*.7);
 offX=Math.round((W-(cw*NCOL+gap*(NCOL+1)))/2);
 y0=gap; yW=y0+ch+gap; os=0; tabTop=yW+ch+gap*2;
 const R=document.documentElement.style;R.setProperty('--ww',cw+'px');R.setProperty('--wh',ch+'px');
 for(let i=0;i<NSLOT;i++)slotEls[i].style.transform=`translate(${colX(i)}px,${y0}px)`;
 slotEls.stock.style.transform=`translate(${colX(4)}px,${y0}px)`;
 G.cards.forEach(c=>{const wd=els[c.id].querySelector('.wd');const len=[...c.label].length;wd.style.fontSize=Math.min(ch*.3,(cw*.92)/Math.max(len,2.2))+'px'});
 render();
}
function renderDone(){
 const box=$('wDone'),list=G.cleared||[];
 if(box.childElementCount!==list.length){
  box.innerHTML='';list.forEach(t=>{const d=document.createElement('div');d.className='chip';d.style.width=cw+'px';d.textContent=t;box.appendChild(d)});
 }
}
function colOff(col){
 const avail=board.clientHeight-tabTop-8-$('wDone').offsetHeight; let o=Math.round(ch*.55);
 if(col.length>1&&(col.length-1)*o+ch>avail)o=Math.max(8,Math.floor((avail-ch)/(col.length-1)));
 return o;
}
function place(p,x,y,z,pile,pi,idx){
 const el=els[p.id]; pos[p.id]={x,y};
 el.style.transform=`translate(${x}px,${y}px)`;el.style.zIndex=z;
 el.classList.toggle('up',p.up);el.classList.remove('tape');
 el.dataset.pile=pile;el.dataset.pi=pi;el.dataset.idx=idx;
}
function render(){
 const vis=new Set();
 G.stock.forEach((p,i)=>{place(p,colX(4),y0,10+i,'stock',0,i);vis.add(p.id)});
 G.waste.forEach((p,i)=>{place(p,colX(4),yW,10+i,'waste',0,i);vis.add(p.id)});
 G.slots.forEach((s,si)=>{
  slotEls[si].style.visibility=s?'hidden':'visible';
  if(!s)return;
  place({id:s.title,up:true},colX(si),y0,10,'slot',si,0);vis.add(s.title);
  s.names.forEach((id,i)=>{place({id,up:true},colX(si),yW,11+i,'slotn',si,i);vis.add(id)});
  els[s.title].querySelector('.lb').textContent=`${s.names.length} / ${NEED}`;
 });
 renderDone();
 G.tab.forEach((col,ci)=>{
  const o=colOff(col); let y=tabTop;
  col.forEach((p,i)=>{
   place(p,colX(ci),y,100+i,'tab',ci,i);vis.add(p.id);
   const prev=col[i-1], c=CARD[p.id];
   els[p.id].classList.toggle('tape',!!(prev&&prev.up&&p.up&&c.t===0&&CARD[prev.id].t===0&&CARD[prev.id].g===c.g));
   y+=o;
  });
 });
 G.cards.forEach(c=>{if(!vis.has(c.id)){const e=els[c.id];e.style.display='none'}else els[c.id].style.display=''});
 G.cards.filter(c=>c.t).forEach(c=>{if(!G.slots.some(s=>s&&s.title===c.id))els[c.id].querySelector('.lb').textContent='タイトル'});
 slotEls.stock.textContent=G.stock.length?'':(G.waste.length?'↻':'');
 $('wMoves').textContent=G.moves+'手';
 renderTools();
}

/* ---------- ルール ---------- */
function runAt(col,idx){ // idx から下が動かせるまとまりなら返す
 const r=col.slice(idx); if(!r.length||!r.every(p=>p.up))return null;
 const c0=CARD[r[0].id];
 if(c0.t===1)return r.length===1?r:null;
 return r.every(p=>CARD[p.id].t===0&&CARD[p.id].g===c0.g)?r:null;
}
function slotFor(run){
 const c=CARD[run[0].id];
 if(c.t===1)return G.slots.findIndex(s=>!s);
 return G.slots.findIndex(s=>s&&CARD[s.title].g===c.g&&s.names.length+run.length<=NEED);
}
function canSlotAt(run,si){
 const c=CARD[run[0].id], s=G.slots[si];
 if(c.t===1)return run.length===1&&!s;
 return !!s&&CARD[s.title].g===c.g;
}
function canTab(run,ci){
 const col=G.tab[ci]; if(!col.length)return true;
 const t=col[col.length-1], ct=CARD[t.id], c=CARD[run[0].id];
 return t.up&&ct.t===0&&c.t===0&&ct.g===c.g;
}
function pileOf(p,i){return p==='tab'?G.tab[i]:p==='waste'?G.waste:G.stock}
function slotTarget(src,run){if(src.pile==='slot'||src.pile==='slotn')return null;const si=slotFor(run);return si>=0?['slot',si]:null}
function tabTarget(src,run){
 const c=CARD[run[0].id];
 for(let i=0;i<NCOL;i++){if(src.pile==='tab'&&src.pi===i)continue;const col=G.tab[i];if(col.length&&canTab(run,i))return['tab',i]}
 if(!(src.pile==='tab'&&src.idx===0))for(let i=0;i<NCOL;i++)if(!G.tab[i].length)return['tab',i];
 return null;
}

function doMove(src,run,dest,di){
 snap();
 const from=pileOf(src.pile,src.pi);
 from.splice(from.length-run.length,run.length);
 if(dest==='tab')run.forEach(p=>G.tab[di].push({id:p.id,up:true}));
 else{
  const c=CARD[run[0].id];
  if(c.t===1)G.slots[di]={title:c.id,names:[]};
  else run.forEach(p=>G.slots[di].names.push(p.id));
 }
 if(src.pile==='tab'&&from.length&&!from[from.length-1].up)from[from.length-1].up=true;
 G.moves++;G.started=true;clearHint();
 const s=dest==='slot'?G.slots[di]:null;
 render();persist();
 if(s&&s.names.length===NEED)completeSlot(di);
}
function completeSlot(si){
 const s=G.slots[si]; busy=true;
 [s.title,...s.names].forEach(id=>{const e=els[id];e.classList.add('gone');e.style.transform+=' scale(1.25)'});
 setTimeout(()=>{
  [s.title,...s.names].forEach(id=>{els[id].classList.remove('gone')});
  (G.cleared=G.cleared||[]).push(CARD[s.title].label);G.slots[si]=null;G.done++;busy=false;
  render();persist();
  if(G.done===G.groups)winGame();
 },380);
}
function tapStock(){
 if(G.stock.length){snap();const p=G.stock.pop();p.up=true;G.waste.push(p)}
 else if(G.waste.length){snap();G.stock=G.waste.reverse().map(p=>(p.up=false,p));G.waste=[]}
 else return;
 G.moves++;G.started=true;clearHint();render();persist();
}
function shake(run){run.forEach(p=>{const e=els[p.id];e.classList.remove('shake');void e.offsetWidth;e.classList.add('shake')})}

/* タップ：1回で下の列、2回で上の置き場 */
let tapWait=null,lastTap={id:-1,t:0};
function onTap(src,run){
 const id=run[0].id,now=performance.now(),dbl=lastTap.id===id&&now-lastTap.t<700;
 lastTap={id,t:now};
 if(tapWait){clearTimeout(tapWait);tapWait=null}
 if(dbl){lastTap={id:-1,t:0};const f=slotTarget(src,run);if(f)doMove(src,run,f[0],f[1]);else shake(run);return}
 const tg=tabTarget(src,run);
 if(slotTarget(src,run)){if(tg)tapWait=setTimeout(()=>{tapWait=null;doMove(src,run,tg[0],tg[1])},450);return}
 if(tg)doMove(src,run,tg[0],tg[1]);else shake(run);
}

/* ---------- ヒント・シャッフル・戻る ---------- */
function clearHint(){board.querySelectorAll('.wcard.hint').forEach(e=>e.classList.remove('hint'))}
function findHint(){
 const tries=[];
 if(G.waste.length)tries.push({src:{pile:'waste',pi:0,idx:G.waste.length-1},run:[G.waste[G.waste.length-1]]});
 G.tab.forEach((col,ci)=>col.forEach((p,i)=>{const r=runAt(col,i);if(r&&(i===0||!runAt(col,i-1)))tries.push({src:{pile:'tab',pi:ci,idx:i},run:r})}));
 for(const t of tries)if(slotTarget(t.src,t.run))return t.run;
 for(const t of tries){
  const c=CARD[t.run[0].id];
  for(let i=0;i<NCOL;i++){
   if(t.src.pile==='tab'&&t.src.pi===i)continue;
   const col=G.tab[i];
   if(col.length&&canTab(t.run,i))return t.run;
   if(!col.length&&t.src.pile==='tab'&&t.src.idx>0&&!G.tab[t.src.pi][t.src.idx-1].up)return t.run;
   if(!col.length&&t.src.pile==='waste')return t.run;
  }
 }
 return null;
}
function left(k){return G[k]==null?MODES[G.mode][k]:G[k]}
function renderTools(){
 const M=MODES[G.mode];
 [['wHints','hint','💡','ヒント'],['wShufs','shuf','🔀','シャッフル'],['wUndos','undo','↶','ひとつ戻る']].forEach(([box,k,ic,lb])=>{
  const b=$(box);
  if(b.childElementCount!==M[k]){b.innerHTML='';for(let i=0;i<M[k];i++){const e=document.createElement('button');e.className='tb '+k;e.dataset.k=k;e.textContent=ic;e.setAttribute('aria-label',lb);b.appendChild(e)}}
  const off=k==='undo'?!undo.length:k==='hint'?!findHint():false;
  [...b.children].forEach((e,i)=>{e.classList.toggle('used',i>=left(k));e.disabled=off});
 });
}
function useTool(k){G[k]=left(k)-1;renderTools();persist()}
sec.querySelector('.tools').addEventListener('click',e=>{
 const b=e.target.closest('.tb[data-k]');if(!b||busy||!G||G.won||left(b.dataset.k)<=0)return;
 resume();const k=b.dataset.k;
 if(k==='hint'){const r=findHint();if(!r)return;clearHint();r.forEach(p=>els[p.id].classList.add('hint'));useTool('hint')}
 if(k==='undo'){if(!undo.length)return;Object.assign(G,JSON.parse(undo.pop()));clearHint();useTool('undo');render();persist()}
 if(k==='shuf'){
  const pool=[];G.tab.forEach(col=>col.forEach(p=>{if(!p.up)pool.push(p.id)}));G.stock.forEach(p=>pool.push(p.id));
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  let n=0;G.tab.forEach(col=>col.forEach(p=>{if(!p.up)p.id=pool[n++]}));G.stock.forEach(p=>p.id=pool[n++]);
  undo=[];clearHint();useTool('shuf');render();persist();
 }
});

/* ---------- 操作 ---------- */
let drag=null;
board.addEventListener('pointerdown',e=>{
 if(busy||!G||G.won)return;
 const t=e.target.closest('[data-pile]');if(!t)return;
 resume();
 const p=t.dataset.pile;
 if(p==='stock'){tapStock();return}
 if(!t.classList.contains('wcard'))return;
 if(p!=='tab'&&p!=='waste')return;
 const pi=+t.dataset.pi,idx=+t.dataset.idx,list=pileOf(p,pi);
 if(p==='waste'&&idx!==list.length-1)return;
 const run=p==='tab'?runAt(list,idx):[list[idx]];
 if(!run){shake([list[idx]]);return}
 drag={src:{pile:p,pi,idx},run,sx:e.clientX,sy:e.clientY,moved:false};e.preventDefault();
});
addEventListener('pointermove',e=>{
 if(!drag)return;
 const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
 if(!drag.moved&&Math.hypot(dx,dy)<8)return;
 if(!drag.moved){drag.moved=true;drag.run.forEach((p,i)=>{const el=els[p.id];el.classList.add('dragging');el.style.zIndex=1000+i})}
 drag.dx=dx;drag.dy=dy;
 drag.run.forEach(p=>{const q=pos[p.id];els[p.id].style.transform=`translate(${q.x+dx}px,${q.y+dy}px)`});
});
function endDrag(){
 if(!drag)return;const d=drag;drag=null;
 d.run.forEach(p=>els[p.id].classList.remove('dragging'));
 if(!d.moved){onTap(d.src,d.run);return}
 const q=pos[d.run[0].id],cx=q.x+d.dx+cw/2,cy=q.y+d.dy+ch/2;
 const col=Math.max(0,Math.min(NCOL-1,Math.floor((cx-offX-gap/2)/(cw+gap))));
 let ok=false;
 if(cy<tabTop-ch*.2){if(col<NSLOT&&canSlotAt(d.run,col)){doMove(d.src,d.run,'slot',col);ok=true}}
 else if(!(d.src.pile==='tab'&&d.src.pi===col)&&canTab(d.run,col)){doMove(d.src,d.run,'tab',col);ok=true}
 if(!ok)render();
}
addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);

/* ---------- 時間・一時停止 ---------- */
function setPause(v){paused=v;$('wPauseLbl').style.display=v?'block':'none';$('wPauseBtn').innerHTML=v?'<small>▶</small>再開':'<small>⏸</small>一時停止'}
function resume(){if(paused)setPause(false)}
setInterval(()=>{
 if(!G||G.won||!G.started||paused||document.hidden||!sec.classList.contains('on'))return;
 G.time++;$('wTime').textContent=fmt(G.time);if(G.time%5===0)persist();
},1000);

/* ---------- クリア ---------- */
function winGame(){
 G.won=true;del(key(G.mode));
 $('wWinTxt').textContent=`${MODES[G.mode].name}　${G.moves}手　／　${fmt(G.time)}`;
 win.classList.add('on');
 const p=BACKS[pref.back].p;
 for(let i=0;i<26;i++){const s=document.createElement('div');s.className='petal';s.textContent=p;s.style.left=Math.random()*100+'vw';s.style.animationDuration=(2.5+Math.random()*2.5)+'s';s.style.animationDelay=Math.random()*1.5+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),6500)}
}

/* ---------- タイトル画面とボタン ---------- */
let wMode=load('hc_wmode','n');
function refreshTitle(){
 [...$('wModeSeg').children].forEach(b=>b.classList.toggle('sel',b.dataset.m===wMode));
 const s=load(key(wMode),null);$('wContBtn').style.display=(s&&!s.won)?'block':'none';
}
$('wModeSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;wMode=b.dataset.m;save('hc_wmode',wMode);refreshTitle()};
function start(){setPause(false);newGame(wMode);$('wTime').textContent='0:00';show('wgame')}
$('wStartBtn').onclick=start;
$('wContBtn').onclick=()=>{const s=load(key(wMode),null);if(!s){start();return}G=s;undo=[];setPause(false);buildEls();$('wTime').textContent=fmt(G.time);show('wgame')};
$('wMenuBtn').onclick=()=>{persist();show('title')};
$('wPauseBtn').onclick=()=>{if(G&&!G.won)setPause(!paused)};
$('wNewBtn').onclick=()=>{if(G&&G.moves>0&&!G.won&&!confirm('今のゲームをやめて、新しく始めますか？'))return;setPause(false);newGame(G?G.mode:wMode);$('wTime').textContent='0:00';layout()};
$('wSheetBtn').onclick=()=>openSheet(true);
$('wAgainBtn').onclick=()=>{win.classList.remove('on');newGame(G.mode);$('wTime').textContent='0:00';layout()};
$('wToMenuBtn').onclick=()=>{win.classList.remove('on');show('title')};
refreshTitle();

window.HCW={layout,refreshTitle,_state:()=>G};
})();
