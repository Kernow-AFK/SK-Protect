const fs = require('node:fs');
const path = require('node:path');

const [mainPath, preloadPath] = process.argv.slice(2);
if (!mainPath) throw new Error('Usage: node verify-privacy.js <patched-main.js> [patched-preload.js]');

const source = fs.readFileSync(mainPath, 'utf8');
const start = source.indexOf('function privacyAllowsRequest(');
const oldFetchEnd = source.indexOf('function so(', start);
const end = oldFetchEnd >= 0 ? oldFetchEnd : source.indexOf('function mn(', start);
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
  const version4057 = source.includes('function CT(){const e=!0;return{appVersion:');
  const updaterStates = preload.match(/currentVersion:"disabled"/g) ?? [];
  const restartNulls = preload.match(/autoRestartAt:null/g) ?? [];
  const passed = version4057
    ? source.includes('function CT(){const e=!0;return{appVersion:')
    : updaterStates.length > 0 && restartNulls.length >= updaterStates.length;
  console.log(`${passed ? 'PASS' : 'FAIL'} launcher updater remains disabled in this build`);
  failed ||= !passed;
}

const privateSettingsEnforced = source.includes('O.disableDiscordRpc=!0,O.disableAnalytics=!0,O.analyticsConsentChosen=!0');
console.log(`${privateSettingsEnforced ? 'PASS' : 'FAIL'} privacy defaults and persisted settings are enforced`);
failed ||= !privateSettingsEnforced;

const secureDnsForcedOff = source.includes('disableDiscordRpc=!0,O.secureDns=!1,O.disableAnalytics=!0');
console.log(`${secureDnsForcedOff ? 'FAIL' : 'PASS'} secure DNS is not forcibly disabled`);
failed ||= secureDnsForcedOff;

const feedbackMailtoAllowed = source.includes('n==="mailto:kernow-afk@protonmail.com"') && source.includes('r&&await h.shell.openExternal(t)');
console.log(`${feedbackMailtoAllowed ? 'PASS' : 'FAIL'} only the project feedback mailto is allowed through the external-link bridge`);
failed ||= !feedbackMailtoAllowed;

if (failed) process.exitCode = 1;
