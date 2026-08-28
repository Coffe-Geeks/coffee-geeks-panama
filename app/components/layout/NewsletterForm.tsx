"use client";

import { useState, useTransition } from "react";
import { subscribeEmail } from "@/app/actions/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus({ type: "error", message: "El correo electrónico es obligatorio." });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus({ type: "error", message: "Por favor, ingresa un correo electrónico válido." });
      return;
    }

    startTransition(async () => {
      const res = await subscribeEmail(trimmedEmail);
      if (res.error) {
        setStatus({ type: "error", message: res.error });
      } else {
        setStatus({ type: "success", message: res.success || "¡Te has suscrito!" });
        setEmail("");
      }
    });
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-2">
      <input
        className="ft-input"
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
      />
      <button type="submit" className="ft-sub-btn" disabled={isPending}>
        {isPending ? "Suscribiendo..." : "Suscribirme →"}
      </button>
      
      {status.type && (
        <p className={`text-xs font-semibold mt-2 transition-all duration-300 ${status.type === "success" ? "text-green-400" : "text-rose-400"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
