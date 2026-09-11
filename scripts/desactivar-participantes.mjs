/**
 * Desactiva participantes sin borrarlos.
 *
 * Nunca elimina: pone isActive en false y deja el registro intacto. Un
 * participante borrado se lleva por delante sus votos, sus fotos y
 * cualquier referencia; uno desactivado desaparece del sitio y se puede
 * revertir en un segundo.
 *
 *   node scripts/desactivar-participantes.mjs "<MONGODB_URI>" correo1 correo2 …
 *   node scripts/desactivar-participantes.mjs "<MONGODB_URI>" --aplicar correo1 …
 *
 * También acepta --revertir para volver a activarlos.
 */
import { MongoClient } from "mongodb";

const [, , uri, ...resto] = process.argv;
const aplicar = resto.includes("--aplicar");
const revertir = resto.includes("--revertir");
const correos = resto.filter((a) => !a.startsWith("--")).map((c) => c.toLowerCase());

if (!uri || !correos.length) {
  console.error('Uso: node scripts/desactivar-participantes.mjs "<MONGODB_URI>" [--aplicar] [--revertir] correo1 correo2 …');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const users = client.db().collection("users");

  console.log(revertir ? "Se reactivarían:" : "Se desactivarían:");
  let encontrados = 0;

  for (const correo of correos) {
    const u = await users.findOne({ email: correo });
    if (!u) { console.log(`  ✗ no existe: ${correo}`); continue; }
    encontrados++;
    const estado = u.isActive === false ? "inactivo" : "activo";
    console.log(`  · ${(u.name || "")} ${(u.lastName || "")}`.trimEnd() +
                `  <${u.email}>  rol: ${u.role}  estado actual: ${estado}`);
  }

  if (!aplicar) {
    console.log(`\n${encontrados} coincidencias. Simulación: agrega --aplicar para escribir.`);
    process.exit(0);
  }

  const r = await users.updateMany(
    { email: { $in: correos } },
    { $set: { isActive: revertir } }
  );
  console.log(`\n${r.modifiedCount} registros ${revertir ? "reactivados" : "desactivados"}. No se borró nada.`);
} finally {
  await client.close();
}
