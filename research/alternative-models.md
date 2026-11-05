# Modelli alternativi dei luoghi — 5 novembre 2026

Una sola identità narrativa conserva citazione, categoria, numero e voce nell'elenco. `alternativeModels` nei metadati della descrizione contiene i candidati reali: nome e varianti nelle quattro lingue, coordinate, descrizioni localizzate, fonte del rapporto e fonte geografica. Il database conserva il campo senza modifiche di schema.

Le stelle condividono la numerazione del luogo e i colori della categoria. La selezione di un candidato mostra la scheda comune e consente di inquadrare il singolo edificio; la selezione del luogo e il comando di inquadratura includono tutti i candidati. Il CSV mantiene una riga per associazione, usa `multipoint` e riporta i candidati in un campo JSON, lasciando vuote le coordinate singole.

Applicazione circoscritta al primo libro di Guerra e pace: modello contestato dei Rostov alla tenuta Sollogub; caserme della Guardia a cavallo come menzione geografica vicina alla casa di Anatole; due modelli proposti per Bezuchov (Apraksin-Buturlin e Tutolmin). Fonti dell'associazione e coordinate restano distinte nei dati. La selezione di due ipotesi non costituisce inventario esaustivo di tutte le proposte critiche.

La citazione di Bezuchov è verificata nella parte I, capitolo XXI del testo russo su Wikisource; quella delle caserme nella parte I, capitolo VI. Per questi due passi resta disponibile il ripiego sull'originale russo: la copertura delle traduzioni non è completa. I Rostov conservano l'originale e le versioni italiana e francese già documentate. Non si dichiara una revisione integrale del romanzo.

Verifiche: test funzionale nelle quattro lingue per marker, conteggio, selezione dei candidati, inquadratura e CSV; test transazionale PostgreSQL/PGlite con vincoli e riesecuzione; API pubblica Supabase con tre associazioni nuove e due candidati per Bezuchov. I test generali preesistenti richiedono l'allineamento del censimento alle aggiunte e alle altre modifiche in corso nella cartella.
