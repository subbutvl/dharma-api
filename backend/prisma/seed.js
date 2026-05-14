/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
  await prisma.deity.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.mythicalBeing.deleteMany();

  const festivals = await prisma.festival.createMany({
    data: [
      {
        slug: "maha-shivaratri",
        name: "Maha Shivaratri",
        description: "Great night of Shiva; fasting and vigil.",
      },
      {
        slug: "navaratri",
        name: "Navaratri",
        description: "Nine nights honoring the goddess in her many forms.",
      },
      {
        slug: "diwali",
        name: "Diwali",
        description: "Festival of lights; significance varies by tradition.",
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
        lore: { textSource: "Ramayana" },
      },
      {
        slug: "kubera",
        name: "Kubera",
        kind: "yaksha",
        description: "Lord of wealth and guardian of the northern direction.",
      },
      {
        slug: "vasuki",
        name: "Vasuki",
        kind: "naga",
        description:
          "Serpent king used as churning rope in the Samudra Manthan.",
      },
      {
        slug: "hanuman",
        name: "Hanuman",
        kind: "mythical",
        description: "Divine vanara devotee of Rama.",
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
        primaryImageUrl: null,
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

  const fs = [
    prisma.festival.findUnique({ where: { slug: "maha-shivaratri" } }),
    prisma.festival.findUnique({ where: { slug: "navaratri" } }),
    prisma.festival.findUnique({ where: { slug: "diwali" } }),
  ];
  const [fShiv, fNav, fDiwali] = await Promise.all(fs);

  await prisma.deityFestival.createMany({
    data: [
      { deityId: shiva.id, festivalId: fShiv.id },
      { deityId: devi.id, festivalId: fNav.id },
      { deityId: vishnu.id, festivalId: fDiwali.id },
      { deityId: ganesha.id, festivalId: fDiwali.id },
    ],
  });

  await prisma.sloka.createMany({
    data: [
      {
        deityId: ganesha.id,
        title: "Vakratunda Mahakaya",
        sanskrit: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।",
        transliteration: "Vakratunda mahakaya suryakoti samaprabha",
        meaning: "Salutations to the mighty one with a curved trunk.",
      },
      {
        deityId: ganesha.id,
        title: "Ganesha Gayatri",
        sanskrit: "ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि ।",
        transliteration: "Om ekadantaya vidmahe vakratundaya dhimahi",
        meaning: "Meditation mantra for Ganesha.",
      },
      {
        deityId: shiva.id,
        title: "Shiva Panchakshara",
        sanskrit: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।",
        transliteration:
          "Nagendraharaya trilochanaya bhasmangaragaya maheshvaraya",
        meaning: "Praise of Shiva adorned with serpent and ash.",
      },
      {
        deityId: shiva.id,
        title: "Rudrashtakam (excerpt)",
        sanskrit: "नमामि शमीशान निर्वाण रूपम् ।",
        transliteration: "Namami shamishana nirvana rupam",
        meaning: "Salutations to the formless auspicious Lord.",
      },
      {
        deityId: vishnu.id,
        title: "Vishnu Sahasranama (excerpt)",
        sanskrit: "विष्वक्षसेनमसृताय नमः ।",
        transliteration: "Vishvakshenamasritaya namah",
        meaning: "Salutation to Vishnu as commander of the hosts.",
      },
      {
        deityId: devi.id,
        title: "Durga Stuti (excerpt)",
        sanskrit: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।",
        transliteration: "Sarva mangala mangalye shive sarvartha sadhike",
        meaning: "Salutations to the auspicious one who grants every goal.",
      },
    ],
  });

  const templeRows = [];
  for (const d of [ganesha, shiva, vishnu, devi]) {
    const w = /** @type {any} */ (d.worship || {});
    const list = w.temples || [];
    for (const t of list) {
      templeRows.push({
        deityId: d.id,
        nameEnglish: t.name,
        city: t.location,
        overview: "Major pilgrimage site",
        latitude: null,
        longitude: null,
      });
    }
  }
  await prisma.temple.createMany({ data: templeRows });

  await prisma.avatar.createMany({
    data: [
      {
        deityId: vishnu.id,
        name: "Matsya",
        description: "Fish avatar restoring the Vedas.",
        tradition: "dashavatara",
      },
      {
        deityId: vishnu.id,
        name: "Kurma",
        description: "Tortoise avatar supporting Mount Mandara.",
        tradition: "dashavatara",
      },
      {
        deityId: vishnu.id,
        name: "Rama",
        description: "Prince of Ayodhya; exemplar of dharma.",
        tradition: "dashavatara",
      },
      {
        deityId: shiva.id,
        name: "Nataraja",
        description: "Lord of the cosmic dance.",
        tradition: "shiva_form",
      },
      {
        deityId: shiva.id,
        name: "Bhairava",
        description: "Fierce form associated with dissolution and protection.",
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
    ],
  });

  console.log(
    "Seed completed: deities, slokas, temples, avatars, songs, festivals, mythical beings.",
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
