"""Real DOM editing; no application state setters or production writes."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();old_recv=b.ws.recv;prompt_value='https://example.com/new'
def recv():
 message=old_recv();event=json.loads(message)
 if event.get('method')=='Page.javascriptDialogOpening':
  b.seq+=1;b.ws.send(json.dumps({'id':b.seq,'method':'Page.handleJavaScriptDialog','params':{'accept':True,'promptText':prompt_value}}))
 return message
b.ws.recv=recv
b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/browser/workflow-feedback-harness.html'})
b.wait('!!window.__feedback')
style=b.evaluate("(()=>{const a=document.querySelector('[role=textbox] a'),v=document.querySelector('#runtime-preview a');return {color:getComputedStyle(a).color,underline:getComputedStyle(a).textDecorationLine,title:a.title,runtimeColor:getComputedStyle(v).color}})()")
assert style['color']==style['runtimeColor']=='rgb(37, 99, 235)' and 'underline' in style['underline'] and style['title']=='https://example.com/old',style
before=b.evaluate('JSON.stringify(window.__feedback.report)');b.click('切换反馈语言')
assert b.evaluate("document.body.innerText.includes('This delete entry')")
assert b.evaluate('JSON.stringify(window.__feedback.report)')==before
b.click('切换反馈语言');assert b.evaluate("document.body.innerText.includes('删除目标存在，确认后')")
def select_text(start,end):
 b.evaluate(f"""(()=>{{const e=document.querySelector('[role=textbox]'),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n,offset=0,r=document.createRange(),begun=false;while(n=walker.nextNode()){{const len=n.textContent.length;if(!begun&&{start}<=offset+len){{r.setStart(n,{start}-offset);begun=true;}}if(begun&&{end}<=offset+len){{r.setEnd(n,{end}-offset);break;}}offset+=len;}}e.focus();const s=getSelection();s.removeAllRanges();s.addRange(r);e.dispatchEvent(new MouseEvent('mouseup',{{bubbles:true}}));}})()""")
select_text(0,4);b.click('链接');b.wait("window.__feedback.value.paragraphs[0].runs.some(r=>r.link==='https://example.com/new')")
assert b.evaluate("document.querySelectorAll('[role=textbox] a a').length")==0
assert b.evaluate("document.querySelector('[role=textbox] a').title")=='https://example.com/new'
select_text(0,4);b.click('粗体');assert b.evaluate('window.__feedback.value.paragraphs[0].runs[0].bold') is True
assert b.evaluate("window.__feedback.value.paragraphs[0].runs[0].link")=='https://example.com/new'
saved=b.evaluate('JSON.stringify(window.__feedback.value)');prompt_value='javascript:alert(1)';select_text(0,4);b.click('链接')
assert b.evaluate('JSON.stringify(window.__feedback.value)')==saved
assert b.evaluate("document.body.innerText.includes('链接格式不受支持')")
b.screenshot('workflow-feedback-links.png')
result={'defaultLinkStyle':style,'partialRetargetNoNestedAnchors':True,'formatPreservesLink':True,'unsafeLinkRejected':True,'localeDoesNotMutateReport':True,'warnings':b.evaluate('window.__feedback.report.issues.length'),'notes':b.evaluate('window.__feedback.report.designNotes.length')}
(OUT/'workflow-feedback-browser-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False))
