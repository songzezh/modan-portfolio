import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './lib/project-schema';
import { journalSchema } from './lib/journal-schema';

const projects = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/projects',
    generateId: ({ entry, data }) => {
      const filename = entry.replace(/\.json$/, '');
      if (filename !== data.slug) {
        throw new Error(`Project ${entry}: filename must match its slug.`);
      }
      return filename;
    },
  }),
  schema: projectSchema,
});

const journal = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/journal',
    generateId: ({ entry }) => {
      const slug = entry.replace(/\.md$/, '');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`Journal ${entry}: use a lowercase, hyphen-separated filename.`);
      }
      return slug;
    },
  }),
  schema: journalSchema,
});

export const collections = { projects, journal };
