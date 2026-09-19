import { z } from 'astro/zod';

export const gearCategories = ['camera', 'lens', 'film-camera', 'accessory'] as const;
export const gearStatuses = ['owned', 'previously-owned', 'borrowed', 'wishlist'] as const;

export type GearCategory = typeof gearCategories[number];
export type GearStatus = typeof gearStatuses[number];

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated slug.');
const date = z.iso.date();

export const gearImageSchema = z.object({
  src: text.refine(
    (value) => /^\/(?!\/)[^\s,]+$/.test(value) || /^https:\/\/[^\s,]+$/.test(value),
    'Use a root-relative public asset path or an HTTPS URL.',
  ),
  alt: text,
});

/** Stable keys allow new specifications without changing the item schema. */
export const gearSpecSchema = z.object({
  key: slug,
  label: text,
  value: z.union([text, z.number(), z.boolean()]),
  unit: text.optional(),
});

export const gearSchema = z.object({
  slug: slug.refine(value => !['archive', 'compare', 'kits'].includes(value), 'The slugs archive, compare, and kits are reserved for gear pages.'),
  name: text,
  brand: text,
  category: z.enum(gearCategories),
  status: z.enum(gearStatuses),
  releaseYear: z.number().int().min(1800).max(9999).optional(),
  image: gearImageSchema.optional(),
  summary: text,
  specs: z.array(gearSpecSchema).default([]),
  usageScenarios: z.array(text).default([]),
  personalNotes: z.array(text).default([]),
  ownershipDates: z.object({
    acquired: date.optional(),
    relinquished: date.optional(),
  }).optional(),
  purchasePrice: z.number().nonnegative().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/, 'Use a three-letter uppercase currency code.').optional(),
  relatedProjectSlugs: z.array(slug).default([]),
}).superRefine((gear, context) => {
  const { acquired, relinquished } = gear.ownershipDates ?? {};
  if (acquired && relinquished && relinquished < acquired) {
    context.addIssue({ code: 'custom', path: ['ownershipDates', 'relinquished'], message: 'Relinquished date must not precede acquired date.' });
  }
  if (gear.purchasePrice !== undefined && gear.currency === undefined) {
    context.addIssue({ code: 'custom', path: ['currency'], message: 'A purchase price requires a currency.' });
  }
  const keys = gear.specs.map((spec) => spec.key);
  if (new Set(keys).size !== keys.length) {
    context.addIssue({ code: 'custom', path: ['specs'], message: 'Specification keys must be unique within an item.' });
  }
});

export type Gear = z.infer<typeof gearSchema>;
export type GearInput = z.input<typeof gearSchema>;
export type GearImage = z.infer<typeof gearImageSchema>;
export type GearSpec = z.infer<typeof gearSpecSchema>;
