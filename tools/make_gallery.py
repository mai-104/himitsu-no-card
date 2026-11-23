# イラスト確認ページ（gallery.html）を作る：python3 tools/make_gallery.py
import re,html
s=open('word.js').read()
i=s.index('const IMG');j=s.index('};',i)
IMG=dict(re.findall(r"'([^']+)':'([^']+)'",s[i:j]))
WORDS=re.findall(r"\{t:'([^']+)'([^}]*)w:\[([^\]]*)\]",s)
allw={}
for t,opt,ws in WORDS:
  for w in re.findall(r"'([^']+)'",ws):allw.setdefault(w,[]).append(t)
out=[];n=0
for t,opt,ws in WORDS:
  if 'wait:1' in opt:continue
  cards=[]
  for w in re.findall(r"'([^']+)'",ws):
    im=IMG.get(t+'/'+w) or (IMG.get(w) if len(allw[w])==1 else None)
    n+=1
    body=f'<div class="pic" style="background-image:url(img/{im}.webp)"></div>' if im else f'<div class="txt">{html.escape(w)}</div>'
    cards.append(f'<div class="c"><div class="wd">{html.escape(w)}</div>{body}<span class="no">{n}</span></div>')
  if cards:out.append(f'<h2>{html.escape(t)}</h2><div class="g">{"".join(cards)}</div>')
page=f'''<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>イラスト一覧</title><style>
body{{margin:0;padding:10px;background:#5b6b8a;font-family:sans-serif;color:#fff}}
h1{{font-size:18px}} p{{font-size:13px;line-height:1.6}} h2{{font-size:15px;margin:18px 0 6px}}
.g{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}
.c{{position:relative;aspect-ratio:5/4;background:#F7EED9;border:1px solid #cdbfae;border-radius:14%/17.5%;overflow:hidden;color:#3a3150}}
.wd{{position:absolute;left:4%;right:4%;top:0;height:25%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:min(4vw,16px);white-space:nowrap}}
.pic{{position:absolute;left:0;right:0;bottom:0;top:25%;background:center 30%/cover no-repeat}}
.pic::before{{content:"";position:absolute;left:0;right:0;top:0;height:7%;background:linear-gradient(#F7EED9,rgba(247,238,217,0))}}
.txt{{position:absolute;left:0;right:0;bottom:0;top:25%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:min(5vw,20px)}}
.no{{position:absolute;right:3px;bottom:2px;font-size:11px;background:rgba(0,0,0,.55);color:#fff;border-radius:6px;padding:0 4px}}
</style></head><body><h1>イラスト一覧（{n}枚・{len(out)}テーマ）</h1>
<p>ゲームのカードと同じ切り取り方で並べています。AIのテーマは文字だけのカードです。気になる絵があったら、右下の番号を教えてください。</p>
{"".join(out)}</body></html>'''
open('gallery.html','w').write(page);print(n)
