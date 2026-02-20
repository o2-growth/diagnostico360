

# Corrigir Contagem de "Questao Atual X de Y"

## Problema

O header do diagnostico mostra "Questao atual: 79 de 79" quando deveria mostrar algo como "Questao atual: 50 de 69". Isso acontece porque:

- `totalSteps` usa `steps.length`, que inclui as 10 perguntas de filtro (gates) alem das questoes reais
- `currentStepIndex` e o indice bruto dentro de todos os steps (gates + questoes), entao tambem fica inflado

## Solucao

Modificar o hook `useAssessment.ts` para expor dois valores corrigidos:

1. **`totalSteps`**: contar apenas steps do tipo `question` (excluindo gates)
2. **`currentStepIndex` para exibicao**: contar apenas steps do tipo `question` ate a posicao atual

## Detalhes Tecnicos

### Arquivo: `src/hooks/useAssessment.ts`

Adicionar dois valores calculados:

- `questionOnlyTotal`: `steps.filter(s => s.type === 'question').length`
- `questionOnlyIndex`: Para o step atual, contar quantos steps do tipo `question` existem antes dele (inclusive). Se o step atual for um gate, mostrar o indice da ultima questao respondida ou o proximo.

Atualizar o retorno do hook:
- `totalSteps` passa a ser `questionOnlyTotal` em vez de `steps.length`
- Adicionar um `currentQuestionNumber` que reflete a posicao real entre as questoes

### Arquivo: `src/pages/OngoingAssessment.tsx`

Atualizar para usar o novo valor `currentQuestionNumber` em vez de `currentStepIndex + 1` no ProgressHeader, para que a contagem reflita apenas questoes reais.

