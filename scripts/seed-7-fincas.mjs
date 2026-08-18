import { MongoClient, ObjectId } from "mongodb";

const uri = process.argv[2];
if (!uri) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

const now = new Date();

const fincas = [
  {
    name: "Hacienda Rogusta",
    producer: "Juan Mauricio Rojas",
    region: "Otra",
    location: "San Pedro Arriba, Penonome, Coclé",
    altitude: 0,
    varieties: ["Robusta", "Obata", "Catimor"],
    processes: [],
    shortDescription: "Una finca que ha impulsado la variedad robusta desde el 2016 pero también trabajando otras variedades de arábica.",
    story: "Desde el 2020 hemos sido el café oficial de Copa Airlines. Representamos a la primera generación como productores de café.",
    terroir: "",
    coffeeProfile: "83 Puntos Fine Robusta Honey",
    coverImage: "/uploads/ROGUSTA ENE-FEB 2026-257.jpg",
    gallery: [
      "/uploads/ROGUSTA ENE-FEB 2026-252.jpg",
      "/uploads/ROGUSTA ENE-FEB 2026-253.jpg",
    ],
    website: "www.caferogusta.com",
    instagram: "caferogusta",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 1,
    experiences: [
      {
        title: "Mini tours en el beneficio",
        summary: "Se puede hacer mini tours en ocasiones especiales del beneficio.",
        description: "Proceso completo de beneficio, cafetales, tueste y empaques. Disponible para la temporada 2027.",
        image: "/uploads/ROGUSTA ENE-FEB 2026-252.jpg",
        duration: "",
        capacity: 0,
        price: 0,
        currency: "USD",
        includes: [],
        languages: ["Español"],
        isActive: true,
        order: 1,
      },
    ],
  },
  {
    name: "Garrido Specialty Coffee",
    producer: "Gissell Lorena Garrido Ortega",
    region: "Boquete",
    location: "Boquete, Chiriquí",
    altitude: 1700,
    varieties: ["Geisha", "Mokkita", "Mokka", "Sudan Rume", "SL28", "Catuai", "Pacamara", "Heirloom Ethiopian"],
    processes: ["Natural", "Lavado", "Honey", "Fermentaciones controladas"],
    shortDescription: "Segunda generación combinando tradición, innovación y ciencia desde 1959.",
    story: "Nuestra historia comenzó en 1959, cuando don Teodoro Garrido Bernal inició la producción de café en las montañas de Boquete. Hoy, como segunda generación, continuamos ese legado con una visión que combina tradición, innovación y ciencia. Nuestra familia ha dedicado décadas a preservar y estudiar variedades excepcionales, lo que llevó al descubrimiento y desarrollo de Mokkita, cuya identidad genética fue verificada por World Coffee Research.",
    terroir: "Fincas: Cantera, Margarita, Volcancito, Los Rosales.",
    coffeeProfile: "Mokkita (92.25 pts): Jazmín, Flor blanca, Frutas tropicales. Geisha (90-95+ pts): Bergamota, Jazmín. Sudan Rume (90+ pts). SL28 (88-91+ pts). Mokka (89-92+ pts).",
    coverImage: "/uploads/GARRIDOCOFFEE62025.jpg",
    gallery: [
      "/uploads/GARRIDOCOFFEE122025.jpg",
      "/uploads/GARRIDOCOFFEE202025.jpg",
      "/uploads/GARRIDOCOFFEE272025.jpg",
      "/uploads/GARRIDOCOFFEE282025.jpg",
    ],
    website: "https://garridocoffee.com/home",
    instagram: "@garridospecialtycoffee",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 2,
    experiences: [
      {
        title: "Experiencia Inmersiva",
        summary: "De la semilla a la taza: Recorrido por las fincas, beneficio, áreas de fermentación, secado y cata profesional.",
        description: "Historia de la familia Garrido desde 1959. Explicación de variedades cultivadas. Visita al beneficio. Cata profesional guiada de diferentes perfiles. Compra de cafés exclusivos en finca.",
        image: "/uploads/GARRIDOCOFFEE122025.jpg",
        duration: "",
        capacity: 0,
        price: 0,
        currency: "USD",
        includes: ["Recorrido", "Cata", "Asesoría de preparación"],
        languages: ["Español", "Inglés"],
        isActive: true,
        order: 1,
      },
    ],
  },
  {
    name: "Finca Barú Black Mountain",
    producer: "Petros Korakianitis",
    region: "Volcán",
    location: "Volcán, tierras altas, río colorado",
    altitude: 1500,
    varieties: ["Catuai", "Caturra", "Geisha", "Pacamara", "Maragogipe", "Centroamericano"],
    processes: ["Anaeróbico", "Natural", "Lavado", "Honey"],
    shortDescription: "Explorando técnicas innovadoras como la maceración argónica para perfiles diferenciados.",
    story: "Primera generación. Destaca por la consistencia de su producción y la autenticidad de sus procesos. Constantemente explora técnicas innovadoras para desarrollar perfiles de taza diferenciados. Participación con clasificación en SCAP en la categoría varietales y Geisha.",
    terroir: "",
    coffeeProfile: "Geisha: Florales y balanceado (89/93 pts). Pachamama: Afrutados (89 pts). Catuai Natural: Frutales y achocolatados (88 pts). Centroamericano Natural: Frutal balanceado (89 pts).",
    coverImage: "/uploads/DSC05446.jpg",
    gallery: [
      "/uploads/DSC05519.jpg",
      "/uploads/DSC05634.jpg",
      "/uploads/DSC05682.jpg",
      "/uploads/DSC05760.jpg",
    ],
    website: "www.barublackmountain.com",
    instagram: "barublackmountain",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 3,
    experiences: [
      {
        title: "Cataciones y degustaciones",
        summary: "Cataciones y degustaciones de diferentes variedades y procesos.",
        description: "Ofrecemos degustación de cafés de especialidad en grano de nuestras diversas variedades.",
        image: "/uploads/DSC05519.jpg",
        duration: "",
        capacity: 0,
        price: 0,
        currency: "USD",
        includes: ["Cata de café"],
        languages: ["Español"],
        isActive: true,
        order: 1,
      },
    ],
  },
  {
    name: "La Gloria Estate",
    producer: "Veronica Suarez",
    region: "Boquete",
    location: "Horqueta - Boquete, Chiriquí",
    altitude: 0,
    varieties: ["Typica", "Caturra", "Java", "Maragogype", "Geisha"],
    processes: [],
    shortDescription: "Finca cafetalera familiar establecida desde 1914. Control integral 'de la semilla a la taza'.",
    story: "Cuarta generación. Más que una finca, La Gloria Estate es un legado vivo. Durante más de un siglo, nuestra familia ha cultivado conocimiento, disciplina y respeto por la tierra. Control integral del proceso: desde la siembra hasta el tostado final.",
    terroir: "",
    coffeeProfile: "",
    coverImage: "/uploads/20250103221614__MG_6390_083957.jpg",
    gallery: [
      "/uploads/20250103205914__MG_6276_083829.jpg",
      "/uploads/20250103192048__MG_6153_084138 (1).jpg",
      "/uploads/20250103190827__MG_6129_084544.jpg",
      "/uploads/La Gloria and Volcan Baru.jpeg",
    ],
    website: "www.lagloriacoffee.com",
    instagram: "la_gloria_coffee",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 4,
    experiences: [],
  },
  {
    name: "Café Suárez",
    producer: "Idis Suarez",
    region: "Boquete",
    location: "Alto Quiel, Vía los Naranjos",
    altitude: 0,
    varieties: [],
    processes: [],
    shortDescription: "Quinta generación de productores. Finca operada por mujeres (Women owned).",
    story: "5 generaciones cultivando el café de Panamá. Women owned.",
    terroir: "",
    coffeeProfile: "",
    coverImage: "/uploads/IMG_6082.jpeg",
    gallery: [
      "/uploads/428b6aa0-0a54-47f9-9924-a2f89d767650.jpeg",
      "/uploads/IMG_0133.jpeg",
      "/uploads/IMG_0141.jpeg",
      "/uploads/IMG_0137.jpeg",
    ],
    website: "www.cafesuarez.com",
    instagram: "@cafesuarezpananama",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 5,
    experiences: [],
  },
  {
    name: "Café Gran del Val",
    producer: "Ricardo Fernández de Obarrio",
    region: "Boquete",
    location: "Ave. Principal Bajo Mono, Los Naranjos, Boquete",
    altitude: 0,
    varieties: [],
    processes: [],
    shortDescription: "Finca Paraíso. Produciendo café de la semilla a la taza desde 1914.",
    story: "Cuarta generación. Desde 1914 produciendo café, hacemos todo: de semilla a la taza, respetando la naturaleza, con altos estándares de calidad en nuestros procesos.",
    terroir: "",
    coffeeProfile: "",
    coverImage: "/uploads/Gran del Val - finca-4.jpg",
    gallery: [
      "/uploads/Gran del Val - instalaciones-105.jpg",
      "/uploads/Gran del Val - instalaciones-3 (1).jpg",
      "/uploads/Gran del Val - lote-20 (1).jpg",
      "/uploads/Gran del Val - lote-22.jpg",
    ],
    website: "www.cafegrandelval.com",
    instagram: "@cafegrandeval",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 6,
    experiences: [],
  },
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db().collection("fincas");

    console.log("Conectado a la base de datos.");
    
    let upserted = 0;
    let modified = 0;

    for (const f of fincas) {
      const doc = {
        ...f,
        experiences: f.experiences.map((e) => ({ _id: new ObjectId(), ...e })),
        updatedAt: now,
      };

      const result = await col.updateOne(
        { name: f.name },
        { 
          $set: doc,
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );

      if (result.upsertedId) upserted++;
      if (result.modifiedCount > 0) modified++;
    }
    
    console.log(`✓ ${upserted} fincas creadas nuevas y ${modified} actualizadas.`);
  } catch (error) {
    console.error("Error al insertar/actualizar fincas:", error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

run();
