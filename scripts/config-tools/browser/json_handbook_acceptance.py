"""Read-only documentation QA in an existing isolated CDP browser, including file://."""
import hashlib
import json
import os
import urllib.request
from pathlib import Path
from browser_check import Browser, OUT

folder = Path('docs/20_config-reference/runtime-v32-json-handbook-r11-r7-20261017')
data = json.loads((folder / 'reference-data.json').read_text(encoding='utf-8'))
raw = (folder / 'current-full.config.json').read_bytes()
assert raw == Path('src/configStudio/defaults/r11-r7.config.json').read_bytes()
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
tab = json.load(opener.open(urllib.request.Request('http://127.0.0.1:'+os.environ.get('CAIRNMAP_CDP_PORT','9391')+'/json/new?about:blank', method='PUT')))
b = Browser()
checks = []
b.call('Page.navigate', {'url': (folder / 'handbook.html').resolve().as_uri()})
b.wait('!!window.handbook', 25)
assert b.evaluate('window.handbook.counts.properties') == 1039
assert b.evaluate('window.handbook.counts.structures') == 178
assert b.evaluate('window.handbook.instances') == len(data['instances'])
assert b.evaluate("document.querySelectorAll('#guide-body h2').length") == 22
assert b.evaluate("performance.getEntriesByType('resource').every(e=>!e.name.startsWith('http'))")
checks.append('Self-contained file:// reader opens offline with all 178 structures, 1039 properties and 22 guide chapters.')
b.screenshot('handbook-desktop-guide.png')

def value(selector, content):
    b.evaluate("(()=>{const e=document.querySelector("+json.dumps(selector)+");e.value="+json.dumps(content)+";e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()")

b.click('字段解析表')
value('#field-search', 'allowMultipleParts')
assert b.evaluate("[...document.querySelectorAll('#field-rows button')].some(e=>e.textContent==='allowMultipleParts')")
b.click('allowMultipleParts')
assert b.evaluate("document.querySelector('#field-detail').textContent.includes('保存检查')")
b.click('定位完整 JSON')
assert b.evaluate("document.querySelector('#json-status').textContent.startsWith('已定位')")
checks.append('Chinese property search, accurate detail and source-line navigation work.')

pointers = [
    '/application/sources/groups/0/sources/items/1/rootUrl',
    '/application/preferences/search/debounceMs',
    '/application/buttons/items/0/behavior/exclusiveGroup',
    '/nodes/94/fields',
    '',
]
for pointer in pointers:
    b.evaluate('window.handbook.goPointer('+json.dumps(pointer)+')')
    assert b.evaluate("document.querySelector('#json-status').textContent.startsWith('已定位')"), pointer
    assert b.evaluate("document.querySelectorAll('.code-line.active').length") == 1
    assert b.evaluate("document.querySelectorAll('.code-line').length") <= 260
b.evaluate("window.handbook.goPointer('/nodes/999999')")
assert b.evaluate("document.querySelector('#json-status').textContent.includes('路径不存在')")
checks.append('Arbitrary pointers outside the fast index resolve strings, zero, null, arrays and root; invalid pointers report errors.')

value('#json-search', 'r10-rle-code-pill-zoom2-4')
b.click('查找')
assert b.evaluate("document.querySelector('.code-line.active').textContent.includes('r10-rle-code-pill-zoom2-4')")
b.click('下一段')
assert b.evaluate("document.querySelector('#json-range').textContent.includes('/ 115848 行')")
checks.append('Full-source search and bounded line pagination retain the complete 115848-line file.')

b.click('实例定位索引')
value('#instance-kind', '字段')
value('#instance-search', 'RLE direction')
# Search accepts one substring, so search the real field key independently.
value('#instance-search', 'direction')
assert b.evaluate("document.querySelectorAll('#instance-rows tr').length") >= 1
pointer = b.evaluate("document.querySelector('#instance-rows button').textContent")
b.click(pointer)
assert b.evaluate("document.querySelector('#json-status').textContent.includes("+json.dumps(pointer)+")")
checks.append('Actual field instances can be filtered and opened at their real source locations.')

b.click('字段解析表')
value('#field-type', 't129')
assert b.evaluate("document.querySelector('#field-detail').textContent.includes('自定义键')")
checks.append('Dictionary structures with dynamic keys have an explicit explanation rather than an empty unexplained table.')

b.click('典型片段')
for example in data['examples']:
    b.click(example['title'])
    p = example['path']
    expected = json.loads(raw)
    for segment in p.split('/')[1:]:
        key = segment.replace('~1', '/').replace('~0', '~')
        expected = expected[int(key)] if isinstance(expected, list) else expected[key]
    assert json.loads(b.evaluate("document.querySelector('#example-code').textContent")) == expected
checks.append('All nine visible examples equal their actual source objects; no invented bindings or values.')

layouts = []
for width in [1440, 900, 390]:
    b.call('Emulation.setDeviceMetricsOverride', {'width': width, 'height': 980, 'deviceScaleFactor': 1, 'mobile': False})
    for label in ['阅读指南', '字段解析表', '实例定位索引', '典型片段', '完整 JSON']:
        b.click(label)
        layout = b.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})')
        assert layout['scroll'] <= width, (width, label, layout)
        layouts.append({'width': width, 'tab': label, 'documentWidth': layout['scroll']})
    if width == 390:
        b.screenshot('handbook-mobile-json.png')
        b.click('阅读指南')
        b.screenshot('handbook-mobile-guide.png')
checks.append('All five views fit desktop/tablet/mobile widths 1440/900/390 without document overflow.')
b.call('Page.reload')
b.wait('!!window.handbook')
assert not b.errors, b.errors
checks.append('Reload preserves the complete embedded baseline, with no runtime exceptions or backend requests.')
result = {'checks': checks, 'layouts': layouts, 'baselineSha256': hashlib.sha256(raw).hexdigest(), 'runtimeErrors': b.errors}
(OUT / 'handbook-browser-acceptance.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(result, ensure_ascii=False, indent=2))
b.call('Target.closeTarget', {'targetId': tab['id']})
