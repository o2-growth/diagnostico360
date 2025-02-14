
import { useState } from 'react';
import type { DepartmentData } from '@/types/department';

export const useDepartmentData = (id: string | undefined) => {
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentData>(() => {
    const departments: Record<string, DepartmentData> = {
      'financeiro': {
        title: 'Financeiro',
        name: 'Financeiro',
        color: '#7EBF8E',
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
      },
      'tecnologia': {
        title: 'Tecnologia',
        name: 'Tecnologia',
        color: '#8989DE',
        description: 'Gestão de tecnologia e infraestrutura',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
        leader: 'Pedro Santos',
        employees: 15,
        team: [],
        tools: []
      },
      'planejamento': {
        title: 'Planejamento',
        name: 'Planejamento',
        color: '#61AAF2',
        description: 'Planejamento estratégico',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe',
        leader: 'Ana Costa',
        employees: 8,
        team: [],
        tools: []
      },
      'contabil': {
        title: 'Contábil',
        name: 'Contábil',
        color: '#F97316',
        description: 'Gestão contábil',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
        leader: 'Carlos Ferreira',
        employees: 10,
        team: [],
        tools: []
      },
      'controladoria': {
        title: 'Controladoria',
        name: 'Controladoria',
        color: '#9b87f5',
        description: 'Controle e auditoria',
        image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28',
        leader: 'Roberto Lima',
        employees: 6,
        team: [],
        tools: []
      },
      'fiscal': {
        title: 'Fiscal',
        name: 'Fiscal',
        color: '#0EA5E9',
        description: 'Gestão fiscal e tributária',
        image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07',
        leader: 'Fernanda Silva',
        employees: 7,
        team: [],
        tools: []
      },
      'comercial': {
        title: 'Comercial',
        name: 'Comercial',
        color: '#EC4899',
        description: 'Gestão comercial e vendas',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
        leader: 'Ricardo Santos',
        employees: 20,
        team: [],
        tools: []
      },
      'marketing': {
        title: 'Marketing',
        name: 'Marketing',
        color: '#F59E0B',
        description: 'Marketing e comunicação',
        image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07',
        leader: 'Juliana Costa',
        employees: 12,
        team: [],
        tools: []
      },
      'societario': {
        title: 'Societário',
        name: 'Societário',
        color: '#10B981',
        description: 'Gestão societária',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
        leader: 'Marcos Oliveira',
        employees: 5,
        team: [],
        tools: []
      },
      'capital-humano': {
        title: 'Capital Humano',
        name: 'Capital Humano',
        color: '#6366F1',
        description: 'Gestão de pessoas',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
        leader: 'Patricia Lima',
        employees: 8,
        team: [],
        tools: []
      }
    };
    return departments[id as keyof typeof departments] || {
      title: 'Área não encontrada',
      name: 'Área não encontrada',
      color: '#6B7280',
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
