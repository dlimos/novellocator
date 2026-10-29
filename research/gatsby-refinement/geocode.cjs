const fs=require('node:fs'),{execFileSync}=require('node:child_process');
const queries={trinity:'Trinity College, Broad Street, Oxford, UK',seelbach:'Seelbach Hilton, Louisville, Kentucky',metropole:'147 West 43rd Street, Manhattan, New York',union:'West Adams Street and South Canal Street, Chicago',little:'Little Girls Point, Gogebic County, Michigan'};
const out={};
for(const [id,query]of Object.entries(queries)){
 const url='https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?'+new URLSearchParams({SingleLine:query,f:'json',outFields:'Addr_type,LongLabel,Match_addr',maxLocations:'3'});
 out[id]={url,result:JSON.parse(execFileSync('curl.exe',['--fail-with-body','-sS','--max-time','40',url],{encoding:'utf8'}))};
 console.log(id,JSON.stringify(out[id].result.candidates));
}
fs.writeFileSync(__dirname+'/geocoding.json',JSON.stringify(out,null,2));
