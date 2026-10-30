import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import rehypePrism from '@mapbox/rehype-prism';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],

  build: {
    assetsInlineLimit: 1024,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('threejs-components')) return 'tubes-cursor';
          if (
            id.includes('/node_modules/three/') ||
            id.includes('/node_modules/three-stdlib/')
          ) return 'three-vendor';
        },
      },
    },
  },

  server: {
    port: 7777,
  },

  // Remix is executed inside a Cloudflare Worker in production.
  // Keep the SSR bundle on web-platform APIs rather than Node built-ins.
  ssr: {
    target: 'webworker',
    resolve: {
      conditions: ['workerd', 'worker', 'browser', 'module', 'import', 'default'],
      externalConditions: ['workerd', 'worker', 'browser', 'module', 'import', 'default'],
    },
  },

  plugins: [
    mdx({
      rehypePlugins: [
        [rehypeImgSize, { dir: 'public' }],
        rehypeSlug,
        rehypePrism,
      ],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),

    remix({
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      },
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'routes/home/route.js', { index: true });
        });
      },
    }),

    jsconfigPaths(),
  ],
});
