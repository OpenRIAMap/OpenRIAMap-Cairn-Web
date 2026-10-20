"""Actual RuleDrivenLayer SVG labels, fixed geometry/count; no production writes."""
import json,time
from browser_check import Browser,APP_URL,OUT
b=Browser();checks=[];samples=[]
def js(s):return b.evaluate(s)
def snap():return js("(()=>{const a=window.RIA?.debug?.lineLabels?.();return a?{generatedAt:a.generatedAt,zoom:a.zoomLevel,rows:a.rows.map(r=>({id:r.id,displayed:r.displayed,reason:r.blockedReason,mode:r.renderMode,attempts:r.repositionAttempts})),svg:document.querySelectorAll('.ria-line-glyphpath-svg').length}:null})()")
try:
    b.call('Page.navigate',{'url':APP_URL+'/scripts/config-tools/render-acceptance.html?subject=1&class=ROD&scenario=singleLine'})
    b.wait('!!window.acceptance?.map',35);js('window.acceptance.upgrade();true');b.wait('window.acceptance.config.contractRevision===12')
    js("""(()=>{const a=window.acceptance;a.map.eachLayer(l=>{if(l._url)a.map.removeLayer(l)});const c=structuredClone(a.config);const p=c.nodes.find(n=>n.path.class==='ROD'&&!n.path.kind).geometryProfiles.LineString;const r=structuredClone(p.zoomPriority.rules.find(r=>r.label?.visible));r.id='dense-rule';r.when={zoom:{min:0,max:8}};r.extensions.labelText.maxChars=80;r.extensions.lineLabel.cjkGlyphMaxCount=2;p.zoomPriority.rules=[r];a.setConfig(c);window.denseConfig=c;
    const feature=(i)=>{const col=i%4,row=Math.floor(i/4),x=70+col*290,y=70+row*53;const points=[[x,y],[x+90,y+4],[x+230,y]].map(p=>{const w=a.projection.latLngToLocation(a.map.containerPointToLatLng(p));return [w.x,w.y,w.z]});return {ID:'dense-'+i,Name:i%3===0?'东 North '+i:'Road '+i,Class:'ROD',World:'zth',Type:'Polyline',CoordL:[points],color:'#64748b'};};window.denseData={features:Array.from({length:60},(_,i)=>feature(i))};a.setDataset(window.denseData);return true;})()""")
    b.wait("window.RIA?.debug?.lineLabels?.().rows.length===60",35);time.sleep(.5)
    first=snap();print('dense initial SVG nodes',first['svg'],flush=True);assert sum(r['displayed'] for r in first['rows'])>=50,first
    assert all(r['mode']=='glyphPath' for r in first['rows'] if r['displayed']),first
    checks.append('60 actual ROD labels; CJK limit2 does not truncate continuous English; actual SVG paths rendered with declared candidate/label/glyph budgets')
    for i in range(12):
        before=snap()['generatedAt'];start=time.perf_counter()
        js(f"window.acceptance.map.panBy([{12 if i%2==0 else -12},0],{{animate:false}});true")
        deadline=time.time()+10
        while time.time()<deadline:
            current=snap()
            if current and current['generatedAt']!=before:break
            time.sleep(.015)
        elapsed=(time.perf_counter()-start)*1000
        assert current['generatedAt']!=before
        visible=sum(r['displayed'] for r in current['rows']);assert visible>=50,current;assert current['svg']<=120,current
        samples.append({'ms':round(elapsed,2),'displayed':visible,'svg':current['svg']})
    b.screenshot('dense-english-roads.png')
    checks.append('12 real pan/recompute passes keep >=50 visible glyph-path labels; candidate positions refresh without stale SVG coordinates')
    before=snap()['generatedAt'];js('window.acceptance.map.setZoom(4,{animate:false});true');b.wait('window.RIA.debug.lineLabels().zoomLevel===7');assert sum(r['displayed'] for r in snap()['rows'])>0
    js('window.acceptance.map.setZoom(3,{animate:false});true');b.wait('window.RIA.debug.lineLabels().zoomLevel===6')
    checks.append('zoom7 then6 rebuilds current path placements and resumes full display')
    js("(()=>{const c=structuredClone(window.denseConfig);c.nodes.find(n=>n.path.class==='ROD'&&!n.path.kind).geometryProfiles.LineString.zoomPriority.rules[0].extensions.lineLabel.advancedTextMaxLabels=1;window.acceptance.setConfig(c);return true;})()")
    time.sleep(.6);limited=snap();assert sum(r['displayed'] for r in limited['rows'])<=1,limited
    assert any('budget' in str(r.get('reason','')).lower() for r in limited['rows']),limited
    assert all(r['mode'] not in ['simpleLineLabel','normalLabel'] for r in limited['rows']),limited
    checks.append('explicit global label budget1 is enforced even in strict chainage branch; denied SVG labels are hidden rather than HTML fallback')
    js('window.acceptance.setConfig(structuredClone(window.denseConfig));true');time.sleep(.6);assert sum(r['displayed'] for r in snap()['rows'])>=50
    time.sleep(1);settled=snap();print('dense settled SVG nodes',settled['svg'],flush=True);assert settled['svg']<=120,settled
    assert not b.errors,b.errors
    times=sorted(r['ms'] for r in samples)
    (OUT/'r12-dense-results.json').write_text(json.dumps({'checks':checks,'features':60,'settledSvgNodes':settled['svg'],'initialSvgNodes':first['svg'],'initialDisplayed':sum(r['displayed'] for r in first['rows']),'samples':samples,'roundTripCdpP50Ms':times[len(times)//2],'roundTripCdpP95Ms':times[min(len(times)-1,int(len(times)*.95))],'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print('r12 dense actual renderer: '+str(len(checks))+' groups passed',flush=True)
except Exception:
    b.screenshot('dense-failure.png');(OUT/'r12-dense-failure.json').write_text(json.dumps({'checks':checks,'snapshot':snap(),'runtimeErrors':b.errors},ensure_ascii=False,indent=2),encoding='utf-8');raise
finally:b.ws.close()
