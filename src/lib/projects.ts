import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProjectImage } from './project-schema';

export type ProjectEntry = CollectionEntry<'projects'>;

export function getCoverImage(project: ProjectEntry): ProjectImage {
  const image = project.data.images.find(({ id }) => id === project.data.coverImage);
  if (!image) throw new Error(`Missing cover image for ${project.id}.`);
  return image;
}

export function getImageSrcSet(image: ProjectImage): string | undefined {
  return image.sources.length
    ? [...image.sources].sort((a, b) => a.width - b.width)
      .map(({ src, width }) => `${src} ${width}w`).join(', ')
    : undefined;
}

export async function getHomepageProjects() {
  const projects = await getCollection('projects');
  const leads = projects.filter(({ data }) => data.homepage === 'lead');
  if (leads.length > 1) throw new Error('Only one project may be the homepage lead.');
  const selected = projects.filter(({ data }) => data.homepage === 'selected')
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
  return { lead: leads[0], selected };
}
