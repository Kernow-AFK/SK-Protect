const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const [mainPath] = process.argv.slice(2);
if (!mainPath) throw new Error('Usage: node test-preferred-mods-store.js <patched-main.js>');

const source = fs.readFileSync(mainPath, 'utf8');
const start = source.indexOf('function registerPreferredMods(){');
const endMarker = ';var Fm=[it,ro]';
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('Preferred Mods registration function not found');

const handlers = new Map();
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-preferred-mods-test.'));
try {
  const context = {
    p: fs,
    l: path,
    console,
    h: {
      app: { getPath: key => key === 'userData' ? profile : (() => { throw new Error(`Unexpected app path: ${key}`); })() },
      ipcMain: { handle: (name, handler) => handlers.set(name, handler) },
    },
  };
  vm.runInNewContext(`${source.slice(start, end + 1)};registerPreferredMods()`, context);
  const call = (name, ...args) => {
    const handler = handlers.get(name);
    if (!handler) throw new Error(`Missing handler: ${name}`);
    return handler({}, ...args);
  };

  let state = call('preferred-mods:get');
  if (state.schemaVersion !== 1 || state.items.length !== 0 || state.autoApplyToNewInstances !== false) throw new Error('Bad empty state');

  state = call('preferred-mods:add', { source: 'modrinth', projectId: 'sodium', name: 'Sodium', iconUrl: 'https://example.invalid/sodium.png', downloadUrl: 'must-not-persist' });
  if (state.items.length !== 1 || state.items[0].name !== 'Sodium') throw new Error('Add failed');
  state = call('preferred-mods:add', { source: 'modrinth', projectId: 'sodium', name: 'Sodium Updated' });
  if (state.items.length !== 1 || state.items[0].name !== 'Sodium Updated') throw new Error('Deduplicating update failed');
  state = call('preferred-mods:add', { source: 'curseforge', projectId: '238222', name: 'Just Enough Items' });
  state = call('preferred-mods:reorder', ['curseforge:238222', 'modrinth:sodium']);
  if (state.items[0].projectId !== '238222' || state.items[1].order !== 1) throw new Error('Reorder failed');
  state = call('preferred-mods:set-enabled', 'modrinth', 'sodium', false);
  if (state.items.find(item => item.projectId === 'sodium').enabled !== false) throw new Error('Enable toggle failed');
  state = call('preferred-mods:set-auto-apply', true);
  if (state.autoApplyToNewInstances !== true) throw new Error('Auto-apply preference failed');
  state = call('preferred-mods:remove', 'curseforge', '238222');
  if (state.items.length !== 1 || state.items[0].projectId !== 'sodium') throw new Error('Remove failed');

  const storedPath = path.join(profile, 'preferred-mods.json');
  const storedText = fs.readFileSync(storedPath, 'utf8');
  const stored = JSON.parse(storedText);
  if (storedText.includes('downloadUrl') || storedText.includes('must-not-persist')) throw new Error('Unexpected download metadata persisted');
  if ((fs.statSync(storedPath).mode & 0o777) !== 0o600) throw new Error('Store permissions are not 0600');
  if (stored.schemaVersion !== 1 || stored.items.length !== 1) throw new Error('Restart persistence payload is invalid');

  let rejected = false;
  try { call('preferred-mods:add', { source: 'unknown', projectId: 'bad' }); } catch { rejected = true; }
  if (!rejected) throw new Error('Unknown provider was accepted');

  console.log('PASS: Preferred Mods store add/update/deduplicate/reorder/enable/settings/remove/persistence validation');
} finally {
  fs.rmSync(profile, { recursive: true, force: true });
}
