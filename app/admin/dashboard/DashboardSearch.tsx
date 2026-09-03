"use client";

import { useState } from "react";

interface UserItem {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  cafeteriaName?: string;
  isActive?: boolean;
}

export default function DashboardSearch({ users }: { users: UserItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = users.filter((u) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const fullName = `${u.name || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const cafeteriaName = (u.cafeteriaName || "").toLowerCase();

    return fullName.includes(q) || email.includes(q) || cafeteriaName.includes(q);
  });

  return (
    <div className="mt-12 p-8 rounded-3xl bg-[#38050e] border border-[#cddbf2]/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#cddbf2]">Búsqueda Abierta de Usuarios</h2>
          <p className="text-sm text-[#cddbf2]/60 mt-1">
            Filtra rápidamente por nombre, email o nombre de cafetería.
          </p>
        </div>

        {/* Input de Búsqueda */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email o cafetería..."
            className="w-full bg-[#cddbf2] border border-[#cddbf2]/20 text-[#38050e] placeholder-[#38050e]/60 px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#38050e]/60 hover:text-[#38050e] text-xs font-bold bg-black/10 px-2 py-1 rounded-full"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="overflow-x-auto rounded-2xl border border-[#cddbf2]/10 bg-[#2a040b]">
        <table className="w-full text-left text-sm text-[#cddbf2]">
          <thead className="bg-[#1f0308] text-xs uppercase text-[#cddbf2]/70 font-bold tracking-wider border-b border-[#cddbf2]/10">
            <tr>
              <th className="px-6 py-4">Nombre / Apellido</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Nombre Cafetería</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-[#cddbf2]">
                  {u.name} {u.lastName}
                </td>
                <td className="px-6 py-4 font-medium opacity-90">{u.email}</td>
                <td className="px-6 py-4 text-[#cddbf2]/80">
                  {u.cafeteriaName || "-"}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    u.role === 'admin' ? 'bg-[#cddbf2]/20 text-[#cddbf2]' :
                    u.role === 'cafeteria' ? 'bg-orange-500/20 text-orange-400' :
                    u.role === 'juez_local' ? 'bg-blue-500/20 text-blue-400' :
                    u.role === 'juez_internacional' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-[#1f0308] text-[#cddbf2]/60'
                  }`}>
                    {u.role === 'cafeteria' ? 'Participante' : 
                     u.role === 'juez_local' ? 'Juez Local' : 
                     u.role === 'juez_internacional' ? 'Juez Int.' : 
                     u.role === 'user' ? 'Consumidor' : u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {u.role === 'cafeteria' ? (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {u.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  ) : (
                    <span className="text-neutral-500">-</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#cddbf2]/60 font-medium">
                  No se encontraron usuarios que coincidan con &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 50 && (
        <p className="text-xs text-[#cddbf2]/50 mt-3 text-right">
          Mostrando los primeros 50 resultados de {filtered.length}.
        </p>
      )}
    </div>
  );
}
