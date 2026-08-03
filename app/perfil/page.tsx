import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSiteConfig } from "@/lib/siteConfig";
import ProfileForm from "./ProfileForm";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await getSession();
  if (!session) return null;

  await dbConnect();
  const userData = await User.findById(session.userId).lean() as any;

  if (!userData) return null;

  const user = {
    _id: userData._id.toString(),
    name: userData.name ?? "",
    lastName: userData.lastName ?? "",
    email: userData.email ?? "",
    role: userData.role ?? "user",
    // Datos de cafetería
    cafeteriaName: userData.cafeteriaName ?? "",
    neighborhood: userData.neighborhood ?? "",
    description: userData.description ?? "",
    hours: userData.hours ?? "",
    phone: userData.phone ?? "",
    web: userData.web ?? "",
    coverImage: userData.coverImage ?? "",
    gallery: userData.gallery ?? [],
    locationLat: userData.locationLat ?? null,
    locationLng: userData.locationLng ?? null,
    legalRepresentative: userData.legalRepresentative ?? "",
    ruc: userData.ruc ?? "",
    competitionCategory: userData.competitionCategory ?? "",
    businessType: userData.businessType ?? "coffee",
    baristas: (userData.baristas ?? []).map((b: any) => ({
      _id: b._id.toString(),
      fullName: b.fullName,
      photo: b.photo ?? "",
      isHighlighted: b.isHighlighted ?? false,
    })),
  };

  const config = await getSiteConfig();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 fixed">
        <Image
          src="/fondo.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className={`z-10 w-full ${session.role === "cafeteria" ? "max-w-2xl" : "max-w-lg"} p-8 md:p-12 rounded-3xl bg-[#38050e] backdrop-blur-xl shadow-2xl border border-[#cddbf2]/20 my-8`}>

        <div className="flex justify-between items-start mb-6">
          <div>
            <Link 
              href="/home" 
              className="flex items-center gap-1.5 text-xs font-semibold text-[#cddbf2]/50 hover:text-[#cddbf2] transition-colors mb-1 uppercase tracking-widest"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Volver a la web
            </Link>
            <h1 className="text-2xl font-bold text-[#cddbf2] tracking-wide">Mi Perfil</h1>
          </div>
          <form className="inline">
            <button formAction={async () => {
              "use server"
              const { logout } = await import("@/app/actions/auth");
              await logout();
            }} className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors pt-5">
              Cerrar Sesión
            </button>
          </form>
        </div>

        {session.role === "admin" && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/50 flex justify-between items-center">
            <span className="text-[#cddbf2] text-sm font-medium">Eres Administrador</span>
            <Link href="/admin/dashboard" className="text-white text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors font-semibold">
              Ir al Dashboard
            </Link>
          </div>
        )}

        {session.role === "cafeteria" && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/20 border border-amber-500/50 flex justify-between items-center">
            <span className="text-[#cddbf2] text-sm font-medium">☕ Panel de Participante</span>
          </div>
        )}

        <ProfileForm user={user} maxGalleryImages={config.maxGalleryImages} />
      </div>
    </main>
  );
}
