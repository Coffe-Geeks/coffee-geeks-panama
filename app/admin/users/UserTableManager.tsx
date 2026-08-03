"use client";

import { useState, useTransition, useEffect } from "react";
import { deleteUser, updateUserAdmin, createUserByAdmin } from "@/app/actions/user";
import { toggleCafeteriaStatus } from "@/app/actions/cafeteria";
import { register } from "@/app/actions/auth";
import AdminMenuModal from "./AdminMenuModal";
import ProfileForm from "@/app/perfil/ProfileForm";
import DetailedCafeteriaForm from "./DetailedCafeteriaForm";
import { useRouter } from "next/navigation";

export default function UserTableManager({ initialUsers, maxGalleryImages }: { initialUsers: any[], maxGalleryImages?: number }) {
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [detailedUser, setDetailedUser] = useState<any>(null);
  const [managingMenu, setManagingMenu] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sincronizar el usuario detallado si cambian los props (después de router.refresh)
  useEffect(() => {
    if (detailedUser) {
      const updated = initialUsers.find(u => u.id === (detailedUser.id || detailedUser._id));
      if (updated && updated.updatedAt !== detailedUser.updatedAt) {
        setDetailedUser(updated);
      }
    }
  }, [initialUsers, detailedUser]);

  async function handleDelete(id: string) {
    if (!confirm("¿Está seguro de que desea eliminar este usuario?")) return;
    setLoading(true);
    await deleteUser(id);
    setLoading(false);
  }

  async function handleToggleStatus(id: string) {
    setLoading(true);
    const res = await toggleCafeteriaStatus(id);
    if (res?.error) {
      alert("Error: " + res.error);
      setLoading(false);
    } else {
      // Usamos startTransition para que React procese la actualización de Next.js correctamente
      startTransition(() => {
        router.refresh();
        setLoading(false);
      });
    }
  }

  const filteredUsers = initialUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (u.role === "cafeteria" && statusFilter !== "all") {
       if (statusFilter === "active" && !u.isActive) return false;
       if (statusFilter === "inactive" && u.isActive) return false;
    }
    return true;
  });

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#cddbf2] border border-[#cddbf2]/20 text-[#38050e] px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50"
          >
            <option value="all">Todos los Roles</option>
            <option value="user">Usuario</option>
            <option value="cafeteria">Participante</option>
            <option value="juez_local">Juez Local</option>
            <option value="juez_internacional">Juez Internacional</option>
            <option value="admin">Administrador</option>
          </select>
          
          {(roleFilter === "all" || roleFilter === "cafeteria") && (
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#cddbf2] border border-[#cddbf2]/20 text-[#38050e] px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50"
            >
              <option value="all">Todos los Estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          )}
        </div>

        <button
          onClick={() => setCreating(true)}
          className="bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 tracking-wide whitespace-nowrap"
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#cddbf2]/20 bg-[#38050e] backdrop-blur-md shadow-2xl">
        <table className="w-full text-left text-sm text-[#cddbf2]">
          <thead className="bg-[#2a040b] text-xs uppercase text-[#cddbf2]/70 font-bold tracking-wider border-b border-[#cddbf2]/10">
            <tr>
              <th className="px-6 py-5">Nombre / Apellido</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Rol</th>
              <th className="px-6 py-5 text-center">Estado</th>
              <th className="px-6 py-5">Fecha Reg.</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                <td className="px-6 py-5 font-semibold text-[#cddbf2]">
                  {u.name} {u.lastName}
                </td>
                <td className="px-6 py-5 font-medium">{u.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-inner ${
                    u.role === 'admin' ? 'bg-[#cddbf2]/20 text-[#cddbf2] border border-[#cddbf2]/30' : 
                    u.role === 'cafeteria' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                    u.role === 'juez_local' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    u.role === 'juez_internacional' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-[#2a040b] text-[#cddbf2]/60 border border-[#cddbf2]/10'}`}>
                    {u.role === 'cafeteria' ? 'Participante' : 
                     u.role === 'juez_local' ? 'Juez Local' : 
                     u.role === 'juez_internacional' ? 'Juez Int.' : 
                     u.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  {u.role === 'cafeteria' ? (
                    <button 
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={loading || isPending}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md border ${u.isActive ? 'bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'} ${(loading || isPending) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
                    >
                      {u.isActive ? '✅ Activa' : '❌ Inactiva'}
                    </button>
                  ) : (
                    <span className="text-neutral-500">-</span>
                  )}
                </td>
                <td className="px-6 py-5 text-[#cddbf2]/50 font-medium">{u.createdAt}</td>
                <td className="px-6 py-5 text-right font-bold tracking-wide relative">
                   <button 
                      onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)} 
                      className="text-[#cddbf2] hover:bg-[#cddbf2]/10 px-3 py-1.5 bg-[#38050e] rounded-xl border border-[#cddbf2]/20 transition-colors"
                   >
                      Opciones ▾
                   </button>
                   
                   {openDropdown === u.id && (
                      <div className="absolute right-6 top-14 z-50 bg-[#38050e] border border-[#cddbf2]/20 rounded-xl shadow-2xl py-2 w-40 flex flex-col text-left animate-fade-in-up">
                         <button onClick={() => { setEditingUser(u); setOpenDropdown(null); }} className="px-4 py-2.5 text-orange-400 hover:bg-white/5 text-left text-sm transition-colors border-b border-white/5" disabled={loading}>
                           ✏️ Editar Perfil
                         </button>
                         {u.role === "cafeteria" && (
                           <>
                             <button onClick={() => { setDetailedUser(u); setOpenDropdown(null); }} className="px-4 py-2.5 text-blue-400 hover:bg-white/5 text-left text-sm transition-colors border-b border-white/5" disabled={loading}>
                               🔍 Detallado
                             </button>
                           </>
                         )}
                         
                         <button onClick={() => { handleDelete(u.id); setOpenDropdown(null); }} className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-left text-sm transition-colors" disabled={loading}>
                           🗑️ Borrar
                         </button>
                      </div>
                   )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                 <td colSpan={6} className="text-center py-10 text-[#cddbf2]/70 font-medium tracking-wide">No se encontraron usuarios con esos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR */}
      {creating && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#38050e] border border-[#cddbf2]/20 rounded-3xl p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-fade-in-up duration-300">
              <h2 className="text-2xl font-black mb-6 text-[#cddbf2] tracking-wide border-b border-[#cddbf2]/10 pb-4">Nuevo Usuario</h2>
              <form action={async (fd) => {
                 setLoading(true);
                 const res = await createUserByAdmin(fd);
                 if (res?.error) {
                    alert(res.error);
                 } else {
                    setCreating(false);
                    window.location.reload();
                 }
                 setLoading(false);
              }} className="space-y-5">
                 <div>
                   <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Nombre</label>
                   <input required name="name" className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow" />
                 </div>
                 <div>
                   <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Email</label>
                   <input required type="email" name="email" className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow" />
                 </div>
                 <div>
                   <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Contraseña</label>
                   <input required type="password" name="password" minLength={6} className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow" />
                 </div>
                 <div>
                   <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Rol</label>
                   <select name="role" defaultValue="user" className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow">
                       <option value="user">Usuario</option>
                       <option value="cafeteria">Participante</option>
                       <option value="juez_local">Juez Local</option>
                       <option value="juez_internacional">Juez Internacional</option>
                       <option value="admin">Administrador</option>
                   </select>
                 </div>
                 <div className="flex justify-end gap-4 mt-8">
                   <button type="button" onClick={() => setCreating(false)} className="px-5 py-2.5 rounded-xl bg-[#2a040b] hover:bg-[#38050e] border border-[#cddbf2]/10 text-[#cddbf2] font-bold transition-colors">Cancelar</button>
                   <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] font-bold shadow-lg transition-colors">Guardar Usuario</button>
                 </div>
              </form>
           </div>
         </div>
      )}

      {/* MODAL EDITAR */}
      {editingUser && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#38050e] border border-[#cddbf2]/20 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-fade-in-up duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-[#cddbf2]/10 pb-4">
                <h2 className="text-2xl font-black text-[#cddbf2] tracking-wide">Editar Usuario</h2>
                <button onClick={() => setEditingUser(null)} className="text-[#cddbf2] hover:text-white font-bold text-xl px-2">✕</button>
              </div>
              
              {editingUser.role === 'cafeteria' ? (
                 <div className="pr-2">
                    <ProfileForm user={editingUser} maxGalleryImages={maxGalleryImages} />
                 </div>
              ) : (
                <form action={async (fd) => {
                   setLoading(true);
                   await updateUserAdmin(editingUser.id, fd);
                   setEditingUser(null);
                   setLoading(false);
                }} className="space-y-5">
                   <div>
                     <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Nombre</label>
                     <input required name="name" defaultValue={editingUser.name} className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow" />
                   </div>
                   <div>
                     <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Email</label>
                     <input required type="email" name="email" defaultValue={editingUser.email} className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow" />
                   </div>
                   <div>
                     <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Rol</label>
                     <select name="role" defaultValue={editingUser.role} className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow">
                         <option value="user">Usuario</option>
                         <option value="cafeteria">Participante</option>
                         <option value="juez_local">Juez Local</option>
                         <option value="juez_internacional">Juez Internacional</option>
                         <option value="admin">Administrador</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-sm font-bold text-[#cddbf2] uppercase tracking-widest">Nueva Contraseña (Opcional)</label>
                     <input type="password" name="password" minLength={6} placeholder="Dejar en blanco para no cambiar..." className="w-full mt-2 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow" />
                   </div>
                   <div className="flex justify-end gap-4 mt-8">
                     <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 rounded-xl bg-[#2a040b] hover:bg-[#38050e] border border-[#cddbf2]/10 text-[#cddbf2] font-bold transition-colors">Cancelar</button>
                     <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] font-bold shadow-lg transition-colors">Actualizar Info</button>
                   </div>
                </form>
              )}
           </div>
         </div>
      )}

      {/* MODAL GESTION DE MENU PARA CAFETERIAS (ADMIN) */}
      {managingMenu && (
         <AdminMenuModal 
            cafeteriaId={managingMenu.id} 
            cafeteriaName={managingMenu.name + " " + managingMenu.lastName} 
            onClose={() => setManagingMenu(null)} 
         />
      )}
       {/* MODAL DETALLADO CAFETERIA */}
       {detailedUser && (
         <DetailedCafeteriaForm 
            key={detailedUser.id + (detailedUser.updatedAt || "")}
            user={detailedUser} 
            onClose={() => setDetailedUser(null)} 
         />
       )}
    </div>
  );
}
