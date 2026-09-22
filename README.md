# modan-portfolio

MODAN / 漠澹 — A minimalist photography portfolio and visual journal built with Astro, TypeScript, vanilla JavaScript, and CSS, designed for deployment on Cloudflare.

## README Introduction

> **MODAN / 漠澹**
> **Photography & Visual Journal**

MODAN / 漠澹 is a minimalist photography portfolio focused on quiet imagery, visual storytelling, and carefully curated photographic series.

The project is designed around a simple idea: the website should remain unobtrusive, allowing the photographs to take visual priority.

Built with **Astro**, **TypeScript**, **vanilla JavaScript**, and **CSS**, MODAN follows a static-first architecture with lightweight client-side interactions. The site is designed to be deployed on **Cloudflare**, with photographic assets stored separately using **Cloudflare R2**.

### Design Principles

- Photography first
- Minimal interface
- Generous whitespace
- Editorial, photobook-inspired layouts
- Fast static pages
- Minimal client-side JavaScript
- Responsive image presentation
- Subtle motion and transitions
- Accessible keyboard and touch interactions

### Planned Features

- [ ] Curated photography projects and series
- [ ] Responsive galleries
- [ ] Image lightbox
- [ ] Category and project filtering
- [ ] Keyboard and touch navigation
- [ ] Photography journal
- [ ] Cloudflare R2 image storage
- [ ] SEO and social sharing metadata
- [ ] Progressive Web App support

## Development

Use Node.js 24 (see `.node-version`) and npm (including npx).

```sh
npm install
npx astro dev
```

| Command | Purpose |
| --- | --- |
| `npx astro dev` | Start the Astro development server |
| `npx astro check` | Check Astro files and TypeScript |
| `npm run build` | Check types and generate the static site in `dist/` |
| `npx astro build` | Generate the static site without running the type check |
| `npx astro preview` | Preview the production build after building |
| `npm run preview:cloudflare` | Build and preview with the local Cloudflare runtime |
| `npm run deploy` | Build and deploy static assets to Cloudflare Workers |

## Structure

```text
modan-portfolio/
├── public/
│   └── assets/
│       └── placeholders/       Sample photographs, WebP variants, and asset notes
├── src/
│   ├── components/
│   │   ├── Header.astro        Site branding and primary navigation
│   │   ├── Footer.astro        Shared site footer
│   │   ├── Lightbox.astro      Accessible photograph viewer
│   │   ├── GearNavigation.astro    Camera gear section navigation
│   │   ├── GearList.astro          Reusable equipment list
│   │   └── GearFilterFields.astro  Shared equipment filter controls
│   ├── content/
│   │   ├── projects/          Photography series as JSON, plus authoring notes
│   │   ├── journal/           Journal entries with optional one-way Work references
│   │   ├── gear/              Equipment JSON collection and authoring notes
│   │   └── gear-kits/         Equipment kit JSON collection and authoring notes
│   ├── layouts/
│   │   ├── BaseLayout.astro   HTML metadata, global CSS, header, footer, page shell
│   │   └── GearLayout.astro   Shared layout for camera gear pages
│   ├── lib/
│   │   ├── projects.ts        Project queries and responsive image helpers
│   │   ├── project-schema.ts  Project content validation
│   │   ├── project-categories.ts   Shared photography categories
│   │   ├── journal.ts         Journal content queries
│   │   ├── journal-schema.ts  Journal content validation
│   │   ├── gear.ts            Equipment content queries
│   │   ├── gear-schema.ts     Equipment content validation
│   │   ├── gear-display.ts    Equipment display helpers
│   │   ├── gear-filters.ts    Equipment filtering logic
│   │   ├── gear-comparison.ts Equipment comparison logic
│   │   ├── gear-kits.ts       Kit queries and equipment reference resolution
│   │   ├── gear-kit-schema.ts Kit content validation
│   │   └── gear-kit-data.ts   Kit reference and total-weight helpers
│   ├── pages/
│   │   ├── index.astro        Homepage
│   │   ├── about.astro        About page
│   │   ├── work.astro         Photography project index
│   │   ├── work/[slug].astro  Individual photography series
│   │   ├── work/[slug]/[image].astro  Individual photograph detail
│   │   ├── journal.astro      Journal index
│   │   ├── journal/[slug].astro    Individual journal entries
│   │   └── wiki/
│   │       ├── index.astro    Knowledge topic index
│   │       └── camera-gear/
│   │           ├── index.astro    Camera gear overview
│   │           ├── archive.astro  Filterable equipment archive
│   │           ├── compare.astro  Equipment comparison page
│   │           ├── kits.astro     Equipment kit combinations
│   │           └── [slug].astro   Individual equipment details
│   ├── scripts/
│   │   ├── lightbox.ts        Viewer controls, keyboard, and touch interactions
│   │   ├── gallery-filter.ts  Photography category filtering
│   │   ├── gear-filter.ts     Equipment archive filter interactions
│   │   ├── gear-compare.ts    Equipment comparison interactions
│   │   └── README.md          Browser interaction documentation
│   ├── styles/
│   │   ├── tokens.css         Colors, typography, spacing, widths, and motion
│   │   ├── global.css         Shared element styles and page introductions
│   │   ├── wiki.css           Knowledge topic grid and cards
│   │   ├── gear-compare.css   Equipment comparison styles
│   │   └── README.md          Visual foundation and spacing reference
│   └── content.config.ts      Collection loaders and schema registration
├── tests/
│   └── gear-kits.test.mjs     Kit validation, references, and weight calculations
├── .gitignore                Excludes dependencies, build output, and local files
├── .node-version             Recommended Node.js version
├── astro.config.mjs          Static output and legacy gear URL redirects
├── package.json              Dependencies and development/build/deploy commands
├── package-lock.json         Locked dependency versions
├── tsconfig.json             Strict Astro TypeScript configuration
├── wrangler.jsonc            Cloudflare Workers Static Assets configuration
└── README.md                 Project overview and development guide
```

### Routes and content

Astro uses file-based routing: `src/pages/work.astro` serves `/work`, while
`src/pages/work/[slug].astro` generates individual project pages from content.
`src/pages/work/[slug]/[image].astro` generates one independently addressable
detail page for every photograph in a series. Journal and equipment detail
pages follow the same pattern. The canonical
camera gear routes live under `/wiki/camera-gear`; legacy `/gear` routes are
redirected through `astro.config.mjs`.

`src/content.config.ts` registers four collections: `projects`, `journal`,
`gear`, and `gearKits`. Their schemas live in `src/lib/*-schema.ts`;
collection queries and shared data logic also live in `src/lib/`. Equipment
and kit collections currently contain authoring notes but no JSON entries.

Photography metadata has a single owner: each Work project JSON file. A Journal
entry may optionally reference a project image by project slug and image ID;
the build resolves and validates that reference without copying image metadata
into Journal frontmatter. This dependency is one-way—Work pages never depend on
Journal entries.

To add content, follow the local guides for [photography projects](src/content/projects/README.md),
[journal entries](src/content/journal/README.txt), [equipment](src/content/gear/README.md),
and [equipment kits](src/content/gear-kits/README.md). Files in `public/` are
served unchanged from the site root; for example,
`public/assets/placeholders/coast.jpg` is available at
`/assets/placeholders/coast.jpg`.

### Layout, styling, and interactions

Astro renders pages to static HTML at build time. TypeScript uses Astro's strict
configuration. There are no frontend framework integrations or CSS frameworks.
`BaseLayout.astro` provides the shared page shell and imports `global.css`,
which imports `tokens.css`. Page and component styles are colocated in Astro
`<style>` blocks; shared topic and comparison styles live in `src/styles/`.
See the [style guide](src/styles/README.md) for design tokens and spacing rules.

Client-side interactions are implemented in `src/scripts/` and imported through
Astro `<script>` tags on the pages or components that need them. Astro processes
and bundles these modules for lightboxes, gallery filters, equipment filters,
and comparisons. See the [interaction guide](src/scripts/README.md) for lightbox
and gallery behavior.

### Generated directories

- `node_modules/`: installed dependencies.
- `.astro/`: generated Astro types and content metadata.
- `dist/`: generated static site, served by the Cloudflare deployment.
- `.wrangler/`: local Wrangler state and cache.

These directories are generated locally and excluded from version control.
Edit source files rather than generated output.

## Cloudflare deployment

`wrangler.jsonc` configures Cloudflare Workers Static Assets to serve `dist/`.
The static site needs no server entry point or Astro Cloudflare adapter.

For a first deployment, authenticate with `npx wrangler login`, then run
`npm run deploy`. Change the worker name in `wrangler.jsonc` if necessary.

For Cloudflare Workers Git integration, use `npm run build` as the build command
and `npx wrangler deploy` as the deploy command. Use Node.js 24 and install
dependencies with `npm ci` in CI.

Cloudflare Pages can also serve this static output: use `npm run build` and set the
output directory to `dist` with no server adapter.

See the [Astro Cloudflare deployment guide](https://docs.astro.build/en/guides/deploy/cloudflare/).
