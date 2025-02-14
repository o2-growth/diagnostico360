
import { useState } from 'react';
import SidePanel from '@/components/SidePanel';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Employee } from '@/types/department';

type EmployeeSegment = 'Quitters' | 'Disruptors' | 'Mildly disengaged' | 'Reliable and committed' | 'Thriving stars';

interface IEmployeeWithDepartment extends Employee {
  department: string;
  departmentTitle: string;
  segment: EmployeeSegment;
}

const Collaborators = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  
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
        segment: getEmployeeSegment(index)
      }))
  );

  const filteredEmployees = selectedDepartments.length > 0
    ? allEmployees.filter(emp => selectedDepartments.includes(emp.department))
    : allEmployees;

  const handleDepartmentSelect = (deptId: string) => {
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
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <Select
                onValueChange={handleDepartmentSelect}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecionar área" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(departments).map(([id, dept]) => (
                    <SelectItem key={id} value={id}>
                      <div className="flex items-center gap-2">
                        {selectedDepartments.includes(id) && <Check className="h-4 w-4" />}
                        <span>{dept.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDepartments.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDepartments([])}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee, index) => (
              <Card key={`${employee.name}-${index}`} className="p-4">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborators;

