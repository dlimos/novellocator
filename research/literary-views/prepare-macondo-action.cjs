const fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/macondo-local.js','utf8'),context);
const payload=context.window.atlasIllustratedLocal,geo=payload.geographicPlaces['regional-town'];
if(geo.scope!=='real-literary-model')throw Error('Expected a reviewed real model');
const scenes={
 en:'The first chapter sets the Buendía family’s village life and the arrival of the travellers with their inventions in Macondo. Aracataca is the documented real model used to represent this action setting.',
 it:'Il primo capitolo ambienta a Macondo la vita dei Buendía nel villaggio e l’arrivo degli zingari con le loro invenzioni. Aracataca è il modello reale documentato usato per rappresentare questo luogo dell’azione.',
 fr:'Le premier chapitre situe à Macondo la vie des Buendía au village et l’arrivée des gitans avec leurs inventions. Aracataca est le modèle réel documenté qui représente ce lieu de l’action.',
 es:'El primer capítulo sitúa en Macondo la vida de los Buendía en la aldea y la llegada de los gitanos con sus inventos. Aracataca es el modelo real documentado usado para representar este lugar de la acción.'
};
geo.chapterRoles={...geo.chapterRoles,1:'action'};geo.chapterScenes={...geo.chapterScenes,1:scenes};
fs.writeFileSync('docs/data/macondo-local.js','window.atlasIllustratedLocal='+JSON.stringify(payload,null,2)+';\n');
const audit={checked:'2026-10-18',placeId:'regional-town',section:1,category:'action',narrativeLevel:'primary narrative, including the narrated early village and family memories',reason:scenes.it,geography:'The action setting is Macondo. Aracataca supplies its documented real model, not a place explicitly mentioned in the novel.',evidence:payload.places.filter(p=>['river-first','camp'].includes(p.id)).map(p=>({id:p.id,source:p.source})),displayedOriginal:geo.excerpts[1],scenes};
fs.writeFileSync(__dirname+'/macondo-action-review.json',JSON.stringify(audit,null,2)+'\n');
const encoded=Buffer.from(JSON.stringify(scenes)).toString('base64');
const sql=`begin;
update public.book_maps
set metadata=jsonb_set(metadata,'{illustratedAtlas,geographicPlaces,regional-town}',
 (metadata#>'{illustratedAtlas,geographicPlaces,regional-town}')||jsonb_build_object(
 'chapterRoles',coalesce(metadata#>'{illustratedAtlas,geographicPlaces,regional-town,chapterRoles}','{}'::jsonb)||'{"1":"action"}'::jsonb,
 'chapterScenes',coalesce(metadata#>'{illustratedAtlas,geographicPlaces,regional-town,chapterScenes}','{}'::jsonb)||jsonb_build_object('1',convert_from(decode('${encoded}','base64'),'UTF8')::jsonb)))
where book_id='macondo' and id='reading-map' and metadata#>>'{illustratedAtlas,geographicPlaces,regional-town,scope}'='real-literary-model';
commit;
select book_id,metadata#>>'{illustratedAtlas,geographicPlaces,regional-town,chapterRoles,1}' as narrative_category from public.book_maps where book_id='macondo' and id='reading-map';
`;
fs.writeFileSync(__dirname+'/publish-macondo-action.sql',sql);
console.log('Macondo chapter 1: reviewed action setting, real model unchanged, existing original quotation retained.');
