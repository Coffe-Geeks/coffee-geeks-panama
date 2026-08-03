import { getSiteConfig } from "@/lib/siteConfig";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const config = await getSiteConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#cddbf2] drop-shadow-md">
          Configuración del Sitio
        </h1>
        <p className="text-[#cddbf2]/60 text-lg mt-1">
          SEO, redes sociales, contacto y política de privacidad.
        </p>
      </div>

      <SettingsForm config={config} />
    </div>
  );
}
