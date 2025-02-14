
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import DepartmentOverview from '@/components/department/DepartmentOverview';
import DepartmentQuestions from '@/components/department/DepartmentQuestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { evolutionData } from '@/data/evolutionData';
import { useToast } from "@/components/ui/use-toast";
import { Question } from '@/types/department';
import { marketingQuestions } from '@/data/questions/marketing';
import { financialQuestions } from '@/data/questions/financial';
import { technologyQuestions } from '@/data/questions/technology';
import { planningQuestions } from '@/data/questions/planning';
import { accountingQuestions } from '@/data/questions/accounting';
import { controllingQuestions } from '@/data/questions/controlling';
import { taxQuestions } from '@/data/questions/tax';
import { commercialQuestions } from '@/data/questions/commercial';
import { corporateQuestions } from '@/data/questions/corporate';
import { humanCapitalQuestions } from '@/data/questions/human-capital';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { departmentInfo } = useDepartmentData(id);
  const { toast } = useToast();

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

  const getDepartmentQuestions = (): Question[] => {
    switch (id) {
      case 'marketing':
        return marketingQuestions;
      case 'financeiro':
        return financialQuestions;
      case 'tecnologia':
        return technologyQuestions;
      case 'planejamento':
        return planningQuestions;
      case 'contabil':
        return accountingQuestions;
      case 'controladoria':
        return controllingQuestions;
      case 'fiscal':
        return taxQuestions;
      case 'comercial':
        return commercialQuestions;
      case 'societario':
        return corporateQuestions;
      case 'capital-humano':
        return humanCapitalQuestions;
      default:
        return [];
    }
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
          <DepartmentHeader
            departmentInfo={departmentInfo}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onBack={() => navigate('/', { state: { activeTab: 'areas' } })}
          />
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
              <DepartmentQuestions questions={getDepartmentQuestions()} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Department;

