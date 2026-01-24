"use client";

import { useMemo, useState, useEffect } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

export function PublicLinkBox({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const publicUrl = `${origin}/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl mb-8">
      <h3 className="text-gray-200 font-bold mb-4">Tu Landing Page Pública</h3>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm truncate">
          <span className="text-gray-500 mr-1">{origin}/</span>
          <span className="text-white">{username}</span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            Visitar
          </a>
        </div>
      </div>
    </div>
  );
}
