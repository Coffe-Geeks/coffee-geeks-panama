import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MenuClientPage from "./MenuClientPage";
import { getCategories, getProducts } from "@/app/actions/catalog";

export const dynamic = "force-dynamic";

export default async function CafeteriaMenuPage() {
  const session = await getSession();
  if (!session || session.role !== "cafeteria") {
    redirect("/perfil");
  }

  const categories = await getCategories(session.userId);
  const products = await getProducts(session.userId);

  return (
    <main className="relative flex min-h-screen flex-col items-center p-4 py-10">
      <div className="absolute inset-0 -z-10 fixed">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="z-10 w-full max-w-4xl p-6 md:p-10 rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10">
        <div className="flex items-center gap-4 mb-8">
           <Link href="/perfil" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-semibold border border-white/10">
              &larr; Volver
           </Link>
           <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Gestión de Menú</h1>
        </div>

        <MenuClientPage cafeteriaId={session.userId} initialCategories={categories} initialProducts={products} />
      </div>
    </main>
  );
}
