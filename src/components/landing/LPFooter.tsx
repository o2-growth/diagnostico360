import { useScrollReveal } from "@/hooks/useScrollReveal";

interface LPFooterProps {
  onCheckout: () => void;
  loading?: boolean;
}

export const LPFooter = ({ onCheckout, loading }: LPFooterProps) => {
  const ctaRef = useScrollReveal<HTMLDivElement>();

  return (
    <footer className="border-t border-white/6">
      {/* Final CTA Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4CAF50]/5 to-transparent pointer-events-none" />
        <div ref={ctaRef} className="relative max-w-3xl mx-auto">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">Última chamada</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-3 mb-6 leading-tight">
            Sua empresa tem buracos.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7EBF8E] to-[#00E676]">Descubra quais.</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg mb-10 max-w-xl mx-auto">
            Em 30 minutos você vai saber exatamente onde focar para crescer com menos esforço e mais resultado.
          </p>
          <button
            onClick={onCheckout}
            disabled={loading}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#4CAF50] to-[#00E676] text-[#0A0A0A] font-black text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#4CAF50]/40 hover:scale-[1.03] disabled:opacity-60 animate-glow-pulse"
          >
            {loading ? "Aguarde..." : "Quero meu diagnóstico"}
          </button>
        </div>
      </section>

      {/* Footer bottom */}
      <div className="py-8 px-6 border-t border-white/6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7EBF8E] to-[#4CAF50] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-black text-[10px]">O2</span>
            </div>
            <span className="text-[#606060] text-sm">© {new Date().getFullYear()} O2 Inc. · Porto Alegre, RS</span>
          </div>
          <div className="flex items-center gap-6 text-[#505050] text-xs">
            <a href="mailto:contato@o2inc.com.br" className="hover:text-[#7EBF8E] transition-colors">contato@o2inc.com.br</a>
            <a href="https://www.o2inc.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#7EBF8E] transition-colors">o2inc.com.br</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
