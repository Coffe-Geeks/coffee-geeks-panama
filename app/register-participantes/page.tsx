"use client";

import { useActionState, useState, useTransition } from "react";
import { registerCafeteria } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";
import PrivacyCheckbox from "@/app/components/PrivacyCheckbox";

export default function RegisterParticipantesPage() {
  const [state, formAction, pending] = useActionState(registerCafeteria, null);
  const [isPending, startTransition] = useTransition();
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10 fixed">
        <Image
          src="/fondo.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8 md:p-12 rounded-3xl bg-[#38050e] backdrop-blur-lg shadow-2xl border border-[#cddbf2]/20 mx-4">

        <div className="flex justify-center mb-0">
          <Link href="/">
            <div className="relative w-50 h-50 drop-shadow-[0_0_15px_rgba(190,220,248,0.3)]">
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

        <h1 className="text-2xl font-bold text-center text-[#cddbf2] mb-2 tracking-wide">
          Registrar Participante
        </h1>
        <p className="text-center text-[#cddbf2]/70 mb-2 text-sm">
          Crea tu perfil de participante en Coffee Geeks Panamá
        </p>

        <div className="mt-0 mb-6 text-center text-sm text-[#cddbf2]/70 flex flex-col gap-4">
          <p>
            ¿Eres usuario?{" "}
            <Link href="/register" className="text-[#cddbf2] font-semibold hover:underline">
              Registrate aquí
            </Link>
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={async (formData) => {
          if (typeof window !== "undefined" && (window as any).grecaptcha) {
            try {
              const token = await (window as any).grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'register_cafeteria' });
              formData.set("recaptchaToken", token);
            } catch (err) {
              console.error("reCAPTCHA error:", err);
            }
          }
          startTransition(() => {
            formAction(formData);
          });
        }} className="flex flex-col gap-4">
          <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer></script>
          <input type="hidden" name="recaptchaToken" value="" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#cddbf2] text-sm font-medium pl-1" htmlFor="name">
                Nombre del Responsable
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all"
                placeholder="Juan"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#cddbf2] text-sm font-medium pl-1" htmlFor="lastName">
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#cddbf2] text-sm font-medium pl-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#cddbf2] text-sm font-medium pl-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <p className="text-xs text-[#cddbf2]/40 text-center px-2">
            Podrás completar el perfil de participante (nombre oficial, barrio, baristas, etc.) desde tu panel de perfil.
          </p>

          {/* Checkbox de política de privacidad */}
          <div className="pt-1">
            <PrivacyCheckbox
              checked={privacyAccepted}
              onChange={setPrivacyAccepted}
              accentColor="#cddbf2"
            />
          </div>

          <button
            type="submit"
            disabled={pending || !privacyAccepted}
            className="mt-2 w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide hover:bg-[#cddbf2]/90 focus:ring-2 focus:ring-[#cddbf2]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#38050e]/30"
          >
            {pending ? "Registrando..." : "Registrar Participante"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#cddbf2]/70">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-[#cddbf2] font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>

      </div>
    </main>
  );
}
