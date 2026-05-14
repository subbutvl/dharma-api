/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/** Deterministic placeholder images for local UI testing */
const pic = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const gallery = (base, n = 2) =>
  Array.from({ length: n }, (_, i) => pic(`${base}-g${i + 1}`, 720, 480));

const ganeshaPayload = {
  slug: "ganesha",
  name: "Ganesha",
  title: "Remover of Obstacles",
  description:
    "Elephant-headed son of Shiva and Parvati. Worshipped before new beginnings and revered as the remover of obstacles.",
  descriptionEn:
    "Elephant-headed son of Shiva and Parvati. Worshipped before new beginnings.",
  descriptionTa: "சிவன் மற்றும் பார்வதியின் மகன்; விக்னேஸ்வரர்.",
  category: "deva",
  aliases: ["Ganapati", "Vinayaka", "Vighneshvara"],
  affiliation: "Shaivism",
  abode: "Mount Kailash (with parents)",
  primaryImageUrl: pic("dharma-deity-ganesha", 900, 1100),
  attributes: {
    headType: "elephant",
    arms: 4,
    vehicle: "Mouse",
    weapons: ["Axe", "Pasha"],
    symbols: ["Broken Tusk", "Modak"],
    consort: null,
  },
  relationships: {
    parents: ["shiva", "parvati"],
    siblings: ["kartikeya"],
    consorts: [],
  },
  worship: {
    majorFestivals: ["Ganesh Chaturthi"],
    mantra: "Om Gam Ganapataye Namaha",
    slokas: [],
    temples: [],
  },
  media: {
    primaryImage: null,
    gallery: [],
    model3d: null,
    songs: [],
    videos: [],
    liveStreams: [],
  },
};

const shivaPayload = {
  slug: "shiva",
  name: "Shiva",
  title: "The Destroyer",
  description:
    "One of the Trimurti. Lord of destruction and transformation. Husband of Parvati and father of Ganesha.",
  descriptionEn: "One of the Trimurti. Lord of transformation.",
  descriptionTa:
    "திரிமூர்த்திகளில் ஒருவர்; அழிப்பு மற்றும் மாற்றத்தின் தலைவர்.",
  category: "deva",
  aliases: ["Mahadeva", "Shankara", "Rudra"],
  affiliation: "Shaivism",
  abode: "Mount Kailash",
  primaryImageUrl: pic("dharma-deity-shiva", 900, 1100),
  attributes: {
    headType: "human",
    arms: 2,
    vehicle: "Nandi (Bull)",
    weapons: ["Trishula", "Damru"],
    symbols: ["Third Eye", "Crescent Moon"],
    consort: "Parvati",
  },
  relationships: {
    parents: [],
    siblings: [],
    consorts: ["parvati"],
    children: ["ganesha", "kartikeya"],
  },
  worship: {
    majorFestivals: ["Maha Shivaratri"],
    mantra: "Om Namah Shivaya",
    slokas: [],
    temples: [],
  },
  media: { primaryImage: null, gallery: [], model3d: null },
};

const vishnuPayload = {
  slug: "vishnu",
  name: "Vishnu",
  title: "The Preserver",
  description:
    "One of the Trimurti who sustains the universe; known for his avatars including Rama and Krishna.",
  descriptionEn: "The preserver within the Trimurti.",
  descriptionTa: "பாதுகாப்பவர்; திரிமூர்த்தியில் ஒருவர்.",
  category: "deva",
  aliases: ["Narayana", "Hari", "Vishnu"],
  affiliation: "Vaishnavism",
  abode: "Vaikuntha",
  primaryImageUrl: pic("dharma-deity-vishnu", 900, 1100),
  attributes: {
    headType: "human",
    arms: 4,
    vehicle: "Garuda",
    weapons: ["Sudarshana Chakra", "Kaumodaki"],
    symbols: ["Shankha", "Chakra"],
    consort: "Lakshmi",
  },
  relationships: {
    parents: [],
    siblings: [],
    consorts: [],
    children: [],
  },
  worship: {
    majorFestivals: ["Vaikuntha Ekadashi", "Ram Navami"],
    mantra: "Om Namo Narayanaya",
    slokas: [],
    temples: [],
  },
  media: {},
};

const deviPayload = {
  slug: "devi",
  name: "Devi",
  title: "The Divine Mother",
  description:
    "The supreme goddess in Shaktism; manifests as Parvati, Lakshmi, Saraswati, Durga, and Kali.",
  descriptionEn: "The divine feminine; mother of the universe.",
  descriptionTa: "தெய்வீகத் தாய்; சக்தி வழிபாட்டின் முழுமை.",
  category: "deva",
  aliases: ["Shakti", "Adi Parashakti", "Mahadevi"],
  affiliation: "Shaktism",
  abode: "Various (Kailash, Vaikuntha, Manidvipa)",
  primaryImageUrl: pic("dharma-deity-devi", 900, 1100),
  attributes: {
    headType: "human",
    arms: 4,
    vehicle: "Lion / Tiger (as Durga)",
    weapons: ["Trishula", "Sword"],
    symbols: ["Lotus", "Abhaya mudra"],
    consort: null,
  },
  relationships: {
    parents: [],
    siblings: [],
    consorts: [],
    children: [],
  },
  worship: {
    majorFestivals: ["Navaratri", "Durga Puja"],
    mantra: "Sarva Mangala Mangalye",
    slokas: [],
    temples: [],
  },
  media: {},
};

async function main() {
  await prisma.song.deleteMany();
  await prisma.sloka.deleteMany();
  await prisma.avatar.deleteMany();
  await prisma.temple.deleteMany();
  await prisma.deityFestival.deleteMany();
  await prisma.deity.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.mythicalBeing.deleteMany();

  const festivals = await prisma.festival.createMany({
    data: [
      {
        slug: "maha-shivaratri",
        name: "Maha Shivaratri",
        description:
          "Annual Hindu festival honouring Shiva: fasting, night vigil, and abhishekam at temples from Kashmir to Tamil Nadu.",
      },
      {
        slug: "navaratri",
        name: "Navaratri",
        description:
          "Nine nights celebrating the goddess in her forms—Durga, Lakshmi, Saraswati—marked by garba, golu displays, and ayudha puja.",
      },
      {
        slug: "diwali",
        name: "Diwali",
        description:
          "Festival of lights: row of lamps, sweets, Lakshmi puja in many homes, and regional stories of Rama’s return or Krishna’s victory.",
      },
      {
        slug: "ganesh-chaturthi",
        name: "Ganesh Chaturthi",
        description:
          "Public and home worship of Ganesha with clay idols, modaks, visarjan processions—especially prominent in Maharashtra.",
      },
    ],
  });
  void festivals;

  const beings = await prisma.mythicalBeing.createMany({
    data: [
      {
        slug: "ravana",
        name: "Ravana",
        kind: "asura",
        description: "Lanka king and scholar antagonist in the Ramayana.",
        lore: { textSource: "Ramayana", regions: ["Lanka"] },
      },
      {
        slug: "kubera",
        name: "Kubera",
        kind: "yaksha",
        description: "Lord of wealth and guardian of the northern direction.",
        lore: { domains: ["wealth", "north"] },
      },
      {
        slug: "vasuki",
        name: "Vasuki",
        kind: "naga",
        description:
          "Serpent king used as churning rope in the Samudra Manthan.",
        lore: { episode: "Samudra Manthan" },
      },
      {
        slug: "hanuman",
        name: "Hanuman",
        kind: "mythical",
        description: "Divine vanara devotee of Rama.",
        lore: { devotion: "Rama-bhakti" },
      },
      {
        slug: "surasa",
        name: "Surasa",
        kind: "naga",
        description: "Sea mother who tests Hanuman during his leap to Lanka.",
      },
      {
        slug: "airavata",
        name: "Airavata",
        kind: "mythical",
        description:
          "Indra’s white elephant mount, born of the churning ocean.",
      },
    ],
  });
  void beings;

  function createDeity(p) {
    return prisma.deity.create({
      data: {
        slug: p.slug,
        name: p.name,
        title: p.title,
        description: p.description,
        descriptionEn: p.descriptionEn,
        descriptionTa: p.descriptionTa,
        category: p.category,
        aliases: p.aliases,
        affiliation: p.affiliation,
        abode: p.abode,
        primaryImageUrl: p.primaryImageUrl ?? null,
        attributes: p.attributes,
        relationships: p.relationships,
        worship: p.worship,
        media: p.media,
      },
    });
  }

  const ganesha = await createDeity(ganeshaPayload);
  const shiva = await createDeity(shivaPayload);
  const vishnu = await createDeity(vishnuPayload);
  const devi = await createDeity(deviPayload);

  const [fShiv, fNav, fDiwali, fGanesh] = await Promise.all([
    prisma.festival.findUnique({ where: { slug: "maha-shivaratri" } }),
    prisma.festival.findUnique({ where: { slug: "navaratri" } }),
    prisma.festival.findUnique({ where: { slug: "diwali" } }),
    prisma.festival.findUnique({ where: { slug: "ganesh-chaturthi" } }),
  ]);

  await prisma.deityFestival.createMany({
    data: [
      { deityId: shiva.id, festivalId: fShiv.id },
      { deityId: devi.id, festivalId: fNav.id },
      { deityId: vishnu.id, festivalId: fDiwali.id },
      { deityId: ganesha.id, festivalId: fDiwali.id },
      { deityId: ganesha.id, festivalId: fGanesh.id },
      { deityId: shiva.id, festivalId: fNav.id },
    ],
  });

  await prisma.sloka.createMany({
    data: [
      {
        deityId: ganesha.id,
        title: "Vakratunda Mahakaya",
        sanskrit:
          "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
        transliteration:
          "Vakratunda mahakaya suryakoti samaprabha | nirvighnam kuru me deva sarva-karyesu sarvada ||",
        meaning:
          "Salutations to the mighty one with a curved trunk, brilliant as a million suns—remove obstacles in all my undertakings.",
      },
      {
        deityId: ganesha.id,
        title: "Ganesha Gayatri",
        sanskrit:
          "ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि ।\nतन्नो दन्तिः प्रचोदयात् ॥",
        transliteration:
          "Om ekadantaya vidmahe vakratundaya dhimahi | tanno dantih pracodayat ||",
        meaning: "Meditation mantra for Ganesha as the single-tusked lord.",
      },
      {
        deityId: shiva.id,
        title: "Shiva Panchakshara",
        sanskrit:
          "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥",
        transliteration:
          "Nagendraharaya trilochanaya bhasmangaragaya maheshvaraya | nityaya shuddaya digambaraya tasmai na-karaya namah shivaya ||",
        meaning:
          "Praise of Shiva adorned with serpent, ash, and the cosmic form.",
      },
      {
        deityId: shiva.id,
        title: "Rudrashtakam (excerpt)",
        sanskrit:
          "नमामि शमीशान निर्वाण रूपम् ।\nविभुं व्यापकं ब्रह्मवेद स्वरूपम् ॥",
        transliteration:
          "Namami shamishana nirvana rupam | vibhum vyapakam brahma-veda-svarupam ||",
        meaning:
          "Salutations to the formless auspicious Lord, all-pervading Brahman.",
      },
      {
        deityId: vishnu.id,
        title: "Vishnu Sahasranama (excerpt)",
        sanskrit: "विष्णुं जिष्णुं महाविष्णुं प्रभविष्णुं महेश्वरम् ।",
        transliteration:
          "Vishnum jishnum maha-vishnum prabha-vishnum maheshvaram |",
        meaning:
          "Salutations to Vishnu as conqueror and great lord of manifestation.",
      },
      {
        deityId: devi.id,
        title: "Durga Stuti (excerpt)",
        sanskrit:
          "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥",
        transliteration:
          "Sarva mangala mangalye shive sarvartha sadhike | sharanye tryambake gauri narayani namo astu te ||",
        meaning: "Salutations to the auspicious one who grants every goal.",
      },
      {
        deityId: vishnu.id,
        title: "Mangalam Bhagavan Vishnu",
        sanskrit: "मङ्गलं भगवान् विष्णुः मङ्गलं गरुडध्वजः ।",
        transliteration: "Mangalam bhagavan vishnuh mangalam garudadhvajah |",
        meaning:
          "Auspiciousness to Vishnu, the lotus-eyed lord borne on Garuda.",
      },
    ],
  });

  await prisma.temple.createMany({
    data: [
      {
        deityId: ganesha.id,
        nameEnglish: "Shree Siddhivinayak Temple",
        nameTamil: "சித்திவிநாயகர் கோவில்",
        city: "Mumbai",
        overview:
          "One of the most visited Ganesha shrines in India; wooden dome and central black stone idol.",
        sthalaPuranam:
          "Linked to the faith of the Agri–Koli communities and the vow of a childless woman who was blessed here.",
        literaryBackground:
          "Featured in modern Marathi bhakti literature and film.",
        puranaBackground: "Ganesha as Siddhi–Vinayaka: lord of accomplishment.",
        deitiesText:
          "Mūlavar: Siddhivinayaka in black stone; also Riddhi–Siddhi shrines in precinct.",
        poojaTimings: "5:30 AM – 10:00 PM daily; extended on Tuesdays.",
        festivalsEvents:
          "Angarki Chaturthi crowds; Ganesh Chaturthi processions nearby.",
        specialities: "Modak prasad; quick darshan lanes on weekdays.",
        howToReach:
          "Dadar railway station ~2 km; taxis from Chhatrapati Shivaji Maharaj International Airport.",
        contactInfo:
          "Example only — replace with official temple desk numbers in production.",
        imageGalleryUrls: gallery("temple-siddhivinayak", 3),
        latitude: 19.0168,
        longitude: 72.8305,
      },
      {
        deityId: ganesha.id,
        nameEnglish: "Karpaga Vinayagar Temple",
        nameTamil: "கற்பக விநாயகர் கோயில்",
        city: "Pillayarpatti",
        overview:
          "Rock-cut Ganesha cave shrine in Chettinad; six feet tall bas-relief.",
        sthalaPuranam:
          "Tradition holds the idol grows in size over cosmic ages (kāla pramāṇa).",
        literaryBackground:
          "Praised in Tevaram-era hymn cycles and Chettinad oral sthala vṛttas.",
        puranaBackground:
          "Karpaka Vighneśvara as wish-fulfilling lord of the cave.",
        deitiesText:
          "Rock-cut Ganesha with two arms; consort iconography absent in main sanctum.",
        poojaTimings: "6:00 AM – 1:00 PM; 4:00 PM – 8:30 PM.",
        festivalsEvents: "Vinayaka Chaturthi; Kandar Sashti.",
        specialities: "Heritage stone architecture; nearby Chettinad mansions.",
        howToReach: "Karaikudi rail link; road from Madurai ~70 km.",
        contactInfo:
          "Devasthanam office (sample): +91-4573-000000 (replace in prod).",
        imageGalleryUrls: gallery("temple-pillayarpatti", 2),
        latitude: 10.1204,
        longitude: 78.5509,
      },
      {
        deityId: shiva.id,
        nameEnglish: "Kapaleeshwarar Temple",
        nameTamil: "கபாலீஸ்வரர் கோவில்",
        city: "Chennai",
        overview:
          "Dravidian gopuram icon of Mylapore; Shiva as Kapālin with Karpagambal.",
        sthalaPuranam:
          "Pārvatī’s penance as peahen (mayil) gives Mylapore its name.",
        literaryBackground: "Tevaram hymns; Nayanar tradition.",
        puranaBackground: "Linga of light legend in sthala purāṇam compendia.",
        deitiesText:
          "Kapaleeshvara linga with Karpagambal; Ganesha, Murugan, and planetary shrines in prakāram.",
        poojaTimings: "5:00 AM – 12:00 PM; 4:00 PM – 9:00 PM.",
        festivalsEvents: "Arupathimoovar; Panguni Uthiram teppam.",
        specialities: "Tank teppam float festival.",
        howToReach: "Chennai Metro and Mylapore bus routes.",
        contactInfo: "Temple admin (sample): info@kapaleeshwarar.example",
        imageGalleryUrls: gallery("temple-kapaleeshwarar", 3),
        latitude: 13.0339,
        longitude: 80.2687,
      },
      {
        deityId: shiva.id,
        nameEnglish: "Arunachalesvara Temple",
        nameTamil: "அருணாசலேஸ்வரர் கோவில்",
        city: "Tiruvannamalai",
        overview:
          "Massive complex at the foot of Arunachala hill; Agni linga of Panchabhuta shrines.",
        sthalaPuranam:
          "Shiva as column of fire without top or bottom (Lingodbhava).",
        literaryBackground:
          "Girivalam praised in Śaiva Tamil hymns; Ramana Maharshi’s Arunachala akṣaram.",
        puranaBackground:
          "Agni sthala of the five-element Pancha Bhūta shrines.",
        deitiesText:
          "Arunachalesvara linga; Unnamulai Amman; thousand-pillar hall deities.",
        poojaTimings: "Temple opens before dawn for Girivalam pilgrims.",
        festivalsEvents: "Karthikai Deepam lamp on the hill summit.",
        specialities: "Girivalam path ~14 km around the sacred hill.",
        howToReach: "Tiruvannamalai rail; buses from Chennai and Bengaluru.",
        contactInfo:
          "Arunachalesvara devasthanam (sample contact placeholder).",
        imageGalleryUrls: gallery("temple-arunachala", 2),
        latitude: 12.2312,
        longitude: 79.0669,
      },
      {
        deityId: vishnu.id,
        nameEnglish: "Tirupati Venkateswara Temple",
        nameTamil: "திருப்பதி வெங்கடேசுவரர் கோவில்",
        city: "Tirupati",
        overview:
          "Hill shrine of Śrīnivāsa; busiest pilgrimage economy in India.",
        sthalaPuranam:
          "Loan legend with Kubera; self-manifest sāligrāma deity.",
        literaryBackground:
          "Āḻvār and Āchārya commentarial traditions; TTD annadanam and seva manuals.",
        puranaBackground:
          "Kaliyuga Vaikuntha narrative; Venkatācalam mahātmyam cycles.",
        deitiesText:
          "Śrīnivāsa with Śrī and Bhū; Bedi Anjaneya; Vimāna Venkateswara.",
        poojaTimings: "Suprabhata before dawn; see TTD schedule for sevas.",
        festivalsEvents: "Brahmotsavam on annual calendar.",
        specialities: "Laddu prasāda; hair tonsuring hall.",
        howToReach: "Tirupati airport; ghat road or footpath to hill.",
        contactInfo:
          "TTD e-darshan / counters (sample): see official TTD site.",
        imageGalleryUrls: gallery("temple-tirupati", 3),
        latitude: 13.6833,
        longitude: 79.3477,
      },
      {
        deityId: vishnu.id,
        nameEnglish: "Sri Ranganathaswamy Temple",
        nameTamil: "ஸ்ரீரங்கநாதசுவாமி கோவில்",
        city: "Srirangam",
        overview:
          "Largest functioning Hindu temple complex; Ranganātha in reclining form.",
        sthalaPuranam:
          "Cauvery kṣetra; Ranganātha as cosmic couch on Ādi Śeṣa; many Rāmānuja associations.",
        literaryBackground: "Āḻvār hymns; Sri Vaishnava scholastic centres.",
        puranaBackground:
          "Koil sthala purāṇam compendia; paramapada gateway symbolism.",
        deitiesText:
          "Ranganātha in śayyana kolam; Ranganāyikī; Garuḍāḻvār and Hanuman shrines.",
        poojaTimings: "Early morning thiruppāvai season crowds in Mārgaḻi.",
        festivalsEvents: "Vaikuntha Ekadashi paramapada vāsal.",
        specialities:
          "Seven enclosures; Hall of 1000 pillars; sampangi pradakṣiṇa.",
        howToReach:
          "Srirangam island across Cauvery from Tiruchirappalli junction.",
        contactInfo:
          "Ranganathaswamy devasthanam (sample): office hours 6–11 AM.",
        imageGalleryUrls: gallery("temple-srirangam", 2),
        latitude: 10.8617,
        longitude: 78.6892,
      },
      {
        deityId: devi.id,
        nameEnglish: "Meenakshi Amman Temple",
        nameTamil: "மீனாட்சி அம்மன் கோவில்",
        city: "Madurai",
        overview:
          "Twin shrines for Meenakshi and Sundareshvara; hall of thousand pillars.",
        sthalaPuranam: "Meenakshi’s swayamvara and divine marriage festival.",
        literaryBackground:
          "Śaiva Tamil corpus; Madurai as seat of Tamil Saiva scholasticism.",
        puranaBackground:
          "Kadambavanam origin myths; lotus-prod goddess narrative.",
        deitiesText:
          "Meenakshi sundareśvara kalyāṇam icons; Ashta Shakti, Navagraha precinct shrines.",
        poojaTimings:
          "Gopuram opens ~4 AM; midday closure ~12:30 PM; evening reopen ~4 PM.",
        festivalsEvents:
          "Chithirai Thiruvizha chariot and celestial wedding re-enactment.",
        specialities: "Golden lotus tank; painted ceiling corridors.",
        howToReach: "Madurai airport and junction station.",
        contactInfo:
          "HR&CE / temple info desk (sample): meenakshi.example@local",
        imageGalleryUrls: gallery("temple-meenakshi", 3),
        latitude: 9.9195,
        longitude: 78.1193,
      },
      {
        deityId: devi.id,
        nameEnglish: "Dakshineswar Kali Temple",
        nameTamil: "தக்ஷிணேஸ்வர் காளி கோவில்",
        city: "Kolkata",
        overview:
          "Navaratna Bengali-style temple on the Hooghly; Rāmakrishna’s sādhanā site.",
        sthalaPuranam:
          "Rani Rashmoni’s vow; Bhavatarini as compassionate Kālī facing the river.",
        literaryBackground: "19th-century Kolkata bhakti and reform movements.",
        puranaBackground:
          "Śākta pīṭha lore intersecting with colonial-era documentation.",
        deitiesText:
          "Bhavatarini Kālī; Shiva on adjacent pavilion; twelve Śiva companions in circuit.",
        poojaTimings: "Early morning arati; busy evenings.",
        festivalsEvents: "Kali Puja; Snānayātrā at the ghat.",
        specialities:
          "Navaratna architecture; Hooghly ghat steps; dakṣiṇā-kālikā iconography.",
        howToReach:
          "Dakshineswar metro / ferry from Belur Math; Kolkata taxis.",
        contactInfo: "Temple office (sample): dakshineswar.example@local",
        imageGalleryUrls: gallery("temple-dakshineswar", 2),
        latitude: 22.6547,
        longitude: 88.3587,
      },
      {
        deityId: null,
        nameEnglish: "Heritage Test Shrine (unlinked)",
        nameTamil: "சோதனை கோவில்",
        city: "Sample City",
        overview:
          "Seed row with no deityId — tests UI when a temple is not linked to a deity profile.",
        sthalaPuranam: "Synthetic data for development only.",
        literaryBackground: "Placeholder literary note for CMS field testing.",
        puranaBackground: "Placeholder purāṇic cross-reference string.",
        deitiesText:
          "Generic mūlavar / parivāra fields left blank in production.",
        poojaTimings: "Sample: 6:00 AM – 12:00 PM; 4:00 PM – 8:00 PM.",
        festivalsEvents: "Sample utsav calendar entry.",
        specialities: "Architectural sample speciality line.",
        howToReach: "Sample City central bus stand; 2 km walk north.",
        contactInfo: "unlinked-temple@example.invalid",
        imageGalleryUrls: gallery("temple-orphan", 2),
        latitude: 12.97,
        longitude: 77.59,
      },
    ],
  });

  await prisma.avatar.createMany({
    data: [
      {
        deityId: vishnu.id,
        name: "Matsya",
        description:
          "Fish avatar restoring the Vedas from the demon Hayagriva.",
        tradition: "dashavatara",
      },
      {
        deityId: vishnu.id,
        name: "Kurma",
        description:
          "Tortoise avatar supporting Mount Mandara during the churning.",
        tradition: "dashavatara",
      },
      {
        deityId: vishnu.id,
        name: "Rama",
        description: "Prince of Ayodhya; exemplar of dharma in the Rāmāyaṇa.",
        tradition: "dashavatara",
      },
      {
        deityId: vishnu.id,
        name: "Krishna",
        description:
          "Cowherd, charioteer of the Gītā, and flute-playing lord of Vrindavan.",
        tradition: "dashavatara",
      },
      {
        deityId: shiva.id,
        name: "Nataraja",
        description:
          "Lord of the cosmic dance; chidambaram pose with fire and drum.",
        tradition: "shiva_form",
      },
      {
        deityId: shiva.id,
        name: "Bhairava",
        description:
          "Fierce form associated with dissolution, boundaries, and protection.",
        tradition: "shiva_form",
      },
    ],
  });

  await prisma.song.createMany({
    data: [
      {
        deityId: shiva.id,
        title: "Shiva Tandava Stotram (reference)",
        credit: "Traditional",
        externalUrl: "https://en.wikipedia.org/wiki/Shiva_Tandava_Stotram",
        licenseNote: "Metadata only; host audio externally with proper rights.",
      },
      {
        deityId: vishnu.id,
        title: "Vishnu Sahasranama (reference)",
        credit: "Traditional",
        externalUrl: "https://en.wikipedia.org/wiki/Vishnu_Sahasranama",
        licenseNote: "Metadata only.",
      },
      {
        deityId: ganesha.id,
        title: "Ganesha Pancharatnam (reference)",
        credit: "Traditional",
        externalUrl: "https://en.wikipedia.org/wiki/Mudakkaratha_Modakam",
        licenseNote: "Sample link for UI testing.",
      },
      {
        deityId: null,
        title: "Generic Dharma chant playlist (no deity link)",
        credit: "Seed data",
        externalUrl: "https://example.com/audio-placeholder",
        licenseNote: "Tests song detail when deityId is null.",
      },
    ],
  });

  console.log(
    "Seed completed: deities (with images), slokas, temples (rich fields + gallery + orphan), avatars, songs (incl. unlinked), festivals, mythical beings.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
