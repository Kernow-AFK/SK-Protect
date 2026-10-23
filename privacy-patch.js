const fs = require('node:fs');

const [mainPath, preloadPath] = process.argv.slice(2);
if (!mainPath || !preloadPath) {
  throw new Error('Usage: node privacy-patch.js <path/to/main/index.js> <path/to/preload/index.js>');
}

const disabledState = '{currentVersion:"disabled",latestVersion:"disabled",minimumSupportedVersion:null,lockState:{locked:!1,reason:"none"},disabled:!0,channel:"stable",isManualCheck:!1,checking:!1,lastCheckedAt:null,downloadProgress:0,phase:"idle",canInstall:!1,available:!1,percent:0,hasError:!1,readOnlyInstall:!1,latestNotes:"",latestReleasedAt:null,autoRestartAt:null,initialCheckCompleted:!0}';

let mainSource = fs.readFileSync(mainPath, 'utf8');
mainSource = mainSource
  .replaceAll('var O=Ly();O.disableDiscordRpc=!0,O.secureDns=!1,O.disableAnalytics=!0,O.analyticsConsentChosen=!0,delete O.clientId,Ct(O),Qs(O.curseforgeApiKey);', 'var O=Ly();O.disableDiscordRpc=!0,O.disableAnalytics=!0,O.analyticsConsentChosen=!0,delete O.clientId,Ct(O),Qs(O.curseforgeApiKey);')
  .replaceAll('Object.assign(O,a),O.disableDiscordRpc=!0,O.secureDns=!1,O.disableAnalytics=!0,O.analyticsConsentChosen=!0,delete O.clientId,n!==void 0', 'Object.assign(O,a),O.disableDiscordRpc=!0,O.disableAnalytics=!0,O.analyticsConsentChosen=!0,delete O.clientId,n!==void 0');
const legacyFetchGuard = 'function so(e,t){if(!h.app.isReady())throw new Error("netFetch called before app is ready");const n=new URL(e).hostname.toLowerCase();if(n==="skmedix.pl"||n.endsWith(".skmedix.pl")||n==="xyrios.com"||n.endsWith(".xyrios.com")||n==="google-analytics.com"||n.endsWith(".google-analytics.com")||n==="mclo.gs"||n.endsWith(".mclo.gs"))throw new Error(`Privacy mode blocked background request to ${n}`);return h.net.fetch(e,t)}';
const strictFetchGuard = 'function privacyAllowsRequest(e,t){try{const n=new URL(e);return t==="GET"&&n.protocol==="https:"&&(n.hostname==="cdn.xyrios.com"&&(n.pathname==="/api/servers.json"||/^\\/api\\/servers\\/[1-9]\\d*\\.png$/i.test(n.pathname)||/^\\/banners\\/[A-Za-z0-9._-]+\\.(?:png|gif|webp|jpe?g)$/i.test(n.pathname))||n.hostname==="xyrios.com"&&/^\\/api\\/servers\\/[1-9]\\d*$/.test(n.pathname)||n.hostname==="beta.skmedix.pl"&&n.pathname==="/news.json")}catch{return!1}}function so(e,t){if(!h.app.isReady())throw new Error("netFetch called before app is ready");const n=new URL(e);if((n.hostname==="skmedix.pl"||n.hostname.endsWith(".skmedix.pl")||n.hostname==="xyrios.com"||n.hostname.endsWith(".xyrios.com")||n.hostname==="google-analytics.com"||n.hostname.endsWith(".google-analytics.com")||n.hostname==="mclo.gs"||n.hostname.endsWith(".mclo.gs"))&&!privacyAllowsRequest(e,t?.method?.toUpperCase()||"GET"))throw new Error(`Privacy mode blocked background request to ${n.hostname}`);return h.net.fetch(e,t)}';
if (mainSource.includes(legacyFetchGuard)) {
  mainSource = mainSource.replace(legacyFetchGuard, strictFetchGuard);
}
const legacyDisabledState = disabledState.replace(
  'minimumSupportedVersion:null,lockState:{locked:!1,reason:"none"},',
  '',
);
mainSource = mainSource.replaceAll(legacyDisabledState, disabledState);
const mainReplacements = [
  ['constructor(){this.disabled=tt.is.dev,this.readOnlyInstall=', 'constructor(){this.disabled=!0,this.readOnlyInstall='],
  ['var O=Ly();Qs(O.curseforgeApiKey);', 'var O=Ly();O.disableDiscordRpc=!0,O.disableAnalytics=!0,O.analyticsConsentChosen=!0,delete O.clientId,Ct(O),Qs(O.curseforgeApiKey);'],
  ['Object.assign(O,a),n!==void 0', 'Object.assign(O,a),O.disableDiscordRpc=!0,O.disableAnalytics=!0,O.analyticsConsentChosen=!0,delete O.clientId,n!==void 0'],
  ['function so(e,t){if(!h.app.isReady())throw new Error("netFetch called before app is ready");return h.net.fetch(e,t)}', strictFetchGuard],
  ['this.configured&&(this.clientId=xy(),this.defaultParams=', 'this.configured&&O.analyticsConsentChosen&&!O.disableAnalytics&&(this.clientId=xy(),this.defaultParams='],
  ['Disabled (dev mode). Version:', 'Disabled by privacy mode. Version:'],
  ['disableDiscordRpc:!1', 'disableDiscordRpc:!0'],
  ['disableAnalytics:!1', 'disableAnalytics:!0'],
  ['analyticsConsentChosen:!1', 'analyticsConsentChosen:!0'],
  ['h.ipcMain.handle("analytics:track",(e,t,n)=>{typeof t=="string"&&is().track(t,Nw(n))})', 'h.ipcMain.handle("analytics:track",()=>{})'],
  ['h.ipcMain.handle("updater:get-state",()=>e.getState()),h.ipcMain.on("updater:get-initial-state-sync",n=>{n.returnValue=e.getInitialStateSync()}),h.ipcMain.handle("updater:check-now",async()=>{const n=Date.now();return n-t<jC?e.getState():(t=n,await e.checkNow())}),h.ipcMain.handle("updater:download-and-install",async()=>{await e.downloadAndInstall()}),h.ipcMain.handle("updater:install-and-restart",async()=>{await e.installAndRestart()}),h.ipcMain.handle("updater:clear-cache-and-retry",async()=>await e.clearCacheAndRetry()),h.ipcMain.handle("updater:retry-install",async()=>await e.retryInstall()),h.ipcMain.handle("updater:cancel-auto-restart",()=>(e.cancelAutoRestart(),e.getState())),h.ipcMain.handle("updater:set-channel",async(n,r)=>{if(!Zo(r))return id.warn("Rejecting invalid channel:",r),e.getState();const a=e.getState().channel;return fm(a,r)?await e.setChannel(r):(id.warn(`Channel switch rejected (${a} -> ${r} not allowed)`),e.getState())}),h.ipcMain.handle("updater:move-to-applications",async()=>await e.moveToApplications()),h.ipcMain.handle("updater:open-manual-download",async()=>{await e.openManualDownload()})', `h.ipcMain.handle("updater:get-state",()=>(${disabledState})),h.ipcMain.on("updater:get-initial-state-sync",n=>{n.returnValue=(${disabledState})}),h.ipcMain.handle("updater:check-now",async()=>(${disabledState})),h.ipcMain.handle("updater:download-and-install",async()=>({success:!1,disabled:!0})),h.ipcMain.handle("updater:install-and-restart",async()=>({success:!1,disabled:!0})),h.ipcMain.handle("updater:clear-cache-and-retry",async()=>({success:!1,disabled:!0})),h.ipcMain.handle("updater:retry-install",async()=>({success:!1,disabled:!0})),h.ipcMain.handle("updater:cancel-auto-restart",()=>(${disabledState})),h.ipcMain.handle("updater:set-channel",async()=>(${disabledState})),h.ipcMain.handle("updater:move-to-applications",async()=>({success:!1,disabled:!0})),h.ipcMain.handle("updater:open-manual-download",async()=>h.shell.openExternal("https://www.minecraft.net/en-us/download"))`],
];

for (const [before, after] of mainReplacements) {
  if (!mainSource.includes(before)) {
    if (mainSource.includes(after)) continue;
    if (
      before.startsWith('h.ipcMain.handle("updater:get-state"') &&
      mainSource.includes('h.ipcMain.handle("updater:get-state",()=>({currentVersion:"disabled"')
    ) continue;
    throw new Error(`Missing expected main-process snippet: ${before.slice(0, 120)}`);
  }
  mainSource = mainSource.replace(before, after);
}
const requestFilterAnchor = 'h.app.whenReady().then(async()=>{if(N.info("App ready, initializing..."),';
const legacyRequestFilter = 'h.session.defaultSession.webRequest.onBeforeRequest({urls:["*://skmedix.pl/*","*://*.skmedix.pl/*","*://xyrios.com/*","*://*.xyrios.com/*","*://google-analytics.com/*","*://*.google-analytics.com/*","*://mclo.gs/*","*://*.mclo.gs/*"]},(request,callback)=>callback({cancel:!0}));';
const strictRequestFilter = 'h.session.defaultSession.webRequest.onBeforeRequest({urls:["*://skmedix.pl/*","*://*.skmedix.pl/*","*://xyrios.com/*","*://*.xyrios.com/*","*://google-analytics.com/*","*://*.google-analytics.com/*","*://mclo.gs/*","*://*.mclo.gs/*"]},(request,callback)=>callback({cancel:!privacyAllowsRequest(request.url,request.method)}));';
mainSource = mainSource.replace(legacyRequestFilter, strictRequestFilter);
const requestFilter = `h.app.whenReady().then(async()=>{${strictRequestFilter}if(N.info("App ready, initializing..."),`;
if (mainSource.includes(requestFilterAnchor)) {
  mainSource = mainSource.replace(requestFilterAnchor, requestFilter);
} else if (!mainSource.includes('h.session.defaultSession.webRequest.onBeforeRequest({urls:["*://skmedix.pl/*"')) {
  throw new Error('Missing expected app-ready network-filter insertion point');
}
fs.writeFileSync(mainPath, mainSource);

let preloadSource = fs.readFileSync(preloadPath, 'utf8');
const preloadReplacements = [
  ['analytics:{track:(e,r)=>n.ipcRenderer.invoke("analytics:track",e,r)}', 'analytics:{track:()=>Promise.resolve()}'],
  ['updater:{getInitialStateSync:()=>n.ipcRenderer.sendSync("updater:get-initial-state-sync"),getState:()=>n.ipcRenderer.invoke("updater:get-state"),checkNow:()=>n.ipcRenderer.invoke("updater:check-now"),downloadAndInstall:()=>n.ipcRenderer.invoke("updater:download-and-install"),installAndRestart:()=>n.ipcRenderer.invoke("updater:install-and-restart"),cancelAutoRestart:()=>n.ipcRenderer.invoke("updater:cancel-auto-restart")', 'updater:{getInitialStateSync:()=>({currentVersion:"disabled",latestVersion:"disabled",disabled:!0,channel:"stable",isManualCheck:!1,checking:!1,lastCheckedAt:null,downloadProgress:0,phase:"idle",canInstall:!1,available:!1,percent:0,hasError:!1,readOnlyInstall:!1,latestNotes:"",latestReleasedAt:null,initialCheckCompleted:!0}),getState:()=>Promise.resolve({currentVersion:"disabled",latestVersion:"disabled",disabled:!0,channel:"stable",isManualCheck:!1,checking:!1,lastCheckedAt:null,downloadProgress:0,phase:"idle",canInstall:!1,available:!1,percent:0,hasError:!1,readOnlyInstall:!1,latestNotes:"",latestReleasedAt:null,initialCheckCompleted:!0}),checkNow:()=>Promise.resolve({currentVersion:"disabled",latestVersion:"disabled",disabled:!0,channel:"stable",isManualCheck:!1,checking:!1,lastCheckedAt:null,downloadProgress:0,phase:"idle",canInstall:!1,available:!1,percent:0,hasError:!1,readOnlyInstall:!1,latestNotes:"",latestReleasedAt:null,initialCheckCompleted:!0}),downloadAndInstall:()=>Promise.resolve({success:!1,disabled:!0}),installAndRestart:()=>Promise.resolve({success:!1,disabled:!0}),cancelAutoRestart:()=>Promise.resolve({currentVersion:"disabled",latestVersion:"disabled",disabled:!0,channel:"stable",isManualCheck:!1,checking:!1,lastCheckedAt:null,downloadProgress:0,phase:"idle",canInstall:!1,available:!1,percent:0,hasError:!1,readOnlyInstall:!1,latestNotes:"",latestReleasedAt:null,initialCheckCompleted:!0})'],
  ['cancelAutoRestart:()=>n.ipcRenderer.invoke("updater:cancel-auto-restart"),openManualDownload:()=>n.ipcRenderer.invoke("updater:open-manual-download")', 'cancelAutoRestart:()=>Promise.resolve({currentVersion:"disabled",latestVersion:"disabled",disabled:!0,channel:"stable",isManualCheck:!1,checking:!1,lastCheckedAt:null,downloadProgress:0,phase:"idle",canInstall:!1,available:!1,percent:0,hasError:!1,readOnlyInstall:!1,latestNotes:"",latestReleasedAt:null,initialCheckCompleted:!0}),openManualDownload:()=>Promise.resolve(null)'],
];

for (const [before, after] of preloadReplacements) {
  if (!preloadSource.includes(before)) {
    if (preloadSource.includes(after)) continue;
    if (
      before.startsWith('updater:{getInitialStateSync:') &&
      preloadSource.includes('updater:{getInitialStateSync:()=>({currentVersion:"disabled"')
    ) continue;
    if (
      before.startsWith('cancelAutoRestart:') &&
      preloadSource.includes('openManualDownload:()=>n.shell.openExternal("https://www.minecraft.net/en-us/download")')
    ) continue;
    if (
      before.startsWith('cancelAutoRestart:') &&
      preloadSource.includes('updater:{getInitialStateSync:()=>({currentVersion:"disabled"')
    ) continue;
    throw new Error(`Missing expected preload snippet: ${before.slice(0, 120)}`);
  }
  preloadSource = preloadSource.replace(before, after);
}
const missingLockState = 'latestVersion:"disabled",disabled:!0,channel:"stable"';
const correctedLockState = 'latestVersion:"disabled",minimumSupportedVersion:null,lockState:{locked:!1,reason:"none"},disabled:!0,channel:"stable"';
if (!preloadSource.includes(missingLockState) && !preloadSource.includes(correctedLockState)) {
  throw new Error('Missing disabled updater status in preload');
}
preloadSource = preloadSource.replaceAll(
  missingLockState,
  'latestVersion:"disabled",minimumSupportedVersion:null,lockState:{locked:!1,reason:"none"},disabled:!0,channel:"stable"',
);
preloadSource = preloadSource.replaceAll(
  'latestReleasedAt:null,initialCheckCompleted:!0}',
  'latestReleasedAt:null,autoRestartAt:null,initialCheckCompleted:!0}',
);
fs.writeFileSync(preloadPath, preloadSource);

console.log('privacy patch applied');
