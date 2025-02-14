
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit2 } from 'lucide-react';
import type { DepartmentData } from '@/types/department';

interface DepartmentHeaderProps {
  departmentInfo: DepartmentData;
  isEditing: boolean;
  onEditToggle: () => void;
  onBack: () => void;
}

const DepartmentHeader = ({ departmentInfo, isEditing, onEditToggle, onBack }: DepartmentHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-medium mb-2">{departmentInfo.title}</h1>
        <p className="text-dashboard-muted">{departmentInfo.description}</p>
      </div>
      <Button
        variant="outline"
        onClick={onEditToggle}
        className="gap-2"
      >
        <Edit2 className="h-4 w-4" />
        {isEditing ? 'Salvar' : 'Editar'}
      </Button>
    </div>
  );
};

export default DepartmentHeader;

