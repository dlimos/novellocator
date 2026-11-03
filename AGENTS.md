# Istruzioni del progetto

Le regole valgono per tutti i romanzi presenti e futuri, per le quattro lingue e anche per i dati letti dal database. Consultare le istruzioni pertinenti al lavoro prima di modificare, verificare o pubblicare; se un compito riguarda più ambiti, leggere tutti i file interessati. Una modifica circoscritta non richiede di ripetere analisi già verificate fuori dal suo ambito. Conservare le lacune e non dichiarare completate verifiche non svolte.

## Istruzioni per argomento

- `instructions/atlante.md`: badge, elenchi, marker, numerazione, navigazione e inquadratura dell’atlante, incluse le vedute.
- `instructions/citazioni.md`: passaggi, lingue, evidenziazioni, attribuzioni, diritti e collegamenti ai testi. Consultare anche per modifiche a schede, popup, esportazioni e dati che contengono citazioni.
- `instructions/analisi-opere.md`: analisi integrale, classificazione narrativa, luoghi geografici, modelli reali, coordinate e fonti. Consultare per aggiungere opere o modificare associazioni e rappresentazioni dei luoghi.
- `instructions/scenari.md`: navigazione, ricostruzione e valutazione delle vedute immaginarie.
- `instructions/catalogo.md`: quadri, crediti, descrizioni e introduzioni narrative delle sezioni.
- `instructions/temi.md`: palette, filigrane, CSS e presentazioni nel database.

## Pubblicazione GitHub

- Pubblicare sempre le modifiche completate e verificate, senza fermarsi alla copia locale e senza chiedere una nuova conferma di pubblicazione. Per contenuti, temi e presentazioni letti da Supabase, aggiornare anche il database e verificare il risultato pubblico; il solo push Git non basta. Se un impedimento tecnico o di autorizzazione blocca la pubblicazione, dichiararlo esplicitamente e non presentare la modifica come pubblicata.
- Pubblicare sempre sul branch `docs`, mai su `main`. Il sito usa i file della cartella `docs/` nel branch `docs`.
- Per la pubblicazione usare `git push origin docs`; non creare o ripristinare il branch `main`.
