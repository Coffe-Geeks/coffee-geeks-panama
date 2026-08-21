import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";

// Mismo patrón de correo que usa el modelo User
const EMAIL_RE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// Nombre: solo letras (con acentos/ñ), espacios y apóstrofes — sin guiones ni símbolos
const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,80}$/;
// Teléfono: solo dígitos, sin guiones ni espacios (es opcional)
const PHONE_RE = /^\d{7,15}$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = String(body?.name || "").trim().replace(/\s+/g, " ");
  const email = String(body?.email || "").trim().toLowerCase();
  const phone = String(body?.phone || "").trim();

  if (!NAME_RE.test(name)) {
    return NextResponse.json(
      { error: "Escribe tu nombre y apellido (solo letras)." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "El correo electrónico no es válido." },
      { status: 400 }
    );
  }
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json(
      { error: "El teléfono debe tener solo números, sin guiones ni espacios." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    await Visitor.findOneAndUpdate(
      { email },
      { $set: { name, phone }, $setOnInsert: { email } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("registro de visitante:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu registro. Intenta de nuevo." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  // La cookie es la que abre la puerta: dura un año para no volver a
  // pedirle el registro a la misma persona en cada visita.
  res.cookies.set("cg_registro", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
