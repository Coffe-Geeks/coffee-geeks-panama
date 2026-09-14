import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * Recibe las respuestas del formulario de Google y las vuelca en la ficha.
 *
 * Existe porque a varias cafeterías se les complica llenar la ficha en el
 * sitio. El formulario es la puerta fácil; esto evita que alguien tenga que
 * transcribir cincuenta campos a mano.
 *
 * Quién puede llamarlo: solo quien tenga `FORMULARIO_TOKEN`, que vive en las
 * variables de entorno y en el script de Apps Script. Sin esa variable la
 * ruta se niega a funcionar en vez de quedar abierta.
 *
 * Qué NO hace, a propósito:
 *
 *   · No otorga el rol de participante. Eso exige contrato firmado y lo da un
 *     administrador desde /admin/users. Una ficha que llega por formulario
 *     queda como usuario general.
 *   · No activa nada. `isActive` se queda en false, así que no aparece en la
 *     página pública ni es votable hasta que alguien la revise.
 *
 * El formulario es público: cualquiera puede enviarlo. Por eso lo que crea es
 * inerte —un usuario inactivo, sin rol— y la revisión humana sigue siendo el
 * paso que publica.
 */

const norm = (t: string) =>
  (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

type Tipo = "texto" | "numero" | "booleano" | "lista" | "minuscula";

/** Cada pregunta del formulario, con el campo y el tipo al que corresponde. */
const MAPA: [string, string, Tipo][] = [
  ["Nombre del establecimiento", "cafeteriaName", "texto"],
  ["Tipo de negocio", "businessType", "texto"],
  ["Frase corta que los describa", "tagline", "texto"],
  ["Años de existencia", "yearsOfExistence", "numero"],
  ["Cantidad de sucursales", "branchesCount", "numero"],

  ["Razón social", "legalName", "texto"],
  ["RUC", "ruc", "texto"],
  ["Aviso de operación", "operationNotice", "texto"],
  ["Representante legal", "legalRepresentative", "texto"],
  ["Cargo del representante legal", "legalRepresentativePosition", "texto"],

  ["Provincia", "province", "texto"],
  ["Barrio o dirección", "neighborhood", "texto"],
  ["Horario de atención", "hours", "texto"],
  ["Teléfono de contacto", "phone", "texto"],
  ["Sitio web o Instagram", "web", "texto"],
  ["¿Quieren recibir avisos del concurso por correo?", "acceptsNotifications", "booleano"],

  ["¿En qué categorías compiten?", "competitionCategory", "lista"],
  ["La historia de la casa", "originStory", "texto"],
  ["Su espresso", "espresso", "texto"],
  ["Su filtrado", "filtrado", "texto"],
  ["Nombre de su bebida de autor", "signatureDrinkName", "texto"],
  ["Su bebida de autor", "signatureDrink", "texto"],
  ["¿Venden café panameño?", "sellsPanamanianCoffee", "booleano"],
  ["Nombre de la finca", "farmName", "texto"],
  ["Variedades de café que usan", "coffeeVarieties", "lista"],
  ["Marca de la máquina de espresso", "machineBrand", "texto"],
  ["Marca del molino", "grinderBrand", "texto"],
  ["¿Tuestan su propio café?", "roastsOwnCoffee", "booleano"],
  ["¿Desarrollan sus propios perfiles de tueste?", "makesOwnProfile", "booleano"],
  ["¿Qué experiencias alrededor del café ofrecen?", "coffeeExperiences", "texto"],

  ["Cantidad total de baristas", "totalBaristas", "numero"],
  ["Cuántas son mujeres", "femaleBaristasCount", "numero"],
  ["Cuántos son hombres", "maleBaristasCount", "numero"],
  ["¿Tienen personal con discapacidad en el equipo?", "hasDisabledStaff", "booleano"],
  ["Nombre del barista principal", "mainBaristaName", "texto"],
  ["Su especialidad", "mainBaristaSpecialty", "texto"],
  ["Sus años de experiencia", "mainBaristaYearsExp", "numero"],
  ["Su formación", "mainBaristaTraining", "texto"],
  ["¿Tiene alguna certificación?", "mainBaristaCertified", "booleano"],
  ["¿Tiene certificación SCA?", "mainBaristaSCA", "booleano"],

  ["Nivel de formación del equipo", "trainingLevel", "minuscula"],
  ["¿Su formación fue certificada?", "hasCertifiedTraining", "booleano"],
  ["¿Fue con el programa SCA?", "trainingSCA", "booleano"],
  ["¿Quién los formó?", "trainingInstructor", "texto"],
  ["¿Les interesa certificarse?", "interestInCertification", "booleano"],
  ["¿En qué les interesaría certificarse?", "certificationInterests", "lista"],
  ["¿Les interesa exportar o internacionalizarse?", "wantsToInternationalize", "booleano"],
  ["¿A qué mercados?", "targetMarkets", "texto"],
  ["¿Quieren formar parte del Comité Nacional País?", "wantsToJoinCommittee", "booleano"],
];

/** El desplegable viene en español; el modelo guarda un código. */
const TIPO_NEGOCIO: Record<string, string> = {
  "cafeteria": "coffee",
  "hotel": "hotel",
  "restaurante": "rest",
};

function convertir(tipo: Tipo, valor: any, campo: string) {
  if (Array.isArray(valor)) {
    if (tipo === "lista") return valor.map((v) => String(v).trim()).filter(Boolean);
    valor = valor.join(", ");
  }
  const texto = String(valor ?? "").trim();
  if (!texto) return undefined;

  switch (tipo) {
    case "numero": {
      const n = Number(texto.replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : undefined;
    }
    case "booleano":
      return /^s[ií]$/i.test(texto);
    case "lista":
      return texto.split(",").map((t) => t.trim()).filter(Boolean);
    case "minuscula":
      return texto.toLowerCase();
    default:
      if (campo === "businessType") return TIPO_NEGOCIO[norm(texto)] || "coffee";
      return texto;
  }
}

export async function POST(req: Request) {
  const esperado = process.env.FORMULARIO_TOKEN;
  if (!esperado) {
    console.error("Formulario: falta FORMULARIO_TOKEN, la ruta queda cerrada.");
    return NextResponse.json({ error: "No configurado" }, { status: 503 });
  }
  if (req.headers.get("x-cg-token") !== esperado) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let respuestas: Record<string, any>;
  try {
    respuestas = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo no interpretable" }, { status: 400 });
  }

  // Las claves llegan con el texto de la pregunta: se normalizan para que una
  // tilde o una mayúscula cambiada no rompa la correspondencia.
  const porClave = new Map<string, any>();
  for (const [k, v] of Object.entries(respuestas)) porClave.set(norm(k), v);

  const correo = String(porClave.get(norm("Correo de contacto")) || "").trim().toLowerCase();
  if (!correo.includes("@")) {
    return NextResponse.json({ error: "Falta el correo de contacto" }, { status: 400 });
  }

  const datos: Record<string, any> = {};
  for (const [pregunta, campo, tipo] of MAPA) {
    const valor = convertir(tipo, porClave.get(norm(pregunta)), campo);
    if (valor !== undefined) datos[campo] = valor;
  }

  await dbConnect();

  const existente = await User.findOne({ email: correo });
  let creado = false;

  if (existente) {
    // Se actualiza la ficha y nada más: el rol y el estado no se tocan, para
    // no reactivar ni degradar una cuenta desde un formulario público.
    await User.updateOne({ _id: existente._id }, { $set: datos });
  } else {
    /**
     * El modelo exige contraseña. Se genera una al azar que nadie conoce: la
     * persona entra por «recuperar contraseña», que verifica el correo. Así
     * un envío de formulario no crea una cuenta con acceso.
     */
    const aleatoria = await bcrypt.hash(crypto.randomUUID() + crypto.randomUUID(), 10);
    const nombre = String(datos.cafeteriaName || correo.split("@")[0]);
    await User.create({
      ...datos,
      name: nombre,
      email: correo,
      password: aleatoria,
      role: "user",
      isActive: false,
    });
    creado = true;
  }

  // Aviso al equipo, con el enlace de las fotos, que no se guarda en la ficha
  const fotos = String(porClave.get(norm("Enlace a las fotos")) || "").trim();
  const destino = process.env.ADMIN_EMAIL;
  if (destino) {
    try {
      await sendEmail({
        to: destino,
        subject: `Ficha por formulario: ${datos.cafeteriaName || correo}`,
        html: `
          <div style="font-family:'Segoe UI',Tahoma,sans-serif;background:#38050e;padding:32px 20px">
            <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:28px 30px">
              <h1 style="font-size:20px;color:#38050e;margin:0 0 4px">
                ${creado ? "Nueva ficha" : "Ficha actualizada"} por formulario
              </h1>
              <p style="font-size:13px;color:#8a7b7d;margin:0 0 18px">
                ${datos.cafeteriaName || "(sin nombre)"} · ${correo}
              </p>
              <p style="font-size:14px;line-height:1.6;color:#22191a;margin:0 0 14px">
                Se guardaron ${Object.keys(datos).length} campos.
                ${creado
                  ? "La cuenta quedó como <strong>usuario general e inactiva</strong>: no aparece en la página pública ni es votable. El rol de participante se otorga desde /admin/users una vez firmado el contrato."
                  : "Se actualizó la ficha existente; el rol y el estado no se tocaron."}
              </p>
              ${fotos
                ? `<p style="font-size:14px;color:#22191a;margin:0">Fotos: <a href="${fotos}" style="color:#38050e">${fotos}</a></p>`
                : `<p style="font-size:14px;color:#8a7b7d;margin:0">No dejaron enlace de fotos.</p>`}
            </div>
          </div>`,
      });
    } catch (err) {
      console.error("Formulario: no se pudo avisar al equipo:", err);
    }
  }

  return NextResponse.json({ ok: true, creado, campos: Object.keys(datos).length });
}
