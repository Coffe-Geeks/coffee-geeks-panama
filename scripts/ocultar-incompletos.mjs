/**
 * Oculta del listado público las cafeterías que no tienen ni fotos ni
 * ficha de competencia. No se borra nada: solo se marcan como inactivas,
 * y vuelven a aparecer en cuanto se les cargue contenido.
 *
 *   node scripts/ocultar-incompletos.mjs "<MONGODB_URI>" [--aplicar]
 */
import { MongoClient } from "mongodb";

const uri = process.argv[2];
const aplicar = process.argv.includes("--aplicar");
if (!uri) {
  console.error('Uso: node scripts/ocultar-incompletos.mjs "<MONGODB_URI>" [--aplicar]');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("users");
  const cafes = await col.find({ role: "cafeteria", isActive: true }).toArray();

  const conFoto = (c) => !!c.coverImage;
  const conFicha = (c) => !!(c.tagline || c.espresso || c.filtrado || c.signatureDrink);

  const completos = [], parciales = [], vacios = [];
  for (const c of cafes) {
    const nombre = c.cafeteriaName || c.name;
    if (conFoto(c) && conFicha(c)) completos.push([nombre, c]);
    else if (conFoto(c) || conFicha(c)) parciales.push([nombre, c, conFoto(c) ? "sin ficha" : "sin fotos"]);
    else vacios.push([nombre, c]);
  }

  console.log(`COMPLETOS — se muestran primero (${completos.length})`);
  completos.forEach(([n]) => console.log(`  ✓ ${n}`));

  console.log(`\nPARCIALES — se muestran después (${parciales.length})`);
  parciales.forEach(([n, , falta]) => console.log(`  ~ ${n}  (${falta})`));

  console.log(`\nSE OCULTAN — sin fotos ni ficha (${vacios.length})`);
  vacios.forEach(([n]) => console.log(`  · ${n}`));

  if (aplicar) {
    for (const [, c] of vacios) {
      await col.updateOne({ _id: c._id }, { $set: { isActive: false, updatedAt: new Date() } });
    }
  }

  console.log(`\n${aplicar ? "APLICADO" : "SIMULACRO"} — ocultadas: ${vacios.length}`);
  if (!aplicar) console.log("Volver a ejecutar con --aplicar para escribir en la base.");
} finally {
  await client.close();
}
