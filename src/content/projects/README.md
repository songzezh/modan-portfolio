# Photography projects

Add one JSON file per project here, named `<slug>.json`. Astro validates the
collection during content sync, checks, and builds. The filename, `slug`, and
collection entry ID must match. The homepage reads this collection; do not add
project titles, paths, captions, or dimensions to page templates.

## Project fields

| Field | Value |
| --- | --- |
| `slug` | Unique lowercase, hyphen-separated identifier |
| `title` | Nonempty project title |
| `subtitle` | Nonempty secondary title or short metadata line |
| `location` | Location string, or `null` when unknown |
| `year` | Integer from 1800–9999, or `null` when unknown |
| `description` | Nonempty plain-text project description |
| `categories` | Optional array of `street`, `portrait`, and/or `travel`; defaults to `[]` |
| `coverImage` | ID of an image in this project's `images` array |
| `images` | Nonempty, ordered image list; order is the reading sequence |
| `placeholder` | Optional boolean; defaults to false; marks demonstration content |
| `homepage` | Optional `lead`, `selected`, or `none` (default) |
| `order` | Optional nonnegative integer; sorts the portfolio and selected projects, then slug |

Only one project may have `homepage: "lead"`. Missing lead or selected projects
simply omit that homepage section. Placeholder entries remain visible while the
site is being developed; replace their metadata and images before publication.

The `/work` filters read `categories` from each entry. A project can belong to
multiple categories, for example `["street", "travel"]`. An empty or omitted
array makes it visible only under All. Categories describe subject matter, not
image orientation. Current landscape placeholders are categorized as Travel.
All entries render into HTML; filtering is optional client-side enhancement.

## Image fields

Each image has `id`, `src`, `orientation`, `width`, `height`, and nonempty `alt`.
An image's `id` must be unique within its project. `orientation` is `landscape`,
`portrait`, or `square` and must agree with its positive integer pixel dimensions.
`caption` is an optional nonempty string. Omit it when there is no caption.

`src` is a root-relative public path such as `/assets/projects/my-project/01.webp`
or an HTTPS URL. Public paths omit the `public/` prefix. `sources` optionally
contains responsive variants as `{ "src": "...", "width": 600 }`; widths must
be unique. Variants should preserve the source aspect ratio. These paths are
served directly, so provide optimized files and verify their actual dimensions;
schema validation checks metadata, not the bytes of remote or public images.

The cover is a reference, not a second image object: editing its alt text or
dimensions in the image list updates every use. See the existing placeholder
entries for complete, working examples, including responsive sources.

## Reuse

Use `getCollection('projects')` or `getEntry('projects', slug)` from
`astro:content`. `src/lib/projects.ts` provides `getCoverImage`, `getImageSrcSet`,
and `getHomepageProjects`. `Project` and `ProjectImage` types are inferred from
the schemas in `src/lib/project-schema.ts`; `ProjectEntry` is the Astro entry type.

Pages control markup, responsive `sizes`, layout, and image loading priority.
Collection entries control content. `/work` lists every series in editorial order;
`/work/[slug]` renders the image list in its stored order. Previous/next navigation
uses the same portfolio order, without wrapping at either end. Unknown locations
and years are omitted. Portraits are narrow, squares medium, and landscapes wide;
desktop alignment alternates, with every third landscape full width. Mobile
images use the available width. Add images and optional captions in JSON to
extend a photobook without editing its page template.

Implementation follows [Astro content collections](https://docs.astro.build/en/guides/content-collections/).
