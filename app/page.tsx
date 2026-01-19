"use client";

import { createClient } from "@/src/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redireccionar si hiciera falta

export default function LandingPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAuth = async () => {
    if (!email) return;
    setLoading(true);

    // Esto sirve tanto para REGISTRO como para LOGIN
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      setSent(true); // Cambiamos la UI para decir que revisen el correo
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 1. NAVBAR SENCILLO */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="font-bold text-xl tracking-tighter">LeadCard ⚡</div>
        <button
          onClick={() => document.getElementById("hero-input")?.focus()}
          className="text-sm font-medium hover:text-gray-300"
        >
          Acceder
        </button>
      </nav>

      {/* 2. HERO SECTION CON EL FORMULARIO INTEGRADO */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Tu Landing Page, <br /> lista en segundos.
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Crea una tarjeta de presentación digital, capta leads y expórtalos a
            Excel. Sin configurar servidores. Ideal para freelancers.
          </p>

          {/* EL FORMULARIO DE ACCESO / REGISTRO */}
          <div className="mt-10 max-w-md mx-auto">
            {sent ? (
              <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg text-green-200">
                ✅ ¡Correo enviado! Revisa tu bandeja de entrada (y spam) para
                entrar.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="hero-input"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 p-4 rounded-lg bg-gray-900 border border-gray-800 focus:border-blue-500 outline-none transition"
                />
                <button
                  onClick={handleAuth}
                  disabled={loading}
                  className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Comenzar Gratis"}
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">
              Te enviaremos un Magic Link. Sin contraseñas que recordar.
            </p>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="p-6 text-center text-gray-600 text-sm">
        © 2026 Dann Falcon Dev. Proyecto de Portafolio.
      </footer>
    </div>
  );
}
