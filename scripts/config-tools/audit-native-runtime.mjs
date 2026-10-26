import {build} from 'esbuild';
const result=await build({tsconfig:'tsconfig.app.json',entryPoints:['src/main.tsx'],bundle:true,platform:'browser',write:false,metafile:true,logLevel:'silent',loader:{'.png':'file','.svg':'file','.jpg':'file','.woff2':'file'},outdir:'tmp-audit'});
const banned=Object.keys(result.metafile.inputs).filter(p=>/src\/legacy\/|classMetadata|schemaMetadata|featureFormatRuntimeRegistry|formatRuntimeBridge|\/classConfigs\/|cardRegistryRows|cardRegistryContext|rendering\/renderRules|rendering\/featureRenderRules|search\/searchRuleTables|workflowRegistryLabels/.test(p));
console.log(JSON.stringify({inputs:Object.keys(result.metafile.inputs).length,banned},null,2));

if(banned.length)throw Error('Retired registry reached production: '+banned.join(', '));
