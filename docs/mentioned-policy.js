/* Editorial visibility only: original associations and passages stay in storage. */
(function(root){
 const groups={
  continent:'Africa|África|Asia|Europe|Europa|Americas|South America|North America|Oceania|Antarctica',
  country:'Afghanistan|Alemania|Argentina|Armenia|Australia|Austria|Bahamas|Belgium|Bolivia|Brazil|Canada|Cape Verde|Ceylon|Sri Lanka|Chile|China|Chipre|Cuba|Dinamarca|Egipto|Egypt|England|Inglaterra|España|Spain|Ethiopia|Etiopía|Fiji|France|Francia|Germany|Gran Bretaña|Great Britain|Grecia|Greece|Holland|Hungary|Iceland|India|Italia|Italy|Jamaica|Japan|Lebanon|Libia|Malta|Méjico|Mexico|Mongolia|Montenegro|Myanmar|Netherlands|New Zealand|Nicaragua|Palestine|Persia|Iran|Peru|Philippines|Poland|Portugal|Russia|Scotland|Serbia|Seychelles|Switzerland|Thailand|Túnez|Turkey|United States|Arabia|Tibet',
  state:'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Florida|Georgia|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York State|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington State|West Virginia|Wisconsin|Wyoming',
  famousCity:'Moscow|Mosca|Moscou|Moscú|Paris|París|Parigi|London|Londra|Londres|London and its unspecified vicinity|New York|New York City|Nueva York|Rome|Roma|Florence|Florencia|Firenze|Venice|Venecia|Venezia|Milan|Milán|Milano|Naples|Nápoles|Napoli|Madrid|Barcelona|Berlin|Berlino|Berlín|Vienna|Vienne|Viena|Amsterdam|Budapest|Athens|Atenas|Atene|Geneva|Ginevra|Genève|Ginebra|Lisboa|Lisbon|Lisbona|Lisbonne|Istanbul|Constantinopla|Copenhagen|Copenaghen|Copenhague|Saint Petersburg|St. Petersburg|San Pietroburgo|Saint-Pétersbourg|San Petersburgo|San Francisco|Los Angeles|Chicago|Boston|Washington, D.C.|Philadelphia|Filadelfia|Las Vegas|New Orleans|Nouvelle-Orléans|Nueva Orleans|Orlando|Miami|San Diego|Seattle|Toronto|Montreal|Montréal|Sydney|Melbourne|Hong Kong|Shanghai|Mumbai|Bombay|Tokyo|Peking|Beijing|Cairo|Il Cairo|El Cairo|Le Caire|Jerusalem|Jerusalén|Gerusalemme|Jérusalem|Mecca|La Mecca|La Mecque|La Meca|Rio de Janeiro|Rio|Buenos Aires|Lima|Quito|Havana, Cuba|Havana|La Habana|L’Avana|Edinburgh|Edimburgo|Édimbourg|Dublin|Dublino|Dublín|Sevilla|Seville|Siviglia|Valencia|Manchester|Liverpool|Oxford|Glasgow, Scotland|Prague|Praga'
 };
 groups.continent+='|America|América|America (dream and cultural references)|North America / Western hemisphere|The Continent';
 groups.country+='|Ireland|Irlanda|Irlande|Marruecos|Morocco|Marocco|Maroc|Korea|Corea|Corée|British Empire|Historical Prussia|Airstrip One|Eastasia|Eurasia|Oceania';
 groups.famousCity+='|Petersburg|Nice|Nizza|Niza|Kraków|Cracovia|Cracovie|Algiers|Argel|Algeri|Cape Town|Città del Capo|Le Cap|Ciudad del Cabo|Belfast|Birmingham|Detroit|Dresden|Dresda|Dresde|Frankfurt|Frankfurt am Main|Francoforte|Francfort|Cologne|Colonia|Köln|Bremen|Brema|Brême|Marseilles|Marseille|Marsiglia|Marsella|Lyon|Lione|Granada|Toledo|Helsingfors (Helsinki)|Helsinki|Kyiv|Kiev|Kiev (Kyiv)';
 const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const names=new Map(Object.entries(groups).flatMap(([reason,names])=>names.split('|').map(name=>[normalize(name),reason])));
 function reason(place){return place?.excludedMentionReason||names.get(normalize(String(place?.name||'').split(' · ')[0]));}
 function apply(input){
  const all={...input.citedPlaces,...input.places};
  function section(chapter){
   const excluded=id=>!!reason(all[id]);
   const indices=(chapter.places||[]).map((id,i)=>chapter.placeCategories?.[id]==='mentioned'&&excluded(id)?-1:i).filter(i=>i>=0);
   const c={...chapter,places:indices.map(i=>chapter.places[i]),placeText:indices.map(i=>chapter.placeText?.[i]),citations:(chapter.citations||[]).filter(r=>r.category==='action'||!excluded(r.placeId)),unlocatedPlaces:(chapter.unlocatedPlaces||[]).filter(p=>p.category==='action'||!reason(p))};
   const keep=new Set(c.places);
   if(c.overviewPlaces)c.overviewPlaces=c.overviewPlaces.filter(id=>keep.has(id));
   for(const key of ['placeCategories','placeKinds','placeNames','placeExcerpts','placeSources','placeQuotes','placeNarrativeDescriptions','placeOccurrences'])if(c[key])c[key]=Object.fromEntries(Object.entries(c[key]).filter(([id])=>keep.has(id)).map(([id,value])=>[id,key==='placeOccurrences'&&Array.isArray(value)?value.filter(r=>r.category==='action'||!excluded(id)):value]));
   c.unlocatedPlaces=c.unlocatedPlaces.map(p=>({...p,...(p.occurrences?{occurrences:p.occurrences.filter(r=>r.category==='action'||!reason(r))}:{})}));
   return c;
  }
  return {...input,chapters:input.chapters.map(section),...(input.sourceChapters?{sourceChapters:input.sourceChapters.map(section)}:{})};
 }
 root.AtlasMentionPolicy={apply,reason,groups};
})(typeof window==='object'?window:globalThis);
