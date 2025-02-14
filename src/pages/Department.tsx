
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DepartmentHeader from '@/components/department/DepartmentHeader';
import DepartmentOverview from '@/components/department/DepartmentOverview';
import DepartmentQuestions from '@/components/department/DepartmentQuestions';
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { evolutionData } from '@/data/evolutionData';
import { questions } from '@/data/questionsData';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { departmentInfo } = useDepartmentData(id);

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'dashboard':
      case 'evolution':
      case 'areas':
      case 'settings':
        navigate('/', { state: { activeTab: value } });
        break;
    }
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

          <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
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
    </div>
  );
};

export default Department;

