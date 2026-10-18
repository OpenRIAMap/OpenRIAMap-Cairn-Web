"""Freeze C-stage results separately from all original SYNC-01/r9 evidence."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,shutil,subprocess,os,re
root=Path(__file__).resolve().parents[2]
cache=root/'.cache/main-update'
dest=root/'docs/90_roadmap-and-history/runtime-v32-downstream-mainupdate-20261014'
evidence=dest/'evidence';evidence.mkdir(exist_ok=True)
names=['ui-acceptance.json','published-data-freshness.json','r10-inheritance-migration.json','search-data-audit.json','subject-app-acceptance.json','subject-application-acceptance.json','subject-default-acceptance.json','subject-drawing-session.json','subject-editor-surfaces.json','subject-inheritance-acceptance.json','subject-interaction-states.json','subject-label-positions.json','subject-module-entry-result.json','subject-multipart-edit-acceptance.json','subject-multipart-labels-result.json','subject-native-workflow-matrix.json','subject-production-performance.json','subject-rail-edit-acceptance.json','subject-rle-capsules.json','subject-role-editor-acceptance.json','subject-search-acceptance.json','subject-structure-context.json','subject-table-acceptance.json','subject-trp-edit-acceptance.json','subject-zip-import-acceptance.json','subject-city-render-diagnostics.json']
for name in names:
 data=json.loads((cache/name).read_text(encoding='utf-8'))
 for key in ['runtimeErrors','runtime_errors','errors']:
  assert not data.get(key), (name,key,data[key])
 (evidence/name).write_bytes((cache/name).read_bytes().replace(b'\r\n',b'\n'))
build_log=cache/os.getenv('CAIRNMAP_BUILD_LOG','display-final-build.txt')
build=build_log.read_text(encoding='utf-8-sig',errors='replace')
assert 'r10-final-package: 5130' in build and 'built in ' in build
normalize_log=lambda data:re.sub(rb'[ \t]+(?=\n|$)',b'',data.replace(b'\r\n',b'\n'))
(evidence/'verification-and-build.log').write_bytes(normalize_log(build_log.read_bytes()))
for name in ['storage','feature-data','media-index','relay','project']:
 (evidence/(name+'-contract.log')).write_bytes(normalize_log((cache/('final-'+name+'-contract.log')).read_bytes()))
for name in ['subject-editor-v3-tpp_teleport.png','subject-application-editor.png','subject-rle-capsule-main.png','subject-role-editor-acceptance.png','subject-v3-mobile.png']:
 shutil.copyfile(cache/name,evidence/name)
perf=json.loads((cache/'subject-production-performance.json').read_text(encoding='utf-8'))
fresh=json.loads((cache/'published-data-freshness.json').read_text(encoding='utf-8'))
assert fresh['allFrozenResponsesUnchanged']
assert len(json.loads((cache/'subject-native-workflow-matrix.json').read_text(encoding='utf-8'))['cases'])==34
assert len(json.loads((cache/'subject-label-positions.json').read_text(encoding='utf-8'))['cases'])==90
assert len(json.loads((cache/'subject-editor-surfaces.json').read_text(encoding='utf-8'))['checks'])==60
sha=lambda data:hashlib.sha256(data).hexdigest()
head=os.getenv('CAIRNMAP_IMPLEMENTATION_HEAD') or subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
summary={'date':'2026-10-15','baseline':'0fa9b98c47bc7107a6b53922f335795203f575a3','implementationHead':head,'branch':'codex/ria-config-runtime-v32-subject-20261014','blueprintVersion':'v0.4','blueprintSha256':sha((root/'docs/90_roadmap-and-history/RuntimeV32_Incremental_Revision_Blueprint_2026-10-13.md').read_bytes()),'scope':'C downstream configurable application; local commits','configContract':10,'packageRevision':6,'testGroups':48,'originalContracts':5,'frozenNativeRecords':34,'physicalNativeSubmissions':{'exactOriginal':32,'uniqueBUDSTBParentParameterCases':2},'editorWidthScaleEquivalentCases':60,'labelDirectionOffsetCases':90,'rleMainValidatorZoomDirectionCases':54,'publishedRecords':495,'publishedResponsesUnchanged':fresh,'performance':{'environment':perf['environment'],'scriptRatio':perf['scriptRatio'],'v3CardP95Ms':perf['rows'][1]['cardP95Ms'],'scope':'one fixed world/camera; 5 warm six-Zoom batches and 30 real opens per engine; frozen COS bytes with test-only local CORS headers'},'wholeMapV1PixelParity':False,'manualOrServicePending':['native browser menu zoom 125/150 percent','production-origin COS and external tiles','authenticated review login/save/approve/publish','remaining line-label eligibility and candidate/collision city differences'],'deferred':['D upstream empty template sync','V3 formal promotion','navigation functional-table consumer replacement','ROD Chinese/English along-line glyph repair'],'remoteWrites':False,'notes':['STF rail edit fixture supplied independent ZSTB_A host without changing seven expected outputs','production App records inspected from active React renderer, avoiding duplicate HMR import state','C-stage default package/configuration implementation is complete; whole-map parity and external services are not asserted passed']}
(dest/'acceptance-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
files=[{'file':str(path.relative_to(dest)).replace('\\','/'),'bytes':path.stat().st_size,'sha256':sha(path.read_bytes())} for path in sorted(evidence.iterdir()) if path.is_file()]
(dest/'evidence-manifest.json').write_text(json.dumps({'generatedAt':datetime.now(timezone.utc).isoformat(),'implementationHead':head,'files':files},ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Archived '+str(len(files))+' bounded C-stage evidence files; original evidence retained; 48 gates and build recorded.')
