import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const LPFAQ = () => {
  const faqs = [
    { q: "Para quem é o Diagnóstico 360?", a: "Para donos de PMEs, sócios, diretores e gestores que querem ter clareza sobre o estágio atual da empresa. Não importa o segmento ou tamanho — o diagnóstico se adapta ao contexto do seu negócio." },
    { q: "Quanto tempo leva para fazer o diagnóstico?", a: "Em média 25–35 minutos. As 69 perguntas são objetivas e diretas. Você pode pausar e retomar quando quiser — suas respostas ficam salvas." },
    { q: "Como faço para entrar?", a: "Basta clicar em começar e autenticar com sua conta Google. Depois disso, você será direcionado para a plataforma." },
    { q: "Preciso ter conhecimento técnico para interpretar o resultado?", a: "Não. O relatório foi pensado para ser acessível a qualquer gestor. Os gráficos e as recomendações são claros e diretos, sem termos técnicos desnecessários." },
    { q: "O diagnóstico é feito uma única vez ou posso repetir?", a: "Você pode refazer o diagnóstico a qualquer momento. Recomendamos repetir a cada 6 meses para acompanhar a evolução e medir o progresso das ações implementadas." },
    { q: "O acesso é liberado imediatamente?", a: "Sim. Após o login com Google, você entra direto no dashboard para iniciar ou continuar seu diagnóstico." },
  ];

  const headerRef = useScrollReveal<HTMLDivElement>();
  const contentRef = useScrollReveal<HTMLDivElement>({ staggerDelay: 150 });

  return (
    <section className="py-24 px-6 bg-[#0D0D0D]">
      <div className="max-w-2xl mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">Perguntas frequentes</h2>
        </div>

        <div ref={contentRef}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-white/8 rounded-2xl bg-white/[0.02] px-6 py-1 data-[state=open]:border-[#7EBF8E]/25 data-[state=open]:bg-[#7EBF8E]/[0.03] transition-all duration-200"
              >
                <AccordionTrigger className="text-white font-semibold text-sm text-left hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A0A0A0] text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
