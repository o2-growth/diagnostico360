
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
      },
      'tecnologia': {
        title: 'Tecnologia',
        description: 'Infraestrutura e sistemas',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      },
      'planejamento': {
        title: 'Planejamento',
        description: 'Estratégia e projetos',
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e',
      },
      'contabil': {
        title: 'Contábil',
        description: 'Contabilidade',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
      },
      'controladoria': {
        title: 'Controladoria',
        description: 'Controle e auditoria',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      },
      'fiscal': {
        title: 'Fiscal',
        description: 'Gestão tributária',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      },
      'comercial': {
        title: 'Comercial',
        description: 'Vendas e negócios',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
      },
      'marketing': {
        title: 'Marketing',
        description: 'Comunicação e marca',
        image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312',
      },
      'societario': {
        title: 'Societário',
        description: 'Gestão corporativa',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
      },
      'capital-humano': {
        title: 'Capital Humano',
        description: 'Recursos humanos',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      },
    };
    return departments[id as keyof typeof departments] || {
      title: 'Área não encontrada',
      description: 'Esta área não existe',
      image: '',
    };
  });

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="dashboard-card">
                <img
                  src={departmentInfo.image}
                  alt={departmentInfo.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start mb-6">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="processes">Processos</TabsTrigger>
                    <TabsTrigger value="questions">Perguntas</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">Sobre a área</h3>
                      <p className="text-dashboard-muted">
                        Esta seção conterá uma visão geral detalhada da área, incluindo suas principais responsabilidades e objetivos.
                      </p>
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
            <div className="lg:col-span-1">
              <div className="dashboard-card">
                <h3 className="text-xl font-medium mb-4">Informações Adicionais</h3>
                <div className="space-y-4">
                  <p className="text-dashboard-muted">
                    Este painel lateral pode conter métricas, links rápidos e outras informações relevantes específicas da área.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
