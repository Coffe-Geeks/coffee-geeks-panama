
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

if (!secretKey) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

type SessionPayload = {
  userId: string;
  role: string;
  expiresAt: Date;
};

// Generar Token
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// Desencriptar / Validar Token
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Crear sesión y cookie
export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId, role, expiresAt });
  
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Sólo en HTTPS en producción -> Evita robo de cookie
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Obtener datos de la sesión guardada
export async function getSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  if (!sessionValue) return null;
  
  const payload = await decrypt(sessionValue);
  return payload;
}

// Eliminar cookie de sesión
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
