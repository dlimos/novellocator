const fs=require('node:fs'),vm=require('node:vm');
const id='anna-karenina',ctx={window:{}};
vm.runInNewContext(fs.readFileSync('docs/content/books.js','utf8'),ctx);
const book={id,title:'Anna Karenina',author:'LEO TOLSTOY',description:'Eight parts, 239 chapters: Moscow and Petersburg, country estates, railways and the places recalled or discussed by Tolstoy’s characters.',ariaLabel:'Explore Anna Karenina by Leo Tolstoy',setting:'MOSCOW / PETERSBURG / COUNTRY ESTATES / RAILWAYS',mapType:'geographic',theme:'karenina',stylesheet:'themes/anna-karenina.css',originalLanguage:'ru',cover:{src:'images/anna-karenina-kramskoy.jpg',alt:'Portrait of an Unknown Woman by Ivan Kramskoi, 1883',width:2048,height:1543,position:'center 34%',banner:{opacity:.27,mobileOpacity:.18}},credit:{artist:'Ivan Kramskoi',url:'https://www.tretyakovgallery.ru/issues/ivan-kramskoy-neizvestnaya/',title:'Portrait of an Unknown Woman',year:'1883',reproduction:'Wikimedia Commons · faithful reproduction',reproductionUrl:'https://commons.wikimedia.org/wiki/File:Kramskoy_Portrait_of_a_Woman.jpg',license:'Public domain · PD-Art',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Reuse_of_PD-Art_photographs',reuseNote:'Late nineteenth-century Petersburg society and the social scrutiny of an elegantly dressed woman connect the painting thematically with the novel. The sitter is not claimed to be Anna Karenina.'}};
const at=ctx.window.atlasCatalogue.books.findIndex(b=>b.id===id);if(at<0)ctx.window.atlasCatalogue.books.push(book);else ctx.window.atlasCatalogue.books[at]=book;
fs.writeFileSync('docs/content/books.js','window.atlasCatalogue='+JSON.stringify(ctx.window.atlasCatalogue,null,2)+';\n');
const dataCtx={window:{}};for(const suffix of ['','-i18n'])vm.runInNewContext(fs.readFileSync(`docs/data/${id}${suffix}.js`,'utf8'),dataCtx);
const d=dataCtx.window.atlasData,dict=dataCtx.window.atlasTranslations;
const entries=[
 ['Anna Karenina','Anna Karenina','Anna Karénine','Anna Karénina'],['Leo Tolstoy','Lev Tolstoj','Léon Tolstoï','León Tolstói'],['LEO TOLSTOY','LEV TOLSTOJ','LÉON TOLSTOÏ','LEÓN TOLSTÓI'],
 [book.description,'Otto parti, 239 capitoli: Mosca e Pietroburgo, tenute di campagna, ferrovie e luoghi ricordati o discussi dai personaggi di Tolstoj.','Huit parties, 239 chapitres : Moscou et Pétersbourg, domaines ruraux, chemins de fer et lieux évoqués ou discutés par les personnages de Tolstoï.','Ocho partes, 239 capítulos: Moscú y Petersburgo, fincas rurales, ferrocarriles y lugares recordados o discutidos por los personajes de Tolstói.'],
 [book.ariaLabel,'Esplora Anna Karenina di Lev Tolstoj','Explorer Anna Karénine de Léon Tolstoï','Explorar Anna Karénina de León Tolstói'],
 [book.setting,'MOSCA / PIETROBURGO / TENUTE / FERROVIE','MOSCOU / PÉTERSBOURG / DOMAINES / CHEMINS DE FER','MOSCÚ / PETERSBURGO / FINCAS / FERROCARRILES'],
 [book.cover.alt,'Ritratto di una sconosciuta di Ivan Kramskoj, 1883','Portrait d’une inconnue d’Ivan Kramskoï, 1883','Retrato de una desconocida de Iván Kramskói, 1883'],
 [d.book.description,'Otto parti: Mosca, Pietroburgo, tenute di campagna, ferrovie e viaggi europei.','Huit parties : Moscou, Pétersbourg, domaines ruraux, chemins de fer et voyages européens.','Ocho partes: Moscú, Petersburgo, fincas rurales, ferrocarriles y viajes europeos.'],
 [d.book.sidebarTitle,'Le otto parti','Les huit parties','Las ocho partes'],
 [d.book.help,'Scegli un capitolo o esplora tutti i luoghi.','Choisissez un chapitre ou explorez tous les lieux.','Elige un capítulo o explora todos los lugares.'],
 ['Scenes, recollections and geographical references in this chapter.','Scene, ricordi e riferimenti geografici di questo capitolo.','Scènes, souvenirs et références géographiques de ce chapitre.','Escenas, recuerdos y referencias geográficas de este capítulo.'],
 ['Russia and referenced places','Russia e luoghi citati','Russie et lieux évoqués','Rusia y lugares citados'],
 ['Anna, Levin and their social circles','Anna, Levin e le loro cerchie sociali','Anna, Lévine et leurs milieux sociaux','Anna, Levin y sus círculos sociales'],
 ['1870s','Anni 1870','Années 1870','Década de 1870'],
 ['Historical geography','Geografia storica','Géographie historique','Geografía histórica'],
 ['Representative geographical position','Posizione geografica rappresentativa','Position géographique indicative','Posición geográfica representativa'],
 ['ArcGIS World Geocoding; reviewed against query and regional context','Geocodifica ArcGIS verificata rispetto alla ricerca e al contesto geografico','Géocodage ArcGIS vérifié selon la recherche et le contexte régional','Geocodificación ArcGIS verificada según la búsqueda y el contexto regional'],
 ['Tolstoy · original Russian','Tolstoj · originale russo','Tolstoï · original russe','Tolstói · original ruso'],
 ['Middlebury · role of setting','Middlebury · funzione delle ambientazioni','Middlebury · rôle du cadre','Middlebury · función del escenario'],
 ['Tolstoy Museum · scholarly proceedings (2016)','Museo Tolstoj · studi (2016)','Musée Tolstoï · études (2016)','Museo Tolstói · estudios (2016)'],
 ['Oblonsky house in Moscow','Casa Oblonskij a Mosca','Maison Oblonski à Moscou','Casa de Oblonski en Moscú'],
 ['Oblonsky’s government office','Ufficio pubblico di Oblonskij','Bureau administratif d’Oblonski','Oficina administrativa de Oblonski'],
 ['Shcherbatsky house','Casa Ščerbackij','Maison Chtcherbatski','Casa de los Shcherbatski'],
 ['Koznyshev’s study','Studio di Koznyšev','Cabinet de Koznychev','Despacho de Koznishev'],
 ['Hermitage dining room','Sala del ristorante Ermitage','Salle du restaurant Ermitage','Comedor del restaurante Hermitage'],
 ['Moscow ballroom','Sala da ballo a Mosca','Salle de bal à Moscou','Salón de baile en Moscú'],
 ['Nikolai Levin’s Moscow room','Stanza di Nikolaj Levin a Mosca','Chambre de Nikolaï Lévine à Moscou','Habitación de Nikolái Levin en Moscú'],
 ['Levin’s house and estate grounds','Casa di Levin e terreni della tenuta','Maison de Lévine et terrains du domaine','Casa de Levin y terrenos de la finca'],
 ['Night train from Moscow to Petersburg','Treno notturno da Mosca a Pietroburgo','Train de nuit de Moscou à Pétersbourg','Tren nocturno de Moscú a Petersburgo'],
 ['Snowbound railway platform (Bologoye context)','Banchina innevata (contesto di Bologoe)','Quai enneigé (contexte de Bologoïe)','Andén nevado (contexto de Bologoye)'],
 ['Moscow Petersburg-railway platform','Banchina della ferrovia per Pietroburgo a Mosca','Quai moscovite du chemin de fer de Pétersbourg','Andén del ferrocarril de Petersburgo en Moscú'],
 ['Karenin house in Petersburg','Casa Karenin a Pietroburgo','Maison Karénine à Pétersbourg','Casa de Karenin en Petersburgo'],
 ['Vronsky’s Morskaya apartment','Appartamento di Vronskij sulla Morskaja','Appartement de Vronski sur la Morskaïa','Apartamento de Vronski en la Morskaya'],
 ['Kitty’s rooms in the Shcherbatsky house','Stanze di Kitty in casa Ščerbackij','Chambres de Kitty chez les Chtcherbatski','Habitaciones de Kitty en casa de los Shcherbatski'],
 ['Petersburg opera theatre','Teatro d’opera a Pietroburgo','Théâtre d’opéra à Pétersbourg','Teatro de ópera en Petersburgo'],
 ['Betsy’s Bolshaya Morskaya salon','Salotto di Betsy sulla Bol’šaja Morskaja','Salon de Betsy sur la Bolchaïa Morskaïa','Salón de Betsy en la Bolshaya Morskaya'],
 ['Anna and Vronsky’s unnamed meeting place','Luogo non nominato dell’incontro fra Anna e Vronskij','Lieu sans nom de la rencontre d’Anna et Vronski','Lugar sin nombre del encuentro de Anna y Vronski'],
 ['Woodcock hunting clearing near Levin’s estate','Radura per la caccia alle beccacce presso la tenuta di Levin','Clairière de chasse à la bécasse près du domaine de Lévine','Claro para cazar becadas cerca de la finca de Levin'],
 ['Vronsky’s regimental quarters','Alloggi reggimentali di Vronskij','Quartiers régimentaires de Vronski','Alojamiento del regimiento de Vronski'],
 ['Krasnoye Selo racecourse','Ippodromo di Krasnoe Selo','Hippodrome de Krasnoïe Selo','Hipódromo de Krásnoye Seló'],
 ['Karenin summer house at Peterhof','Dacia dei Karenin a Peterhof','Datcha des Karénine à Peterhof','Dacha de los Karenin en Peterhof'],
 ['Betsy’s summer house and croquet grounds','Dacia di Betsy e terreno del croquet','Datcha de Betsy et terrain de croquet','Dacha de Betsy y terreno de croquet'],
 ['Soden spa, gallery and lodging','Terme di Soden, galleria e alloggio','Thermes de Soden, galerie et logement','Balneario de Soden, galería y alojamiento'],
 ['Mowing grounds near Pokrovskoye','Prati da falciare presso Pokrovskoe','Prés de fauchage près de Pokrovskoïe','Prados de siega cerca de Pokróvskoye'],
 ['Dolly’s Ergushovo house and grounds','Casa di Dolly e terreni a Ergušovo','Maison et terrains de Dolly à Ergouchovo','Casa y terrenos de Dolly en Ergúshovo'],
 ['Meadows of Levin’s sister’s estate','Prati della tenuta della sorella di Levin','Prés du domaine de la sœur de Lévine','Prados de la finca de la hermana de Levin'],
 ['Garden of Anna and Vronsky’s meeting','Giardino dell’incontro fra Anna e Vronskij','Jardin de la rencontre d’Anna et Vronski','Jardín del encuentro de Anna y Vronski'],
 ['Karenin’s committee meeting room','Sala delle riunioni della commissione di Karenin','Salle de réunion de la commission de Karénine','Sala de reuniones de la comisión de Karenin'],
 ['Peasant’s farm on the Surov road','Fattoria contadina sulla strada per Surov','Ferme paysanne sur la route de Sourov','Granja campesina en el camino de Súrov'],
 ['Sviyazhsky’s estate','Tenuta di Svijažskij','Domaine de Sviajski','Finca de Sviazhski'],
 ['Petersburg lawyer’s office','Studio dell’avvocato a Pietroburgo','Cabinet de l’avocat à Pétersbourg','Despacho del abogado en Petersburgo'],
 ['Moscow hotel rooms (Dussot context)','Camere d’albergo a Mosca (contesto Dussot)','Chambres d’hôtel à Moscou (contexte Dussot)','Habitaciones de hotel en Moscú (contexto Dussot)'],
 ['Oblonsky dining and drawing rooms','Sala da pranzo e salotto degli Oblonskij','Salle à manger et salon des Oblonski','Comedor y salón de los Oblonski'],
 ['Church of Kitty and Levin’s wedding','Chiesa del matrimonio di Kitty e Levin','Église du mariage de Kitty et Lévine','Iglesia de la boda de Kitty y Levin'],
 ['Unnamed Italian city, palazzo and artist’s studio','Città italiana non nominata, palazzo e studio del pittore','Ville italienne sans nom, palais et atelier du peintre','Ciudad italiana sin nombre, palacio y estudio del pintor'],
 ['Provincial hotel where Nikolai Levin dies','Albergo di provincia in cui muore Nikolaj Levin','Hôtel provincial où meurt Nikolaï Lévine','Hotel provincial donde muere Nikolái Levin'],
 ['Lydia Ivanovna’s house and study','Casa e studio di Lidija Ivanovna','Maison et cabinet de Lydia Ivanovna','Casa y despacho de Lidia Ivánovna'],
 ['Imperial palace reception','Ricevimento nel palazzo imperiale','Réception au palais impérial','Recepción en el palacio imperial'],
 ['Anna and Vronsky’s Petersburg hotel','Albergo di Anna e Vronskij a Pietroburgo','Hôtel d’Anna et Vronski à Pétersbourg','Hotel de Anna y Vronski en Petersburgo'],
 ['Petersburg opera audience and box','Pubblico e palco dell’opera a Pietroburgo','Public et loge de l’opéra à Pétersbourg','Público y palco de la ópera en Petersburgo'],
 ['Woods of the mushroom-picking outing','Bosco della raccolta dei funghi','Bois de la cueillette des champignons','Bosque de la recogida de setas'],
 ['Marshes of the Gvozdevo hunting trip','Paludi della caccia a Gvozdevo','Marais de la chasse à Gvozdevo','Pantanos de la cacería en Gvózdevo'],
 ['Peasant hut at the hunting stop','Izba contadina della sosta di caccia','Isba paysanne de la halte de chasse','Izba campesina de la parada de caza'],
 ['Road to Vozdvizhenskoye','Strada per Vozdviženskoe','Route de Vozdvijenskoïe','Camino de Vozdvízhenskoye'],
 ['Vozdvizhenskoye house, garden and hospital','Casa, giardino e ospedale a Vozdviženskoe','Maison, jardin et hôpital à Vozdvijenskoïe','Casa, jardín y hospital en Vozdvízhenskoye'],
 ['Kashin election assembly and cathedral','Assemblea elettorale e cattedrale di Kašin','Assemblée électorale et cathédrale de Kachine','Asamblea electoral y catedral de Kashin'],
 ['Vronsky’s lodgings during the elections','Alloggio di Vronskij durante le elezioni','Logement de Vronski pendant les élections','Alojamiento de Vronski durante las elecciones'],
 ['Levin and Kitty’s Moscow lodging','Alloggio di Levin e Kitty a Mosca','Logement de Lévine et Kitty à Moscou','Alojamiento de Levin y Kitty en Moscú'],
 ['Katavasov’s Moscow drawing room','Salotto di Katavasov a Mosca','Salon de Katavassov à Moscou','Salón de Katavásov en Moscú'],
 ['Lvov family home','Casa della famiglia L’vov','Maison de la famille Lvov','Casa de la familia Lvov'],
 ['Moscow concert hall','Sala da concerto a Mosca','Salle de concert à Moscou','Sala de conciertos en Moscú'],
 ['Countess Bol’s house','Casa della contessa Bol’','Maison de la comtesse Bol','Casa de la condesa Bol'],
 ['Moscow club dining, billiard and reading rooms','Sale da pranzo, biliardo e lettura del club moscovita','Salles à manger, de billard et de lecture du club moscovite','Comedor, sala de billar y lectura del club de Moscú'],
 ['Anna and Vronsky’s Moscow rooms','Stanze di Anna e Vronskij a Mosca','Chambres d’Anna et Vronski à Moscou','Habitaciones de Anna y Vronski en Moscú'],
 ['Moscow doctor’s home and pharmacy route','Casa del medico e percorso per la farmacia a Mosca','Maison du médecin et trajet vers la pharmacie à Moscou','Casa del médico y trayecto a la farmacia en Moscú'],
 ['Anna’s final Moscow carriage route','Ultimo percorso di Anna in carrozza a Mosca','Dernier trajet d’Anna en voiture à Moscou','Último trayecto de Anna en coche por Moscú'],
 ['Train from Moscow towards Obiralovka','Treno da Mosca verso Obiralovka','Train de Moscou vers Obiralovka','Tren de Moscú hacia Obiralovka'],
 ['Obiralovka platform and railway track','Banchina e binari di Obiralovka','Quai et voie ferrée d’Obiralovka','Andén y vía de Obiralovka'],
 ['Moscow departure of the Serbian volunteers','Partenza da Mosca dei volontari per la Serbia','Départ de Moscou des volontaires pour la Serbie','Salida de Moscú de los voluntarios hacia Serbia'],
 ['Kursk railway train and provincial platforms','Treno della ferrovia di Kursk e banchine di provincia','Train de la ligne de Koursk et quais provinciaux','Tren del ferrocarril de Kursk y andenes provinciales'],
 ['Porch and balcony of Pokrovskoye','Portico e balcone di Pokrovskoe','Perron et balcon de Pokrovskoïe','Porche y balcón de Pokróvskoye'],
 ['Nursery at Levin’s estate','Stanza del bambino nella tenuta di Levin','Chambre du bébé au domaine de Lévine','Habitación del bebé en la finca de Levin'],
 ['Vronsky’s city rooms','Stanze cittadine di Vronskij','Chambres de Vronski en ville','Habitaciones urbanas de Vronski'],
 ['Betsy’s house in Anna’s social life','Casa di Betsy nella vita sociale di Anna','Maison de Betsy dans la vie sociale d’Anna','Casa de Betsy en la vida social de Anna'],
 ['Setting of Dolly’s children’s mischief','Ambientazione delle marachelle dei figli di Dolly','Cadre des bêtises des enfants de Dolly','Escenario de las travesuras de los hijos de Dolly'],
 ['Levin’s farm road and countryside','Strada agricola e campagna di Levin','Chemin agricole et campagne de Lévine','Camino agrícola y campo de Levin'],
 ['Kolok woods during the thunderstorm','Bosco Kolok durante il temporale','Bois de Kolok pendant l’orage','Bosque Kolok durante la tormenta']
];
for(const values of entries)for(const [i,l]of ['en','it','fr','es'].entries())dict[l][values[0]]=values[i];
for(const v of [18,19]){const key=`Tolstoy · critical Russian edition · volume ${v}`;for(const [l,label]of Object.entries({en:key,it:`Tolstoj · edizione critica russa · volume ${v}`,fr:`Tolstoï · édition critique russe · tome ${v}`,es:`Tolstói · edición crítica rusa · volumen ${v}`}))dict[l][key]=label;}
fs.writeFileSync(`docs/data/${id}-i18n.js`,'window.atlasTranslations='+JSON.stringify(dict,null,2)+';\n');
const marker='// anna-karenina editorial strings',end='// end anna-karenina editorial strings',tf='docs/content/book-translations.js';let tr=fs.readFileSync(tf,'utf8');if(tr.includes(marker)){const start=tr.indexOf(marker),stop=tr.indexOf(end,start);tr=tr.slice(0,start)+tr.slice(stop+end.length);}
const messages=Object.fromEntries(['en','it','fr','es'].map(l=>[l,Object.fromEntries(entries.map(v=>[v[0],v[['en','it','fr','es'].indexOf(l)]]))]));
fs.writeFileSync(tf,tr+'\n'+marker+'\n(function(){const additions='+JSON.stringify(messages)+';for(const [lang,strings]of Object.entries(additions))Object.assign(window.atlasLocaleData.messages[lang],strings);})();\n'+end+'\n');
const credits=`\n\n## Anna Karenina — Ivan Kramskoi\n\n- **Portrait of an Unknown Woman (Неизвестная)**, Ivan Kramskoi, **1883**, oil on canvas, 75.5 × 99 cm; State Tretyakov Gallery, inventory 5893.\n- Museum source: https://www.tretyakovgallery.ru/issues/ivan-kramskoy-neizvestnaya/\n- Reproduction: https://commons.wikimedia.org/wiki/File:Kramskoy_Portrait_of_a_Woman.jpg\n- Local file: \`anna-karenina-kramskoy.jpg\`, 2048 × 1543 pixels. Faithful photographic reproduction of a two-dimensional public-domain painting; artist died in 1887, painting published in 1883, Commons PD-Art / Public Domain Mark. See https://commons.wikimedia.org/wiki/Commons:Reuse_of_PD-Art_photographs .\n- Connection: late nineteenth-century Petersburg society, feminine elegance, public gaze and social judgment. This is a thematic/period connection, not a claim that the sitter depicts Anna or that the painting directly illustrates the novel.\n- Source and reuse conditions verified 12 October 2026.\n`;
const cf='docs/images/CREDITS.md';if(!fs.readFileSync(cf,'utf8').includes('## Anna Karenina — Ivan Kramskoi'))fs.appendFileSync(cf,credits);
const {prepare}=require('../../scripts/database/prepare-presentation.cjs');const row=prepare().rows.find(r=>r.book_id===id);row.artwork_documentation=credits;
const literal=value=>"E'"+String(value).replaceAll('\\','\\\\').replaceAll("'","''").replaceAll('\r','\\r').replaceAll('\n','\\n')+"'";
const keys=Object.keys(row),values=keys.map(k=>typeof row[k]==='object'?literal(JSON.stringify(row[k]))+'::jsonb':typeof row[k]==='number'||typeof row[k]==='boolean'?String(row[k]):literal(row[k]));
const sql=`insert into public.book_presentations (${keys.join(',')}) select ${values.join(',')} where exists(select 1 from public.books where id=${literal(id)}) on conflict(book_id) do update set ${keys.filter(k=>k!=='book_id').map(k=>`${k}=excluded.${k}`).join(',')},updated_at=now();`;
fs.mkdirSync(`database/generated/${id}`,{recursive:true});fs.writeFileSync(`database/generated/${id}/presentation.json`,JSON.stringify(row,null,2)+'\n');fs.writeFileSync(`database/generated/${id}/presentation.sql`,'begin;\n'+sql+`\nupdate public.books set publication_status='published' where id='${id}';\ncommit;\nselect book_id,length(css) as css_characters from public.book_presentations where book_id='${id}';\n`);
console.log('Prepared Anna Karenina catalogue, translations and presentation SQL.');
