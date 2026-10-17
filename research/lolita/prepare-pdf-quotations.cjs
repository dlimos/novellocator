// Requires the user's private native-text PDF extraction and reviewed selections.
// Never reads OCR, never publishes the PDF or its full text.
const fs=require('fs'),crypto=require('crypto'),vm=require('vm');
const privateDir='work/lolita-quotes/',out='research/lolita/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const before=read(privateDir+'bundle-before.json'),bundle=structuredClone(before),tables=bundle.tables;
const selected=read(privateDir+'selected.json'),sections=read(privateDir+'native-sections.json'),pages=read('work/lolita-roadtrip/pdf-pages.json'),pdf=read('work/lolita-roadtrip/pdf-metadata.json');
if(pdf.sha256!=='9950fc89e4a03b5ade99076aa29c70be416fe8e8b8348086ec80b2b84794e7ee')throw Error('Unexpected PDF');
const native=pages.map(p=>p.text+'\n').join(''),normalized=native.replace(/\s+/g,' ');
const pageOffsets=[];let offset=0;for(const p of pages){pageOffsets.push({page:p.page,start:native.slice(0,offset).replace(/\s+/g,' ').length});offset+=p.text.length+1;}
const book=tables.books[0],review=book.metadata.geographicReview;
const textSource={book_id:'lolita',id:hash('lolita-native-pdf-'+pdf.sha256),url:'https://github.com/dlimos/novellocator/blob/docs/research/lolita/QUOTATIONS.md',label:'Vladimir Nabokov · Lolita · identified digital copy',metadata:{kind:'bibliographical-record',sourceFile:'Lolita-Vladimir-Nabokov.pdf',sha256:pdf.sha256,pages:283,extraction:'native-pdf-text',publisher:null,editionYear:null,editionStatus:'digital-copy-identified-no-publisher-or-imprint-stated',completeNovel:true,authorAfterwordPresent:false,originalLanguage:'en'}};
const rightsSource={book_id:'lolita',id:hash('lolita-critical-quotation-art70-20261017'),url:'https://www.bandistapp.it/norma/l-1941-633/art-70',label:'Art. 70 L. 633/1941 · critical discussion',metadata:{publicDomainClaim:false,basis:'limited quotations for criticism and discussion of literary geography',audit:'research/lolita/QUOTATIONS.md',translationRights:'no translated passages distributed'}};
for(const s of [textSource,rightsSource])if(!tables.sources.some(t=>t.id===s.id))tables.sources.push(s);
const analysis=read('research/lolita/section-analysis.json').sections;
const actionAudit=read('research/lolita/whole-book-review.json').sections;
const references=[],unlocated=[],regions=[],audit=[];
const indirect=['Haze house','Mrs. Haze','Mirana Motel','Mirana','rose garden of the school','beach','mimosa grove','boulder','sofa','plate','phone','room','lawn','furniture','bedroom','studio','Campus Avenue','Thayer Street','street','bed','bathroom','board','Treasure Island','garage','Mona','homework','bronchitis','Walton Inn','tour books and maps','Chestnut Court','terrace','flat','bell button','lip of granite','mining town','homeward'];
for(const r of selected){
 const section=sections.find(s=>s.id===r.sectionId);if(!section)throw Error('Section absent');
 const global=normalized.indexOf(section.text.slice(0,100));if(global<0)throw Error('Native section absent');
 const quotePages=new Set();for(const p of r.parts){if(section.text.slice(p.start,p.end)!==p.quote)throw Error('Non-native passage');for(const at of [global+p.start,global+p.end-1])quotePages.add(pageOffsets.filter(x=>x.start<=at).at(-1).page);}
 const quotedPages=[...quotePages].sort((a,b)=>a-b);
 const quote=(r.parts[0].start>0?'[…] ':'')+r.parts.map(p=>p.quote).join(' […] ')+(r.parts.at(-1).end<section.text.length?' […]':'');
 let highlightTerms=[...new Set(r.terms.flatMap(t=>{const m=new RegExp('(?<![\\p{L}])'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}])','iu').exec(quote);return m?[m[0]]:[]}))];
 if(!highlightTerms.length){const alternatives=[...(r.id==='naples'?['Napes']:[]),...(r.id==='abilene'?['Abiliene']:[]),...(r.id==='Hell’s Canyon'?["Hell's Canyon"]:[]),...(r.id==='Washington Street'?['W. Washington']:[]),...indirect];const term=alternatives.find(t=>quote.toLowerCase().includes(t.toLowerCase()));if(term)highlightTerms=[quote.slice(quote.toLowerCase().indexOf(term.toLowerCase()),quote.toLowerCase().indexOf(term.toLowerCase())+term.length)];}
 const a=actionAudit.find(s=>s.id===r.sectionId)?.reviewedActionPlaces?.find(a=>a.placeId===r.id);
 const sourceNotes=analysis.find(s=>s.id===r.sectionId)?.locationAnalysis||'';
 const rationale=r.category==='action'?(a?.reason||(r.id==='madeleine'?'Humbert narrates walking along the street near the Madeleine; this is a recalled scene, not a place of residence or an itinerary proposal.':'A narrated event takes place in this setting; the chapter context establishes its identity.')):'Conservative mentioned classification: this geographical reference is not used to establish an enacted scene here. Plans, biographies, catalogue entries, similes and reported information remain distinct from scenes. See the section-specific narrative notes.';
 const contextEstablished=!r.terms.some(t=>quote.toLowerCase().includes(t.toLowerCase()));
 const attribution=`Vladimir Nabokov · Lolita · ${r.sectionId==='foreword'?'Foreword':`Part ${r.sectionId.split('.')[0]} · Chapter ${r.sectionId.split('.')[1]}`} · digital copy, publisher and date not stated · PDF p. ${quotedPages.join(', ')}${contextEstablished?' · setting identified from chapter context':''}`;
 const passage={quote,language:'en',type:'original',attribution,highlightTerms,highlightMode:'explicit',verificationStatus:'verified',quotationStatus:'reviewed-critical-use',analysisStatus:'native-pdf-evidence-reviewed',sourceEdition:'identified-digital-copy-imprint-not-stated',sourcePdfSha256:pdf.sha256,sourcePdfPages:quotedPages,narrativeCategory:r.category,contextEstablished,verificationNote:rationale};
 const excerpt={original:passage,translations:{}};
 const direct=tables.place_references.find(x=>x.section_id===r.section&&x.place_id===r.id);
 const region=review.regionalPlaces.find(x=>x.id===r.id);
 if(direct){
  const row={book_id:'lolita',id:direct.id+':original',section_id:r.section,reference_id:direct.id,slot:'original',language:'en',type:'original',quote,attribution,text_source_id:textSource.id,rights_source_id:rightsSource.id,metadata:Object.fromEntries(Object.entries(passage).filter(([k])=>!['quote','language','type','attribution'].includes(k)))};
  if(tables.excerpts.some(e=>e.id===row.id))throw Error('An existing quotation must not be overwritten');tables.excerpts.push(row);references.push(row);
 }else if(region?.sectionOccurrences?.[r.section]){
  region.sectionOccurrences[r.section].excerpt=excerpt;regions.push({id:region.id,section:r.section,excerpt});
 }else{
  const keys=region?(region.evidencePriority||region.keys):[r.id];
  const candidates=tables.unlocated_settings.filter(u=>u.section_id===r.section&&keys.includes(u.metadata.id||u.name)).sort((a,b)=>keys.indexOf(a.metadata.id||a.name)-keys.indexOf(b.metadata.id||b.name));
  if(!candidates.length)throw Error('No quotation target: '+r.sectionId+'/'+r.id);
  const u=candidates[0];u.quote=quote;u.source_id=textSource.id;u.metadata={...u.metadata,...passage,category:r.category};delete u.metadata.quote;
  unlocated.push(u);
 }
 audit.push({sectionId:r.sectionId,section:r.section,placeId:r.id,category:r.category,quote,pdfPages:quotedPages,sourcePdfSha256:pdf.sha256,parts:r.parts.map(p=>({start:p.start,end:p.end,sha256:hash(p.quote)})),highlightTerms,contextEstablished,rationale,sectionNarrativeNotes:sourceNotes,purpose:'Allow the reader to assess the geographical identification and narrative category discussed by the atlas; no continuous reading text or plot anthology is provided.',necessity:'The selected fragment isolates the relevant geographical wording or the event needed for the category. Non-adjacent fragments are visibly separated; context is explained editorially rather than reproduced at length.',translations:[]});
}
const note=[
 'Quotations follow the English text of the identified digital copy, with PDF page numbers. No verified published translation is available. The author’s afterword is absent from this copy and remains without quotations.',
 'Le citazioni seguono il testo inglese della copia digitale identificata, con le pagine del PDF. Non è disponibile una traduzione editoriale verificata. La postfazione d’autore manca in questa copia e resta senza citazioni.',
 'Les citations suivent le texte anglais de la copie numérique identifiée, avec les pages du PDF. Aucune traduction publiée vérifiée n’est disponible. La postface de l’auteur est absente de cette copie et reste sans citations.',
 'Las citas siguen el texto inglés de la copia digital identificada, con las páginas del PDF. No hay una traducción publicada verificada disponible. El epílogo del autor falta en esta copia y queda sin citas.'
];
book.metadata.sidebarNote=note[0];review.sidebarNote=note[0];book.metadata.analysisStatus='native-pdf-quotations-added-afterword-and-editorial-edition-gaps';
book.metadata.quotationReview={date:'2026-10-17',sourcePdfSha256:pdf.sha256,extraction:'native-pdf-text-only-no-ocr',mappedAndVisibleUnlocatedAssociations:audit.length,originalLanguage:'en',availableQuotationLanguages:['en'],afterword:'absent-from-selected-pdf-no-quotation-added',pendingAssociations:[{section:'1.21',placeId:'regional-riviera',reason:'No useful geographical evidence for the Riviera in the selected PDF chapter; no quotation supplied.'}],edition:'Identified digital witness; publisher and edition date not stated. Not attributed to Olympia Press or any other publisher.'};
const translations=[];for(let i=1;i<4;i++){const language=['en','it','fr','es'][i],row={book_id:'lolita',language,source_hash:hash(note[0]),source_text:note[0],translated_text:note[i]};tables.content_translations.push(row);translations.push(row);}
const sql=require("./quotation-sql.cjs")({before,bundle,audit,textSource,rightsSource,note,translations});
fs.writeFileSync(out+'publish-pdf-quotations.sql',sql);
const spans=[];for(const r of audit)for(const p of r.parts)spans.push({section:r.sectionId,...p});
let uniqueWords=0;for(const s of sections){const intervals=spans.filter(p=>p.section===s.id).sort((a,b)=>a.start-b.start),merged=[];for(const p of intervals){const last=merged.at(-1);if(last&&p.start<=last.end)last.end=Math.max(last.end,p.end);else merged.push({...p});}for(const p of merged)uniqueWords+=s.text.slice(p.start,p.end).split(/\s+/).length;}
const result={bookId:'lolita',reviewedAt:'2026-10-17',source:{fileName:'Lolita-Vladimir-Nabokov.pdf',sha256:pdf.sha256,pages:283,extraction:'pypdf native text; no OCR',publisher:null,editionYear:null,afterwordPresent:false},counts:{associations:audit.length,relationalExcerpts:references.length,unlocatedRows:unlocated.length,regionalOccurrences:regions.length,displayedWordsWithRepetitions:audit.reduce((n,r)=>n+r.quote.replaceAll('[…]','').trim().split(/\s+/).length,0),uniqueSourceWords:uniqueWords,totalNativeSourceWords:sections.reduce((n,s)=>n+s.text.split(/\s+/).length,0)},gaps:book.metadata.quotationReview.pendingAssociations,records:audit};
fs.writeFileSync(out+'pdf-quotation-review.json',JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(privateDir+'bundle-expected.json',JSON.stringify(bundle,null,2));
const c={window:{}};vm.createContext(c);for(const f of ['content-adapter.js','supabase-data.js'])vm.runInContext(fs.readFileSync('docs/'+f,'utf8'),c);
const output=c.window.atlasContent.reconstruct(bundle,'lolita');output.data=c.window.atlasSupabaseData.groupSections(output.data);
fs.writeFileSync(privateDir+'expected.json',JSON.stringify(output,null,2));
console.log(result.counts);console.log('SQL bytes',Buffer.byteLength(sql));
