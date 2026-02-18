
import { LucideIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface DepartmentItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  iconColor: string;
  progress?: number;
}

const DepartmentItem = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  iconColor,
  progress = 0 
}: DepartmentItemProps) => {
  return (
    <div
      className="flex items-center justify-between p-4 glass-card cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-dashboard-muted">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-dashboard-muted font-medium">{progress}%</span>
        <div className="w-24">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default DepartmentItem;
