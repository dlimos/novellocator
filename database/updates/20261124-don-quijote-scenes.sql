-- Apply after the four JPEGs are available from GitHub Pages.
-- The new records are literature-only settings and have no geographic coordinates.
begin;

do $publish$
declare
  atlas_config constant jsonb := $views$
{
  "version": 1,
  "width": 1536,
  "height": 1024,
  "checked": "2026-11-24",
  "offerGeography": true,
  "preferIllustratedAnchors": true,
  "labels": {
    "it": {
      "view": "Veduta",
      "area": "Don Chisciotte",
      "back": "Torna alla veduta",
      "geographic": "Atlante geografico",
      "caption": "Illustrazione interpretativa",
      "alt": "Scena illustrata del Don Chisciotte",
      "notice": "Le posizioni sulle illustrazioni sono interpretative.",
      "method": "I punti rimandano ai passi del romanzo.",
      "empty": "Nessun luogo visibile con i filtri scelti."
    },
    "en": {
      "view": "View",
      "area": "Don Quixote",
      "back": "Back to the illustration",
      "geographic": "Geographic atlas",
      "caption": "Interpretative illustration",
      "alt": "Illustrated scene from Don Quixote",
      "notice": "The positions on the illustrations are interpretative.",
      "method": "Markers refer to passages from the novel.",
      "empty": "No places are visible with the selected filters."
    },
    "fr": {
      "view": "Vue",
      "area": "Don Quichotte",
      "back": "Retour à la vue",
      "geographic": "Atlas géographique",
      "caption": "Illustration interprétative",
      "alt": "Scène illustrée de Don Quichotte",
      "notice": "Les positions sur les illustrations sont interprétatives.",
      "method": "Les repères renvoient à des passages du roman.",
      "empty": "Aucun lieu visible avec les filtres choisis."
    },
    "es": {
      "view": "Vista",
      "area": "Don Quijote",
      "back": "Volver a la ilustración",
      "geographic": "Atlas geográfico",
      "caption": "Ilustración interpretativa",
      "alt": "Escena ilustrada del Quijote",
      "notice": "Las posiciones en las ilustraciones son interpretativas.",
      "method": "Los puntos remiten a pasajes de la novela.",
      "empty": "No hay lugares visibles con los filtros seleccionados."
    }
  },
  "sectionViews": {
    "15": 0,
    "32": 1,
    "90": 2,
    "132": 3
  },
  "placeOrder": [
    "scena-mulini",
    "scena-ritiro-sierra-morena",
    "scena-cueva-montesinos",
    "scena-spiaggia-barcellona"
  ],
  "names": {
    "it": {
      "scena-mulini": "Mulini a vento",
      "scena-ritiro-sierra-morena": "Ritiro della Sierra Morena",
      "scena-cueva-montesinos": "Imboccatura della grotta di Montesinos",
      "scena-spiaggia-barcellona": "Spiaggia del duello"
    },
    "en": {
      "scena-mulini": "Windmills",
      "scena-ritiro-sierra-morena": "Retreat in the Sierra Morena",
      "scena-cueva-montesinos": "Mouth of the Cave of Montesinos",
      "scena-spiaggia-barcellona": "Beach of the duel"
    },
    "fr": {
      "scena-mulini": "Moulins à vent",
      "scena-ritiro-sierra-morena": "Retraite dans la Sierra Morena",
      "scena-cueva-montesinos": "Entrée de la caverne de Montésinos",
      "scena-spiaggia-barcellona": "Plage du duel"
    },
    "es": {
      "scena-mulini": "Molinos de viento",
      "scena-ritiro-sierra-morena": "Retiro en Sierra Morena",
      "scena-cueva-montesinos": "Boca de la cueva de Montesinos",
      "scena-spiaggia-barcellona": "Playa del duelo"
    }
  },
  "notes": {
    "it": {
      "scena-mulini": "Don Chisciotte assalta uno dei mulini. Il luogo esatto dell’episodio resta indeterminato.",
      "scena-ritiro-sierra-morena": "Il ritiro affaccia su un ruscello ai piedi di un’altura isolata. Il romanzo ambienta l’episodio nella Sierra Morena.",
      "scena-cueva-montesinos": "Il testo descrive l’imboccatura larga e ingombra di rovi dalla quale parte la discesa.",
      "scena-spiaggia-barcellona": "Il Cavaliere della Bianca Luna sfida Don Chisciotte su una spiaggia di Barcellona che il testo lascia senza nome."
    },
    "en": {
      "scena-mulini": "Don Quixote charges one of the windmills. The exact site of the episode is unknown.",
      "scena-ritiro-sierra-morena": "A stream runs past the retreat at the foot of a solitary mountain. The novel sets the episode in the Sierra Morena.",
      "scena-cueva-montesinos": "The text describes the wide, bramble-covered mouth where the descent begins.",
      "scena-spiaggia-barcellona": "The Knight of the White Moon challenges Don Quixote on an unnamed beach at Barcelona."
    },
    "fr": {
      "scena-mulini": "Don Quichotte charge l’un des moulins. Le lieu précis de l’épisode reste indéterminé.",
      "scena-ritiro-sierra-morena": "Un ruisseau longe le refuge au pied d’une montagne isolée. Le roman situe l’épisode dans la Sierra Morena.",
      "scena-cueva-montesinos": "Le texte décrit l’entrée large et encombrée de ronces où commence la descente.",
      "scena-spiaggia-barcellona": "Le chevalier de la Blanche-Lune défie Don Quichotte sur une plage de Barcelone que le texte ne nomme pas."
    },
    "es": {
      "scena-mulini": "Don Quijote arremete contra uno de los molinos. Se desconoce el lugar exacto del episodio.",
      "scena-ritiro-sierra-morena": "Un arroyo bordea el retiro al pie de una montaña aislada. La novela sitúa el episodio en Sierra Morena.",
      "scena-cueva-montesinos": "El texto describe la boca ancha y cubierta de zarzas donde comienza el descenso.",
      "scena-spiaggia-barcellona": "El Caballero de la Blanca Luna desafía a don Quijote en una playa de Barcelona que el texto no nombra."
    }
  },
  "views": [
    {
      "id": "mulini",
      "image": "images/don-quijote/mulini.jpg",
      "names": {
        "it": "L’assalto ai mulini",
        "en": "The Charge at the Windmills",
        "fr": "L’assaut des moulins",
        "es": "La embestida contra los molinos"
      },
      "notes": {
        "it": "I, 8 · Sancio riconosce i mulini a vento e cerca di avvertire Don Chisciotte, che li prende per giganti e sprona Ronzinante.",
        "en": "I, 8 · Sancho recognises the windmills and tries to warn Don Quixote, who takes them for giants and spurs Rocinante on.",
        "fr": "I, 8 · Sancho reconnaît les moulins à vent et tente d’avertir Don Quichotte, qui les prend pour des géants et éperonne Rossinante.",
        "es": "I, 8 · Sancho reconoce los molinos de viento e intenta avisar a don Quijote, que los toma por gigantes y espolea a Rocinante."
      },
      "positions": {
        "scena-mulini": [
          0.84,
          0.47
        ]
      }
    },
    {
      "id": "penitenza",
      "image": "images/don-quijote/penitenza.jpg",
      "names": {
        "it": "La penitenza nella Sierra Morena",
        "en": "Penance in the Sierra Morena",
        "fr": "La pénitence dans la Sierra Morena",
        "es": "La penitencia en Sierra Morena"
      },
      "notes": {
        "it": "I, 25 · Don Chisciotte sceglie un riparo ai piedi di un’altura per fare penitenza come i cavalieri dei suoi libri. Sancio sta per partire per il Toboso.",
        "en": "I, 25 · Don Quixote chooses a retreat at the foot of a mountain to do penance like the knights in his books. Sancho is about to leave for El Toboso.",
        "fr": "I, 25 · Don Quichotte choisit un refuge au pied d’une montagne pour faire pénitence comme les chevaliers de ses livres. Sancho s’apprête à partir pour le Toboso.",
        "es": "I, 25 · Don Quijote elige un retiro al pie de una montaña para hacer penitencia como los caballeros de sus libros. Sancho está a punto de partir hacia el Toboso."
      },
      "positions": {
        "scena-ritiro-sierra-morena": [
          0.11,
          0.64
        ]
      }
    },
    {
      "id": "montesinos",
      "image": "images/don-quijote/montesinos.jpg",
      "names": {
        "it": "La discesa nella grotta di Montesinos",
        "en": "The Descent into the Cave of Montesinos",
        "fr": "La descente dans la caverne de Montésinos",
        "es": "El descenso a la cueva de Montesinos"
      },
      "notes": {
        "it": "II, 22 · Sancio e il giovane accompagnatore calano Don Chisciotte nella grotta tenendo la fune dall’imboccatura.",
        "en": "II, 22 · Sancho and the young guide let Don Quixote down on a rope from the mouth of the cave.",
        "fr": "II, 22 · Sancho et le jeune guide laissent descendre Don Quichotte à la corde depuis l’entrée de la caverne.",
        "es": "II, 22 · Sancho y el joven guía dan cuerda a don Quijote para que descienda desde la boca de la cueva."
      },
      "positions": {
        "scena-cueva-montesinos": [
          0.67,
          0.42
        ]
      }
    },
    {
      "id": "luna-bianca",
      "image": "images/don-quijote/luna-bianca.jpg",
      "names": {
        "it": "Il duello sulla spiaggia di Barcellona",
        "en": "The Duel on the Beach at Barcelona",
        "fr": "Le duel sur la plage de Barcelone",
        "es": "El duelo en la playa de Barcelona"
      },
      "notes": {
        "it": "II, 64 · Sulla riva, Don Chisciotte vede venirgli incontro un cavaliere con una luna dipinta sullo scudo. È il momento della sfida che precede il duello.",
        "en": "II, 64 · On the shore, Don Quixote sees a knight approaching with a moon painted on his shield. The challenge comes just before the duel.",
        "fr": "II, 64 · Sur le rivage, Don Quichotte voit venir à lui un chevalier dont l’écu porte une lune peinte. C’est le défi qui précède le duel.",
        "es": "II, 64 · En la orilla, don Quijote ve acercarse a un caballero con una luna pintada en el escudo. Es el desafío que precede al duelo."
      },
      "positions": {
        "scena-spiaggia-barcellona": [
          0.48,
          0.69
        ]
      }
    }
  ]
}
$views$::jsonb;
  scene_passages constant jsonb := $passages$
[
  {
    "section_id": 15,
    "source_ordinal": 1,
    "setting_id": "scena-mulini",
    "name": "Molinos de viento",
    "description": "Don Quijote arremete contra uno de los molinos. Se desconoce el lugar exacto del episodio.",
    "original": {
      "quote": "— Mire vuestra merced —respondió Sancho— que aquellos que allí se parecen no son gigantes, sino molinos de viento, y lo que en ellos parecen brazos son las aspas, que, volteadas del viento, hacen andar la piedra del molino.",
      "highlightTerms": [
        "molinos de viento"
      ],
      "language": "es",
      "type": "original",
      "attribution": "Miguel de Cervantes · Don Quijote de la Mancha · Project Gutenberg #2000, 1999 / rev. HTML 2010 · I, 8",
      "verificationStatus": "verified",
      "url": "https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#1_viii"
    },
    "translations": {
      "it": {
        "quote": "… quelli che colà si discuoprono non sono altrimenti giganti, ma mulini da vento, e quelle che le pajono braccia sono le pale delle ruote, che percosse dal vento, fanno girare la macina del mulino.",
        "highlightTerms": [
          "mulini da vento"
        ],
        "language": "it",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’ingegnoso idalgo Don Chisciotte della Mancia · Bartolommeo Gamba, riv. Francesco Ambrosoli · Andrea Ubicini, 1841 · I, 8",
        "verificationStatus": "verified",
        "url": "https://it.wikisource.org/wiki/Don_Chisciotte_della_Mancia/Capitolo_VIII"
      },
      "en": {
        "quote": "“Look, your worship,” said Sancho; “what we see there are not giants but windmills, and what seem to be their arms are the sails that turned by the wind make the millstone go.”",
        "highlightTerms": [
          "windmills"
        ],
        "language": "en",
        "type": "translation",
        "attribution": "Miguel de Cervantes · Don Quixote · John Ormsby, 1885 · Standard Ebooks · I, 8",
        "verificationStatus": "verified",
        "url": "https://standardebooks.org/ebooks/miguel-de-cervantes-saavedra/don-quixote/john-ormsby/text/chapter-1-8"
      },
      "fr": {
        "quote": "Prenez donc garde, répliqua Sancho ; ce que nous voyons là-bas ne sont pas des géants, mais des moulins à vent, et ce qui paraît leurs bras ce sont leurs ailes, qui, tournées par le vent, font tourner à leur tour la meule du moulin.",
        "highlightTerms": [
          "moulins à vent"
        ],
        "language": "fr",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’Ingénieux Hidalgo Don Quichotte de la Manche · Louis Viardot · J.-J. Dubochet, 1836 · I, 8",
        "verificationStatus": "verified",
        "url": "https://fr.wikisource.org/wiki/L%E2%80%99Ing%C3%A9nieux_Hidalgo_Don_Quichotte_de_la_Manche/Premi%C3%A8re_partie/Chapitre_VIII"
      }
    }
  },
  {
    "section_id": 32,
    "source_ordinal": 0,
    "setting_id": "scena-ritiro-sierra-morena",
    "name": "Retiro en Sierra Morena",
    "description": "Un arroyo bordea el retiro al pie de una montaña aislada. La novela sitúa el episodio en Sierra Morena.",
    "original": {
      "quote": "Llegaron, en estas pláticas, al pie de una alta montaña que, casi como peñón tajado, estaba sola entre otras muchas que la rodeaban. […] Este sitio escogió el Caballero de la Triste Figura para hacer su penitencia …",
      "highlightTerms": [
        "al pie de una alta montaña"
      ],
      "language": "es",
      "type": "original",
      "attribution": "Miguel de Cervantes · Don Quijote de la Mancha · Project Gutenberg #2000, 1999 / rev. HTML 2010 · I, 25",
      "verificationStatus": "verified",
      "url": "https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#1_xxv"
    },
    "translations": {
      "it": {
        "quote": "Con questi ragionamenti giunsero appiè di un’alta montagna, che, quasi masso tagliato, sorgeva isolata fra le molte altre che la circondavano. […] Scelse questo sito il cavaliere dalla Trista Figura per fare la sua penitenza …",
        "highlightTerms": [
          "appiè di un’alta montagna"
        ],
        "language": "it",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’ingegnoso idalgo Don Chisciotte della Mancia · Bartolommeo Gamba, riv. Francesco Ambrosoli · Andrea Ubicini, 1841 · I, 25",
        "verificationStatus": "verified",
        "url": "https://it.wikisource.org/wiki/Don_Chisciotte_della_Mancia/Capitolo_XXV"
      },
      "en": {
        "quote": "Thus talking they reached the foot of a high mountain which stood like an isolated peak among the others that surrounded it. […] Upon this place the Knight of the Rueful Countenance fixed his choice for the performance of his penance …",
        "highlightTerms": [
          "the foot of a high mountain"
        ],
        "language": "en",
        "type": "translation",
        "attribution": "Miguel de Cervantes · Don Quixote · John Ormsby, 1885 · Standard Ebooks · I, 25",
        "verificationStatus": "verified",
        "url": "https://standardebooks.org/ebooks/miguel-de-cervantes-saavedra/don-quixote/john-ormsby/text/chapter-1-25"
      },
      "fr": {
        "quote": "Ils arrivèrent, tout en causant ainsi, au pied d’une haute montagne qui s’élevait seule, comme une roche taillée à pic, au milieu de plusieurs autres dont elle était entourée. […] Ce fut le lieu que choisit le chevalier de la Triste-Figure pour faire sa pénitence.",
        "highlightTerms": [
          "au pied d’une haute montagne"
        ],
        "language": "fr",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’Ingénieux Hidalgo Don Quichotte de la Manche · Louis Viardot · J.-J. Dubochet, 1836 · I, 25",
        "verificationStatus": "verified",
        "url": "https://fr.wikisource.org/wiki/L%E2%80%99Ing%C3%A9nieux_Hidalgo_Don_Quichotte_de_la_Manche/Premi%C3%A8re_partie/Chapitre_XXV"
      }
    }
  },
  {
    "section_id": 90,
    "source_ordinal": 12,
    "setting_id": "scena-cueva-montesinos",
    "name": "Boca de la cueva de Montesinos",
    "description": "El texto describe la boca ancha y cubierta de zarzas donde comienza el descenso.",
    "original": {
      "quote": "Finalmente se levantó, y, viendo que no salían más cuervos ni otras aves noturnas, como fueron murciélagos, que asimismo entre los cuervos salieron, dándole soga el primo y Sancho, se dejó calar al fondo de la caverna espantosa …",
      "highlightTerms": [
        "la caverna espantosa"
      ],
      "language": "es",
      "type": "original",
      "attribution": "Miguel de Cervantes · Don Quijote de la Mancha · Project Gutenberg #2000, 1999 / rev. HTML 2010 · II, 22",
      "verificationStatus": "verified",
      "url": "https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#2_xxii"
    },
    "translations": {
      "it": {
        "quote": "… il giovane e Sancio cominciarono a dargli fune, a lo calarono al fondo della spaventosa caverna. All’entrarvi, Sancio gli diede la sua benedizione e gli fece sopra mille croci …",
        "highlightTerms": [
          "spaventosa caverna"
        ],
        "language": "it",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’ingegnoso idalgo Don Chisciotte della Mancia · Bartolommeo Gamba, riv. Francesco Ambrosoli · Andrea Ubicini, 1841 · II, 22",
        "verificationStatus": "verified",
        "url": "https://it.wikisource.org/wiki/Don_Chisciotte_della_Mancia_Vol._2/Capitolo_XXII"
      },
      "en": {
        "quote": "… the cousin and Sancho giving him rope, he lowered himself into the depths of the dread cavern; and as he entered it Sancho sent his blessing after him, making a thousand crosses over him …",
        "highlightTerms": [
          "dread cavern"
        ],
        "language": "en",
        "type": "translation",
        "attribution": "Miguel de Cervantes · Don Quixote · John Ormsby, 1885 · Standard Ebooks · II, 22",
        "verificationStatus": "verified",
        "url": "https://standardebooks.org/ebooks/miguel-de-cervantes-saavedra/don-quixote/john-ormsby/text/chapter-2-22"
      },
      "fr": {
        "quote": "… il demanda de la corde au cousin et à Sancho, qui le laissèrent glisser doucement au fond de l’épouvantable caverne. Au moment où il disparut, Sancho lui donna sa bénédiction …",
        "highlightTerms": [
          "l’épouvantable caverne"
        ],
        "language": "fr",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’Ingénieux Hidalgo Don Quichotte de la Manche · Louis Viardot · J.-J. Dubochet, 1837 · II, 22",
        "verificationStatus": "verified",
        "url": "https://fr.wikisource.org/wiki/L%E2%80%99Ing%C3%A9nieux_Hidalgo_Don_Quichotte_de_la_Manche/Deuxi%C3%A8me_partie/Chapitre_XXII"
      }
    }
  },
  {
    "section_id": 132,
    "source_ordinal": 3,
    "setting_id": "scena-spiaggia-barcellona",
    "name": "Playa del duelo",
    "description": "El Caballero de la Blanca Luna desafía a don Quijote en una playa de Barcelona que el texto no nombra.",
    "original": {
      "quote": "Y una mañana, saliendo don Quijote a pasearse por la playa armado de todas sus armas […] vio venir hacía él un caballero, armado asimismo de punta en blanco, que en el escudo traía pintada una luna resplandeciente …",
      "highlightTerms": [
        "por la playa"
      ],
      "language": "es",
      "type": "original",
      "attribution": "Miguel de Cervantes · Don Quijote de la Mancha · Project Gutenberg #2000, 1999 / rev. HTML 2010 · II, 64",
      "verificationStatus": "verified",
      "url": "https://www.gutenberg.org/files/2000/2000-h/2000-h.htm#2_lxiv"
    },
    "translations": {
      "it": {
        "quote": "Trovandosi un dì don Chisciotte al passeggio sulla spiaggia, armato di tutto punto (perchè, come sempre diceva, erano le armi l’ornamento suo, e suo riposo il combattere, nè senz’arme poteva vivere un momento), vide venire alla sua volta un cavaliere pur tutto armato, il quale portava dipinta nello scudo una luna risplendente.",
        "highlightTerms": [
          "sulla spiaggia"
        ],
        "language": "it",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’ingegnoso idalgo Don Chisciotte della Mancia · Bartolommeo Gamba, riv. Francesco Ambrosoli · Andrea Ubicini, 1841 · II, 64",
        "verificationStatus": "verified",
        "url": "https://it.wikisource.org/wiki/Don_Chisciotte_della_Mancia_Vol._2/Capitolo_LXIV"
      },
      "en": {
        "quote": "One morning as Don Quixote went out for a stroll along the beach, arrayed in full armour […] he saw coming towards him a knight, also in full armour, with a shining moon painted on his shield …",
        "highlightTerms": [
          "along the beach"
        ],
        "language": "en",
        "type": "translation",
        "attribution": "Miguel de Cervantes · Don Quixote · John Ormsby, 1885 · Standard Ebooks · II, 64",
        "verificationStatus": "verified",
        "url": "https://standardebooks.org/ebooks/miguel-de-cervantes-saavedra/don-quixote/john-ormsby/text/chapter-2-64"
      },
      "fr": {
        "quote": "Un matin que Don Quichotte était sorti pour se promener sur la plage, armé de toutes pièces […] il vit venir à lui un chevalier également armé de pied en cap, qui portait peinte sur son écu une lune resplendissante.",
        "highlightTerms": [
          "sur la plage"
        ],
        "language": "fr",
        "type": "translation",
        "attribution": "Miguel de Cervantes · L’Ingénieux Hidalgo Don Quichotte de la Manche · Louis Viardot · J.-J. Dubochet, 1837 · II, 64",
        "verificationStatus": "verified",
        "url": "https://fr.wikisource.org/wiki/L%E2%80%99Ing%C3%A9nieux_Hidalgo_Don_Quichotte_de_la_Manche/Deuxi%C3%A8me_partie/Chapitre_LXIV"
      }
    }
  }
]
$passages$::jsonb;
  setting record;
  existing_metadata jsonb;
  passage_source text;
  setting_ordinal integer;
begin
  select metadata into strict existing_metadata
  from public.books
  where id = 'don-quijote' and publication_status = 'published'
  for update;

  if existing_metadata ? 'illustratedView'
     and existing_metadata->'illustratedView' is distinct from atlas_config then
    raise exception 'Don Quixote already has a different settings configuration';
  end if;

  for setting in
    select * from jsonb_to_recordset(scene_passages) as s(
      section_id integer, source_ordinal integer, setting_id text, name text,
      description text, original jsonb, translations jsonb
    )
  loop
    select source_id into strict passage_source from public.unlocated_settings
    where book_id = 'don-quijote' and section_id = setting.section_id
      and ordinal = setting.source_ordinal;

    select coalesce(
      max(ordinal) filter (where metadata->>'id' = setting.setting_id),
      coalesce(max(ordinal), -1) + 1
    ) into setting_ordinal
    from public.unlocated_settings
    where book_id = 'don-quijote' and section_id = setting.section_id;

    insert into public.unlocated_settings
      (book_id, section_id, ordinal, name, description, quote, source_id, metadata)
    values ('don-quijote', setting.section_id, setting_ordinal, setting.name, setting.description,
      setting.original->>'quote', passage_source,
      jsonb_build_object('id', setting.setting_id, 'category', 'action', 'displayInAtlas', false,
        'language', 'es', 'attribution', setting.original->>'attribution',
        'excerpt', jsonb_build_object('original', setting.original, 'translations', setting.translations)))
    on conflict (book_id, section_id, ordinal) do nothing;

    if not exists (
      select 1 from public.unlocated_settings u
      where u.book_id = 'don-quijote' and u.section_id = setting.section_id and u.ordinal = setting_ordinal
        and u.metadata->>'id' = setting.setting_id and u.metadata->'excerpt' =
          jsonb_build_object('original', setting.original, 'translations', setting.translations)
    ) then
      raise exception 'Conflicting Don Quixote setting: %', setting.setting_id;
    end if;
  end loop;

  update public.books
  set metadata = jsonb_set(metadata, '{illustratedView}', atlas_config)
  where id = 'don-quijote' and metadata->'illustratedView' is distinct from atlas_config;
end
$publish$;

commit;
