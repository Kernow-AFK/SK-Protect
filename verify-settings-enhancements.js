const fs = require('node:fs');
const [rendererPath] = process.argv.slice(2);
if (!rendererPath) throw new Error('Usage: node verify-settings-enhancements.js <renderer-bundle.js>');
const source = fs.readFileSync(rendererPath, 'utf8');

const checks = [
  ['Settings enhancements install once across route changes', 'window.__skpSettingsEnhancer=true'],
  ['appearance controls anchor to the full Layout card, outside its option row', 'node.textContent.includes("Open details on instance click")&&node.textContent.includes("Clicking an instance in the classic sidebar also opens its details page")'],
  ['custom color controls occupy a full-width separate line', 'width:100%;box-sizing:border-box;grid-column:1/-1'],
  ['two native text color controls are provided', 'addColorPicker(panel,"secondary","Secondary text"'],
  ['primary text picker targets headings and white text', "body [class~='text-white']"],
  ['secondary text picker targets muted gray text', "body [class~='text-zinc-400']"],
  ['selected text colors persist locally', 'localStorage.setItem(paletteKey,JSON.stringify(palette))'],
  ['About card identifies current beta candidate and target launcher', 'Version 1.1.0-beta.1 · beta candidate for SKlauncher 4.0.57'],
  ['About card distinguishes latest published project release', 'Latest published project release: v1.0.0'],
  ['About card includes the project website and GitHub repository', 'https://github.com/Kernow-AFK/SK-Protect'],
  ['About links use the launcher external-link bridge', 'window.api.system.openExternal(url)'],
  ['settings observer detects Appearance and About navigation', 'new MutationObserver(scheduleScan).observe(document.body,{childList:true,subtree:true,characterData:true})'],
];

let failed = false;
for (const [label, needle] of checks) {
  const ok = source.includes(needle);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  failed ||= !ok;
}
if (failed) process.exitCode = 1;
