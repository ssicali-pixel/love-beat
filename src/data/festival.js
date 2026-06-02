export const FESTIVAL = {
  name:    'South Calling',
  edition: 'Estate 2026',
  cities:  ['Catania', 'Palermo', 'Agrigento', 'Napoli'],
};

export const STAGES = [
  { id: 'main',  name: 'Main Stage',  subtitle: 'Indoor',  location: 'Arena principale',  capacity: 3000 },
  { id: 'porto', name: 'Porto Stage', subtitle: 'Outdoor', location: 'Area portuale',      capacity: 1500 },
  { id: 'cave',  name: 'Cave Stage',  subtitle: 'Indoor',  location: 'Location naturale',  capacity: 800  },
];

export const TAPPE = [
  {
    id:        'catania',
    city:      'Catania',
    label:     'Catania',
    range:     '11–12 Lug 2026',
    dates:     ['2026-07-11', '2026-07-12'],
    dayLabels: ['Ven 11 Lug', 'Sab 12 Lug'],
    artists: [
      {
        id: 'sasha-cat-fri', name: 'Sasha', slug: 'sasha',
        date: '2026-07-11', time: '23:00', stage: 'main',
        genre: 'Progressive / Trance', origin: 'UK', headliner: true, tappaId: 'catania',
        bio: 'Pioniere della scena progressive, Sasha ha ridefinito il concetto di DJ set con la sua capacità unica di costruire viaggi musicali senza precedenti.',
        tracks: ['Xpander', 'Wavy Gravy', 'Coma'],
      },
      {
        id: 'peggy-cat-fri', name: 'Peggy Gou', slug: 'peggy-gou',
        date: '2026-07-11', time: '01:30', stage: 'main',
        genre: 'House / Disco', origin: 'Corea del Sud', headliner: true, tappaId: 'catania',
        bio: "Icona della house moderna, Peggy Gou mescola influenze coreane, disco e club culture europea in un sound inconfondibile e irresistibile.",
        tracks: ['Nanmu', '(It Goes Like) Nanana', 'I Go'],
      },
      {
        id: 'cox-cat-sat', name: 'Carl Cox', slug: 'carl-cox',
        date: '2026-07-12', time: '23:00', stage: 'main',
        genre: 'Techno / House', origin: 'UK', headliner: true, tappaId: 'catania',
        bio: "Il Re della Techno. Carl Cox è una leggenda vivente che ha animato le notti più iconiche del mondo, da Ibiza a Melbourne.",
        tracks: ['And It Goes On', 'I Want You (Forever)', 'Two Paintings and a Drum'],
      },
      {
        id: 'hawtin-cat-sat', name: 'Richie Hawtin', slug: 'richie-hawtin',
        date: '2026-07-12', time: '02:00', stage: 'cave',
        genre: 'Techno / Minimal', origin: 'Canada', headliner: true, tappaId: 'catania',
        bio: "Alias Plastikman, Richie Hawtin è il padre del minimal techno. La sua visione tecnologica ha trasformato il DJ set in un'esperienza audiovisiva totale.",
        tracks: ['Spastik', 'Consumed', 'DE9 Transitions'],
      },
    ],
  },

  {
    id:        'palermo',
    city:      'Palermo',
    label:     'Palermo',
    range:     '18–19 Lug 2026',
    dates:     ['2026-07-18', '2026-07-19'],
    dayLabels: ['Ven 18 Lug', 'Sab 19 Lug'],
    artists: [
      {
        id: 'carola-pal-fri', name: 'Marco Carola', slug: 'marco-carola',
        date: '2026-07-18', time: '23:00', stage: 'main',
        genre: 'Techno / Minimal', origin: 'Italia', headliner: true, tappaId: 'palermo',
        bio: "Napoletano di origine, Marco Carola è tra i techno DJ più apprezzati al mondo. Il suo stile ipnotico e oscuro ha conquistato le capitali della musica elettronica.",
        tracks: ['Play It Loud', 'Addiction', 'Trinity'],
      },
      {
        id: 'anfisa-pal-fri', name: 'Anfisa Letyago', slug: 'anfisa-letyago',
        date: '2026-07-18', time: '01:30', stage: 'porto',
        genre: 'Techno', origin: 'Russia / Italia', headliner: false, tappaId: 'palermo',
        bio: "Nata in Russia e cresciuta in Italia, Anfisa Letyago è una delle voci più fresche della scena techno europea. Residente in alcuni dei club più rispettati del continente.",
        tracks: ['Come Get It', 'Fufu', 'Drive'],
      },
      {
        id: 'sama-pal-sat', name: "Sama' Abdulhadi", slug: 'sama-abdulhadi',
        date: '2026-07-19', time: '23:00', stage: 'main',
        genre: 'Techno', origin: 'Palestina', headliner: true, tappaId: 'palermo',
        bio: "Prima DJ palestinese a raggiungere il riconoscimento internazionale, Sama' Abdulhadi porta un'energia brutale e una storia unica in ogni set.",
        tracks: ['Uprising', 'Nytt Land', 'Freedom'],
      },
      {
        id: 'capriati-pal-sat', name: 'Joseph Capriati', slug: 'joseph-capriati',
        date: '2026-07-19', time: '01:30', stage: 'porto',
        genre: 'Techno / House', origin: 'Italia', headliner: false, tappaId: 'palermo',
        bio: "Nato a Napoli, Joseph Capriati ha conquistato i club più duri d'Europa con il suo techno viscerale e coinvolgente. Una delle stelle italiane della scena globale.",
        tracks: ['Surfing', 'Volta', 'Connection'],
      },
    ],
  },

  {
    id:        'agrigento',
    city:      'Agrigento',
    label:     'Agrigento',
    range:     '25–26 Lug 2026',
    dates:     ['2026-07-25', '2026-07-26'],
    dayLabels: ['Ven 25 Lug', 'Sab 26 Lug'],
    artists: [
      {
        id: 'dubfire-agr-fri', name: 'Dubfire', slug: 'dubfire',
        date: '2026-07-25', time: '23:00', stage: 'main',
        genre: 'Techno / Dark', origin: 'USA', headliner: true, tappaId: 'agrigento',
        bio: "Ali Shirazinia, in arte Dubfire, è metà del duo Deep Dish. La sua carriera solista lo ha consacrato come uno dei techno DJ più oscuri e intensi del pianeta.",
        tracks: ['Roadkill', 'Noctural', 'Spectral'],
      },
      {
        id: 'moudaber-agr-fri', name: 'Nicole Moudaber', slug: 'nicole-moudaber',
        date: '2026-07-25', time: '01:30', stage: 'cave',
        genre: 'Techno', origin: 'Libano', headliner: false, tappaId: 'agrigento',
        bio: "Libanese-britannica, Nicole Moudaber porta un techno potente e spirituale che unisce energia africana e sound design all'avanguardia.",
        tracks: ['In My Head', 'Breed', 'The Calling'],
      },
      {
        id: 'maceo-agr-sat', name: 'Maceo Plex', slug: 'maceo-plex',
        date: '2026-07-26', time: '23:00', stage: 'main',
        genre: 'Melodic Techno', origin: 'USA / Spagna', headliner: true, tappaId: 'agrigento',
        bio: "Eric Estornel alias Maceo Plex ha ridefinito il confine tra melodia e techno. I suoi set cinematografici sono esperienze emotive senza eguali.",
        tracks: ['Conjure One', 'Solar', 'Life Index'],
      },
      {
        id: 'digweed-agr-sat', name: 'John Digweed', slug: 'john-digweed',
        date: '2026-07-26', time: '02:00', stage: 'porto',
        genre: 'Progressive House', origin: 'UK', headliner: false, tappaId: 'agrigento',
        bio: 'Fondatore di Bedrock Records, John Digweed è uno dei DJ più longevi e rispettati della scena internazionale.',
        tracks: ['Heaven Scent', 'For What You Dream Of', 'Bedrock'],
      },
    ],
  },

  {
    id:        'napoli',
    city:      'Napoli',
    label:     'Napoli',
    range:     '1–2 Ago 2026',
    dates:     ['2026-08-01', '2026-08-02'],
    dayLabels: ['Ven 1 Ago', 'Sab 2 Ago'],
    artists: [
      {
        id: 'taleofus-nap-fri', name: 'Tale Of Us', slug: 'tale-of-us',
        date: '2026-08-01', time: '23:00', stage: 'main',
        genre: 'Melodic Techno', origin: 'Italia', headliner: true, tappaId: 'napoli',
        bio: "Carmine Conte e Matteo Milleri formano Tale Of Us, il duo italiano che ha portato il melodic techno ai vertici mondiali con la loro etichetta Afterlife.",
        tracks: ['Aimless', 'Laments', 'Rejoice'],
      },
      {
        id: 'recondite-nap-fri', name: 'Recondite', slug: 'recondite',
        date: '2026-08-01', time: '01:30', stage: 'cave',
        genre: 'Ambient Techno', origin: 'Germania', headliner: false, tappaId: 'napoli',
        bio: "Recondite crea paesaggi sonori che sfumano i confini tra musica ambient, techno e sperimentale. Un'esperienza introspettiva e avvolgente.",
        tracks: ['With', 'Dip', 'Rhy'],
      },
      {
        id: 'dixon-nap-sat', name: 'Dixon', slug: 'dixon',
        date: '2026-08-02', time: '23:00', stage: 'main',
        genre: 'Deep House / Techno', origin: 'Germania', headliner: true, tappaId: 'napoli',
        bio: "Steffen Berkhahn alias Dixon è il fondatore di Innervisions. Uno dei DJ più influenti degli ultimi vent'anni, capace di mescolare house, techno e soul.",
        tracks: ['About You', 'Gemini', 'Phantasy'],
      },
      {
        id: 'ame-nap-sat', name: 'Âme', slug: 'ame',
        date: '2026-08-02', time: '02:00', stage: 'porto',
        genre: 'Deep House', origin: 'Germania', headliner: true, tappaId: 'napoli',
        bio: "Frank Wiedemann e Kristian Beyer sono Âme, uno dei progetti house più amati al mondo. Il loro sound notturno e malinconico è inconfondibile.",
        tracks: ['Rej', 'Fiori', 'Neptune'],
      },
    ],
  },
];
