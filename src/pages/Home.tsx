
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(true);
  const [hasOngoingAssessment, setHasOngoingAssessment] = useState(false);

  useEffect(() => {
    // Check if there's an ongoing assessment
    const storedAnswers = localStorage.getItem('departmentAnswers');
    if (storedAnswers) {
      const parsedAnswers = JSON.parse(storedAnswers);
      const answeredQuestions = Object.keys(parsedAnswers);
      setHasOngoingAssessment(answeredQuestions.length > 0);
    }
  }, []);

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
                className="group bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Iniciar Diagnóstico
              </Button>
              
              {hasOngoingAssessment && (
                <button 
                  onClick={handleContinueDiagnosis}
                  className="mt-4 text-dashboard-accent3 hover:underline text-sm"
                >
                  Continuar diagnóstico em andamento
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-16 glass-card p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-medium mb-4 text-dashboard-accent3">Como funciona</h2>
            <ul className="space-y-3 text-dashboard-text">
              <li className="flex items-start">
                <span className="inline-block rounded-full bg-dashboard-accent3 text-dashboard-dark w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <span>Responda perguntas específicas para cada departamento da sua empresa</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block rounded-full bg-dashboard-accent3 text-dashboard-dark w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <span>Visualize resultados em tempo real com gráficos e métricas detalhadas</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block rounded-full bg-dashboard-accent3 text-dashboard-dark w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <span>Receba recomendações personalizadas para melhorar cada área</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
