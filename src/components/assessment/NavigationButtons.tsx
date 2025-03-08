
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveAndExit: () => void;
}

const NavigationButtons = ({
  isFirstQuestion,
  isLastQuestion,
  onPrevious,
  onNext,
  onSaveAndExit
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between mt-8">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={onSaveAndExit}
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar e Sair
        </Button>
      </div>
      <Button 
        onClick={onNext}
        className="bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90"
      >
        {isLastQuestion ? 'Finalizar' : 'Próxima'}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
