"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fondo.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8 md:p-12 rounded-3xl bg-[#38050e] backdrop-blur-lg shadow-2xl border border-[#cddbf2]/20 mx-4">

        <div className="flex justify-center mb-0">
          <Link href="/">
            <div className="relative w-50 h-50 drop-shadow-[0_0_15px_rgba(205,219,242,0.3)]">
              <Image
                src="/logo-cel.webp"
                alt="Coffee Geeks Panamá Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-center text-[#cddbf2] mb-2 tracking-wide">
            Iniciar Sesión
          </h1>
          <p className="text-[#cddbf2]/60 font-light tracking-wide">Ingresa tus credenciales para continuar</p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#cddbf2]/50 uppercase tracking-widest ml-1">Email</label>
            <input
              required
              name="email"
              type="email"
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#cddbf2]/50 uppercase tracking-widest ml-1">Contraseña</label>
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide hover:bg-[#cddbf2]/90 focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {pending ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-sm text-[#cddbf2]/40">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-[#cddbf2] hover:underline font-semibold transition-colors">
              Regístrate aquí
            </Link>
          </p>
          <Link href="/" className="block text-xs text-[#cddbf2]/30 hover:text-[#cddbf2]/60 transition-colors uppercase tracking-widest">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
