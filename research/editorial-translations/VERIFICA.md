# Traduzioni editoriali — 24 ottobre 2026

Pubblicate in `content_translations` di Supabase 178 voci; verificata la lettura anonima pubblica con l’adattatore e il localizzatore effettivamente usati dal sito.

- **L’urlo e il furore:** tutti i 31 testi base delle scene e i 10 valori periodo/personaggi nelle cinque sezioni, in italiano, francese e spagnolo (123 voci). Il periodo dell’appendice mostra il tempo narrativo 1699–1945, senza date di scrittura/pubblicazione, anche in inglese (una voce).
- **Cime tempestose:** tradotta integralmente nelle tre lingue la variante della nota che include la precisazione sui confini moderni (tre voci, quattro schede pubbliche: Cina, Inghilterra, India e Spagna). La corrispondenza esatta della frase breve non copriva questa variante.
- **Ulisse:** normalizzati 45 valori nel dizionario italiano, includendo gli esonimi già presenti per coerenza. Tra le integrazioni: Grecia, Italia, Tamigi, Mar Rosso, Olanda, Atene, Babilonia, Americhe, Nilo, Perù e Portogallo. I toponimi senza un esonimo italiano corrente conservano la forma propria. Olanda traduce il riferimento storico `Holland`, senza cambiarne l’identità in Paesi Bassi. Le citazioni conservano il testo originale.
- **Anna Karenina e Delitto e castigo:** tradotti i due pannelli HTML di note in italiano, francese e spagnolo (sei voci), mantenendo struttura e informazioni bibliografiche.

Il confronto integrale prima/dopo conferma che i dati narrativi, le categorie, le coordinate, i riscontri originali e tutte le traduzioni delle citazioni sono invariati. La modifica riguarda soltanto i dizionari editoriali, non costituisce una nuova revisione narrativa delle opere né un audit di ogni altra stringa del sito.

## Verifiche

`node tests/check-editorial-translations.cjs` controlla i backup locali e la copertura attraverso `docs/i18n.js`. `node research/editorial-translations/acquire.cjs --after` acquisisce i dati pubblici; `node tests/check-editorial-translations.cjs --live` verifica tutte le 178 voci e l’immutabilità dei dati narrativi. Superati entrambi.

La patch SQL è transazionale e aggiorna soltanto le chiavi elencate. Verificati sintassi e riapplicazione senza duplicati con PGlite. Pubblicazione eseguita nell’editor SQL Supabase tramite browser interno; controllata anche la sezione 2 italiana di Faulkner sul sito pubblico.

`prepare.cjs` mantiene sincronizzati i dizionari locali esclusi da Git e produce `patch.json` e `publish.sql`. Gli snapshot completi prima/dopo restano locali, esclusi da Git. I file Git della consegna contengono patch, procedura, verifica e documentazione; la pubblicazione dei contenuti risiede nel database.
