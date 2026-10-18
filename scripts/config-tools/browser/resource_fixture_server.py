"""Two independent formal-release/Dynmap servers for local acceptance only."""
import json, struct, time, zlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
def png(rgb):
 def chunk(kind,data):return struct.pack('!I',len(data))+kind+data+struct.pack('!I',zlib.crc32(kind+data)&0xffffffff)
 rows=(b'\0'+bytes(rgb)*128)*128
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',128,128,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(rows))+chunk(b'IEND',b'')
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  path=self.path.split('?',1)[0];server='b' if path.startswith('/b-') else 'a';release=server+'-release-1'
  if '-tiles/' in path:
   if path.startswith('/slow-tiles/'):time.sleep(.5)
   body=png((30,80,220) if server=='b' else (220,70,30));kind='image/png'
  else:
   key=path.removeprefix('/'+server+'-data/');manifest='releases/'+release+'/manifest.json';catalog='releases/'+release+'/catalog.json';chunk='releases/'+release+'/chunk.json'
   documents={
    'current/worlds/_release-set.json':{'schemaVersion':'openriamap.current-release-set.v2','releaseId':release,'formalVersion':1,'worlds':['world']},
    'current/worlds/world.json':{'schemaVersion':'openriamap.current-world.v2','worldId':'world','releaseId':release,'formalVersion':1,'worldManifestKey':manifest},
    manifest:{'schemaVersion':'openriamap.world-release-manifest.v2','worldId':'world','releaseId':release,'chunkCatalogKeys':[catalog]},
    catalog:{'schemaVersion':'openriamap.world-chunk-catalog.v2','worldId':'world','releaseId':release,'chunks':[{'key':chunk}]},
    chunk:{'schemaVersion':'openriamap.world-merge-chunk.v2','worldId':'world','features':[{'featureId':'same-id','record':{'ID':'same-id','World':'world','Class':'BUD','Kind':'NOM','SKind':'NOM','Type':'Points','Name':'SERVER '+server.upper(),'CoordP':[[0,0]]}}]},
   }
   if key not in documents:self.send_error(404);return
   body=json.dumps(documents[key]).encode();kind='application/json'
  self.send_response(200);self.send_header('Content-Type',kind);self.send_header('Access-Control-Allow-Origin','*');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(body)));self.end_headers()
  try:self.wfile.write(body)
  except (BrokenPipeError,ConnectionResetError):pass
 def log_message(self,*args):pass
print('Resource fixture server: 127.0.0.1:5196',flush=True)
ThreadingHTTPServer(('127.0.0.1',5196),Handler).serve_forever()
