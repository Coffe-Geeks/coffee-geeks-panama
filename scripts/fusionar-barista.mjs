/**
 * Pasa a una persona registrada como participante a ser barista de su
 * cafetería, sin obligarla a registrarse de nuevo.
 *
 * Qué hace:
 *   1. La agrega al arreglo `baristas` de la cafetería, con su foto si la
 *      tiene y marcada como destacada.
 *   2. Le cambia el rol a `user`, de modo que conserva su cuenta, su correo
 *      y su contraseña, y puede seguir comprando y votando.
 *   3. Desactiva su ficha de participante para que no aparezca como
 *      establecimiento ni sea votable.
 *
 * Nunca borra: si algo sale mal, revertir es cambiar dos campos.
 *
 *   node scripts/fusionar-barista.mjs "<URI>" "Nombre Persona" "Nombre Cafetería"
 *   node scripts/fusionar-barista.mjs "<URI>" --aplicar "Nombre Persona" "Nombre Cafetería"
 */
import { MongoClient } from "mongodb";

const [, , uri, ...resto] = process.argv;
const aplicar = resto.includes("--aplicar");
const [persona, cafeteria] = resto.filter((a) => !a.startsWith("--"));

if (!uri || !persona || !cafeteria) {
  console.error('Uso: node scripts/fusionar-barista.mjs "<URI>" [--aplicar] "Persona" "Cafetería"');
  process.exit(1);
}

const norm = (t) => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const client = new MongoClient(uri);
try {
  await client.connect();
  const users = client.db().collection("users");
  const todos = await users.find({}).toArray();

  // Una cafetería se muestra por `cafeteriaName`, no por nombre y apellido
  // de su dueño. Buscar solo en name/lastName la dejaba invisible.
  const buscar = (termino) => {
    const t = norm(termino);
    return todos.filter((u) => {
      const completo = norm(`${u.name || ""} ${u.lastName || ""} ${u.cafeteriaName || ""}`);
      return t.split(/\s+/).every((p) => completo.includes(p));
    });
  };

  const rotulo = (u) => u.cafeteriaName || `${u.name || ""} ${u.lastName || ""}`.trim();

  const pers = buscar(persona);
  const cafs = buscar(cafeteria);

  const describir = (u) =>
    `${rotulo(u)}  <${u.email}>  rol: ${u.role}  ` +
    `${u.isActive === false ? "inactivo" : "ACTIVO"}  baristas: ${(u.baristas || []).length}` +
    `${u.coverImage ? "  con portada" : "  sin portada"}`;

  console.log("PERSONA");
  pers.forEach((u) => console.log("  · " + describir(u)));
  console.log("\nCAFETERÍA");
  cafs.forEach((u) => console.log("  · " + describir(u)));

  if (pers.length !== 1 || cafs.length !== 1) {
    console.log("\nSe necesita exactamente una coincidencia de cada lado. Afina los nombres.");
    process.exit(1);
  }

  const p = pers[0];
  const c = cafs[0];
  const nombrePersona = `${p.name || ""} ${p.lastName || ""}`.trim();
  const yaEsta = (c.baristas || []).some((b) => norm(b.fullName) === norm(nombrePersona));

  console.log("\nQUÉ SE HARÍA");
  console.log(`  1. Agregar "${nombrePersona}" como barista destacado de "${rotulo(c)}"` +
              (yaEsta ? "  → YA ESTÁ, se omite" : ""));
  console.log(`     foto: ${p.coverImage || p.photo || "(no tiene, queda vacía)"}`);
  console.log(`  2. Cambiar el rol de ${p.email}: ${p.role} → user   (conserva su cuenta y contraseña)`);
  console.log(`  3. Desactivar su ficha de participante (isActive: false)`);

  if (!aplicar) {
    console.log("\nSimulación. Agrega --aplicar para escribir.");
    process.exit(0);
  }

  if (!yaEsta) {
    await users.updateOne({ _id: c._id }, {
      $push: { baristas: { fullName: nombrePersona, photo: p.coverImage || p.photo || "", isHighlighted: true } },
    });
  }
  await users.updateOne({ _id: p._id }, { $set: { role: "user", isActive: false } });

  console.log("\nHecho. Nada se borró: para revertir, quitar el barista del arreglo y devolver el rol.");
} finally {
  await client.close();
}
