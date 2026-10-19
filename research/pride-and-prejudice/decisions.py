"""Editorial decisions made after reading the complete chapters, not regex classifications.

Paragraph offsets refer to the acquired Gutenberg 1342 transcription (2015).
Each tuple: identity, category, paragraph, literal highlight, rationale, narrative level.
"""
REVIEWS={}
def ch(n,intro,records,notes=''):
    REVIEWS[n]=dict(introductionIt=intro,records=records,notes=notes)
def a(pid,p,term,reason,level='primary'):
    return (pid,'action',p,term,reason,level)
def m(pid,p,term,reason,level='reference'):
    return (pid,'mentioned',p,term,reason,level)

ch(1,'La notizia dell’arrivo di un ricco scapolo accende i progetti matrimoniali della signora Bennet, accolti dal marito con ironia.',[
 a('longbourn',2,'my dear Mr. Bennet','Dialogo domestico dei coniugi Bennet; l’identità della casa è stabilita dalla continuità iniziale e dalla visita di ritorno del capitolo 3. Il nome non compare nel passo.'),
 m('netherfield',9,'Netherfield','Affitto, visita e futuro trasferimento di Bingley sono notizie di Mrs Long riferite dalla signora Bennet, senza scena nella tenuta.'),
 m('north-england',9,'north of England','Origine geografica riferita di Bingley, senza località o confini più precisi.')])
ch(2,'Il signor Bennet rivela di aver già fatto visita a Bingley, trasformando l’irritazione della famiglia in entusiasmo.',[
 a('longbourn',23,'left the room','Il padre esce dalla stanza dopo aver annunciato la visita; ragazze, genitori e conversazione serale identificano il consueto ambiente domestico.'),
 m('netherfield',0,'waited on Mr. Bingley','Visita al nuovo vicino riassunta all’inizio, non scena narrata nella casa di Bingley; identificazione indiretta dal capitolo precedente.')])
ch(3,'Al ballo Bingley conquista le simpatie del vicinato, mentre la freddezza di Darcy ferisce Elizabeth.',[
 a('longbourn',14,'Longbourn','La famiglia torna a casa e trova il padre ancora sveglio; segue la scena del resoconto della madre.'),
 a('meryton',6,'Mr. Darcy had been standing','Scena del ballo: Elizabeth ascolta il rifiuto di Darcy. Il nome del luogo è confermato dal capitolo 4, che identifica questa assemblea come quella di Meryton.'),
 m('netherfield',1,'Netherfield','Residenza matrimoniale desiderata per una figlia; non vi si svolge il ballo di questo capitolo.'),
 m('hertfordshire',3,'Hertfordshire','Contea dell’arrivo di Bingley, in un riepilogo degli spostamenti.'),
 m('london',3,'London','Viaggio e composizione della comitiva riferiti, senza una scena londinese.'),
 m('pemberley',4,'large estate in Derbyshire','Patrimonio di Darcy ricordato come informazione sul rango; la tenuta è identificata indirettamente dai riferimenti successivi.'),
 m('derbyshire',4,'Derbyshire','Contea della proprietà di Darcy, riferimento patrimoniale.')])
ch(4,'Jane ed Elizabeth confrontano le prime impressioni su Bingley e sulle sue sorelle; il narratore presenta il contrasto fra Bingley e Darcy.',[
 a('longbourn',0,'Jane and Elizabeth were alone','Conversazione privata delle sorelle dopo il ritorno a casa del capitolo 3; nessun nuovo trasferimento è narrato.'),
 m('netherfield',12,'Netherfield House','La scelta e l’affitto della casa sono narrati in forma di riepilogo biografico, senza una scena sviluppata.'),
 m('meryton',14,'Meryton assembly','Giudizi retrospettivi sull’assemblea; non nuovo ballo ambientato a Meryton.'),
 m('london',10,'in town','Educazione delle sorelle nella capitale, riferimento biografico indiretto.'),
 m('north-england',10,'north of England','Origine familiare delle Bingley; non una scena.')])
ch(5,'I Lucas e i Bennet discutono del ballo e dell’orgoglio di Darcy, che Elizabeth distingue dalla propria vanità ferita.',[
 a('longbourn',2,'Longbourn','Visita mattutina delle sorelle Lucas ai Bennet, con conversazione narrata.'),
 a('meryton',6,'Meryton assemblies','Charlotte riporta una scena dialogata fra Robinson e Bingley ascoltata durante il ballo: luogo dell’azione a livello del ricordo raccontato.', 'recounted-scene'),
 m('lucas-lodge',0,'Lucas Lodge','Residenza e trasferimento della famiglia Lucas presentati in forma biografica.'),
 m('st-jamess',0,"St. James's",'Presentazione a corte riferita come precedente biografico di Sir William.'),
 m('netherfield',11,'Netherfield','Domanda che Mrs Long avrebbe rivolto a Darcy sul soggiorno: la tenuta è oggetto del discorso, non ambientazione del ricordo.')])
ch(6,'Charlotte ed Elizabeth discutono di amore e matrimonio; durante una serata dai Lucas, Darcy comincia a interessarsi a Elizabeth.',[
 a('lucas-lodge',12,"Sir William Lucas's",'La festa è esplicitamente ambientata presso Sir William; seguono conversazioni, musica e l’invito a danzare.'),
 m('longbourn',0,'Longbourn','Visite reciproche riassunte. Il primo dialogo fra Elizabeth e Charlotte non ha una collocazione domestica sufficientemente certa.'),
 m('netherfield',0,'Netherfield','Visita riferita senza scena sviluppata.'),
 m('meryton',17,'Meryton','Ballo chiesto a Forster e ballo precedente ricordato; nessuna nuova scena a Meryton.'),
 m('st-jamess',29,"St. James's",'Domanda sulle abitudini di danza a corte; Darcy nega di danzarvi.'),
 m('london',35,'London','Progetto passato di trasferirsi nella capitale, non realizzato.'),
 m('pemberley',52,'Pemberley','Caroline immagina ironicamente una futura convivenza con la signora Bennet.')],
 'Non localizzare arbitrariamente il dialogo iniziale tra Charlotte ed Elizabeth. Scotch and Irish airs sono qualificazioni musicali, non ambientazioni né riferimenti geografici sviluppati.')
ch(7,'Jane si ammala durante la visita a Netherfield; Elizabeth attraversa a piedi la campagna per raggiungerla.',[
 a('longbourn',29,'her mother attended her to the door','Partenza di Jane dalla casa dei Bennet e reazioni della famiglia al maltempo, seguite dalla lettura della lettera a colazione.'),
 a('meryton',43,'Meryton','Le sorelle si separano nel paese; Elizabeth prosegue a piedi attraverso campi e ostacoli.'),
 a('netherfield',47,'Netherfield','Dopo la visita a Jane e all’arrivo del farmacista, Elizabeth accetta di fermarsi nella tenuta.'),
 m('london',6,'London','Destinazione prevista del capitano Carter; anche residenza commerciale del fratello della signora Bennet.'),
 m('lucas-lodge',11,"Sir William's",'La madre ricorda la divisa di Forster alla serata dai Lucas.')],
 'Mrs Phillips, la modista, gli alloggi militari, Clarke’s library e Miss Watson sono sottoluoghi del nucleo di Meryton. Nel passo 12 la biblioteca e la casa di Watson sono informazioni riportate, non scene; conservare nel dettaglio senza punti duplicati.')
ch(8,'A Netherfield, la cura di Jane si alterna a giudizi sprezzanti sui Bennet e a una discussione sulle qualità di una donna istruita.',[
 a('netherfield',20,'drawing-room','Continuità del soggiorno presso Jane: Elizabeth scende dalla camera della sorella al salotto dove si gioca a carte.'),
 m('meryton',14,'Meryton','Professione e residenza dello zio Phillips riferite nel discorso sul rango.'),
 m('cheapside',15,'Cheapside','Caroline situa sprezzantemente lo zio presso Cheapside; non trasferire qui la casa dei Gardiner, che il testo localizza in Gracechurch Street.'),
 m('pemberley',28,'Pemberley','La biblioteca e la tenuta di Darcy sono lodate e proposte come modello.'),
 m('derbyshire',34,'Derbyshire','Contea elogiata come possibile zona d’acquisto per Bingley.'),
 m('england',34,'England','Confronto nazionale fra contee.'),
 m('london',58,'town','Medico della capitale proposto dalle sorelle Bingley; nessuna scena.')])
ch(9,'La visita della signora Bennet a Jane mette Elizabeth in imbarazzo, mentre Lydia ottiene la promessa di un ballo.',[
 a('netherfield',0,'Netherfield','Arrivo della madre e delle sorelle dopo colazione; la visita si svolge nella camera di Jane e nel parlour.'),
 m('longbourn',25,'Longbourn','Elizabeth chiede se Charlotte abbia fatto visita a casa: visita soltanto riferita.'),
 m('london',20,'London','Confronto tra vita di città e campagna; il precedente corteggiamento di Jane è un riepilogo, non una scena.'),
 m('meryton',37,'Meryton','Ritorno futuro di Carter sperato da Lydia.'),
 m('lucas-lodge',28,'go home','Ritorno di Charlotte alla propria casa, riferito dalla madre, con identificazione indiretta.')])
ch(10,'Elizabeth osserva le attenzioni di Caroline per Darcy e lo contraddice con vivacità; la gelosia prosegue durante una passeggiata nel giardino.',[
 a('netherfield',0,'drawing-room','Serata nello stesso salotto e continuità del soggiorno; il giorno dopo passeggiata nello shrubbery della tenuta, paragrafi 54–64.'),
 m('pemberley',56,'Pemberley','Caroline progetta per scherno l’appendere i ritratti dei Phillips nella galleria di Darcy.'),
 m('longbourn',65,'home again','Elizabeth spera di rientrare presto nella casa dei Bennet, senza averla ancora raggiunta.')],
 'Italian songs e Scotch air sono categorie musicali, non visite o autonome località da cartografare.')
ch(11,'Jane torna fra gli ospiti, mentre Elizabeth e Darcy si confrontano su orgoglio, difetti e risentimento.',[
 a('netherfield',0,'drawing-room','Jane viene accompagnata dalla camera al salotto; continuità esplicita della convalescenza e della compagnia a Netherfield.')])
ch(12,'Jane ed Elizabeth lasciano Netherfield e ritrovano a casa l’irritazione della madre e le notizie delle sorelle minori.',[
 a('netherfield',4,'Netherfield','Congedo narrato dagli ospiti prima della partenza.'),
 a('longbourn',5,'welcomed home','Accoglienza dei genitori dopo il viaggio e incontri con le sorelle; casa identificata nel paragrafo precedente.')],
 'Il servizio religioso del paragrafo 4 non localizza una chiesa precisa. Il pranzo degli ufficiali dallo zio e la punizione del soldato sono notizie prive di scena e di collocazione abbastanza definita.')
ch(13,'Una lettera annuncia l’arrivo del cugino Collins, erede della proprietà; i suoi complimenti rivelano subito il carattere dell’ospite.',[
 a('longbourn',30,'dining-room','Il nuovo ospite ammira la casa e la sala da pranzo durante l’accoglienza e il pasto.'),
 m('hunsford',13,'Hunsford','Intestazione della lettera e sede della parrocchia: origine epistolare, non scena di scrittura sviluppata.'),
 m('westerham',13,'Westerham','Riferimento reale di prossimità nella datazione della lettera.'),
 m('kent',13,'Kent','Contea nell’indirizzo epistolare.')],
 'Church of England nel paragrafo 15 designa l’istituzione religiosa: non aggiungere una menzione geografica dell’Inghilterra su questa sola base.')
ch(14,'Collins esalta Lady Catherine e la sua dimora, prima di interrompere una lettura di sermoni per l’impazienza di Lydia.',[
 a('longbourn',12,'drawing-room','Concluso lo stesso pranzo del capitolo 13, i personaggi tornano nel salotto della casa Bennet per leggere.'),
 m('rosings',2,'Rosings Park','Residenza di Lady Catherine descritta e confrontata; inviti precedenti solo riepilogati.'),
 m('hunsford',2,'humble abode','La canonica di Collins è descritta per rapporto al parco; non scena nel Kent.'),
 m('meryton',13,'Meryton','Passeggiata prevista da Lydia per il giorno dopo.'),
 m('london',13,'town','Ritorno di Denny dalla capitale domandato come notizia.')])
ch(15,'A Meryton le sorelle incontrano Wickham e assistono al suo freddo saluto con Darcy, che suscita la curiosità di Elizabeth.',[
 a('longbourn',5,'his library','Collins disturba Bennet nella biblioteca; la conversazione prima di colazione avviene nella stessa casa.'),
 a('meryton',6,'Meryton','Ingresso nel paese, incontro in strada con Wickham e Darcy, quindi visita ai Phillips.'),
 m('hunsford',5,'Hunsford','Casa e giardino della canonica sono oggetto delle chiacchiere di Collins.'),
 m('london',7,'London','Provenienza del ritorno di Denny e Wickham, soltanto riferita.'),
 m('netherfield',10,'Netherfield','Il ragazzo del farmacista ha riferito che non servono più medicine per la tenuta.')],
 'Università di Collins non identificata: conservare come luogo geografico non localizzato; non scegliere Oxford o Cambridge. ----shire è designazione del reggimento, non prova di una scena in una contea identificabile.')
ch(16,'Durante una serata dai Phillips, Wickham conquista la fiducia di Elizabeth raccontandole la propria versione dei rapporti con Darcy.',[
 a('meryton',0,'Meryton','La carrozza porta i cugini alla casa dei Phillips, dove sono narrati giochi e colloquio con Wickham.'),
 a('longbourn',57,'Longbourn House','Sulla carrozza continuano le chiacchiere fino alla sosta presso casa; scena di viaggio e arrivo, non soggiorno interno.'),
 m('rosings',1,'Rosings','Collins paragona il salotto dei Phillips a una sala della dimora di Lady Catherine.'),
 m('hunsford',2,'humble abode','Collins descrive la propria abitazione e i miglioramenti, senza scena nella canonica.'),
 m('netherfield',6,'Netherfield','Distanza dalla città e soggiorno di Darcy sono domandati; il ricordo successivo del carattere di Darcy non riproduce una scena ambientata lì.'),
 m('derbyshire',7,'Derbyshire','Proprietà di Darcy come informazione patrimoniale.'),
 m('hertfordshire',13,'Hertfordshire','Giudizio sulla reputazione di Darcy nella contea.'),
 m('pemberley',35,'Pemberley','Origini, giovinezza e attività paterna riassunte da Wickham: nessuna scena sviluppata nella tenuta.'),
 m('london',41,'London','Residenza e istruzione di Georgiana riferite.')],
 'Il beneficio ecclesiastico contestato, ancora non nominato Kympton in questo capitolo, è distinto dalla canonica di Collins. Conservare l’identità provvisoria del beneficio Wickham; nessuna scena verificata in quel luogo.')
ch(17,'Jane cerca una spiegazione benevola per il conflitto fra Wickham e Darcy; l’invito al ballo riaccende le attese di tutta la famiglia.',[
 a('longbourn',8,'shrubbery','Le sorelle parlano nel giardino e vengono richiamate dall’arrivo dei Bingley in visita; continuità della casa Bennet.'),
 m('netherfield',8,'Netherfield','Ballo futuro annunciato dai visitatori.'),
 m('hunsford',13,'Hunsford Parsonage','Elizabeth si immagina come possibile moglie di Collins e padrona della canonica.'),
 m('rosings',13,'Rosings','Possibile futura partecipazione ai tavoli da gioco.'),
 m('meryton',14,'Meryton','Passeggiate impedite dalla pioggia, non compiute.')])
ch(18,'Il ballo di Netherfield delude Elizabeth: Wickham è assente, Darcy la invita a danzare e la famiglia le procura ripetuti imbarazzi.',[
 a('netherfield',0,'drawing-room at Netherfield','Ingresso nel salotto, balli, colloqui e cena sono narrati nella tenuta.'),
 m('london',70,'London','Viaggio imminente di Bingley; quello di Wickham è soltanto riferito da Denny.'),
 m('meryton',15,'Meryton','Passeggiate abituali e incontro precedente con Wickham ricordati nel dialogo durante il ballo.'),
 m('hunsford',56,'Hunsford','Sede della canonica evocata dalle parole di Collins nell’autopresentazione a Darcy.'),
 m('longbourn',70,'Longbourn','Invito a un futuro pranzo e provenienza della famiglia; la partenza non contiene una scena d’arrivo a casa.')])
ch(19,'Collins propone il matrimonio a Elizabeth e interpreta ostinatamente il suo rifiuto come un incoraggiamento.',[
 a('longbourn',0,'Longbourn','Il narratore apre esplicitamente una nuova scena a Longbourn, dopo colazione.'),
 a('rosings',8,'between our pools at quadrille','Collins ricostruisce il preciso momento in cui Lady Catherine gli ordina di sposarsi, durante il gioco, mentre Jenkinson sistema il poggiapiedi della figlia. La scena riportata è distinta da quella della proposta.', 'recounted-scene'),
 m('hunsford',8,'Hunsford','Luogo lasciato da Collins e futura destinazione della moglie; la scena di gioco appartiene alla casa di Lady Catherine, non alla canonica.'),
 m('hertfordshire',6,'Hertfordshire','Scopo del viaggio del cugino dichiarato nel discorso: cercare moglie.')])
ch(20,'La signora Bennet tenta di imporre il matrimonio, ma il padre sostiene Elizabeth; Charlotte assiste alle conseguenze del rifiuto.',[
 a('longbourn',5,'entered the library','La madre entra nella biblioteca del marito per chiedergli di intervenire; continuità esplicita dalla breakfast-room della proposta.'),
 m('york',26,'York','Paragone ipotetico sulla distanza affettiva di Elizabeth: nessun personaggio parte per York.')])
ch(21,'Wickham spiega la propria assenza dal ballo; una lettera di Caroline annuncia la partenza dei Bingley e turba Jane.',[
 a('meryton',2,'Meryton','Le sorelle incontrano Wickham entrando in paese e proseguono con lui verso la casa della zia.'),
 a('longbourn',5,'their own room','Dopo il ritorno, Jane riceve la lettera e la legge a Elizabeth nella loro camera.'),
 m('netherfield',6,'Netherfield','Abbandono della tenuta annunciato dalla lettera, non scena presso la tenuta.'),
 m('grosvenor-street',7,'Grosvenor Street','Casa degli Hurst e pranzo previsto nella capitale.'),
 m('hertfordshire',9,'Hertfordshire','Ritorno invernale negato dalle intenzioni di Caroline.'),
 m('london',10,'London','Viaggio d’affari di Bingley riferito nella lettera.')])
ch(22,'Charlotte accetta la proposta di Collins e spiega a Elizabeth il valore di una sistemazione sicura.',[
 a('lucas-lodge',0,'Lucas Lodge','Pranzo dai Lucas e successivo incontro di Collins e Charlotte nel vialetto, dopo che lei lo vede dalla finestra.'),
 a('longbourn',3,'Longbourn','Congedo serale di Collins narrato in dialogo; il giorno dopo Charlotte confida il fidanzamento a Elizabeth nella casa Bennet.'),
 m('hertfordshire',9,'Hertfordshire','Soggiorno passato e futura assenza di Collins ricordati nel congedo.'),
 m('st-jamess',2,"St. James's",'Progetto di presentazione a corte quando Collins erediterà Longbourn.'),
 m('hunsford',8,'home','Bennet consiglia ironicamente a Collins di rimanere a casa, se Lady Catherine si oppone alla nuova visita; identificazione indiretta della canonica.')])
ch(23,'Il fidanzamento di Charlotte suscita l’incredulità della signora Bennet, mentre il ritorno di Bingley si fa sempre più incerto.',[
 a('longbourn',0,'Sir William Lucas himself appeared','Annuncio di Sir William alla famiglia riunita; il capitolo prosegue le visite e i dialoghi domestici.'),
 m('hunsford',3,'Hunsford','Distanza da Londra discussa per congratularsi con Sir William.'),
 m('london',12,'London','Divertimenti della capitale temuti da Elizabeth come ostacolo al ritorno di Bingley.'),
 m('meryton',11,'Meryton','Circolazione di notizie su Bingley; nessuna scena in paese.'),
 m('netherfield',11,'Netherfield','Ritorno negato dalle voci del vicinato.'),
 m('lucas-lodge',14,'Lucas Lodge','Frequentazione quotidiana di Collins riassunta senza scena sviluppata nella casa.'),
 m('hertfordshire',10,'Hertfordshire','Ritorno di Collins segnalato come fatto, non nuova ambientazione indipendente.')])
ch(24,'Jane cerca di accettare la lontananza di Bingley; Elizabeth giudica con crescente amarezza le scelte degli amici e dei vicini.',[
 a('longbourn',3,'leaving them together','La madre lascia sole le figlie e Jane parla della delusione; continuità dell’ambiente domestico del capitolo 23.'),
 m('london',0,'London','La lettera informa che i Bingley si sono stabiliti nella capitale, anche nella casa di Darcy non meglio indirizzata.'),
 m('hertfordshire',0,'Hertfordshire','Amici che Bingley non ha salutato, informazione epistolare.'),
 m('netherfield',3,'Netherfield','Oggetto delle lamentele della madre, non scena nella tenuta.'),
 m('meryton',26,'Meryton','Ufficiali proposti per scherzo dal padre come possibili delusioni amorose.')])
ch(25,'I Gardiner arrivano per Natale e offrono a Jane un soggiorno a Londra; la zia osserva con prudenza l’intesa fra Elizabeth e Wickham.',[
 a('longbourn',3,'this very room','La madre indica la stanza della proposta mentre racconta le proprie delusioni alla cognata appena arrivata.'),
 m('london',1,'town','Soggiorni passati delle nipoti e progetto di ospitare Jane.'),
 m('netherfield',8,'his own ball','Elizabeth ricorda il ballo di Bingley come prova del suo amore; resoconto critico, non scena di ballo ricostruita.'),
 m('derbyshire',18,'Derbyshire','Provenienza di Wickham e passato di Mrs Gardiner, biografie riepilogate.'),
 m('pemberley',19,'Pemberley','Ricordo e descrizione della tenuta come argomento di conversazione.'),
 m('hertfordshire',17,'Hertfordshire','Partenza prevista dei Gardiner, nel riepilogo delle osservazioni della zia.')],
 'Inviti presso Phillips e Lucas sono riepilogati al paragrafo 17 senza singole scene: non ricavare automaticamente azione da ogni nome di una famiglia.')
ch(26,'La zia invita Elizabeth alla prudenza con Wickham; le lettere di Charlotte e Jane raccontano due esperienze molto diverse.',[
 a('longbourn',10,'went downstairs together','Congedo di Charlotte: Elizabeth l’accompagna per le scale e riceve l’invito a Hunsford; all’inizio colloquio riservato con la zia nello stesso soggiorno familiare.'),
 a('grosvenor-street',22,'My visit was not long','Nella lettera Jane ricostruisce una visita precisa a Caroline: rimprovero per il mancato avviso, domanda sul fratello e uscita imminente delle ospiti. Scena epistolare compressa, non sola notizia della residenza.', 'epistolary-scene'),
 a('gracechurch-street',25,'When she did come','Jane racconta la visita di ritorno di Caroline presso i Gardiner: scuse formali, conversazione mutata e congedo. L’indirizzo è confermato esplicitamente nel capitolo 27, non aggiunto alla citazione.', 'epistolary-scene'),
 m('london',19,'London','Arrivo di Jane annunciato nella lettera, con geografia urbana dettagliata nelle due scene distinte.'),
 m('hunsford',18,'Hunsford','Nuova casa di Charlotte descritta nella corrispondenza e destinazione dell’invito.'),
 m('rosings',18,'Rosings','Ritratto epistolare dell’ambiente di Lady Catherine, non scena nella dimora.'),
 m('kent',18,'Kent','Destinazione della coppia dopo il matrimonio, riassunta.'),
 m('hertfordshire',14,'Hertfordshire','Futura possibilità d’incontro proposta da Elizabeth.'),
 m('lucas-lodge',10,'with the Lucases','Alloggio di Collins prima delle nozze, notizia senza scena.'),
 m('netherfield',25,'Netherfield','Possibile rinuncia alla casa riportata da Caroline.')],
 'La chiesa delle nozze non è nominata né collocata con precisione: mantenerla nell’analisi, senza associare automaticamente il rito a Meryton o Longbourn. Le visite epistolari sono classificate per la singola interazione narrata, non per il soggiorno londinese in sé.')
ch(27,'Elizabeth raggiunge Jane a Londra e riceve con entusiasmo la proposta di un viaggio estivo con gli zii.',[
 a('longbourn',1,'her father','Congedo della figlia dal padre, che le chiede di scrivere; continuità con casa e preparativi del paragrafo iniziale.'),
 a('gracechurch-street',4,'Gracechurch Street','Arrivo alla porta dei Gardiner, accoglienza di Jane e dei bambini.'),
 a('london',20,'conclusion of the play','Conversazione con la zia proseguita durante uno spettacolo teatrale; teatro non identificato, distinta dalla casa dei Gardiner.'),
 m('hunsford',0,'Hunsford','Destinazione della successiva giornata di viaggio.'),
 m('meryton',0,'Meryton','Passeggiate invernali riassunte, senza scena singola.'),
 m('derbyshire',17,'Derbyshire','Origini di Wickham evocate come motivo di indulgenza dalla zia.'),
 m('hertfordshire',18,'Hertfordshire','Giudizio ironico di Elizabeth sugli amici di Darcy.'),
 m('lakes',21,'the Lakes','Destinazione soltanto progettata per l’estate; il viaggio verrà poi ridotto al Derbyshire.')],
 'Teatro e negozi londinesi privi di nome: nessuna identificazione con un edificio specifico. Il congedo con Wickham non viene attribuito a un punto autonomo.')
ch(28,'Alla canonica di Hunsford, Elizabeth osserva come Charlotte abbia organizzato la propria vita accanto a Collins e all’ombra di Rosings.',[
 a('hunsford',2,'Parsonage','Arrivo al cancello, accoglienza, visita della casa e del giardino; il giorno dopo scena della carrozza al cancello.'),
 m('rosings',3,'Rosings','La casa è osservata dal giardino della canonica; l’invito a cena riguarda il giorno successivo. Non c’è ancora una scena dentro Rosings.'),
 m('london',3,'London','Racconto delle tappe precedenti durante l’accoglienza.'),
 m('hertfordshire',9,'Hertfordshire','Notizie della contea discusse durante la serata.')])
ch(29,'La prima cena a Rosings espone Elizabeth alle domande autoritarie di Lady Catherine, alle quali risponde senza lasciarsi intimidire.',[
 a('hunsford',6,'different doors','Collins sollecita le ospiti mentre si vestono nelle camere della canonica, prima dell’uscita.'),
 a('rosings',9,'entrance-hall','Ingresso e accoglienza nella dimora dopo la passeggiata nel parco, seguiti da cena e carte.'),
 m('st-jamess',6,"St. James's",'Precedente presentazione di Sir William a corte usata come paragone.'),
 m('london',24,'London','Avversione del padre alla capitale e mancata formazione musicale stagionale.'),
 m('longbourn',15,"father's estate",'Proprietà ereditaria dei Bennet discussa da Lady Catherine, con riferimento indiretto.')])
ch(30,'Elizabeth comprende gli accorgimenti domestici di Charlotte; l’arrivo di Darcy e del colonnello Fitzwilliam interrompe la quiete del soggiorno.',[
 a('hunsford',8,'entered the room','Darcy e Fitzwilliam fanno visita alle donne nella canonica; soglia, saluto e conversazione sono narrati.'),
 m('rosings',6,'Rosings','Arrivo dei nipoti e visite abituali di Collins riferiti; il saluto presso i cancelli non dimostra da quale lato si trovi Collins e non diventa una scena autonoma dentro la tenuta.'),
 m('hertfordshire',8,'Hertfordshire','Confronto con il precedente comportamento di Darcy.'),
 m('london',10,'town','Soggiorno di Jane e incontro mancato con Darcy, domandati da Elizabeth.')],
 'La disposizione domestica della canonica è verificata: studio e sala da pranzo affacciano sulla strada, salotto delle donne sul retro. Le uscite abituali nel boschetto non sono estese automaticamente a scene in ogni capitolo.')
ch(31,'A Rosings Elizabeth suona e conversa con Fitzwilliam e Darcy, mentre Lady Catherine interviene con consigli e giudizi.',[
 a('rosings',1,"Lady Catherine's drawing-room",'Gli ospiti raggiungono la compagnia nel salotto; seguono la scena al pianoforte e gli interventi della padrona.'),
 m('hunsford',0,'Parsonage','Visite precedenti di Fitzwilliam e impressioni delle donne riepilogate.'),
 m('kent',2,'Kent','Argomento della conversazione fra Elizabeth e Fitzwilliam.'),
 m('hertfordshire',2,'Hertfordshire','Argomento della conversazione e precedente conoscenza di Darcy.'),
 m('england',5,'England','Lady Catherine paragona il proprio gusto musicale a quello degli altri inglesi.'),
 m('london',27,'London master','Maestro della capitale proposto per la formazione musicale.'),
 m('meryton',17,'at a ball','Elizabeth riferisce il numero dei balli di Darcy al primo incontro: riepilogo critico del ballo di Meryton, senza ricostruzione della scena.')])
ch(32,'Una visita di Darcy lascia Elizabeth e Charlotte perplesse sulle sue intenzioni; la conversazione mette in luce idee diverse sulla distanza da casa.',[
 a('hunsford',0,'Mr. Darcy only','Elizabeth scrive da sola nella canonica e riceve Darcy, poi raggiunto da Charlotte e Maria.'),
 m('rosings',2,'Rosings','Domanda sui residenti e successive osservazioni di Charlotte riepilogate.'),
 m('netherfield',3,'Netherfield','Partenza e possibile abbandono definitivo della casa sono oggetto della conversazione.'),
 m('london',3,'London','Salute dei Bingley dopo il soggiorno nella capitale.'),
 m('hertfordshire',19,'Hertfordshire','Attaccamento di Elizabeth alla contea e distanze familiari.'),
 m('longbourn',22,'Longbourn','Darcy domanda dell’attaccamento locale di Elizabeth alla propria casa.'),
 m('kent',24,'Kent','Domanda sul gradimento della regione in cui si svolge la visita.')])
ch(33,'Durante una passeggiata, Fitzwilliam rivela l’intervento di Darcy contro un matrimonio imprudente; Elizabeth vi riconosce la storia di Jane.',[
 a('rosings',3,'tour of the park','Fitzwilliam incontra Elizabeth nel parco e passeggia con lei verso la canonica. La conversazione porta alla rivelazione.'),
 a('hunsford',37,'Parsonage','Arrivati alla canonica, Elizabeth si chiude nella propria camera e riflette sul racconto; rifiuta poi l’invito per il mal di testa.'),
 m('kent',6,'Kent','Partenza futura di Fitzwilliam e Darcy domandata durante la passeggiata.'),
 m('london',38,'London','Attività commerciale dello zio ricordata tra i possibili motivi dell’opposizione.'),
 m('meryton',38,'country attorney','Professione dello zio Phillips evocata indirettamente come possibile ostacolo sociale.')])
ch(34,'Rimasta sola alla canonica, Elizabeth riceve la dichiarazione di Darcy e la respinge, accusandolo del dolore di Jane e dell’ingiustizia verso Wickham.',[
 a('hunsford',2,'walk into the room','Darcy entra nella stanza della canonica dove Elizabeth è rimasta dopo la partenza degli altri per Rosings; la proposta e il rifiuto sono interamente narrati qui.'),
 m('rosings',0,'Rosings','Soggiorno di Darcy prossimo alla conclusione, ricordato da Elizabeth.'),
 m('kent',1,'Kent','Partenza dei cugini dalla contea e permanenza di Elizabeth.')],
 'Il luogo della proposta è la canonica, non Rosings. I riferimenti generici alla storia di Wickham non giustificano l’importazione automatica di tutti i luoghi del capitolo 35.')
ch(35,'Darcy consegna a Elizabeth una lettera che spiega il suo intervento fra Jane e Bingley e rivela la condotta di Wickham.',[
 a('hunsford',0,'soon after breakfast','Elizabeth si sveglia e lascia la casa della canonica dopo colazione; continuità esplicita con la sera precedente.'),
 a('rosings',1,'towards the gate','Darcy esce dal boschetto del parco e consegna la lettera a Elizabeth presso il cancello. La scena riguarda il margine della tenuta, non una stanza di Rosings.'),
 a('netherfield',5,'dance at Netherfield','Nella lettera Darcy ricostruisce la scena al ballo: informazione ricevuta da Sir William mentre danza con Elizabeth e osservazione successiva di Jane e Bingley.', 'epistolary-scene'),
 a('london',6,'We accordingly went','Darcy racconta il confronto londinese con Bingley, distinguendo le obiezioni sociali e l’assicurazione decisiva dell’indifferenza di Jane; è una scena di persuasione riportata, non la sola notizia di un viaggio.', 'epistolary-scene'),
 a('ramsgate',10,'Ramsgate','La lettera narra l’arrivo inatteso di Darcy, la confessione di Georgiana e gli interventi che impediscono la fuga. Il racconto presenta eventi e interazione situati a Ramsgate.', 'epistolary-scene'),
 m('hertfordshire',5,'Hertfordshire','Primo soggiorno e successivo ritorno ostacolato da Darcy.'),
 m('pemberley',8,'Pemberley estates','Amministrazione paterna e sostegno ai Wickham in un riepilogo biografico.'),
 m('cambridge',8,'Cambridge','Studi universitari di Wickham pagati dal padre di Darcy: notizia, non scena.'),
 m('wickham-living',9,'family living','Beneficio ecclesiastico e scambi epistolari riassunti senza nome della parrocchia né scena sul posto.')],
 'La lettera datata Rosings non costituisce da sola una scena di scrittura; Rosings è action per la consegna al cancello. La casa londinese della persuasione non è indirizzata: non scegliere Grosvenor Street né la casa Darcy per deduzione.')
ch(36,'Rileggendo la lettera, Elizabeth riesamina i fatti e riconosce quanto vanità e pregiudizio abbiano influenzato il suo giudizio.',[
 a('rosings-edge-lane',11,'wandering along the lane','Elizabeth cammina per due ore lungo il vialetto esterno al parco, prosecuzione precisa dell’itinerario del capitolo 35. Distinto dall’interno di Rosings.'),
 a('hunsford',11,'entered the house','Ritorna alla canonica dopo la lettura e apprende che i due cugini sono venuti a salutarla.'),
 m('netherfield',9,'Netherfield ball','Riflessione sugli eventi del ballo, senza ripresa di una scena ambientata lì.'),
 m('pemberley',2,'Pemberley','Famiglia e rapporti dei Wickham confrontati tra le due versioni.'),
 m('hertfordshire',3,'Hertfordshire','Assenza di verifiche sulla biografia di Wickham nella società locale.'),
 m('london',3,'town','Incontro con Denny nella capitale ricordato come fatto biografico.'),
 m('meryton',4,"Mr. Phillips's",'Elizabeth ricorda criticamente la prima serata dai Phillips, senza ricostruirne qui una nuova scena.'),
 m('rosings',12,'Rosings','Provenienza dei due visitatori mancati.'),
 m('wickham-living',2,'the living','Disposizioni testamentarie e rinuncia al beneficio ecclesiastico riesaminate.')],
 'Non trasformare la riconsiderazione mentale di un fatto in azione nel luogo del fatto. Il vialetto è esterno al parco, come stabilito nel capitolo 35.')
ch(37,'Lady Catherine commenta la partenza dei nipoti e pretende di dirigere il viaggio delle ospiti, mentre Elizabeth continua a riflettere sulla lettera.',[
 a('rosings',2,'Rosings party','Conversazione a cena con Lady Catherine dopo la partenza dei nipoti.'),
 a('hunsford',18,'pack her trunk afresh','Maria, tornata alla canonica dall’ultima serata, disfa e rifà il bagaglio seguendo i consigli ricevuti; episodio specifico, non semplice residenza.'),
 m('london',9,'London','Viaggio futuro offerto da Lady Catherine.'),
 m('ramsgate',11,'Ramsgate','Precedente viaggio di Georgiana e accompagnamento dei domestici, riferiti dalla zia.'),
 m('pemberley',11,'Pemberley','Identificazione familiare e patrimoniale di Georgiana.'),
 m('bromley',13,'Bromley','Cambio dei cavalli suggerito per il ritorno; nessuna tappa compiuta narrata qui.'),
 m('bell-inn',13,'the Bell','Locanda proposta da Lady Catherine a Bromley; indirizzo storico da verificare senza geocodificare un omonimo moderno.'),
 m('meryton',15,'Meryton','Frequentazione abituale e futura delle sorelle minori, fonte di preoccupazione.'),
 m('longbourn',15,'Longbourn','Distanza percorribile a piedi e ritorno a casa atteso da Elizabeth.')])
ch(38,'Elizabeth lascia Charlotte dopo gli ultimi complimenti di Collins e raggiunge gli zii, rimandando il racconto della proposta a Jane.',[
 a('hunsford',7,'walked down the garden','Colazione e congedo narrati fino al giardino e alla portiera della carrozza.'),
 m('rosings',12,'Rosings','Maria conta le cene e i tè già trascorsi nella dimora.'),
 m('hertfordshire',5,'Hertfordshire','Destinatari geografici del resoconto favorevole chiesto da Collins.'),
 m('longbourn',7,'Longbourn','Ringraziamenti per l’ospitalità passata e futuro luogo del colloquio con Jane.'),
 m('gracechurch-street',14,"Mr. Gardiner's house",'Arrivo e soggiorno breve riassunti; in questo capitolo non è sviluppata una scena dentro la casa dei Gardiner.')])
ch(39,'Kitty e Lydia accolgono le sorelle durante il ritorno; a Longbourn si parla dei soldati, di Wickham e di un possibile soggiorno a Brighton.',[
 a('george-inn',0,'appointed inn','Le viaggiatrici incontrano le sorelle nella sala superiore della locanda e consumano il pranzo; il nome George è fornito nel resoconto al paragrafo 21. Città lasciata anonima nel testo.'),
 a('longbourn',18,'reception at home','Accoglienza dei genitori e pranzo con i Lucas al termine del ritorno.'),
 a('forster-house',16,"at Colonel Forster's",'Lydia racconta una scena precisa nella casa dei Forster: Chamberlayne travestito, arrivo degli ufficiali e scoperta dello scherzo. La casa non ha indirizzo verificato.', 'recounted-scene'),
 m('gracechurch-street',0,'Gracechurch Street','Punto di partenza indicato nel riepilogo del viaggio, senza scena domestica.'),
 m('hertfordshire',0,'Hertfordshire','Contea della città anonima dove si trova la locanda; non identificarla automaticamente con Meryton.'),
 m('meryton',3,'Meryton','Partenza del reggimento e balli abituali; la passeggiata pomeridiana viene respinta.'),
 m('brighton',5,'Brighton','Destinazione del campo militare e progetto familiare, non scena.'),
 m('liverpool',9,'Liverpool','Trasferimento di Mary King presso lo zio riferito da Lydia.')],
 'Non confondere la locanda George della città anonima con una locanda di Meryton. La localizzazione della casa Forster richiede verifica separata; conservare scena e precisione geografica su piani distinti.')
ch(40,'Elizabeth racconta a Jane la proposta e le rivelazioni su Wickham; insieme decidono di mantenere il silenzio.',[
 a('longbourn',0,'the next morning','Colloquio fra sorelle la mattina dopo il ritorno narrato nel capitolo 39; la continuità della casa è ribadita al paragrafo 25.'),
 m('meryton',22,'Meryton','Comunità che potrebbe non credere alla verità su Darcy; ragionamento sulla diffusione delle notizie.'),
 m('london',26,'London','Incontro mancato fra Jane e Bingley ricordato dalla madre.'),
 m('netherfield',26,'Netherfield','Ritorno estivo ritenuto improbabile.'),
 m('hunsford',30,'the Collinses live','Domande della madre sull’economia domestica dei Collins; casa identificata indirettamente.')],
 'Il testo dice che Elizabeth ripete il contenuto della lettera, ma non riproduce qui i singoli riscontri geografici: non estendere automaticamente tutte le associazioni del capitolo 35.')
ch(41,'Elizabeth cerca invano di impedire il viaggio di Lydia a Brighton e affronta con nuova consapevolezza l’ultimo colloquio con Wickham.',[
 a('longbourn',25,'at Longbourn','Pranzo degli ufficiali e colloquio con Wickham, dopo la scena in cui Elizabeth avverte il padre.'),
 m('meryton',0,'Meryton','Ultimi giorni del reggimento; il ritorno di Lydia con Mrs Forster alla fine è uno spostamento riferito, non una scena sviluppata in paese.'),
 m('brighton',21,'Brighton','Lydia immagina campo e flirt prima del viaggio: rappresentazione fantastica di una destinazione, non azione già accaduta.'),
 m('hunsford',25,'Hunsford','Wickham domanda del soggiorno di Elizabeth nella canonica.'),
 m('rosings',25,'Rosings','Soggiorno dei due cugini riferito nel dialogo.')],
 'Non usare l’immaginazione di Lydia per promuovere Brighton ad action. Il campo è un progetto mentale, non una scena sul posto.')
ch(42,'Il viaggio ai Laghi viene ridotto al Derbyshire; con gli zii Elizabeth si avvicina a Pemberley e accetta di visitarla.',[
 a('longbourn',9,'Longbourn','Arrivo degli zii e sistemazione dei bambini con Jane, prima della partenza del mattino seguente.'),
 a('bakewell',16,'asked the chambermaid','Nella tappa notturna Elizabeth interroga la cameriera sull’assenza di Darcy. Il capitolo 43, paragrafo 60, identifica esplicitamente Bakewell come luogo delle informazioni ottenute prima della visita. Nome assente nella citazione.'),
 m('lakes',6,'the Lakes','Meta desiderata e poi abbandonata per limiti di tempo.'),
 m('london',6,'London','Obbligo di rientro di Gardiner entro un mese, motivo della modifica del viaggio.'),
 m('derbyshire',11,'Derbyshire','Destinazione e contesto regionale del viaggio, volutamente non descritti nel dettaglio dal narratore.'),
 m('matlock',6,'Matlock','Bellezza turistica nominata; il testo non mette in scena una visita.'),
 m('chatsworth',6,'Chatsworth','Località reale nominata fra le attrazioni; non è equiparata a Pemberley.'),
 m('dovedale',6,'Dovedale','Attrazione elencata, senza scena sul posto.'),
 m('peak',6,'the Peak','Regione nominata fra le bellezze del viaggio.'),
 m('oxford',11,'Oxford','Tappa elencata nell’itinerario che il narratore rinuncia espressamente a descrivere.'),
 m('blenheim',11,'Blenheim','Tappa elencata, non scena.'),
 m('warwick',11,'Warwick','Tappa elencata, non scena.'),
 m('kenilworth',11,'Kenilworth','Tappa elencata, non scena.'),
 m('birmingham',11,'Birmingham','Tappa elencata, non scena.'),
 m('lambton',11,'Lambton','Meta del percorso e precedente residenza della zia; non è ancora raggiunta nella scena della cameriera.'),
 m('pemberley',16,'Pemberley','Domande e progetto di visita, ancora da compiere.'),
 m('meryton',5,'Meryton','Kitty torna in paese senza piangere, fatto riepilogato.'),
 m('brighton',4,'the library','Lettere di Lydia su biblioteca e campo: notizie delle uscite, senza scena verificabile.')],
 'Oxford, Blenheim, Warwick, Kenilworth e Birmingham restano mentioned: essere tappe effettive non basta a dimostrare una scena. La locanda di Bakewell non riceve nome né indirizzo inventato. Il paragrafo 5 contiene town come provenienza stagionale delle famiglie, non una nuova scena a Londra.')
ch(43,'La visita di Pemberley cambia l’immagine che Elizabeth ha di Darcy; il loro incontro inatteso rivela una cortesia nuova verso lei e gli zii.',[
 a('pemberley',2,'Pemberley House','Ingresso nel bosco, veduta della casa, attraversamento del ponte, visita interna e incontri nel parco sono narrati in dettaglio.'),
 a('lambton',75,'scene of her former pleasures','Rientro nella cittadina della giovinezza di Mrs Gardiner, indicazioni dei luoghi agli zii e visite serali ai vecchi conoscenti. L’identità Lambton è stabilita al paragrafo 62 e confermata nel capitolo 44.'),
 m('rosings',4,'Rosings','Confronto fra gli arredi delle due dimore; più avanti ricordo della consegna della lettera.'),
 m('ramsgate',25,'Ramsgate','Elizabeth ricorda mentalmente l’eccezione ai soggiorni estivi di Georgiana.'),
 m('longbourn',51,'Longbourn','Domanda di Darcy sulla data della partenza da casa.'),
 m('derbyshire',51,'Derbyshire','Domanda di Darcy sulla durata del soggiorno.'),
 m('hunsford',59,'Hunsford','Elizabeth si chiede se i propri rimproveri abbiano cambiato Darcy.'),
 m('bakewell',60,'Bakewell','Luogo dove erano state raccolte le informazioni sull’assenza di Darcy, non nuova scena a Bakewell.'),
 m('matlock',65,'Matlock','Argomento della conversazione sul prato, senza scena a Matlock.'),
 m('dovedale',65,'Dove Dale','Argomento della conversazione; variante grafica da conservare fra gli highlight.'),
 m('kent',70,'Kent','Ricordo del precedente incontro con Darcy e fonte delle informazioni sui Wickham.'),
 m('hertfordshire',74,'Hertfordshire','Opinione precedente sul carattere dei due uomini.')],
 'Veduta di Pemberley sostenuta dai paragrafi 0–4, 42–49, 54–65: accesso boscoso, rilievo, valle, casa, fiume, ponte d’accesso, ponte semplice nella gola, stalle e sentieri. Due ponti con funzioni distinte; non collocarli automaticamente nello stesso punto. Interieurs conservati come sottoluoghi, non indirizzi geografici separati.')
ch(44,'Darcy presenta Georgiana a Elizabeth nella locanda di Lambton; la cordialità degli ospiti alimenta nuove speranze e domande.',[
 a('lambton',0,'Lambton','Arrivo della carrozza visto dalla locanda, presentazione di Georgiana e visita di Bingley.'),
 m('pemberley',10,'Pemberley','Invito a cena e progetto della visita del mattino successivo; il fatto che Gardiner vi sia diretto per pescare non è una scena narrata nella tenuta.'),
 m('netherfield',7,'Netherfield','Bingley ricorda la data esatta dell’ultimo ballo insieme.'),
 m('longbourn',8,'Longbourn','Domanda di Bingley sulla presenza di tutte le sorelle a casa.'),
 m('hunsford',9,'Hunsford Parsonage','Elizabeth paragona il presente alla precedente proposta; ricordo riassuntivo, non riproduzione della scena.'),
 m('rosings',9,'Rosings','Confronto con il precedente comportamento di Darcy presso i parenti.'),
 m('hertfordshire',11,'Hertfordshire','Amici di cui Bingley vorrebbe informazioni.'),
 m('derbyshire',14,'Derbyshire','Debiti lasciati da Wickham al momento della partenza.')])
ch(45,'La visita a Georgiana si svolge sotto gli sguardi gelosi di Caroline, che riesce soltanto a far dichiarare a Darcy la propria ammirazione per Elizabeth.',[
 a('pemberley',1,'saloon','Le ospiti vengono condotte nel salone esposto a nord; sono narrati rinfresco, conversazione e attacco di Caroline.'),
 a('netherfield',16,'Netherfield','Caroline riproduce una precisa battuta pronunciata da Darcy una sera dopo il pranzo: la testimonianza mette in scena un episodio precedente nella tenuta.', 'recounted-scene'),
 m('london',2,'London','Residenza abituale di Mrs Annesley con Georgiana.'),
 m('meryton',8,'Meryton','Allontanamento della milizia, domanda usata per provocare Elizabeth.'),
 m('hertfordshire',16,'Hertfordshire','Cornice del primo giudizio di Darcy su Elizabeth.')],
 'Spanish chestnuts è una denominazione botanica: non costituisce una menzione della Spagna. Salone a nord, finestre a terra, prato intermedio e colline boscose sostengono una possibile veduta distinta del retro di Pemberley.')
ch(46,'Le lettere di Jane annunciano la fuga di Lydia; Elizabeth confida la disgrazia a Darcy e interrompe il viaggio con gli zii.',[
 a('lambton',0,'Lambton','Ricezione delle lettere nella locanda, visita di Darcy, arrivo degli zii e preparativi della partenza.'),
 a('longbourn',4,'Longbourn','Jane racconta l’arrivo di Forster e la comunicazione delle sue paure alla famiglia; seguono reazioni e colloquio con lei. Scena contenuta nella lettera.', 'epistolary-scene'),
 m('scotland',2,'Scotland','Destinazione inizialmente supposta e poi messa in dubbio, non itinerario verificato.'),
 m('brighton',4,'Brighton','Partenza dei fuggitivi e del colonnello riferita.'),
 m('gretna-green',4,'Gretna Green','Meta dichiarata da Lydia, poi smentita dalle indagini.'),
 m('clapham',4,'Clapham','Cambio di vettura ricostruito nel resoconto delle indagini; nel dubbio resta tappa riferita, non scena autonoma sviluppata.'),
 m('epsom',4,'Epsom','Provenienza della chaise, dato dell’itinerario riferito.'),
 m('london',15,'London','Destinazione delle ricerche e possibile rifugio; nessuna scena nella capitale in questo capitolo.'),
 m('hertfordshire',4,'Hertfordshire','Territorio percorso da Forster durante le ricerche, riepilogato.'),
 m('barnet',4,'Barnet','Locande interrogate senza esito, resoconto delle ricerche.'),
 m('hatfield',4,'Hatfield','Locande interrogate senza esito, resoconto delle ricerche.'),
 m('pemberley',19,'Pemberley','Cena annullata per l’urgenza del ritorno.'),
 m('derbyshire',22,'Derbyshire','Elizabeth ripensa agli incontri con Darcy durante il soggiorno.')],
 'La prima lettera riferisce sabato notte; Elizabeth nel dialogo dice Sunday night. Conservare la discrepanza fra le voci senza correggere il testo originale né ricavare una cronologia univoca inventata.')
ch(47,'Durante il ritorno gli zii discutono le speranze di ritrovare Lydia; a Longbourn Elizabeth incontra una famiglia sconvolta e ascolta Jane.',[
 a('return-journey',0,'as they drove from the town','Conversazione narrata nella carrozza in uscita da Lambton e durante il ritorno; nessuna strada esatta o locanda notturna identificabile.'),
 a('longbourn',22,'vestibule','Elizabeth scende dalla carrozza, corre da Jane e poi raggiunge la madre; seguono colloqui in salotto e a tavola.'),
 m('lambton',0,'the town','Partenza dalla cittadina del soggiorno; il dialogo in carrozza è conservato come scena di viaggio, senza attribuirlo a una strada precisa.'),
 m('scotland',3,'Scotland','Possibile destinazione ancora discussa, non viaggio confermato.'),
 m('barnet',5,'Barnet road','Mancanza di tracce dei fuggitivi lungo la strada.'),
 m('london',6,'London','Possibile nascondiglio e sede delle ricerche del padre.'),
 m('meryton',54,'Meryton','Debiti di Wickham e precedente presenza del reggimento.'),
 m('pemberley',13,'Pemberley','Le false affermazioni di Wickham sulla famiglia sono oggetto del discorso.'),
 m('kent',15,'Kent','Luogo del precedente chiarimento ricevuto da Elizabeth.'),
 m('brighton',35,'Brighton','Soggiorno familiare mancato rimpianto dalla madre e vicende della fuga riferite.'),
 m('gracechurch-street',37,'Gracechurch Street','Gardiner propone di riunirsi a Bennet nella propria casa.'),
 m('gretna-green',61,'Gretna Green','Destinazione dichiarata nella lettera di Lydia, non raggiunta.'),
 m('epsom',72,'Epsom','Tappa di cambio cavalli e progetto di ricerche paterne.'),
 m('clapham',72,'Clapham','Progetto di indagine sul numero della carrozza.')],
 'La lettera di Lydia non è una scena a Gretna Green. La notte sulla strada è un pernottamento non localizzato, non una locanda cui assegnare coordinate. Gli scambi con Denny sono raccontati senza sede abbastanza precisa per una nuova associazione geografica.')
ch(48,'Le ricerche proseguono senza risultati e arrivano nuove notizie sui debiti di Wickham; il ritorno del padre porta amare riflessioni.',[
 a('longbourn',19,'joined them at tea','Scena del tè con Bennet rientrato dalle ricerche e ammonimenti a Kitty; prima lettura della lettera di Collins.'),
 m('hertfordshire',2,'Hertfordshire','Permanenza della zia e dei bambini, indicazione geografica di soggiorno.'),
 m('meryton',3,'Meryton','Voci su debiti e seduzioni, riferite con riserva dal narratore.'),
 m('scotland',3,'Scotland','Viaggio non confermato, ancora sperato da Jane.'),
 m('gracechurch-street',4,'Gracechurch Street','Gardiner riferisce di aver convinto Bennet a trasferirsi da lui; nessuna interazione londinese sufficientemente sviluppata come scena.'),
 m('epsom',4,'Epsom','Visita di ricerca di Bennet riassunta nella lettera.'),
 m('clapham',4,'Clapham','Ricerche senza esito riepilogate.'),
 m('london',22,'London','Ricerche, alberghi, dimora supposta dei fuggitivi; nessuna scena specifica in città.'),
 m('brighton',12,'Brighton','Debiti di gioco e destinazione vietata a Kitty.'),
 m('eastbourne',31,'Eastbourne','Bennet usa la vicinanza a Brighton come motivo di un divieto ipotetico.'),
 m('derbyshire',16,'Derbyshire','Identificazione di Darcy nel pensiero della zia.'),
 m('pemberley',16,'Pemberley','Lettera attesa ma non ricevuta da Elizabeth.'),
 m('hunsford',10,'Mrs. Collins and myself','Lettera di Collins e Charlotte, identificazione indiretta della loro residenza; la comunicazione a Lady Catherine non ha sede testuale sufficiente per un’altra scena.')])
ch(49,'Una lettera annuncia che Lydia e Wickham sono stati ritrovati e potranno sposarsi; il sollievo della famiglia nasconde il timore del prezzo pagato.',[
 a('longbourn',5,'ran across the lawn','Le sorelle cercano il padre attraversando casa e prato, leggono la lettera presso il boschetto e portano poi la notizia alla madre.'),
 m('gracechurch-street',13,'Gracechurch Street','Intestazione della lettera e casa destinata a ospitare Lydia prima del matrimonio; non una scena di scrittura rappresentata.'),
 m('london',15,'London','Ritrovamento riferito senza dettagli; non classificare la sola notizia come scena.'),
 m('meryton',54,'Meryton','Visita programmata dalla madre per divulgare la notizia.'),
 m('lucas-lodge',54,'Lady Lucas','Sosta prevista presso Lady Lucas nel giro di visite, senza scena compiuta.')])
ch(50,'Bennet riflette sulla propria imprevidenza e accetta gli accordi per Lydia; Elizabeth teme che il legame con Wickham abbia allontanato Darcy per sempre.',[
 a('longbourn',8,'at Longbourn','Discussione a tavola fra i genitori sull’accoglienza degli sposi e sul denaro da concedere.'),
 m('great-britain',0,'Great Britain','Giudizio nazionale sul valore morale di Wickham, non scena.'),
 m('meryton',5,'Meryton','Diffusione delle notizie e maldicenze, poi lista dei creditori nella lettera.'),
 m('haye-park',7,'Haye Park','Casa proposta dalla madre come residenza dei futuri sposi; progetto non attuato.'),
 m('stoke-house',7,'Stoke','Grande casa proposta, senza identificazione con uno Stoke reale.'),
 m('ashworth',7,'Ashworth','Residenza respinta perché lontana dieci miglia; non scegliere un omonimo reale.'),
 m('pulvis-lodge',7,'Pulvis Lodge','Casa respinta per gli attici, senza scena.'),
 m('derbyshire',12,'Derbyshire','Luogo degli incontri e dei sentimenti di Darcy ricordato da Elizabeth.'),
 m('north-england',19,'the North','Futuro acquartieramento di Wickham, non ancora una località precisa in questa sezione.'),
 m('brighton',19,'Brighton','Creditori da rassicurare, non scena.'),
 m('hertfordshire',21,'Hertfordshire','Regione desiderata dalla madre per la residenza di Lydia.'),
 m('south-england',19,'the South','Regione da lasciare dopo il matrimonio; confini non precisati.')],
 'Le case del paragrafo 7 appartengono al discorso sul vicinato e richiedono controllo della collocazione regionale, senza punti inventati. L’espressione come upon the town al paragrafo 5 è idiomatica: non è un viaggio a Londra.')
ch(51,'Lydia torna a casa orgogliosa del matrimonio e lascia sfuggire la presenza di Darcy alle nozze, spingendo Elizabeth a chiedere spiegazioni alla zia.',[
 a('longbourn',2,'ran into the room','Arrivo degli sposi, saluti, pranzo, racconti e successiva lettera di Elizabeth alla zia nella casa Bennet.'),
 a('gracechurch-street',24,'carriage came to the door','Lydia ricostruisce la mattina delle nozze nella casa degli zii: colazione, ritardo dello zio, paura e partenza. Identificazione della casa stabilita nei capitoli 49 e 52.', 'recounted-scene'),
 m('st-clements',23,"St. Clement's",'Il matrimonio è attestato come fatto e parrocchia di Wickham; la narrazione sviluppata riguarda i preparativi a casa, non una scena del rito dentro la chiesa.'),
 m('brighton',10,'Brighton','Lydia lo propone come luogo dove trovare marito; nessuna scena balneare.'),
 m('newcastle',12,'Newcastle','Residenza futura per l’inverno e invito ai parenti.'),
 m('london',24,'London','Soggiorno di Lydia e limitazioni alle uscite ricordati.'),
 m('little-theatre',24,'Little Theatre','Teatro che Lydia avrebbe voluto frequentare ma non ha visitato; identificazione storica da verificare.'),
 m('lucas-lodge',9,'the Lucases','Vicini che Lydia desidera incontrare, non visita specifica narrata.'),
 m('meryton',9,'Mrs. Phillips','Lydia desidera rivedere la zia; le visite successive sono riassunte senza individuare una scena precisa.')],
 'Il punto di incontro della carrozza è omesso (----) e non viene automaticamente identificato con la città o la locanda del capitolo 39. Mr Stone non riceve un indirizzo; il suo incontro con Gardiner è riferito.')
ch(52,'La lettera della zia rivela come Darcy abbia ritrovato Lydia e finanziato il matrimonio; Elizabeth affronta Wickham con una nuova sicurezza.',[
 a('longbourn',0,'little copse','Elizabeth legge la lettera seduta su una panchina nel boschetto, incontra Wickham e torna con lui alla porta di casa.'),
 a('gracechurch-street',10,'our visitor was very obstinate','La zia ricostruisce gli incontri di Darcy con Gardiner e la disputa su chi debba sostenere le spese. Indirizzo epistolare e paragrafo 8 identificano la casa; non semplice notizia della visita.', 'epistolary-scene'),
 a('london-lodgings',5,'He saw Wickham','Darcy interroga Wickham e insiste per incontrare Lydia, che rifiuta di lasciare l’amante. Scena londinese in una strada deliberatamente omessa; nessun indirizzo inventato.', 'epistolary-scene'),
 m('edward-street',5,'Edward-street','Ricerche e ripetuti contatti con Mrs Younge riepilogati, con ipotesi della zia sul pagamento. Nel dubbio restano mentioned; la scena successiva con Lydia avviene in un’altra strada, omessa.'),
 m('london',13,'London','Spostamenti e ritorno per le nozze riferiti; la scena specifica negli alloggi è conservata separatamente come ambientazione urbana senza indirizzo.'),
 m('derbyshire',4,'Derbyshire','Partenza di Darcy per le ricerche riferita dalla zia.'),
 m('pemberley',13,'Pemberley','Ritorno di Darcy dagli amici riferito; futuro giro nel parco immaginato dalla zia.'),
 m('hertfordshire',14,'Hertfordshire','Precedente conoscenza di Wickham confrontata con il presente.'),
 m('meryton',26,'Meryton','Uscita in carrozza della madre e di Lydia annunciata, non scena in paese.'),
 m('newcastle',28,'Newcastle','Viaggio futuro di Wickham e ipotetica deviazione per Pemberley.'),
 m('lambton',35,'Lambton','Domanda sull’incontro già avvenuto fra Elizabeth e Darcy.'),
 m('kympton',41,'Kympton','Beneficio ecclesiastico desiderato da Wickham; il passaggio per il paese non è ricordato da Elizabeth.'),
 m('kent',45,'Kent','Precedente soggiorno e informazioni ricevute da Darcy, domandate da Wickham.'),
 m('st-clements',15,'attended the wedding','Presenza di Darcy alle nozze riferita dalla zia, non una scena del rito; identità della chiesa dal capitolo 51.')],
 'Edward Street e la strada anonima degli alloggi dei fuggitivi sono luoghi diversi. Non usare l’indirizzo di Mrs Younge come rifugio della coppia: il testo dice espressamente che non poté accoglierla. Il beneficio finora anonimo è ora nominato Kympton; unificare l’identità delle menzioni, senza identificarlo con un Kimpton reale.')
ch(53,'Dopo la partenza degli sposi, il ritorno di Bingley riaccende le speranze della famiglia; la presenza di Darcy rende Elizabeth inquieta.',[
 a('longbourn',38,"gentlemen's appearing",'Congedo degli sposi, notizie dei vicini e successivo arrivo di Bingley e Darcy nella casa Bennet.'),
 a('meryton',14,'Meryton','Mrs Phillips racconta l’incontro in strada con Mrs Nicholls e la domanda sui preparativi del ritorno di Bingley; scambio specifico, non sola voce di paese.', 'recounted-scene'),
 m('newcastle',50,'Newcastle','Acquartieramento e trasferimento degli sposi riferiti dalla madre.'),
 m('netherfield',12,'Netherfield','Preparativi della governante e arrivo di Bingley riferiti come notizie; nessuna scena nella tenuta.'),
 m('derbyshire',17,'Derbyshire','Ricordo dell’incontro di Elizabeth con Bingley.'),
 m('hertfordshire',29,'Hertfordshire','Arrivo dei visitatori nella contea come riferimento temporale e regionale.'),
 m('pemberley',39,'Pemberley','Confronto con il comportamento di Darcy durante il soggiorno precedente.'),
 m('london',57,'town','Promessa passata di un pranzo dopo il ritorno dalla capitale.')])
ch(54,'Durante il pranzo a Longbourn Jane e Bingley si riavvicinano, mentre Elizabeth fatica a trovare un’occasione per parlare con Darcy.',[
 a('longbourn',11,'Longbourn','Il pranzo è esplicitamente ambientato a casa; poi tè, caffè e carte nel salotto.'),
 m('london',3,'town','Elizabeth ripensa al comportamento di Darcy presso gli zii nella capitale.'),
 m('pemberley',21,'Pemberley','Residenza attuale di Georgiana domandata a Darcy.'),
 m('scarborough',24,'Scarborough','Destinazione degli altri ospiti, riferita da Darcy.'),
 m('netherfield',28,'Netherfield','Futura sistemazione di Jane immaginata da Mrs Long.'),
 m('lucas-lodge',28,"the Lucases'",'Confronto con la zuppa servita dai Lucas la settimana prima; pranzo ricordato, non scena ricostruita.')],
 'French cooks è qualificazione professionale dei cuochi, senza un autonomo riferimento alla Francia da cartografare.')
ch(55,'Le visite di Bingley culminano nel fidanzamento con Jane, accolto con gioia e ironia affettuosa dalla famiglia.',[
 a('longbourn',20,'drawing-room','Elizabeth apre la porta e trova Jane e Bingley presso il camino dopo la proposta; seguono le congratulazioni e il consenso paterno.'),
 m('london',0,'London','Partenza di Darcy riferita, non scena nella capitale.'),
 m('hertfordshire',38,'Hertfordshire','La madre ricorda l’arrivo di Bingley l’anno precedente.'),
 m('netherfield',40,'Netherfield','Biblioteca e balli futuri richiesti da Mary e Kitty.'),
 m('meryton',52,'Meryton','Diffusione del fidanzamento attraverso Mrs Phillips; nessuna conversazione specifica in paese rappresentata.')],
 'La battuta di caccia del paragrafo 19 non ha una localizzazione più precisa della proprietà e del vicinato di Bennet: conservarla come sottoscena, senza inventare un percorso o un sito autonomo.')
ch(56,'Lady Catherine tenta di ottenere da Elizabeth la promessa di non sposare Darcy; il confronto nel boschetto si conclude con un rifiuto fermo.',[
 a('longbourn',21,'entered the copse','Arrivo e breve visita interna, poi confronto nel boschetto raggiunto lungo il gravel walk; ritorno alla carrozza e alla casa.'),
 m('rosings',9,'Rosings','Dimensioni del parco usate come termine di paragone dalla madre.'),
 m('lucas-lodge',9,"Sir William Lucas's",'Il parco di Sir William è un altro termine di paragone, non luogo della visita.'),
 m('hunsford',12,'Mr. and Mrs. Collins','Notizia sulla salute dei Collins e loro incontro con Lady Catherine, senza sede rappresentata.'),
 m('pemberley',60,'Pemberley','Boschi della tenuta invocati da Lady Catherine come simbolo del lignaggio e della minaccia del matrimonio.'),
 m('meryton',73,'Meryton','Passaggio ipotizzato dalla signora Bennet per spiegare la visita; non itinerario attestato.')],
 'Veduta Longbourn: piccolo parco, wilderness su un lato del prato, sentiero ghiaioso e boschetto; sala con finestre esposte a ovest (paragrafo 10). Hermitage nominato come attrazione da mostrare, non descritto: forma architettonica da non inventare come dato certo.')
ch(57,'Elizabeth teme l’effetto dell’intervento di Lady Catherine; una lettera di Collins trasforma il sospetto del fidanzamento in uno scherzo doloroso del padre.',[
 a('longbourn',9,'fire place','Bennet incontra Elizabeth sulle scale e la conduce nella biblioteca a leggere la lettera di Collins.'),
 m('rosings',0,'Rosings','Origine del viaggio della zia e destinataria delle voci di fidanzamento.'),
 m('lucas-lodge',0,'Lucas Lodge','Vicini da cui Elizabeth suppone siano partite le voci; congettura, non scena.'),
 m('london',2,'town','Possibile tappa di Lady Catherine per vedere il nipote.'),
 m('netherfield',2,'Netherfield','Ritorno promesso di Darcy che Elizabeth teme possa essere annullato.'),
 m('hunsford',12,'Mr. Collins','Provenienza della lettera del cugino identificata dalla sua residenza; non scena di scrittura né colloquio con Lady Catherine localizzato con certezza.')])
ch(58,'Durante una lunga passeggiata Elizabeth ringrazia Darcy e gli rivela il mutamento dei propri sentimenti; entrambi ripensano agli errori passati.',[
 a('longbourn',0,'Longbourn','Arrivo dei due amici, proposta della passeggiata e ritorno finale nella hall.'),
 a('longbourn-walk',8,'without knowing in what direction','Dopo il passaggio presso i Lucas, la conversazione e l’accettazione proseguono per diverse miglia senza direzione osservata; scena nel territorio del vicinato, senza tracciato ricostruibile.'),
 m('lucas-lodge',1,'the Lucases','Meta iniziale di Kitty, che lascia il gruppo per Maria; nessuna scena nella casa.'),
 a('london',8,'return through London','Darcy ricostruisce l’incontro con la zia nella capitale e il suo tentativo di convincerlo, che ottiene l’effetto opposto. Scena riferita con discorso indiretto e reazione del destinatario.', 'recounted-scene'),
 m('pemberley',28,'Pemberley','Incontro precedente e ragioni del cambiamento di Darcy riesaminati nel dialogo.'),
 m('derbyshire',32,'Derbyshire','Decisione di inseguire i fuggitivi dopo gli incontri nel Derbyshire.'),
 m('lambton',32,'the inn','La locanda in cui Darcy ha deciso di intervenire è ricordata; identificazione indiretta dai capitoli 44–46.'),
 m('hunsford',13,'had you behaved in a more gentlemanlike manner','Battuta pronunciata alla prima proposta ripetuta per spiegare il cambiamento: citazione di una scena passata, senza nuova ricostruzione spaziale.')],
 'La confessione di Darcy a Bingley prima del viaggio a Londra è una scena raccontata (paragrafi 39–44), ma il luogo non è esplicitato nella sezione: conservarla come sottoscena non localizzata, senza assegnarla automaticamente a Netherfield. Il dialogo londinese con la zia è invece localizzato dal paragrafo 8.')
ch(59,'Elizabeth confida il fidanzamento a Jane e ottiene il consenso dei genitori, vincendo i dubbi del padre e l’incredulità iniziale della madre.',[
 a('longbourn',28,'library','Darcy va da Bennet; Elizabeth viene poi chiamata nella biblioteca, spiega il proprio amore e più tardi informa la madre nella dressing-room.'),
 a('oakham-walk',26,'During their walk','La passeggiata proposta verso Oakham Mount è effettivamente compiuta e contiene il colloquio sull’assenso dei genitori. Non si afferma che la conversazione avvenga già sulla cima.'),
 m('oakham-mount',23,'Oakham Mount','Meta e panorama proposti; non c’è una scena descritta sulla sommità.'),
 m('pemberley',15,'Pemberley','Elizabeth data scherzosamente l’inizio dell’amore dalla vista del parco.'),
 m('lambton',17,'Lambton','Jane rimprovera il silenzio sugli incontri durante il viaggio.'),
 m('london',43,'town','Casa londinese di Darcy elencata dalla madre fra i vantaggi del matrimonio.')])
ch(60,'Elizabeth e Darcy scherzano sulle origini del loro amore e annunciano il fidanzamento; le reazioni dei parenti anticipano la nuova vita insieme.',[
 a('longbourn',14,'Longbourn','Conversazione fra i fidanzati nel contesto della casa, indicata da here al paragrafo 6; subito dopo scrivono le lettere ai parenti.'),
 m('netherfield',5,'Netherfield','Cura di Jane ricordata da Darcy e motivi del successivo ritorno nella tenuta.'),
 m('lakes',20,'the Lakes','Viaggio abbandonato di cui Elizabeth ora ringrazia la zia.'),
 m('pemberley',20,'Pemberley','Invito futuro di Natale e giri nel parco progettati.'),
 m('lucas-lodge',27,'Lucas Lodge','Rifugio dei Collins dalla rabbia di Lady Catherine, annunciato come trasferimento; i successivi incontri non hanno una sede precisata che autorizzi action nella casa.'),
 m('st-jamess',27,"St. James's",'Sir William spera in futuri incontri a corte, non una visita compiuta.')],
 'Il rimando a Caroline che osservava Darcy scrivere non è una nuova scena a Netherfield. La sala o il giardino esatti del dialogo presente non sono determinati: non inventare un sottoluogo.')
ch(61,'Il narratore segue la nuova vita delle sorelle e dei loro parenti, fra affetti duraturi, piccoli cambiamenti e ostinazioni che sopravvivono ai matrimoni.',[
 m('pemberley',1,'Pemberley','Visite del padre e dei parenti, casa di Georgiana e riconciliazione con la zia: epilogo in forma di riepilogo, senza singola scena situata.'),
 m('netherfield',2,'Netherfield','Primo anno del matrimonio di Jane e successivo trasferimento, notizie biografiche.'),
 m('meryton',2,'Meryton','Parenti da cui i Bingley desiderano allontanarsi.'),
 m('derbyshire',2,'Derbyshire','Contea vicina alla nuova proprietà di Bingley e ricordo finale del viaggio.'),
 m('bingley-new-estate',2,'a neighbouring county','Nuova tenuta in una contea confinante con il Derbyshire e a meno di trenta miglia da Elizabeth. Non scegliere una contea né disegnare un raggio come confine documentato.'),
 m('longbourn',4,'remained at home','Mary rimane con i genitori; notizia di residenza, non scena domestica.'),
 m('london',10,'London','Soggiorni di svago di Wickham riferiti.'),
 m('bath',10,'Bath','Alternativa londinese per gli svaghi di Wickham, semplice notizia.')],
 'Nessun action assegnato a questo capitolo: il finale riassume abitudini, visite e conseguenze. Non trasformare ogni residenza futura in scena. La richiesta di un place at court è un impiego e non dimostra un luogo di visita a St James’s.')

# Reconcile the initially unnamed living only after the explicit identification in 52.
for review in REVIEWS.values():
    review['records']=[(('kympton',)+r[1:]) if r[0]=='wickham-living' else r for r in review['records']]
# The full paragraph was checked separately after its first console output was clipped.
REVIEWS[25]['records'].append(m('gracechurch-street',12,'Gracechurch Street','Elizabeth ironizza sul pregiudizio di Darcy verso la residenza degli zii; non scena nella strada.'))
REVIEWS[35]['records'].append(m('kent',1,'Kent','Durata della permanenza di Elizabeth e cambiamento stagionale della vegetazione: riferimento regionale nella scena del cancello.'))
