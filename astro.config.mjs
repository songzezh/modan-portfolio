import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  redirects: {
    '/gear': '/wiki/camera-gear',
    '/gear/archive': '/wiki/camera-gear/archive',
    '/gear/kits': '/wiki/camera-gear/kits',
    '/gear/compare': '/wiki/camera-gear/compare',
    '/gear/[slug]': '/wiki/camera-gear/[slug]',
  },
});
