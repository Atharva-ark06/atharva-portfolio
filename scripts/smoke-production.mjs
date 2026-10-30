import { spawn } from 'node:child_process';

const port = 8788;
const base = `http://127.0.0.1:${port}`;
const isWindows = process.platform === 'win32';
const child = spawn('npx', ['wrangler', 'pages', 'dev', './build/client', '--ip', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
  // On POSIX, give Wrangler and its workerd/esbuild descendants a process
  // group so the whole local test server can be stopped during cleanup.
  detached: !isWindows,
});

let logs = '';
child.stdout.on('data', chunk => { logs += chunk.toString(); });
child.stderr.on('data', chunk => { logs += chunk.toString(); });

function waitForExit(timeoutMs) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true);
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve(false), timeoutMs);
    child.once('close', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}

async function stopServer() {
  if (child.exitCode !== null || child.signalCode !== null) return;

  try {
    if (isWindows) {
      child.kill('SIGTERM');
    } else {
      process.kill(-child.pid, 'SIGTERM');
    }
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }

  if (await waitForExit(5_000)) return;

  // Do not leave Wrangler, workerd, or esbuild running after the smoke test.
  try {
    if (isWindows) {
      child.kill('SIGKILL');
    } else {
      process.kill(-child.pid, 'SIGKILL');
    }
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }

  await waitForExit(5_000);
}

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Wrangler exited early.\\n${logs}`);
    try {
      const response = await fetch(base);
      if (response.ok) return response;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for Wrangler.\\n${logs}`);
}

try {
  const page = await waitForServer();
  const html = await page.text();
  if (!html.includes('<html') || !html.includes('</html>')) {
    throw new Error('SSR response did not contain a complete HTML document.');
  }

  const assetPaths = new Set([
    ...[...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(match => match[1]),
    ...[...html.matchAll(/<link[^>]+href=["']([^"']+\\.css(?:\\?[^"']*)?)["']/gi)].map(match => match[1]),
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
    if (/\\.m?js$/i.test(url.pathname) && !/(javascript|ecmascript)/i.test(type)) {
      throw new Error(`JavaScript has unexpected content type: ${type}`);
    }
  }

  console.info(`Production smoke test passed: SSR HTML and ${assetPaths.size} JS/CSS asset request(s).`);
} finally {
  await stopServer();
}
