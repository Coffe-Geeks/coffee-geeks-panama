import { getSiteConfig } from "@/lib/siteConfig";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TerminosPage() {
  const cfg = await getSiteConfig();

  return (
    <main className="relative min-h-screen py-16 px-4">
      {/* Background */}
      <div className="absolute inset-0 -z-10 fixed">
        <Image src="/background.webp" alt="Background" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      <div className="z-10 max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          ← Volver al inicio
        </Link>

        <div className="p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">Términos del Concurso</h1>
          <p className="text-white/40 text-xs mb-8">Bases legales y condiciones de participación</p>

          {cfg.termsAndConditions ? (
            <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {cfg.termsAndConditions}
            </div>
          ) : (
            <p className="text-white/40 text-sm italic">
              Los términos del concurso aún no han sido publicados.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
