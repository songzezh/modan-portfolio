import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated slug.');

export const journalWorkReferenceSchema = z.object({
  project: slug,
  image: slug,
});

export const journalSchema = z.object({
  title: text,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a quoted YYYY-MM-DD date.')
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    }, 'Use a valid calendar date.'),
  description: text,
  work: journalWorkReferenceSchema.optional(),
  location: text.nullable(),
  tags: z.array(text).default([]),
  draft: z.boolean().default(false),
  placeholder: z.boolean().default(false),
});
