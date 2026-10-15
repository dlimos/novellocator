"""Prepare source-literal, contextual passages without rebuilding unrelated editorial data."""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
R = ROOT / 'research/sound-and-fury'
OUT = ROOT / 'work/sound-and-fury-excerpts'
OUT.mkdir(parents=True, exist_ok=True)
audit = json.loads((R / 'analysis.json').read_text(encoding='utf8'))
texts = [json.loads((R / f'{i}.json').read_text(encoding='utf8')) for i in range(1, 6)]

def boundaries(text):
    # Honor sentence punctuation, but not the author's initials or common titles.
    ends = [0]
    for match in re.finditer(r'\n\n|[.!?]["”\u2019\']*(?:\s+|$)', text):
        prefix = text[max(0,match.start()-25):match.start()+1]
        if re.search(r'\b(?:Mr|Mrs|Dr|St|[A-Z])\.$', prefix):
            continue
        ends.append(match.end())
    if ends[-1] != len(text): ends.append(len(text))
    return ends

sources = [(' ' if i == 4 else '\n\n').join(p) for i,p in enumerate(texts)]
sentence_stops = [boundaries(source) for source in sources]
records = []
for ref in audit['references']:
    s, index, term = ref['section'], ref['paragraph'], ref['term']
    paragraphs = texts[s-1]
    sep = ' ' if s == 5 else '\n\n'
    source = sources[s-1]
    anchor = sum(len(p)+len(sep) for p in paragraphs[:index]) + paragraphs[index].index(term)
    stops = sentence_stops[s-1]
    n = next(i for i in range(len(stops)-1) if stops[i] <= anchor < stops[i+1])
    a, b = stops[n], stops[n+1]
    # A short utterance needs the adjoining narrative; retain real sentences.
    left = right = n
    while len(source[a:b].split()) < (22 if s == 5 else 38):
        if right+2 < len(stops): right += 1
        elif left > 0: left -= 1
        else: break
        a, b = stops[left], stops[right+1]
    # Faulkner's very long sentences need a coherent clause, not an arbitrary
    # character window. These proposals are individually reviewed before import.
    if len(source[a:b].split()) > 90:
        clauses = [a] + [m.end() for m in re.finditer(r'[;:,]\s+', source[a:b])]
        clauses = sorted(set([a] + [a+x for x in clauses[1:]] + [b]))
        k = next(i for i in range(len(clauses)-1) if clauses[i] <= anchor < clauses[i+1])
        left = right = k
        a, b = clauses[left], clauses[right+1]
        while len(source[a:b].split()) < 28 and (left > 0 or right+2 < len(clauses)):
            if left > 0: left -= 1
            elif right+2 < len(clauses): right += 1
            a, b = clauses[left], clauses[right+1]
    quote = source[a:b].strip()
    records.append({**ref, 'previousQuote': ref['quote'], 'quote': quote,
                    'highlightTerms': [term], 'sourceStart': a, 'sourceEnd': b,
                    'sourceJoin': sep, 'words': len(quote.split())})
# Reviewed source spans. The strings below are locators into the saved original,
# not replacement prose. Every resulting passage remains a literal substring.
selections = {
 '1/patterson': ('Mrs Patterson was looking out the window.', 'Mrs Patterson came to the door and opened it and stood there.'),
 '1/measles-room': ('We didn’t go to our room.', 'Why do we have to sleep in here tonight.”'),
 '2/harvard': ('About noon you’d see him', 'After a while the quad was empty.'),
 '2/new-london': ('If it had been cloudy', 'Why shouldn’t it?'),
 '2/south-carolina': ('Spoade was in the middle of them', 'He was from South Carolina, a senior.'),
 '2/galilee': ('I turned the face up', 'Washington not telling lies.'),
 '2/south-bend': ('Mr and Mrs Jason Richmond Compson announce', 'South Bend Indiana.'),
 '2/french-lick': ('Bringing empty trunks down', 'Found not death at the salt lick'),
 '2/kentucky': ('Husbands and fathers in Kentucky', 'besides his rooms in college.'),
 '2/cambridge': ('Husbands and fathers in Kentucky', 'besides his rooms in college.'),
 '2/jackson': ('If you’re sick you cant', 'I promise Caddy Caddy'),
 '2/bakery': ('Watching the bread,', '“Do you do your own baking, ma’am?”'),
 '2/canada': ('“I adore Canada,”', '“I think it’s marvellous.”'),
 '2/bathroom': ('one minute she was standing there', 'trying to shove her into the bathroom'),
 '2/square': ('I could see the lights on the courthouse clock', 'the light still on in Benjys room'),
 '2/branch': ('I could see the lights on the courthouse clock', 'and the smell of water'),
 '2/maine': ('and he i think youd better go on up to cambridge', 'watching pennies has healed more scars than jesus'),
 '2/havana': ('In that case I wont insist', 'friend in Havana'),
 '2/harvard-room': ('I turned out the light and went into my bedroom,', 'leaving the touch.'),
 '3/state-university': ('Selling land to send him to Harvard', 'except twice at a baseball game'),
 '3/carriage': ('I went on back to the garage.', 'be damned if I was going to put it on.'),
 '4/sheriff': ('He crossed the empty square', 'to the porch.'),
 '4/jason-room': ('She tried the knob,', 'emerged with a metal box.'),
 '5/france': ('Called "l\'Homme"', 'a Chevalier of France,'),
 '5/mississippi': ('Who granted out of his vast lost domain', 'four corners of a cardtable top'),
 '5/jefferson': ('forested then because these were the old days', 'and his tradingpost store)'),
 '5/washington': ('Who patented sealed and countersigned the grant', 'not knowing about the oil either:'),
 '5/glasgow': ('QUENTIN MACLACHAN. Son of a Glasgow printer,', 'in the Perth highlands.'),
 '5/perth': ('QUENTIN MACLACHAN. Son of a Glasgow printer,', 'in the Perth highlands.'),
 '5/england': ('At eighty, having fought once', 'fled again one night in 1779,'),
 '5/georgia': ('the claymore had vanished,', 'into Kentucky,'),
 '5/kentucky': ('the claymore had vanished,', 'already established a settlement.'),
 '5/harrodsburg': ('He still had the claymore', 'just in time to bury the father'),
 '5/mississippi-valley': ('in a plot to secede', 'join it to Spain.'),
 '5/united-states': ('in a plot to secede', 'join it to Spain.'),
 '5/spain': ('in a plot to secede', 'join it to Spain.'),
 '5/natchez-trace': ('rode up the Natchez Trace one day in 1811', 'on a small lightwaisted but stronghocked mare'),
 '5/domain': ('known as the Compson Domain then,', 'then known as the Governor\'s house'),
 '5/shiloh': ('the Brigadier Jason Lycurgus II who failed', 'Resaca in \'64,'),
 '5/resaca': ('the Brigadier Jason Lycurgus II who failed', 'Resaca in \'64,'),
 '5/new-england': ('who put the first mortgage', 'New England carpetbagger in \'66,'),
 '5/law-office': ('Jason III (bred for a lawyer', 'an office upstairs above the Square,'),
 '5/french-lick': ('when she married (1910)', 'French Lick the summer before.'),
 '5/hollywood': ('Married 1920 to a minor movingpicture magnate,', 'Divorced by mutual agreement, Mexico 1925.'),
 '5/mexico': ('Married 1920 to a minor movingpicture magnate,', 'Divorced by mutual agreement, Mexico 1925.'),
 '5/library-town': ('One day in 1943,', 'turning the key in it'),
 '5/memphis': ('she turned into a neat small yard', 'rang the bell'),
 '5/frony-house': ('she turned into a neat small yard', 'rang the bell'),
 '5/jason-apartment': ('moving into a pair of offices', 'his cotton ledgers and samples,'),
 '5/cinema': ('seen at the local picture show', 'with paper bags from the grocer\'s'),
}
terms = {
 '1/pasture':['the fence'], '1/monument':['the soldier'],
 '1/patterson':['the window','the door'], '1/cabin':['Versh’s house'],
 '1/mother-room':['Mother’s room'], '1/caddy-room':['Caddy’s room'],
 '1/maury-room':['Uncle Maury’s room'], '1/burgess':[],
 '1/toy-graveyard':['the bottle'], '1/measles-room':['in here'],
 '1/quentin-room':['Quentin’s window'], '1/medical':[],
 '2/harvard':['the quad'], '2/thompsons':['Thompson’s'],
 '2/parkers':['Parker’s'], '2/jeweller':['the window'],
 '2/hardware-boston':['hardware store'], '2/mississippi-river':['Mississippi River'],
 '2/charles':['The bridge'], '2/mason-dixon':['Mason and Dixon'],
 '2/hunting-woods':[], '2/cemetery-knoll':['dat knoll back de graveyard'],
 '2/bigelow':['Bigelow’s Mill'], '2/unitarian':['Unitarian steeple'],
 '2/bakery':[], '2/livery-rural':['livery stable'],
 '2/italian-neighborhood':['street of jumbled frame houses'],
 '2/barber':['barber-shop'], '2/creek-bridge':['bridge over the creek'],
 '2/picnic':['the pump'], '2/mikes':['Mike’s'],
 '2/harvard-room':['my bedroom'],
 '3/carriage':['the garage'], '3/beards':['Beard’s lot'],
 '3/school':['school house'], '3/telegraph':['telegraph office'],
 '3/cemetery':['a tombstone'], '3/livery-jefferson':['livery stable'],
 '3/printing':['printing shop'], '3/opera':['old opera house'],
 '3/failed-bank':['Merchants’ and Farmers’ Bank'],
 '3/milk-honey':['Milk street','Honey avenue'], '3/ab-russell':['his lot','his barn'],
 '3/sand-ditch':['sand ditch'], '3/methodist':['Methodist church'],
 '3/library':['the living room'], '3/jason-room':['my room'],
 '4/st-louis':['Saint Looey'], '4/sheriff':['a frame house'], '4/jason-room':['the closet'],
 '4/road-mottson':['Mottson'], '4/st-johns':['St John’s'],
 '4/black-church':['a weathered church'], '4/black-neighborhood':['small cabins'],
 '4/toy-graveyard':['an empty bottle of blue glass'], '4/pasture':['the green'],
 '4/biblical-bethlehem':[],
 '5/law-office':['an office upstairs above the Square'],
 '5/cabin':["one servant's cabin"], '5/house':['the house','a boarding house'],
 '5/frony-house':['the neat small house'], '5/store':["farmers' supply store"],
 '5/jason-apartment':['a pair of offices up a flight of stairs above the supplystore'],
 '5/cinema':['the local picture show'],
}
for record in records:
    key = f"{record['section']}/{record['id']}"
    source = sources[record['section']-1]
    if key in selections:
        first, last = selections[key]
        # Locate the nearest occurrence to the evidence anchor.
        candidates = [m.start() for m in re.finditer(re.escape(first), source)]
        assert candidates, (key, first)
        start = min(candidates, key=lambda p: abs(p-record['sourceStart']))
        end = source.index(last, start)+len(last)
        record.update(quote=source[start:end], sourceStart=start, sourceEnd=end)
    if key in terms: record['highlightTerms'] = terms[key]
    assert all(t in record['quote'] for t in record['highlightTerms']), key
    record['words'] = len(record['quote'].split())
    record['reviewed'] = True
    record['highlightReason'] = ('Only the exact locative forms of this passage; no global aliases.' if record['highlightTerms'] else 'The passage is indirect evidence and contains no reliable name or locative phrase for this setting; do not bold a person or an object as a place.')
(OUT / 'proposals.json').write_text(json.dumps(records, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
for s in range(1, 6):
    (OUT / f'{s}-review.txt').write_text('\n\n'.join(f"{r['id']} | {r['words']} words | [{r['term']}]\n{r['quote']}" for r in records if r['section']==s), encoding='utf8')
print(f'Prepared {len(records)} contextual proposals for individual review in {OUT}')
