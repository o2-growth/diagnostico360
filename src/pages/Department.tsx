
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import DepartmentOverview from '@/components/department/DepartmentOverview';
import DepartmentQuestions from '@/components/department/DepartmentQuestions';
import DepartmentRecommendations from '@/components/department/DepartmentRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useAssessmentDB } from '@/hooks/useAssessmentDB';
import { Question } from '@/types/department';
import { Skeleton } from '@/components/ui/skeleton';
import { questionGroups } from '@/data/questions';

const STORAGE_KEYS = { ANSWERS: 'departmentAnswers', GATES: 'departmentGates', RECOMMENDATIONS: 'departmentRecommendations' } as const;

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { departmentInfo } = useDepartmentData(id);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { loading: dbLoading } = useAssessmentDB();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (dbLoading) return; // Wait for DB data to hydrate localStorage
    const baseQuestions = getDepartmentQuestions();

    // Load stored answers from localStorage if available
    const storedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    if (storedAnswers) {
      const parsedAnswers = JSON.parse(storedAnswers);

      // Merge department questions with saved answers
      const updatedQuestions = baseQuestions.map(question => {
        const savedQuestion = parsedAnswers[question.item];
        if (savedQuestion) {
          return {
            ...question,
            evaluation: savedQuestion.evaluation,
          };
        }
        return question;
      });

      setQuestions(updatedQuestions);
    } else {
      setQuestions(baseQuestions);
    }
  }, [id, dbLoading]);

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

  const getDepartmentQuestions = (): Question[] => {
    const group = questionGroups.find(g => g.id === id);
    return group?.questions ?? [];
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
            onBack={() => navigate('/dashboard', { state: { activeTab: 'dashboard' } })}
            isAdmin={isAdmin}
          />
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="questions">Questões</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <DepartmentOverview
                departmentInfo={departmentInfo}
                questions={questions}
              />
            </TabsContent>
            <TabsContent value="questions">
              <DepartmentQuestions questions={questions} isAdmin={isAdmin} />
            </TabsContent>
            <TabsContent value="recommendations">
              <DepartmentRecommendations questions={questions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Department;
