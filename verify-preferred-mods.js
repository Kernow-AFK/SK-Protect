const fs = require('node:fs');

const [mainPath, preloadPath] = process.argv.slice(2);
if (!mainPath || !preloadPath) {
  throw new Error('Usage: node verify-preferred-mods.js <main.js> <preload.js>');
}

const main = fs.readFileSync(mainPath, 'utf8');
const preload = fs.readFileSync(preloadPath, 'utf8');
const checks = [
  ['schema-versioned store', main.includes('schemaVersion:1')],
  ['atomic temporary write', main.includes('temp=file+".tmp"') && main.includes('p.renameSync(temp,file)')],
  ['private store permissions', main.includes('p.chmodSync(file,384)')],
  ['bounded item count', main.includes('value.items.slice(0,500)')],
  ['provider allowlist', main.includes('["modrinth","curseforge"].includes(source)')],
  ['mod-only content type', main.includes('type:"mod"')],
  ['deduplicated project identity', main.includes('item.source+":"+item.projectId')],
  ['future-instance preference', main.includes('autoApplyToNewInstances')],
  ['get handler', main.includes('preferred-mods:get')],
  ['add handler', main.includes('preferred-mods:add')],
  ['remove handler', main.includes('preferred-mods:remove')],
  ['enable handler', main.includes('preferred-mods:set-enabled')],
  ['reorder handler', main.includes('preferred-mods:reorder')],
  ['preload API exposed', preload.includes('preferredMods:{get:') && preload.includes('setAutoApply:')],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  failed ||= !ok;
}
if (failed) process.exitCode = 1;
