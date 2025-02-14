
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import DepartmentOverview from '@/components/department/DepartmentOverview';
import DepartmentQuestions from '@/components/department/DepartmentQuestions';
import DepartmentEvolution from '@/components/department/DepartmentEvolution';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Department = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
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
          <DepartmentHeader departmentId={id || ''} />
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="evolution">Evolução</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <DepartmentOverview departmentId={id || ''} />
            </TabsContent>
            <TabsContent value="questions">
              <DepartmentQuestions departmentId={id || ''} />
            </TabsContent>
            <TabsContent value="evolution">
              <DepartmentEvolution departmentId={id || ''} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Department;
