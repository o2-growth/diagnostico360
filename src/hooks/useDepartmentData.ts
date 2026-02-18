
import { useState } from 'react';
import type { DepartmentData } from '@/types/department';

export const useDepartmentData = (id: string | undefined) => {
  const [departmentInfo] = useState<DepartmentData>(() => {
    const departments: Record<string, DepartmentData> = {
      'financeiro': {
        title: 'Financeiro',
        name: 'Financeiro',
        color: '#7EBF8E',
        description: 'Gestão financeira',
      },
      'tecnologia': {
        title: 'Tecnologia',
        name: 'Tecnologia',
        color: '#8989DE',
        description: 'Gestão de tecnologia e infraestrutura',
      },
      'planejamento': {
        title: 'Planejamento',
        name: 'Planejamento',
        color: '#61AAF2',
        description: 'Planejamento estratégico',
      },
      'contabil': {
        title: 'Contábil',
        name: 'Contábil',
        color: '#F97316',
        description: 'Gestão contábil',
      },
      'controladoria': {
        title: 'Controladoria',
        name: 'Controladoria',
        color: '#9b87f5',
        description: 'Controle e auditoria',
      },
      'fiscal': {
        title: 'Fiscal',
        name: 'Fiscal',
        color: '#0EA5E9',
        description: 'Gestão fiscal e tributária',
      },
      'comercial': {
        title: 'Comercial',
        name: 'Comercial',
        color: '#EC4899',
        description: 'Gestão comercial e vendas',
      },
      'marketing': {
        title: 'Marketing',
        name: 'Marketing',
        color: '#F59E0B',
        description: 'Marketing e comunicação',
      },
      'societario': {
        title: 'Societário',
        name: 'Societário',
        color: '#10B981',
        description: 'Gestão societária',
      },
      'capital-humano': {
        title: 'Capital Humano',
        name: 'Capital Humano',
        color: '#6366F1',
        description: 'Gestão de pessoas',
      }
    };
    return departments[id as keyof typeof departments] || {
      title: 'Área não encontrada',
      name: 'Área não encontrada',
      color: '#6B7280',
      description: 'Esta área não existe',
    };
  });

  return { departmentInfo };
};
