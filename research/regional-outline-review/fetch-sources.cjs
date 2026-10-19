const fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const dir=__dirname;fs.mkdirSync(dir+'/sources',{recursive:true});const urls=JSON.parse(fs.readFileSync(dir+'/sources/urls.json'));Object.assign(urls,{
 '10m-admin_1_states_provinces':'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson',
 world:'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_map_subunits.geojson',
 'south-pacific-iho':'https://geo.vliz.be/geoserver/MarineRegions/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=MarineRegions:iho&outputFormat=application/json&CQL_FILTER=mrgid%3D1910'
});
for(const key of ['states','lakes','admin1','10m-admin_1_states_provinces','world','south-pacific-iho']){const s=execFileSync('curl.exe',['-sS','--fail','--max-time','90',urls[key]],{encoding:'utf8',maxBuffer:90e6});const data=JSON.parse(s);if(!data.features?.length)throw Error('No features: '+key);fs.writeFileSync(dir+'/sources/'+key+'.json',s);console.log(key+': '+data.features.length+' features');}
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('docs/supabase-config.js','utf8'),ctx);const c=ctx.window.atlasSupabase;const s=execFileSync('curl.exe',['-sS','--fail','--max-time','60',c.url+'/rest/v1/books?select=id,metadata&order=id','-H','apikey: '+c.publishableKey],{encoding:'utf8',maxBuffer:30e6});JSON.parse(s);fs.writeFileSync(dir+'/books-live.json',s);fs.writeFileSync(dir+'/sources/urls.json',JSON.stringify(urls,null,2)+'\n');
