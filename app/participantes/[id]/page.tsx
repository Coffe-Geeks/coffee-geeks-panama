import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Vote from "@/models/Vote";
import SiteConfig from "@/models/SiteConfig";
import PerfilDetailClient from "./PerfilDetailClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function PerfilPage({ params }: { params: { id: string } }) {
  await dbConnect();

  // En Next.js 15+, params es una promesa.
  const { id } = await params;

  // El id en la URL viene como slug-id (ej. mi-cafeteria-60d5ec...)
  // Extraemos la última parte que corresponde al ObjectId de MongoDB
  const parts = id.split('-');
  const objectId = parts[parts.length - 1];

  try {
    const shop = await User.findById(objectId).lean();
    
    if (!shop || shop.role !== "cafeteria") {
      return notFound();
    }

    const config = await SiteConfig.findOne();
    const currentRound = config?.currentVotingRound || 0;
    
    let votesCount = 0;
    if (currentRound > 0) {
      votesCount = await Vote.countDocuments({ cafeteriaId: shop._id, round: currentRound });
    }

    // Al cliente viaja SOLO lo público. El documento completo trae hash de
    // contraseña, correo del dueño, RUC y datos legales: nada de eso puede
    // terminar serializado en el HTML de una página pública.
    const plainShop = JSON.parse(JSON.stringify(shop));
    const shopData = {
      id: plainShop._id,
      votesCount,
      cafeteriaName: plainShop.cafeteriaName || "",
      name: plainShop.name || "",
      lastName: plainShop.lastName || "",
      neighborhood: plainShop.neighborhood || "",
      businessType: plainShop.businessType || "coffee",
      competitionCategory: plainShop.competitionCategory ?? [],
      coverImage: plainShop.coverImage || "",
      description: plainShop.description || "",
      tagline: plainShop.tagline || "",
      originStory: plainShop.originStory || "",
      espresso: plainShop.espresso || "",
      espressoPhoto: plainShop.espressoPhoto || "",
      filtrado: plainShop.filtrado || "",
      filtradoPhoto: plainShop.filtradoPhoto || "",
      signatureDrink: plainShop.signatureDrink || "",
      signatureDrinkName: plainShop.signatureDrinkName || "",
      signatureDrinkPhoto: plainShop.signatureDrinkPhoto || "",
      hours: plainShop.hours || "",
      phone: plainShop.phone || "",
      web: plainShop.web || "",
      locationLat: plainShop.locationLat ?? null,
      locationLng: plainShop.locationLng ?? null,
      baristas: (plainShop.baristas || []).map((b: any) => ({
        fullName: b.fullName || "",
        photo: b.photo || "",
        isHighlighted: !!b.isHighlighted,
      })),
    };

    return (
      <>
        <PerfilDetailClient shop={shopData} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return notFound();
  }
}
