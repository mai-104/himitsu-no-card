"""ルナの絵（5:4・上が空白）からカード用の絵を作る。
使い方: python3 tools/make_card_img.py 元画像 出力名(英数字)
上の空白を自動で見つけて切り取り、横5:縦2.8（カードの下7割）にぴったり合わせて img/出力名.webp に保存する。"""
import sys, statistics
from PIL import Image
src, name = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); W, H = im.size; px = im.load()
top = px[W // 2, 30]
start = int(H * .25)
# 空白の帯は「どの列もほぼ同じ色」。絵が始まると列ごとの色のばらつき(または帯の色との差)が急に大きくなる
for y in range(int(H * .1), int(H * .6)):
    row = [px[x, y] for x in range(0, W, 7)]
    d = statistics.mean(sum(abs(a - b) for a, b in zip(c, top)) for c in row)
    sd = statistics.pstdev([sum(c) for c in row])
    if d > 60 or sd > 18: start = y; break
art = im.crop((0, start, W, H)); aw, ah = art.size
TW, TH = 500, 280                      # 5 : 2.8（上の帯の大きさに合わせてゲーム側で少し切る）
r = max(TW / aw, TH / ah)
art = art.resize((round(aw * r), round(ah * r)), Image.LANCZOS)
x0 = (art.width - TW) // 2; y0 = (art.height - TH) // 2
art.crop((x0, y0, x0 + TW, y0 + TH)).save(f'img/{name}.webp', 'WEBP', quality=82, method=6)
print(f'{name}: 空白 {start/H*100:.1f}% → img/{name}.webp')
