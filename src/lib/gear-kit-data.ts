import type { Gear } from './gear-schema';
import type { GearKit } from './gear-kit-schema';

/** Preserve the kit's authored sequence and fail rather than silently drop equipment. */
export function resolveKitGear(kit: GearKit, gearBySlug: ReadonlyMap<string, Gear>): Gear[] {
  return kit.gearItemSlugs.map(slug => {
    const item = gearBySlug.get(slug);
    if (!item) throw new Error(`Gear kit "${kit.slug}" references missing gear "${slug}".`);
    return item;
  });
}

/** Sum recorded weights only when every item has an explicit supported measurement. */
export function totalKitWeightGrams(items: readonly Gear[]): number | undefined {
  if (!items.length) return undefined;
  let total = 0;
  for (const item of items) {
    const weight = item.specs.find(spec => spec.key === 'weight');
    if (!weight || typeof weight.value !== 'number' || !Number.isFinite(weight.value) || weight.value < 0) {
      return undefined;
    }
    const unit = weight.unit?.trim().toLowerCase();
    if (unit !== 'g' && unit !== 'kg') return undefined;
    total += weight.value * (unit === 'kg' ? 1000 : 1);
  }
  return Number.isFinite(total) ? total : undefined;
}
