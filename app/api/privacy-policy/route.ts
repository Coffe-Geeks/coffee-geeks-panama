import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/siteConfig";

// Endpoint público que devuelve solo la política de privacidad
export async function GET() {
  try {
    const cfg = await getSiteConfig();
    return NextResponse.json({ privacyPolicy: cfg.privacyPolicy ?? "" });
  } catch {
    return NextResponse.json({ privacyPolicy: "" });
  }
}
