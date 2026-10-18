const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const [archivePath, replacementPath, outputPath, mainReplacementPath, preloadReplacementPath] = process.argv.slice(2);
if (!archivePath || !replacementPath || !outputPath) {
  throw new Error('Usage: node pack-asar.js <source.asar> <renderer.js> <output.asar> [main.js] [preload.js]');
}

const source = fs.readFileSync(archivePath);
const headerLength = source.readUInt32LE(12);
const header = JSON.parse(source.toString('utf8', 16, 16 + headerLength));
const sourceDataOffset = 8 + source.readUInt32LE(4);
const targetPath = 'out/renderer/assets/index-cw0H0b6L.js';
const replacements = new Map([[targetPath, replacementPath]]);
if (mainReplacementPath) replacements.set('out/main/index.js', mainReplacementPath);
if (preloadReplacementPath) replacements.set('out/preload/index.js', preloadReplacementPath);
const payloads = [];
let offset = 0;
let targetFound = false;

function pack(files, prefix = '') {
  for (const [name, entry] of Object.entries(files)) {
    const relativePath = prefix ? `${prefix}/${name}` : name;
    if (entry.files) {
      pack(entry.files, relativePath);
      continue;
    }
    if (entry.link || entry.unpacked) continue;

    const replacementFile = replacements.get(relativePath);
    const isTarget = relativePath === targetPath;
    targetFound ||= isTarget;
    const payload = replacementFile
      ? fs.readFileSync(replacementFile)
      : source.subarray(sourceDataOffset + Number(entry.offset), sourceDataOffset + Number(entry.offset) + entry.size);
    entry.size = payload.length;
    entry.offset = String(offset);
    if (replacementFile && entry.integrity) {
      const blockSize = entry.integrity.blockSize || 4 * 1024 * 1024;
      const blocks = [];
      for (let start = 0; start < payload.length; start += blockSize) {
        blocks.push(crypto.createHash('sha256').update(payload.subarray(start, start + blockSize)).digest('hex'));
      }
      entry.integrity = {
        algorithm: 'SHA256',
        hash: crypto.createHash('sha256').update(payload).digest('hex'),
        blockSize,
        blocks,
      };
    }
    payloads.push(payload);
    offset += payload.length;
  }
}

pack(header.files);
if (!targetFound) {
  throw new Error('Target bundle was not found in the ASAR file index');
}

const json = Buffer.from(JSON.stringify(header));
const padding = (4 - (json.length % 4)) % 4;
const headerSize = 8 + json.length + padding;
const prefix = Buffer.alloc(8 + headerSize);
prefix.writeUInt32LE(4, 0);
prefix.writeUInt32LE(headerSize, 4);
prefix.writeUInt32LE(headerSize - 4, 8);
prefix.writeUInt32LE(json.length, 12);
json.copy(prefix, 16);
fs.writeFileSync(outputPath, Buffer.concat([prefix, ...payloads]));
console.log(`Packed ${payloads.length} ASAR files into ${outputPath}`);