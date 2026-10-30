import { access, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

for (const path of ['build/server/index.js', 'build/client']) {
  try {
    await access(path);
  } catch {
    throw new Error(`Required production build output is missing: ${path}`);
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else files.push(path);
  }
  return files;
}

const files = await collectFiles('build/client');
const javascript = files.filter(file => /\.m?js$/i.test(file));
const stylesheets = files.filter(file => /\.css$/i.test(file));

if (javascript.length === 0) throw new Error('No client JavaScript bundles were emitted.');
if (stylesheets.length === 0) throw new Error('No client CSS bundles were emitted.');

for (const file of [...javascript, ...stylesheets]) {
  if ((await stat(file)).size === 0) throw new Error(`Empty production asset: ${file}`);
}

console.info(`Build verification passed: server entry, ${javascript.length} JS bundle(s), ${stylesheets.length} CSS bundle(s).`);
