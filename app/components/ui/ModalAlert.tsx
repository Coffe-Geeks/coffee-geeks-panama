"use client";

import { useEffect, useState } from "react";

interface ModalAlertProps {
  isOpen: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function ModalAlert({ isOpen, message, type = "info", onClose }: ModalAlertProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Pequeno delay para animacion de salida si se desea
      setTimeout(() => setShow(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
      <div className={`bg-[#22191A] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {type === "success" && (
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        )}
        {type === "error" && (
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
        )}
        {type === "info" && (
          <div className="w-16 h-16 bg-[#cddbf2]/20 text-[#cddbf2] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2 font-['Barlow_Condensed'] uppercase">
          {type === "success" ? "¡Éxito!" : type === "error" ? "Error" : "Aviso"}
        </h3>
        <p className="text-[#cddbf2]/80 font-['Barlow']">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-[#38050e] text-white rounded-lg hover:bg-[#520815] transition-colors font-bold"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
