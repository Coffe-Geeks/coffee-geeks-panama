import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Rutas protegidas que requieren rol admin (cubre todo /admin/*)
const adminRoutes = ["/admin"];
// Rutas protegidas que requieren estar logeado pero sin rol (o admin si así lo desean)
const userRoutes = ["/perfil"];
// Rutas donde no debería entrar si ya está logeado (auth pages)
const authRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Excluir rutas comunes
  if (path.startsWith("/_next") || path.startsWith("/api") || path.includes('.')) {
      return NextResponse.next();
  }

  const isAuthRoute = authRoutes.includes(path);
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isUserRoute = userRoutes.includes(path);

  // Intentamos obtener y decodificar el token JWT de la cookie HttpOnly
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // Si NO hay sesión iniciada y trata de acceder a algo protegido, enviamos a login
  if (!session?.userId && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Si tiene sesión e intenta ver la página de login / register, redirigir adonde corresponda
  if (session?.userId && isAuthRoute) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/perfil", req.nextUrl));
  }

  // Protección específica de roles: User "normal" no puede entrar a /admin
  if (session?.userId && isAdminRoute && session.role !== "admin") {
    return NextResponse.redirect(new URL("/perfil", req.nextUrl)); // Lo rebotamos a su perfil
  }

  return NextResponse.next();
}

// Optimization strategy, limit middleware scope
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|background.webp|logo.webp|construccion.webp).*)",
  ],
};
