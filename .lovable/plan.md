
## Corrigir bugs: scores do dashboard e snapshot nao salvando

### Problema 1: Dashboard mostra scores incorretos (sempre 0)
O `calculateDepartmentScore` no `DashboardContent.tsx` tenta ler `q.evaluation` diretamente dos objetos de perguntas estaticos. Esses objetos nunca tem `evaluation` definido -- as respostas ficam salvas apenas no localStorage. Por isso os scores sempre resultam em 0.

**Solucao**: Substituir `calculateDepartmentScore` pelo `calculateScores()` que ja existe em `src/utils/scoreCalculator.ts` e le corretamente do localStorage.

### Problema 2: Snapshot nao salva no banco
No `useAssessment.ts`, a funcao `saveSnapshotToDb()` e async, mas `handleNext` chama ela sem `await`. Logo em seguida, `navigate('/dashboard')` redireciona a pagina, o que pode cancelar a requisicao HTTP antes dela completar. Alem disso, erros sao silenciados.

**Solucao**: Fazer `handleNext` ser async e aguardar `saveSnapshotToDb()` antes de navegar. Adicionar tratamento de erro visivel.

### Arquivos alterados

**`src/components/dashboard/DashboardContent.tsx`**
- Remover a funcao `calculateDepartmentScore` que le da array estatica
- Usar `calculateScores()` para obter os scores reais do localStorage
- Passar `departmentScores[area.id]` para cada `MetricCard`

**`src/hooks/useAssessment.ts`**
- Tornar `handleNext` async
- Aguardar (`await`) `saveSnapshotToDb()` antes de navegar
- Adicionar toast de erro caso o insert falhe
- Verificar resultado do insert e logar erros

### Detalhe tecnico

No `handleNext`, as duas chamadas a `saveSnapshotToDb()` (linhas 265 e 289) precisam ser aguardadas:

```text
// Antes (bug):
saveSnapshotToDb();
navigate('/dashboard');

// Depois (corrigido):
await saveSnapshotToDb();
navigate('/dashboard');
```

No `DashboardContent`, trocar:
```text
// Antes (bug): le q.evaluation do array estatico (sempre undefined)
calculateDepartmentScore(area.id)

// Depois: usa calculateScores() que le do localStorage
const { departmentScores } = calculateScores();
// ...
value={departmentScores[area.id] ?? 0}
```
