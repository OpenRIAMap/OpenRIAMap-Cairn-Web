"""Browser codecs + real IndexedDB: handover, pending audit recovery, publication acknowledgement."""
import json
from browser_check import Browser,APP_URL,OUT
b=Browser()
origin=b.evaluate('performance.timeOrigin');b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/browser/c18-harness.html'});b.wait('performance.timeOrigin>'+str(origin))
b.wait('window.__c18?.ready===true')
result=b.evaluate("""(async()=>{
 const w=await import('/src/configStudio/workspaceController.ts'),p=await import('/src/configStudio/package.ts'),m=await import('/src/configStudio/contractMigration.ts'),v=await import('/src/configStudio/runtime.ts');
 const initial=await w.startDefaultWorkspace(),next=m.migratePackageToContract(initial,18).config;
 await w.persistActiveConfig(next,true);
 const first=w.getWorkspaceState().editAudit;
 const blob=await p.buildConfigPackageArchive(next,v.validateConfigPackage(next));
 const imported=await p.readConfigPackageWithDiagnostics(new File([blob],'handover.zip'));
 if(imported.editAudit?.checkpoints[0].id!==first.checkpoints[0].id)throw Error('Source checkpoint was lost');
 const candidate=structuredClone(imported.config);candidate.displayName.zh='Temporary candidate';
 const stagedBlob=await p.buildConfigPackageArchive(candidate,v.validateConfigPackage(candidate));
 const staged=await p.readConfigPackageWithDiagnostics(new File([stagedBlob],'staged-handover.zip'));
 if(!staged.editAudit?.staged||staged.editAudit.checkpoints.length!==first.checkpoints.length)throw Error('Staged audit was dropped or treated as a checkpoint');
 w.setImportedEditAudit(staged.editAudit,staged.config);await w.persistStudioEditingSession({baseline:next,draft:null,tree:null,selectedId:'',editing:false,packageCandidate:{config:candidate,baseline:next,source:'import'},activeTab:'features'});await w.flushWorkspace();
 const stored=await(await import('/src/configStudio/workspaceStorage.ts')).initializeWorkspaceStorage();
 await w.resumeWorkspace(stored.checkpoint);
 if(w.getWorkspaceState().editAudit.checkpoints[0].id!==first.checkpoints[0].id||!w.getWorkspaceState().importedEditAudit)throw Error('Imported audit cache failed');
 await w.persistActiveConfig(candidate,true);
 if(w.getWorkspaceState().editAudit.checkpoints.length!==2||w.getActiveConfigSnapshot().revision!==151)throw Error('Handover save changed formal revision or lost the source chain');
 const published={...candidate,revision:152},identity={releaseId:'isolated-test-publication',packageId:published.packageId,projectId:published.projectId,revision:152,contractRevision:18,configSha256:'a'.repeat(64),manifestSha256:'b'.repeat(64),configUrl:'/configuration/releases/'+ 'a'.repeat(64)+'/config.json'};
 let blocked=false;try{await w.acknowledgePublishedWorkspace(identity,{...published,displayName:{zh:'Different'}})}catch{blocked=true}
 if(!blocked||!w.getWorkspaceState().editAudit)throw Error('Mismatched publication cleared audit');
 await w.acknowledgePublishedWorkspace(identity,published);
 if(w.getWorkspaceState().editAudit||w.getActiveConfigSnapshot().revision!==152)throw Error('Published audit was not retired');
 await w.persistActiveConfig({...published,displayName:{...published.displayName,zh:'Next edit'}},true);
 const newAudit=w.getWorkspaceState().editAudit;
 if(newAudit.baseline.revision!==152||newAudit.checkpoints.length!==1||w.getActiveConfigSnapshot().revision!==152)throw Error('New edit did not start a fresh baseline');
 return {checks:['A06: ZIP handover retains source checkpoint identity','A06: uncommitted candidate exports a staged source chain without inventing a validated checkpoint','A06: imported audit and source snapshot survive real IndexedDB resume','A05: handover save appends one checkpoint while formal r remains 151','A05/A07: mismatched publication retains audit; exact confirmed publication retires it; next edit starts one checkpoint on r152'],runtimeErrors:[]};
})()""")
assert not b.errors,b.errors
result['runtimeErrors']=b.errors
(OUT/'c18-audit-browser.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(result,ensure_ascii=False))
