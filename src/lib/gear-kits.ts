import { getCollection, type CollectionEntry } from 'astro:content';
import { getGear } from './gear';
import { resolveKitGear, totalKitWeightGrams } from './gear-kit-data';

export type GearKitEntry = CollectionEntry<'gearKits'>;

export async function getGearKits() {
  const [kits, gear] = await Promise.all([getCollection('gearKits'), getGear()]);
  const gearBySlug = new Map(gear.map(entry => [entry.data.slug, entry.data]));
  return kits.sort((a, b) => a.id.localeCompare(b.id)).map(entry => {
    const items = resolveKitGear(entry.data, gearBySlug);
    return { entry, items, totalWeightGrams: totalKitWeightGrams(items) };
  });
}
