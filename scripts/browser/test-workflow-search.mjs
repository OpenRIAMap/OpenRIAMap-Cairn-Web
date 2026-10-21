import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin=process.env.CAIRN_TEST_ORIGIN??'http://127.0.0.1:5296',debug=process.env.CAIRN_TEST_CDP??'http://127.0.0.1:9499';
const pages=await(await fetch(debug+'/json')).json(),page=pages.find(p=>p.type==='page');assert(page);
const ws=new WebSocket(page.webSocketDebuggerUrl),pending=new Map();let serial=0;
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
ws.addEventListener('message',event=>{const result=JSON.parse(event.data);if(!result.id)return;const entry=pending.get(result.id);if(entry){clearTimeout(entry.timer);pending.delete(result.id);result.error?entry.reject(Error(JSON.stringify(result.error))):entry.resolve(result.result);}});
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},15000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const value=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(value.exceptionDetails)throw Error(JSON.stringify(value.exceptionDetails));return value.result?.value;};
const poll=async(expression,timeout=10000)=>{const until=Date.now()+timeout;while(Date.now()<until){if(await evaluate(expression))return;await new Promise(resolve=>setTimeout(resolve,40));}throw Error('Browser timeout: '+expression+'\n'+await evaluate('document.body.innerText'));};
try{
  await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:1000,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/scripts/browser/fixtures/workflow-search.html'});
  await poll('!!window.harness');await evaluate("document.querySelector('#first input').blur();document.querySelector('#first input').focus()");await poll("document.querySelector('#first').innerText.includes('第一目标')");assert.equal(await evaluate('harness.metrics.reads'),0);
  await evaluate("for(let i=0;i<20;i++)harness.rerender();harness.overlay();harness.deleteA()");
  await poll("document.querySelector('#first').innerText.includes('本地图层目标')&&!document.querySelector('#first').innerText.includes('第一目标')");assert.equal(await evaluate('harness.metrics.reads'),0);
  await evaluate("Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.querySelector('#first input'),'保留草稿');document.querySelector('#first input').dispatchEvent(new Event('input',{bubbles:true}));harness.mode('slow')");
  await poll('harness.metrics.reads===1');await evaluate('for(let i=0;i<20;i++)harness.rerender()');await new Promise(resolve=>setTimeout(resolve,100));assert.equal(await evaluate('harness.metrics.reads'),1);assert.equal(await evaluate('harness.metrics.aborts'),0,'unrelated bridge recreation must not restart the pending read');await evaluate("document.querySelector('#second input').focus()");await poll("document.querySelectorAll('[role=status]').length>=2");
  await poll("document.querySelector('#second').innerText.includes('正在确认数据发布')");assert.equal(await evaluate('harness.metrics.reads'),1,'both search inputs must share the same in-flight read');
  await evaluate("Array.from(document.querySelectorAll('#first button')).find(b=>b.textContent==='取消等待').click()");await poll("document.querySelector('#first').innerText.includes('已取消搜索等待')");assert.equal(await evaluate('harness.metrics.aborts'),0);
  await evaluate("Array.from(document.querySelectorAll('#second button')).find(b=>b.textContent==='取消等待').click()");await poll('harness.metrics.aborts===1');assert.equal(await evaluate('harness.value()'),'保留草稿');
  await evaluate("harness.mode('error');Array.from(document.querySelectorAll('#first button')).find(b=>b.textContent==='重试').click()");await poll("document.querySelector('#first [role=alert]')?.innerText.includes('503')");assert(!await evaluate("document.querySelector('#first').innerText.includes('没有匹配')"));
  await evaluate("harness.mode('memory')");await poll("!document.querySelector('#first [role=alert]')");assert.equal(await evaluate('harness.value()'),'保留草稿');
  assert.equal(await evaluate("document.querySelectorAll('.fixed.inset-0').length"),0,'search must never block unrelated editing');
  if(process.env.CAIRN_TEST_SCREENSHOT){const screenshot=await call('Page.captureScreenshot',{format:'png'});await fs.writeFile(process.env.CAIRN_TEST_SCREENSHOT,Buffer.from(screenshot.data,'base64'));}
  console.log(JSON.stringify({passed:true,memoryReads:0,coldConcurrentReads:1,independentCancellation:true,lastConsumerAborts:true,latestStage:true,draftPreserved:true,errorAndRetry:true,fullScreenOverlays:0,metrics:await evaluate('harness.metrics')}));
  await call('Page.navigate',{url:origin+'/scripts/browser/fixtures/publication.html'});
  const click=async text=>{await poll(`Array.from(document.querySelectorAll('button')).some(b=>b.textContent===${JSON.stringify(text)}&&!b.disabled)`);await evaluate(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent===${JSON.stringify(text)}).click()`);};
  await poll('!!window.publicationFixture',30000);
  await click('全局核验');await click('整包下载/上传');await click('重新登录并准备上传');await click('再次核验');await click('上传并发布');
  await poll("document.body.innerText.includes('等待最终生产部署')");
  await evaluate('publicationFixture.deploy()');await new Promise(resolve=>setTimeout(resolve,150));
  assert(await evaluate("document.body.innerText.includes('服务端阶段：complete')"),'baseline refresh after activation must retain the tracked publication');
  await click('检查最终 Web 部署');await poll("document.body.innerText.includes('最终 Web 部署已确认')");
  assert.deepEqual(await evaluate('publicationFixture.operations'),['prepare','preflight','confirm'],'deployment checks must not repeat server publication or call extra business endpoints');
  console.log(JSON.stringify({publicationUiPassed:true,trackedTaskSurvivesBaselineChange:true,staticFinalDeploymentConfirmed:true,authentication:'mock only',liveCloudWrites:0}));

}finally{ws.close();}
