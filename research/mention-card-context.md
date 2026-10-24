# Contesto delle schede delle menzioni

La rappresentazione `citations` usa ora la descrizione specifica `scene`, oppure il campo storico `text`, con lo stesso trattamento del `placeText` dei luoghi `mentioned`. Il database può fornire `scene_text` anche per le associazioni `cited`: l'adattatore lo recupera senza modificare categoria, citazione o identità del luogo.

La descrizione viene conservata nelle schede, nei popup, nei raggruppamenti di navigazione, nelle vedute e nel CSV. Se manca, il motore non genera una spiegazione narrativa e non aggiunge il precedente messaggio standard né un paragrafo vuoto. Il riscontro testuale continua a essere mostrato con le regole delle citazioni.

Questa modifica riguarda il motore e gli adattatori. Non aggiunge analisi editoriali, non completa descrizioni assenti e non modifica righe in Supabase. Le revisioni editoriali delle descrizioni restano un lavoro distinto.

Verifica: `node tests/check-mention-context.cjs`, incluso in `npm test`; prove della versione preparata per Git anche con i controlli di vista globale, vedute illustrate e CSV. Le modifiche parallele nella copia di lavoro sono conservate e non incluse nella pubblicazione di questa correzione.
