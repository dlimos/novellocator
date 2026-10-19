"""A small, explicitly reviewed set of authentic translated passages.

This is not a claim that all 407 associations have translated quotations.
"""
import json,pathlib
R=pathlib.Path(__file__).resolve().parent
corpora={l:json.loads((R/'corpus'/f'{l}-sections.json').read_text(encoding='utf-8')) for l in ['fr','es']}
specs=[
 (7,'meryton',{'fr':(42,'Meryton'),'es':(41,'Meryton')}),
 (7,'netherfield',{'fr':(47,'Netherfield'),'es':(45,'Netherfield')}),
 (28,'hunsford',{'fr':(2,'presbytère'),'es':(2,'abadía')}),
 (43,'pemberley',{'fr':(2,'Pemberley'),'es':(2,'Pemberley')}),
]
analysis=json.loads((R/'analysis.json').read_text(encoding='utf-8'))
out=[]
def roman(n):
    text=''
    for v,k in [(50,'L'),(40,'XL'),(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')]:
        while n>=v:text+=k;n-=v
    return text
for ch,pid,langs in specs:
    ref=next(r for r in analysis['sections'][ch-1]['references'] if r['placeId']==pid)
    trans={}
    for lang,(p,term) in langs.items():
        s=corpora[lang][ch-1];q=s['paragraphs'][p]
        if (ch,pid)==(28,'hunsford'):
            end='qu’ils arrivaient.' if lang=='fr' else 'que se acercaban.'
            q=q[:q.index(end)+len(end)]
        assert term.casefold() in q.casefold(),(ch,pid,lang)
        url=('https://fr.wikisource.org/wiki/Orgueil_et_Pr%C3%A9vention/'+str(ch) if lang=='fr' else
             'https://es.wikisource.org/wiki/Orgullo_y_prejuicio/Cap%C3%ADtulo_'+roman(ch))
        edition=('Jane Austen, Orgueil et Prévention, traduction Eloïse Perks, Maradan, Paris, 1822' if lang=='fr' else
                 'Jane Austen, Orgullo y prejuicio, traducción José J. de Urríes y Azara, Calpe, Madrid, 1924, edición en dos tomos')
        trans[lang]=dict(quote=q,language=lang,type='translation',highlightTerms=[term],highlightMode='explicit',
            attribution=f'{edition}; {"chapitre" if lang=="fr" else "capítulo"} {ch}, transcription paragraph {p+1}.',url=url,
            sourceParagraph=p+1,sourceChapterSha256=s['sha256'],verificationStatus='verified',
            verificationScope='Individually compared with the corresponding original scene; authentic translation wording retained, including historical variants.',
            rightsStatus='underlying-translation-public-domain-Italy-EU',
            rightsBasis=('Perks died 1850, BnF authority/catalogue; 1822 translation; modern annotations and reproductions excluded.' if lang=='fr' else
                         'Translator died 1932, Biblioteca Virtual Miguel de Cervantes; Calpe 1924 text, no modern revision or apparatus.'))
    notes=[]
    if (ch,pid)==(7,'meryton'):
        notes.append('Perks sends the two younger sisters to their aunt; the original and Spanish place them at an officer’s wife’s lodging. This variant does not change the Meryton scene but must not become the geographical proof for that subsetting.')
    if (ch,pid)==(7,'netherfield'):
        notes.append('Perks uses Hélen for Jane; Spanish uses Juana and Isabel. Preserve authentic names; do not silently replace them with English names.')
    if (ch,pid)==(28,'hunsford'):
        notes.append('Spanish abadía renders parsonage loosely; it does not prove an abbey. The original establishes the building as the Collins parsonage. French paragraph 1 introduces a right-hand orientation absent from the English one-side wording; do not use that addition to orient the illustration.')
    if (ch,pid)==(43,'pemberley'):
        notes.append('Corrected at public QA: use French/Spanish paragraph 3, the view of the house from the wooded height, matching the English selected paragraph. The previous paragraph 1 concerned arrival at the lodge and was not a version of this quotation.')
    out.append(dict(chapter=ch,placeId=pid,original=ref['evidence'],translations=trans,alignmentNotes=notes))
(R/'aligned-translations.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Individually reviewed: 4 scene associations, 8 translated passages (4 FR, 4 ES). Italian remains pending. All other translation alignments remain pending.')
