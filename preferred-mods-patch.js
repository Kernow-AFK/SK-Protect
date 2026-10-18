const fs = require('node:fs');

const [mainPath, preloadPath] = process.argv.slice(2);
if (!mainPath || !preloadPath) {
  throw new Error('Usage: node preferred-mods-patch.js <main.js> <preload.js>');
}

function replaceOnce(source, before, after, label) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one anchor, found ${count}`);
  return source.replace(before, after);
}

let main = fs.readFileSync(mainPath, 'utf8');
const registration = String.raw`function registerPreferredMods(){const file=l.join(h.app.getPath("userData"),"preferred-mods.json"),empty=()=>({schemaVersion:1,autoApplyToNewInstances:!1,items:[]}),cleanText=(value,max=240)=>typeof value==="string"?value.trim().slice(0,max):"",normaliseItem=(value,index)=>{if(!value||typeof value!=="object")return null;const source=cleanText(value.source,32),projectId=cleanText(value.projectId||value.id,160);if(!["modrinth","curseforge"].includes(source)||!projectId)return null;return{source,projectId,type:"mod",name:cleanText(value.name,160)||projectId,iconUrl:cleanText(value.iconUrl,1024),enabled:value.enabled!==!1,order:Number.isSafeInteger(value.order)?value.order:index}},normalise=value=>{const items=Array.isArray(value?.items)?value.items.slice(0,500).map(normaliseItem).filter(Boolean):[],seen=new Set;return{schemaVersion:1,autoApplyToNewInstances:value?.autoApplyToNewInstances===!0,items:items.filter(item=>{const key=item.source+":"+item.projectId;if(seen.has(key))return!1;return seen.add(key),!0}).sort((a,b)=>a.order-b.order).map((item,order)=>({...item,order}))}},read=()=>{try{return normalise(JSON.parse(p.readFileSync(file,"utf8")))}catch(error){return error?.code!=="ENOENT"&&console.warn("[Preferred Mods] Could not read store; using an empty list",error),empty()}},write=value=>{const next=normalise(value),directory=l.dirname(file),temp=file+".tmp";return p.mkdirSync(directory,{recursive:!0}),p.writeFileSync(temp,JSON.stringify(next,null,2)+"\n",{mode:384}),p.renameSync(temp,file),p.chmodSync(file,384),next},mutate=callback=>write(callback(read()));h.ipcMain.handle("preferred-mods:get",()=>read()),h.ipcMain.handle("preferred-mods:add",(event,value)=>mutate(state=>{const item=normaliseItem(value,state.items.length);if(!item)throw new Error("Invalid preferred mod");const index=state.items.findIndex(existing=>existing.source===item.source&&existing.projectId===item.projectId);return index>=0?state.items[index]={...state.items[index],...item,order:state.items[index].order}:state.items.push(item),state})),h.ipcMain.handle("preferred-mods:remove",(event,source,projectId)=>mutate(state=>(state.items=state.items.filter(item=>item.source!==source||item.projectId!==projectId),state))),h.ipcMain.handle("preferred-mods:set-enabled",(event,source,projectId,enabled)=>mutate(state=>{const item=state.items.find(candidate=>candidate.source===source&&candidate.projectId===projectId);return item&&(item.enabled=enabled===!0),state})),h.ipcMain.handle("preferred-mods:reorder",(event,keys)=>mutate(state=>{if(!Array.isArray(keys))return state;const positions=new Map(keys.slice(0,500).map((key,index)=>[String(key),index])),tail=positions.size;return state.items.forEach(item=>{const position=positions.get(item.source+":"+item.projectId);item.order=position??tail+item.order}),state})),h.ipcMain.handle("preferred-mods:set-auto-apply",(event,enabled)=>mutate(state=>(state.autoApplyToNewInstances=enabled===!0,state)))};`;

main = replaceOnce(
  main,
  'var Fm=[it,ro];async function lO()',
  `${registration}var Fm=[it,ro];async function lO()`,
  'preferred-mods main registration'
);
main = replaceOnce(
  main,
  'LC(),KE(),uO(),Hb()',
  'LC(),KE(),registerPreferredMods(),uO(),Hb()',
  'preferred-mods startup call'
);

let preload = fs.readFileSync(preloadPath, 'utf8');
const analyticsAnchor = preload.includes('analytics:{track:()=>Promise.resolve()},theme:')
  ? 'analytics:{track:()=>Promise.resolve()},theme:'
  : 'analytics:{track:(e,r)=>n.ipcRenderer.invoke("analytics:track",e,r)},theme:';
const analyticsWithPreferredMods = analyticsAnchor.replace(
  ',theme:',
  ',preferredMods:{get:()=>n.ipcRenderer.invoke("preferred-mods:get"),add:e=>n.ipcRenderer.invoke("preferred-mods:add",e),remove:(e,r)=>n.ipcRenderer.invoke("preferred-mods:remove",e,r),setEnabled:(e,r,t)=>n.ipcRenderer.invoke("preferred-mods:set-enabled",e,r,t),reorder:e=>n.ipcRenderer.invoke("preferred-mods:reorder",e),setAutoApply:e=>n.ipcRenderer.invoke("preferred-mods:set-auto-apply",e)},theme:',
);
preload = replaceOnce(
  preload,
  analyticsAnchor,
  analyticsWithPreferredMods,
  'preferred-mods preload API'
);

fs.writeFileSync(mainPath, main);
fs.writeFileSync(preloadPath, preload);
console.log('Applied Preferred Mods data API');
