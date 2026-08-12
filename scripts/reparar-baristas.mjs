/**
 * Repara baristas guardados sin _id.
 *
 * Mongoose genera un _id para cada subdocumento, pero los insertados con
 * el driver crudo no lo llevan. getLeaderboard hace ...?._id.toString()
 * sobre el barista destacado, y sin _id la página de votaciones responde 500.
 *
 *   node scripts/reparar-baristas.mjs "<MONGODB_URI>" [--aplicar]
 */
import { MongoClient, ObjectId } from "mongodb";

const uri = process.argv[2];
const aplicar = process.argv.includes("--aplicar");
if (!uri) {
  console.error('Uso: node scripts/reparar-baristas.mjs "<MONGODB_URI>" [--aplicar]');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("users");
  const cafes = await col.find({ role: "cafeteria", "baristas.0": { $exists: true } }).toArray();

  let reparados = 0;
  for (const c of cafes) {
    const faltan = c.baristas.filter((b) => !b._id).length;
    if (!faltan) continue;

    const baristas = c.baristas.map((b) => (b._id ? b : { ...b, _id: new ObjectId() }));
    console.log(`  ${(c.cafeteriaName || c.name).padEnd(48)} ${faltan} sin _id`);
    if (aplicar) await col.updateOne({ _id: c._id }, { $set: { baristas, updatedAt: new Date() } });
    reparados++;
  }

  console.log(`\n${aplicar ? "APLICADO" : "SIMULACRO"} — cafeterías reparadas: ${reparados}`);
  if (!aplicar) console.log("Volver a ejecutar con --aplicar para escribir en la base.");
} finally {
  await client.close();
}
