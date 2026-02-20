import { CheckCircle2, Shield, Lock, Clock } from "lucide-react";

interface LPPricingProps {
  onCheckout: () => void;
  loading?: boolean;
}

export const LPPricing = ({ onCheckout, loading }: LPPricingProps) => {
  const benefits = [
    "Diagnóstico completo das 10 áreas da empresa",
    "Score individual por departamento (0–100%)",
    "Plano de ação gerado por Inteligência Artificial",
    "Recomendações priorizadas por impacto",
    "Relatório executivo em PDF exportável",
    "Gráficos e comparativos visuais",
    "Acesso ilimitado ao dashboard de resultados",
    "Suporte via WhatsApp da equipe O2 Inc.",
  ];

  return (
    <section id="preco" className="py-24 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">
            Investimento único
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
            Simples e direto ao ponto
          </h2>
        </div>

        {/* Pricing card */}
        <div className="relative rounded-3xl border border-[#4CAF50]/30 bg-gradient-to-b from-[#4CAF50]/8 to-transparent p-8 shadow-2xl shadow-[#4CAF50]/10">
          {/* Best value badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#00E676] text-[#0A0A0A] text-xs font-black uppercase tracking-wide shadow-lg shadow-[#4CAF50]/40">
              Melhor custo-benefício
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-8 mt-2">
            <div className="text-[#606060] line-through text-lg mb-1">R$497</div>
            <div className="flex items-end justify-center gap-2">
              <span className="text-[#A0A0A0] text-2xl font-bold">R$</span>
              <span className="text-white font-black text-7xl leading-none">197</span>
            </div>
            <div className="text-[#A0A0A0] text-sm mt-2">pagamento único · acesso imediato</div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                <span className="text-[#C0C0C0] text-sm">{b}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onCheckout}
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#4CAF50] to-[#00E676] text-[#0A0A0A] font-black text-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#4CAF50]/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? "Redirecionando para o pagamento..." : "Garantir meu acesso — R$197"}
          </button>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-[#7EBF8E]" />
            <span className="text-[#7EBF8E] text-xs font-medium">
              Garantia de 7 dias — sem perguntas
            </span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {[
            { icon: Lock, label: "Pagamento seguro" },
            { icon: Shield, label: "Stripe certificado" },
            { icon: Clock, label: "Acesso imediato" },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex flex-col items-center gap-1.5">
                <Icon className="w-4 h-4 text-[#505050]" />
                <span className="text-[#505050] text-xs">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
