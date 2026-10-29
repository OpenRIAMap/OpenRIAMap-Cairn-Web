"""Real review panel: intentional local revision changes versus cloud conflicts."""
import json
from browser_check import Browser, APP_URL, OUT

assert APP_URL.startswith('http://127.0.0.1:')
b = Browser()
checks = []
for scenario in ['local-revision', 'remote-revision', 'remote-state', 'version-race']:
    b.call('Page.navigate', {'url': APP_URL + '/scripts/browser/fixtures/review-revision-save.html?scenario=' + scenario})
    b.wait("document.body.innerText.includes('Revision regression')")
    b.evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent.includes('Revision regression')).click()")
    b.wait("Boolean(document.querySelector('select'))")
    assert b.evaluate('document.querySelector("select").value') == 'r2'
    b.click('通过')
    b.click('确认通过')
    b.click('保存状态')
    if scenario == 'remote-revision':
        b.wait("document.body.innerText.includes('云端决策版本已变化')")
        assert not b.evaluate("document.querySelector('#save-result').textContent")
    else:
        b.wait("document.body.innerText.includes('保存审核状态')")
        if scenario == 'remote-state':
            assert b.evaluate("document.body.innerText.includes('检测到云端状态灯变化')")
        b.evaluate("[...document.querySelectorAll('button')].filter(e=>e.textContent.trim()==='保存状态'&&!e.disabled).at(-1).click()")
        if scenario == 'version-race':
            b.wait("document.body.innerText.includes('fixture-board-version-conflict')")
            assert not b.evaluate("document.querySelector('#save-result').textContent")
        else:
            b.wait("Boolean(document.querySelector('#save-result').textContent)")
            result = json.loads(b.evaluate("document.querySelector('#save-result').textContent"))
            assert result == {'revision': 'r2', 'expectedBoardVersion': 8 if scenario == 'remote-state' else 7}, result
    b.screenshot('review-save-' + scenario + '.png')
    checks.append(scenario)
assert not b.errors, b.errors
(OUT / 'review-revision-save-result.json').write_text(json.dumps({'checks': checks, 'runtimeErrors': b.errors}, indent=2), encoding='utf-8')
print(json.dumps(checks))
