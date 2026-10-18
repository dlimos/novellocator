# Macondo nei venti capitoli

Revisione del 18 ottobre 2026. La precedente associazione geografica usava soltanto la pagina 2, derivata dall'inventario a campione: questo faceva scomparire il paese dai capitoli successivi. La categoria è `action` in tutte le venti sezioni, sulla base di scene effettivamente ambientate nel paese o nella casa dei Buendía, non della frequenza del toponimo.

## Fonte e metodo

Testo spagnolo completo fornito dal lettore, PDF di 334 pagine; narrazione alle pagine 2–333. Autore Gabriel García Márquez, titolo *Cien años de soledad*. La copia non identifica editore, anno dell'edizione o traduttore (il testo è originale spagnolo). Il riferimento pubblico dichiara questa lacuna anziché inventare dati bibliografici. SHA256 della copia: `427bb700740533f93c313bf32170e1dd2f83d8681409510b2035a9ffacbe9b25`.

Nuova estrazione di tutte le pagine e confronto delle venti sezioni con l'estrazione precedente: coincidenza integrale. Censimento dei riferimenti geografici sull'intero corpus e verifica contestuale, per ciascuna sezione, delle scene nel paese, della loro apertura e della conclusione. I risultati, gli intervalli di pagina, gli hash delle sezioni, i passi e le motivazioni sono in `macondo-chapter-review.json`. Il testo integrale e i contesti estesi restano locali e non vengono pubblicati nel repository.

La numerazione romana della copia salta V e termina con XXI: sono comunque presenti venti sezioni narrative; si conserva la numerazione editoriale 1–20 dell'atlante. Non si deduce una sezione mancante dalla sola anomalia tipografica.

Nel capitolo 18 non compare la parola «Macondo». La stanza di Melquíades, Santa Sofía, Fernanda e il ritorno di José Arcadio stabiliscono la continuità con la casa dei Buendía; la lettura di Aureliano e le successive scene domestiche costituiscono azione nel paese. La prova pubblica evidenzia il riferimento alla stanza, senza inserire nel testo un toponimo assente. Lo stesso criterio di continuità è esplicitato per le scene della casa, del cortile, della strada e della stazione negli altri capitoli.

## Confronto critico

- Sergio Ramírez, «Cien años de soledad», la historia de América, 30 novembre 1968, Biblioteca Virtual Miguel de Cervantes: https://www.cervantesvirtual.com/obra-visor/cien-anos-de-soledad-la-historia-de-america/html/12808245-9070-417e-9eae-d2de6b2be27b_2.html . La lettura critica collega fondazione, guerre, impresa bananiera e distruzione al mondo di Macondo. È contesto critico, non sostituisce i riscontri dei singoli capitoli.
- Fundación Gabo, Ruta Macondo – circuito Aracataca: https://especiales.fundaciongabo.org/ruta-macondo-circuito-aracataca/ . Fonte del modello reale; non dimostra che Aracataca sia nominata nel romanzo.
- La scheda CVC dell'opera, https://cvc.cervantes.es/actcult/garcia_marquez/obra/fichas/1967.htm , risultava reindirizzata alla manutenzione durante questa verifica: non usata come prova testuale.

## Pubblicazione e proporzione degli estratti

Venti estratti originali distinti, complessivamente 215 parole, accompagnano altrettante osservazioni critiche sull'ambientazione. Sono frammenti minimi per dimostrare la scena o il riferimento spaziale discusso; non ricostruiscono la trama né sostituiscono la lettura dell'opera. La verifica riguarda anche il rapporto con i passi preesistenti: questi estratti non autorizzano automaticamente l'intero inventario storico, che richiede la sua verifica aggregata. L'originale è protetto; non si dichiara pubblico dominio. Non vengono attribuite traduzioni redazionali a traduttori editoriali: resta disponibile l'originale spagnolo, con la tendina a lingua unica. I testi dei romanzi non vengono linkati nell'interfaccia.

La copia presenta errori testuali: per esempio «concentré» nella scena della stazione. Il passo è conservato senza correzioni silenziose e resta da collazionare con un'edizione identificata. Il riferimento di pagina è quello della copia, non una paginazione editoriale certificata.

`publish-macondo-chapters.sql` aggiorna esclusivamente pagine di associazione, categorie, passi e note di `regional-town` nel record `macondo/reading-map`. Coordinate e natura del modello Aracataca, immagini, altri luoghi e altri romanzi restano conservati. Aggiornamento idempotente verificato con PGlite; copertura delle venti sezioni verificata nelle quattro lingue anche attraverso l'adattatore dell'atlante.

## Limite della revisione

Questa verifica attraversa tutte le sezioni per l'ambientazione Macondo. Non certifica una nuova analisi completa di ogni singola associazione degli altri 47 luoghi. Il censimento integrale ha evidenziato ulteriori ricorrenze e nomi esterni rispetto alle pagine campione: Riohacha ricorre in più sezioni, Cabo de la Vela richiede distinzione fra sbarco riferito e scena narrata, Neerlandia fra armistizio narrato e richiami al trattato. Tali associazioni, le coordinate degli ulteriori luoghi e la revisione delle vedute immaginarie restano da verificare singolarmente con prove e fonti: non vengono completate per analogia né dichiarate esaustive.
