

## Correcao: clique em toda a area do botao de opcao

### Problema
Nas perguntas regulares do diagnostico, o clique so funciona no circulo do radio ou no texto do label. O `div` que envolve cada opcao nao tem `onClick`, entao clicar na area vazia do card nao marca a opcao.

### Solucao
Adicionar `onClick={() => onAnswerChange(option)}` no `div` wrapper das opcoes regulares (linha 92-106), igual ao que ja existe nas gate questions.

### Arquivo alterado
- `src/components/assessment/QuestionContent.tsx`

### Detalhe tecnico
Na linha 94, o `div` wrapper das opcoes regulares recebe `onClick={() => onAnswerChange(option)}`:

```tsx
<div 
  key={option} 
  className={`p-4 border rounded-md cursor-pointer transition-all ${...}`}
  onClick={() => onAnswerChange(option)}  // <-- adicionar isso
>
```

Isso e exatamente o mesmo padrao ja usado nas gate questions (linha 60). Uma mudanca de 1 linha.
