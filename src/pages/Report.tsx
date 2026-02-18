import { useNavigate } from 'react-router-dom';
import { calculateScores } from '@/utils/scoreCalculator';
import { questionGroups } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import SidePanel from '@/components/SidePanel';
import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '@/components/theme/theme-provider';
import { useAssessmentDB } from '@/hooks/useAssessmentDB';
import { Skeleton } from '@/components/ui/skeleton';

function getClassification(score: number) {
  if (score <= 25) return { label: 'Crítico', color: '#EF4444' };
  if (score <= 50) return { label: 'Em Desenvolvimento', color: '#F97316' };
  if (score <= 75) return { label: 'Bom', color: '#EAB308' };
  return { label: 'Excelente', color: '#7EBF8E' };
}

function getEvaluationColor(evaluation: string | undefined) {
  if (!evaluation) return '#6B7280';
  if (evaluation === 'EXISTE E FUNCIONA PERFEITAMENTE') return '#7EBF8E';
  if (evaluation === 'EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)') return '#EAB308';
  return '#EF4444';
}

function getEvaluationLabel(evaluation: string | undefined) {
  if (!evaluation) return 'Não Avaliado';
  if (evaluation === 'EXISTE E FUNCIONA PERFEITAMENTE') return 'Funciona Perfeitamente';
  if (evaluation === 'EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)') return 'Pode Ser Melhorado';
  return 'Não Existe';
}

interface StoredAnswer {
  evaluation?: string;
  observation?: string;
}

const Report = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const { loading: dbLoading } = useAssessmentDB();

  const { departmentScores, overallScore } = calculateScores();
  const classification = getClassification(overallScore);

  const storedAnswers = localStorage.getItem('departmentAnswers');
  const answers: Record<string, StoredAnswer> = storedAnswers ? JSON.parse(storedAnswers) : {};

  const radarData = questionGroups.map((group) => ({
    department: group.name,
    score: departmentScores[group.id] ?? 0,
    fullMark: 100,
  }));

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    window.print();
  };

  const generateRecommendations = (groupId: string) => {
    const group = questionGroups.find((g) => g.id === groupId);
    if (!group) return [];

    const recommendations: { priority: string; text: string; item: string }[] = [];
    for (const q of group.questions) {
      const answer = answers[q.item];
      const evaluation = answer?.evaluation;
      if (!evaluation || evaluation === 'NÃO EXISTE' || evaluation.includes('NÃO EXISTE') || !evaluation.includes('EXISTE')) {
        recommendations.push({
          priority: 'Alta',
          item: q.item,
          text: `Prioridade Alta: Implementar ${q.title}. Esta área não possui estrutura para "${q.question}". Recomenda-se ação imediata.`,
        });
      } else if (evaluation.includes('PODE SER MELHORADO') || evaluation.includes('PADRONIZADA')) {
        recommendations.push({
          priority: 'Media',
          item: q.item,
          text: `Prioridade Média: Otimizar ${q.title}. Existe processo mas precisa de melhorias em padronização e eficiência.`,
        });
      }
    }
    return recommendations;
  };

  // Build action plan data
  const criticalItems: { dept: string; item: string; title: string; question: string }[] = [];
  const improvementItems: { dept: string; item: string; title: string; question: string }[] = [];
  const strengthItems: { dept: string; item: string; title: string; question: string }[] = [];

  for (const group of questionGroups) {
    for (const q of group.questions) {
      const answer = answers[q.item];
      const evaluation = answer?.evaluation;
      if (!evaluation || (!evaluation.includes('FUNCIONA') && !evaluation.includes('PADRONIZADA'))) {
        criticalItems.push({ dept: group.name, item: q.item, title: q.title, question: q.question });
      } else if (evaluation.includes('PADRONIZADA') || evaluation.includes('PODE SER MELHORADO')) {
        improvementItems.push({ dept: group.name, item: q.item, title: q.title, question: q.question });
      } else if (evaluation.includes('FUNCIONA PERFEITAMENTE')) {
        strengthItems.push({ dept: group.name, item: q.item, title: q.title, question: q.question });
      }
    }
  }

  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const textColor = theme === 'dark' ? '#e5e7eb' : '#1f2937';

  if (dbLoading) {
    return (
      <div className="min-h-screen">
        <SidePanel onTabChange={() => {}} onMenuToggle={setIsMenuExpanded} />
        <div className={`transition-all duration-300 ${isMenuExpanded ? 'pl-64' : 'pl-16'}`}>
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div data-print-hide>
        <SidePanel onTabChange={() => {}} onMenuToggle={setIsMenuExpanded} />
      </div>
      <div
        className={`transition-all duration-300 ${isMenuExpanded ? 'pl-64' : 'pl-16'} print:pl-0`}
      >
        <div className="p-8 max-w-6xl mx-auto">
          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-8" data-print-hide>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#7EBF8E' }}>
              Relatório Diagnóstico 360
            </h1>
            <p className="text-dashboard-muted text-lg">
              Avaliação completa da maturidade organizacional
            </p>
            <p className="text-dashboard-muted text-sm mt-1">Gerado em {today}</p>
          </header>

          {/* Score Geral */}
          <section className="dashboard-card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Score Geral</h2>
            <div className="flex flex-col items-center gap-4">
              <div style={{ width: 180, height: 180 }}>
                <CircularProgressbar
                  value={overallScore}
                  text={`${overallScore}%`}
                  styles={buildStyles({
                    textSize: '20px',
                    pathColor: classification.color,
                    textColor: textColor,
                    trailColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  })}
                />
              </div>
              <span
                className="text-xl font-bold px-4 py-1 rounded-full"
                style={{
                  backgroundColor: classification.color + '20',
                  color: classification.color,
                }}
              >
                {classification.label}
              </span>
              <div className="flex gap-6 mt-2 text-sm text-dashboard-muted">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                  0-25% Crítico
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }} />
                  26-50% Em Desenvolvimento
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#EAB308' }} />
                  51-75% Bom
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#7EBF8E' }} />
                  76-100% Excelente
                </span>
              </div>
            </div>
          </section>

          {/* Radar Overview */}
          <section className="dashboard-card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Visão Geral por Departamento</h2>
            <div className="w-full" style={{ height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke={theme === 'dark' ? '#374151' : '#d1d5db'} />
                  <PolarAngleAxis
                    dataKey="department"
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#7EBF8E"
                    fill="#7EBF8E"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Department Cards Grid */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Resumo por Departamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {questionGroups.map((group) => {
                const score = departmentScores[group.id] ?? 0;
                const cls = getClassification(score);
                const totalQuestions = group.questions.length;
                let perfect = 0;
                let needsImprovement = 0;
                let missing = 0;

                for (const q of group.questions) {
                  const answer = answers[q.item];
                  const evaluation = answer?.evaluation;
                  if (evaluation?.includes('FUNCIONA PERFEITAMENTE')) {
                    perfect++;
                  } else if (evaluation?.includes('PADRONIZADA') || evaluation?.includes('PODE SER MELHORADO')) {
                    needsImprovement++;
                  } else {
                    missing++;
                  }
                }

                return (
                  <div key={group.id} className="dashboard-card p-4">
                    <h3 className="font-semibold text-sm mb-2">{group.name}</h3>
                    <div className="text-2xl font-bold mb-2" style={{ color: cls.color }}>
                      {score}%
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${score}%`, backgroundColor: cls.color }}
                      />
                    </div>
                    <div className="text-xs space-y-1 text-dashboard-muted">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span>{totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#7EBF8E' }}>Perfeito</span>
                        <span>{perfect}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#EAB308' }}>A melhorar</span>
                        <span>{needsImprovement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#EF4444' }}>Ausente</span>
                        <span>{missing}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Detailed Department Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Análise Detalhada por Departamento</h2>
            {questionGroups.map((group) => {
              const score = departmentScores[group.id] ?? 0;
              const cls = getClassification(score);
              const recommendations = generateRecommendations(group.id);

              return (
                <div key={group.id} className="dashboard-card mb-6 overflow-hidden">
                  {/* Department Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cls.color }}
                      />
                      <h3 className="text-xl font-semibold">{group.name}</h3>
                    </div>
                    <span
                      className="text-lg font-bold px-3 py-1 rounded-lg"
                      style={{
                        backgroundColor: cls.color + '20',
                        color: cls.color,
                      }}
                    >
                      {score}% - {cls.label}
                    </span>
                  </div>

                  {/* Questions Table */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium">Item</th>
                          <th className="text-left py-2 px-3 font-medium">Título</th>
                          <th className="text-left py-2 px-3 font-medium hidden md:table-cell">Pergunta</th>
                          <th className="text-left py-2 px-3 font-medium">Avaliação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.questions.map((q) => {
                          const answer = answers[q.item];
                          const evaluation = answer?.evaluation;
                          const evalColor = getEvaluationColor(evaluation);
                          const evalLabel = getEvaluationLabel(evaluation);
                          const isCritical = !evaluation || (!evaluation.includes('FUNCIONA') && !evaluation.includes('PADRONIZADA'));

                          return (
                            <tr
                              key={q.item}
                              className={`border-b border-white/5 ${isCritical ? 'bg-red-500/5' : ''}`}
                            >
                              <td className="py-2 px-3 font-mono text-xs">{q.item}</td>
                              <td className="py-2 px-3 font-medium">{q.title}</td>
                              <td className="py-2 px-3 text-dashboard-muted hidden md:table-cell">{q.question}</td>
                              <td className="py-2 px-3">
                                <span
                                  className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: evalColor + '20',
                                    color: evalColor,
                                  }}
                                >
                                  {evalLabel}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="font-semibold text-sm mb-3">Recomendações</h4>
                      <div className="space-y-2">
                        {recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="text-sm p-3 rounded-lg"
                            style={{
                              backgroundColor: rec.priority === 'Alta' ? '#EF444410' : '#EAB30810',
                              borderLeft: `3px solid ${rec.priority === 'Alta' ? '#EF4444' : '#EAB308'}`,
                            }}
                          >
                            <span className="text-dashboard-muted">[{rec.item}]</span> {rec.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Action Plan Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Plano de Ação - Matriz de Prioridades</h2>

            {/* Critical */}
            <div className="dashboard-card mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                <h3 className="text-lg font-semibold">
                  Itens Críticos - Ação Imediata ({criticalItems.length})
                </h3>
              </div>
              {criticalItems.length === 0 ? (
                <p className="text-dashboard-muted text-sm">Nenhum item crítico identificado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 font-medium">Departamento</th>
                        <th className="text-left py-2 px-3 font-medium">Item</th>
                        <th className="text-left py-2 px-3 font-medium">Título</th>
                        <th className="text-left py-2 px-3 font-medium hidden md:table-cell">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          <td className="py-2 px-3 font-medium">{item.dept}</td>
                          <td className="py-2 px-3 font-mono text-xs">{item.item}</td>
                          <td className="py-2 px-3">{item.title}</td>
                          <td className="py-2 px-3 text-dashboard-muted hidden md:table-cell">{item.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Improvement */}
            <div className="dashboard-card mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#EAB308' }} />
                <h3 className="text-lg font-semibold">
                  Itens para Melhoria - Médio Prazo ({improvementItems.length})
                </h3>
              </div>
              {improvementItems.length === 0 ? (
                <p className="text-dashboard-muted text-sm">Nenhum item para melhoria identificado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 font-medium">Departamento</th>
                        <th className="text-left py-2 px-3 font-medium">Item</th>
                        <th className="text-left py-2 px-3 font-medium">Título</th>
                        <th className="text-left py-2 px-3 font-medium hidden md:table-cell">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {improvementItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          <td className="py-2 px-3 font-medium">{item.dept}</td>
                          <td className="py-2 px-3 font-mono text-xs">{item.item}</td>
                          <td className="py-2 px-3">{item.title}</td>
                          <td className="py-2 px-3 text-dashboard-muted hidden md:table-cell">{item.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Strengths */}
            <div className="dashboard-card mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#7EBF8E' }} />
                <h3 className="text-lg font-semibold">
                  Pontos Fortes - Manter ({strengthItems.length})
                </h3>
              </div>
              {strengthItems.length === 0 ? (
                <p className="text-dashboard-muted text-sm">Nenhum ponto forte identificado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 font-medium">Departamento</th>
                        <th className="text-left py-2 px-3 font-medium">Item</th>
                        <th className="text-left py-2 px-3 font-medium">Título</th>
                        <th className="text-left py-2 px-3 font-medium hidden md:table-cell">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strengthItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          <td className="py-2 px-3 font-medium">{item.dept}</td>
                          <td className="py-2 px-3 font-mono text-xs">{item.item}</td>
                          <td className="py-2 px-3">{item.title}</td>
                          <td className="py-2 px-3 text-dashboard-muted hidden md:table-cell">{item.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-8" data-print-hide>
            <div className="dashboard-card p-8 text-center" style={{
              background: 'linear-gradient(135deg, rgba(126, 191, 142, 0.1), rgba(97, 170, 242, 0.1))',
              border: '2px solid rgba(126, 191, 142, 0.3)',
            }}>
              <h2 className="text-2xl font-bold mb-3">Quer melhorar esses resultados?</h2>
              <p className="text-dashboard-muted mb-4 max-w-2xl mx-auto">
                Nossos especialistas podem ajudar sua empresa a transformar os pontos críticos identificados neste diagnóstico em oportunidades de crescimento.
              </p>
              {criticalItems.length > 0 && (
                <p className="text-sm text-dashboard-muted mb-6">
                  Identificamos <strong className="text-red-400">{criticalItems.length} itens críticos</strong>
                  {improvementItems.length > 0 && (
                    <> e <strong className="text-yellow-400">{improvementItems.length} itens para melhoria</strong></>
                  )}{' '}
                  que precisam de atenção na sua empresa.
                </p>
              )}
              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                  `Olá! Fiz o Diagnóstico 360 e meu score geral foi ${overallScore}%. Gostaria de falar com um especialista sobre como melhorar meus resultados.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7EBF8E, #61AAF2)',
                  color: '#fff',
                }}
              >
                Falar com Especialista
              </a>
              <p className="text-xs text-dashboard-muted mt-4">
                Consultoria personalizada baseada nos resultados do seu diagnóstico
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-dashboard-muted text-sm py-8 border-t border-white/10">
            <p>Diagnóstico 360 - Avaliação de Maturidade Organizacional</p>
            <p className="mt-1">Relatório gerado automaticamente em {today}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Report;
