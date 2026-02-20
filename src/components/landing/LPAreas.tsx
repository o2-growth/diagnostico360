import {
  DollarSign,
  Cpu,
  Target,
  BookOpen,
  PieChart,
  Receipt,
  ShoppingCart,
  Megaphone,
  Building2,
  Users,
} from "lucide-react";

export const LPAreas = () => {
  const areas = [
    {
      icon: Building2,
      title: "Societário",
      description: "Estrutura jurídica, sócios, governança e compliance societário.",
    },
    {
      icon: Cpu,
      title: "Tecnologia",
      description: "Sistemas, automação, segurança digital e maturidade tecnológica.",
    },
    {
      icon: ShoppingCart,
      title: "Comercial",
      description: "Processo de vendas, CRM, funil e gestão da equipe comercial.",
    },
    {
      icon: Megaphone,
      title: "Marketing",
      description: "Posicionamento, geração de leads, marca e estratégia digital.",
    },
    {
      icon: DollarSign,
      title: "Financeiro",
      description: "Fluxo de caixa, capital de giro, rentabilidade e saúde financeira.",
    },
    {
      icon: PieChart,
      title: "Controladoria",
      description: "Controles internos, orçamento, indicadores e gestão de custos.",
    },
    {
      icon: Receipt,
      title: "Fiscal",
      description: "Obrigações tributárias, planejamento fiscal e conformidade legal.",
    },
    {
      icon: BookOpen,
      title: "Contábil",
      description: "Escrituração, demonstrações financeiras e qualidade contábil.",
    },
    {
      icon: Users,
      title: "Capital Humano",
      description: "RH, cultura, recrutamento, retenção e desenvolvimento de talentos.",
    },
    {
      icon: Target,
      title: "Planejamento",
      description: "Estratégia, metas, OKRs, visão de longo prazo e execução.",
    },
  ];

  return (
    <section id="areas" className="py-24 px-6 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">
            Cobertura completa
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
            O que você vai descobrir
          </h2>
          <p className="text-[#A0A0A0] text-lg mt-4 max-w-xl mx-auto">
            10 áreas analisadas em profundidade. Nenhum ponto cego.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className="group p-5 rounded-2xl border border-white/6 bg-white/[0.02] hover:border-[#7EBF8E]/30 hover:bg-[#7EBF8E]/[0.04] transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/15 flex items-center justify-center mb-4 group-hover:bg-[#4CAF50]/20 transition-colors">
                  <Icon className="w-4.5 h-4.5 text-[#7EBF8E]" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{area.title}</h3>
                <p className="text-[#606060] text-xs leading-relaxed">{area.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
