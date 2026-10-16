import fs from 'node:fs';
import JSZip from 'jszip';
const out='migration-runs/release-repair-20261017/import-fixtures';fs.mkdirSync(out,{recursive:true});
const bytes=fs.readFileSync('docs/90_roadmap-and-history/runtime-v32-release-repair-20261017/r11-r7.initial.cairn-config-v3.zip');
fs.writeFileSync(out+'/cancel-repair.zip',bytes);
const zip=await JSZip.loadAsync(bytes),manifest=JSON.parse(await zip.file('manifest.json')!.async('string'));
zip.file('manifest.json',JSON.stringify({...manifest,schemaVersion:'unknown'}));
fs.writeFileSync(out+'/invalid-manifest.zip',await zip.generateAsync({type:'uint8array'}));
