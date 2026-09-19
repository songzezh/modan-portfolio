import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated slug.');

export const gearKitSchema = z.object({
  slug,
  name: text,
  description: text,
  scenarios: z.array(text).min(1),
  gearItemSlugs: z.array(slug).min(1).refine(
    slugs => new Set(slugs).size === slugs.length,
    'Each gear item may appear only once in a kit.',
  ),
  notes: z.array(text).default([]),
});

export type GearKit = z.infer<typeof gearKitSchema>;
export type GearKitInput = z.input<typeof gearKitSchema>;
