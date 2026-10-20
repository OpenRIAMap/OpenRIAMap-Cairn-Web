import assert from 'node:assert/strict';
import { placeLabel, labelCandidateShift, labelPlacementTransform, iconBoundsAtAnchor, mergeLabelSymbolBounds, unionScreenRects, type LabelPlacement } from '../../src/components/Rules/rendering/labelPlacement';

const origins: Array<[LabelPlacement, number, number, string]> = [
  ['center', 80, 90, 'translate(-50%, -50%)'], ['N', 80, 80, 'translate(-50%, -100%)'],
  ['S', 80, 100, 'translate(-50%, 0%)'], ['E', 100, 90, 'translate(0%, -50%)'],
  ['W', 60, 90, 'translate(-100%, -50%)'], ['NE', 100, 80, 'translate(0%, -100%)'],
  ['NW', 60, 80, 'translate(-100%, -100%)'], ['SE', 100, 100, 'translate(0%, 0%)'], ['SW', 60, 100, 'translate(-100%, 0%)'],
];
for (const [placement, x, y, css] of origins) {
  assert.equal(labelPlacementTransform(placement), css);
  for (const [offsetX, offsetY] of [[0, 0], [12, 15], [-12, -15], [12, -15], [-12, 15]]) {
    assert.deepEqual(placeLabel({ x: 100, y: 100 }, { w: 40, h: 20 }, placement, offsetX, offsetY), { x: x + offsetX, y: y + offsetY, w: 40, h: 20 });
  }
  assert.deepEqual(labelCandidateShift('C', placement, { w: 40, h: 20 }, 0), { dx: 0, dy: 0 });
}
assert.deepEqual(placeLabel({ x: 100, y: 100 }, { w: 40, h: 20 }, 'near', 0, 5, false), { x: 80, y: 71, w: 40, h: 20 });
assert.deepEqual(placeLabel({ x: 100, y: 100 }, { w: 40, h: 20 }, 'center', 0, 5, false), { x: 80, y: 90, w: 40, h: 20 });
assert.deepEqual(iconBoundsAtAnchor({ x: 100, y: 100 }, [40, 20], [20, 5], 3), { x: 77, y: 92, w: 46, h: 26 });
console.log('label-placement: nine positions, signed X/Y, CSS/bbox origin and legacy baseline: OK');

const large={radius:5,offsetX:0,offsetY:0,box:iconBoundsAtAnchor({x:7,y:-3},[80,40],[40,20])};
assert.deepEqual(mergeLabelSymbolBounds({x:95,y:95,w:10,h:10},{x:100,y:100},large),{x:67,y:77,w:80,h:40});
assert.deepEqual(mergeLabelSymbolBounds({x:195,y:95,w:10,h:10},{x:200,y:100},{...large,anchorPx:{x:100,y:100}}),{x:67,y:77,w:138,h:40},'geometry-anchored image cannot move with a different label candidate');
assert.deepEqual(mergeLabelSymbolBounds({x:95,y:95,w:10,h:10},{x:100,y:100},{...large,box:iconBoundsAtAnchor({x:7,y:-3},[120,60],[60,30])}),{x:47,y:67,w:120,h:60},'same URL with new dimensions updates occupancy');

const multipart=unionScreenRects([iconBoundsAtAnchor({x:0,y:0},[24,24],[12,12]),iconBoundsAtAnchor({x:100,y:0},[24,24],[12,12])]);
assert.deepEqual(multipart,{x:-12,y:-12,w:124,h:24});
assert.deepEqual(mergeLabelSymbolBounds({x:95,y:95,w:10,h:10},{x:100,y:100},{radius:5,offsetX:0,offsetY:0,box:multipart}),{x:88,y:88,w:124,h:24},'all multipart images contribute to the combined occupancy');
