const fs = require('node:fs');

const [rendererPath] = process.argv.slice(2);
if (!rendererPath) throw new Error('Usage: node verify-preferred-mods-ui.js <renderer-bundle.js>');
const source = fs.readFileSync(rendererPath, 'utf8');

const checks = [
  ['Svelte-owned Preferred Mods page', 'function SKPPage(e,a){er(a,!0)'],
  ['Preferred Mods route', 'a.currentPage==="preferredMods"'],
  ['sidebar entry', '{id:"preferredMods",label:"Preferred Mods"'],
  ['Dashboard entry point', 'data-skp-dashboard-preferred'],
  ['Library entry point', 'data-skp-library-preferred'],
  ['Customization entry point', 'skpCustomization.innerHTML'],
  ['instance Content Browser entry point', 'data-skp-instance-preferred'],
  ['instance entry preselects its target', 'window.__skPreferredTargetInstance=pt.instanceId'],
  ['new-instance auto-apply hook', 'window.__skApplyPreferredModsToInstance=async function(instanceId)'],
  ['auto-apply reads preference', 'if(!state?.autoApplyToNewInstances)return'],
  ['auto-apply resolves compatibility', 'versionsResult.value.some(version=>HT(version,"mod",instance))'],
  ['auto-apply reuses installer', 'installSelectedContent(project,versionsResult.value,[instance.id],it)'],
  ['master list API read', 'window.api.preferredMods.get()'],
  ['enable/disable support', 'window.api.preferredMods.setEnabled'],
  ['remove support', 'window.api.preferredMods.remove'],
  ['future-instance preference', 'window.api.preferredMods.setAutoApply'],
  ['Content Hub add mode', 'window.__skPreferredAddMode'],
  ['project identity only', 'projectId:Y.id,type:"mod"'],
  ['instance review uses launcher instances', 'Zr.getById(Y.value)'],
  ['provider releases are resolved fresh', 'Sr.getVersions(te.projectId,te.source'],
  ['existing compatibility predicate reused', 'HT(re,"mod",se)'],
  ['existing preferred release selector reused', 'QT(ae,"mod",se)'],
  ['compatible mods start selected', 'compatible:N,selected:N'],
  ['unavailable mods are disabled', 'K.disabled=!N'],
  ['normal installation route reused', 'installSelectedContent(ae.project,ae.versions,[se.id],it)'],
  ['no persisted download URL', 'downloadUrl:Y.'],
];

let failed = false;
for (const [label, needle] of checks) {
  const present = source.includes(needle);
  const ok = label === 'no persisted download URL' ? !present : present;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  failed ||= !ok;
}
if (failed) process.exitCode = 1;
