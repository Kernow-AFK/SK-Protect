const fs = require('node:fs');

const [rendererPath] = process.argv.slice(2);
if (!rendererPath) throw new Error('Usage: node verify-preferred-mods-ui.js <renderer-bundle.js>');
const source = fs.readFileSync(rendererPath, 'utf8');

if (source.includes('function SKPPage4057(e,a){')) {
  const modernChecks = [
    ['Preferred Mods page component is present', 'function SKPPage4057(e,a){'],
    ['Preferred Mods root is uniquely marked and remounted once', 'root.dataset.skpPreferredPage=\"true\";root.className'],
    ['instance selector begins with Select instance placeholder', '<option value=\"\" disabled selected>Select instance…</option>'],
    ['Apply action shares the instance selector row', '<div class=\"flex flex-col gap-2 sm:flex-row\"><select data-skp-instance'],
    ['Preferred Mods CTA uses the application page navigation callback', 'window.__skNavigate=U=>a.onNavigate?.({page:U})'],
    ['Add Mods opens Content Hub through the sidebar callback', "window.__skPreferredAddMode=!0;window.__skNavigate?.('discoverContent')"],
    ['Preferred Mods Content Hub stays filtered to mods during add mode', 'function O(Z){if(window.__skPreferredAddMode){da.setContentType(\"mod\");return}da.setContentType(Z)}if(window.__skPreferredAddMode)da.setContentType(\"mod\");'],
    ['adding a mod keeps Preferred Mods add mode active for subsequent cards', 'if(window.__skPreferredAddMode){try{await window.api.preferredMods.add({source:a.project.source,projectId:a.project.id,type:\"mod\"'],
    ['Content Hub action label changes only in Preferred Mods add mode', '()=>window.__skPreferredAddMode?\"Add to Preferred Mods\":eo()'],
    ['instance page shortcut opens an in-place Preferred Mods review dialog', 'skpPreferredShortcut.addEventListener("click",()=>window.__skOpenPreferredModsForInstance(a.instanceId).catch'],
    ['instance dialog is modal and remains bound to its current instance', 'role="dialog" aria-modal="true" aria-labelledby="skp-instance-preferred-title"'],
    ['instance dialog reviews enabled preferred mods only', 'filter(item=>item.enabled)'],
    ['instance dialog resolves each instance game version and loader', 'gameVersions:[instance.minecraftVersion],loaders:Mu(instance)'],
    ['compatible missing mods start marked for installation', 'record.selected=record.available&&!record.installed'],
    ["available entries toggle between will and will not be installed", "record.selected?'Will be installed':'Won’t be installed'"],
    ["installed and unavailable entries are described and not selectable", "record.installed?'Already installed':record.available?("],
    ['instance dialog explains available and unavailable behavior', 'Unavailable mods cannot be selected. Already installed mods are skipped.'],
    ['instance dialog has Cancel and Apply controls', 'data-skp-cancel class="rounded-lg border px-4 py-2">Cancel</button><button type="button" data-skp-apply'],
    ['instance dialog includes GitHub and email feedback links', 'data-skp-instance-feedback href="mailto:Kernow-AFK@protonmail.com"'],
    ['instance dialog applies selected mods through the launcher installer', 'const chosen=records.filter(record=>record.available&&record.selected&&!record.installed&&record.project)'],
    ['Preferred Mods page describes SK Protect privacy purpose', 'SK Protect helps restrict personal data leakage from SKlauncher.'],
    ['injected Preferred Mods CSS styles are attached to the page', 'style.dataset.skpPreferredStyles=\"true\"'],
    ['brand artwork container has explicit dimensions', '[data-skp-brand-art]{height:112px'],
    ['mod-list artwork fades horizontally to a more transparent right side', 'linear-gradient(90deg,rgba(2,6,23,.8) 0%,rgba(2,6,23,.64) 26%,rgba(2,6,23,.42) 100%)'],
    ['top SK Protect panel uses its own blue treatment', 'background:linear-gradient(135deg,#102642 0%,#12375b 58%,#102b4b 100%)'],
    ['automatic install setting has a separate blue panel', 'background:linear-gradient(100deg,rgba(30,64,110,.72),rgba(15,44,78,.78))'],
    ['three SK suite cards use individual branded gradients', '[data-skp-brand-tile]:nth-child(2){background:linear-gradient(125deg,rgba(35,51,112,.97),rgba(79,70,180,.72))'],
    ['Preferred Mods title has the restored shield mark', '<svg data-skp-page-shield viewBox="0 0 24 26"'],
    ['SK suite tiles include separate pictogram marks and diagonal accents', '[data-skp-brand-tile]:after{content:'],
    ['future-instance checkbox has explicit larger dimensions', '[data-skp-preferred-page] [data-skp-auto]{width:22px;height:22px'],
    ['amber Remove control sits on a red tinted background', 'background:rgba(127,29,29,.68);color:#fde68a'],
    ['mod rows have explicit blue styling hooks', '[data-skp-preferred-page] [data-skp-mod-row]{display:flex'],
    ['Preferred Mods page links to GitHub README and the project website', 'https://github.com/Kernow-AFK/SK-Protect#readme'],
    ['preferred-mod installation uses the launcher installation API', 'window.api.installation.start({downloadUrl:file.url,filename:file.filename||project.name+\".jar\"'],
    ['apply results remain readable in the page instead of a small system alert', 'data-skp-status hidden role=\"status\" aria-live=\"polite\" class=\"whitespace-pre-wrap rounded-lg border border-amber-500/50 bg-amber-950 p-4 text-base leading-relaxed text-amber-100\"'],
    ['apply errors are rendered as readable multiline status text', 'status.textContent=failures.length?[\'Some mods were not applied:\',...failures].join(\'\\n\')'],
    ['leaving Preferred Mods removes its mounted section', 'function eN(e,a){if(typeof e===\"string\"&&e!==\"preferredMods\")document.querySelectorAll(\"[data-skp-preferred-page]\").forEach(node=>node.remove());'],
    ['instance and other app-shell routes clear the Preferred Mods section', 'if(a.currentPage!==\"preferredMods\")document.querySelectorAll(\"[data-skp-preferred-page]\").forEach(node=>node.remove());if(a.currentPage!==\"discoverContent\")'],
    ['leaving the mod-selection route clears add mode', 'if(a.currentPage!==\"discoverContent\")window.__skPreferredAddMode=!1;'],
    ['Preferred Mods has a dedicated sidebar route', '{id:"preferredMods",label:"Preferred Mods"'],
    ['Preferred Mods route renders once in both app shells', 'a.currentPage==="preferredMods"?I(N=>{SKPPage4057(N,{})},7)'],
    ['Content Hub add mode stores selected mod identity only', 'window.api.preferredMods.add({source:a.project.source,projectId:a.project.id,type:"mod"'],
    ['instance selector enumerates current launcher instances', 'et.instances.map(instance=>'],
    ['apply resolves current compatible release', 'JE(result.value,\"mod\",instance)'],
    ['release lookup is constrained to the instance version and mod loader', 'gameVersions:[instance.minecraftVersion],loaders:Mu(instance)'],
    ['installed mods are skipped by provider and project identity', '(manifest?.content??[]).some(entry=>String(entry.projectId)===String(item.projectId)&&(!entry.source||entry.source===item.source))'],
    ['mod install uses the launcher download installation API', 'window.api.installation.start({downloadUrl:file.url,filename:file.filename||project.name+\".jar\"'],
    ['automatic Preferred Mods install wording and help are present', 'Install Preferred Mods on every new instance'],
    ['new instance changes are observed only while the offer is enabled', 'window.api.instances.onStateChange(async payload=>'],
    ['the new instance is preselected for review', 'select.value=window.__skPreferredTargetInstance'],
    ['new instances trigger compatible automatic Preferred Mods installation', 'window.__skApplyPreferredModsToInstance?.(created.id).catch'],
    ['feedback links use the launchers external-link bridge for GitHub and email', 'window.api.system.openExternal(href)'],
    ['feedback anchors bind clicks directly and prevent launcher overlay interception', 'event.stopPropagation();Promise.resolve(window.api.system.openExternal(href))'],
    ['feedback links open GitHub and email', 'https://github.com/kernow-afk'],
    ['Customisation is not given a Preferred Mods banner', !source.includes('data-skp-customization-preferred')],
  ];
  let failed = false;
  for (const [label, needle] of modernChecks) {
    const present = typeof needle === 'string' ? source.includes(needle) : needle;
    console.log(`${present ? 'PASS' : 'FAIL'} ${label}`);
    failed ||= !present;
  }
  if (failed) process.exitCode = 1;
  process.exit();
}

const checks = [
  ['Svelte-owned Preferred Mods page', 'function SKPPage(e,a){er(a,!0)'],
  ['keyboard-focusable Preferred Mods help', 'data-skp-info aria-label="About Preferred Mods" title='],
  ['Preferred Mods route', 'a.currentPage==="preferredMods"'],
  ['sidebar entry', '{id:"preferredMods",label:"Preferred Mods"'],
  ['Dashboard entry point', 'data-skp-dashboard-preferred'],
  ['Library entry point', 'data-skp-library-preferred'],
  ['Customization entry point removed to avoid duplicate cards', 'heading?.textContent?.trim()==="Preferred Mods"&&button?.textContent?.trim()==="Manage Preferred Mods"'],
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
