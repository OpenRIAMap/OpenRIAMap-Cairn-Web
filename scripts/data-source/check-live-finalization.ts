/** Read-only acceptance of the actual production reader against public sources. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {loadFormalWorldRuleDataset} from '../../src/components/Rules/data/formalReleaseReader';
import {loadFormalMediaAssets} from '../../src/components/Rules/data/formalMediaReader';
import type {RuleDataSourceSnapshot} from '../../src/components/Rules/data/formalDataSourceRuntime';
const out=path.resolve(process.argv[2]??'../../migration-runs/v3-deployment-finalization-20261018/live');
fs.mkdirSync(out,{recursive:true});
const config=JSON.parse(fs.readFileSync(new URL('../../src/configStudio/defaults/r11-r7.config.json',import.meta.url),'utf8'));
const settings=config.application.sources.groups.find((group:{id:string})=>group.id===config.application.sources.defaultGroupId).sources;
const cos=settings.items.find((item:{transport:string})=>item.transport==='direct');
const github=settings.items.find((item:{transport:string})=>item.transport==='github-raw-compatible');
const cdn=settings.linkModes.items.find((item:{default:boolean})=>item.default).baseUrl;
const roots={cos:cos.rootUrl,githubRaw:github.rootUrl,cdn:`${cdn}/${settings.github.owner}/${settings.github.repo}/${settings.github.branch}`};
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
  const url=String(input),match=Object.entries(roots).find(([,root])=>url.startsWith(root+'/'));
  const response=await originalFetch(input,init);
  if(match&&response.ok){const [id,root]=match,key=url.slice(root.length+1);if(key.split('/').some(part=>part==='..'||!part))throw Error('capture path invalid');const file=path.join(out,'objects',id,key);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,new Uint8Array(await response.clone().arrayBuffer()));}
  return response;
};
const {validatePublishedRecords}=await import('../../vendor/configuration-r11/r11-validation.mjs');
const reports=[];
try{
  for(const [id,rootUrl] of Object.entries(roots)){
    const source:RuleDataSourceSnapshot={sourceId:id==='cos'?cos.id:github.id,label:id,readerKind:'formal-release-v2',readerSchemaVersion:'openriamap.formal-release-reader.v2',rootUrl,mediaRootUrl:cos.mediaRootUrl,objectLayout:id==='cos'?'cos-release-v2':'github-stable-v1',transportId:`live:${id}`,generation:1,worldId:'zth'};
    const dataset=await loadFormalWorldRuleDataset({source,worldId:'zth'});
    const validation=validatePublishedRecords(config,dataset.features);
    assert.equal(validation.valid,true,JSON.stringify(validation.issues));
    const pictureRecord=dataset.features.find(record=>record.Class==='ISG'&&record.Kind==='NGF'&&String(record.ID).includes('GLLD'))??dataset.features.find(record=>record.Class==='ISG'&&record.Kind==='NGF');
    // Media categories follow the existing physical storage contract, not the
    // full classification tree: ISG/ISL/ISP use Class/Kind; other classes use Class.
    const mediaKindPath=pictureRecord&&['ISG','ISL','ISP'].includes(String(pictureRecord.Class))&&pictureRecord.Kind?[String(pictureRecord.Kind)]:[];
    const media=pictureRecord?await loadFormalMediaAssets({source,releaseId:dataset.releaseId!,worldId:'zth',classCode:String(pictureRecord.Class),kindPath:mediaKindPath,featureId:String(pictureRecord.ID)}):[];
    const contentSha256=createHash('sha256').update(JSON.stringify(dataset.features)).digest('hex');
    reports.push({id,rootUrl,layout:source.objectLayout,releaseId:dataset.releaseId,formalVersion:dataset.formalVersion,featureCount:dataset.features.length,contentSha256,strictValidation:validation.valid,mediaProbe:pictureRecord?{id:pictureRecord.ID,assetCount:media.length}:null});
    console.log(JSON.stringify(reports.at(-1)));
  }
  assert.equal(new Set(reports.map(report=>report.releaseId)).size,1);assert.equal(new Set(reports.map(report=>report.contentSha256)).size,1);
}finally{globalThis.fetch=originalFetch;fs.writeFileSync(path.join(out,'live-reader-result.json'),JSON.stringify({readOnly:true,checkedAt:new Date().toISOString(),reports},null,2)+'\n');}
