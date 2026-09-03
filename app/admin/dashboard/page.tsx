import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import DashboardSearch from "./DashboardSearch";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await dbConnect();
  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: "admin" });
  const regularUsers = await User.countDocuments({ role: "user" });
  const cafeteriaUsers = await User.countDocuments({ role: "cafeteria", isActive: true });

  const rawUsers = await User.find(
    {},
    "name lastName email role cafeteriaName isActive"
  )
    .sort({ createdAt: -1 })
    .lean();

  const usersList = rawUsers.map((u: any) => ({
    id: u._id.toString(),
    name: u.name || "",
    lastName: u.lastName || "",
    email: u.email || "",
    role: u.role || "user",
    cafeteriaName: u.cafeteriaName || "",
    isActive: !!u.isActive,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#cddbf2] drop-shadow-md">
        Dashboard General
      </h1>
      <p className="text-[#cddbf2]/60 text-lg">
        Resumen de la plataforma y métricas clave.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        {/* Card Total Users */}
        <div className="p-8 rounded-3xl bg-[#38050e] border border-[#cddbf2]/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[#cddbf2]/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold text-[#cddbf2]/70 uppercase tracking-[0.2em]">
              Total Usuarios
            </span>
          </div>
          <div className="text-6xl font-black text-[#cddbf2] drop-shadow-lg">{totalUsers}</div>
        </div>

        {/* Card Admins */}
        <div className="p-8 rounded-3xl bg-[#38050e] border border-[#cddbf2]/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[#cddbf2]/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold text-[#cddbf2]/70 uppercase tracking-[0.2em]">
              Administradores
            </span>
          </div>
          <div className="text-6xl font-black text-[#cddbf2] drop-shadow-lg">{adminUsers}</div>
        </div>

        {/* Card Regulares */}
        <div className="p-8 rounded-3xl bg-[#38050e] border border-[#cddbf2]/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[#cddbf2]/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
             <span className="text-xs font-bold text-[#cddbf2]/70 uppercase tracking-[0.2em]">
              Consumidores
            </span>
          </div>
          <div className="text-6xl font-black text-[#cddbf2] drop-shadow-lg">{regularUsers}</div>
        </div>

        {/* Card Cafeterias */}
        <div className="p-8 rounded-3xl bg-[#38050e] border border-[#cddbf2]/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[#cddbf2]/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
             <span className="text-xs font-bold text-[#cddbf2]/70 uppercase tracking-[0.2em]">
              Cafeterías
            </span>
          </div>
          <div className="text-6xl font-black text-[#cddbf2] drop-shadow-lg">{cafeteriaUsers}</div>
        </div>
      </div>

      {/* Buscador abierto de texto */}
      <DashboardSearch users={usersList} />
    </div>
  );
}
