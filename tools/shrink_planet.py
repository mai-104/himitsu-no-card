# 宇宙の絵の主役(惑星)を小さくして、まわりの星空を広げる
# python3 tools/shrink_planet.py name scale cy   （元の絵は img/ のもの）
import sys
import numpy as np,cv2
name,sc,cy=sys.argv[1],float(sys.argv[2]),float(sys.argv[3])
p=f'img/{name}.webp';img=cv2.imread(p);H,W=img.shape[:2]
lab=cv2.cvtColor(cv2.medianBlur(img,15),cv2.COLOR_BGR2LAB).astype(float)
cor=np.concatenate([lab[:40,:60].reshape(-1,3),lab[:40,-60:].reshape(-1,3),lab[-40:,:60].reshape(-1,3),lab[-40:,-60:].reshape(-1,3)])
d=np.sqrt(((lab-np.median(cor,0))**2).sum(2));m=(d>38).astype('uint8')*255
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
n,l,st,_=cv2.connectedComponentsWithStats(m);mask=np.zeros_like(m)
for k in range(1,n):
  if st[k,4]>1500:
    pts=np.column_stack(np.where(l==k))[:,::-1];cv2.fillConvexPoly(mask,cv2.convexHull(pts),255)
mask=cv2.dilate(mask,np.ones((15,15),np.uint8))
plate=cv2.inpaint(img,mask,9,cv2.INPAINT_TELEA)          # 惑星を消した星空
plate=cv2.GaussianBlur(plate,(0,0),1.2)
w,h=round(W*sc),round(H*sc);small=cv2.resize(img,(w,h),interpolation=cv2.INTER_AREA).astype(float)
x0=(W-w)//2;y0=max(0,min(H-h,round(cy*H-h/2)))
F=26;yy,xx=np.mgrid[0:h,0:w];edge=np.minimum.reduce([yy,xx,h-1-yy,w-1-xx]).astype(float)
a=np.clip((edge+1)/F,0,1)[...,None]
out=plate.astype(float);out[y0:y0+h,x0:x0+w]=small*a+out[y0:y0+h,x0:x0+w]*(1-a)
cv2.imwrite('/tmp/_o.png',out.clip(0,255).astype('uint8'))
from PIL import Image;Image.open('/tmp/_o.png').save(p,'WEBP',quality=82,method=6)
