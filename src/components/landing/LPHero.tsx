import { useMouseGlow } from "@/hooks/useMousePosition";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FloatingParticles } from "./FloatingParticles";

interface LPHeroProps {
  onCheckout: () => void;
  loading?: boolean;
}

export const LPHero = ({ onCheckout, loading }: LPHeroProps) => {
  const { ref: glowRef, pos, handleMouseMove } = useMouseGlow<HTMLElement>();
  const stat1 = useCountUp(2000, 2000, "+", "");
  const stat2 = useCountUp(88, 2000, "NPS ", "");
  const stat3 = useCountUp(2, 2000, "+R$", "BI");
  const badgeRef = useScrollReveal<HTMLDivElement>({ staggerDelay: 0 });
  const h1Ref = useScrollReveal<HTMLHeadingElement>({ staggerDelay: 100 });
  const subtitleRef = useScrollReveal<HTMLParagraphElement>({ staggerDelay: 200 });
  const ctaRef = useScrollReveal<HTMLDivElement>({ staggerDelay: 300 });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={glowRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Particles */}
      <FloatingParticles />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#7EBF8E 1px, transparent 1px), linear-gradient(90deg, #7EBF8E 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Mouse-following radial glow */}
      <div
        className="absolute w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7EBF8E]/30 bg-[#7EBF8E]/8 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
          <span className="text-[#7EBF8E] text-xs font-semibold tracking-widest uppercase">
            Powered by O2 Inc. · Porto Alegre
          </span>
        </div>

        {/* H1 */}
        <h1 ref={h1Ref} className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Descubra para onde está indo{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#7EBF8E] to-[#00E676]">
              o dinheiro
            </span>
          </span>
          <br />
          da sua empresa.
        </h1>

        {/* Subtítulo */}
        <p ref={subtitleRef} className="text-[#A0A0A0] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Em apenas <strong className="text-white">30 minutos</strong>, você terá um diagnóstico completo
          das <strong className="text-white">10 áreas críticas</strong> da sua empresa e vai receber
          um plano de ação para parar de perder dinheiro.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <button
            onClick={onCheckout}
            disabled={loading}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4CAF50] to-[#00E676] text-[#0A0A0A] font-black text-lg transition-all duration-300 shadow-xl shadow-[#4CAF50]/30 hover:shadow-[#00E676]/50 hover:scale-[1.03] disabled:opacity-60 animate-glow-pulse"
          >
            <span className="relative z-10">
              {loading ? "Redirecionando..." : "Fazer o Diagnóstico"}
            </span>
          </button>
          <button
            onClick={() => scrollTo("como-funciona")}
            className="px-8 py-4 rounded-2xl border border-white/12 text-white font-semibold text-lg hover:border-white/25 hover:bg-white/4 transition-all duration-200"
          >
            Ver como funciona ↓
          </button>
        </div>

        {/* Social proof stats with count-up */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          {[
            { ref: stat1.ref, display: stat1.display, label: "empresas atendidas" },
            { ref: stat2.ref, display: stat2.display, label: "satisfação dos clientes" },
            { ref: stat3.ref, display: stat3.display, label: "em operações analisadas" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div ref={stat.ref} className="text-2xl font-black text-white">{stat.display}</div>
              <div className="text-[#A0A0A0] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator with bounce */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce-gentle">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#7EBF8E]" />
      </div>
    </section>
  );
};
