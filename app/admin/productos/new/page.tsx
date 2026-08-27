import StoreProductForm from "@/app/components/admin/StoreProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Crear Nuevo Producto</h1>
        <p className="text-[#cddbf2]/60 font-medium">Añade un nuevo producto al catálogo de la tienda</p>
      </div>

      <StoreProductForm />
    </div>
  );
}
