"use client";

import React from "react";

export default function Header() {
  const scrollToHero = () => {
    document.getElementById("hero-input")?.focus();
  };

  return (
    <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full z-10 relative bg-black/50 backdrop-blur-sm sticky top-0">
      <div className="font-bold text-xl tracking-tighter">LeadCard ⚡</div>
      <button
        onClick={scrollToHero}
        className="text-sm font-medium hover:text-gray-300 transition-colors cursor-pointer"
      >
        Acceder
      </button>
    </nav>
  );
}
