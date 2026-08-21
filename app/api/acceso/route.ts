import { NextResponse } from "next/server";

// Acceso directo para desarrollo/equipo: abrir
//   /api/acceso?c=CODIGO
// pone la cookie de registro (1 año) y entra sin pasar por el gate.
// El código vive en la variable de entorno ACCESO_DEV, no en el repo.
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("c") || "";
  const expected = process.env.ACCESO_DEV || "";

  const res = NextResponse.redirect(new URL("/", req.url));

  if (expected && code === expected) {
    res.cookies.set("cg_registro", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  // Código incorrecto: no pone cookie y el gate seguirá apareciendo.
  return res;
}
