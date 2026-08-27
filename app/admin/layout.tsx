import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0505] via-[#1a0a0a] to-[#0f0505] font-sans text-[#cddbf2] selection:bg-[#cddbf2]/20">
      <nav className="border-b border-[#cddbf2]/10 bg-black/60 sticky top-0 z-50 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 transition-all duration-300">
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_0_10px_rgba(205,219,242,0.2)] group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/logo.webp"
                    alt="Coffee Geeks Panamá Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="hidden sm:block font-extrabold text-lg tracking-wider text-[#cddbf2] group-hover:text-[#cddbf2]/80 transition-colors duration-300">
                  Admin Panel
                </span>
              </Link>
              <div className="flex gap-6 ml-4">
                <Link href="/admin/dashboard" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Usuarios
                </Link>
                <Link href="/admin/votaciones" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Votaciones
                </Link>
                <Link href="/admin/fincas" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Fincas
                </Link>
                <Link href="/admin/aliados" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Aliados
                </Link>
                <Link href="/admin/blogs" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Blog
                </Link>
                <Link href="/admin/elearning" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Academia
                </Link>
                <Link href="/admin/productos" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Tienda
                </Link>
                <Link href="/admin/settings" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-all duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#cddbf2] hover:after:w-full after:transition-all after:duration-300">
                  Configuración
                </Link>
              </div>
            </div>
            
            <div className="flex gap-6 items-center">
              <Link href="/perfil" className="text-sm font-medium text-[#cddbf2]/70 hover:text-[#cddbf2] transition-colors duration-300">
                Mi Perfil
              </Link>
              <form action="/actions/logout" method="post">
                <button
                  formAction={async () => {
                    "use server";
                    const { logout } = await import("@/app/actions/auth");
                    await logout();
                  }}
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#cddbf2]/10 text-[#cddbf2] border border-[#cddbf2]/20 hover:bg-[#cddbf2]/20 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Salir
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 animate-fade-in-up duration-500">
        {children}
      </main>
    </div>
  );
}
