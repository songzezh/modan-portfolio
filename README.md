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
public/
  assets/       Files served unchanged at /assets/
src/
  components/   Reusable .astro components
  content/      Local content; define collection schemas when needed
  layouts/      Shared HTML document layouts
  pages/        File-based routes
  scripts/      Vanilla TypeScript or JavaScript browser modules
  styles/       Plain CSS
```

Astro renders pages to static HTML at build time. TypeScript uses Astro's strict
configuration. There are no frontend framework integrations or CSS frameworks.
The homepage is an unstyled placeholder; visual design has not been implemented.

Add client-side interactions with Astro `<script>` tags importing modules from
`src/scripts/`. Astro processes and bundles these modules. No client-side
JavaScript is shipped until interactions are added. Shared CSS is imported by
`BaseLayout.astro`.

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
