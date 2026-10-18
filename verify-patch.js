const fs = require('node:fs');

const bundlePath = process.argv[2];
const mode = process.argv[3] || 'combined';
if (!bundlePath) throw new Error('Usage: node verify-patch.js <patched-renderer.js>');
if (!['combined', 'navigation', 'multi-instance'].includes(mode)) throw new Error(`Unknown verification mode: ${mode}`);
const source = fs.readFileSync(bundlePath, 'utf8');
const checks = [
  ['automatic install navigation removed', source.includes(',O.success&&I&&ma("library")') === false && source.includes('&&re&&ma("library")') === false, 'navigation'],
  ['manual Library actions retained', source.includes('ma("library")'), 'navigation'],
  ['Install Selected button present', source.includes('Install Selected'), 'multi-instance'],
  ['row availability indicator is a static sibling', source.includes('role="checkbox" aria-label="Install on instance"'), 'multi-instance'],
  ['batch toolbar is a static modal control', source.includes('Select All Compatible</button><button type="button"'), 'multi-instance'],
  ['visible key explains install, no-install, unavailable and uninstall states', source.includes('aria-label="Selection key"') && source.includes('✓</span> Selected') && source.includes('×</span> Not selected') && source.includes('N/A</span> Not available') && source.includes('🗑</span> Uninstall'), 'multi-instance'],
  ['header tells the user how to toggle installation', source.includes('Pick the red × to toggle installation.'), 'multi-instance'],
  ['concise selector instructions are visible', source.includes('Select a red × to install.') && source.includes('Select an installed green ✓ to mark it for removal.'), 'multi-instance'],
  ['batch handler is registered during component setup', source.includes('batchButton.addEventListener("click",async()=>'), 'multi-instance'],
  ['select-all chooses compatible uninstalled instances only', source.includes('filter(row=>row.compat.compatible&&!row.alreadyInstalled)'), 'multi-instance'],
  ['indicator selection updates batch state', source.includes('indicator.addEventListener("click",event=>{event.stopPropagation()'), 'multi-instance'],
  ['large indicator is positioned inside the padded instance row', source.includes('<li class="relative"><button type="button">') && source.includes('absolute right-3 top-1/2 z-10 flex h-14 w-14') && source.includes('X.style.paddingRight="5rem"'), 'multi-instance'],
  ['manual and select-all changes share toolbar-state synchronization', source.includes('const syncBatchControls=()=>') && source.includes('Aa.toggleSelected(ue().id)') && source.includes('syncBatchControls()'), 'multi-instance'],
  ['indicator renders full yellow/green/red faces with explicit unavailable state and no white state', source.includes('remove?"#ca8a04":active?"#16a34a":available?"#dc2626":"#991b1b"') && source.includes('remove?"🗑":active?"✓":available?"×":"N/A"') && source.includes('`Not available for ${ue().name}:'), 'multi-instance'],
  ['installed individual mods can toggle a reversible uninstall state', source.includes('uninstalling=new va') && source.includes('toggleUninstall(e)') && source.includes('canRemove=installed&&t(s).type==="mod"'), 'multi-instance'],
  ['uninstall state visibly masks and explains the whole instance row', source.includes('Mod will be uninstalled from this instance.') && source.includes('X.style.backgroundColor=remove?"rgba(202,138,4,.18)"') && source.includes('X.style.paddingBottom=remove?"3rem"'), 'multi-instance'],
  ['uninstall reuses the manifest-aware SKlauncher removal API', source.includes('window.api.content.mods.remove(instanceId,project.id,project.source)') && source.includes('only individual mods can be uninstalled here'), 'multi-instance'],
  ['uninstall requires confirmation and groups failures', source.includes('window.confirm(`Uninstall') && source.includes("Couldn't uninstall from some selected instances:"), 'multi-instance'],
  ['each instance uses compatibility matching', source.includes('versions.some(version=>HT(version,project.type,instance))'), 'multi-instance'],
  ['per-instance installation API retained', source.includes('window.api.installation.start({downloadUrl:file.url'), 'multi-instance'],
  ['completion notifications retained', source.includes('notifyCompletionExternal(instanceId)'), 'multi-instance'],
  ['successful installs keep analytics', source.includes('as("content_install",{source:project.source'), 'multi-instance'],
  ['partial failures are summarized', source.includes("Couldn't install on some selected instances:"), 'multi-instance'],
  ['invalid updater restart timestamps cannot create a NaN toast', source.includes('syncRestartToast(e,a){if(e==null||!Number.isFinite(e)){'), 'multi-instance'],
];

const selected = checks.filter(([, , feature]) => mode === 'combined' || feature === mode);
for (const [description, passed] of selected) console.log(`${passed ? 'PASS' : 'FAIL'} ${description}`);
if (selected.some(([, passed]) => passed === false)) process.exitCode = 1;
