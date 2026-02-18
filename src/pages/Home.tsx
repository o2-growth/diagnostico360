
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { useState, useEffect } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { questions } from '@/data/questions';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(true);
  const [hasOngoingAssessment, setHasOngoingAssessment] = useState(false);
  
  // Use the useAssessment hook to check if there's an ongoing assessment
  const { hasOngoingAssessment: checkOngoingAssessment } = useAssessment(questions);

  useEffect(() => {
    // Check if there's an ongoing assessment using the hook
    const isOngoing = checkOngoingAssessment();
    setHasOngoingAssessment(isOngoing);
  }, [checkOngoingAssessment]);

  const handleStartDiagnosis = () => {
    navigate('/assessment');
  };

  const handleContinueDiagnosis = () => {
    navigate('/ongoing-assessment');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex bg-dashboard-dark">
      <SidePanel onTabChange={handleTabChange} onMenuToggle={setMenuOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${menuOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-dashboard-accent3 to-green-400 text-transparent bg-clip-text">
              Diagnóstico 360
            </h1>
            
            <p className="text-xl text-dashboard-text mb-12">
              Avalie o nível de excelência de cada área da sua empresa e identifique 
              oportunidades de melhoria.
            </p>
            
            <div className="flex flex-col items-center">
              <Button
                onClick={handleStartDiagnosis}
                size="lg"
                className="group bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/20 text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Iniciar Diagnóstico
              </Button>
              
              {hasOngoingAssessment && (
                <button 
                  onClick={handleContinueDiagnosis}
                  className="mt-4 text-dashboard-accent3 hover:underline text-sm font-medium"
                >
                  Continuar diagnóstico em andamento
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-16 dashboard-card max-w-2xl mx-auto">
            <h2 className="text-2xl font-medium mb-6 text-dashboard-accent3">Como funciona</h2>
            <ul className="space-y-4 text-dashboard-text">
              <li className="flex items-start gap-4">
                <span className="shrink-0 flex items-center justify-center rounded-full bg-dashboard-accent3/20 text-dashboard-accent3 w-8 h-8 text-sm font-bold">1</span>
                <span className="pt-1">Responda perguntas específicas para cada departamento da sua empresa</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="shrink-0 flex items-center justify-center rounded-full bg-dashboard-accent3/20 text-dashboard-accent3 w-8 h-8 text-sm font-bold">2</span>
                <span className="pt-1">Visualize resultados em tempo real com gráficos e métricas detalhadas</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="shrink-0 flex items-center justify-center rounded-full bg-dashboard-accent3/20 text-dashboard-accent3 w-8 h-8 text-sm font-bold">3</span>
                <span className="pt-1">Receba recomendações personalizadas para melhorar cada área</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
