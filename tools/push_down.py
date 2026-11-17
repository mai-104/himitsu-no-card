# 絵を下にずらす：python3 tools/push_down.py name px
# 上にできたすき間は、絵の上の帯のうち「主役が写っていない」部分を左右反転しながら並べて埋め、なじませる
import sys
import numpy as np
from PIL import Image,ImageFilter
name,d=sys.argv[1],int(sys.argv[2])
p=f'img/{name}.webp';im=np.asarray(Image.open(p).convert('RGB')).astype(float)
H,W,_=im.shape;B=d+12;win=110
top=im[:B]
gray=top.mean(axis=2);med=np.median(gray.reshape(-1))
# 帯の中で、全体の色からいちばん外れていない(=空や壁だけの)横幅winの場所を探す
score=[np.abs(gray[:,x:x+win]-med).mean() for x in range(0,W-win,5)]
x0=int(np.argmin(score))*5;src=top[:,x0:x0+win]
tiles=[];k=0
while sum(t.shape[1] for t in tiles)<W:
  tiles.append(src if k%2==0 else src[:,::-1]);k+=1
band=np.concatenate(tiles,axis=1)[:,:W]
band=np.asarray(Image.fromarray(band.astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))).astype(float)
out=np.zeros_like(im);out[d:]=im[:H-d];out[:d]=band[:d]
for k in range(12):
  a=(k+1)/13;out[d+k]=band[d+k]*(1-a)+out[d+k]*a
Image.fromarray(out.clip(0,255).astype('uint8')).save(p,'WEBP',quality=82,method=6)
