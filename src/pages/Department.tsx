
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { ChevronLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [departmentInfo, setDepartmentInfo] = useState(() => {
    const departments = {
      'financeiro': {
        title: 'Financeiro',
        description: 'Gestão financeira',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        leader: 'Maria Silva',
        employees: 12
      },
      'tecnologia': {
        title: 'Tecnologia',
        description: 'Infraestrutura e sistemas',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        leader: 'João Santos',
        employees: 25
      },
      'planejamento': {
        title: 'Planejamento',
        description: 'Estratégia e projetos',
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e',
        leader: 'Ana Oliveira',
        employees: 8
      },
      'contabil': {
        title: 'Contábil',
        description: 'Contabilidade',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
        leader: 'Carlos Lima',
        employees: 15
      },
      'controladoria': {
        title: 'Controladoria',
        description: 'Controle e auditoria',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        leader: 'Paulo Costa',
        employees: 10
      },
      'fiscal': {
        title: 'Fiscal',
        description: 'Gestão tributária',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        leader: 'Amanda Souza',
        employees: 18
      },
      'comercial': {
        title: 'Comercial',
        description: 'Vendas e negócios',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
        leader: 'Roberto Alves',
        employees: 30
      },
      'marketing': {
        title: 'Marketing',
        description: 'Comunicação e marca',
        image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312',
        leader: 'Mariana Costa',
        employees: 20
      },
      'societario': {
        title: 'Societário',
        description: 'Gestão corporativa',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
        leader: 'Ricardo Martins',
        employees: 6
      },
      'capital-humano': {
        title: 'Capital Humano',
        description: 'Recursos humanos',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
        leader: 'Fernanda Santos',
        employees: 14
      },
    };
    return departments[id as keyof typeof departments] || {
      title: 'Área não encontrada',
      description: 'Esta área não existe',
      image: '',
      leader: '',
      employees: 0
    };
  });

  const evolutionData = [
    { month: 'Jan', value: 65 },
    { month: 'Fev', value: 70 },
    { month: 'Mar', value: 75 },
    { month: 'Abr', value: 78 },
    { month: 'Mai', value: 82 },
    { month: 'Jun', value: 85 }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  return (
    <div className="min-h-screen">
      <SidePanel 
        onTabChange={handleTabChange} 
        onMenuToggle={handleMenuToggle}
      />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/', { state: { activeTab: 'areas' } })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-medium mb-2">{departmentInfo.title}</h1>
              <p className="text-dashboard-muted">{departmentInfo.description}</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month"
                    stroke="#828179"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#828179"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A19',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#C4C3BB' }}
                  />
                  <Bar dataKey="value" fill="#8989DE" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="processes">Processos</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Sobre a área</h3>
                    <p className="text-dashboard-muted">
                      Esta seção conterá uma visão geral detalhada da área, incluindo suas principais responsabilidades e objetivos.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Responsável pela área</h4>
                      <p className="text-dashboard-muted">{departmentInfo.leader}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Colaboradores</h4>
                      <div className="flex items-center gap-2 text-dashboard-muted">
                        <Users className="h-4 w-4" />
                        <span>{departmentInfo.employees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="processes">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Processos</h3>
                  <p className="text-dashboard-muted">
                    Aqui serão listados os principais processos e fluxos de trabalho da área.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="questions">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Perguntas Frequentes</h3>
                  <p className="text-dashboard-muted">
                    Esta seção será expandida com perguntas e respostas específicas sobre diversos aspectos da área.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
