# 絵を少し小さくして、できた余白をまわりの色でのばして埋める（下はそろえる）
# python3 tools/shrink_fill.py name scale
import sys
import numpy as np,cv2
from PIL import Image
name,sc=sys.argv[1],float(sys.argv[2])
p=f'img/{name}.webp';img=cv2.imread(p);H,W=img.shape[:2]
w,h=round(W*sc),round(H*sc);small=cv2.resize(img,(w,h),interpolation=cv2.INTER_AREA)
x0=(W-w)//2;y0=H-h
can=np.zeros_like(img);can[y0:,x0:x0+w]=small
mask=np.full((H,W),255,np.uint8);mask[y0:,x0:x0+w]=0
fill=cv2.inpaint(can,mask,12,cv2.INPAINT_TELEA);fill=cv2.GaussianBlur(fill,(0,0),3)
out=fill.astype(float);F=10
yy,xx=np.mgrid[0:h,0:w];edge=np.minimum.reduce([yy+ (999 if y0==0 else 0),xx,w-1-xx]).astype(float)
a=np.clip((edge+1)/F,0,1)[...,None];out[y0:,x0:x0+w]=small*a+out[y0:,x0:x0+w]*(1-a)
cv2.imwrite('/tmp/_o.png',out.clip(0,255).astype('uint8'));Image.open('/tmp/_o.png').save(p,'WEBP',quality=82,method=6)
