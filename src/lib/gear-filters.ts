import type { Gear } from './gear-schema';
import { categoryLabels, statusLabels, formatSpec } from './gear-display';
import { totalKitWeightGrams } from './gear-kit-data';

export const filterDefinitions = [
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'status', label: 'Ownership status' },
  { key: 'mount', label: 'Mount' },
  { key: 'focalLength', label: 'Focal length' },
  { key: 'scenario', label: 'Usage scenario' },
  { key: 'stabilization', label: 'Stabilization' },
  { key: 'weatherSealing', label: 'Weather sealing' },
  { key: 'weight', label: 'Weight range' },
] as const;
export type GearFilterKey = typeof filterDefinitions[number]['key'];
export type GearFacets = Record<GearFilterKey, string[]>;

const weightRanges = [
  { value: 'under-250', label: 'Under 250 g', min: 0, max: 250 },
  { value: '250-500', label: '250–<500 g', min: 250, max: 500 },
  { value: '500-1000', label: '500–<1,000 g', min: 500, max: 1000 },
  { value: '1000-2000', label: '1,000–<2,000 g', min: 1000, max: 2000 },
  { value: '2000-plus', label: '2,000 g and above', min: 2000, max: Infinity },
];

/** Specs remain source data; missing fields produce no filter values. */
export function gearFacets(gear: Gear): GearFacets {
  const spec = (...keys: string[]) => {
    const field = keys.map(key => gear.specs.find(item => item.key === key)).find(Boolean);
    return field ? [formatSpec(field)] : [];
  };
  // Reuse the same numeric/unit policy as kit weights for a single item.
  const grams = totalKitWeightGrams([gear]);
  const range = grams === undefined ? undefined : weightRanges.find(range => grams >= range.min && grams < range.max);
  return {
    category: [gear.category], brand: [gear.brand], status: [gear.status],
    mount: spec('lens-mount', 'mount'), focalLength: spec('focal-length'),
    scenario: gear.usageScenarios,
    stabilization: spec('stabilization', 'image-stabilization'),
    weatherSealing: spec('weather-sealing', 'weather-sealed'),
    weight: range ? [range.value] : [],
  };
}

export function availableGearFilters(items: Gear[]) {
  const facets = items.map(gearFacets);
  return filterDefinitions.map(definition => {
    const values = [...new Set(facets.flatMap(item => item[definition.key]))];
    const options = definition.key === 'weight'
      ? weightRanges.filter(range => values.includes(range.value)).map(({ value, label }) => ({ value, label }))
      : values.sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).map(value => ({
        value,
        label: definition.key === 'category' ? categoryLabels[value as Gear['category']]
          : definition.key === 'status' ? statusLabels[value as Gear['status']] : value,
      }));
    return { ...definition, options };
  }).filter(filter => filter.options.length > 0);
}

export function matchesGearFilters(facets: GearFacets, selections: Partial<Record<GearFilterKey, string>>): boolean {
  return filterDefinitions.every(({ key }) => !selections[key] || facets[key].includes(selections[key]!));
}
