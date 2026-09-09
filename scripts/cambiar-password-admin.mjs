/**
 * Cambia la contraseña de un usuario administrador.
 *
 * Usa bcrypt con el mismo coste que la aplicación (10), así que el hash que
 * genera es indistinguible del que produce el registro normal.
 *
 * La contraseña NUNCA se pasa por la línea de comandos —quedaría en el
 * historial del shell—. Se genera una y se escribe en un archivo local que
 * git ignora, o se lee de la variable NUEVA_PASSWORD.
 *
 *   node scripts/cambiar-password-admin.mjs "<MONGODB_URI>" correo@dominio.com
 *   node scripts/cambiar-password-admin.mjs "<MONGODB_URI>" correo@dominio.com --aplicar
 */
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import fs from "node:fs";

const uri = process.argv[2];
const correo = process.argv[3];
const aplicar = process.argv.includes("--aplicar");

if (!uri || !correo) {
  console.error('Uso: node scripts/cambiar-password-admin.mjs "<MONGODB_URI>" <correo> [--aplicar]');
  process.exit(1);
}

/** Contraseña legible pero fuerte: cuatro bloques de cinco caracteres. */
function generar() {
  const abecedario = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bloque = () =>
    Array.from({ length: 5 }, () => abecedario[crypto.randomInt(abecedario.length)]).join("");
  return [bloque(), bloque(), bloque(), bloque()].join("-");
}

const nueva = process.env.NUEVA_PASSWORD || generar();

const client = new MongoClient(uri);
try {
  await client.connect();
  const usuarios = client.db().collection("users");

  const u = await usuarios.findOne({ email: correo.toLowerCase() });
  if (!u) {
    console.error(`No existe ningún usuario con el correo ${correo}`);
    process.exit(1);
  }

  console.log(`usuario:  ${u.name || "(sin nombre)"} ${u.lastName || ""}`.trim());
  console.log(`correo:   ${u.email}`);
  console.log(`rol:      ${u.role}`);

  if (!aplicar) {
    console.log("\nSimulación. Agrega --aplicar para cambiarla de verdad.");
    process.exit(0);
  }

  const hash = await bcrypt.hash(nueva, await bcrypt.genSalt(10));
  await usuarios.updateOne(
    { _id: u._id },
    { $set: { password: hash }, $unset: { resetTokenHash: "", resetTokenExpiry: "" } }
  );

  // No se imprime en pantalla: queda en un archivo que git ignora
  const destino = ".password-admin-nueva.txt";
  fs.writeFileSync(
    destino,
    `Contraseña nueva de ${u.email}\n` +
      `Generada el ${new Date().toISOString()}\n\n${nueva}\n\n` +
      `Cámbiala desde el perfil al entrar y borra este archivo.\n`,
    { mode: 0o600 }
  );

  console.log(`\nContraseña cambiada. Está en ${destino} (fuera de git).`);
} finally {
  await client.close();
}
