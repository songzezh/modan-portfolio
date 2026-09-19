import { getCollection, type CollectionEntry } from 'astro:content';

export type GearEntry = CollectionEntry<'gear'>;

/** Stable archive order independent of filesystem enumeration. */
export async function getGear(): Promise<GearEntry[]> {
  return (await getCollection('gear')).sort((a, b) => a.id.localeCompare(b.id));
}
