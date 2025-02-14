
import { useState } from 'react';
import type { DepartmentData } from '@/types/department';

export const useDepartmentData = (id: string | undefined) => {
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentData>(() => {
    const departments: Record<string, DepartmentData> = {
      'financeiro': {
        title: 'Financeiro',
        description: 'Gestão financeira',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        leader: 'Maria Silva',
        employees: 12,
        team: [
          { name: 'João Silva', role: 'Analista Financeiro', salary: 5000, benefits: 1500 },
          { name: 'Maria Santos', role: 'Coordenadora Financeira', salary: 8000, benefits: 2000 },
          { name: 'Pedro Oliveira', role: 'Assistente Financeiro', salary: 3500, benefits: 1200 },
        ],
        tools: [
          { 
            name: 'SAP',
            plan: 'Enterprise',
            responsible: 'Maria Silva',
            purpose: 'Gestão financeira e contábil',
            monthlyCost: 5000,
            annualCost: 60000
          },
          {
            name: 'Conta Azul',
            plan: 'Business',
            responsible: 'João Silva',
            purpose: 'Controle de contas',
            monthlyCost: 500,
            annualCost: 6000
          }
        ]
      }
    };
    return departments[id as keyof typeof departments] || {
      title: 'Área não encontrada',
      description: 'Esta área não existe',
      image: '',
      leader: '',
      employees: 0,
      team: [],
      tools: []
    };
  });

  return { departmentInfo, setDepartmentInfo };
};

