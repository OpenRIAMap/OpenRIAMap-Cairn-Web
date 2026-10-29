"""Physical clicks against the actual renderer, including zero-tolerance Halo refreshes."""
import json
import time
from browser_check import Browser, APP_URL, OUT

assert APP_URL.startswith('http://127.0.0.1:')
b = Browser()
checks = []
b.call('Page.navigate', {'url': APP_URL + '/scripts/config-tools/icon-hit-acceptance.html'})
b.wait('Boolean(window.iconHitAcceptance&&document.querySelector(".leaflet-marker-icon"))', 55)


def set_control(label, value):
    b.evaluate('(()=>{const e=document.querySelector("select[aria-label=' + label + ']");'
               'Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(e,' + json.dumps(value) + ');'
               'e.dispatchEvent(new Event("change",{bubbles:true}));})()')
    time.sleep(.15)


def set_enabled(value):
    b.evaluate('(()=>{const e=document.querySelector(\'input[aria-label="点击点"]\');if(e.checked!==' + json.dumps(value) + ')e.click();})()')
    time.sleep(.2)


def physical_click():
    point = b.evaluate('(()=>{const e=document.querySelector(".ria-config-hit-proxy")??[...document.querySelectorAll(".leaflet-marker-icon")].find(e=>e.getBoundingClientRect().width>0);'
                       'if(!e)throw Error("No marker");const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
    for event in ['mousePressed', 'mouseReleased']:
        b.call('Input.dispatchMouseEvent', {'type': event, 'button': 'left', 'clickCount': 1, **point})
    time.sleep(.25)


for mode in ['polygon-icon', 'point-icon', 'polygon-image', 'point-image', 'missing-image']:
    set_control('点击场景', mode)
    b.wait('Boolean(document.querySelector(".leaflet-marker-icon"))')
    time.sleep(.4)
    set_enabled(False)
    before = b.evaluate('window.iconHitAcceptance.events.filter(event=>event.open).length')
    physical_click()
    assert b.evaluate('window.iconHitAcceptance.events.filter(event=>event.open).length') == before, mode
    set_enabled(True)
    b.wait('Boolean(document.querySelector(".ria-config-hit-proxy,.leaflet-marker-icon.leaflet-interactive"))')
    physical_click()
    b.wait('window.iconHitAcceptance.events.at(-1)?.open===true')
    assert b.evaluate('window.iconHitAcceptance.events.filter(event=>event.open).length') > before
    assert b.evaluate('document.querySelectorAll(".ria-config-hit-proxy").length') <= 1
    b.screenshot('icon-hit-' + mode + '.png')
    checks.append(mode + ': physical point click opens actual card without Label; trigger updates enforce disabled state')
    b.click('缩小验证器')
    b.click('放大验证器')
    assert b.evaluate('document.querySelectorAll(".ria-config-hit-proxy").length') <= 1
    b.click('重建预览')

assert not b.errors, b.errors
(OUT / 'icon-hit-browser-result.json').write_text(json.dumps({'checks': checks, 'runtimeErrors': b.errors}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(checks, ensure_ascii=False, indent=2))
