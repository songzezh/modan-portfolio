import { getCollection, type CollectionEntry } from 'astro:content';
import { getProjects, type ProjectEntry } from './projects';
import type { ProjectImage } from './project-schema';

export type JournalEntry = CollectionEntry<'journal'>;
export interface ResolvedJournalEntry {
  entry: JournalEntry;
  work: {
    project: ProjectEntry;
    image: ProjectImage;
  } | null;
}

export async function getJournalEntries(): Promise<ResolvedJournalEntry[]> {
  const entries = (await getCollection('journal', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
  const projects = await getProjects();
  const projectsBySlug = new Map(projects.map((project) => [project.data.slug, project]));

  return entries.map((entry) => {
    const reference = entry.data.work;
    if (!reference) return { entry, work: null };

    const project = projectsBySlug.get(reference.project);
    if (!project) {
      throw new Error(`Journal ${entry.id}: referenced work project "${reference.project}" does not exist.`);
    }
    const image = project.data.images.find(({ id }) => id === reference.image);
    if (!image) {
      throw new Error(`Journal ${entry.id}: image "${reference.image}" does not exist in work project "${reference.project}".`);
    }
    return { entry, work: { project, image } };
  });
}

export function formatJournalDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
