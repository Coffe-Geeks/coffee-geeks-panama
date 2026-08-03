import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserTableManager from "./UserTableManager";
import { getSiteConfig } from "@/lib/siteConfig";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await dbConnect();
  // Lean for plain objects
  const rawUsers = await User.find().sort({ createdAt: -1 }).lean();
  
  const config = await getSiteConfig();
  
  const users = rawUsers.map((u: any) => ({
    id: u._id.toString(),
    _id: u._id.toString(),
    name: u.name,
    lastName: u.lastName || "",
    email: u.email,
    role: u.role,
    createdAt: new Date(u.createdAt).toLocaleDateString("es-PA"),
    updatedAt: u.updatedAt ? new Date(u.updatedAt).getTime() : 0,
    isActive: !!u.isActive,
    businessType: u.businessType || "coffee",
    cafeteriaName: u.cafeteriaName ?? "",
    neighborhood: u.neighborhood ?? "",
    description: u.description ?? "",
    hours: u.hours ?? "",
    phone: u.phone ?? "",
    web: u.web ?? "",
    coverImage: u.coverImage ?? "",
    gallery: u.gallery ?? [],
    locationLat: u.locationLat ?? null,
    locationLng: u.locationLng ?? null,
    legalRepresentative: u.legalRepresentative ?? "",
    ruc: u.ruc ?? "",
    competitionCategory: u.competitionCategory ?? "",
    legalRepresentativePosition: u.legalRepresentativePosition || "",
    yearsOfExistence: u.yearsOfExistence || 0,
    legalName: u.legalName || "",
    operationNotice: u.operationNotice || "",
    province: u.province || "",
    branchesCount: u.branchesCount || 1,
    sellsPanamanianCoffee: !!u.sellsPanamanianCoffee,
    farmName: u.farmName || "",
    coffeeVarieties: u.coffeeVarieties || [],
    machineBrand: u.machineBrand || "",
    grinderBrand: u.grinderBrand || "",
    roastsOwnCoffee: !!u.roastsOwnCoffee,
    makesOwnProfile: !!u.makesOwnProfile,
    coffeeExperiences: u.coffeeExperiences || "",
    wantsToInternationalize: !!u.wantsToInternationalize,
    targetMarkets: u.targetMarkets || "",
    totalBaristas: u.totalBaristas || 0,
    acceptsNotifications: u.acceptsNotifications !== false,
    mainBaristaName: u.mainBaristaName || "",
    mainBaristaTraining: u.mainBaristaTraining || "",
    mainBaristaSpecialty: u.mainBaristaSpecialty || "",
    mainBaristaYearsExp: u.mainBaristaYearsExp || 0,
    mainBaristaCertified: !!u.mainBaristaCertified,
    mainBaristaSCA: !!u.mainBaristaSCA,
    femaleBaristasCount: u.femaleBaristasCount || 0,
    maleBaristasCount: u.maleBaristasCount || 0,
    trainingLevel: u.trainingLevel || "",
    hasCertifiedTraining: !!u.hasCertifiedTraining,
    trainingSCA: !!u.trainingSCA,
    trainingInstructor: u.trainingInstructor || "",
    interestInCertification: !!u.interestInCertification,
    certificationInterests: u.certificationInterests || [],
    wantsToJoinCommittee: !!u.wantsToJoinCommittee,
    hasDisabledStaff: !!u.hasDisabledStaff,
    baristas: (u.baristas ?? []).map((b: any) => ({
      _id: b._id.toString(),
      fullName: b.fullName,
      photo: b.photo ?? "",
      isHighlighted: b.isHighlighted ?? false,
    })),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#cddbf2] drop-shadow-md">Gestión de Usuarios</h1>
        <p className="text-[#cddbf2]/60 mt-2 text-lg">Ver, Crear, Editar y Borrar usuarios del sistema.</p>
      </div>

      <UserTableManager initialUsers={users} maxGalleryImages={config.maxGalleryImages} />
    </div>
  );
}
