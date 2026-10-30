import { spawn } from 'node:child_process';

const port = 8788;
const base = `http://127.0.0.1:${port}`;
const child = spawn('npx', ['wrangler', 'pages', 'dev', './build/client', '--ip', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});

let logs = '';
child.stdout.on('data', chunk => { logs += chunk.toString(); });
child.stderr.on('data', chunk => { logs += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Wrangler exited early.\n${logs}`);
    try {
      const response = await fetch(base);
      if (response.ok) return response;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for Wrangler.\n${logs}`);
}

try {
  const page = await waitForServer();
  const html = await page.text();
  if (!html.includes('<html') || !html.includes('</html>')) {
    throw new Error('SSR response did not contain a complete HTML document.');
  }

  const assetPaths = new Set([
    ...[...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(match => match[1]),
    ...[...html.matchAll(/<link[^>]+href=["']([^"']+\.css(?:\?[^"']*)?)["']/gi)].map(match => match[1]),
  ]);

  if (assetPaths.size === 0) throw new Error('SSR HTML did not reference any JS or CSS assets.');

  for (const assetPath of assetPaths) {
    const url = new URL(assetPath, base);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Asset request failed (${response.status}): ${url}`);
    const body = await response.arrayBuffer();
    if (body.byteLength === 0) throw new Error(`Asset response was empty: ${url}`);
    const type = response.headers.get('content-type') || '';
    if (url.pathname.endsWith('.css') && !type.includes('text/css')) {
      throw new Error(`Stylesheet has unexpected content type: ${type}`);
    }
    if (/\.m?js$/i.test(url.pathname) && !/(javascript|ecmascript)/i.test(type)) {
      throw new Error(`JavaScript has unexpected content type: ${type}`);
    }
  }

  console.info(`Production smoke test passed: SSR HTML and ${assetPaths.size} JS/CSS asset request(s).`);
} finally {
  child.kill('SIGTERM');
}
