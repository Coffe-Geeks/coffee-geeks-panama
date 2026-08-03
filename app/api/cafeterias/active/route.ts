import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const cafeterias = await User.find({ role: "cafeteria", isActive: true }).lean();
    
    const SHOPS = cafeterias.map((c: any) => ({
      id: c._id.toString(),
      type: c.businessType || "coffee",
      name: c.cafeteriaName || `${c.name} ${c.lastName}`.trim(),
      sub: c.competitionCategory || "Cafetería",
      loc: c.neighborhood || "Panamá",
      img: c.coverImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75",
    }));

    return NextResponse.json(SHOPS);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cafeterias" }, { status: 500 });
  }
}
