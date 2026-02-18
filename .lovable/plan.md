

# Reviver Diagnostico Historico - Experiencia Completa

## O Que Muda

Hoje ao clicar em "Ver Detalhes" de um diagnostico antigo, voce ve apenas uma tabela basica com perguntas e avaliacoes. O objetivo e transformar essa pagina para que ela mostre **exatamente** o mesmo relatorio completo que aparece quando voce finaliza um diagnostico agora, incluindo:

- Grafico circular (CircularProgressbar) com o score geral e classificacao (Critico/Em Desenvolvimento/Bom/Excelente)
- Grafico radar com visao geral por departamento
- Cards resumo de cada departamento (total, perfeito, a melhorar, ausente)
- Tabela detalhada por departamento com avaliacoes coloridas (badges)
- Recomendacoes automaticas por departamento
- Plano de acao com matriz de prioridades (itens criticos, para melhoria, pontos fortes)
- CTA para falar com especialista
- Botoes de imprimir e exportar PDF

Basicamente, a pagina `/history/:snapshotId` vai "reviver" o relatorio usando os dados salvos no snapshot ao inves de ler do localStorage.

## Como Funciona

A pagina `Report.tsx` atual le os dados do `localStorage`. A nova `HistoryDetail.tsx` vai usar a **mesma estrutura visual** porem alimentada pelos dados do snapshot salvo no banco de dados (`answers`, `gates`, `department_scores`, `overall_score`).

O usuario clica no diagnostico antigo na lista de Evolucao e ve o relatorio completo daquele periodo, como se tivesse acabado de finalizar.

## Detalhes Tecnicos

### Arquivo a modificar

- `src/pages/HistoryDetail.tsx` - Reescrever completamente para replicar a experiencia do `Report.tsx`, mas usando dados do snapshot ao inves de localStorage

### Estrutura da nova pagina HistoryDetail

1. **Header** com data do diagnostico e botoes (Voltar, Imprimir, Exportar PDF)
2. **Score Geral** com CircularProgressbar e classificacao colorida (Critico/Em Desenvolvimento/Bom/Excelente) + legenda
3. **Grafico Radar** com visao geral por departamento usando Recharts RadarChart
4. **Grid de Cards** por departamento mostrando score, barra de progresso e contagem (perfeito/a melhorar/ausente)
5. **Analise Detalhada** por departamento com tabela de perguntas e badges coloridos de avaliacao + recomendacoes
6. **Plano de Acao** com matriz de prioridades: itens criticos, itens para melhoria e pontos fortes
7. **CTA** para falar com especialista

### Dados utilizados

Todos os dados vem do snapshot carregado do banco:
- `snapshot.overall_score` para o score geral
- `snapshot.department_scores` para scores por area
- `snapshot.answers` para avaliacoes individuais de cada pergunta
- `snapshot.gates` para identificar areas marcadas como inexistentes
- `questionGroups` (dados estaticos) para nomes e estrutura das perguntas

### Dependencias ja existentes no projeto

- `react-circular-progressbar` (ja instalado)
- `recharts` RadarChart (ja instalado)
- Mesmos helpers de classificacao e avaliacao do Report.tsx

Nenhuma mudanca no banco de dados e necessaria - os dados ja estao sendo salvos corretamente nos snapshots.
