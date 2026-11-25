import assert from 'node:assert/strict';
import {buildReviewPackageFiles} from '../../src/components/Review/package/serializer';
import {OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE} from '../../src/components/Mapping/core/openriamapRiaReviewPackageProfile';
import {CAIRNMAP_DEFAULT_REVIEW_PACKAGE_PROFILE} from '../../src/components/Review/package/defaultProfile';
import {normalizeReviewControlRequest} from '../../api/review-control.mjs';
const record={ID:'test-audit',Class:'BUD',Name:'测试',CreateBy:'114',CreateTime:'20261124'};
const make=(records:Record<string,unknown>[])=>({packageName:'audit.zip',operator:'114',note:'',features:records.map(record=>({worldId:'zth',classCode:String(record.Class),featureId:String(record.ID),record})),pictures:[],deletes:[]});
assert(buildReviewPackageFiles(OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE,make([record])).files.length>0);
assert(buildReviewPackageFiles(OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE,make([{...record,ModifityBy:'115',ModifityTime:'20261124'}])).files.length>0);
for(const patch of [{CreateBy:undefined},{CreateTime:'20261131'},{ModifityBy:'115'},{ModifityTime:'20261124'},{ModifityBy:'115',ModifityTime:'20261123'}]){
  assert.throws(()=>buildReviewPackageFiles(OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE,make([{...record,...patch}])),/元数据校验失败/);
}
try{buildReviewPackageFiles(OPENRIAMAP_RIA_REVIEW_PACKAGE_PROFILE,make([{ID:'one',Class:'BUD'},{ID:'two',Class:'FLR'}]));assert.fail();}catch(error){assert.equal((error as {issues:unknown[]}).issues.length,4);}
assert(buildReviewPackageFiles(CAIRNMAP_DEFAULT_REVIEW_PACKAGE_PROFILE,make([{ID:'neutral',Class:'BUD'}])).files.length>0,'RIA requirements must not silently affect neutral upstream packages');
for(const operation of ['contribution-audit-query','contribution-audit-detail','contribution-audit-coverage','public-release-history-query']){
  const result=normalizeReviewControlRequest({operation,query:{dateFrom:'2026-11-24',dateTo:'2026-11-24'},actor:{principalId:'spoofed'}},{principalId:'actual'});
  assert.equal(result.actor.principalId,'actual');
  assert.throws(()=>normalizeReviewControlRequest({operation,query:{cosKey:'secret'}},{principalId:'actual'}),/invalid-review-query/);
}
console.log('Contribution audit Web package generation, full error report, neutral boundary and protected Broker: PASS');
