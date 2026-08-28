"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteNewsletterEmail } from "@/app/actions/newsletter";
import Link from "next/link";

interface EmailRecord {
  _id: string;
  email: string;
  createdAt: string;
}

interface NewsletterManagerProps {
  initialEmails: EmailRecord[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  initialSearch: string;
}

export default function NewsletterManager({
  initialEmails,
  totalPages,
  totalCount,
  currentPage,
  initialSearch,
}: NewsletterManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [emailToDelete, setEmailToDelete] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (query) {
      router.push(`/admin/newsletter?search=${encodeURIComponent(query)}&page=1`);
    } else {
      router.push("/admin/newsletter?page=1");
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    router.push("/admin/newsletter?page=1");
  };

  const executeDelete = () => {
    if (!emailToDelete) return;

    startDeleteTransition(async () => {
      try {
        await deleteNewsletterEmail(emailToDelete.id);
        setEmailToDelete(null);
        router.refresh();
      } catch (err: any) {
        alert("Error al eliminar el correo: " + err.message);
      }
    });
  };

  // Descarga de archivos
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (initialEmails.length === 0) return;
    const headers = "Email,Fecha de Registro\n";
    const rows = initialEmails
      .map(
        (e) =>
          `"${e.email}","${new Date(e.createdAt).toLocaleString("es-PA", {
            timeZone: "America/Panama",
          })}"`
      )
      .join("\n");
    downloadFile(headers + rows, `suscriptores-boletin-${Date.now()}.csv`, "text/csv;charset=utf-8;");
  };

  const exportTXT = () => {
    if (initialEmails.length === 0) return;
    const content = initialEmails.map((e) => e.email).join("\n");
    downloadFile(content, `suscriptores-boletin-${Date.now()}.txt`, "text/plain;charset=utf-8;");
  };

  const exportXLS = () => {
    if (initialEmails.length === 0) return;
    const headers = "Email\tFecha de Registro\n";
    const rows = initialEmails
      .map(
        (e) =>
          `${e.email}\t${new Date(e.createdAt).toLocaleString("es-PA", {
            timeZone: "America/Panama",
          })}`
      )
      .join("\n");
    const content = "\ufeff" + headers + rows;
    downloadFile(content, `suscriptores-boletin-${Date.now()}.xls`, "application/vnd.ms-excel;charset=utf-8;");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Suscriptores del Boletín</h1>
          <p className="text-[#cddbf2]/60 font-medium">Gestiona y exporta la lista de correos registrados en el newsletter</p>
        </div>

        {initialEmails.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportCSV}
              className="bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 border border-[#cddbf2]/20 text-[#cddbf2] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              📥 CSV
            </button>
            <button
              onClick={exportXLS}
              className="bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 border border-[#cddbf2]/20 text-[#cddbf2] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              📥 Excel (XLS)
            </button>
            <button
              onClick={exportTXT}
              className="bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 border border-[#cddbf2]/20 text-[#cddbf2] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              📥 Texto (TXT)
            </button>
          </div>
        )}
      </div>

      {/* Buscar y estadísticas */}
      <div className="bg-black/40 border border-[#cddbf2]/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-[#cddbf2]/20 rounded-xl px-4 py-3 text-[#cddbf2] placeholder-[#cddbf2]/30 outline-none focus:border-[#cddbf2]/50 transition-colors text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#cddbf2]/40 hover:text-white text-xs"
              >
                ✕ Limpiar
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#cddbf2] hover:bg-white text-[#38050e] font-black uppercase tracking-wider px-6 rounded-xl text-xs transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="text-right">
          <span className="text-xs text-[#cddbf2]/40 uppercase tracking-widest font-bold block">Total Registrados</span>
          <span className="text-3xl font-black text-white">{totalCount}</span>
        </div>
      </div>

      {/* Lista de Correos */}
      <div className="grid grid-cols-1 gap-4">
        {initialEmails.length === 0 ? (
          <div className="bg-black/20 p-20 rounded-3xl border border-dashed border-[#cddbf2]/10 text-center">
            <p className="opacity-50 font-bold uppercase tracking-widest text-sm text-[#cddbf2]">
              {initialSearch ? "No se encontraron correos para esta búsqueda" : "No hay suscriptores registrados aún"}
            </p>
          </div>
        ) : (
          <div className="bg-black/20 border border-[#cddbf2]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#cddbf2]/10 text-[#cddbf2]/40 text-xs font-black uppercase tracking-widest bg-black/40">
                    <th className="px-6 py-4">Correo Electrónico</th>
                    <th className="px-6 py-4">Fecha de Registro</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cddbf2]/5">
                  {initialEmails.map((e) => (
                    <tr key={e._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-white">{e.email}</td>
                      <td className="px-6 py-4 text-xs opacity-50 font-semibold">
                        {new Date(e.createdAt).toLocaleString("es-PA", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEmailToDelete({ id: e._id, email: e.email })}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors inline-flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Eliminar de la lista"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            const searchParam = initialSearch ? `&search=${encodeURIComponent(initialSearch)}` : "";
            return (
              <Link
                key={pageNum}
                href={`/admin/newsletter?page=${pageNum}${searchParam}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all text-sm border border-[#cddbf2]/20 ${
                  isActive ? "bg-[#cddbf2] text-[#38050e] border-[#cddbf2]" : "text-[#cddbf2]/60 hover:bg-white/5"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmación */}
      {emailToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#22191A] border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl animate-fade-in-up duration-200">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 font-['Barlow_Condensed'] uppercase tracking-tight">
              ¿Eliminar Suscripción?
            </h3>
            
            <p className="text-[#cddbf2]/80 font-['Barlow'] text-sm leading-relaxed mb-8">
              ¿Estás seguro de que deseas eliminar el correo <strong className="text-white break-all">{emailToDelete.email}</strong> del boletín? Esta acción es irreversible.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setEmailToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-white/5 text-[#cddbf2] border border-[#cddbf2]/20 rounded-xl hover:bg-white/10 font-bold transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 font-bold transition-all text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
              >
                {isDeleting ? "Eliminando..." : "Confirmar Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
