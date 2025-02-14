
import { useState } from 'react';
import SidePanel from '@/components/SidePanel';
import { Card } from '@/components/ui/card';
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { Plus, Filter, Pencil, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Employee } from '@/types/department';

type EmployeeSegment = 'Quitters' | 'Disruptors' | 'Mildly disengaged' | 'Reliable and committed' | 'Thriving stars';

interface IEmployeeWithDepartment extends Employee {
  department: string;
  departmentTitle: string;
  segment: EmployeeSegment;
  active?: boolean;
}

const Collaborators = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeWithDepartment | null>(null);
  
  const departments = {
    'financeiro': useDepartmentData('financeiro').departmentInfo,
    'tecnologia': useDepartmentData('tecnologia').departmentInfo,
    'planejamento': useDepartmentData('planejamento').departmentInfo,
    'contabil': useDepartmentData('contabil').departmentInfo,
    'controladoria': useDepartmentData('controladoria').departmentInfo,
    'fiscal': useDepartmentData('fiscal').departmentInfo,
    'comercial': useDepartmentData('comercial').departmentInfo,
    'marketing': useDepartmentData('marketing').departmentInfo,
    'societario': useDepartmentData('societario').departmentInfo,
    'capital-humano': useDepartmentData('capital-humano').departmentInfo,
  };

  const getEmployeeSegment = (index: number): EmployeeSegment => {
    const segments: EmployeeSegment[] = [
      'Quitters',
      'Disruptors',
      'Mildly disengaged',
      'Reliable and committed',
      'Thriving stars'
    ];
    return segments[index % segments.length];
  };

  const allEmployees: IEmployeeWithDepartment[] = Object.entries(departments).flatMap(
    ([deptId, dept]) => 
      dept.team.map((employee, index) => ({
        ...employee,
        department: deptId,
        departmentTitle: dept.title,
        segment: getEmployeeSegment(index),
        active: true
      }))
  );

  const filteredEmployees = selectedDepartments.length > 0
    ? allEmployees.filter(emp => selectedDepartments.includes(emp.department))
    : allEmployees;

  const handleDepartmentToggle = (deptId: string) => {
    setSelectedDepartments(prev => {
      if (prev.includes(deptId)) {
        return prev.filter(id => id !== deptId);
      }
      return [...prev, deptId];
    });
  };

  const getSegmentColor = (segment: EmployeeSegment): string => {
    const colors = {
      'Quitters': 'bg-red-500',
      'Disruptors': 'bg-orange-500',
      'Mildly disengaged': 'bg-yellow-500',
      'Reliable and committed': 'bg-green-500',
      'Thriving stars': 'bg-blue-500'
    };
    return colors[segment];
  };

  return (
    <div className="min-h-screen">
      <SidePanel 
        onTabChange={() => {}} 
        onMenuToggle={setIsMenuExpanded} 
      />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Colaboradores</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Colaborador
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Adicionar Colaborador</SheetTitle>
                  <SheetDescription>
                    Preencha os dados do novo colaborador
                  </SheetDescription>
                </SheetHeader>
                {/* Formulário será implementado aqui */}
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <Card className="p-4 w-full md:w-64">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filtrar por área</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(departments).map(([id, dept]) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={selectedDepartments.includes(id)}
                      onCheckedChange={() => handleDepartmentToggle(id)}
                    />
                    <label
                      htmlFor={id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {dept.title}
                    </label>
                  </div>
                ))}
              </div>
              {selectedDepartments.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDepartments([])}
                  className="mt-4 w-full"
                >
                  Limpar filtros
                </Button>
              )}
            </Card>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee, index) => (
                  <Sheet key={`${employee.name}-${index}`}>
                    <SheetTrigger asChild>
                      <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{employee.name}</h3>
                            <Badge 
                              variant="default" 
                              className={getSegmentColor(employee.segment)}
                            >
                              {employee.segment}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{employee.role}</p>
                          <p className="text-sm">Área: {employee.departmentTitle}</p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">Salário:</span>
                              <span className="text-sm">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(employee.salary)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">Benefícios:</span>
                              <span className="text-sm">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(employee.benefits)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="flex items-center justify-between">
                          <span>Editar Colaborador</span>
                          <Button variant="destructive" size="sm">
                            <UserX className="h-4 w-4 mr-2" />
                            Desativar
                          </Button>
                        </SheetTitle>
                      </SheetHeader>
                      {/* Formulário de edição será implementado aqui */}
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;

