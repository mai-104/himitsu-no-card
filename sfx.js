/* 秘密のカード：効果音（ファイルなし。ゲームの中で音を作る）
   使い方：SFX.play('flip') など。両方のゲームで共通。 */
(()=>{
let ctx=null, master=null, on=1;
try{const v=localStorage.getItem('hc_sfx');if(v!==null)on=+v}catch(e){}
function ac(){
 if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination)}
 if(ctx.state==='suspended')ctx.resume();
 return ctx;
}
let noiseBuf=null;
function noise(){if(noiseBuf)return noiseBuf;const n=ctx.sampleRate;noiseBuf=ctx.createBuffer(1,n,n);const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return noiseBuf}

/* 部品 */
function tone(f,t,dur,{type='sine',vol=.3,a=.005,f2=null,dest=master}={}){
 const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
 if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.05);
}
function hiss(t,dur,{vol=.25,f=2500,f2=null,q=1.2,type='bandpass',a=.004}={}){
 const s=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),g=ctx.createGain();
 s.buffer=noise();bp.type=type;bp.frequency.setValueAtTime(f,t);if(f2)bp.frequency.exponentialRampToValueAtTime(f2,t+dur);bp.Q.value=q;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 s.connect(bp);bp.connect(g);g.connect(master);s.start(t,Math.random()*.5);s.stop(t+dur+.05);
}

/* 効果音 */
const S={
 flip(t){hiss(t,.09,{vol:.32,f:3200,f2:1400,q:.9});hiss(t+.02,.06,{vol:.12,f:6000,q:1.5})},              // めくる
 recycle(t){hiss(t,.32,{vol:.22,f:900,f2:3800,q:.7,a:.12});tone(330,t+.18,.18,{vol:.06,f2:440})},       // 山を戻す
 place(t){tone(587,t,.16,{type:'triangle',vol:.15});tone(880,t+.02,.18,{vol:.05})},                        // 列に置く（置き場と同じ「ぽん」の音で、低くやさしく）
 placeOld(t){tone(196,t,.12,{type:'triangle',vol:.22,f2:150});hiss(t,.03,{vol:.12,f:1800,q:.8})},       // 列に置く・保存版（ことっ）
 found(t){tone(784,t,.22,{type:'triangle',vol:.2});tone(1175,t+.03,.25,{vol:.08})},                        // 置き場に置く
 ng(t){tone(330,t,.12,{type:'triangle',vol:.13,a:.008});tone(262,t+.13,.18,{type:'triangle',vol:.13,a:.008})}, // 置けない（ぽ・ぽ：やさしく下がる2音）
 ngOld(t){tone(165,t,.08,{type:'triangle',vol:.2,f2:140});tone(150,t+.09,.1,{type:'triangle',vol:.16,f2:120})},// 置けない・保存版（こつこつ）
 reveal(t){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(392,t);o.frequency.exponentialRampToValueAtTime(784,t+.06);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.17,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(master);o.start(t);o.stop(t+.35);tone(784,t+.03,.25,{vol:.05,a:.02});}, // 表になる（ぽわっ：下から上へふくらむ音）
 reveal2(t){hiss(t,.35,{vol:.06,f:1200,f2:3600,q:.5,a:.12});tone(1568,t+.05,.6,{vol:.06,a:.06});tone(1319,t+.18,.7,{vol:.05,a:.06})}, // 表になる・案2（ふわっ：空気がふくらんで、やわらかい2音）
 revealOld(t){hiss(t,.18,{vol:.1,f:2200,f2:4200,q:1,a:.06});tone(1047,t+.04,.25,{vol:.06})},              // 表になる・保存版
 shuffle(t){for(let i=0;i<9;i++)hiss(t+i*.045,.05,{vol:.22,f:2600+Math.random()*1200,q:1.4});hiss(t+.42,.15,{vol:.15,f:1500,q:.8})}, // シャッフル
 hint(t){tone(988,t,.12,{vol:.16});tone(1319,t+.09,.2,{vol:.16})},                                         // ヒント
 undo(t){tone(660,t,.22,{type:'triangle',vol:.14,f2:330});hiss(t,.2,{vol:.07,f:3000,f2:1200})},           // ひとつ戻る
 pause(t){tone(880,t,.05,{vol:.1});tone(660,t+.05,.06,{vol:.08})},                                         // 一時停止・再開
 stuck(t){[784,659,523].forEach((f,i)=>tone(f,t+i*.14,.5,{type:'triangle',vol:.12}))},                    // 進めないお知らせ
 nudge(t){tone(784,t,.12,{vol:.13});tone(1175,t+.1,.22,{vol:.13})},                                        // ヒントも使えるよ
 title(t){tone(784,t,.22,{type:'triangle',vol:.17});tone(1175,t+.03,.25,{vol:.07});
  tone(1047,t+.1,.5,{type:'triangle',vol:.19});tone(1568,t+.13,.55,{vol:.07})}, // タイトルを置く（置き場と同じ「ぽん」の音で、ぽ・ぽーん）
 titleChirin(t){const st=(f,tt,d,v)=>{tone(f,tt,d,{vol:v,a:.012});tone(f*1.003,tt,d*.9,{vol:v*.5,a:.015});tone(f*2,tt,d*.3,{vol:v*.12,a:.01})};
  st(2637,t,.7,.07);st(3136,t+.08,3.2,.11)}, // タイトルを置く・保存版（ちりん）
 group(t){[1568,1976,2349,3136,3951].forEach((f,i)=>{const tt=t+i*.1,d=i<4?1.1:3;tone(f,tt,d,{vol:.15,a:.01});tone(f/2,tt,d*.5,{vol:.05,a:.012});tone(f*2,tt,d*.3,{vol:.02,a:.01})})}, // グループ・マークがそろう（きらきら）
 clear(t){const k=(f,tt,d,v)=>{tone(f,tt,d,{vol:v,a:.01});tone(f/2,tt,d*.5,{vol:v*.33,a:.012});tone(f*2,tt,d*.3,{vol:v*.13,a:.01})};
  [1568,1976,2349,3136,3951,4699].forEach((f,i)=>k(f,t+i*.08,1.2,.12));
  const sp=[3136,3951,4699,3951,4699,3951,4699];sp.forEach((f,i)=>k(f,t+.32+i*.1,i<sp.length-1?1.8:3.6,.07))}, // クリア（グループがそろう音と同じ種類：上がっていって、高い音のきらきらが重なって響き続ける）
 clearOld(t){const n=[523,659,784,1047];n.forEach((f,i)=>tone(f,t+i*.12,.35,{type:'triangle',vol:.14}));
  [523,659,784].forEach(f=>tone(f,t+.55,1.6,{type:'triangle',vol:.1,a:.03}));tone(1047,t+.55,1.6,{vol:.08,a:.03});tone(2093,t+.6,1.4,{vol:.05,a:.02})}, // クリア・保存版
 clearD(t){const k=(f,tt,d,v)=>{tone(f,tt,d,{vol:v,a:.01});tone(f/2,tt,d*.5,{vol:v*.33,a:.012});tone(f*2,tt,d*.3,{vol:v*.13,a:.01})};
  [[2349,0,.25],[2349,.13,.25],[2349,.26,.25],[3136,.4,2.4]].forEach(([f,d,l])=>{k(f,t+d,l,.13);k(f*.8,t+d,l*.8,.05)});
  [3951,4699,3951,4699,6272].forEach((f,i)=>k(f,t+.55+i*.1,i<4?1.2:2.6,.045))}, // クリア・案D（ぱんぱかぱーん＋きらきら）
 clearE(t){const k=(f,tt,d,v)=>{tone(f,tt,d,{vol:v,a:.01});tone(f/2,tt,d*.5,{vol:v*.33,a:.012});tone(f*2,tt,d*.3,{vol:v*.13,a:.01})};
  [[1568,0,.3],[1760,.15,.3],[1976,.3,.3],[2349,.45,.5],[1976,.68,.3],[2349,.82,2.6]].forEach(([f,d,l])=>k(f,t+d,l,.12));
  [3136,3951,4699].forEach((f,i)=>k(f,t+.95+i*.1,i<2?1.2:2.4,.05))}, // クリア・案E（ソ・ラ・シ・レー・シ・レーー：歌うようなメロディ）
 clearF(t){const k=(f,tt,d,v)=>{tone(f,tt,d,{vol:v,a:.01});tone(f/2,tt,d*.5,{vol:v*.33,a:.012});tone(f*2,tt,d*.3,{vol:v*.13,a:.01})};
  [1568,1976,2349].forEach((f,i)=>k(f,t+i*.08,.8,.1));
  [2093,2637,3136].forEach((f,i)=>k(f,t+.36+i*.08,.8,.11));
  [2349,2960,3520,4699].forEach((f,i)=>k(f,t+.72+i*.08,i<3?1.2:2.8,.12))}, // クリア・案F（3回、だんだん高く上がる）
 ngB(t){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(196,t+.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.2);o.connect(g);g.connect(master);o.start(t);o.stop(t+.25)}, // 置けない・案B（ぽこっ：下がる音1つ）
 ngC(t){tone(330,t,.12,{type:'triangle',vol:.13,a:.008});tone(262,t+.13,.18,{type:'triangle',vol:.13,a:.008})}, // 置けない・案C（ぽ・ぽ：やさしく下がる2音）
 clearB(t){const n=[[392,0,.12],[392,.14,.12],[523,.28,.5]];n.forEach(([f,d,l])=>{tone(f,t+d,l,{type:'triangle',vol:.16,a:.01});tone(f*2,t+d,l*.6,{vol:.04,a:.01})});
  [523,659,784].forEach(f=>tone(f,t+.8,1.6,{type:'triangle',vol:.1,a:.04}));tone(1047,t+.8,1.6,{vol:.06,a:.04})}, // クリア・案B（ぱっぱらー）
 clearC(t){[659,784,1047,1175,1319].forEach((f,i)=>tone(f,t+i*.16,.6,{vol:.12,a:.02}));
  [523,659,784,1047].forEach(f=>tone(f,t+.85,1.8,{vol:.07,a:.08}))}, // クリア・案C（やさしいメロディ）
};
window.SFX={
 play(name){if(!on)return;const c=ac();if(!c||!S[name])return;S[name](c.currentTime+.01)},
 set(v){on=v?1:0;try{localStorage.setItem('hc_sfx',on)}catch(e){}},
 get on(){return on},
 list:Object.keys(S),
};
})();
