/**
 * Siembra fincas de EJEMPLO para ver la estructura funcionando.
 * Todos los textos y fotos son placeholder: reemplázalos desde /admin/fincas.
 *
 *   node scripts/seed-fincas.mjs "mongodb://127.0.0.1:27017/coffee_geeks"
 */
import { MongoClient, ObjectId } from "mongodb";

const uri = process.argv[2];
if (!uri) {
  console.error('Uso: node scripts/seed-fincas.mjs "<MONGODB_URI>"');
  process.exit(1);
}

const img = (id) => `https://images.unsplash.com/photo-${id}?w=1400&q=75`;

const now = new Date();

const fincas = [
  {
    name: "Finca La Neblina",
    producer: "Familia Him",
    region: "Boquete",
    location: "Alto Quiel, Boquete",
    altitude: 1650,
    varieties: ["Geisha", "Caturra", "Typica"],
    processes: ["Lavado", "Natural"],
    shortDescription:
      "PLACEHOLDER · Geisha de altura en las laderas del Barú, con la neblina que le da nombre.",
    story:
      "PLACEHOLDER · Tres generaciones sembrando en la misma ladera. La finca empezó como un cafetal familiar de dos hectáreas y hoy exporta microlotes a Japón y Noruega, sin dejar de cosechar a mano grano por grano.",
    terroir:
      "PLACEHOLDER · A 1.650 msnm, la neblina que baja del volcán Barú cada tarde alarga la maduración de la cereza. Suelo volcánico profundo, sombra de guineo y árboles nativos, y una diferencia de 12 grados entre el día y la noche que concentra los azúcares.",
    coffeeProfile:
      "PLACEHOLDER · Taza floral y limpia: jazmín, bergamota y durazno blanco. Acidez cítrica brillante, cuerpo sedoso y un final largo que recuerda a té negro.",
    coverImage: img("1500051638674-ff996a0ec29e"),
    gallery: [img("1524350876685-274059332603"), img("1447933601403-0c6688de566e"), img("1442512595331-e89e73853f31")],
    website: "",
    instagram: "",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 1,
    experiences: [
      {
        title: "Del cafetal a la taza",
        summary:
          "PLACEHOLDER · Recorrido completo por el cafetal, el beneficio húmedo y cierre con cata de tres microlotes.",
        description: "",
        image: img("1447933601403-0c6688de566e"),
        duration: "4 horas",
        capacity: 12,
        price: 65,
        currency: "USD",
        includes: ["Transporte desde Boquete", "Cata guiada", "Almuerzo típico"],
        languages: ["Español", "Inglés"],
        isActive: true,
        order: 1,
      },
      {
        title: "Cosecha con el productor",
        summary:
          "PLACEHOLDER · Sales al cafetal en plena cosecha, recoges tu propia canasta y aprendes a seleccionar la cereza madura.",
        description: "",
        image: img("1524350876685-274059332603"),
        duration: "3 horas",
        capacity: 8,
        price: 45,
        currency: "USD",
        includes: ["Canasta y equipo", "Refrigerio"],
        languages: ["Español"],
        isActive: true,
        order: 2,
      },
    ],
  },
  {
    name: "Hacienda Río Sereno",
    producer: "Cooperativa Los Andes",
    region: "Renacimiento",
    location: "Río Sereno, Renacimiento",
    altitude: 1420,
    varieties: ["Catuai", "Bourbon"],
    processes: ["Honey", "Lavado"],
    shortDescription:
      "PLACEHOLDER · Cooperativa de 40 familias productoras en la frontera con Costa Rica.",
    story:
      "PLACEHOLDER · Cuarenta familias que decidieron unirse para procesar y exportar juntas. Cada socio trae su cosecha al beneficio común, donde se separa por lote y por altura antes del secado.",
    terroir:
      "PLACEHOLDER · Ladera fresca a 1.420 msnm con lluvia bien repartida todo el año. El suelo arcilloso retiene humedad y la sombra de laureles modera la temperatura, dando maduraciones parejas.",
    coffeeProfile:
      "PLACEHOLDER · Perfil dulce y equilibrado: panela, cacao y naranja madura. Cuerpo medio, acidez suave y postgusto a chocolate con leche.",
    coverImage: img("1442512595331-e89e73853f31"),
    gallery: [img("1500051638674-ff996a0ec29e"), img("1524350876685-274059332603")],
    website: "",
    instagram: "",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 2,
    experiences: [
      {
        title: "Un día en la cooperativa",
        summary:
          "PLACEHOLDER · Conoce cómo cuarenta familias procesan juntas: recepción, despulpado, patios de secado y catación.",
        description: "",
        image: img("1442512595331-e89e73853f31"),
        duration: "5 horas",
        capacity: 15,
        price: 55,
        currency: "USD",
        includes: ["Recorrido por el beneficio", "Catación", "Café para llevar"],
        languages: ["Español", "Inglés"],
        isActive: true,
        order: 1,
      },
    ],
  },
  {
    name: "Finca Alto Volcán",
    producer: "Rodolfo Serrano",
    region: "Volcán",
    location: "Paso Ancho, Volcán",
    altitude: 1800,
    varieties: ["Geisha", "Pacamara"],
    processes: ["Anaeróbico", "Natural"],
    shortDescription:
      "PLACEHOLDER · Microlotes experimentales de fermentación controlada a 1.800 msnm.",
    story:
      "PLACEHOLDER · Rodolfo dejó la ingeniería para volver a la finca de su padre y convertirla en un laboratorio de fermentaciones. Cada cosecha prueba variables nuevas y documenta cada lote.",
    terroir:
      "PLACEHOLDER · El punto más alto del circuito, a 1.800 msnm. Noches frías, suelo volcánico joven y viento constante del Pacífico que obliga a la planta a madurar despacio.",
    coffeeProfile:
      "PLACEHOLDER · Intenso y aromático: frutos rojos fermentados, lichi y un dejo a vino. Acidez vibrante, cuerpo jugoso y final prolongado.",
    coverImage: img("1447933601403-0c6688de566e"),
    gallery: [img("1447933601403-0c6688de566e"), img("1442512595331-e89e73853f31"), img("1500051638674-ff996a0ec29e")],
    website: "",
    instagram: "",
    whatsapp: "",
    email: "",
    isActive: true,
    order: 3,
    experiences: [
      {
        title: "Taller de fermentaciones",
        summary:
          "PLACEHOLDER · Entiende cómo la fermentación anaeróbica transforma el perfil de la taza, probando lotes lado a lado.",
        description: "",
        image: img("1500051638674-ff996a0ec29e"),
        duration: "6 horas",
        capacity: 10,
        price: 95,
        currency: "USD",
        includes: ["Taller práctico", "Cata comparativa", "Almuerzo", "Bolsa de 250g"],
        languages: ["Español", "Inglés"],
        isActive: true,
        order: 1,
      },
      {
        title: "Amanecer en el cafetal",
        summary:
          "PLACEHOLDER · Subes antes del amanecer, desayunas mirando el volcán y bajas catando lo que se cosechó ese día.",
        description: "",
        image: img("1524350876685-274059332603"),
        duration: "3 horas",
        capacity: 6,
        price: 40,
        currency: "USD",
        includes: ["Desayuno", "Cata"],
        languages: ["Español"],
        isActive: true,
        order: 2,
      },
    ],
  },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("fincas");

  const existing = await col.countDocuments();
  if (existing > 0) {
    console.log(`La colección ya tiene ${existing} fincas. Borrando las de ejemplo...`);
    await col.deleteMany({ shortDescription: /^PLACEHOLDER/ });
  }

  // Mongoose genera _id para los subdocumentos; el driver crudo no, así que lo hacemos aquí
  const docs = fincas.map((f) => ({
    ...f,
    experiences: f.experiences.map((e) => ({ _id: new ObjectId(), ...e })),
    createdAt: now,
    updatedAt: now,
  }));
  const res = await col.insertMany(docs);
  const totalExp = fincas.reduce((s, f) => s + f.experiences.length, 0);
  console.log(`✓ ${res.insertedCount} fincas y ${totalExp} experiencias sembradas.`);
} finally {
  await client.close();
}
