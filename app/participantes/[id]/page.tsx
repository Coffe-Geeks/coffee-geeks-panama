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

    // Serializar profundamente para asegurar que no pasen objetos Mongoose (como ObjectId) al cliente
    const plainShop = JSON.parse(JSON.stringify(shop));

    const shopData = {
      ...plainShop,
      id: plainShop._id,
      votesCount,
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
