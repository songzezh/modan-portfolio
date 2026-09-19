import type { Gear } from './gear-schema';
import { categoryLabels, formatSpec } from './gear-display';

export interface ComparisonItem {
  slug: string;
  name: string;
  fields: { key: string; label: string; value: string }[];
}

/** Only factual product fields are sent to the comparison interface. */
export function toComparisonItem(gear: Gear): ComparisonItem {
  return {
    slug: gear.slug,
    name: gear.name,
    fields: [
      { key: 'metadata:brand', label: 'Brand', value: gear.brand },
      { key: 'metadata:category', label: 'Category', value: categoryLabels[gear.category] },
      { key: 'metadata:release-year', label: 'Release year', value: gear.releaseYear?.toString() ?? '' },
      ...gear.specs.map(spec => ({ key: `spec:${spec.key}`, label: spec.label, value: formatSpec(spec) })),
    ],
  };
}

/** Match stable specification keys, preserving each recorded unit and value. */
export function comparisonRows(items: ComparisonItem[]) {
  const fields = new Map<string, string>();
  items.forEach(item => item.fields.forEach(field => {
    if (!fields.has(field.key)) fields.set(field.key, field.label);
  }));
  return Array.from(fields, ([key, label]) => ({
    key, label,
    values: items.map(item => item.fields.find(field => field.key === key)?.value ?? ''),
  })).filter(row => row.values.some(value => value.trim() !== ''));
}

export function parseComparisonSelection(search: string, items: ComparisonItem[]): string[] {
  const available = new Set(items.map(item => item.slug));
  const requested = new URLSearchParams(search).get('items')?.split(',') ?? [];
  return [...new Set(requested.map(slug => slug.trim()).filter(slug => available.has(slug)))].slice(0, 4);
}
