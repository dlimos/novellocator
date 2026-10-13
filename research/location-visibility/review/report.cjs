const fs=require('node:fs'),dir=__dirname;
const summary=JSON.parse(fs.readFileSync(dir+'/summary.json')),metadata=JSON.parse(fs.readFileSync(dir+'/metadata.json'));
const rows=[];
for(const b of summary){const audit=JSON.parse(fs.readFileSync(dir+'/'+b.id+'-audit.json'));for(const r of audit.records)rows.push([b.id,r.section,r.ordinal,r.key,r.name,r.decision,r.mappedPlaceId||'',r.source||'',r.originalEvidence,r.reason]);}
fs.writeFileSync(dir+'/decisions.csv','\ufeff'+[['book','section','ordinal','key','name','decision','mappedPlaceId','source','originalEvidence','reason'],...rows].map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n');
const table=summary.map(b=>`| ${b.title} | ${b.mappedExisting} | ${b.unlocatedRecords} | ${b.newRegionalPlaces} | ${b.hiddenRecords} | ${b.retainedRecords} |`).join('\n');
const locations=summary.filter(b=>b.newRegionalPlaces).map(b=>'### '+b.title+'\n\n'+metadata[b.id].regionalPlaces.map(r=>'- **'+r.place.name.replace(' · regional position','')+'** — '+r.place.area+'; punto '+r.place.coords.join(', ')+'; precisione regionale. '+r.place.geographicReview.reason+' [Fonte]('+r.place.narrativeSource.url+').').join('\n')).join('\n\n');
const text=`# Revisione geografica dei romanzi importati — 13 ottobre 2026

Verificati i record importati di tutti i **13 romanzi**: 756 sezioni, 1.276 schede con coordinate dei dodici atlanti geografici, 2.686 associazioni a schede senza coordinate e i 47 record di Macondo (29 posizioni nel disegno, 3 punti terrestri, 15 ambienti non collocati). L’inventario è stato confrontato con i dati pubblicati, senza sostituire i riscontri originali.

Questa verifica riguarda **collocazione geografica e visibilità dei luoghi già importati**. Non è una nuova ricerca integrale dei luoghi omessi e non certifica le citazioni o le associazioni che risultavano già pendenti. Per le schede cartografate sono state controllate le indicazioni di precisione, i modelli e le identificazioni narrative rilevanti; non è un nuovo rilievo indipendente di ogni coordinata storica. La classificazione narrativa resta separata; i nuovi riferimenti dubbi sono mentioned e solo i casi con scena verificata sono action.

## Risultato

**26 nuovi riferimenti regionali**, rappresentati con rombo: 25 negli atlanti geografici e 1 per Macondo. Le 190 associazioni grezze agli ambienti regionali diventano 170 riferimenti sezione–punto, raggruppando gli interni dello stesso luogo; il riferimento di Macondo è aggiunto alla prima sezione e alla vista globale. Non vengono creati punti separati per ogni stanza.

| Romanzo | Schede già cartografate | Associazioni senza coordinate analizzate | Nuovi rombi regionali | Associazioni escluse dalla vista | Associazioni senza coordinate conservate nella vista |
|---|---:|---:|---:|---:|---:|
${table}
| Cent’anni di solitudine | 29 posizioni illustrate + 3 terrestri | 15 luoghi non collocati, in più sezioni | 1 | 10 luoghi non collocati, in più sezioni | 5 luoghi non collocati, in più sezioni |

I conteggi degli atlanti geografici riguardano associazioni sezione–scheda, non necessariamente luoghi unici. La colonna delle esclusioni comprende le esclusioni già applicate in 1984 e le precedenti due chiavi del Suono e la furia. Le associazioni convertite in riferimenti regionali non sono comprese né nelle esclusioni né negli elenchi conservati: sono mostrate sulla mappa. Le chiavi dei record di supporto restano nell’analisi, anche quando condividono un unico punto.

## Categoria narrativa dei nuovi riferimenti regionali

Le otto associazioni nuove contrassegnate action hanno queste prove narrative; gli originali restano nei record di supporto o, per Lolita, nei riscontri collazionati privati già documentati. La posizione geografica rappresentativa non è usata come prova della scena.

| Opera e sezione | Luogo regionale | Evento e livello narrativo che motivano action |
|---|---|---|
| Don Chisciotte, II.45 | Barataria | Sancho arriva alle porte della villa e viene ricevuto: scena della narrazione principale, non progetto di governo. Il passo originale contiene l’arrivo oltre al nome della burla. |
| Anna Karenina, VIII.VI | Pokrovskoye | Koznyshev e Katavasov raggiungono il portico; Kitty riconosce il cognato e scende a riceverlo. È un arrivo narrato alla casa, non una notizia sulla residenza di Levin. |
| L’urlo e il furore, 7 aprile 1928 | Jefferson | Benjy ricorda Caddy che lo conduce correndo verso la casa e su per i gradini: scena del ricordo ai Compson, collegati al contesto regionale dalla fonte critica. Non si identifica la casa con un edificio di Oxford. |
| L’urlo e il furore, 6 aprile 1928 | Jefferson | Jason va all’ufficio postale, prende la posta e torna al negozio: movimento e arrivo effettivamente narrati. Viene privilegiato questo riscontro rispetto alla sola frase ipotetica sull’abbandono del lavoro. |
| L’urlo e il furore, 8 aprile 1928 | Jefferson | Il narratore mostra i personaggi davanti alla casa dei Compson e sviluppa le scene cittadine della domenica. Il livello è la narrazione principale; i singoli interni non sono trasformati in indirizzi reali. |
| L’urlo e il furore, 8 aprile 1928 | Mottson | Jason arriva alla stazione e cammina lungo i vagoni dello spettacolo. Questo passo della visita è distinto dalla notizia dello sceriffo che lo spettacolo è a Mottson: la sola notizia non avrebbe giustificato action. |
| Lolita, I.10 | Ramsdale | McCoo incontra Humbert nell’albergo e gli comunica l’incendio. Scena collazionata nel ricordo autobiografico di Humbert; citazione pubblica ancora pendente. |
| Lolita, II.34 | Parkington | Humbert parla direttamente con il benzinaio, nella città esplicitamente nominata. Scena collazionata, senza identificazione di una città reale; citazione pubblica ancora pendente. |

Negli altri nuovi riferimenti resta mentioned, comprese notizie biografiche, destinazioni, riepiloghi e casi non ancora risolti individualmente. In particolare, la firma Widworth della prefazione e la notizia della morte a Gray Star non sono scene ambientate lì. Il riferimento regionale di Macondo documenta il villaggio descritto nell’apertura e il suo contesto critico, senza trasformare una descrizione geografica in una nuova scena action.

## Luoghi convertiti in riferimenti regionali

${locations}

### Cent’anni di solitudine

**Macondo** — area caraibica colombiana dei modelli letterari, fra cui Aracataca; punto rappresentativo 10.5, -74, senza equiparazione alla città reale. La [Fundación Gabo](https://www.fundaciongabo.org/es/beca-gabo/2017/recursos/cronica-de-la-beca-gabo-en-aracataca) documenta gli ambienti di Aracataca che hanno ispirato l’universo macondiano. Il nuovo estratto è una porzione di 12 parole del riscontro originale già archiviato per la prima aldea, con Macondo esplicitamente nominata; non aggiunge una traduzione editoriale. Finalità: distinguere il contesto regionale terrestre dalla collocazione interpretativa del disegno. La porzione non ricostruisce la trama, non identifica un paese reale con Macondo e non trasforma le 29 coordinate del disegno in latitudine/longitudine.

Le stanze non posizionate nella mappa illustrata sono escluse dall’elenco, conservando la casa rappresentata e tutti i riscontri. I cinque paesaggi o luoghi narrativi irrisolti (villaggio dei fondatori, sierra, mare, paludi e Neerlandia) restano disponibili, senza itinerari o indirizzi inventati.

## Esclusioni e casi conservati

${summary.map(b=>'### '+b.title+'\n\n'+b.finding).join('\n\n')}

In **Lolita** sono escluse dalla vista **85 chiavi** (136 associazioni), mentre **15 centri** (86 associazioni) hanno riferimenti regionali. Restano 119 associazioni a riferimenti reali, geografici ampi o irrisolti: un nome non geocodificato non viene dichiarato immaginario. Alcuni esempi sono Danube, Riviera, Vaucluse, Broadway, Menninger e Corn Palace. Le citazioni pubbliche e le verifiche individuali già pendenti restano pendenti; i due casi regionali con azione originale già collazionata, Ramsdale I.10 e Parkington II.34, conservano action, mentre gli altri nuovi casi rimangono mentioned in assenza di riscontro narrativo risolutivo. Non è certificata la completezza dell’importazione testuale di Lolita.

L’elenco per ogni associazione è in [decisions.csv](decisions.csv). Le chiavi delle esclusioni e le motivazioni regionali sono in [decisions.cjs](decisions.cjs) e [metadata.json](metadata.json). I testi originali e gli snapshot integrali rimangono nei backup locali, esclusi da Git; non sono duplicati nel rapporto. Le esportazioni CSV del sito conservano anche i record di analisi esclusi dalla vista.

## Pubblicazione e controlli

La revisione è conservata nel database nei metadati geographicReview dei libri e della mappa illustrata; il motore ne applica una copia alla vista, mantenendo inalterate le tabelle dei testi, citazioni, associazioni e luoghi originali. Le posizioni regionali sono distinte dalle coordinate originali e non sostituiscono modelli o indirizzi esistenti. Le nuove note della vista sono disponibili nelle quattro lingue.

La query [publish.sql](publish.sql) applica soltanto la revisione, le traduzioni delle nuove note e il riferimento regionale di Macondo. Verificati idempotenza, conservazione degli altri metadati, entrambe le strutture array/batch della mappa, quattro lingue, riferimenti narrativi espliciti, assenza di punti duplicati per sezione e tutti i controlli npm test. Il confronto remoto è registrato in [publication-verification.json](publication-verification.json).
`;
fs.writeFileSync(dir+'/RAPPORTO.md',text);
console.log('Report and 2686 association decisions written.');
