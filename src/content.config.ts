import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './lib/project-schema';

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

export const collections = { projects };
