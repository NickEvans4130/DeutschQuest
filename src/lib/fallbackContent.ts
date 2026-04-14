import type { DailyContent } from '../types/content';

export const FALLBACK_SESSIONS: DailyContent[] = [
  {
    generatedAt: '2024-01-01',
    news: {
      headline: 'München eröffnet neuen Radweg entlang der Isar',
      simplified:
        'Die Stadt München hat heute einen neuen Radweg eröffnet. Der Weg geht entlang der Isar. Er ist fünf Kilometer lang. Viele Menschen freuen sich über den neuen Weg.',
      english_summary:
        'Munich has opened a new five-kilometre cycling path along the Isar river.',
      vocab: [
        {
          word: 'Radweg',
          article: 'der',
          english: 'cycling path / bike lane',
          example: 'Der neue Radweg ist sehr breit.',
        },
        {
          word: 'eröffnen',
          article: null,
          english: 'to open (officially)',
          example: 'Die Bürgermeisterin eröffnet das neue Café.',
        },
        {
          word: 'entlang',
          article: null,
          english: 'along',
          example: 'Wir gehen entlang der Straße.',
        },
      ],
      topic: 'local',
    },
    flashcards: [
      {
        id: 'fc-fb-001',
        german: 'der Bahnhof',
        english: 'train station',
        article: 'der',
        example: 'Wo ist der Bahnhof?',
        tags: ['noun'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-002',
        german: 'kaufen',
        english: 'to buy',
        article: null,
        example: 'Ich möchte ein Brot kaufen.',
        tags: ['verb'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-003',
        german: 'der Marktplatz',
        english: 'market square',
        article: 'der',
        example: 'Der Marktplatz ist sehr schön.',
        tags: ['noun'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-004',
        german: 'spazieren gehen',
        english: 'to go for a walk',
        article: null,
        example: 'Wir gehen am Abend spazieren.',
        tags: ['verb', 'phrase'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-005',
        german: 'gemütlich',
        english: 'cosy / comfortable',
        article: null,
        example: 'Das Café ist sehr gemütlich.',
        tags: ['adjective'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-006',
        german: 'die Altstadt',
        english: 'old town',
        article: 'die',
        example: 'Die Altstadt von München ist wunderschön.',
        tags: ['noun'],
        difficulty: 1,
      },
    ],
    dialect: {
      bavarian: 'Griaß di!',
      standard: 'Hallo! / Guten Tag!',
      english: 'Hello! / Hi there!',
      etymology:
        'Contraction of "Grüß Gott" (may God greet you), the traditional Catholic Bavarian greeting. Shortened in informal speech to "Griaß di" (greet you) when addressing one person.',
      usage:
        'Used everywhere in Bavaria as a standard informal greeting between friends, neighbours, and strangers in everyday situations. More casual than the full "Grüß Gott".',
      example_dialogue: [
        { speaker: 'A', line: 'Griaß di, Franz! Wia gaasd?' },
        { speaker: 'B', line: 'Danke, passt scho! Und dir?' },
      ],
    },
  },
  {
    generatedAt: '2024-01-02',
    news: {
      headline: 'Oktoberfest zieht Millionen Besucher nach München',
      simplified:
        'Das Oktoberfest ist das größte Volksfest der Welt. Es findet jedes Jahr in München statt. Millionen Menschen kommen aus aller Welt. Das Fest dauert etwa zwei Wochen.',
      english_summary:
        'The Oktoberfest in Munich attracts millions of visitors from around the world each year.',
      vocab: [
        {
          word: 'das Volksfest',
          article: 'das',
          english: 'folk festival / public fair',
          example: 'Das Volksfest beginnt morgen.',
        },
        {
          word: 'stattfinden',
          article: null,
          english: 'to take place',
          example: 'Das Konzert findet morgen statt.',
        },
        {
          word: 'dauern',
          article: null,
          english: 'to last / to take (time)',
          example: 'Der Film dauert zwei Stunden.',
        },
      ],
      topic: 'culture',
    },
    flashcards: [
      {
        id: 'fc-fb-011',
        german: 'das Bier',
        english: 'beer',
        article: 'das',
        example: 'Auf dem Oktoberfest trinkt man viel Bier.',
        tags: ['noun'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-012',
        german: 'die Tracht',
        english: 'traditional costume',
        article: 'die',
        example: 'Viele tragen Tracht beim Volksfest.',
        tags: ['noun', 'bavarian'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-013',
        german: 'feiern',
        english: 'to celebrate',
        article: null,
        example: 'Wir feiern heute Abend.',
        tags: ['verb'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-014',
        german: 'das Zelt',
        english: 'tent',
        article: 'das',
        example: 'Im Zelt ist es sehr laut.',
        tags: ['noun'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-015',
        german: 'bekannt',
        english: 'famous / well-known',
        article: null,
        example: 'München ist bekannt für seine Museen.',
        tags: ['adjective'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-016',
        german: 'die Wiesn',
        english: 'the meadow (Bavarian name for Oktoberfest)',
        article: 'die',
        example: 'Gehst du heuer auf die Wiesn?',
        tags: ['noun', 'bavarian', 'informal'],
        difficulty: 2,
      },
    ],
    dialect: {
      bavarian: 'Servas!',
      standard: 'Hallo! / Tschüss!',
      english: 'Hi! / Bye! (used for both greeting and farewell)',
      etymology:
        'Derived from the Latin "servus" (slave/servant), used in Austrian and Bavarian dialect as a casual greeting meaning "at your service." Spread throughout the Habsburg empire and remains common in Bavaria and Austria.',
      usage:
        'A versatile, warm greeting used among friends and acquaintances in Bavaria and Austria. Works for both hello and goodbye, making it extremely useful in everyday conversation.',
      example_dialogue: [
        { speaker: 'A', line: 'Servas Monika, lang ned gsehn!' },
        { speaker: 'B', line: "Jo, stimmt! Wia laafd's bei dir?" },
      ],
    },
  },
  {
    generatedAt: '2024-01-03',
    news: {
      headline: 'Neue Trambahnlinie verbindet Schwabing mit dem Englischen Garten',
      simplified:
        'München bekommt eine neue Trambahnlinie. Sie verbindet den Stadtteil Schwabing mit dem Englischen Garten. Die neue Linie ist umweltfreundlich. Sie soll nächstes Jahr fertig sein.',
      english_summary:
        'Munich is building a new tram line connecting the Schwabing district to the English Garden.',
      vocab: [
        {
          word: 'die Trambahnlinie',
          article: 'die',
          english: 'tram line',
          example: 'Die Trambahnlinie fährt durch die Innenstadt.',
        },
        {
          word: 'verbinden',
          article: null,
          english: 'to connect / to link',
          example: 'Die Brücke verbindet die zwei Ufer.',
        },
        {
          word: 'umweltfreundlich',
          article: null,
          english: 'environmentally friendly',
          example: 'Das Fahrrad ist umweltfreundlich.',
        },
      ],
      topic: 'environment',
    },
    flashcards: [
      {
        id: 'fc-fb-021',
        german: 'die Straßenbahn',
        english: 'tram / streetcar',
        article: 'die',
        example: 'Ich fahre mit der Straßenbahn zur Arbeit.',
        tags: ['noun'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-022',
        german: 'der Stadtteil',
        english: 'district / neighbourhood',
        article: 'der',
        example: 'In welchem Stadtteil wohnst du?',
        tags: ['noun'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-023',
        german: 'öffentlich',
        english: 'public',
        article: null,
        example: 'Der Park ist öffentlich zugänglich.',
        tags: ['adjective'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-024',
        german: 'pünktlich',
        english: 'on time / punctual',
        article: null,
        example: 'Der Zug ist pünktlich angekommen.',
        tags: ['adjective', 'adverb'],
        difficulty: 2,
      },
      {
        id: 'fc-fb-025',
        german: 'die Haltestelle',
        english: 'stop (bus/tram)',
        article: 'die',
        example: 'Wo ist die nächste Haltestelle?',
        tags: ['noun'],
        difficulty: 1,
      },
      {
        id: 'fc-fb-026',
        german: 'umsteigen',
        english: 'to change (trains/buses)',
        article: null,
        example: 'Du musst am Hauptbahnhof umsteigen.',
        tags: ['verb'],
        difficulty: 3,
      },
    ],
    dialect: {
      bavarian: 'Mia san mia!',
      standard: 'Wir sind wir!',
      english: 'We are who we are! (expression of Bavarian pride)',
      etymology:
        'This phrase became the unofficial motto of FC Bayern München and is deeply embedded in Bavarian identity. It reflects the regional pride and self-confidence of Bavarians, asserting their distinct culture within Germany.',
      usage:
        'Used to express Bavarian solidarity, regional pride, or simply group identity. You will hear it at football stadiums, festivals, and whenever Bavarians want to assert their unique character.',
      example_dialogue: [
        { speaker: 'A', line: 'Die Preißn verstehnd uns eh ned.' },
        { speaker: 'B', line: 'Des macht nix. Mia san mia!' },
      ],
    },
  },
];
