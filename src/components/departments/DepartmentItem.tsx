
import { LucideIcon } from 'lucide-react';

interface DepartmentItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  iconColor: string;
}

const DepartmentItem = ({ icon: Icon, title, description, onClick, iconColor }: DepartmentItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-3 glass-card cursor-pointer hover:bg-white/5 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentItem;
