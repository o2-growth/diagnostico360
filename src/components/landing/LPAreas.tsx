import {
  DollarSign, Cpu, Target, BookOpen, PieChart,
  Receipt, ShoppingCart, Megaphone, Building2, Users,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCallback, useRef, useState } from "react";

export const LPAreas = () => {
  const areas = [
    { icon: Building2, title: "Societário", description: "Estrutura jurídica, sócios, governança e compliance societário." },
    { icon: Cpu, title: "Tecnologia", description: "Sistemas, automação, segurança digital e maturidade tecnológica." },
    { icon: ShoppingCart, title: "Comercial", description: "Processo de vendas, CRM, funil e gestão da equipe comercial." },
    { icon: Megaphone, title: "Marketing", description: "Posicionamento, geração de leads, marca e estratégia digital." },
    { icon: DollarSign, title: "Financeiro", description: "Fluxo de caixa, capital de giro, rentabilidade e saúde financeira." },
    { icon: PieChart, title: "Controladoria", description: "Controles internos, orçamento, indicadores e gestão de custos." },
    { icon: Receipt, title: "Fiscal", description: "Obrigações tributárias, planejamento fiscal e conformidade legal." },
    { icon: BookOpen, title: "Contábil", description: "Escrituração, demonstrações financeiras e qualidade contábil." },
    { icon: Users, title: "Capital Humano", description: "RH, cultura, recrutamento, retenção e desenvolvimento de talentos." },
    { icon: Target, title: "Planejamento", description: "Estratégia, metas, OKRs, visão de longo prazo e execução." },
  ];

  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="areas" className="py-24 px-6 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">Cobertura completa</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">O que você vai descobrir</h2>
          <p className="text-[#A0A0A0] text-lg mt-4 max-w-xl mx-auto">10 áreas analisadas em profundidade. Nenhum ponto cego.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {areas.map((area, i) => {
            const Icon = area.icon;
            return <TiltCard key={area.title} icon={Icon} title={area.title} description={area.description} delay={i * 80} />;
          })}
        </div>
      </div>
    </section>
  );
};

function TiltCard({ icon: Icon, title, description, delay }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useScrollReveal<HTMLDivElement>({ staggerDelay: delay });
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`);
  }, []);

  const handleMouseLeave = useCallback(() => setTransform(""), []);

  return (
    <div ref={ref}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform, transition: "transform 0.2s ease-out" }}
        className="group p-5 rounded-2xl border border-white/6 bg-white/[0.02] hover:border-[#7EBF8E]/30 hover:bg-[#7EBF8E]/[0.04] transition-all duration-300 cursor-default"
      >
        <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/15 flex items-center justify-center mb-4 group-hover:bg-[#4CAF50]/20 transition-colors">
          <Icon className="w-4.5 h-4.5 text-[#7EBF8E]" />
        </div>
        <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
        <p className="text-[#606060] text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
