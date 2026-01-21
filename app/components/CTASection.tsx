"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import BackgroundShapes from "./BackgroundShapes";

export default function CTASection() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAuth = async () => {
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden text-center bg-gray-900/10">
      <BackgroundShapes />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          ¿Listo para potenciar tu marca?
        </h2>
        <p className="text-lg md:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
          Únete a miles de profesionales que ya están usando LeadCard para
          conectar mejor con su audiencia. Sin tarjetas de papel, sin
          complicaciones.
        </p>

        {/* Auth Form */}
        <div className="max-w-md mx-auto w-full">
          {sent ? (
            <div className="bg-green-900/30 border border-green-500/50 p-6 rounded-xl text-green-200 shadow-lg backdrop-blur-sm">
              ¡Correo enviado! Revisa tu bandeja de entrada para acceder con tu
              Magic Link.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-4 rounded-xl bg-gray-900/80 border border-gray-800 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm text-white"
              />
              <button
                onClick={handleAuth}
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {loading ? "Enviando..." : "Crear mi LeadCard"}
              </button>
            </div>
          )}
          <p className="text-xs text-indigo-300/80 mt-4">
            Prueba gratuita. No requiere tarjeta de crédito.
          </p>
        </div>
      </div>
    </section>
  );
}
