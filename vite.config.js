import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { vercelPreset } from '@vercel/remix/vite';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import rehypePrism from '@mapbox/rehype-prism';

installGlobals();

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],

  build: {
    assetsInlineLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('threejs-components')) {
            return 'tubes-cursor';
          }

          if (
            id.includes('/node_modules/three/') ||
            id.includes('/node_modules/three-stdlib/')
          ) {
            return 'three-vendor';
          }
        },
      },
    },
  },

  server: {
    port: 7777,
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
      presets: [vercelPreset()],

      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      },

      routes(defineRoutes) {
        return defineRoutes((route) => {
          route('/', 'routes/home/route.js', { index: true });
        });
      },
    }),

    jsconfigPaths(),
  ],
});
