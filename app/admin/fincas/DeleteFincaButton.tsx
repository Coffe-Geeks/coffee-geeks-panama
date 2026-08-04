"use client";

import { useState } from "react";
import { deleteFinca } from "@/app/actions/finca";

export default function DeleteFincaButton({ id, name }: { id: string; name: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFinca(id);
    } catch (error) {
      console.error(error);
      alert("Error al borrar la finca");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        Borrar
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#22191A] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-['Barlow_Condensed'] uppercase">
              ¿Eliminar {name}?
            </h3>
            <p className="text-[#cddbf2]/80 font-['Barlow'] text-sm mb-6">
              Esta acción es irreversible. Se eliminarán también sus experiencias y las
              imágenes asociadas.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 bg-transparent text-[#cddbf2]/70 border border-[#cddbf2]/20 rounded-xl hover:bg-white/5 transition-colors font-bold text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold text-sm disabled:opacity-50"
              >
                {loading ? "Borrando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
