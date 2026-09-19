import assert from 'node:assert/strict';
import test from 'node:test';
import { gearKitSchema } from '../src/lib/gear-kit-schema.ts';
import { resolveKitGear, totalKitWeightGrams } from '../src/lib/gear-kit-data.ts';

const kit = { slug: 'test-kit', name: 'Test kit', description: 'A test combination.', scenarios: ['Travel'], gearItemSlugs: ['camera', 'lens'] };
const item = (slug, value, unit = 'g') => ({ slug, specs: value === undefined ? [] : [{ key: 'weight', label: 'Weight', value, unit }] });

test('kit schema rejects empty and duplicate equipment references', () => {
  assert.deepEqual(gearKitSchema.parse(kit).notes, []);
  for (const gearItemSlugs of [[], ['camera', 'camera'], ['Invalid slug']]) {
    assert.equal(gearKitSchema.safeParse({ ...kit, gearItemSlugs }).success, false);
  }
  assert.equal(gearKitSchema.safeParse({ ...kit, scenarios: [] }).success, false);
});

test('references preserve equipment identity and authored order; missing gear fails clearly', () => {
  const camera = item('camera', 500), lens = item('lens', 200);
  const gear = new Map([['lens', lens], ['camera', camera]]);
  const resolved = resolveKitGear(kit, gear);
  assert.equal(resolved[0], camera);
  assert.equal(resolved[1], lens);
  assert.throws(() => resolveKitGear(kit, new Map([['camera', camera]])), /test-kit.*missing gear "lens"/);
});

test('weight totals convert kg to g and retain recorded zero', () => {
  assert.equal(totalKitWeightGrams([item('camera', 0.5, 'kg'), item('lens', 250)]), 750);
  assert.equal(totalKitWeightGrams([item('camera', 0)]), 0);
});

test('incomplete, unsupported, or invalid weight data never produces a partial total', () => {
  assert.equal(totalKitWeightGrams([]), undefined);
  for (const invalid of [item('lens', undefined), item('lens', '500'), item('lens', false), item('lens', -1), item('lens', Infinity), item('lens', 1, 'oz'), item('lens', 1, '')]) {
    assert.equal(totalKitWeightGrams([item('camera', 500), invalid]), undefined);
  }
});
