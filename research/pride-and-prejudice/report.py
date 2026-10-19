import collections,json,pathlib
R=pathlib.Path(__file__).resolve().parent
d=json.loads((R/'analysis.json').read_text(encoding='utf-8'))
lines=['# Orgoglio e pregiudizio — registro dei capitoli','',
 'Lettura integrale della trascrizione Gutenberg 1342. Questo registro riepiloga le decisioni narrative; citazioni letterali, motivazioni e riferimenti puntuali sono in `analysis.json`. La geografia e la collazione editoriale restano separate dalla categoria narrativa.','',
 'Le introduzioni corrispondenti in EN/IT/FR/ES sono in `introductions.json`. Le scene raccontate o epistolari sono indicate esplicitamente; il loro luogo è distinto da quello in cui la lettera o il racconto vengono ascoltati.','']
for s in d['sections']:
    lines += [f'## Capitolo {s["id"]} · volume {s["volume"]}, capitolo {s["volumeChapter"]}','',s['introductionIt'],'',
              '| Luogo | Categoria | Livello narrativo | Paragrafo |','| --- | --- | --- | ---: |']
    for r in s['references']:
        lines.append(f'| {r["name"]} | {r["category"]} | {r["narrativeLevel"]} | {r["evidence"]["sourceParagraph"]} |')
    if s['reviewNotes']:lines += ['',s['reviewNotes']]
    lines += ['']
(R/'chapter-review.md').write_text('\n'.join(lines),encoding='utf-8')
actions=collections.Counter(r['placeId'] for s in d['sections'] for r in s['references'] if r['category']=='action')
print('Chapter report generated; action associations:',actions.most_common())
