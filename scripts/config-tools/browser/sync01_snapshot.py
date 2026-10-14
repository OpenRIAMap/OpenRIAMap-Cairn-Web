"""Read-only capture of the downstream formal release, preserving exact response bytes."""
import base64,concurrent.futures,hashlib,json,urllib.request
from pathlib import Path
OUT=Path('.cache/sync01-data');OUT.mkdir(parents=True,exist_ok=True)
ROOT='https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com'
responses={}
def fetch(key):
    url=ROOT+'/'+key
    body=urllib.request.urlopen(url,timeout=35).read()
    responses[url]={'body':base64.b64encode(body).decode(),'sha256':hashlib.sha256(body).hexdigest()}
    return json.loads(body)
release=fetch('current/worlds/_release-set.json')
features=[];chunks=[]
for world in release['worlds']:
    pointer=fetch('current/worlds/'+world+'.json')
    assert pointer['releaseId']==release['releaseId']
    manifest=fetch(pointer['worldManifestKey'])
    assert manifest['releaseId']==release['releaseId']
    for key in manifest['chunkCatalogKeys']:
        chunks.extend(entry['key'] for entry in fetch(key)['chunks'])
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    for chunk in pool.map(fetch,list(dict.fromkeys(chunks))):
        features.extend(wrapper['record'] for wrapper in chunk['features'])
classes={}
for record in features: classes[record.get('Class','')]=classes.get(record.get('Class',''),0)+1
fingerprint=hashlib.sha256(json.dumps(features,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
result={'release':release,'responseCount':len(responses),'chunkCount':len(set(chunks)),'records':len(features),'classes':classes,'featuresSha256':fingerprint,'transportNote':'COS omits Access-Control-Allow-Origin for localhost. Isolated CDP acceptance fulfills exact captured remote bytes with local CORS headers; application and configured production endpoints are unchanged.'}
(OUT/'responses.json').write_text(json.dumps(responses),encoding='utf-8')
(OUT/'features.json').write_text(json.dumps(features,ensure_ascii=False),encoding='utf-8')
(OUT/'summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False),flush=True)
