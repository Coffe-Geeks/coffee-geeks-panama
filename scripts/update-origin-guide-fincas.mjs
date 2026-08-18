/**
 * Actualiza la selección oficial de The Origin Guide sin borrar fotos,
 * contactos, galería ni experiencias existentes.
 *
 * Uso: node scripts/update-origin-guide-fincas.mjs "$MONGODB_URI"
 */
import { MongoClient, ObjectId } from "mongodb";

const uri = process.argv[2];
if (!uri) {
  console.error('Uso: node scripts/update-origin-guide-fincas.mjs "<MONGODB_URI>"');
  process.exit(1);
}

const fincas = [
  {
    aliases: ["Don Pachi Estate"],
    name: "Don Pachi Estate",
    order: 1,
    region: "Boquete",
    location: "Boquete, Chiriquí",
    altitude: 1350,
    varieties: [
      "Bourbon", "Catuai", "Caturra Amarillo", "Caturra Rojo", "Geisha",
      "Maragojype", "Mundo Novo", "Pacamara", "Pachè", "Purpurasens",
      "Typica", "Villa Sarchi",
    ],
    shortDescription:
      "Ícono de la caficultura panameña y finca pionera en la introducción de la variedad Geisha al país.",
    story:
      "Fundada en 1873, en tiempos de la Gran Colombia, Don Pachi Estate es un ícono de la caficultura panameña. En 1963 introdujo por primera vez la variedad Geisha al país, el hecho que cambió la historia del café panameño en el mundo.\n\nExtensión: 62 hectáreas. Producción: aproximadamente 110,000 kg anuales.",
    terroir:
      "Ubicada entre 1,350 y 1,700 msnm en Boquete, Chiriquí. Mantiene un trabajo permanente de protección de la biodiversidad y las fuentes de agua.",
    coffeeProfile:
      "Una colección excepcional de variedades que recorre más de un siglo de historia cafetalera panameña.",
    coverImage: "/finca-don-pachi-estate.webp",
    experience: {
      title: "Don Pachi Estate: del cafetal a la degustación",
      summary:
        "Recorrido por los cafetales, visita al laboratorio de procesamiento y degustación curada de sus cafés más representativos.",
      description:
        "Conoce las distintas variedades cultivadas en la finca, visita el laboratorio de procesamiento y cierra con una degustación curada de sus cafés más representativos.",
    },
  },
  {
    aliases: ["Carmen Estate"],
    name: "Carmen Estate",
    order: 2,
    region: "Volcán",
    location: "Volcán, Chiriquí",
    altitude: 0,
    varieties: ["Geisha"],
    processes: ["Lavado"],
    shortDescription:
      "Finca panameña reconocida internacionalmente y ganadora de Best of Panama 2023 con un Geisha lavado de 96.50 puntos.",
    story:
      "Finca panameña reconocida por su calidad y por su participación destacada en competencias internacionales. Su Geisha lavado obtuvo un récord de 96.50 puntos en Best of Panama 2023.\n\nCoffee shop aliado: WKND Specialty Coffee.",
    terroir:
      "Desde Volcán, Chiriquí, la finca conecta el origen, las variedades y los procesos con una propuesta contemporánea de café de especialidad.",
    coffeeProfile:
      "Geisha lavado reconocido con 96.50 puntos en Best of Panama 2023.",
    coverImage: "/finca-carmen-estate.webp",
    experience: {
      title: "Carmen Estate: origen y propuesta moderna",
      summary:
        "Recorrido por la finca, sus variedades y procesos, seguido de catas guiadas, bebidas especiales y una propuesta gastronómica.",
      description:
        "El visitante conoce el origen del café, la finca, las variedades y los procesos, y luego lo disfruta en una propuesta moderna con catas guiadas, bebidas especiales y un menú gastronómico que complementa la experiencia.",
    },
  },
  {
    aliases: ["Finca Garrido Specialty Coffee", "Garrido Specialty Coffee"],
    name: "Finca Garrido Specialty Coffee",
    order: 3,
    region: "Boquete",
    location: "Boquete, Chiriquí",
    varieties: ["Mokkita", "Típica", "Caturra", "Catuaí"],
    shortDescription:
      "Historia familiar y rigor científico detrás de Mokkita, una variedad propia verificada por World Coffee Research.",
    story:
      "Fundada en 1959 por Don Teodoro Garrido Bernal y hoy liderada por la segunda generación. Décadas de paciencia, tierra próspera y rigor científico reescriben el panorama cafetalero panameño con el descubrimiento de Mokkita, una variedad propia verificada genéticamente por World Coffee Research.\n\nCoffee shop aliado: Bungla Coffee House.",
    terroir:
      "Una finca de Boquete donde el legado familiar se encuentra con la investigación y la selección rigurosa del café.",
    coffeeProfile:
      "Su blend de espresso de Típica, Caturra y Catuaí es el que sirve Bungla Coffee House, con notas de vainilla, caramelo y chocolate.",
  },
  {
    aliases: ["Finca Hartmann"],
    name: "Finca Hartmann",
    order: 4,
    region: "Renacimiento",
    location: "Santa Clara, distrito de Renacimiento, Chiriquí",
    altitude: 0,
    varieties: ["Arábica"],
    producer:
      "Familia Hartmann",
    shortDescription:
      "Un legado familiar de café y conservación del bosque nativo en Santa Clara desde principios del siglo XX.",
    story:
      "Alois (Luis) St. Hartmann, inmigrante de Moravia, República Checa, llegó a Panamá a principios del siglo XX y adquirió tierras de bosque primario en Santa Clara, donde sembró los primeros cafetos. Su hijo Ratibor Hartmann consolidó la finca en los años sesenta combinando producción de café con conservación del bosque nativo.\n\nProductores: Ratibor Hartmann, Dinorah Hartmann, Ratibor Hartmann Jr., Allan Hartmann, Alexander Hartmann, Aliss Hartmann y Kelly Hartmann.\n\nCoffee shop aliado: Tosto Coffee.",
    terroir:
      "Bosque primario y caficultura conviven en Santa Clara bajo una filosofía familiar de conservación del entorno nativo.",
    coffeeProfile:
      "Café Arábica producido por una familia referente del café de especialidad panameño.",
    coverImage: "/finca-hartmann.webp",
  },
  {
    aliases: ["Barú Black Mountain", "Finca Barú Black Mountain"],
    name: "Barú Black Mountain",
    order: 5,
    region: "Volcán",
    location: "Río Colorado, Volcán, Chiriquí",
    altitude: 1550,
    shortDescription:
      "El encuentro de altitud, terroir y tradición en las laderas volcánicas de Río Colorado.",
    story:
      "El encuentro de altitud, terroir y tradición. Sus cafés expresan la riqueza del suelo volcánico y una producción enfocada en la excelencia.\n\nCoffee shop aliado: Toño's Factory / Toño's Café Bakery.",
    terroir:
      "A 1,550 msnm en Río Colorado, Volcán, la montaña y el suelo volcánico definen el carácter de cada cosecha.",
    coffeeProfile:
      "Ideal para quien quiere conocer el verdadero origen del café panameño, donde la montaña se convierte en experiencia.",
  },
  {
    aliases: ["Arango Estate"],
    name: "Arango Estate",
    order: 6,
    region: "Volcán",
    location: "Silla de Pandó, Volcán, Chiriquí",
    altitude: 1650,
    varieties: ["Geisha", "Caturra"],
    shortDescription:
      "Geisha y Caturra cultivados a 1,650 msnm en Silla de Pandó, hogar del Geisha Reserved D'or.",
    story:
      "Arango Estate cultiva café de especialidad en Silla de Pandó, Volcán, Chiriquí.",
    terroir:
      "Cultivo de altura a 1,650 msnm en Silla de Pandó.",
    coffeeProfile:
      "Producto insignia: Geisha Reserved D'or.",
    coverImage: "/finca-arango-estate.webp",
  },
  {
    aliases: ["Café Suárez"],
    name: "Café Suárez",
    order: 7,
    region: "Boquete",
    location: "Alto Quiel, Boquete, Chiriquí",
    shortDescription:
      "Más de cien años y cinco generaciones de tradición cafetalera con una visión moderna liderada por mujeres.",
    story:
      "Tradición centenaria con más de 100 años y cinco generaciones, hoy con una visión moderna liderada por mujeres que han convertido la consistencia, la innovación y la excelencia en su sello distintivo.",
    terroir:
      "Alto Quiel, en las tierras altas de Boquete, es el origen de un legado que ha pasado de generación en generación.",
    coffeeProfile:
      "Cada taza refleja historia, dedicación y pasión por el café de especialidad.",
  },
  {
    aliases: ["Finca Gloria Estate", "La Gloria Estate"],
    name: "Finca Gloria Estate",
    order: 8,
    region: "Boquete",
    location: "Montañas de Boquete, Chiriquí",
    shortDescription:
      "Desde 1914, un terroir de montaña que cultiva cafés excepcionales bajo un modelo sostenible.",
    story:
      "Desde 1914, un terroir que ha trascendido generaciones. Finca Gloria Estate cultiva cafés excepcionales bajo un modelo de producción sostenible y una rigurosa selección manual de cada cosecha.",
    terroir:
      "Las montañas de Boquete y una filosofía de respeto por el medio ambiente sostienen un legado de más de un siglo.",
    coffeeProfile:
      "Reconocida por sus variedades exóticas. El lujo comienza en el origen.",
  },
  {
    aliases: ["Café Gran del Val"],
    name: "Café Gran del Val",
    order: 9,
    region: "Boquete",
    location: "Tierras altas de Boquete, Chiriquí",
    shortDescription:
      "Legado familiar de más de un siglo construido alrededor de la calidad y la innovación.",
    story:
      "Legado familiar centenario construido alrededor de la calidad y la innovación.\n\nCoffee shop aliado: Máncora.",
    terroir:
      "Las tierras altas de Boquete albergan una tradición que supera el siglo de trayectoria.",
    coffeeProfile:
      "Cada visita permite descubrir cómo la tradición sigue impulsando algunos de los mejores cafés de Panamá.",
  },
  {
    aliases: ["Hacienda Rogusta"],
    name: "Hacienda Rogusta",
    order: 10,
    region: "Otra",
    location: "San Pedro, Penonomé, Coclé",
    altitude: 0,
    varieties: ["Robusta", "Arábica"],
    shortDescription:
      "La única finca de la selección fuera de Chiriquí y la única que trabaja Robusta.",
    story:
      "Fundada en 2013, Hacienda Rogusta impulsa el cultivo de Robusta desde 2016 y también trabaja otras variedades de Arábica.",
    terroir:
      "Ubicada en San Pedro, Penonomé, Coclé, amplía el mapa de la ruta cafetera hacia las provincias centrales.",
    coffeeProfile:
      "Su trabajo con Robusta aporta un perfil y una perspectiva únicos dentro de la selección.",
  },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const collection = client.db().collection("fincas");
  const now = new Date();

  for (const finca of fincas) {
    const { aliases, experience, ...fields } = finca;
    const existing = await collection.findOne({ name: { $in: aliases } });

    if (existing) {
      const update = { ...fields, isActive: true, updatedAt: now };
      // Si no llegó un dato nuevo, conserva el valor ya publicado.
      for (const key of ["altitude", "producer", "varieties", "processes"]) {
        if (!(key in finca)) delete update[key];
      }

      if (experience) {
        const experiences = Array.isArray(existing.experiences) ? [...existing.experiences] : [];
        const index = experiences.findIndex((item) => item.title === experience.title);
        const value = {
          _id: index >= 0 ? experiences[index]._id : new ObjectId(),
          ...experience,
          image: index >= 0 ? experiences[index].image || "" : "",
          duration: index >= 0 ? experiences[index].duration || "" : "",
          capacity: index >= 0 ? experiences[index].capacity || 0 : 0,
          price: index >= 0 ? experiences[index].price || 0 : 0,
          currency: "USD",
          includes: index >= 0 ? experiences[index].includes || [] : [],
          languages: index >= 0 ? experiences[index].languages || ["Español"] : ["Español"],
          isActive: true,
          order: 1,
        };
        if (index >= 0) experiences[index] = value;
        else experiences.push(value);
        update.experiences = experiences;
      }

      await collection.updateOne({ _id: existing._id }, { $set: update });
      console.log(`Actualizada: ${fields.name}`);
    } else {
      const experiences = experience
        ? [{
            _id: new ObjectId(),
            ...experience,
            image: "",
            duration: "",
            capacity: 0,
            price: 0,
            currency: "USD",
            includes: [],
            languages: ["Español"],
            isActive: true,
            order: 1,
          }]
        : [];

      await collection.insertOne({
        ...fields,
        producer: fields.producer || "",
        altitude: fields.altitude || 0,
        varieties: fields.varieties || [],
        processes: fields.processes || [],
        description: "",
        coverImage: fields.coverImage || "",
        gallery: [],
        website: "",
        instagram: "",
        whatsapp: "",
        email: "",
        lat: null,
        lng: null,
        isActive: true,
        experiences,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`Creada: ${fields.name}`);
    }
  }

  console.log(`Total de fincas activas: ${await collection.countDocuments({ isActive: true })}`);
} finally {
  await client.close();
}
