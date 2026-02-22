import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const LPTestimonials = () => {
  const testimonials = [
    {
      name: "Rodrigo Zanetti", role: "CEO", company: "Zanetti Construtora", city: "Porto Alegre, RS",
      text: "O diagnóstico me mostrou que nossa área de Controladoria estava no 0. Nunca tinha parado para medir isso. Em 3 meses implementamos um DRE gerencial e nossa margem melhorou 8 pontos.",
      initials: "RZ", color: "#4CAF50",
    },
    {
      name: "Juliana Fonseca", role: "Sócia-Diretora", company: "Fonseca & Filhos Atacado", city: "Caxias do Sul, RS",
      text: "Achei que ia ser mais um questionário genérico. Me surpreendi com a profundidade. As recomendações de Capital Humano eram exatamente o que precisávamos — e agora temos um processo de onboarding estruturado.",
      initials: "JF", color: "#7EBF8E",
    },
    {
      name: "Marcos Teixeira", role: "Fundador", company: "TechFlow Sistemas", city: "São Paulo, SP",
      text: "Usamos o relatório para apresentar para os investidores. O score de 73% com pontos de melhoria mapeados foi muito mais convincente do que um pitch deck. Conseguimos a rodada.",
      initials: "MT", color: "#00E676",
    },
  ];

  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 px-6 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">Casos reais</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">Quem usou, transformou</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const cardRef = useScrollReveal<HTMLDivElement>({ staggerDelay: i * 150 });
            return (
              <div key={t.name} ref={cardRef} className="p-7 rounded-3xl border border-white/8 bg-white/[0.02] flex flex-col gap-5 hover:border-[#7EBF8E]/20 transition-all duration-300">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#4CAF50] text-[#4CAF50]" />
                  ))}
                </div>
                <p className="text-[#C0C0C0] text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A0A0A] font-black text-xs flex-shrink-0" style={{ backgroundColor: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-[#606060] text-xs">{t.role} · {t.company}</div>
                    <div className="text-[#404040] text-xs">{t.city}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
