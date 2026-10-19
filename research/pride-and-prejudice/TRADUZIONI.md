# Testimoni, traduzioni e lacune

Verifica del 19 ottobre 2026. Testimoni, ricerche e limiti del riuso; lo stato remoto effettivo è registrato in `import-status.json`.

## Inglese

Acquisita la trascrizione Gutenberg 1342 nell’archivio pubblico GITenberg, aggiornamento 15 febbraio 2015, volontari anonimi. Comprende 61 capitoli consecutivi e 121.439 parole narrative secondo il conteggio per spazi. Inizio e conclusione verificati; escluso l’avviso finale Gutenberg. La corrispondenza con i tre volumi è I: 1–23, II: 24–42, III: 43–61. Non ci sono un prologo o un epilogo separati: il capitolo 61 svolge la funzione di conclusione retrospettiva.

Il frontespizio della trascrizione 1342 non documenta l’edizione cartacea sottostante: attribuirla semplicemente a Egerton 1813 sarebbe inesatto. Per questo ogni citazione del dossier dichiara il testimone realmente letto e il suo limite editoriale.

È stato acquisito un secondo testimone completo, Gutenberg 42671, dall’archivio GITenberg. Il relativo collegamento alla scansione è stato risolto tramite il record Internet Archive: *The Novels*, vol. II, a cura di R. W. Chapman, Oxford, Clarendon Press, **1923**. La riproduzione dei frontespizi del 1813 non trasforma questo volume nell’esemplare della prima edizione.

L’estrazione strutturale contiene tutti i 61 capitoli. La prima collazione automatica ritrovava soltanto 71 delle 407 citazioni senza alcuna variazione. La successiva collazione dei passi selezionati ha verificato 238 corrispondenze con le stesse parole e 169 con varianti lessicali o ortografiche: revisionati il prospetto completo delle varianti, i termini da evidenziare divergenti e i tre casi di basso allineamento. `verified-print-quotations.json` registra la verifica editoriale, il passo letto e quello del testimone del 1923. I paragrafi delle lettere sono suddivisi diversamente: non si usa la similarità di un singolo paragrafo come misura dell’integrità del capitolo. Non viene dichiarata una seconda rilettura integrale del volume del 1923.

Il testimone definitivo delle citazioni è il volume Clarendon del 1923. Il testo narrativo di Austen è distinto dagli apparati di Chapman: note, collazioni e contributi editoriali non vengono importati o dichiarati di pubblico dominio sulla sola base della morte di Austen. Sono conservate le parole autentiche dell’edizione scelta, comprese *Kenelworth*, *Gracechurch-street*, *East Bourne* e *Purvis Lodge*. Le categorie e le identità narrative rimangono quelle della lettura integrale; i passi collazionati ne confermano la funzione.

## Francese

Acquisita integralmente la trascrizione Wikisource di *Orgueil et Prévention*, traduzione di **Eloïse Perks**, Paris, Maradan, **1822**: 61 capitoli, inizio e conclusione verificati strutturalmente; 121.056 parole estratte. Questo controllo non equivale a una collazione parola per parola di tutti i volumi cartacei.

Il catalogo BnF identifica Perks come 1790–1850; il repertorio universitario CAT19 documenta l’edizione del 1822. È quindi una candidata di pubblico dominio per il testo della traduzione nei territori Italia/UE, escludendo apparati e revisioni moderne. Non è stata utilizzata la ristampa illustrata del 1966 come se fosse tutta priva di diritti.

Sono stati confrontati individualmente quattro passi: Meryton e Netherfield nel capitolo 7, Hunsford nel 28 e ingresso a Pemberley nel 43. Le restanti associazioni non hanno ancora un allineamento francese verificato.

Rifinitura dopo il controllo pubblico: per Pemberley viene usato il paragrafo 3 francese e spagnolo, corrispondente alla vista della dimora dall’altura nel passo inglese selezionato, non il paragrafo 1 dell’arrivo alla portineria. Hunsford è ritagliato fino alla frase che annuncia l’arrivo, come l’estratto inglese. Correzioni e passi autentici sono riproducibili con `align-translations.py` e ricontrollati nel sito; non sono cambiati luoghi, identità o categorie.

Varianti rilevanti: Perks chiama Jane «Hélen»; nel capitolo 7 manda le due sorelle dalla zia anziché presso la moglie di un ufficiale; nel capitolo 28 introduce un lato destro dove l’inglese dice soltanto che il parco costeggia il percorso da un lato. Conservare le parole autentiche, ma non trasferire queste varianti nelle prove geografiche dell’originale.

Ricerca alternativa registrata: versione anonima del 1822 e Leconte–Pressoir 1932. Non scelte al posto del testimone Perks; non completata la verifica di integrità e diritti di ciascuna alternativa. La prima versione francese del 1813 non va assunta integrale.

## Spagnolo

Acquisiti tutti i **61 capitoli** della trascrizione Wikisource di *Orgullo y prejuicio*, traduzione di **José J. de Urríes y Azara**, Calpe, Madrid, **1924**, edizione in due tomi. Inizio e conclusione strutturali controllati; 118.799 parole estratte. Il record istituzionale della Biblioteca Virtual Miguel de Cervantes conferma tomo II, editore, anno e traduttore morto nel 1932. Lo studio di Cinthia García Soria e la documentazione del Ministero della Cultura spagnolo confermano la storia editoriale. Nessuna conclusione d’integrità diplomatica basata sul solo numero dei capitoli.

Testo della traduzione candidato al riuso in Italia/UE; verificare separatamente le condizioni del testimone digitale, gli apparati e gli eventuali territori aggiuntivi. Non trasferire a una revisione moderna il regime della versione del 1924.

Confrontati individualmente gli stessi quattro passi scelti in francese. Le altre citazioni spagnole restano da allineare. Le forme Juana, Isabel e Carlota sono conservate come autentiche varianti dei nomi. «Abadía» nel capitolo 28 rende liberamente *parsonage*: non è prova dell’esistenza di un’abbazia a Hunsford.

## Italiano

La ricerca di versioni storiche riutilizzabili precede ogni valutazione di passi protetti:

- Giulio Caprin, prima versione del 1932, morto nel 1958 secondo Treccani: non considerata automaticamente di pubblico dominio in Italia nel 2026.
- Itala Castellini e Natalia Rosi, Tariffi, Roma, 1945: edizione censita da JASIT e testo presente su Wikisource. Acquisite anche le schede delle traduttrici: riportano soltanto floruit XX secolo e le categorie di dati anagrafici mancanti. Non forniscono quindi la prova necessaria del termine dei diritti delle due coautrici della traduzione. Licenza generale del sito e disponibilità del testo non risolvono questa lacuna.
- Giuseppe Ierolli: reperita una versione moderna accessibile, ma non individuata nelle pagine consultate una licenza di riuso sufficiente per il progetto. Nessuna autorizzazione richiesta o presunta.

Non si conclude che una traduzione italiana di pubblico dominio sia inesistente. La ricerca ha identificato candidati e documentato i limiti della verifica. Fino a risoluzione usare, nell’eventuale atlante, il passo inglese autentico pubblicabile con attribuzione: non una traduzione redazionale attribuita a un traduttore.

## Citazioni e proporzione

Gli otto passi FR/ES in `aligned-translations.json` sono esempi individualmente allineati, **non copertura tradotta di tutto il romanzo**. Per ciascuno sono registrati testo autentico, lingua, traduttore, edizione, capitolo, posizione nella trascrizione, fonte, impronta e termini da evidenziare.

Il dossier conserva anche i paragrafi inglesi interi per la verifica privata della scena: non costituiscono una selezione editoriale pronta alla pubblicazione. I riscontri selezionati per le 407 associazioni totalizzano circa 32.923 parole contando le ripetizioni. Occorre ridurli e controllarli nel loro insieme prima di servirli al lettore: molte menzioni possono essere provate con una sola proposizione, mentre lettere e ricordi richiedono il contesto sufficiente a dimostrare la scena. Il pubblico dominio del testo di Austen non giustifica attribuzioni editoriali inesatte né sostituisce la valutazione editoriale di necessità e proporzione. Nessun passo italiano protetto è stato preparato per il riuso; non è stata dichiarata applicabile in blocco l’eccezione dell’art. 70.

## Fonti

Gli URL dei testi restano in questa documentazione di analisi, esclusi dalle future schede, fonti visibili, popup e CSV del sito.

- Corpus inglese letto: https://raw.githubusercontent.com/GITenberg/Pride-and-Prejudice_1342/master/1342.txt
- Secondo testimone: https://raw.githubusercontent.com/GITenberg/Pride-and-Prejudice_42671/master/42671-h/42671-h.htm
- Record della scansione Chapman: https://archive.org/metadata/novelstextbasedo02austuoft
- Francese: https://fr.wikisource.org/wiki/Orgueil_et_Pr%C3%A9vention/Texte_entier
- BnF, Perks e ristampa: https://catalogue.bnf.fr/ark:/12148/cb32909660w
- CAT19: https://cat19.ee.ulb.be/fr/catalogue/1822/orgueil-et-prevention
- Studio sulle prime traduzioni francesi: https://www.mdpi.com/2076-0787/11/4/77
- Spagnolo: https://es.wikisource.org/wiki/Orgullo_y_prejuicio
- BVMC, tomo II e dati del traduttore: https://data.cervantesvirtual.com/manifestation/1376206
- García Soria: https://jasna.org/publications-2/persuasions-online/volume-44-no-1/garcia-soria/
- Versione italiana 1945: https://it.wikisource.org/wiki/Orgoglio_e_pregiudizio_(1945)
- Schede delle traduttrici: https://it.wikisource.org/wiki/Autore:Itala_Castellini ; https://it.wikisource.org/wiki/Autore:Natalia_Rosi
- JASIT: https://www.jasit.it/wordpress/wp-content/uploads/2016/01/Annuario-JASIT-2015.pdf
- Caprin: https://www.treccani.it/enciclopedia/giulio-caprin/
- Ierolli: https://www.jausten.it/jarcpap.html
