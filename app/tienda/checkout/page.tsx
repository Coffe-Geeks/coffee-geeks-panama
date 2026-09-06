import { getSiteConfig } from "@/lib/siteConfig";
import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import CheckoutClient from "./CheckoutClient";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "Finalizar compra | Tienda · Coffee Geeks Panamá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cfg = await getSiteConfig();

  // Si ya inició sesión, no tiene por qué volver a escribir su nombre y correo
  let cliente = { name: "", email: "", phone: "" };
  const session = await getSession();
  if (session?.userId) {
    try {
      await dbConnect();
      const usuario = await User.findById(session.userId).select("name lastName email phone").lean<any>();
      if (usuario) {
        cliente = {
          name: [usuario.name, usuario.lastName].filter(Boolean).join(" ").trim(),
          email: usuario.email || "",
          phone: usuario.phone || "",
        };
      }
    } catch {
      // Si falla, el formulario simplemente se muestra vacío
    }
  }

  return (
    <>
      <CheckoutClient
        clienteInicial={cliente}
        configEnvio={{
          costoEnvio: Number((cfg as any).costoEnvio ?? 0),
          envioGratisDesde: Number((cfg as any).envioGratisDesde ?? 0),
        }}
      />
      <Footer />
    </>
  );
}
