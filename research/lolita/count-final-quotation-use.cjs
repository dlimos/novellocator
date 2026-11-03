// Counts source intervals without redistributing the private full-text witness.
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sections=read('work/lolita-quotes/native-sections.json');
const old=read('research/lolita/pdf-quotation-review.json').records;
const review=read('research/lolita/final-review.json');
const words=s=>(s.match(/\S+/g)||[]).length;
let uniqueWords=0,intervals=0;
for(const section of sections){
 const spans=old.filter(r=>r.sectionId===section.id).flatMap(r=>r.parts||[]);
 spans.push(...(review.sections.find(s=>s.id===section.id)?.associations||[]).flatMap(r=>r.evidence.parts||[]));
 const merged=[];
 for(const span of spans.sort((a,b)=>a.start-b.start)){
  assert(span.start>=0&&span.end<=section.text.length);
  const last=merged.at(-1);if(last&&span.start<=last.end)last.end=Math.max(last.end,span.end);else merged.push({...span});
 }
 intervals+=merged.length;uniqueWords+=merged.reduce((n,p)=>n+words(section.text.slice(p.start,p.end)),0);
}
const expected=read('work/lolita-final-review/reader-expected.json').tables;
const quotes=expected.excerpts.filter(r=>r.section_id===71).map(r=>r.quote);
quotes.push(...expected.unlocated_settings.filter(r=>r.section_id===71).map(r=>r.quote));
const afterwordUpperBound=[...new Set(quotes.filter(Boolean))].reduce((n,q)=>n+words(q),0);
const report={checkedAt:new Date().toISOString(),scope:'Union of prior native-PDF audit intervals and final mapped selections, including retained archive; afterword counted separately.',nativeDistinctWords:uniqueWords,nativeMergedIntervals:intervals,nativeWitnessWords:sections.reduce((n,s)=>n+words(s.text),0),afterwordWordsUpperBound:afterwordUpperBound,afterwordMethod:'Exact repeated strings deduplicated; overlapping different selections still counted, therefore an upper bound. Word counts are not legal thresholds.'};
fs.writeFileSync('work/lolita-final-review/aggregate-use.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
