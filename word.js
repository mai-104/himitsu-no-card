/* 秘密のカード：グループ分けソリティア（試作） */
(()=>{
const {$,load,save,del,pref,BG,show,fmt,BACKS,openSheet,makeWatch}=window.HC;

/* ---------- テーマ ---------- */
/* テーマと言葉（5つより多いテーマは、ゲームのたびに5つをランダムに選ぶ）
 * 同じ言葉があるテーマどうし、テーマ名がほかのテーマの言葉になっているものは、同じゲームに出ない（自動）
 * それ以外で一緒に出したくない組み合わせは NG に書く */
const WORDS=[ /* i:1 = イラストのカード（絵はあとで入れる） */
 {t:'果物',i:1,w:['りんご','みかん','ぶどう','もも','バナナ','スイカ','メロン','いちご','パイナップル']},
 {t:'野菜',i:1,w:['にんじん','キャベツ','玉ねぎ','ピーマン','大根','ナス','トマト']},
 {t:'動物園',i:1,w:['ライオン','ゾウ','キリン','パンダ','ゴリラ','シマウマ','カバ']},
 {t:'水族館',i:1,w:['イルカ','クラゲ','ラッコ','マンボウ','ウミガメ','ペンギン','サメ']},
 {t:'鳥',i:1,w:['スズメ','カラス','ツバメ','フクロウ','インコ','ハト','ニワトリ']},
 {t:'虫',i:1,w:['カブトムシ','チョウ','トンボ','セミ','テントウムシ','カマキリ']},
 {t:'花',i:1,w:['ひまわり','チューリップ','バラ','アサガオ','タンポポ','ハイビスカス','紫陽花']},
 {t:'天気',i:1,w:['晴れ','くもり','雨','雪','雷','虹']},
 {t:'乗り物',i:1,w:['電車','バス','飛行機','自転車','船','新幹線','ヘリコプター']},
 {t:'スイーツ',i:1,w:['プリン','ショートケーキ','パフェ','シュークリーム','ドーナツ','パンケーキ']},
 {t:'楽器',i:1,w:['ピアノ','ギター','バイオリン','たいこ','トランペット','タンバリン','カスタネット']},
 {t:'文房具',i:1,w:['えんぴつ','消しゴム','じょうぎ','ホッチキス','のり','はさみ']},
 {t:'調理道具',i:1,w:['フライパン','ボウル','おたま','まな板','ほうちょう','なべ','泡立て器']},
 {t:'スポーツ',i:1,w:['サッカー','野球','テニス','水泳','バスケットボール','柔道']},
 {t:'職業',w:['医者','パイロット','警察官','消防士','大工','弁護士','アナウンサー']},
 {t:'宝石',i:1,w:['ダイヤモンド','ルビー','サファイア','エメラルド','パール']},
 {t:'星座',w:['おひつじ座','おうし座','ふたご座','かに座','しし座','おとめ座','てんびん座','さそり座','いて座','やぎ座','みずがめ座','うお座']},
 {t:'体の部分',i:1,w:['目','耳','口','手','足','頭','鼻']},
 {t:'家具',i:1,w:['ソファ','ベッド','たんす','テーブル','本だな','いす']},
 {t:'イベント',w:['お正月','節分','成人式','誕生日','クリスマス','母の日','父の日','バレンタイン','ハロウィン']},
 {t:'洋食',i:1,w:['ナポリタン','オムライス','ハンバーグ','カレーライス','グラタン','エビフライ']},
 {t:'本屋',w:['絵本','まんが','ずかん','辞書','雑誌','小説']},
 {t:'教科',w:['国語','算数','理科','社会','音楽','体育','図工']},
 {t:'地形',w:['海','川','湖','山','盆地','平野','島','谷']},
 {t:'アクティビティ',w:['スカイダイビング','バンジージャンプ','バナナボート','アスレチック','ラフティング','パラグライダー']},
 {t:'公園',i:1,w:['噴水','ブランコ','滑り台','ジャングルジム','砂場','シーソー']},
 {t:'キャンプ',i:1,w:['テント','焚き火','飯盒','寝袋','ランタン','バーベキュー']},
 {t:'クリスマス',i:1,w:['クリスマスツリー','サンタクロース','トナカイ','プレゼント','クリスマスケーキ']},
 {t:'お正月',i:1,w:['おせち','おもち','お年玉','初詣','凧揚げ','初日の出']},
 {t:'魚',i:1,w:['マグロ','サバ','アジ','イワシ','サンマ','フグ','シャケ']},
 {t:'爬虫類',i:1,w:['ヘビ','トカゲ','カメレオン','ワニ','イグアナ']},
 {t:'哺乳類',i:1,w:['うさぎ','猿','人間','カモノハシ','犬','クジラ','コウモリ']},
 {t:'AI',w:['ChatGPT','Claude','Gemini','Grok','Copilot']},
 {t:'パソコン',w:['マウス','キーボード','デスクトップ','ノート','Bluetooth','モニター']},
 {t:'暗号',w:['アナグラム','モールス信号','シーザー暗号','あぶり出し','逆さ読み']},
 {t:'おもちゃ',i:1,w:['つみき','ブロック','ミニカー','プラモデル','ぬいぐるみ','ルービックキューブ','けんだま']},
 {t:'病院',i:1,w:['点滴','注射','血圧計','体温計','包帯','レントゲン','カルテ','聴診器']},
 {t:'警察',w:['警察手帳','手錠','パトカー','白バイ','110番','パトロール']},
 {t:'学校',w:['教室','理科室','音楽室','保健室','体育館','職員室','運動会','入学式','卒業式']},
 {t:'戦国武将',w:['徳川家康','織田信長','上杉謙信','伊達政宗','真田幸村','明智光秀','黒田官兵衛','武田信玄','豊臣秀吉','本多忠勝']},
 {t:'発表会',w:['ピアノ','バレエ','お遊戯','合唱','ダンス']},
 {t:'映画',w:['ミステリー','サスペンス','ホラー','SF','アクション','ファンタジー','アドベンチャー','コメディ','キッズ']},
 {t:'一人称',w:['私','僕','俺','自分','拙者','吾輩','小生','わっち']},
 {t:'未確認',w:['UFO','UMA','USO','エイリアン','ネッシー','ツチノコ']},
 {t:'卵料理',i:1,w:['オムライス','オムレツ','だし巻き玉子','ゆで卵','たまごサンド','親子丼','目玉焼き']},
 {t:'雲',w:['うろこ雲','入道雲','ひつじ雲','すじ雲','飛行機雲','彩雲']},
 {t:'季節',w:['春','夏','秋','冬','梅雨']},
 {t:'音楽',w:['クラシック','ジャズ','ロック','ポップス','演歌','ヒップホップ']},
 {t:'ミステリー',w:['アリバイ','容疑者','証拠','矛盾','密室','名探偵','動機']},
 {t:'金属',w:['金','銀','銅','鉄','アルミ','プラチナ','チタン']},
 {t:'童話',i:1,w:['人魚姫','赤ずきん','シンデレラ','白雪姫','はだかのおうさま','ヘンゼルとグレーテル','うさぎとかめ','ねむり姫']},
 {t:'昔話',w:['金太郎','一寸法師','花咲かじいさん','さるかに合戦','鶴の恩返し','かさじぞう','浦島太郎','かぐや姫']},
 {t:'赤ずきん',i:1,w:['オオカミ','おばあさん','かご','猟師','お花畑','森']},
 {t:'白雪姫',i:1,w:['七人の小人','毒りんご','魔法の鏡','お妃','ガラスの棺']},
 {t:'シンデレラ',i:1,w:['ガラスの靴','かぼちゃの馬車','魔法使い','舞踏会','十二時の鐘','灰']},
 {t:'桃太郎',i:1,w:['きびだんご','キジ','猿','犬','鬼ヶ島','鬼','大きな桃']},
 {t:'かぐや姫',i:1,w:['竹','月の使者','天の羽衣','竹取の翁','五つの難題']},
 {t:'浦島太郎',i:1,w:['亀','竜宮城','乙姫','玉手箱','白い煙']},
 {t:'飲み物',i:1,w:['水','お茶','ジュース','コーヒー','紅茶','牛乳','ココア']},
 {t:'お酒',i:1,w:['ビール','ワイン','日本酒','焼酎','ウイスキー','カクテル']},
 {t:'家電',i:1,w:['冷蔵庫','洗濯機','電子レンジ','掃除機','テレビ','エアコン','炊飯器']},
 {t:'アクセサリー',i:1,w:['ネックレス','指輪','イヤリング','ブレスレット','ピアス','ヘアピン']},
 {t:'衣類',i:1,w:['シャツ','ズボン','スカート','コート','セーター','靴下','ワンピース','マフラー','ベスト']},
 {t:'惑星',i:1,w:['水星','金星','地球','火星','木星','土星','天王星','海王星']},
 {t:'恐竜',i:1,w:['ティラノサウルス','トリケラトプス','ステゴサウルス','ブラキオサウルス','ヴェロキラプトル']},
 {t:'観光地',w:['北海道','沖縄','京都','横浜','箱根','軽井沢']},
 {t:'世界遺産',i:1,w:['ピラミッド','万里の長城','マチュピチュ','タージマハル','自由の女神','姫路城']},
 {t:'ロボット',w:['センサー','モーター','アーム','バッテリー','プログラム','ネジ']},
 {t:'魚料理',i:1,w:['刺身','寿司','塩焼き','煮付け','ムニエル','干物']},
 {t:'肉料理',i:1,w:['ステーキ','からあげ','焼き肉','とんかつ','しょうが焼き','ローストビーフ']},
 {t:'麺料理',i:1,w:['ラーメン','うどん','そば','焼きそば','そうめん','冷やし中華']},
 {t:'パスタ',i:1,w:['カルボナーラ','ペペロンチーノ','ミートソース','ボンゴレ','ジェノベーゼ']},
 {t:'和食',i:1,w:['肉じゃが','みそ汁','天ぷら','すき焼き','茶わん蒸し','おにぎり']},
 {t:'ハーブ',w:['バジル','ミント','ローズマリー','パクチー','シソ','タイム']},
 {t:'調味料',w:['塩','砂糖','しょうゆ','みそ','酢','ケチャップ','マヨネーズ']},
 {t:'伝統',w:['茶道','華道','書道','着物','歌舞伎','落語']},
 {t:'おみくじ',w:['大吉','中吉','小吉','吉','末吉','凶']},
 {t:'偉人',w:['野口英世','エジソン','ナイチンゲール','アインシュタイン','ライト兄弟','ガリレオ']},
 {t:'画家',w:['ゴッホ','ピカソ','モネ','ダ・ヴィンチ','葛飾北斎','フェルメール']},
 {t:'風物詩',i:1,w:['花火','風鈴','こいのぼり','お月見','紅葉狩り','かき氷']},
 {t:'性格',w:['やさしい','まじめ','明るい','のんびり','せっかち','がんこ','優柔不断']},
 {t:'感情',w:['うれしい','かなしい','こわい','たのしい','さみしい','くやしい']},
 {t:'褒める',w:['すごい','えらい','さすが','かっこいい','かわいい','天才']},
];
const NG=[
 ['動物園','哺乳類'],
 ['水族館','鳥'],
 ['水族館','魚'],
 ['水族館','哺乳類'],
 ['水族館','爬虫類'],
 ['恐竜','爬虫類'],
 ['学校','イベント'],
 ['学校','教科'],
 ['風物詩','イベント'],
 ['風物詩','季節'],
 ['天気','季節'],
 ['天気','雲'],
 ['職業','病院'],
 ['職業','警察'],
 ['性格','感情'],
 ['性格','褒める'],
 ['感情','褒める'],
 ['洋食','肉料理'],
 ['洋食','パスタ'],
 ['和食','魚料理'],
 ['和食','麺料理'],
 ['飲み物','お酒'],
 ['宝石','アクセサリー'],
 ['公園','アクティビティ']
];
/* モードの設定（数字を変えるだけで調整できる） */
const MODES={
 n:{name:'ふつう',groups:12,per:5,ups:[5,4,3,2,1],hint:3,shuf:1,undo:3},
 h:{name:'むずかしい',groups:14,per:6,ups:[5,4,3,2,1],hint:3,shuf:1,undo:3},
};
const NSLOT=4, NCOL=5, NEED=5;
/* カードの絵（言葉 → img/のファイル名）。tools/make_card_img.py で作って、ここに1行足す */
const IMG={
 'ヘンゼルとグレーテル':'hansel',
 '人魚姫':'ningyo',
 '赤ずきん':'akazukin',
 'シンデレラ':'cinderella',
 '白雪姫':'shirayuki',
 'はだかのおうさま':'hadaka',
 'うさぎとかめ':'usagikame',
 'ねむり姫':'nemuri',
};
const BAND=.3;   // カードの上の名前の帯（カードの高さに対する割合）

/* ---------- 画面（HTML） ---------- */
const css=`
#wgame .wcard{position:absolute;left:0;top:0;width:var(--ww);height:var(--wh);transition:transform .17s ease;will-change:transform}
#wgame .wcard.dragging{transition:none}
#wgame .wcard .in{position:absolute;inset:0}
#wgame .wcard .bk{position:absolute;left:50%;top:50%;width:var(--wh);height:var(--ww);transform:translate(-50%,-50%) rotate(90deg);background:var(--back) center/100% 100% no-repeat;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))}
#wgame .wcard .fc{position:absolute;inset:0;display:none;background:#F7EED9;border:1px solid #cdbfae;border-radius:calc(var(--wh)*.14);box-shadow:0 1px 2px rgba(0,0,0,.3);overflow:hidden;color:#3a3150}
#wgame .wcard.up .fc{display:block}
#wgame .wcard.up .bk{display:none}
#wgame .wcard .pic{position:absolute;left:0;right:0;bottom:0;top:30%;background:center/cover no-repeat}
#wgame .wcard .pic::before{content:"";position:absolute;left:0;right:0;top:0;height:22%;background:linear-gradient(#F7EED9,rgba(247,238,217,0))}
#wgame .wcard .wd{position:absolute;left:4%;right:4%;top:0;height:30%;display:flex;align-items:center;justify-content:center;font-weight:700;white-space:nowrap;line-height:1}
#wgame .wcard.ttl .fc{background:linear-gradient(180deg,#fff2c4,#ffd98a);border-color:#d9a640;color:#6b3e00}
#wgame .wcard.ttl .wd{font-weight:800}
#wgame .wcard .lb{position:absolute;left:0;right:0;bottom:8%;text-align:center;font-size:calc(var(--wh)*.2);opacity:.75;font-weight:700}
#wgame .wcard.hint .fc{box-shadow:0 0 0 3px #ffd34d,0 1px 2px rgba(0,0,0,.3)}
#wgame .wcard.shake .in{animation:shake .3s}
#wgame .wcard.gone{transition:transform .35s ease,opacity .35s ease;opacity:0}
#wgame .wslot{position:absolute;left:0;top:0;width:var(--ww);height:var(--wh);border:2px dashed var(--slot);border-radius:calc(var(--wh)*.14);display:flex;align-items:center;justify-content:center;color:var(--slot);font-size:calc(var(--ww)*.15);font-weight:700;text-align:center;line-height:1.2}
/* マスキングテープ（同じグループがつながったとき） */
#wgame .wcard.tape::before,#wgame .wcard.tape::after{content:"";position:absolute;top:calc(var(--wh)*-.13);width:calc(var(--ww)*.13);height:calc(var(--wh)*.36);z-index:2;
 background-color:var(--tapeA);background-image:linear-gradient(90deg,var(--tapeB) 50%,transparent 50%),linear-gradient(var(--tapeB) 50%,transparent 50%);background-size:6px 6px;opacity:.5;
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

function shuffled(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* 一緒に出すと紛らわしいテーマか */
function clash(i,j){
 const A=WORDS[i],B=WORDS[j];
 if(A.w.some(w=>B.w.includes(w)))return true;          // 同じ言葉がある
 if(A.w.includes(B.t)||B.w.includes(A.t))return true;  // テーマ名が相手の言葉になっている
 return NG.some(([x,y])=>(x===A.t&&y===B.t)||(x===B.t&&y===A.t));
}
function pickThemes(n){
 const ok=WORDS.map((_,i)=>i).filter(i=>WORDS[i].w.length>=NEED);
 for(let tries=0;tries<50;tries++){
  const res=[];
  for(const i of shuffled(ok)){if(res.every(j=>!clash(i,j)))res.push(i);if(res.length===n)return res}
 }
 return shuffled(ok).slice(0,n);
}
function newGame(mode){
 const M=MODES[mode];
 const pick=pickThemes(M.groups);
 const cards=[];
 pick.forEach(wi=>{
  cards.push({id:cards.length,g:wi,t:1,label:WORDS[wi].t});
  shuffled(WORDS[wi].w).slice(0,NEED).forEach(w=>cards.push({id:cards.length,g:wi,t:0,label:w}));
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
 undo=[];watch.reset();
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
  const pic=!c.t&&IMG[c.label]?`<div class="pic" style="background-image:url(img/${IMG[c.label]}.webp)"></div>`:'';
  el.innerHTML=`<div class="in"><div class="bk"></div><div class="fc">${pic}<div class="wd">${c.label}</div>${c.t?'<div class="lb">タイトル</div>':''}</div></div>`;
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
 cw=Math.floor((bw-gap*(NCOL+1))/NCOL); ch=Math.round(cw*.8);   // 横5:縦4
 offX=Math.round((W-(cw*NCOL+gap*(NCOL+1)))/2);
 y0=gap; yW=y0+ch+gap; os=Math.round(ch*.4); tabTop=yW+(NEED-2)*os+ch+gap*2; // 置き場は4枚まで下に並ぶ
 const R=document.documentElement.style;R.setProperty('--ww',cw+'px');R.setProperty('--wh',ch+'px');
 for(let i=0;i<NSLOT;i++)slotEls[i].style.transform=`translate(${colX(i)}px,${y0}px)`;
 slotEls.stock.style.transform=`translate(${colX(4)}px,${y0}px)`;
 G.cards.forEach(c=>{const wd=els[c.id].querySelector('.wd');const len=[...c.label].length;wd.style.fontSize=Math.min(ch*BAND*.82,(cw*.92)/Math.max(len,2.2))+'px'});
 render();
}
function renderDone(){
 const box=$('wDone'),list=G.cleared||[];
 if(box.childElementCount!==list.length){
  box.innerHTML='';list.forEach(t=>{const d=document.createElement('div');d.className='chip';d.style.width=cw+'px';d.textContent=t;box.appendChild(d)});
 }
}
function colOff(col){
 const avail=board.clientHeight-tabTop-8-$('wDone').offsetHeight; let o=Math.round(ch*.42);
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
  s.names.forEach((id,i)=>{place({id,up:true},colX(si),yW+i*os,11+i,'slotn',si,i);vis.add(id)});
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
 if(s&&s.names.length===NEED)completeSlot(di);else watch.real();
}
function completeSlot(si){
 const s=G.slots[si]; busy=true;
 [s.title,...s.names].forEach(id=>{const e=els[id];e.classList.add('gone');e.style.transform+=' scale(1.25)'});
 setTimeout(()=>{
  [s.title,...s.names].forEach(id=>{els[id].classList.remove('gone')});
  (G.cleared=G.cleared||[]).push(CARD[s.title].label);G.slots[si]=null;G.done++;busy=false;
  render();persist();
  if(G.done===G.groups)winGame();else watch.real();
 },380);
}
function tapStock(){
 let rec=false;
 if(G.stock.length){snap();const p=G.stock.pop();p.up=true;G.waste.push(p)}
 else if(G.waste.length){snap();G.stock=G.waste.reverse().map(p=>(p.up=false,p));G.waste=[];rec=true}
 else return;
 G.moves++;G.started=true;clearHint();render();persist();
 watch.draw(rec);
}
/* どこかに置けるカードがあるか（山のカードも全部調べる） */
function anyMove(){
 const empty=G.tab.some(c=>!c.length);
 const fits=p=>{const r=[p];if(slotFor(r)>=0)return true;if(empty)return true;for(let i=0;i<NCOL;i++){const col=G.tab[i];if(col.length&&canTab(r,i))return true}return false};
 for(const p of G.stock)if(fits(p))return true;
 for(const p of G.waste)if(fits(p))return true;
 for(let ci=0;ci<NCOL;ci++){
  const col=G.tab[ci];
  for(let i=0;i<col.length;i++){
   const run=runAt(col,i); if(!run||(i>0&&runAt(col,i-1)))continue;
   if(slotFor(run)>=0)return true;
   for(let t=0;t<NCOL;t++){
    if(t===ci)continue;
    const tc=G.tab[t];
    if(tc.length?canTab(run,t):i>0)return true;   // 同じグループに重ねる／空いた列へ（下にカードがあるときだけ）
   }
  }
 }
 return false;
}
function doShuffle(){
 const pool=[];G.tab.forEach(col=>col.forEach(p=>{if(!p.up)pool.push(p.id)}));G.stock.forEach(p=>pool.push(p.id));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 let n=0;G.tab.forEach(col=>col.forEach(p=>{if(!p.up)p.id=pool[n++]}));G.stock.forEach(p=>p.id=pool[n++]);
 undo=[];clearHint();useTool('shuf');render();persist();watch.reset();watch.check();
}
const watch=makeWatch({
 anyMove,total:()=>G.stock.length+G.waste.length,
 hintsLeft:()=>left('hint'),shufLeft:()=>left('shuf'),
 doShuffle,
 doNew:()=>{setPause(false);newGame(G.mode);$('wTime').textContent='0:00';layout()}
});
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
 if(k==='undo'){if(!undo.length)return;Object.assign(G,JSON.parse(undo.pop()));clearHint();useTool('undo');render();persist();watch.reset()}
 if(k==='shuf')doShuffle();
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
$('wContBtn').onclick=()=>{const s=load(key(wMode),null);if(!s){start();return}G=s;undo=[];watch.reset();setPause(false);buildEls();$('wTime').textContent=fmt(G.time);show('wgame')};
$('wMenuBtn').onclick=()=>{persist();show('title')};
$('wPauseBtn').onclick=()=>{if(G&&!G.won)setPause(!paused)};
$('wNewBtn').onclick=()=>{if(G&&G.moves>0&&!G.won&&!confirm('今のゲームをやめて、新しく始めますか？'))return;setPause(false);newGame(G?G.mode:wMode);$('wTime').textContent='0:00';layout()};
$('wSheetBtn').onclick=()=>openSheet(true);
$('wAgainBtn').onclick=()=>{win.classList.remove('on');newGame(G.mode);$('wTime').textContent='0:00';layout()};
$('wToMenuBtn').onclick=()=>{win.classList.remove('on');show('title')};
refreshTitle();

window.HCW={layout,refreshTitle,_state:()=>G};
})();
