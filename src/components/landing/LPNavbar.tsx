import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LPNavbarProps {
  onCheckout: () => void;
  loading?: boolean;
}

export const LPNavbar = ({ onCheckout, loading }: LPNavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7EBF8E] to-[#4CAF50] flex items-center justify-center">
            <span className="text-[#0A0A0A] font-black text-xs">O2</span>
          </div>
          <div className="leading-none">
            <span className="text-white font-bold text-sm tracking-tight">Diagnóstico</span>
            <span className="text-[#7EBF8E] font-bold text-sm"> 360</span>
          </div>
        </div>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Como funciona", id: "como-funciona" },
            { label: "Áreas", id: "areas" },
            { label: "Preço", id: "preco" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[#A0A0A0] hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onCheckout}
          disabled={loading}
          className="px-5 py-2 rounded-full bg-[#4CAF50] hover:bg-[#00E676] text-[#0A0A0A] text-sm font-bold transition-all duration-200 shadow-lg shadow-[#4CAF50]/25 hover:shadow-[#00E676]/40 disabled:opacity-60"
        >
          {loading ? "Aguarde..." : "Começar Agora"}
        </button>
      </div>
    </nav>
  );
};
