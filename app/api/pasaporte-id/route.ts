import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StoreProduct from "@/models/StoreProduct";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Buscar un producto que contenga "pasaporte digital" (no sensible a mayúsculas/minúsculas)
    const product = await StoreProduct.findOne({
      name: { $regex: "pasaporte digital", $options: "i" }
    }).select("_id");

    if (product) {
      return NextResponse.json({ id: product._id.toString() });
    }
    return NextResponse.json({ id: null });
  } catch (err) {
    console.error("Error in pasaporte-id API:", err);
    return NextResponse.json({ id: null });
  }
}
