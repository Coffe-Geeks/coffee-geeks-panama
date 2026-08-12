/**
 * Carga la ficha de competencia de los participantes: frase, origen,
 * espresso, filtrado y signature drink.
 *
 * Busca cada cafetería por nombre. Si existe la actualiza, si no la crea
 * como participante activa. Cuando hay duplicados conserva el registro
 * más completo y desactiva el resto, sin borrar nada.
 *
 *   node scripts/cargar-fichas.mjs "<MONGODB_URI>" [--aplicar]
 *
 * Sin --aplicar solo muestra lo que haría.
 */
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.argv[2];
const aplicar = process.argv.includes("--aplicar");
if (!uri) {
  console.error('Uso: node scripts/cargar-fichas.mjs "<MONGODB_URI>" [--aplicar]');
  process.exit(1);
}

const FICHAS = [
  {
    buscar: "bungla",
    cafeteriaName: "Bungla Coffee House",
    tagline: "Un espacio creado para disfrutar café de especialidad, brunch y una experiencia cálida y memorable.",
    barista: "Argeli Sánchez",
    espresso: "Blend de la casa de Finca Garrido, Boquete, Panamá, compuesto por las variedades Típica, Caturra y Catuaí. Resaltan notas de vainilla, caramelo y chocolate, con cuerpo cremoso y una sensación agradable y prolongada en boca.",
    filtrado: "El filtrado de la casa: un Geisha panameño.",
    signatureDrinkName: "Pistacho Coffee",
    signatureDrink: "Bebida insignia de Bungla. Combina la intensidad y el carácter del espresso con la cremosidad y el sabor delicado del pistacho, logrando una bebida equilibrada, dulce y visualmente atractiva.",
  },
  {
    buscar: "cabrera",
    cafeteriaName: "Cabrera Coffee Brew House",
    tagline: "Lo mejor del café panameño, concentrado en una sola taza.",
    barista: "Yeneavski Cabrera",
    originStory: "Fundado en 2018 por la familia Cabrera.",
    espresso: "Pacamara natural con fermentación en frío, finca Bernardina, 1.400 msnm. Notable dulzor con notas a mora y grosella negra, cuerpo medio-alto y retrogusto persistente a cacao y frutos rojos.",
    filtrado: "V60 cerámica con filtro rápido SIBARIST. Geisha natural de finca Más Café, tueste medio-ligero, secado lento, 8% de desarrollo. Receta: 14 g, ratio 1:16, molienda 500 micras, 88 °C, bloom 0:50 y 6 vertidos. Acidez media-alta, cuerpo ligero, dulzor de azúcar morena, notas de fresa y eucalipto, con sutil amargor a cáscara de limón.",
    signatureDrinkName: "Aunt Beru",
    signatureDrink: "Espresso de SL34 tostado con mayor flujo de aire, agua y cold foam de coco, coronado con ralladura de cáscara de limón y cacao nibs.",
  },
  {
    buscar: "foodbarn",
    cafeteriaName: "FoodBarn Café",
    tagline: "Un lugar que invita a quedarse, donde el café panameño se vive con precisión y cariño.",
    barista: "José Velasco",
    espresso: "Catuai lavado de Carmen Estate, Tierras Altas, cultivado a 1.750 msnm en el Valle del Volcán Barú. Notas a almendra, toffee y chocolate dulce.",
    filtrado: "Pacamara natural de Auromar, montañas de Renacimiento, Chiriquí (1.700–1.900 msnm). Perfil intenso, gran dulzor, notas frutales y textura cremosa.",
    signatureDrinkName: "Geisha Pearl",
    signatureDrink: "Combina el perfil almendrado del Catuai con cáscara de café Geisha, de notas a tamarindo: sirope, crema y perlas de cáscara de Geisha sobre espresso Catuai con leche de avena.",
  },
  {
    buscar: "micaela",
    cafeteriaName: "La Micaela Coffee Shop — Hotel InterContinental Miramar",
    tagline: "Una taza con origen, historia y excelencia.",
    barista: "Kevin Santana",
    originStory: "Hotel InterContinental Miramar Panamá, miembro de Bern Hotels & Resorts, y La Micaela Coffee Shop. Café de nuestra finca La Micaela, en El Salto, Boquete, cultivado bajo un modelo de producción sostenible que respeta el entorno natural y trabaja en armonía con las comunidades locales. Nuestra filosofía «from farm to table» va más allá del café: en la granja también cultivamos frutas y vegetales que forman parte de la experiencia gastronómica del hotel, conectando el origen con cada taza. Kevin Santana es barista certificado por la Specialty Coffee Association (SCA).",
    espresso: "Preparado para destacar el equilibrio, cuerpo y dulzor natural del café, reflejando fielmente las características de su origen.",
    filtrado: "Sifón japonés, un método que permite una extracción limpia y aromática, resaltando la complejidad, dulzura y claridad de cada nota en taza.",
    signatureDrinkName: "La Micaela Quinta Esencia",
    signatureDrink: "Desde Botanical Lounge, un cóctel donde el café de especialidad es el protagonista y se integra con la mixología para crear una experiencia elegante, aromática y llena de identidad.",
  },
  {
    buscar: "kotowa coffee house",
    cafeteriaName: "Kotowa Coffee House",
    tagline: "Más de 100 años de historia panameña, en cada sorbo.",
    barista: "José Eguía",
    originStory: "Desde 1914 en Palo Alto, Boquete. Más de 100 años de historia como productores de café de especialidad, cacao fino de Bocas del Toro y té 100% panameño.",
    espresso: "Caturra lavado del oeste de Boquete. Acidez viva a manzana verde, cuerpo consistente y final largo con notas de frutos secos.",
    filtrado: "Método Hoop. Geisha natural de Finca Las Brujas, su finca más premiada. Dulzura envolvente, acidez brillante y matices florales y frutales.",
    signatureDrinkName: "Gemas de Panamá",
    signatureDrink: "Café de especialidad, chocolate de su finca de cacao en Bocas del Toro y té verde propio, coronada con malva artesanal y rulitos de su barra 70% dark.",
  },
  {
    buscar: "leto",
    cafeteriaName: "Leto Coffee Brew Bar & Roastery",
    tagline: "El café no solo se sirve — se construye, desde la tierra hasta la taza.",
    barista: "Sandra Orta",
    originStory: "Finca Mil Cumbres, región de Paraíso, 1.800 msnm, del productor Mario Fonseca Imendia.",
    espresso: "Shot Cup — Bourbon Sidra cultivado a 1.650 msnm desde 2018. Sabor intenso, notas frutales complejas, cuerpo sedoso y retrogusto dulce y prolongado.",
    filtrado: "Filter Cup en V60 — Geisha natural. Acidez brillante y cítrica, notas de jazmín y bergamota, lemongrass y moras negras, con retrogusto de elegante dulzura frutal.",
    signatureDrinkName: "Paraíso Cold Brew",
    signatureDrink: "Geisha en extracción fría durante 18 horas sobre esfera de hielo, agua carbonatada y mousse de mango con lemongrass.",
  },
  {
    buscar: "momo",
    cafeteriaName: "MOMO Coffee Shop",
    tagline: "No solo vienes por un café, vienes a encontrar tu momento de calma en el día.",
    barista: "Yiuseppe Trujillo",
    espresso: "Typica natural de finca MamaCata (1.500–1.650 msnm), con fermentación en TNT LAB. Acidez media-alta, notas de bayas, pera, uva y cacao.",
    filtrado: "V60 Origami. Pacamara de proceso natural anaeróbico. Notas de frutos negros maduros, licor de cacao y toque cítrico, con dulzura pronunciada y cuerpo sedoso.",
    signatureDrinkName: "Appa",
    signatureDrink: "Sirope casero de pera y especias, café Caturra natural de finca Santa María Estate, crema de pera y rodaja de pera deshidratada, servida sobre portavasos de cerámica artesanal.",
  },
  {
    buscar: "siete granos",
    cafeteriaName: "Siete Granos",
    tagline: "Encontré en el café una cultura que se convirtió en mi nuevo hogar.",
    barista: "Diego Cáceres",
    originStory: "Sucursal en Casco Antiguo.",
    espresso: "«Seven Days»: Catuaí en dos procesos, natural y lavado, para una taza balanceada con acidez característica. Acompañado de un bite de mamallena con crema láctea de ciruela y merengue de limón.",
    filtrado: "Geisha natural de la finca de Abu Coffee, tostado por Seven Days Coffee. Perfil elegante, notas frutales, gran dulzor y acidez media.",
    signatureDrinkName: "Hogar",
    signatureDrink: "Cortado con leche destilada, crema de arroz y oleo saccharum de piña, cáscara de guineo y cacao nibs. Acompañado de una «tierra» de cocada deshidratada y caviar de piña chorrerana.",
  },
  {
    buscar: "sip studio",
    cafeteriaName: "SIP Studio Café",
    tagline: "Una gran taza de café no debe ser complicada.",
    barista: "Angela Zhong",
    espresso: "Caturra lavado de Finca Candelita. Taza balanceada, dulzor natural y acidez brillante.",
    filtrado: "Geisha natural de Abu Coffee, preparado en Origami, AeroPress o Tetsu Kasuya V60. Complejidad aromática e intensidad floral.",
    signatureDrinkName: "-86 Dirty Coffee & Cascara Geisha",
    signatureDrink: "Espresso con leche infusionada en cáscara de Geisha, coronada con cacao nibs.",
  },
  {
    buscar: "sisu",
    cafeteriaName: "Sisu Coffee Studio",
    tagline: "Una taza que no necesita adornos: solo tradición y cuatro generaciones de trabajo.",
    barista: "Jeremi Martínez",
    originStory: "Lamastus Family Estates, Boquete. Desde 1918, cuatro generaciones, por encima de los 1.700 msnm.",
    filtrado: "Geisha natural de las Lamastus Family Estates, el mismo café ganador del Best of Panama con puntaje récord de 98 puntos. Notas florales y frutales, dulzor persistente y acidez brillante y elegante.",
  },
  {
    buscar: "tosto",
    cafeteriaName: "Tosto Coffee",
    tagline: "Una historia de origen, de colaboración con el productor y de respeto por el café panameño.",
    barista: "Beby Marciaga",
    originStory: "Blend base «Luba»: 100% arábigo Caturra y Catuai, a 1.300 msnm en Santa Clara, Chiriquí, con Finca Hartmann. Proceso lavado.",
    espresso: "Infusionado con cacao. Taza intensa, redonda y envolvente.",
    filtrado: "V60 con cacao y ralladura de naranja. Acidez cítrica, estructura de cacao, limpio y equilibrado.",
    signatureDrink: "Cold brew con crema de coco y dulce de leche. Nombre de la bebida pendiente de confirmar.",
  },
  {
    buscar: "toño",
    cafeteriaName: "Toño's Café Bakery",
    tagline: "El café panameño desde el origen, técnica y experiencia memorable.",
    barista: "Corina Rodríguez",
    originStory: "Finca Barú Black Mountain, Tierras Altas de Chiriquí.",
    espresso: "Geisha de proceso natural, 1.550 msnm. Cuerpo sedoso y acidez brillante.",
    filtrado: "Geisha de maceración argónica con fermentación anaeróbica de 72 horas. Notas florales intensas y frutos rojos.",
    signatureDrink: "Cold brew de Geisha natural de 20 horas, sirope de cáscara de café y cacao, extracto de flores de Geisha y crema de mascarpone con vainilla de Madagascar.",
  },
  {
    buscar: "unido",
    cafeteriaName: "Café Unido",
    tagline: "Una forma distinta de vivir el café panameño: auténtica, cercana y hecha para todos los días.",
    barista: "Manuel Lucena",
    originStory: "Tostadores de especialidad desde 2014, presentes en Panamá y Washington, DC. También desarrollan «Geishify», un blend accesible que conserva las notas florales del Geisha.",
    espresso: "«La Harpía»: blend con notas de cereza, toffee y chocolate.",
    filtrado: "Ngäbe Geisha en V60. Notas de frambuesa, mandarina y melocotón, producido por familias caficultoras de la comarca Ngäbe Buglé.",
    signatureDrinkName: "Spiced Brew",
    signatureDrink: "Cold brew de la casa con ron de coco de Pedro Mandinga, sirope de raspadura, nube de chai y garnish de chocolate oscuro.",
  },
  {
    buscar: "wkdn",
    cafeteriaName: "WKND Specialty Coffee",
    tagline: "Café de especialidad de primer nivel, en un espacio que rompe las reglas no escritas de una cafetería.",
    barista: "Kimberling Bermúdez",
    espresso: "Caturra lavado de Carmen Estate, 1.300 msnm en Volcán, Chiriquí. Cuerpo redondo con notas de chocolate, nueces y butterscotch.",
    filtrado: "Origami. Geisha de Morgan Estates, Volcán, Chiriquí, de maceración carbónica lavada. Expresión floral y cítrica, textura sedosa y limpia.",
    signatureDrinkName: "Brisa de Ciruela",
    signatureDrink: "Cold Brew de Geisha de maceración carbónica natural de Morgan Estates, con fermentación en CO₂. Notas de ciruela madura y vainilla.",
  },
];

// Sin contenido todavía: se crean o conservan, pero sin ficha
const PENDIENTES = [
  "Heritage by Kotowa Farms",
  "Valentino Siesto Club House",
];

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("users");
  const cafes = await col.find({ role: "cafeteria" }).toArray();
  console.log(`Cafeterías en la base: ${cafes.length}\n`);

  let act = 0, creadas = 0, desact = 0;

  for (const f of FICHAS) {
    const matches = cafes.filter((c) => norm(c.cafeteriaName || c.name).includes(norm(f.buscar)));

    if (matches.length === 0) {
      console.log(`+ CREAR   ${f.cafeteriaName}`);
      if (aplicar) {
        const pass = await bcrypt.hash("CG" + Math.random().toString(36).slice(2, 12), 10);
        await col.insertOne({
          name: f.cafeteriaName, lastName: "", role: "cafeteria",
          email: `${norm(f.cafeteriaName).replace(/[^a-z0-9]+/g, "-")}@pendiente.coffeegeekspanama.com`,
          password: pass, isActive: true, businessType: "coffee",
          cafeteriaName: f.cafeteriaName, tagline: f.tagline || "",
          originStory: f.originStory || "", espresso: f.espresso || "",
          filtrado: f.filtrado || "", signatureDrinkName: f.signatureDrinkName || "",
          signatureDrink: f.signatureDrink || "", mainBaristaName: f.barista || "",
          baristas: f.barista ? [{ _id: new ObjectId(), fullName: f.barista, photo: "", isHighlighted: true }] : [],
          gallery: [], competitionCategory: [], createdAt: new Date(), updatedAt: new Date(),
        });
      }
      creadas++;
      continue;
    }

    // Con duplicados se conserva el que tenga más campos llenos
    const puntaje = (c) => Object.values(c).filter((v) => v !== "" && v != null && !(Array.isArray(v) && !v.length)).length;
    matches.sort((a, b) => puntaje(b) - puntaje(a));
    const principal = matches[0];
    const copias = matches.slice(1);

    const set = {
      cafeteriaName: f.cafeteriaName, tagline: f.tagline || "",
      originStory: f.originStory || "", espresso: f.espresso || "",
      filtrado: f.filtrado || "", signatureDrinkName: f.signatureDrinkName || "",
      signatureDrink: f.signatureDrink || "", isActive: true, updatedAt: new Date(),
    };
    if (f.barista) {
      set.mainBaristaName = f.barista;
      if (!principal.baristas?.length) set.baristas = [{ _id: new ObjectId(), fullName: f.barista, photo: "", isHighlighted: true }];
    }

    console.log(`~ ACTUALIZAR ${f.cafeteriaName}${copias.length ? `  (+${copias.length} duplicado se desactiva)` : ""}`);
    if (aplicar) {
      await col.updateOne({ _id: principal._id }, { $set: set });
      for (const c of copias) await col.updateOne({ _id: c._id }, { $set: { isActive: false, updatedAt: new Date() } });
    }
    act++;
    desact += copias.length;
  }

  for (const nombre of PENDIENTES) {
    const existe = cafes.some((c) => norm(c.cafeteriaName || c.name).includes(norm(nombre.split(" ")[0])));
    console.log(`${existe ? "=" : "+"} ${existe ? "YA EXISTE" : "CREAR"}   ${nombre} (sin ficha, pendiente de confirmar)`);
    if (!existe && aplicar) {
      const pass = await bcrypt.hash("CG" + Math.random().toString(36).slice(2, 12), 10);
      await col.insertOne({
        name: nombre, lastName: "", role: "cafeteria",
        email: `${norm(nombre).replace(/[^a-z0-9]+/g, "-")}@pendiente.coffeegeekspanama.com`,
        password: pass, isActive: true, businessType: "coffee", cafeteriaName: nombre,
        tagline: "", originStory: "", espresso: "", filtrado: "",
        signatureDrinkName: "", signatureDrink: "", baristas: [], gallery: [],
        competitionCategory: [], createdAt: new Date(), updatedAt: new Date(),
      });
      creadas++;
    }
  }

  console.log(`\n${aplicar ? "APLICADO" : "SIMULACRO"} — actualizadas: ${act} · creadas: ${creadas} · duplicados desactivados: ${desact}`);
  if (!aplicar) console.log("Volver a ejecutar con --aplicar para escribir en la base.");
} finally {
  await client.close();
}
