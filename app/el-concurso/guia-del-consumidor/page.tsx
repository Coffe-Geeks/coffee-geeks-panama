import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import GuiaConsumidorClient from "./GuiaConsumidorClient";

export const metadata = {
  title: "Guía del Consumidor | El Concurso · Coffee Geeks Panamá",
  description:
    "Cómo votar en el Camino a la Gran Taza, la primera Curaduría Nacional de las Experiencias alrededor del café de Panamá.",
};

export default function GuiaDelConsumidorPage() {
  return (
    <>
      <GuiaConsumidorClient />
      <Footer />
    </>
  );
}
