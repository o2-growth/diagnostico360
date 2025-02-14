
import { ChevronDown, ChevronRight } from 'lucide-react';

interface QuestionHeaderProps {
  isExpanded: boolean;
  itemId: string;
  title: string;
  onToggle: () => void;
}

const QuestionHeader = ({ isExpanded, itemId, title, onToggle }: QuestionHeaderProps) => {
  return (
    <div 
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-dashboard-card-hover"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-dashboard-muted" />
        ) : (
          <ChevronRight className="h-4 w-4 text-dashboard-muted" />
        )}
        <span className="font-medium">
          {itemId} - {title}
        </span>
      </div>
    </div>
  );
};

export default QuestionHeader;

