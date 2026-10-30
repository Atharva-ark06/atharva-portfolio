const fs = require('node:fs');
const path = require('node:path');

const sourceDirectory = path.join(
  process.cwd(),
  'node_modules',
  'three',
  'examples',
  'jsm',
  'libs',
  'draco',
  'gltf'
);
const outputDirectory = path.join(process.cwd(), 'public', 'draco');
const decoderFiles = ['draco_decoder.wasm', 'draco_wasm_wrapper.js'];

fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of decoderFiles) {
  const source = path.join(sourceDirectory, file);
  const destination = path.join(outputDirectory, file);

  if (!fs.existsSync(source)) {
    throw new Error(`Three.js Draco decoder asset is missing: ${source}`);
  }

  fs.copyFileSync(source, destination);
}

console.info('Three.js Draco decoder assets copied to public/draco.');
