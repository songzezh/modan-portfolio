import { z } from 'astro/zod';
import { projectCategories } from './project-categories';

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphen-separated slug.');
const imageSource = text.refine(
  (value) => /^\/(?!\/)[^\s,]+$/.test(value) || /^https:\/\/[^\s,]+$/.test(value),
  'Use a root-relative public asset path or an HTTPS URL.',
);
const dimension = z.number().int().positive();

export const projectImageSchema = z.object({
  id: slug,
  title: text,
  src: imageSource,
  width: dimension,
  height: dimension,
  orientation: z.enum(['landscape', 'portrait', 'square']),
  alt: text,
  caption: text.optional(),
  location: text.nullable().default(null),
  year: z.number().int().min(1800).max(9999).nullable().default(null),
  sources: z.array(z.object({ src: imageSource, width: dimension })).default([]),
}).superRefine((image, context) => {
  const expected = image.width === image.height ? 'square'
    : image.width > image.height ? 'landscape' : 'portrait';
  if (image.orientation !== expected) {
    context.addIssue({ code: 'custom', path: ['orientation'], message: `Dimensions require ${expected} orientation.` });
  }
  const widths = image.sources.map((source) => source.width);
  if (new Set(widths).size !== widths.length) {
    context.addIssue({ code: 'custom', path: ['sources'], message: 'Responsive source widths must be unique.' });
  }
});

export const projectSchema = z.object({
  slug,
  title: text,
  subtitle: text,
  location: text.nullable(),
  year: z.number().int().min(1800).max(9999).nullable(),
  description: text,
  categories: z.array(z.enum(projectCategories)).default([]),
  coverImage: slug,
  images: z.array(projectImageSchema).min(1),
  placeholder: z.boolean().default(false),
  homepage: z.enum(['lead', 'selected', 'none']).default('none'),
  order: z.number().int().nonnegative().default(0),
}).superRefine((project, context) => {
  const ids = project.images.map((image) => image.id);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: 'custom', path: ['images'], message: 'Image IDs must be unique within a project.' });
  }
  if (!ids.includes(project.coverImage)) {
    context.addIssue({ code: 'custom', path: ['coverImage'], message: 'Cover must reference an image ID in this project.' });
  }
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;
