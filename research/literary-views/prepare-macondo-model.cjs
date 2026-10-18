const fs=require('node:fs'),vm=require('node:vm');
const directory=__dirname;
const names={en:'Macondo · Aracataca, real inspiration',it:'Macondo · Aracataca, modello reale',fr:'Macondo · Aracataca, modèle réel',es:'Macondo · Aracataca, modelo real'};
const notes={
 en:'The marker locates Aracataca, a documented real inspiration for Macondo. It does not locate the fictional town or identify its buildings with real addresses.',
 it:'Il punto indica Aracataca, una fonte d’ispirazione reale documentata per Macondo. Non localizza la città immaginaria né identifica i suoi edifici con indirizzi reali.',
 fr:'Le repère situe Aracataca, une source d’inspiration réelle documentée pour Macondo. Il ne situe pas la ville fictive et n’identifie pas ses bâtiments à des adresses réelles.',
 es:'El marcador sitúa Aracataca, una fuente de inspiración real documentada para Macondo. No localiza el pueblo ficticio ni identifica sus edificios con direcciones reales.'
};
const methods={
 en:'Town reference in Aracataca, Magdalena, Colombia: 10°35′34″ N, 74°11′26″ W, as reported in FINDETER project documentation (2022). The Fundación Gabo Ruta Macondo documents the real model; the coordinates are not a reconstruction of fictional Macondo.',
 it:'Riferimento urbano di Aracataca, Magdalena, Colombia: 10°35′34″ N, 74°11′26″ O, riportato nella documentazione di progetto FINDETER (2022). La Ruta Macondo della Fundación Gabo documenta il modello reale; le coordinate non ricostruiscono la Macondo immaginaria.',
 fr:'Référence urbaine à Aracataca, Magdalena, Colombie : 10°35′34″ N, 74°11′26″ O, selon la documentation de projet FINDETER (2022). La Ruta Macondo de la Fundación Gabo documente le modèle réel ; les coordonnées ne reconstituent pas Macondo.',
 es:'Referencia urbana de Aracataca, Magdalena, Colombia: 10°35′34″ N, 74°11′26″ O, según la documentación de proyecto FINDETER (2022). La Ruta Macondo de la Fundación Gabo documenta el modelo real; las coordenadas no reconstruyen el Macondo ficticio.'
};
const patch={coords:[10+35/60+34/3600,-(74+11/60+26/3600)],zoom:13,scope:'real-literary-model',modelName:'Aracataca',precision:'town-reference-not-fictional-town',names,notes,methods,
 source:{label:'FINDETER · Aracataca, localización del proyecto (2022)',url:'https://www.findeter.gov.co/system/files/convocatorias/PAF-AASB-O-010-2022/documento_2_-_estudios_previos_ebar_aracataca-_obra_1.pdf'},
 narrativeSource:{label:'Fundación Gabo · Ruta Macondo, circuito Aracataca',url:'https://especiales.fundaciongabo.org/ruta-macondo-circuito-aracataca/'},checked:'2026-10-18'};
const context={window:{}};vm.runInNewContext(fs.readFileSync('docs/data/macondo-local.js','utf8'),context);
Object.assign(context.window.atlasIllustratedLocal.geographicPlaces['regional-town'],patch);
fs.writeFileSync('docs/data/macondo-local.js','window.atlasIllustratedLocal='+JSON.stringify(context.window.atlasIllustratedLocal,null,2)+';\n');
fs.writeFileSync(directory+'/macondo-model.json',JSON.stringify(patch,null,2)+'\n');
const encoded=Buffer.from(JSON.stringify(patch)).toString('base64');
const sql=`begin;
do $guard$ begin
 if not exists(select 1 from public.book_maps where book_id='macondo' and id='reading-map' and metadata#>'{illustratedAtlas,geographicPlaces,regional-town}' is not null) then raise exception 'Existing Macondo geographical record missing'; end if;
end $guard$;
update public.book_maps set metadata=jsonb_set(metadata,'{illustratedAtlas,geographicPlaces,regional-town}',(metadata#>'{illustratedAtlas,geographicPlaces,regional-town}')||convert_from(decode('${encoded}','base64'),'UTF8')::jsonb) where book_id='macondo' and id='reading-map';
commit;
select book_id,metadata#>'{illustratedAtlas,geographicPlaces,regional-town,coords}' as model_coordinates,metadata#>>'{illustratedAtlas,geographicPlaces,regional-town,scope}' as positioning from public.book_maps where book_id='macondo' and id='reading-map';
`;
fs.writeFileSync(directory+'/publish-macondo-model.sql',sql);
console.log('Prepared a scoped Macondo real-model patch; quotations, categories and other records are preserved.');
