"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/password";

export default function RecuperarPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src="/background.webp" alt="" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      <div className="z-10 w-full max-w-md p-8 md:p-12 rounded-3xl bg-[#38050e] backdrop-blur-lg shadow-2xl border border-[#cddbf2]/20 mx-4">
        <div className="flex justify-center mb-0">
          <Link href="/">
            <div className="relative w-40 h-40 drop-shadow-[0_0_15px_rgba(205,219,242,0.3)]">
              <Image src="/logo.webp" alt="Coffee Geeks Panamá" fill className="object-contain" />
            </div>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#cddbf2] mb-2 tracking-wide">
            Recuperar acceso
          </h1>
          <p className="text-[#cddbf2]/60 font-light tracking-wide">
            Te enviaremos un enlace para crear una contraseña nueva
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        {state?.success ? (
          <>
            <div className="mb-6 p-4 rounded-xl bg-[#cddbf2]/15 border border-[#cddbf2]/40 text-[#cddbf2] text-sm text-center leading-relaxed">
              {state.success}
            </div>
            <Link
              href="/login"
              className="block w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide text-center hover:bg-[#cddbf2]/90 transition-all"
            >
              Volver a iniciar sesión
            </Link>
          </>
        ) : (
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#cddbf2]/50 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-4 w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide hover:bg-[#cddbf2]/90 focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pending ? "Enviando..." : "Enviar enlace"}
            </button>

            <p className="text-center text-sm text-[#cddbf2]/60">
              <Link href="/login" className="hover:text-[#cddbf2] transition-colors underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
