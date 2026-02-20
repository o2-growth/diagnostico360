export const LPSocialProof = () => {
  const companies = [
    "Construtora & Incorporadora",
    "Rede de Franquias",
    "Indústria Metal-Mecânica",
    "Distribuidora Atacadista",
    "Clínica Médica",
    "Agronegócio",
    "Tecnologia B2B",
    "Varejo Multicanal",
  ];

  return (
    <section className="py-10 border-y border-white/6 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[#A0A0A0] text-xs font-semibold uppercase tracking-widest mb-8">
          Confiado por empresas de todos os segmentos
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {companies.map((name) => (
            <div
              key={name}
              className="px-5 py-2.5 rounded-full border border-white/8 bg-white/[0.02] text-[#606060] text-sm font-medium whitespace-nowrap"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
