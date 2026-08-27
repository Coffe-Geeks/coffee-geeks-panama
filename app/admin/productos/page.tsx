import Link from "next/link";
import { getStoreProducts, deleteStoreProduct } from "@/app/actions/storeProduct";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getStoreProducts(false); // Fetch all products for admin

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Tienda</h1>
          <p className="text-[#cddbf2]/60 font-medium">Gestiona los productos del catálogo de Coffee Geeks</p>
        </div>
        <Link 
          href="/admin/productos/new" 
          className="bg-[#cddbf2] text-[#38050e] px-6 py-3 rounded-xl font-black uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>➕</span> Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="bg-black/20 p-20 rounded-3xl border border-dashed border-[#cddbf2]/10 text-center">
            <p className="opacity-50 font-bold uppercase tracking-widest text-[#cddbf2]">No hay productos creados aún</p>
          </div>
        ) : (
          products.map((product: any) => (
            <div 
              key={product._id} 
              className="bg-black/40 border border-[#cddbf2]/10 p-4 rounded-2xl flex items-center gap-6 group hover:border-[#cddbf2]/30 transition-all"
            >
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black/50 flex-shrink-0">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xl bg-[#cddbf2]/10 text-[#cddbf2]">📦</div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="text-xs opacity-50 flex items-center gap-3 text-[#cddbf2]/80">
                  <span className="font-bold text-white text-sm">${product.price.toFixed(2)}</span>
                  <span>📅 Creado: {new Date(product.createdAt).toLocaleDateString()}</span>
                  {product.webhook && <span className="truncate max-w-[200px]" title={product.webhook}>🔗 Webhook: {product.webhook}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  href={`/admin/productos/${product._id}/edit`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 transition-colors"
                  title="Editar"
                >
                  ✏️
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteStoreProduct(product._id);
                }}>
                  <button 
                    type="submit"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
