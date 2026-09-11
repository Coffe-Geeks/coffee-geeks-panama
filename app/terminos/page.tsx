import Footer from "@/app/components/layout/Footer";
import TerminosClient from "./TerminosClient";

export const metadata = {
  title: "Términos y Condiciones | Coffee Geeks Panamá",
  description:
    "Términos y Condiciones de compra, contratación y uso de la plataforma Coffee Geeks / Panamá Unique, con las políticas de cookies, cambios y envíos.",
};

export default function TerminosPage() {
  return (
    <>
      <TerminosClient />
      <Footer />
    </>
  );
}
