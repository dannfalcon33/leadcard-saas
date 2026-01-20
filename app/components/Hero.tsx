"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import BackgroundShapes from "./BackgroundShapes";

export default function Hero() {
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
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-gray-800">
      <BackgroundShapes />

      <div className="max-w-3xl space-y-8 relative z-10 py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-transparent bg-clip-text animate-pulse-slow">
          Tu Landing Page, <br /> lista en segundos.
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
          Crea una tarjeta de presentación digital, capta leads y expórtalos a
          Excel. Sin configurar servidores. Ideal para freelancers.
        </p>

        {/* Auth Form */}
        <div className="mt-10 max-w-md mx-auto w-full">
          {sent ? (
            <div className="bg-green-900/30 border border-green-500/50 p-6 rounded-xl text-green-200 shadow-lg backdrop-blur-sm">
              ¡Correo enviado! Revisa tu bandeja de entrada.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="hero-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-4 rounded-xl bg-gray-900/80 border border-gray-800 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm"
              />
              <button
                onClick={handleAuth}
                disabled={loading}
                className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-95 cursor-pointer"
              >
                {loading ? "Enviando..." : "Comienza Ahora"}
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-6">
            Te enviaremos un Magic Link. Sin contraseñas que recordar.
          </p>
        </div>
      </div>
    </section>
  );
}
