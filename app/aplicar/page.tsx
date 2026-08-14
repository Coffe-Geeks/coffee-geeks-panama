import AplicarClient from "./AplicarClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aplica a los sellos de excelencia | Coffee Geeks Panamá",
  description:
    "Postula tu establecimiento a la Insignia Panamá Coffee Geeks, iTRUST Consumer Brands o Trusted Origin.",
};

export default function AplicarPage() {
  return (
    <>
      <AplicarClient />
      <Footer />
    </>
  );
}
