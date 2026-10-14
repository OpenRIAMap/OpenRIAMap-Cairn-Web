"""Run an inherited r9 acceptance case against isolated downstream/COS fixtures."""
import os,runpy,sys
from pathlib import Path
from sync01_transport import install
from browser_check import Browser
assert os.environ.get('CAIRNMAP_CDP_PORT')=='9250','Use the dedicated SYNC-01 browser profile'
case=Path(sys.argv[1])
assert case.name==str(case) and case.name.startswith('r9_') and case.suffix=='.py','Choose a local r9 acceptance script'
install()
b=Browser()
b.call('Page.navigate',{'url':os.environ.get('CAIRNMAP_APP_URL','http://127.0.0.1:5191')+'/'})
b.wait("!!document.querySelector('.leaflet-container')",40)
b.wait("(async()=>{return (await import('/src/store/ruleDataStore.ts')).useRuleDataStore.getState().datasets.zth?.features.length===495})()",35)
b.ws.close()
runpy.run_path(str(Path(__file__).parent/case),run_name='__main__')
