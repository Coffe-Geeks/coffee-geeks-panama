import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getFincas } from "@/app/actions/finca";
import DeleteFincaButton from "./DeleteFincaButton";

export const dynamic = "force-dynamic";

export default async function AdminFincasPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const fincas = await getFincas({ onlyActive: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#cddbf2]">Fincas</h1>
          <p className="text-[#cddbf2]/70 mt-1">
            Administra las fincas participantes y sus experiencias de &ldquo;Del Origen a la Barra&rdquo;.
          </p>
        </div>
        <Link
          href="/admin/fincas/finca-form/new"
          className="px-4 py-2 bg-[#cddbf2] text-[#0f0505] rounded-xl hover:bg-white transition-all font-medium"
        >
          + Nueva Finca
        </Link>
      </div>

      {fincas.length === 0 && (
        <div className="bg-white/5 border border-[#cddbf2]/10 rounded-2xl p-10 text-center">
          <p className="text-[#cddbf2]/60">Todavía no hay fincas cargadas.</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fincas.map((finca: any) => (
          <div
            key={finca._id}
            className="bg-white/5 border border-[#cddbf2]/10 rounded-2xl overflow-hidden hover:border-[#cddbf2]/30 transition-all"
          >
            <div className="h-48 relative">
              {finca.coverImage ? (
                <img src={finca.coverImage} alt={finca.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#cddbf2]/10 flex items-center justify-center">
                  <span className="text-[#cddbf2]/50 text-sm">Sin imagen</span>
                </div>
              )}
              {!finca.isActive && (
                <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Inactiva
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-[#cddbf2] mb-1">{finca.name}</h3>
              <p className="text-[#cddbf2]/60 text-sm mb-3">
                {finca.region}
                {finca.location ? ` · ${finca.location}` : ""}
                {finca.altitude ? ` · ${finca.altitude} msnm` : ""}
              </p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-[#cddbf2]/50">
                  {finca.experiences?.length || 0}{" "}
                  {finca.experiences?.length === 1 ? "experiencia" : "experiencias"}
                </span>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/fincas/finca-form/${finca._id}`}
                    className="text-[#cddbf2]/80 hover:text-white transition-colors"
                  >
                    Editar
                  </Link>
                  <DeleteFincaButton id={finca._id} name={finca.name} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
