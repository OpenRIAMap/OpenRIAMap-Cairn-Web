"""CDP-only local CORS accommodation for exact frozen downstream COS responses.

No app code, endpoint, formal reader, feature record or production configuration
is changed. This is deliberately not evidence of production backend availability.
"""
import json,os,websocket
from pathlib import Path
from browser_check import Browser

RESPONSES=json.loads(Path('.cache/sync01-data/responses.json').read_text(encoding='utf-8'))
def install():
    def call(self,method,params=None):
        if method=='Page.navigate' and params and params.get('url','').startswith('http://127.0.0.1:5188/'):
            params={**params,'url':os.environ.get('CAIRNMAP_APP_URL','http://127.0.0.1:5191')+params['url'][len('http://127.0.0.1:5188'):]}
        self.seq+=1;ident=self.seq
        self.ws.send(json.dumps({'id':ident,'method':method,'params':params or {}}))
        while True:
            event=json.loads(self.ws.recv())
            if event.get('method')=='Fetch.requestPaused':
                p=event['params'];url=p['request']['url'];response=RESPONSES.get(url)
                self.seq+=1
                if response:
                    action='Fetch.fulfillRequest';arguments={'requestId':p['requestId'],'responseCode':200,'body':response['body'],'responseHeaders':[{'name':'Content-Type','value':'application/json'},{'name':'Access-Control-Allow-Origin','value':'*'}]}
                else:
                    action='Fetch.continueRequest';arguments={'requestId':p['requestId']}
                self.ws.send(json.dumps({'id':self.seq,'method':action,'params':arguments}))
                continue
            if event.get('method')=='Runtime.exceptionThrown': self.errors.append(event['params'])
            if event.get('id')!=ident: continue
            if 'error' in event: raise RuntimeError(event['error'])
            return event.get('result',{})
    original=Browser.__init__
    def init(self):
        original(self)
        self.call('Fetch.enable',{'patterns':[{'urlPattern':'https://openriamap-cairn-data-1433163128.cos.ap-shanghai.myqcloud.com/*'}]})
    Browser.call=call;Browser.__init__=init
