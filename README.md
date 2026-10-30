# Atharva Kulkarni — Portfolio

Personal portfolio built with Remix, React, Vite, Three.js, and MDX.

## Local development

Use Node.js **20.19.0** (see `.node-version`).

```bash
npm ci
npm run dev
```

## Production build and smoke checks

```bash
npm ci
npm run build
node scripts/verify-build.mjs
node scripts/smoke-production.mjs
```

The GitHub Actions production workflow performs a clean lockfile install, builds the Remix server and browser bundles, verifies JS/CSS/Draco artifacts, and smoke-tests the Cloudflare Pages SSR response and its linked assets.

## Deployment

The current application requires a server runtime and is configured for **Cloudflare Pages Functions**:

- Build command: `npm run build`
- Output directory: `build/client`
- Functions entry: `functions/[[path]].js`
- Runtime compatibility: `nodejs_compat` (see `wrangler.toml`)

Configure `SESSION_SECRET` (at least 32 characters), `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `EMAIL`, and `FROM_EMAIL` as protected Cloudflare environment values. Never commit production credentials.

> GitHub Pages cannot run the current Remix server loaders/actions or the AWS SES contact backend. A static GitHub Pages migration would require a separate architecture change and replacement for those server features.

## Security

See [SECURITY.md](SECURITY.md) for secret handling and vulnerability reporting guidance.
