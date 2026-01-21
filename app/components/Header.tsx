"use client";

export default function Header() {
  return (
    <nav className="top-0 z-50 w-full border-white/10 bg-gradient-to-r from-[#1a0b2e] via-black to-[#0f0518] backdrop-blur-md overflow-hidden">
      {/* Shine Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-shine" />
      </div>

      <div className="relative z-10 py-3 px-4 md:px-8 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-default select-none group">
          {/* Logo Icon */}
          <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <img
              src="/logo-icon.png"
              alt="LeadCard Icon"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Logo Text */}
          <div className="font-bold text-xl md:text-2xl tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text animate-gradient-x bg-[length:200%_auto]">
            LeadCard
          </div>
        </div>
      </div>
    </nav>
  );
}
