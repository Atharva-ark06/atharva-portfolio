# Security Policy

- Use the Node version pinned in `.node-version` for reproducible builds.
- Production sessions require a deployment-provided `SESSION_SECRET` of at least 32 characters.
- AWS SES credentials and sender/recipient addresses belong in Cloudflare Pages environment secrets, never source control.
- Do not publish `.dev.vars`, environment files, cookies, tokens, or logs containing personal data.

Report suspected vulnerabilities privately to the repository owner. Include the affected route/component, impact, reproduction steps using synthetic data, and a suggested mitigation.

These controls are defense-in-depth for an informational portfolio. They are not a formal certification or a guarantee that every third-party dependency is vulnerability-free.
