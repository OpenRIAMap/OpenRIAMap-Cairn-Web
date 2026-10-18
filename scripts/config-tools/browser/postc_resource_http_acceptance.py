import json,os
from pathlib import Path
from browser_check import Browser,APP_URL
b=Browser();b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/subject-ui-acceptance.html?mode=general'})
b.wait("document.querySelector('[data-application-section=worlds]')!==null")
result=b.evaluate("""(async()=>{
 const api=await import('/src/core/project/applicationRuntime.ts'),helpers=await import('/src/core/project/applicationResources.ts'),defaults=await import('/src/core/project/applicationDefaults.ts');
 const source=await import('/src/components/Rules/data/formalDataSourceRuntime.ts'),loader=await import('/src/components/Rules/data/worldRuleDatasetLoader.ts');
 const dyn=await import('/src/lib/DynmapTileLayer.ts'),filters=await import('/src/lib/SketchTileLayer.ts');
 const original=api.getApplicationDefinition(),app=helpers.migrateApplicationResources(defaults.defaultApplicationSettings());
 const a=app.sources.groups[0],other=structuredClone(a);other.id='http-b';other.label={zh:'B',en:''};app.sources.groups.push(other);app.sources.bindings.eden=other.id;
 for(const [group,key] of [[a,'a'],[other,'b']]){group.sources.storageKey+=':http-fixture-'+key;group.sources.linkModes.storageKey+=':http-fixture-'+key;group.sources.items[0].rootUrl='http://127.0.0.1:5196/'+key+'-data';group.sources.items[0].transport='direct';group.tiles.baseUrlTemplate='http://127.0.0.1:5196/'+key+'-tiles/{world}/';group.tiles.filteredAccess='direct';delete group.tiles.proxyId;}
 app.worlds.find(w=>w.id==='zth').remoteWorldId='world';app.worlds.find(w=>w.id==='eden').remoteWorldId='world';api.applyApplicationSettings(app);
 const datasets=await Promise.all([loader.loadWorldRuleDataset('zth'),loader.loadWorldRuleDataset('eden')]);
 if(datasets[0].features[0].Name!=='SERVER A'||datasets[1].features[0].Name!=='SERVER B'||datasets[0].features[0].ID!==datasets[1].features[0].ID||datasets[0].features[0].World!=='zth'||datasets[1].features[0].World!=='eden')throw Error('Cross-server data mixed');
 const cached=await loader.loadWorldRuleDataset('eden');if(cached.features[0].Name!=='SERVER B')throw Error('Wrong cached server');
 const box=document.createElement('section');box.setAttribute('data-resource-tile-preview','');Object.assign(box.style,{position:'fixed',inset:'120px 20px auto',zIndex:'15000',background:'white',padding:'20px',display:'flex',gap:'20px',border:'2px solid #64748b',flexWrap:'wrap'});document.body.append(box);
 const rows=[];
 for(const [world,label] of [['zth','A'],['eden','B']])for(const [style,factory] of [['original',dyn.createDynmapTileLayer],['sketch',filters.createSketchTileLayer],['watercolor',filters.createWatercolorTileLayer]]){
  const layer=factory(world),tile=await new Promise((resolve,reject)=>{let target;target=layer.createTile({x:0,y:0,z:1},error=>error?reject(error):resolve(target));});
  if(tile.tagName==='IMG'&&tile.naturalWidth!==128)throw Error('Image did not load');if(tile.tagName==='CANVAS'&&tile.getContext('2d').getImageData(0,0,1,1).data[3]===0)throw Error('Canvas empty');
  const card=document.createElement('div');card.textContent=label+' '+style;card.append(document.createElement('br'),tile);box.append(card);rows.push(label+' '+style+' loaded from '+layer.getTileUrl({x:0,y:0,z:1}));
 }
 const generation=source.getRuleDataSourceSnapshot('zth').generation;a.tiles.baseUrlTemplate='http://127.0.0.1:5196/slow-tiles/{world}/';api.applyApplicationSettings(app);if(source.getRuleDataSourceSnapshot('zth').generation!==generation)throw Error('Tile-only change invalidates data');
 const layer=dyn.createDynmapTileLayer('zth');let completed=0;const stale=layer.createTile({x:0,y:0,z:1},()=>completed++);layer.fire('tileunload',{tile:stale});await new Promise(r=>setTimeout(r,650));if(completed||stale.getAttribute('src'))throw Error('Unloaded tile completed');
 api.applyApplicationSettings(original);return {datasets:datasets.map(d=>({world:d.worldId,remoteWorld:d.remoteWorldId,name:d.features[0].Name,id:d.features[0].ID,release:d.releaseId})),tiles:rows,cancellation:true,tileOnlyPreservesDataGeneration:true};
})()""")
b.screenshot('postc-resource-http.png');assert not b.errors,b.errors
out=Path(os.environ['CAIRNMAP_ACCEPTANCE_OUT']);out.mkdir(parents=True,exist_ok=True);(out/'postc-resource-http.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False));b.ws.close()
