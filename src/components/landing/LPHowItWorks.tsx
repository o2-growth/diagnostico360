import { ClipboardList, BarChart3, Lightbulb } from "lucide-react";

export const LPHowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      number: "01",
      title: "Responda as perguntas",
      description:
        "69 perguntas objetivas distribuídas nas 10 áreas mais críticas da sua empresa. Leva cerca de 30 minutos e pode ser feito a qualquer momento.",
      highlight: "~30 minutos",
    },
    {
      icon: BarChart3,
      number: "02",
      title: "Receba seu diagnóstico",
      description:
        "Score de 0 a 100% para cada departamento, com gráficos comparativos, benchmarks setoriais e mapa visual de maturidade operacional.",
      highlight: "10 áreas analisadas",
    },
    {
      icon: Lightbulb,
      number: "03",
      title: "Execute o plano de ação",
      description:
        "Recomendações geradas por IA com base nos gaps identificados, priorizadas por impacto e esforço. Exportável em PDF para o seu time.",
      highlight: "Plano priorizado por IA",
    },
  ];

  return (
    <section id="como-funciona" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">
            Metodologia
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
            Como funciona
          </h2>
          <p className="text-[#A0A0A0] text-lg mt-4 max-w-xl mx-auto">
            Simples, rápido e 100% orientado a resultados.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative group rounded-3xl border border-white/8 bg-white/[0.03] p-8 hover:border-[#7EBF8E]/30 hover:bg-[#7EBF8E]/[0.04] transition-all duration-300"
              >
                {/* Number + line connector */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 w-6 h-px bg-gradient-to-r from-[#7EBF8E]/40 to-transparent translate-x-full" />
                )}

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#4CAF50]/12 border border-[#4CAF50]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#4CAF50]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#7EBF8E]" />
                  </div>
                  <div className="text-[#303030] font-black text-5xl leading-none select-none">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed mb-5">{step.description}</p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7EBF8E]/10 border border-[#7EBF8E]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                  <span className="text-[#7EBF8E] text-xs font-semibold">{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
