"use client";

import { useState } from "react";
import { createCategory, deleteCategory, createProduct, deleteProduct } from "@/app/actions/catalog";
import Image from "next/image";

export default function MenuClientPage({ cafeteriaId, initialCategories, initialProducts }: { cafeteriaId: string, initialCategories: any[], initialProducts: any[] }) {
   const [loading, setLoading] = useState(false);
   const [creatingCat, setCreatingCat] = useState(false);
   const [creatingProd, setCreatingProd] = useState<string | null>(null); // Guardará el ID de la categoría para la que creamos
   
   return (
      <div className="space-y-10">
         <div className="flex justify-between items-center bg-[#38050e] p-4 rounded-2xl border border-[#cddbf2]/10">
            <div>
               <h2 className="text-xl font-bold text-[#cddbf2] tracking-widest uppercase">Tus Categorías y Productos</h2>
               <p className="text-sm text-[#cddbf2]/50">Carga al sistema tu menú para que los usuarios lo vean.</p>
            </div>
            <button onClick={() => setCreatingCat(true)} className="px-5 py-2.5 rounded-xl bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] font-bold transition-all shadow-lg">
               + Nueva Categoría
            </button>
         </div>

         {creatingCat && (
            <div className="p-6 bg-[#38050e] border border-[#cddbf2]/10 rounded-2xl animate-fade-in-up">
               <h3 className="text-lg font-semibold text-[#cddbf2] mb-4">Crear Categoría</h3>
               <form action={async (fd) => {
                  setLoading(true);
                  await createCategory(cafeteriaId, fd);
                  setCreatingCat(false);
                  setLoading(false);
               }} className="flex gap-4 items-end">
                  <div className="flex-1">
                     <label className="text-sm text-[#cddbf2]/70 font-medium mb-1 block">Nombre de Categoría</label>
                     <input required autoFocus name="name" className="w-full bg-[#cddbf2] border border-[#cddbf2]/10 rounded-xl px-4 py-2 text-[#38050e] focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-colors" placeholder="Ej. Bebidas Calientes" />
                  </div>
                  <button type="button" onClick={() => setCreatingCat(false)} className="px-4 py-2 rounded-xl bg-[#2a040b] text-[#cddbf2]/80 hover:bg-[#38050e]">Cancelar</button>
                  <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#cddbf2] text-[#38050e] font-bold disabled:opacity-50">Guardar</button>
               </form>
            </div>
         )}

         {initialCategories.length === 0 && !creatingCat && (
            <div className="text-center py-12 text-[#cddbf2]/50 border border-[#cddbf2]/10 border-dashed rounded-2xl">
               No tienes categorías aún. Comienza creando una.
            </div>
         )}

         <div className="space-y-6">
            {initialCategories.map(cat => {
               const catProducts = initialProducts.filter(p => p.categoryId === cat._id);
               return (
                  <div key={cat._id} className="bg-[#38050e] border border-[#cddbf2]/10 rounded-2xl overflow-hidden shadow-xl">
                     <div className="bg-[#2a040b] px-6 py-4 border-b border-[#cddbf2]/10 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-[#cddbf2]">{cat.name}</h3>
                        <div className="flex gap-3">
                           <button onClick={() => setCreatingProd(cat._id)} className="text-sm font-semibold text-[#cddbf2] hover:text-white">
                             + Añadir Producto
                           </button>
                           <button onClick={async () => {
                              if(!confirm("Borrar categoría eliminará TODOS sus productos. ¿Seguro?")) return;
                              setLoading(true);
                              await deleteCategory(cafeteriaId, cat._id);
                              setLoading(false);
                           }} className="text-sm font-semibold text-red-400 hover:text-red-300">
                             Borrar
                           </button>
                        </div>
                     </div>
                     
                     <div className="p-6">
                        {creatingProd === cat._id && (
                           <div className="mb-6 p-6 bg-[#2a040b] border border-[#cddbf2]/10 rounded-xl">
                              <h4 className="text-lg font-bold text-[#cddbf2] mb-4 border-b border-[#cddbf2]/10 pb-2">Nuevo Producto en {cat.name}</h4>
                              <form action={async (fd) => {
                                 setLoading(true);
                                 fd.append("categoryId", cat._id);
                                 await createProduct(cafeteriaId, fd);
                                 setCreatingProd(null);
                                 setLoading(false);
                              }} className="space-y-4">
                                 <div>
                                    <label className="text-sm text-[#cddbf2]/70 block mb-1">Nombre</label>
                                    <input required name="name" className="w-full bg-[#cddbf2] border border-[#cddbf2]/10 rounded-lg px-4 py-2 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 outline-none" />
                                 </div>
                                 <div>
                                    <label className="text-sm text-[#cddbf2]/70 block mb-1">Descripción</label>
                                    <textarea name="description" rows={2} className="w-full bg-[#cddbf2] border border-[#cddbf2]/10 rounded-lg px-4 py-2 text-[#38050e] resize-none focus:ring-2 focus:ring-[#cddbf2]/50 outline-none" />
                                 </div>
                                 <div>
                                    <label className="text-sm text-[#cddbf2]/70 block mb-1">Imagen (JPG, PNG)</label>
                                    <input type="file" name="image" accept="image/*" className="w-full text-[#cddbf2]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#cddbf2]/10 file:text-[#cddbf2] hover:file:bg-[#cddbf2]/20 transition-all cursor-pointer" />
                                 </div>
                                 <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setCreatingProd(null)} className="px-4 py-2 rounded-lg bg-[#38050e] text-[#cddbf2]/80 hover:bg-[#2a040b]">Cancelar</button>
                                    <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[#cddbf2] text-[#38050e] font-bold">Guardar Producto</button>
                                 </div>
                              </form>
                           </div>
                        )}

                        {catProducts.length === 0 ? (
                           !creatingProd && <p className="text-sm text-[#cddbf2]/40 italic">No hay productos en esta categoría.</p>
                        ) : (
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                              {catProducts.map(prod => (
                                 <div key={prod._id} className="group bg-[#2a040b] rounded-xl border border-[#cddbf2]/10 hover:border-[#cddbf2]/30 transition-all overflow-hidden flex flex-col">
                                    <div className="relative h-40 w-full bg-black/50 border-b border-[#cddbf2]/10 flex items-center justify-center overflow-hidden">
                                       {prod.image ? (
                                          <Image src={prod.image} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                       ) : (
                                          <span className="text-[#cddbf2]/20 font-bold">Sin Imagen</span>
                                       )}
                                       <button onClick={async () => {
                                          if(!confirm("¿Borrar producto?")) return;
                                          setLoading(true);
                                          await deleteProduct(cafeteriaId, prod._id);
                                          setLoading(false);
                                       }} className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-lg text-sm font-bold">
                                          &times;
                                       </button>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                       <h4 className="font-bold text-[#cddbf2] text-lg line-clamp-1">{prod.name}</h4>
                                       <p className="text-[#cddbf2]/50 text-xs mt-1 line-clamp-2 flex-1">{prod.description || "Sin descripción"}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
