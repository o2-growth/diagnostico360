import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const LPFAQ = () => {
  const faqs = [
    {
      q: "Para quem é o Diagnóstico 360?",
      a: "Para donos de PMEs, sócios, diretores e gestores que querem ter clareza sobre o estágio atual da empresa. Não importa o segmento ou tamanho — o diagnóstico se adapta ao contexto do seu negócio.",
    },
    {
      q: "Quanto tempo leva para fazer o diagnóstico?",
      a: "Em média 25–35 minutos. As 69 perguntas são objetivas e diretas. Você pode pausar e retomar quando quiser — suas respostas ficam salvas.",
    },
    {
      q: "E se eu não gostar? Tem garantia?",
      a: "Sim. Se dentro de 7 dias você achar que não valeu a pena, basta enviar um e-mail e devolvemos 100% do valor, sem burocracias e sem perguntas.",
    },
    {
      q: "Preciso ter conhecimento técnico para interpretar o resultado?",
      a: "Não. O relatório foi pensado para ser acessível a qualquer gestor. Os gráficos e as recomendações são claros e diretos, sem termos técnicos desnecessários.",
    },
    {
      q: "O diagnóstico é feito uma única vez ou posso repetir?",
      a: "Você pode refazer o diagnóstico a qualquer momento. Recomendamos repetir a cada 6 meses para acompanhar a evolução e medir o progresso das ações implementadas.",
    },
    {
      q: "Como funciona o acesso após o pagamento?",
      a: "Assim que o pagamento é confirmado pelo Stripe, você cria seu acesso e entra direto no dashboard para iniciar o diagnóstico. O processo leva menos de 2 minutos.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#0D0D0D]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#7EBF8E] text-xs font-bold uppercase tracking-widest">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
            Perguntas frequentes
          </h2>
        </div>

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
    </section>
  );
};
