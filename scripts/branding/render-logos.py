"""Deterministically rasterize the supplied light SVG on an opaque white square.

Requires the isolated local Vite preview and a CDP Edge instance. No asset is
stretched or cropped: the original SVG viewBox defines all output dimensions.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'scripts/config-tools/browser'))
from browser_check import Browser

SIZES={'logo.png':1536,'favicon-196.png':196,'apple-icon-180.png':180,'manifest-icon-192.png':192,'manifest-icon-512.png':512}
browser=Browser()
url=os.environ.get('CAIRNMAP_APP_URL','http://127.0.0.1:5218').rstrip('/')
browser.call('Page.navigate',{'url':url+'/brand/logo-light.svg'})
browser.wait("document.readyState==='complete'")
manifest={}
for filename,size in SIZES.items():
    encoded=browser.evaluate(f"""(async()=>{{const image=new Image();image.src='/brand/logo-light.svg';await image.decode();const canvas=document.createElementNS('http://www.w3.org/1999/xhtml','canvas');canvas.width={size};canvas.height={size};const context=canvas.getContext('2d');context.fillStyle='#ffffff';context.fillRect(0,0,{size},{size});context.drawImage(image,0,0,{size},{size});return canvas.toDataURL('image/png').split(',')[1];}})()""")
    data=base64.b64decode(encoded)
    (ROOT/'public'/filename).write_bytes(data)
    manifest[filename]={'size':size,'sha256':hashlib.sha256(data).hexdigest(),'whiteBackground':True}
(ROOT/'public/brand/logo-assets.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps(manifest,indent=2))
