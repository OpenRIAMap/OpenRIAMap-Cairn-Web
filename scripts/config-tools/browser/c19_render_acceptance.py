"""Check c19 composite geometry and cross-renderer stacking on the local map."""
import json
import os
from urllib.request import Request, ProxyHandler, build_opener

from browser_check import APP_URL, OUT, Browser


def main():
    assert APP_URL.startswith('http://127.0.0.1:')
    cdp = 'http://127.0.0.1:' + os.environ['CAIRNMAP_CDP_PORT']
    opener = build_opener(ProxyHandler({}))
    opener.open(Request(cdp + '/json/new?about:blank', method='PUT')).close()
    browser = Browser()
    browser.ws.settimeout(90)
    try:
        browser.call('Network.enable')
        browser.call('Network.setBlockedURLs', {'urls': ['https://*', APP_URL + '/api/*']})
        browser.call('Page.navigate', {'url': APP_URL + '/scripts/browser/fixtures/c19-render.html'})
        browser.wait("typeof window.runC19RenderChecks === 'function'", 45)
        result = browser.evaluate('window.runC19RenderChecks()')
        assert not browser.errors, browser.errors
        (OUT / 'c19-render-result.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
        print(json.dumps(result))
    finally:
        browser.ws.close()


if __name__ == '__main__':
    main()
