# 絵を少し小さくして、まわりに余白を作る
# python3 tools/shrink.py name scale cy fill
#   scale: 0.85 など / cy: 縮めた絵の中心を置く高さ(0〜1, 0.5=まんなか) / fill: reflect(はしを鏡うつし) か sky(主役のない部分をしきつめる)
import sys
import numpy as np
from PIL import Image,ImageFilter
name,sc,cy,fill=sys.argv[1],float(sys.argv[2]),float(sys.argv[3]),sys.argv[4]
p=f'img/{name}.webp';src=Image.open(p).convert('RGB');W,H=src.size
w,h=round(W*sc),round(H*sc);small=np.asarray(src.resize((w,h),Image.LANCZOS)).astype(float)
x0=(W-w)//2;y0=max(0,min(H-h,round(cy*H-h/2)))
if fill=='reflect':
  bg=np.pad(small,((y0,H-h-y0),(x0,W-w-x0),(0,0)),mode='reflect')
else:  # 帯の中で背景だけの部分を探し、鏡うつしで敷きつめる
  a=np.asarray(src).astype(float);g=a.mean(axis=2);med=np.median(g);T=90
  best=min(((np.abs(g[y:y+T,x:x+T]-med).mean(),x,y) for y in range(0,H-T,10) for x in range(0,W-T,10)))
  tile=a[best[2]:best[2]+T,best[1]:best[1]+T]
  row=np.concatenate([tile if k%2==0 else tile[:,::-1] for k in range(W//T+2)],axis=1)
  bg=np.concatenate([row if k%2==0 else row[::-1] for k in range(H//T+2)],axis=0)[:H,:W]
  bg=np.asarray(Image.fromarray(bg.astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))).astype(float)
# 縮めた絵の四方をぼかしてなじませる
m=np.ones((h,w));F=14
for k in range(F):
  v=(k+1)/(F+1)
  if y0>0:m[k,:]=np.minimum(m[k,:],v)
  if y0+h<H:m[h-1-k,:]=np.minimum(m[h-1-k,:],v)
  if x0>0:m[:,k]=np.minimum(m[:,k],v);m[:,w-1-k]=np.minimum(m[:,w-1-k],v)
out=bg.copy();reg=out[y0:y0+h,x0:x0+w];out[y0:y0+h,x0:x0+w]=small*m[...,None]+reg*(1-m[...,None])
Image.fromarray(out.clip(0,255).astype('uint8')).save(p,'WEBP',quality=82,method=6)
