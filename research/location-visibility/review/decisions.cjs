// Editorial review of the imported geographic records, 13 October 2026.
// Each key addresses an existing unlocated record, never a search result alone.
const Z1='https://dezimmer.net/LolitaUSA/Trip1.htm';
const Z2='https://www.dezimmer.net/LolitaUSA/Trip2.htm';
const CVC='https://cvc.cervantes.es/literatura/cervantistas/congresos/cg_IV/cg_IV_58.pdf';
const DY='https://faulkner.iath.virginia.edu/media/resources/DISPLAYS/FaulknerMapsHP.html';
const region=(key,id,area,coords,zoom,source,reason)=>({key,id,area,coords,zoom,source,reason});
module.exports={
 'ulisse':{regions:[],hide:[],finding:'I modelli con identificazione incerta sono già rombi; gli indirizzi reali e le aree ricostruite hanno note di precisione. Nessuna scheda senza coordinate.'},
 'proust':{regions:[],hide:[],finding:'Combray, Tansonville e Balbec sono già rappresentati tramite modelli dichiarati e rombi; le case parigine sono riferite a strade o aree, senza indirizzi inventati.'},
 'war-and-peace':{regions:[],hide:[],finding:'Lysye Gory e Otradnoe hanno già rombi e distinguono il modello museale dall’ambientazione narrativa. Nessuna scheda senza coordinate.'},
 'moby-dick':{
  regions:[region('Rokovoko','regional-rokovoko','South Pacific',[-20,-150],3,'https://melville.electroniclibrary.org/editions/versions-of-moby-dick/12-biographical','L’edizione critica identifica il luogo come isola pacifica inventata; il testo dà soltanto ovest e sud. Punto oceanico regionale, senza identificare un’isola.')],
  hide:['Crossed Harpoons','Sword-Fish Inn','Spouter-Inn','Try Pots','Pupella','Bamboo'],
  finding:'Le locande inventate non aggiungono una posizione utile rispetto a New Bedford/Nantucket. Arsacides e Tranque restano visibili come problema geografico documentato: le fonti mescolano Cile e Salomone; non sono equiparate a un punto certo. I luoghi della perdita e del salvataggio restano senza punto esatto.'
 },
 'gatsby':{
  regions:[region('Little Girl Bay','regional-little-girl-bay','Lake Superior',[47,-88],5,'https://standardebooks.org/ebooks/f-scott-fitzgerald/the-great-gatsby/text/chapter-6','Il contesto del capitolo VI stabilisce Lake Superior, pur senza una baia univoca. Il punto rappresenta il lago; non identifica Little Girl’s Point né una riva precisa.')],
  hide:['Nick’s cottage','Buchanans’ house and Daisy’s dock','Gatsby’s mansion','Wilson’s garage and Michaelis’s restaurant','Eckleburg’s billboard','Myrtle’s apartment','Probity Trust','Gatsby’s mansion and party driveway','Nick’s cottage and Gatsby’s interiors','Castle Rackrent · literary allusion','Plaza suite','Wilson’s garage and accident site','Buchanans’ house','Gatsby’s swimming pool','Swastika Holding Company office'],
  finding:'West Egg, East Egg e Valley of Ashes hanno già aree e modelli dichiarati. Le case e le aziende inventate restano nell’analisi; gli edifici storici, i toponimi omonimi irrisolti e i viaggi geografici restano disponibili. Port Roosevelt/Gad’s Hill non vengono equiparati a un porto moderno senza prova.'
 },
 'holden':{
  regions:[region('Pencey / Agerstown / Thomsen Hill','regional-agerstown','Pennsylvania',[41,-77.5],5,'https://core-docs.s3.us-east-1.amazonaws.com/documents/asset/uploaded_file/1759/ohs/4407599/Catcher_in_the_Rye.pdf#page=7','Il capitolo I indica Agerstown, Pennsylvania. Non viene sostituita con Valley Forge o con un campus reale.')],
  related:{'Pencey / Agerstown':'regional-agerstown','Pencey Prep':'regional-agerstown','Spencer’s house · Anthony Wayne Avenue':'regional-agerstown','Spencer’s room':'regional-agerstown','Ossenburger Memorial Wing':'regional-agerstown','Dormitory washroom':'regional-agerstown','Dormitory room / parked car':'regional-agerstown','Agerstown station / train':'regional-agerstown'},
  hide:['Spencer’s house · Anthony Wayne Avenue','Spencer’s room','Ossenburger Memorial Wing','Dormitory washroom','Dormitory room / parked car','Edmont Hotel · unverified address','Lavender Room','Ernie’s interior','Imagined rye field and cliff','Antolini apartment interior'],
  finding:'Agerstown/Pencey è ora un unico riferimento regionale. Gli interni inventati non ricevono punti duplicati. Whooton/Elkton Hills e Lake Sedebego restano identificazioni irrisolte, senza sostituzioni con luoghi biografici. Il Seton/Wicker Bar conserva il problema documentato di 54th Street contro il vero hotel di 40th Street.'
 },
 'orwell1984':{regions:[],hide:[],finding:'Le 21 esclusioni precedenti restano attive. Revisione dei rimanenti romanzi: nessuna nuova modifica qui.'},
 'don-quijote':{
  regions:[
   region('nonavillage','regional-village-mancha','La Mancha',[39,-3.5],6,'https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#1_primero','Il luogo anonimo è esplicitamente nella Mancha; non viene scelto un paese reale fra le identificazioni concorrenti.'),
   region('barataria','regional-barataria','Aragon · Ebro region',[41.8,-1.1],6,CVC,'Il borgo della burla appartiene all’ambientazione aragonese. Pedrola e Alcalá de Ebro sono ipotesi critiche, non identità certe; il punto rappresenta la regione dell’Ebro.'),
   region('micomicon','regional-micomicon','Ethiopia · literary geography',[8,38],5,'https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#1_xxix','Il racconto fittizio di Dorotea colloca il regno in Etiopía. Il punto è solo un riferimento regionale alla geografia del racconto, senza un regno o un confine reale.'),
   region('candaya','regional-candaya','Cape Comorin · southern India',[8,77.5],5,'https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#2_xxxviii','La storia della Trifaldi colloca il regno presso cabo Comorín, con indicazioni fantastiche e incoerenti; riferimento all’area di Comorín, non ricostruzione delle due leghe o di confini.')
  ],
  hide:['gaula','pena-pobre','miraflores','malindrania','unnamed-island','castillo-generic','miraguarda','soliadisa','quirocia','rastria','nerbia','miulina','utrique','silverbridge','firm-island','heaven','elysium','cave-palace','clavilenosky','pancaya','archipiela','port-micoloso'],
  hidePatterns:['^hell-p[0-9]+$'],
  finding:'Conservati i siti anonimi, gli itinerari e i toponimi storici irrisolti. Esclusi i luoghi puramente fantastici senza area utile. Archipiela è il nome del re nel passo, non un luogo: il falso candidato resta nell’audit, escluso dalla vista. Gaula conserva il dibattito interpretativo nell’analisi, senza imporre Gallia o Galles.'
 },
 'crime-and-punishment':{
  regions:[],
  hide:['garret','moneylender','marmeladov','sonya','porter','painters','razumikhin','bakaleyev','new-flat','lebezyatnikov','porfiry','svidrigailov','fiancee','oasis','childhood','dream-garden','new-jerusalem'],
  finding:'Le stanze dei personaggi non hanno un indirizzo autentico distinto dalla Pietroburgo già cartografata. Restano i siti storici, i nomi mascherati provinciali e le identificazioni controverse. Omsk/prigione/Irtysh conservano il problema del modello, senza rendere esatti edifici narrativi.'
 },
 'sound-and-fury':{
  regions:[
   region('jefferson','regional-jefferson','Northern Mississippi',[34.3,-89.5],6,DY,'Digital Yoknapatawpha documenta il modello Oxford/Lafayette e distingue esplicitamente geografia reale e immaginaria. Punto nell’area del modello, senza assegnare vie o edifici di Jefferson a Oxford.'),
   region('mottson','regional-mottson','Mississippi',[33,-89.5],5,'https://faulkner.iath.virginia.edu/shanti/content/mottstownmottson','Il centro immaginario è a sud di Jefferson, in un’altra contea del Mississippi. La posizione indica lo Stato, senza inventare un centro reale o una distanza esatta.')
  ],
  related:{'house':'regional-jefferson','garden':'regional-jefferson','store':'regional-jefferson','post-jefferson':'regional-jefferson','square':'regional-jefferson','black-church':'regional-jefferson','gas-mottson':'regional-mottson','station-mottson':'regional-mottson'},
  hide:['pasture','garden','kitchen','dining','yard','gate','house','hall','carriage','square','monument','cemetery','barn','branch','patterson','parlor','cabin','nancy-ditch','funeral-tree','cellar','mother-room','bathroom','caddy-room','maury-room','swing','burgess','toy-graveyard','cedars','library','bluegum-woods','measles-room','quentin-room','hunting-woods','cemetery-knoll','barber','hotel-jefferson','creek-bridge','picnic','store','beards','school','post-jefferson','telegraph','black-cemetery','livery-jefferson','station-jefferson','rogers','printing','opera','failed-bank','bank','forks','ab-russell','sand-ditch','drugstore-jefferson','methodist','jason-room','black-neighborhood','black-church','sheriff','gas-jefferson','road-mottson','churches-south','gas-mottson','station-mottson','drugstore-mottson','st-johns','domain','law-office','library-town','jason-apartment','cinema'],
  finding:'Jefferson e Mottson hanno riferimenti regionali. Gli edifici del loro mondo immaginario non vengono moltiplicati alle coordinate di Oxford. Conservati siti reali e rurali irrisolti di Massachusetts/Boston; Arcadia, Calvary e i luoghi biblici non sono automaticamente confusi con un indirizzo terreno.'
 },
 'anna-karenina':{
  regions:[region('pokrovskoe','regional-pokrovskoe','Tula region · literary model',[54,37.5],6,'https://ypmuseum.ru/event/1283','Il museo Yasnaya Polyana documenta il confronto Pokrovskoye/Yasnaya Polyana. Riferimento regionale del modello, senza equiparare l’azienda di Levin a una casa reale o scegliere un omonimo moderno.')],
  related:{'levin-house':'regional-pokrovskoe','pokrovskoye-arrival':'regional-pokrovskoe','nursery':'regional-pokrovskoe','mowing':'regional-pokrovskoe','kalinovy':'regional-pokrovskoe','mashkin':'regional-pokrovskoe','woodcock-clearing':'regional-pokrovskoe','kolok':'regional-pokrovskoe','storm-woods':'regional-pokrovskoe','levin-road':'regional-pokrovskoe'},
  hide:['oblonsky-house','office','shcherbatsky-house','koznyshev-house','ballroom','nikolai-room','levin-house','karenin-house','vronsky-apartment','kitty-room','betsy-house','betsy-visits','anna-rendezvous','dolly-country-house','betsy-dacha','rendezvous-garden','commission','vronsky-city-room','oblonsky-dinner','lydia-house','levin-moscow-house','katavasov-house','lvov-house','countess-bol','anna-moscow-house','pokrovskoye-arrival','nursery','children-memory'],
  finding:'Pokrovskoye riceve il riferimento regionale del modello museale. Non si forza Kashin nella vera città omonima: la provincia del romanzo non è una provincia reale. Ergushovo/Vozdvizhenskoye e i piccoli toponimi restano identificazioni da approfondire; assenza di identificazione non prova che siano tutti inventati.'
 },
 'lolita':{
  regions:[
   region('Ramsdale','regional-ramsdale','New England',[43,-71.5],5,'https://journals.openedition.org/ejas/7550','Il testo I.10 stabilisce New England; la critica conferma il collegamento. Non si restringe alla congettura di Massachusetts, né a un villaggio reale.'),
   region('Widworth','regional-widworth','Massachusetts',[42.2,-71.8],6,'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=5','La firma fittizia della prefazione reca Mass. Nessuna città reale omonima viene scelta.'),
   region('Gray Star','regional-gray-star','Northwestern North America',[60,-135],3,'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=4','La prefazione reca remotest Northwest; Alaska è un progetto precedente, non una prova dell’indirizzo finale. Area nordoccidentale ampia, senza città o Stato certi.'),
   region('Beardsley','regional-beardsley','Appalachia',[40,-78],5,Z2,'Il testo II.16 reca Farewell, Appalachia. Non si trasferisce qui la geografia della sceneggiatura, che colloca il centro in Idaho.'),
   region('Parkington','regional-parkington','Northeastern United States',[42,-74],5,Z2,'La ricostruzione delle distanze lo colloca nel Nordest; la proposta dello Stato di New York resta un’interpretazione. Non è identificato con Albany.'),
   region('Briceland','regional-briceland','New England',[42,-72],5,Z1,'La ricostruzione critica della prima tratta colloca il centro nel Nordest/New England; Connecticut resta una deduzione, non l’indirizzo di un albergo reale.'),
   region('Lepingville','regional-lepingville','New England',[42.5,-71.5],5,Z1,'La prima tratta e il confronto critico permettono solo un riferimento alla regione. Nessuna identificazione certa con Concord o Cambridge.'),
   region('Pisky','regional-pisky','Midwestern United States',[40,-89],5,Z2,'Le distanze e l’area di mais, carbone e allevamenti sono confrontate criticamente; Illinois è una proposta, non un’identificazione con Decatur.'),
   region('Kasbeam','regional-kasbeam','Midwestern United States',[40,-89],5,Z2,'Centro sintetico vicino al luogo d’origine di Dolores; la critica propone Illinois. Il punto resta regionale e non identifica Chestnut.'),
   region('Wace','regional-wace','Wyoming · Continental Divide',[43,-109],5,Z2,'Il testo nomina Continental Divide e la seconda tratta orienta al Wyoming. Non si identifica la città con Lander né Magic Cave con una grotta reale.'),
   region('Soda','regional-soda','Nebraska–Wyoming travel region',[41.2,-104],4,Z2,'Il centro inventato è una tappa della tratta Nebraska/Wyoming; non è identificato con la vera Soda Springs. Il punto rappresenta un’area ampia dell’itinerario, non il punto della colazione.'),
   region('Snow','regional-snow','Colorado Rockies',[39,-106],5,'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=150','II.19 nomina Colorado Rockies fra Snow e Champion. Punto regionale senza città omonima.'),
   region('Champion','regional-champion','Colorado',[39,-106],5,'https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=153','II.20 reca Champion, Colorado. Non si identifica il centro con Glenwood Springs.'),
   region('Elphinstone','regional-elphinstone','Western Rocky Mountains',[41,-111],4,Z2,'Gli indizi rimandano all’Ovest montano; le proposte Utah/Wyoming sono incompatibili in dettaglio. Punto nell’area ampia, senza equiparazione ad Alta o Evanston.'),
   region('Coalmont','regional-coalmont','Midwestern United States',[40,-88],5,Z2,'Il nome è dichiaratamente camuffato; la critica propone il Midwest, con distanze discordanti. Non si identifica con la vera Coalmont in Indiana.')
  ],
  hide:['Eden','Hotel Mirana','Lawn Street','Haze house','Camera di Humbert nella casa Haze','Cucina della casa Haze','Sala da pranzo della casa Haze','Our Glass Lake','Camp Q','Climax','St. Algebra','Enchanted Hunters','Hazy Hills','Hunters’ Hall','Raspberry Room','Onyx','Eryx','Main Street','Lacework Cabins','Frigid Queen','Roaring Gulch','Beardsley College','Thayer Street','School Rd','Beardsley School','Walton Inn','Butler Academy','Duke’s Manor','Junior Club','Dolly’s Dell','Perilous Forest','Campus Avenue','Magic Cave','Red Rock','Chestnut Court','The Bustle','Hill Drug Store','Larkin’s Pharmacy','Mirana Motel','Champion Hotel','Terrazza dell\'albergo','Silver Spur Court','Ponderosa Lodge','Kawtagain','Larousse','Mirandola','Quelquepart Island','Ramble','Catagela','Hoaxton','Merrymay','Cane','Styx','Chestnut Lodge','Maker Hall','Pritchard Road','Toylestown','Blake','Tigermoth','San Humbertino','Grainball','Cantrip','Picture Lake','Killer Street','Hunter Road','Mother’s Club','Duk Duk Ranch','Readsburg','Jupiter','Casa degli Schiller: salotto','Woodbine','Route X','Highway Y','Rubinov','Jiffy Jeff','Lakeview Hill','Grimm Road','Pavor Manor','Insomnia Lodge','Paradise','Bagration','Barda Sea'],
  finding:'Esclusi nomi fantastici, interni, indirizzi camuffati e falsi domicili del registro che non consentono un riferimento geografico utile distinto. I toponimi reali o irrisolti (Danube, Riviera, Vaucluse, Lundy, Derby, Broadway, Menninger, Corn Palace, ecc.) restano: non sono dichiarati inventati soltanto perché non erano geocodificati. I riscontri originali e i diritti delle citazioni pubbliche già pendenti restano pendenti; questa revisione non completa l’importazione testuale.'
 }
};
module.exports.lolita.hide.push('Blankton','Poplar Shade','Willow Island');
