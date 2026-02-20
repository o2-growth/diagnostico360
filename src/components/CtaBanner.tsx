import { MessageCircle } from 'lucide-react';
import { calculateScores } from '@/utils/scoreCalculator';

const CtaBanner = () => {
  const { overallScore } = calculateScores();

  if (overallScore === 0) return null;

  return (
    <>
      <div className="dashboard-card p-6 flex items-center justify-between rounded-xl" style={{
        background: 'linear-gradient(135deg, rgba(126, 191, 142, 0.15), rgba(97, 170, 242, 0.12))',
        border: '1px solid rgba(126, 191, 142, 0.35)',
        boxShadow: '0 0 20px rgba(126, 191, 142, 0.08)',
      }}>
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full p-2" style={{ background: 'rgba(126, 191, 142, 0.15)' }}>
            <MessageCircle className="h-5 w-5" style={{ color: '#7EBF8E' }} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Transforme seus resultados em ação</h3>
            <p className="text-dashboard-muted text-sm">
              Nossos especialistas já ajudaram <strong>+2000 empresas</strong> a evoluir. Seu score é <strong>{overallScore}%</strong> — vamos melhorar juntos.
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/5511999999999?text=${encodeURIComponent(
            `Olá! Fiz o Diagnóstico 360 e meu score geral foi ${overallScore}%. Gostaria de falar com um especialista.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base whitespace-nowrap transition-all duration-300 hover:scale-110 hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, #7EBF8E, #4CAF50)',
            color: '#fff',
            boxShadow: '0 0 18px rgba(126, 191, 142, 0.45), 0 4px 12px rgba(0,0,0,0.2)',
            animation: 'cta-glow 2s ease-in-out infinite alternate',
          }}
        >
          <MessageCircle className="h-5 w-5" />
          Falar com Especialista
        </a>
      </div>
      <style>{`
        @keyframes cta-glow {
          0% { box-shadow: 0 0 12px rgba(126, 191, 142, 0.3), 0 4px 12px rgba(0,0,0,0.2); }
          100% { box-shadow: 0 0 24px rgba(126, 191, 142, 0.6), 0 4px 16px rgba(0,0,0,0.25); }
        }
      `}</style>
    </>
  );
};

export default CtaBanner;
