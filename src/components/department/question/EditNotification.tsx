
import { Check } from 'lucide-react';

interface EditNotificationProps {
  isEdited: boolean;
  isEditMode: boolean;
}

const EditNotification = ({ isEdited, isEditMode }: EditNotificationProps) => {
  if (!isEdited || !isEditMode) return null;
  
  return (
    <div className="bg-green-500/10 p-2 rounded text-sm mt-4">
      <div className="flex items-center">
        <Check className="h-4 w-4 text-green-500 mr-2" />
        <span>Alterações pendentes. Clique em Salvar para confirmar.</span>
      </div>
    </div>
  );
};

export default EditNotification;
