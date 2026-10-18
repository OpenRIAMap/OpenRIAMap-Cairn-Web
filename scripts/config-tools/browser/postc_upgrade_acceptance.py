"""Explicit legacy upgrade is a discardable draft; V1 regeneration emits r11."""
import json,time
from browser_check import Browser,OUT,APP_URL
b=Browser();checks=[]
b.navigate('?workspace=config-studio&configMode=v3')
b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');const old=await(await fetch('/src/configStudio/defaults/r10-r6.config.json')).json();old.packageId='postc-upgrade-fixture';await p.persistActiveConfig(old,true);})()")
b.navigate('?workspace=config-studio&configMode=v3');b.click('迁移到 r11 草稿')
b.wait("document.body.innerText.includes('已建立 r11 升级草稿')")
assert b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts');return p.getActiveConfigSnapshot().contractRevision;})()") == 10
b.click('总体规则');assert b.evaluate("document.querySelector('[role=tab][aria-selected=true]').textContent")=='要素设计'
b.click('放弃草稿')
assert b.evaluate("document.querySelector('main header p')?.textContent.includes('契约 r10')")
checks.append('legacy package stays active during an isolated r11 upgrade; switching tabs is blocked and discard retains the original')
b.click('迁移到 r11 草稿');b.click('核验全局草稿');b.click('保存')
b.wait("document.querySelector('main header p')?.textContent.includes('契约 r11')")
b.navigate('?workspace=config-studio&configMode=v3')
assert b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts'),c=p.getActiveConfigSnapshot();return c.packageId==='postc-upgrade-fixture'&&c.contractRevision===11&&c.lookupTables.length===3&&c.application.sources.kind==='world-groups';})()")
checks.append('validated upgrade saves and survives refresh with complete groups and dictionary metadata')
b.click('从 V1 重新生成');b.wait("document.body.innerText.includes('已按当前 V1 真实字段重新生成')")
assert b.evaluate("(async()=>{const p=await import('/src/configStudio/defaultConfigProvider.ts'),c=p.getActiveConfigSnapshot();return c.contractRevision===11&&c.lookupTables.length===3&&c.application.sources.kind==='world-groups';})()")
checks.append('actual V1 regeneration entry activates a valid complete r11 contract')
b.click('恢复应用默认配置');b.wait("document.querySelector('main header p')?.textContent.includes('配置 r7')")
assert not b.errors,b.errors
(OUT/'postc-upgrade.json').write_text(json.dumps({'checks':checks,'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(checks,ensure_ascii=False));b.ws.close()
