const fs = require('node:fs');

const [rendererPath] = process.argv.slice(2);
if (!rendererPath) throw new Error('Usage: node preferred-mods-ui-patch.js <renderer-bundle.js>');

function replaceOnce(source, before, after, label) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one anchor, found ${count}`);
  return source.replace(before, after);
}

function replaceCount(source, before, after, expected, label) {
  const count = source.split(before).length - 1;
  if (count !== expected) throw new Error(`${label}: expected ${expected} anchors, found ${count}`);
  return source.split(before).join(after);
}

let source = fs.readFileSync(rendererPath, 'utf8');

const preferredModsPage = String.raw`var SKPPageTemplate=g('<div class="space-y-6" data-sk-protect-preferred-mods><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div class="mb-1 flex items-center gap-2"><h1 class="text-2xl font-bold">Preferred Mods</h1><button type="button" class="flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold" data-skp-info aria-label="About Preferred Mods" title="Add your favourite mods to this list once, then use Install Preferred Mods after creating an instance. SKlauncher chooses a compatible release for that instance’s Minecraft version and mod loader. You review every mod before installation.">i</button></div><p class="text-md opacity-75">Choose your standard mods once, then apply compatible releases to any instance.</p></div><div class="flex flex-wrap gap-2"><button type="button" class="rounded-lg border px-4 py-2 text-sm font-medium" data-skp-add>Add Mods</button><button type="button" class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50" data-skp-apply>Apply to Instances</button></div></div><div class="rounded-xl border p-4"><label class="flex cursor-pointer items-start gap-3"><input type="checkbox" class="mt-1 h-4 w-4" data-skp-auto><span><span class="block font-semibold">Offer Preferred Mods for new instances</span><span class="block text-sm opacity-70">This affects future instances only. Existing instances are never changed silently.</span></span></label></div><div class="rounded-xl border p-4"><div class="mb-3 flex items-center justify-between gap-3"><div><h2 class="text-lg font-semibold">Your Preferred Mods</h2><p class="text-sm opacity-70" data-skp-summary></p></div><span class="rounded-full border px-3 py-1 text-xs" data-skp-state>Loading…</span></div><div class="space-y-2" data-skp-list></div><div class="rounded-lg border border-dashed p-6 text-center text-sm opacity-70" data-skp-empty hidden>No preferred mods yet. Choose Add Mods, then select individual mods in Content Hub.</div></div><p class="text-sm opacity-70" data-skp-message aria-live="polite"></p></div>');function SKPPage(e,a){er(a,!0);const r=l(()=>oe.themeClasses);var s=SKPPageTemplate(),v=s.querySelector("[data-skp-list]"),f=s.querySelector("[data-skp-empty]"),h=s.querySelector("[data-skp-summary]"),y=s.querySelector("[data-skp-state]"),z=s.querySelector("[data-skp-message]"),w=s.querySelector("[data-skp-auto]"),x=s.querySelector("[data-skp-add]"),D=s.querySelector("[data-skp-apply]");let S=!0,M=null;const j=J=>{z.textContent=J||""},L=J=>{const A=document.createElement("div");A.className="flex items-center gap-3 rounded-lg border p-3";const V=document.createElement("div");V.className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border";if(J.iconUrl){const I=document.createElement("img");I.src=J.iconUrl,I.alt="",I.className="h-full w-full object-cover",V.append(I)}else V.textContent="MOD";const E=document.createElement("div");E.className="min-w-0 flex-1";const Y=document.createElement("div");Y.className="truncate font-semibold",Y.textContent=J.name||J.projectId;const Z=document.createElement("div");Z.className="truncate text-xs opacity-65",Z.textContent=(J.source==="modrinth"?"Modrinth":"CurseForge")+" · "+J.projectId;E.append(Y,Z);const T=document.createElement("button");T.type="button",T.className="rounded-lg border px-3 py-2 text-sm font-medium",T.textContent=J.enabled?"Enabled":"Disabled",T.setAttribute("aria-pressed",String(J.enabled)),T.addEventListener("click",async()=>{T.disabled=!0;try{M=await window.api.preferredMods.setEnabled(J.source,J.projectId,!J.enabled),U(),j((!J.enabled?"Enabled ":"Disabled ")+(J.name||J.projectId))}catch(P){j("Could not update this preferred mod: "+(P?.message||P))}finally{T.disabled=!1}});const P=document.createElement("button");return P.type="button",P.className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400",P.textContent="Remove",P.setAttribute("aria-label","Remove "+(J.name||J.projectId)+" from Preferred Mods"),P.addEventListener("click",async()=>{if(!window.confirm("Remove "+(J.name||J.projectId)+" from Preferred Mods?"))return;P.disabled=!0;try{M=await window.api.preferredMods.remove(J.source,J.projectId),U(),j("Removed "+(J.name||J.projectId))}catch(O){j("Could not remove this preferred mod: "+(O?.message||O))}finally{P.disabled=!1}}),A.append(V,E,T,P),A},U=()=>{const J=M?.items??[];v.replaceChildren(...J.map(L)),f.hidden=J.length>0,h.textContent=J.length===1?"1 saved mod":J.length+" saved mods",y.textContent=S?"Loading…":"Saved locally",w.checked=M?.autoApplyToNewInstances===!0,D.disabled=J.filter(A=>A.enabled).length===0},C=()=>{const J=[...s.children];J.forEach(E=>E.hidden=!0);const A=document.createElement("div");A.className="space-y-4";const V=document.createElement("div");V.className="flex flex-wrap items-center justify-between gap-3";const I=document.createElement("div");I.innerHTML='<h1 class="text-2xl font-bold">Install Preferred Mods</h1><p class="text-sm opacity-70">Choose an instance, review compatibility, then install only the green selections.</p>';const E=document.createElement("button");E.type="button",E.className="rounded-lg border px-4 py-2 text-sm font-medium",E.textContent="Back to Preferred List",E.addEventListener("click",()=>{A.remove(),J.forEach(se=>se.hidden=!1)}),V.append(I,E);const Y=document.createElement("select");Y.className="w-full rounded-lg border bg-transparent px-3 py-2";for(const se of Zr.instances){const te=document.createElement("option");te.value=se.id,te.textContent=se.name+" · "+se.minecraftVersion+" · "+se.gameType,Y.append(te)}const Z=document.createElement("div");Z.className="space-y-2";const T=document.createElement("p");T.className="text-sm opacity-70",T.setAttribute("aria-live","polite");const P=document.createElement("button");P.type="button",P.className="rounded-lg bg-accent px-4 py-2 font-medium text-white disabled:opacity-50",P.textContent="Install Selected Mods",P.disabled=!0;let O=[];const W=()=>{P.disabled=!O.some(se=>se.selected&&se.compatible)};async function B(){const se=Zr.getById(Y.value);if(!se)return;Z.replaceChildren(),T.textContent="Checking compatible releases for "+se.name+"…",P.disabled=!0,O=[];for(const te of (M?.items??[]).filter(ue=>ue.enabled)){let ue=null,ae=[],N=!1,ne="No compatible release for "+se.minecraftVersion+" / "+se.gameType;try{const X=await Sr.getProject(te.projectId,te.source);if(X.kind!=="ok")ne=X.kind==="error"?X.message:"Project was not found";else{ue={...X.value,id:te.projectId,source:te.source,type:"mod",name:X.value.name||te.name,iconUrl:X.value.iconUrl||te.iconUrl};let K=await Sr.getVersions(te.projectId,te.source,{gameVersions:[se.minecraftVersion],loaders:Mu(se)});K.kind==="ok"&&(ae=K.value,N=ae.some(re=>HT(re,"mod",se)))}}catch(X){ne=X?.message||String(X)}const X={item:te,project:ue,versions:ae,compatible:N,selected:N,reason:ne};O.push(X);const K=document.createElement("button");K.type="button",K.className="flex w-full items-center gap-3 rounded-lg border p-3 text-left";const re=document.createElement("span");re.className="min-w-0 flex-1";const H=document.createElement("strong");H.className="block truncate",H.textContent=ue?.name||te.name;const _e=document.createElement("small");_e.className="block truncate opacity-70",_e.textContent=N?(QT(ae,"mod",se)?.name||"Compatible release found"):ne;re.append(H,_e);const pe=document.createElement("span");pe.className="flex h-12 min-w-24 items-center justify-center rounded-lg px-3 text-center text-sm font-bold text-white",pe.style.background=N?"#16a34a":"#991b1b";const Q=()=>{pe.textContent=!X.compatible?"Not available":X.selected?"✓ Install":"× Skip",pe.style.background=!X.compatible?"#991b1b":X.selected?"#16a34a":"#dc2626",K.setAttribute("aria-pressed",String(X.selected))};Q(),K.disabled=!N,K.addEventListener("click",()=>{X.selected=!X.selected,Q(),W()}),K.append(re,pe),Z.append(K)}T.textContent=O.filter(te=>te.compatible).length+" of "+O.length+" preferred mods are compatible with "+se.name+".",W()}Y.addEventListener("change",B),P.addEventListener("click",async()=>{const se=Zr.getById(Y.value),te=O.filter(ue=>ue.selected&&ue.compatible&&ue.project);if(!se||te.length===0)return;P.disabled=!0,P.textContent="Installing…";let ue=0;for(const ae of te)try{await installSelectedContent(ae.project,ae.versions,[se.id],it),ue++}catch{}P.textContent="Install Selected Mods",T.textContent="Finished: "+ue+" of "+te.length+" selected mods were handed to the installer.",W()}),A.append(V,Y,Z,T,P),s.append(A),Y.value=Zr.instances[0]?.id||"",Y.value?B():T.textContent="Create an instance before applying Preferred Mods."};async function q(){S=!0,U();try{M=await window.api.preferredMods.get(),j("")}catch(J){M={items:[],autoApplyToNewInstances:!1},j("Could not load Preferred Mods: "+(J?.message||J))}finally{S=!1,U()}}x.addEventListener("click",()=>{window.__skPreferredAddMode=!0,ca.setContentType("mod"),ma("discoverContent"),window.alert("Preferred Mods mode is on. Select an individual mod in Content Hub to add it. Use Preferred Mods in the sidebar to return.")}),D.addEventListener("click",C),w.addEventListener("change",async()=>{w.disabled=!0;try{M=await window.api.preferredMods.setAutoApply(w.checked),U(),j(w.checked?"New-instance offer enabled.":"New-instance offer disabled.")}catch(J){j("Could not save the new-instance preference: "+(J?.message||J)),U()}finally{w.disabled=!1}}),mt(()=>{window.__skPreferredAddMode=!1,q()}),m(()=>{c(s,1,"space-y-6 "+(t(r).textPrimary??""));for(const J of s.querySelectorAll(":scope > div.rounded-xl"))c(J,1,"rounded-xl border p-4 "+(t(r).cardBg??"")+" "+(t(r).borderColor??""))}),_(e,s),Xe()}`;

const preferredModsAutoApply = String.raw`window.__skApplyPreferredModsToInstance=async function(instanceId){const state=await window.api.preferredMods.get();if(!state?.autoApplyToNewInstances)return;const instance=Zr.getById(instanceId);if(!instance)return;for(const item of (state.items??[]).filter(entry=>entry.enabled)){try{const projectResult=await Sr.getProject(item.projectId,item.source);if(projectResult.kind!=="ok")continue;const project={...projectResult.value,id:item.projectId,source:item.source,type:"mod",name:projectResult.value.name||item.name,iconUrl:projectResult.value.iconUrl||item.iconUrl};const versionsResult=await Sr.getVersions(item.projectId,item.source,{gameVersions:[instance.minecraftVersion],loaders:Mu(instance)});if(versionsResult.kind!=="ok"||!versionsResult.value.some(version=>HT(version,"mod",instance)))continue;await installSelectedContent(project,versionsResult.value,[instance.id],it)}catch(error){console.warn("[Preferred Mods] automatic install skipped",item.projectId,error)}}};`;
const preferredModsPageFinal = preferredModsPage
  .replace(
    'Y.value=Zr.instances[0]?.id||"",Y.value?B()',
    'Y.value=window.__skPreferredTargetInstance||Zr.instances[0]?.id||"",window.__skPreferredTargetInstance=null,Y.value?B()',
  )
  .replace(
    'mt(()=>{window.__skPreferredAddMode=!1,q()})',
    'mt(()=>{window.__skPreferredAddMode=!1,q().then(()=>{window.__skPreferredTargetInstance&&(C(),window.__skPreferredTargetInstance=null)})})',
  );

source = replaceOnce(
  source,
  'var AHr=class{',
  `${preferredModsAutoApply}${preferredModsPageFinal}var AHr=class{`,
  'Preferred Mods page component'
);

source = replaceOnce(
  source,
  'if(ye){if(t(S)){const{id:ie,name:le}=ye;if(it.getInstanceDownload(ie)?.status==="completed")Qr.launchGame(ie,le);else{const de=it.onCompletion(ge=>{ge===ie&&(de(),Qr.launchGame(ie,le))})}}a.onCreate?.(),X()}',
  'if(ye){window.__skApplyPreferredModsToInstance?.(ye.id).catch(error=>console.warn("[Preferred Mods] automatic installation failed",error));if(t(S)){const{id:ie,name:le}=ye;if(it.getInstanceDownload(ie)?.status==="completed")Qr.launchGame(ie,le);else{const de=it.onCompletion(ge=>{ge===ie&&(de(),Qr.launchGame(ie,le))})}}a.onCreate?.(),X()}',
  'new-instance Preferred Mods hook'
);

source = replaceOnce(
  source,
  '$Dr=g(\'<div class="flex items-center justify-between"><div class="text-left"><h1> </h1> <p> </p></div> <!></div>\')',
  '$Dr=g(\'<div class="flex items-center justify-between"><div class="text-left"><h1> </h1> <p> </p></div><div class="flex items-center gap-2"><!><button type="button" class="rounded-lg border px-4 py-2 text-left" data-skp-dashboard-preferred><span class="block text-sm font-medium">Preferred Mods</span><span class="block text-xs font-normal opacity-70">Choose your standard mods</span></button></div></div>\')',
  'Dashboard Preferred Mods entry template'
);
source = replaceOnce(
  source,
  'function T(){ma("library")}var P=$Dr(),',
  'function T(){ma("library")}var P=$Dr();P.querySelector("[data-skp-dashboard-preferred]").addEventListener("click",()=>ma("preferredMods"));var ',
  'Dashboard Preferred Mods entry handler'
);

source = replaceOnce(
  source,
  '<div class="flex items-center gap-2"><div class="relative"><!> <!></div> <!></div></div> <!> <div class="flex items-center justify-between">',
  '<div class="flex items-center gap-2"><div class="relative"><!> <!></div> <!><button type="button" class="rounded-lg border px-3 py-2 text-sm font-medium" data-skp-library-preferred>Manage Preferred Mods</button></div></div> <!> <div class="flex items-center justify-between">',
  'Library Preferred Mods entry template'
);
source = replaceOnce(
  source,
  'var E=xBr();Er("click",Yt,x);',
  'var E=xBr();E.querySelector("[data-skp-library-preferred]").addEventListener("click",()=>ma("preferredMods"));Er("click",Yt,x);',
  'Library Preferred Mods entry handler'
);

source = replaceOnce(
  source,
  'var ye=XRr();Er("focus",Yt,()=>{at.revalidate(t(h),t(f),t(E))});',
  'var ye=XRr();const skpCustomization=document.createElement("section");skpCustomization.className="mt-6 rounded-xl border p-5";skpCustomization.innerHTML=\'<div class="flex items-center justify-between gap-4"><div><h2 class="text-lg font-semibold">Preferred Mods</h2><p class="text-sm opacity-70">Choose standard mods to review and install on any compatible instance.</p></div><button type="button" class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white">Manage Preferred Mods</button></div>\';skpCustomization.querySelector("button").addEventListener("click",()=>ma("preferredMods"));ye.append(skpCustomization);Er("focus",Yt,()=>{at.revalidate(t(h),t(f),t(E))});',
  'Customization Preferred Mods entry'
);

source = replaceOnce(
  source,
  'oHr=g(\'<div class="space-y-6"><button type="button"><!> <span> </span></button> <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1> </h1> <p> </p></div> <div class="flex items-center gap-3"><!></div></div> <!></div>\')',
  'oHr=g(\'<div class="space-y-6"><button type="button"><!> <span> </span></button> <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1> </h1> <p> </p></div> <div class="flex items-center gap-3"><!><button type="button" class="rounded-lg border px-3 py-2 text-sm font-medium" data-skp-instance-preferred>Install Preferred Mods</button></div></div> <!></div>\')',
  'Instance Content Browser Preferred Mods entry template'
);
source = replaceOnce(
  source,
  'var T=oHr(),P=i(T),',
  'var T=oHr();T.querySelector("[data-skp-instance-preferred]").addEventListener("click",()=>{window.__skPreferredTargetInstance=pt.instanceId,ma("preferredMods")});var P=i(T),',
  'Instance Content Browser Preferred Mods entry handler'
);

source = replaceCount(
  source,
  'a.currentPage==="customization"?I(C,4):a.currentPage==="detail"?',
  'a.currentPage==="customization"?I(C,4):a.currentPage==="preferredMods"?I(N=>{SKPPage(N,{})},7):a.currentPage==="detail"?',
  2,
  'Preferred Mods route'
);

source = replaceOnce(
  source,
  '{id:"customization",label:"nav_customization",icon:PT},{id:"library"',
  '{id:"customization",label:"nav_customization",icon:PT},{id:"preferredMods",label:"Preferred Mods",icon:PT},{id:"library"',
  'Preferred Mods navigation item'
);

source = replaceOnce(
  source,
  'function U(Y){Qa(Y.type,Y.id,Y.source==="local"?void 0:Y.source)}',
  'async function U(Y){if(window.__skPreferredAddMode){if(Y.type!=="mod"){window.alert("Preferred Mods currently supports individual mods only.");return}try{await window.api.preferredMods.add({source:Y.source,projectId:Y.id,type:"mod",name:Y.name||Y.title||Y.id,iconUrl:Y.iconUrl||Y.icon_url||""}),window.alert((Y.name||Y.title||Y.id)+" was added to Preferred Mods.")}catch(Z){window.alert("Could not add this mod: "+(Z?.message||Z))}return}Qa(Y.type,Y.id,Y.source==="local"?void 0:Y.source)}',
  'Content Hub preferred-list mode'
);

fs.writeFileSync(rendererPath, source);
console.log('Applied Preferred Mods master-list UI');
