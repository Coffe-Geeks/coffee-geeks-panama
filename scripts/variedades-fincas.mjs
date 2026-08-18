/**
 * Ajuste A4: variedades de café en las fichas de The Origin Guide.
 *
 * - Rellena las fichas sin variedades con el listado indicado.
 * - Normaliza la escritura en todas (Catuaí con tilde, Typica sin tilde),
 *   que es lo que pide el criterio de aceptación.
 *
 * No sobrescribe las variedades ya documentadas de cada finca.
 *
 *   node scripts/variedades-fincas.mjs "<MONGODB_URI>" [--aplicar]
 */
import { MongoClient } from "mongodb";

const uri = process.argv[2];
const aplicar = process.argv.includes("--aplicar");
if (!uri) {
  console.error('Uso: node scripts/variedades-fincas.mjs "<MONGODB_URI>" [--aplicar]');
  process.exit(1);
}

const POR_DEFECTO = ["Geisha", "Caturra", "Catuaí", "Typica", "Bourbon", "Pacamara", "Java"];

// Una misma variedad venía escrita de varias formas entre fincas
const NORMALIZA = {
  catuai: "Catuaí", catuaí: "Catuaí",
  típica: "Typica", typica: "Typica",
  geisha: "Geisha", gesha: "Geisha",
  caturra: "Caturra", bourbon: "Bourbon", pacamara: "Pacamara", java: "Java",
  maragogype: "Maragogype", maragojype: "Maragogype", maragogipe: "Maragogype",
  "mundo novo": "Mundo Novo", "villa sarchi": "Villa Sarchi",
  arábica: "Arábica", arabica: "Arábica", robusta: "Robusta",
};
const limpia = (v) => NORMALIZA[v.trim().toLowerCase()] || v.trim();

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("fincas");
  const fincas = await col.find({}).sort({ order: 1, name: 1 }).toArray();

  let rellenadas = 0, normalizadas = 0;
  for (const f of fincas) {
    const actuales = Array.isArray(f.varieties) ? f.varieties.filter(Boolean) : [];
    let nuevas;

    if (actuales.length === 0) {
      nuevas = [...POR_DEFECTO];
      console.log(`+ ${f.name.padEnd(34)} se rellena con las ${nuevas.length} variedades`);
      rellenadas++;
    } else {
      nuevas = [...new Set(actuales.map(limpia))];
      if (JSON.stringify(nuevas) !== JSON.stringify(actuales)) {
        console.log(`~ ${f.name.padEnd(34)} ${actuales.join(", ")}`);
        console.log(`  ${" ".repeat(34)} → ${nuevas.join(", ")}`);
        normalizadas++;
      } else {
        console.log(`= ${f.name.padEnd(34)} sin cambios`);
        continue;
      }
    }
    if (aplicar) await col.updateOne({ _id: f._id }, { $set: { varieties: nuevas, updatedAt: new Date() } });
  }

  const sinVar = await col.countDocuments({ $or: [{ varieties: { $size: 0 } }, { varieties: { $exists: false } }] });
  console.log(`\n${aplicar ? "APLICADO" : "SIMULACRO"} — rellenadas: ${rellenadas} · normalizadas: ${normalizadas}`);
  if (aplicar) console.log(`fichas sin variedades tras el ajuste: ${sinVar}`);
  else console.log("Volver a ejecutar con --aplicar para escribir en la base.");
} finally {
  await client.close();
}
