const fs = require('node:fs');
const path = require('node:path');

const [archive, action = 'inspect', output = path.resolve('work/extracted'), ...requestedPaths] = process.argv.slice(2);
if (!archive) throw new Error('Usage: node asar-tools.js <archive.asar> [inspect|extract] [output] [paths...]');

const bytes = fs.readFileSync(archive);
const headerSize = bytes.readUInt32LE(4);
const headerLength = bytes.readUInt32LE(12);
const header = JSON.parse(bytes.toString('utf8', 16, 16 + headerLength));
const dataOffset = 8 + headerSize;

function lookup(relativePath) {
  return relativePath.split('/').reduce((node, part) => {
    if (!node?.files?.[part]) throw new Error(`ASAR entry not found: ${relativePath}`);
    return node.files[part];
  }, header);
}

function visit(files, prefix = '') {
  return Object.entries(files).flatMap(([name, entry]) => {
    const relativePath = prefix ? `${prefix}/${name}` : name;
    return entry.files ? visit(entry.files, relativePath) : [[relativePath, entry]];
  });
}

if (action === 'inspect') {
  const files = visit(header.files);
  const bundles = files.filter(([name]) => /^(out\/(main|preload)\/index\.js|out\/renderer\/assets\/index-cw0H0b6L\.js)$/.test(name));
  console.log(JSON.stringify({ bundles: bundles.map(([name, entry]) => ({ name, size: entry.size })) }, null, 2));
} else if (action === 'extract') {
  if (requestedPaths.length === 0) throw new Error('No ASAR paths were requested');
  fs.mkdirSync(output, { recursive: true });
  for (const relativePath of requestedPaths) {
    const entry = lookup(relativePath);
    if (entry.files || entry.link || entry.unpacked) throw new Error(`Unsupported ASAR entry: ${relativePath}`);
    const fileOffset = dataOffset + Number(entry.offset);
    const destination = path.join(output, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, bytes.subarray(fileOffset, fileOffset + entry.size));
    console.log(`${relativePath} -> ${destination}`);
  }
} else {
  throw new Error(`Unknown action: ${action}`);
}
