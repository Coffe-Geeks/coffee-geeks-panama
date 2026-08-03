"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestCourseAccess } from "@/app/actions/elearning";
import ModalAlert from "@/app/components/ui/ModalAlert";

export default function ActionButtons({ courseId, isLoggedIn, status }: { courseId: string, isLoggedIn: boolean, status?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [modal, setModal] = useState<{isOpen: boolean, message: string, type: "success" | "error" | "info"}>({ isOpen: false, message: "", type: "info" });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setModal({ isOpen: true, message, type });
  };

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await requestCourseAccess(courseId);
      if (res?.success) {
        showAlert("Solicitud enviada con éxito.", "success");
        router.refresh();
      } else if (res?.message) {
        showAlert(res.message, "info");
      }
    } catch (err: any) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="block w-full py-4 mt-6 bg-[#22191A] text-white font-['Barlow'] font-bold tracking-wide uppercase text-sm rounded-xl hover:bg-[#38050e] transition-colors">
        Inicia Sesión para Solicitar
      </Link>
    );
  }

  if (status === "approved") {
    return (
      <Link href={`/academia/${courseId}/player`} className="block w-full py-4 mt-6 bg-green-600 text-white font-['Barlow'] font-bold tracking-wide uppercase text-sm rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30">
        Continuar Curso
      </Link>
    );
  }

  if (status === "pending") {
    return (
      <button disabled className="w-full py-4 mt-6 bg-yellow-500/20 text-yellow-700 font-['Barlow'] font-bold tracking-wide uppercase text-sm rounded-xl cursor-not-allowed">
        Solicitud en Revisión
      </button>
    );
  }
  
  if (status === "rejected") {
    return (
      <button disabled className="w-full py-4 mt-6 bg-red-500/10 text-red-700 font-['Barlow'] font-bold tracking-wide uppercase text-sm rounded-xl cursor-not-allowed border border-red-500/20">
        Solicitud Rechazada
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={handleRequest} 
        disabled={loading}
        className="w-full py-4 mt-6 bg-[#38050e] text-white font-['Barlow'] font-bold tracking-wide uppercase text-sm rounded-xl hover:bg-[#520815] transition-colors disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Solicitar Abrir Curso"}
      </button>
      <ModalAlert 
        isOpen={modal.isOpen} 
        message={modal.message} 
        type={modal.type} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
      />
    </>
  );
}
