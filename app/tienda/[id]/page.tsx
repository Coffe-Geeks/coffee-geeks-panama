import { notFound } from "next/navigation";
import { getStoreProductById } from "@/app/actions/storeProduct";
import ProductDetailClient from "./ProductDetailClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStoreProductById(id);
  if (!product) return { title: "Producto no encontrado | Coffee Geeks Panamá" };

  return {
    title: `${product.name} | Tienda · Coffee Geeks Panamá`,
    description: product.shortDescription || `Compra ${product.name} en la tienda oficial de Coffee Geeks Panamá.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStoreProductById(id);

  if (!product || !product.isActive) {
    return notFound();
  }

  return (
    <>
      <ProductDetailClient product={product} />
      <Footer />
    </>
  );
}
