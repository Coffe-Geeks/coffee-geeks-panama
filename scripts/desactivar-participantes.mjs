/**
 * Desactiva participantes sin borrarlos.
 *
 * Nunca elimina: pone isActive en false y deja el registro intacto. Un
 * participante borrado se lleva por delante sus votos, sus fotos y
 * cualquier referencia; uno desactivado desaparece del sitio y se puede
 * revertir en un segundo.
 *
 * Acepta correos o nombres. Los nombres se buscan de forma aproximada
 * —sin acentos y sin distinguir mayúsculas— porque en la base están
 * escritos de maneras distintas; por eso la simulación es obligatoria
 * antes de escribir: hay que leer a quién encontró.
 *
 *   node scripts/desactivar-participantes.mjs "<URI>" "Angie Aparicio" …
 *   node scripts/desactivar-participantes.mjs "<URI>" --aplicar "Angie Aparicio" …
 *
 * También acepta --revertir para volver a activarlos.
 */
import { MongoClient } from "mongodb";

const [, , uri, ...resto] = process.argv;
const aplicar = resto.includes("--aplicar");
const revertir = resto.includes("--revertir");
const buscados = resto.filter((a) => !a.startsWith("--"));

if (!uri || !buscados.length) {
  console.error('Uso: node scripts/desactivar-participantes.mjs "<MONGODB_URI>" [--aplicar] [--revertir] correo1 correo2 …');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const users = client.db().collection("users");

  // Sin acentos y en minúsculas: en la base los nombres están dispares
  const normalizar = (t) =>
    (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const todos = await users.find({}, { projection: { name: 1, lastName: 1, email: 1, role: 1, isActive: 1 } }).toArray();

  console.log(revertir ? "Se reactivarían:" : "Se desactivarían:");
  const ids = [];

  for (const termino of buscados) {
    const t = normalizar(termino);
    const coincidencias = todos.filter((u) => {
      if (normalizar(u.email) === t) return true;
      const completo = normalizar(`${u.name || ""} ${u.lastName || ""}`);
      // Todas las palabras del término deben estar en el nombre
      return t.split(/\s+/).every((palabra) => completo.includes(palabra));
    });

    if (!coincidencias.length) { console.log(`  ✗ sin coincidencia: ${termino}`); continue; }
    if (coincidencias.length > 1) console.log(`  ⚠ ${termino} coincide con ${coincidencias.length}:`);

    for (const u of coincidencias) {
      ids.push(u._id);
      const estado = u.isActive === false ? "inactivo" : "ACTIVO";
      console.log(`  · ${`${u.name || ""} ${u.lastName || ""}`.trim().padEnd(28)} <${u.email}>  rol: ${(u.role || "?").padEnd(10)} ${estado}`);
    }
  }

  if (!aplicar) {
    console.log(`\n${ids.length} registros encontrados. Simulación: agrega --aplicar para escribir.`);
    process.exit(0);
  }

  const r = await users.updateMany(
    { _id: { $in: ids } },
    { $set: { isActive: revertir } }
  );
  console.log(`\n${r.modifiedCount} registros ${revertir ? "reactivados" : "desactivados"}. No se borró nada.`);
} finally {
  await client.close();
}
