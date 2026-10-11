# Delitto e castigo

Testo russo completo: sei parti di 7, 7, 6, 6, 5 e 8 capitoli, più due capitoli d'epilogo; nessun prologo. Il corpus acquisito comprende tutte le 41 sezioni (oltre 900.000 caratteri). `analysis.json` registra ogni sezione, fonte, impronta SHA-256, metodo, risultato e ambientazioni senza coordinate.

## Fonti e integrità

- [Vikiteka, trascrizione russa da Lib.ru](https://ru.wikisource.org/wiki/Преступление_и_наказание_(Достоевский)): fonte diretta delle citazioni, conservata integralmente in `work/crime-and-punishment/sections.json`, con gli HTML dei singoli capitoli. L'edizione cartacea alla base della trascrizione non è dichiarata; non attribuiamo queste citazioni all'edizione Nauka.
- [PSS, volume 6, Nauka, Leningrado 1973](https://imwerden.de/pdf/dostoevsky_pss_tom06_1973_text.pdf): scansione critica completa, romanzo alle pp. 5–422, conservata localmente. Controllati indice, sequenza delle parti e conclusione; l'OCR della scansione contiene errori e non sostituisce la trascrizione citata. Non è stata effettuata una collazione diplomatica di ogni parola tra le due edizioni.
- [Sarah J. Young, introduzione e note Oxford, 2017, UCL](https://discovery.ucl.ac.uk/id/eprint/10028919/3/Young_OUP_C%26P_Editorial_material.pdf): riscontro critico per abbreviazioni, luoghi e modelli storici.
- [Museo Dostoevskij, Sennaja e dintorni](https://www.md.spb.ru/kalendar_sobytij/Sennaya_ploschad_i_ee_okrestnosti_v_proizvedeniyah_FDostoevskogo_i_VsKrestovskogo_1023/): contesto istituzionale della città narrativa.

## Analisi e coordinate

Ogni paragrafo dell'intero corpus è stato sottoposto a ricerca di nomi, abbreviazioni e lessico delle ambientazioni. Sono stati riesaminati i contesti dei toponimi e delle scene sezione per sezione. Questo è un censimento dell'intero testo con revisione contestuale, non una dichiarazione di collazione filologica o di assenza definitiva di ogni possibile riferimento implicito.

322 associazioni documentate: 136 con coordinate e 186 senza coordinate. Ogni associazione ha una citazione letterale russa della propria sezione. I test confrontano ogni citazione col corpus acquisito e controllano le impronte di tutte le sezioni. Traduzioni editoriali in inglese, italiano, francese e spagnolo; il russo non viene sostituito dalle traduzioni.

Le coordinate ArcGIS sono documentate separatamente dalle prove testuali e dai commenti critici. Scartati gli omonimi fuori Pietroburgo. I punti di aree e strade sono rappresentativi, non posizioni precise dei personaggi. Nessuna coordinata inventata per soffitta, appartamento dell'usuraia, stanza di Sonja, ufficio di polizia, albergo Adrianopoli o carcere. L'identificazione di S—m con Stol'jarnyj è un modello critico e non una soluzione indiscussa; gli interni restano non localizzati. Nuova Gerusalemme è distinta da Gerusalemme; Adrianopoli non viene associata alla città di Edirne; i sogni e i riferimenti retorici non vengono presentati come viaggi reali.

## Presentazione e pubblicazione

Anteprima: Nikolaj Jarošenko, *Prospettiva Nevskij di notte*, 1875, opera in pubblico dominio. Collegamento: atmosfera urbana di Pietroburgo e menzione del Nevskij nel romanzo (II, VI). Crediti e condizioni di riutilizzo nella sorgente locale `docs/images/CREDITS.md` e nel record `book_presentations`.

CSS locale: `docs/themes/crime-and-punishment.css`; catalogo e traduzioni nelle sorgenti locali ignorate da Git. Il pacchetto SQL in `database/generated/crime-and-punishment/sql-editor` importa solo questo libro. Il blocco 07 importa la presentazione e rende pubblico il libro; non pubblicare prima di completare tutti i blocchi e verificarne i conteggi. Il sito usa esclusivamente il database, quindi i soli file locali non rendono visibile il romanzo.

Pubblicato e verificato l'11 ottobre 2026: importazione autenticata in Supabase, CSS e scheda nel database, copertina sul branch `docs`. Il confronto integrale tramite API anonima conferma che dati e dizionari pubblici corrispondono alle sorgenti locali (tolleranza 1e-12 per l'arrotondamento PostgreSQL delle coordinate). Controllati sul sito pubblico il caricamento della mappa, la leggibilità del tema, i 41 pulsanti di sezione e le citazioni dell'ultimo capitolo.
