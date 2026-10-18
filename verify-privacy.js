const fs = require('node:fs');
const path = require('node:path');

const [mainPath, preloadPath] = process.argv.slice(2);
if (!mainPath) throw new Error('Usage: node verify-privacy.js <patched-main.js> [patched-preload.js]');

const source = fs.readFileSync(mainPath, 'utf8');
const start = source.indexOf('function privacyAllowsRequest(');
const end = source.indexOf('function so(', start);
if (start < 0 || end < 0) throw new Error('Privacy request allowlist was not found');
const allowlistSource = source.slice(start, end);
const privacyAllowsRequest = new Function(`${allowlistSource}; return privacyAllowsRequest;`)();

const cases = [
  ['news JSON', 'https://beta.skmedix.pl/news.json', 'GET', true],
  ['server list', 'https://cdn.xyrios.com/api/servers.json', 'GET', true],
  ['public server icon', 'https://cdn.xyrios.com/api/servers/42.png', 'GET', true],
  ['public PNG banner', 'https://cdn.xyrios.com/banners/example.server-banner.png', 'GET', true],
  ['public GIF banner', 'https://cdn.xyrios.com/banners/example_server.gif', 'GET', true],
  ['numeric server details', 'https://xyrios.com/api/servers/42', 'GET', true],
  ['server list POST', 'https://cdn.xyrios.com/api/servers.json', 'POST', false],
  ['server IP-copy tracking', 'https://xyrios.com/api/servers/42/ip-copy', 'POST', false],
  ['server tracking path', 'https://xyrios.com/api/servers/42/ip-copy', 'GET', false],
  ['server icon extra path', 'https://cdn.xyrios.com/api/servers/42.png/extra', 'GET', false],
  ['server icon POST', 'https://cdn.xyrios.com/api/servers/42.png', 'POST', false],
  ['banner unsupported extension', 'https://cdn.xyrios.com/banners/example.svg', 'GET', false],
  ['banner nested path', 'https://cdn.xyrios.com/banners/folder/example.png', 'GET', false],
  ['remote configuration', 'https://meta.skmedix.pl/v1/launcher/config.json', 'GET', false],
  ['library patch feed', 'https://meta.skmedix.pl/v1/launcher/library-patches.json', 'GET', false],
  ['secure news path only', 'https://beta.skmedix.pl/news.json/extra', 'GET', false],
  ['lookalike news host', 'https://evil-beta.skmedix.pl/news.json', 'GET', false],
  ['HTTP news request', 'http://beta.skmedix.pl/news.json', 'GET', false],
  ['invalid server ID', 'https://xyrios.com/api/servers/0', 'GET', false],
];

let failed = false;
for (const [label, url, method, expected] of cases) {
  const actual = privacyAllowsRequest(url, method);
  const passed = actual === expected;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`);
  failed ||= !passed;
}
if (failed) process.exitCode = 1;

if (preloadPath) {
  const preload = fs.readFileSync(preloadPath, 'utf8');
  const updaterStates = preload.match(/currentVersion:"disabled"/g) ?? [];
  const restartNulls = preload.match(/autoRestartAt:null/g) ?? [];
  const passed = updaterStates.length > 0 && restartNulls.length >= updaterStates.length;
  console.log(`${passed ? 'PASS' : 'FAIL'} disabled updater cannot schedule a restart toast`);
  failed ||= !passed;
}

if (failed) process.exitCode = 1;
