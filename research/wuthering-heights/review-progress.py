"""Record the chapters actually read in full; never infer review from a search."""
import json,pathlib
R=pathlib.Path(__file__).resolve().parent
sections=json.loads((R/'sections.json').read_text(encoding='utf-8'))
notes={
1:'Scena alle Heights, affitto della Grange riferito, ricordo scenico della costa. Interni aggregati alla casa.',
2:'Ingresso nello studio alla Grange e visita alle Heights verificati separatamente. Aggiunta la menzione della brughiera al paragrafo 29, sfuggita al concordanziere singolare.',
3:'Letti integralmente anche i paragrafi 34–38 recuperati separatamente. Notte alle Heights, cammino sulla brughiera e ritorno alla Grange; cappella onirica separata dal kirk reale.',
4:'Cornice alla Grange e infanzia alle Heights. Liverpool resta menzione: ritrovamento riepilogato. Tre regni è locuzione proverbiale, non identificazione cartografica autonoma. Fiera parrocchiale senza localizzazione utile.',
5:'Morte di Earnshaw narrata alle Heights; commissione al villaggio riferita. College senza nome o collocazione utile resta nota di analisi.',
6:'Arrivo di Hindley e racconto di Heathcliff della corsa e della finestra alla Grange. Lascar non prova una provenienza indiana; Christendom è iperbole religiosa. Chiesa generica non identificata automaticamente col kirk.',
7:'Natale alle Heights e cornice dialogica alla Grange verificati. Uscita sulla brughiera solo riferita. Banda di Gimmerton indica provenienza; Cina, India e Inghilterra sono fantasia consolatoria, non biografia. French cooks, libri e strumenti non identificano scene geografiche.',
8:'Nascita e morte di Frances, visita di Edgar, violenza e riconciliazione alle Heights. Candela e ritratto stabiliscono la cornice alla Grange. Lavoro di Joseph alle rupi solo riferito. Campo da fieno e annessi appartengono alla fattoria, senza punto autonomo.',
9:'Hindley, caduta di Hareton, confessione, fuga e temporale alle Heights. Grange: cornice finale esplicita, oltre alla convalescenza riassunta. Brughiera e palude solo ipotizzate/riferite; matrimonio a Gimmerton riepilogato. Paradiso del sogno conservato fuori atlante.'
}
notes.update({
10:'Cornice di malattia e ritorno di Heathcliff alla Grange. Gimmerton: incontro con Joseph e discorso diretto, scena retrospettiva. Visita alle Heights e gioco di carte raccontati in sintesi da Catherine: mantenuti mentioned nel dubbio. Continente, America e strade inglesi sono congetture esplicite. Cittadina della riunione giudiziaria non identificata; nessuna equivalenza automatica con Gimmerton.',
11:'Visita di Nelly alle Heights, sosta e fuga al cippo sulla brughiera, bacio e scontro nella cucina della Grange verificati. Viaggio a Gimmerton interrotto: non è scena nel villaggio.',
12:'Delirio alla Grange, ricordo scenico del nido sulla brughiera, visita a Kenneth nella strada del villaggio. Heights e Fairy Cave nel delirio restano menzioni. La bottega del fabbro è situata solo relativamente, due miglia fuori Gimmerton: racconto di terza mano con azioni specifiche, conservato nell’analisi regionale senza inventare bottega geocodificata.',
13:'Convalescenza alla Grange e lettera di Isabella: viaggio sulla brughiera, sosta e arrivo alle Heights con scene dettagliate negli interni. Atlantico è paragone della distanza affettiva. Nessuna localizzazione dei due mesi di assenza.',
14:'Dialogo iniziale e cornice finale alla Grange, visita di Nelly e coercizione alle Heights. Giardino della Grange riferito e minaccia di intrusione; stessa casa già azione verificata. Nessun nuovo luogo collocabile.',
15:'Incontro finale di Catherine e Heathcliff nella camera della Grange. Heights solo richiamo temporale e affettivo; cappella osservata o udita dalla Grange, non scena del servizio.',
16:'Parto, morte, visita nel parco e ciocche nel medaglione alla Grange. Heights citate per identificare Cathy. Sepoltura e descrizione delle tombe riepilogate: kirk mentioned nel dubbio; nessuna scena celeste cartografata.',
17:'Isabella racconta lo scontro alle Heights e la fuga attraverso la brughiera: aggiunta associazione regionale action al paragrafo 64. Cornice alla Grange. Scene nel villaggio sia con Heathcliff sia con il legale. Vicinanze di Londra residenza riferita e incerta; Inghilterra inseguimento immaginato. Visita finale alle Heights verificata.'
})
notes.update({
18:'Infanzia e preparazione del gioco alla Grange; ricerca di Nelly sulla strada e ritrovamento alle Heights. Rupi e grotta: escursione riferita senza descrizione, mentioned nel dubbio. Londra meta del viaggio di Edgar riferita. Galloway è il pony, deserto è gioco nel parco.',
19:'Attesa nei terreni della Grange, arrivo della carrozza, incontro con Linton e richiesta di Joseph: azione nella Grange. Heights solo destinazione promessa per l’indomani.',
20:'Risveglio e preparazione alla Grange; colloquio effettivo durante la cavalcata attraverso il paesaggio d’erica, aggiunto action regionale; arrivo e colazione alle Heights. Nord/sud descrivono le due residenze, senza nuovi punti o presunto viaggio biografico.',
21:'Uscita dalla Grange, incontro sulla brughiera, visita alle Heights e scene della corrispondenza alla Grange. Gimmerton e kirk nel resoconto di consuetudini, rupi nel richiamo al viaggio precedente. Yorkshire pronunciation è evidenza regionale linguistica, non scena estesa alla contea.',
22:'Passeggiata, albero, muro e incontro con Heathcliff al limite del parco: azione aggregata alla Grange. Heights e breve raccordo finale della strada sono mentioned nel dubbio; aggiunto quest’ultimo per non perdere la geografia del tragitto. Slough of Despond è allusione letteraria.',
23:'Salita piovosa sulla strada, scena con Linton alle Heights, ritorno e malattia di Nelly alla Grange verificati. Gimmerton solo uscite riferite di Zillah. Elysium è metafora del conforto di Joseph, non luogo geografico.',
24:'Cornice nella biblioteca della Grange e confessione di Cathy; visite alle Heights narrate in dettaglio. Corretta la brughiera da mentioned del paesaggio ideale a action dell’incontro sul margine della strada (40–42); i due livelli sono distinti nelle note.',
25:'Cornice con Lockwood e dialogo con Edgar alla Grange. Kirk osservato e consuetudini funerarie ricordate senza scena singolare autonoma: mentioned. Heights residenza del ragazzo, brughiera programma d’incontri.',
26:'Primo incontro con Linton sull’erica, sosta e timore del padre: action regionale. Heights riferimento direzionale. Corretta Grange da mentioned del progetto al paragrafo 34 action: Edgar chiede e riceve il resoconto dopo il ritorno a casa; continuità senza nome esplicito.',
27:'Assistenza a Edgar alla Grange, secondo incontro sulla brughiera, ingresso e reclusione alle Heights. Lees meta riferita della mandria, nessuna scena; contorno regionale verificato, senza scelta arbitraria di un omonimo.',
28:'Reclusione, colloquio con Linton e fuga di Cathy dalle Heights; ritorno di Nelly, ricongiungimento e morte di Edgar alla Grange. Gimmerton diceria e affari riferiti; palude falsa spiegazione della scomparsa, mai action per questo racconto.',
29:'Heathcliff nella biblioteca della Grange; apertura della tomba e scavo raccontati con azioni specifiche al kirk; ritorno alle Heights e scontro nel flashback. Aggiunta menzione delle passeggiate sulla brughiera; non promossa ad action perché iterativa.',
30:'Nelly fermata alla porta delle Heights e racconto di Zillah della malattia, morte e isolamento nella casa. Colloquio delle due donne sulla brughiera con discorso diretto distinto dagli eventi raccontati. Grange solo visita riferita/progetto di Lockwood; conclusione del racconto senza una nuova scena esplicita nella cornice, mentioned nel dubbio. Cappella dissenziente non confusa col kirk.',
31:'Visita di Lockwood alle Heights, lettera, libri e pranzo; ritorno a cavallo con riflessione sulla strada. Grange e Londra menzioni, non scene. Chevy Chase titolo di ballata; lingue dei libri non aggiungono paesi.',
32:'Locanda anonima circa quindici miglia da Gimmerton: scena completa conservata nell’analisi regionale, nessun edificio inventato collocato. Arrivo al villaggio, cammino nella valle, visita alla Grange e alle Heights; racconto della riconciliazione alle Heights. Fiera Gimmerton già aggregata al luogo action; incidente sulle colline e passeggiate riferiti, regione già action per tragitto attuale.',
33:'Giardino, colazione, scontro, lezione e confessione alle Heights per continuità con XXXII. Grange piante progettate, Crags escursione richiamata: mentioned. Nessun trasferimento narrato alla Grange.',
34:'Giardino e ultimi giorni, camera e morte alle Heights; racconto dell’incontro con il bambino sulla strada, regione action. Funerale con azioni specifiche e visita finale alle tombe al kirk action. Grange futuro trasferimento; paradiso/inferno immaginati non sono punti. Fantasmi distinti da fatti accertati.'
})
previous=json.loads((R/'full-review.json').read_text(encoding='utf-8')) if (R/'full-review.json').exists() else {}
previous.update({str(s['id']):dict(chapter=s['roman'],sourceSha256=s['sha256'],paragraphCount=len(s['paragraphs']),completeNarrativeRead=True,notes=notes[s['id']]) for s in sections if s['id'] in notes})
(R/'full-review.json').write_text(json.dumps(previous,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Full chapters reviewed:',len(previous),'/ 34')
