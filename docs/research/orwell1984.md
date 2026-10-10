# 1984 — fonti e analisi geografica

Preparazione locale del 11 ottobre 2026. Dati in `docs/data/orwell1984.js`, traduzioni in `docs/data/orwell1984-i18n.js`, audit in `work/orwell1984/audit.json` e `tests/fixtures/orwell1984-sources.json`. Questi file restano locali secondo le regole del repository. Il corpus, gli offset delle citazioni, i digest per sezione e le risposte del geocodificatore si conservano in `work/orwell1984/`.

## Testo originale e integrità

Fonte principale: [Project Gutenberg Canada, ebook 949](https://www.gutenberg.ca/ebooks/orwellg-nineteeneightyfour/orwellg-nineteeneightyfour-00-h.html), pubblicato il 23 maggio 2012, da *Nineteen Eighty-Four*, London: Secker & Warburg; Toronto: S. J. Reginald Saunders, 1949. L’ebook dichiara la prima edizione canadese come base. Copia HTML integrale conservata e identificata da SHA-256 nell’audit. Sono presenti tre parti con 8, 10 e 6 capitoli, l’appendice *The Principles of Newspeak* e due note; non ci sono prologo o epilogo. Le note spiegano Oceania e *speakwrite*, senza introdurre ulteriori luoghi. L’appendice non viene omessa perché non narrativa.

Confronto con [Project Gutenberg Australia, ebook 0100021](https://gutenberg.net.au/ebooks01/0100021.txt), aggiornamento novembre 2008. Questo testo non identifica la stampa di base. II.10 è separato da asterischi senza intestazione: la struttura viene verificata nell’edizione canadese, dove compare `X`. Le citazioni mantengono l’ortografia canadese, compresa la variante «St. Clement’s Dane»; il nome geografico normalizzato è St Clement Danes. Non si sostituisce silenziosamente il testo canadese con quello australiano. Anche varianti o possibili refusi dell’ebook restano distinguibili dall’identificazione geografica.

Tutte le sezioni sono state elaborate integralmente, con ricerca dei toponimi e delle loro varianti e del lessico degli spazi fisici. I candidati sono stati controllati nel contesto; gli spazi impliciti, i ricordi e i sogni hanno registrazioni per sezione. La ricerca considera azione, ricordi, viaggi progettati, paragoni, resoconti, immagini di film e luoghi immaginari. Ogni associazione conservata ha una citazione inglese letterale, verificata contro la propria sezione dopo la sola normalizzazione degli spazi. L’indice può essere ampliato: non pretende di esaurire ogni possibile sinonimo o metafora.

## Copertura per sezione

I conteggi sono associazioni sezione–luogo, non luoghi distinti. Uno zero nella colonna cartografica registra esplicitamente l’assenza di punti accertati; le ambientazioni senza coordinate restano consultabili.

| Sezione | Riferimenti con coordinate | Senza coordinate |
| --- | ---: | ---: |
| I.1 | 4 | 14 |
| I.2 | 5 | 10 |
| I.3 | 5 | 9 |
| I.4 | 3 | 9 |
| I.5 | 3 | 9 |
| I.6 | 0 | 3 |
| I.7 | 5 | 6 |
| I.8 | 9 | 12 |
| II.1 | 4 | 11 |
| II.2 | 1 | 4 |
| II.3 | 2 | 7 |
| II.4 | 4 | 5 |
| II.5 | 2 | 8 |
| II.6 | 0 | 4 |
| II.7 | 0 | 6 |
| II.8 | 4 | 5 |
| II.9 | 32 | 28 |
| II.10 | 9 | 5 |
| III.1 | 0 | 6 |
| III.2 | 2 | 8 |
| III.3 | 1 | 5 |
| III.4 | 0 | 7 |
| III.5 | 1 | 2 |
| III.6 | 5 | 13 |
| Appendice | 1 | 7 |
| Totale | 102 | 203 |

58 riferimenti geografici distinti con coordinate; 305 associazioni complessive con citazioni originali. Sono comprese le citazioni di luoghi nel libro attribuito a Goldstein, i luoghi delle filastrocche e Parigi nell’esempio della Comune nell’appendice. I luoghi reali non acquisiscono automaticamente il ruolo di ambientazione dell’azione.

## Fonti critiche e divergenze

- [Gordon Bowker, *Orwell’s London*, Orwell Foundation](https://www.orwellfoundation.com/the-orwell-foundation/orwell/articles/gordon-bowker-orwells-london/): propone Senate House, Broadcasting House e 200 Oxford Street come modelli del Ministero della Verità. Questi nomi non sono nel testo del romanzo e non diventano nuove ambientazioni. Il Ministero resta senza coordinate.
- [University of London, storia di Senate House](https://www.london.ac.uk/about/history/history-senate-house): documenta l’uso bellico come Ministero dell’Informazione e il collegamento con Orwell. Un modello storico non stabilisce l’indirizzo della piramide immaginaria di trecento metri.
- [Douglas Kerr, *The Virtual Geographies of Nineteen Eighty-Four*, Cambridge Companion, 2020](https://www.cambridge.org/core/books/abs/cambridge-companion-to-nineteen-eightyfour/virtual-geographies-of-nineteen-eightyfour/209C6792B7BA27AB3331204198510170): consultato l’abstract pubblico, che distingue geografia geopolitica e spazi privati/psicologici. Il capitolo completo non era accessibile e non viene presentato come letto.
- [*Dystopian Geopolitics: 1984’s domination system*, Intelligere](https://revistas.usp.br/revistaintelligere/en/article/view/203733): rintracciato lo studio dedicato a II.9; pagina integrale non accessibile nel browser. Registrato come ricerca ulteriore, senza usarlo come prova testuale o delle coordinate.

Victory Square è associata al modello Trafalgar Square per la chiesa di St Martin-in-the-Fields, la galleria e la colonna descritte in I.8 e II.1. Il modello è esplicitamente un’inferenza: statua e nome appartengono al romanzo. «Old Bailey» nella filastrocca non viene equiparato automaticamente al tribunale moderno o a una chiesa. Il Palazzo di Giustizia resta un riferimento testuale privo di indirizzo accertato. Golden Country e la campagna degli incontri non hanno un luogo preciso dedotto dall’itinerario ferroviario.

## Coordinate e fonti indipendenti

Le schede distinguono `narrativeSource`, `positionSource` e, dove pertinente, `additionalSource`. Le coordinate provengono da riferimenti geografici già auditati nel progetto, da coordinate pubblicate dei siti londinesi oppure da risultati ArcGIS controllati. Le nuove risposte integrali si conservano in `work/orwell1984/geocoding.json`. I punti regionali sono rappresentativi; non provano indirizzi, confini del romanzo o schieramenti militari.

Risultati rifiutati: Royal Court in Southwark invece dei Law Courts; Manzhouli invece della Manciuria; attività statunitensi chiamate Rhine River; strade di Stepney invece del distretto; POI multipli di Shoreditch. Per Stepney e Shoreditch si usano coordinate pubblicate dei distretti. Per la foce del Congo si usa la coordinata pubblicata della foce, anziché un POI interno al fiume. Manciuria, Reno, Vistola, altri grandi ambiti geografici e confini mobili sono documentati senza forzare un singolo punto. Il riferimento «the Cape» non viene ristretto arbitrariamente al Capo di Buona Speranza.

Oceania, Eurasia ed Eastasia rimangono territori immaginari senza coordinate. Le notizie di guerra sono conservate come riferimenti del testo, non confermate come eventi oggettivi. Il cambio del nemico tra II.9 e III.6 non viene corretto o uniformato.

## Immagine e importazione

Copertina: Monet, *The Thames below Westminster*, circa 1871, National Gallery, NG6399. Collegamento con Londra, fonte e condizioni PD-Art documentati in [CREDITS.md](../images/CREDITS.md). Nessuna immagine generata o fotografia di un luogo è stata usata come anteprima.

Tre script di importazione in `database/generated/orwell1984/sql-editor/`, con `IMPORTA.md` e `verifica.sql`. La preparazione controlla la ricostruzione esatta dei dati e delle quattro lingue.

Importazione remota completata l’11 ottobre 2026 nel progetto Supabase `hnrpxuhctjpocyucjqqy`, eseguendo in ordine i tre blocchi con esito positivo. Stato del libro: `published`. Conteggi verificati: 1 libro, 25 sezioni, 58 luoghi, 87 fonti, 61 descrizioni, 102 riferimenti, 127 estratti, 203 ambientazioni senza coordinate e 952 traduzioni. `work/orwell1984/verify-live.cjs` ha confermato tramite l’API pubblica anonima la ricostruzione completa dei dati e dei dizionari nelle quattro lingue, identici alle copie locali (tolleranza delle coordinate: 1e-12 gradi). Prova visiva locale: `work/orwell1984/supabase-import-verified.png`. La pubblicazione dei file aggiornati del sito resta da eseguire.
