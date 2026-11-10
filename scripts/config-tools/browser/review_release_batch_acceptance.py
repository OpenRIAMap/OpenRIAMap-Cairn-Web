"""Drive the real release panel using isolated review service ports."""
import json
from browser_check import APP_URL, OUT, Browser

assert APP_URL.startswith('http://127.0.0.1:')
b = Browser()
checks = []
for scenario in ('duplicate', 'write-delete', 'reselect'):
    source = 'duplicate' if scenario == 'duplicate' else 'write-delete'
    b.call('Page.navigate', {'url': APP_URL + '/scripts/browser/fixtures/review-release-batch.html?scenario=' + source})
    b.wait("document.body.innerText.includes('Release batch B.zip')")
    b.click('全选可发布包')
    b.click('发布前检查')
    b.wait("document.body.innerText.includes('ZTEST') && document.body.innerText.includes('revision-a') && document.body.innerText.includes('revision-b')")
    publish = "[...document.querySelectorAll('button')].find(el=>el.textContent.trim()==='发布')"
    if scenario == 'duplicate':
        assert b.evaluate(publish + '.disabled')
        b.screenshot('review-release-duplicate-blocked.png')
    elif scenario == 'write-delete':
        b.click('发布')
        dialog = "document.querySelector('[role=dialog][aria-labelledby=review-confirmation-title]')"
        b.wait(f"Boolean({dialog})")
        confirm = f"[...{dialog}.querySelectorAll('button')].find(el=>el.textContent.trim()==='确认发布')"
        assert b.evaluate(confirm + '.disabled')
        assert b.evaluate(f"{dialog}.innerText.includes('跳过') && {dialog}.innerText.includes('revision-b')")
        b.screenshot('review-release-write-delete-confirmation.png')
        b.evaluate(f"{dialog}.querySelector('input[type=checkbox]').click()")
        b.click('确认发布')
        b.wait("Boolean(document.querySelector('#release-result').textContent)")
        result = json.loads(b.evaluate("document.querySelector('#release-result').textContent"))
        assert result['acceptedWriteDeleteReportSha256'] == result['precheckReportSha256'] == 'a' * 64
    else:
        b.evaluate("[...document.querySelectorAll('input[type=checkbox]')].find(e=>e.checked).click()")
        b.wait(publish + '.disabled')
        b.click('发布前检查')
        b.wait("document.body.innerText.includes('发布前检查通过。')")
        assert not b.evaluate(publish + '.disabled')
    checks.append(scenario)
assert not b.errors, b.errors
(OUT / 'review-release-batch-browser.json').write_text(json.dumps({'checks': checks, 'runtimeErrors': b.errors}, indent=2), encoding='utf-8')
print(json.dumps(checks))
