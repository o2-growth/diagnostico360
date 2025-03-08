
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

interface ContinueAssessmentProps {
  completedCount: number;
  totalCount: number;
}

const ContinueAssessment = ({ completedCount, totalCount }: ContinueAssessmentProps) => {
  const navigate = useNavigate();
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="mb-8 p-6 border border-green-500/20 bg-green-500/5 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-medium text-green-500">Diagnóstico em andamento</h3>
        <span className="text-sm text-dashboard-muted">{progress}% completo</span>
      </div>
      
      <p className="text-dashboard-muted mb-4">
        Você já respondeu {completedCount} de {totalCount} questões. Continue de onde parou!
      </p>
      
      <Button 
        onClick={() => navigate('/ongoing-assessment')}
        className="bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90"
      >
        <ClipboardList className="mr-2 h-4 w-4" />
        Continuar diagnóstico
      </Button>
    </div>
  );
};

export default ContinueAssessment;
