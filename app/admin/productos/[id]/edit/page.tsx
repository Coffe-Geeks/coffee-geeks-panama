import { notFound } from "next/navigation";
import { getStoreProductById } from "@/app/actions/storeProduct";
import StoreProductForm from "@/app/components/admin/StoreProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getStoreProductById(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Editar Producto</h1>
        <p className="text-[#cddbf2]/60 font-medium">Modifica los detalles del producto en el catálogo</p>
      </div>

      <StoreProductForm initialData={product} />
    </div>
  );
}
