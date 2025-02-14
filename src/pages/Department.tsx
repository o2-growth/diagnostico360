
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import DepartmentOverview from '@/components/department/DepartmentOverview';
import DepartmentQuestions from '@/components/department/DepartmentQuestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { evolutionData } from '@/data/evolutionData';
import { getQuestionsByDepartment } from '@/data/questionsData/index';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { departmentInfo } = useDepartmentData(id);
  const { toast } = useToast();
  const questions = getQuestionsByDepartment(id || '');

  if (!departmentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-dashboard-muted">Área não encontrada</p>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  const calculateTotalCost = () => {
    const employeeCost = departmentInfo.team.reduce((acc, emp) => 
      acc + (emp.salary + emp.benefits), 0);
    const toolsCost = departmentInfo.tools.reduce((acc, tool) => 
      acc + tool.monthlyCost, 0);
    return employeeCost + toolsCost;
  };

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={handleTabChange} onMenuToggle={handleMenuToggle} />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <DepartmentHeader
              departmentInfo={departmentInfo}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onBack={() => navigate('/', { state: { activeTab: 'areas' } })}
            />
            <Button
              variant="outline"
              onClick={() => navigate('/collaborators')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Ver Colaboradores
            </Button>
          </div>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <DepartmentOverview
                departmentInfo={departmentInfo}
                calculateTotalCost={calculateTotalCost}
                evolutionData={evolutionData}
              />
            </TabsContent>
            <TabsContent value="questions">
              <DepartmentQuestions questions={questions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Department;
