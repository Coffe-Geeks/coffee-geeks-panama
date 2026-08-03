import { getCourseRequests, updateRequestStatus } from "@/app/actions/elearning";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminElearningRequestsPage() {
  const requests = await getCourseRequests();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#cddbf2]">Solicitudes de Cursos</h1>
          <p className="text-[#cddbf2]/70 mt-1">Aprueba o rechaza el acceso de los usuarios a los cursos.</p>
        </div>
        <Link
          href="/admin/elearning"
          className="px-4 py-2 bg-[#cddbf2]/10 border border-[#cddbf2]/20 text-[#cddbf2] rounded-xl hover:bg-[#cddbf2]/20 transition-all font-medium"
        >
          Volver a Cursos
        </Link>
      </div>

      <div className="bg-white/5 border border-[#cddbf2]/10 rounded-2xl overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-[#cddbf2]/60">
            No hay solicitudes pendientes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#cddbf2]/10 bg-black/20">
                  <th className="p-4 text-[#cddbf2] font-semibold">Usuario</th>
                  <th className="p-4 text-[#cddbf2] font-semibold">Email</th>
                  <th className="p-4 text-[#cddbf2] font-semibold">Curso</th>
                  <th className="p-4 text-[#cddbf2] font-semibold">Fecha</th>
                  <th className="p-4 text-center text-[#cddbf2] font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req: any) => (
                  <tr key={req._id} className="border-b border-[#cddbf2]/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-[#cddbf2]/90">{req.user?.name || "Usuario borrado"}</td>
                    <td className="p-4 text-[#cddbf2]/70">{req.user?.email || "N/A"}</td>
                    <td className="p-4 text-[#cddbf2]/90 font-medium">{req.course?.title || "Curso borrado"}</td>
                    <td className="p-4 text-[#cddbf2]/60 text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <form action={async () => {
                          "use server";
                          await updateRequestStatus(req._id.toString(), "approved");
                        }}>
                          <button className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors text-sm font-medium">
                            Aprobar
                          </button>
                        </form>
                        <form action={async () => {
                          "use server";
                          await updateRequestStatus(req._id.toString(), "rejected");
                        }}>
                          <button className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors text-sm font-medium">
                            Rechazar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
