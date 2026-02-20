import { CheckCircle2, FileText, BarChart2, Zap } from "lucide-react";

export const LPResults = () => {
  const deliverables = [
    { icon: BarChart2, title: "Score Geral", desc: "Nota de 0–100% da empresa" },
    { icon: CheckCircle2, title: "Score por Área", desc: "Detalhado nas 10 dimensões" },
    { icon: Zap, title: "Plano de Ação", desc: "Priorizado por impacto e esforço" },
    { icon: FileText, title: "Relatório PDF", desc: "Exportável para apresentar ao time" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">
              Resultado concreto
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight mb-6">
              Você vai sair com isso em mãos
            </h2>
            <p className="text-[#A0A0A0] text-lg mb-10 leading-relaxed">
              Não é só um questionário. É um mapa completo da sua empresa, com dados
              acionáveis que você pode levar direto para o seu time.
            </p>

            <div className="space-y-4">
              {deliverables.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/12 border border-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#7EBF8E]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-[#606060] text-xs">{item.desc}</div>
                    </div>
                    <div className="ml-auto">
                      <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right – dashboard mockup */}
          <div className="relative">
            <div className="rounded-3xl border border-white/8 bg-[#0D0D0D] p-6 shadow-2xl shadow-black/60">
              {/* Header mock */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[#A0A0A0] text-xs mb-1">Score Geral</div>
                  <div className="text-white font-black text-4xl">78%</div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#4CAF50]/40 flex items-center justify-center">
                  <span className="text-[#4CAF50] font-black text-lg">B+</span>
                </div>
              </div>

              {/* Bars mock */}
              <div className="space-y-3">
                {[
                  { label: "Financeiro", score: 85, color: "#4CAF50" },
                  { label: "Tecnologia", score: 62, color: "#7EBF8E" },
                  { label: "Comercial", score: 91, color: "#4CAF50" },
                  { label: "Capital Humano", score: 48, color: "#E57373" },
                  { label: "Controladoria", score: 73, color: "#7EBF8E" },
                  { label: "Marketing", score: 55, color: "#FFB74D" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#A0A0A0]">{item.label}</span>
                      <span className="text-white font-semibold">{item.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.score}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom label */}
              <div className="mt-5 pt-5 border-t border-white/6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
                <span className="text-[#606060] text-xs">Relatório gerado • PDF disponível</span>
              </div>
            </div>

            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-[#4CAF50]/6 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
