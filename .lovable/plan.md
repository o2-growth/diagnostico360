

## Botao de Teste Rapido + Perfil Admin

### Resumo
Adicionar um botao "Preencher Teste Rapido" no dashboard, visivel apenas para o admin (growth@o2inc.com.br). Ao clicar, o sistema preenche automaticamente todas as respostas do diagnostico com dados simulados de uma empresa ficticia e salva um snapshot no banco. Isso permite testar toda a plataforma sem responder pergunta por pergunta.

### O que sera feito

**1. Coluna `role` na tabela `profiles`**
- Adicionar coluna `role` (text, default 'user') na tabela profiles
- Setar `role = 'admin'` para o email growth@o2inc.com.br via migration

**2. Hook `useAuth` atualizado**
- Buscar o perfil do usuario (incluindo role) apos login
- Expor `isAdmin` como propriedade do hook

**3. Dados de teste simulados**
- Criar arquivo `src/utils/sampleAssessmentData.ts` com respostas realistas para todas as perguntas de todas as 10 areas
- Cada area tera um mix de "EXISTE E FUNCIONA PERFEITAMENTE", "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)" e "NAO EXISTE" para simular uma empresa real
- Gates serao definidos como "sim" ou "parcialmente" para cada area

**4. Botao no Dashboard**
- Adicionar botao "Preencher Teste Rapido" no `DashboardContent.tsx`
- Visivel somente quando `isAdmin === true`
- Ao clicar:
  1. Preenche o localStorage com as respostas simuladas e gates
  2. Calcula os scores usando `calculateScores()`
  3. Salva um snapshot no banco (`assessment_snapshots`)
  4. Recarrega a pagina para refletir os dados
- Confirmar acao com dialog antes de executar (para evitar cliques acidentais)

### Detalhe tecnico

**Migration SQL:**
```text
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
UPDATE profiles SET role = 'admin' WHERE email = 'growth@o2inc.com.br';
```

**Estrutura do sampleAssessmentData.ts:**
```text
export function generateSampleAnswers(): Record<string, object>
  - Itera sobre questionGroups
  - Para cada pergunta, atribui aleatoriamente (com distribuicao realista):
    - 40% "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
    - 35% "EXISTE E FUNCIONA PERFEITAMENTE"  
    - 25% "NAO EXISTE"

export function generateSampleGates(): Record<string, string>
  - Todas as areas com "sim" (para que as perguntas individuais aparecam no resultado)
```

**Fluxo do botao:**
```text
1. Usuario admin clica "Preencher Teste Rapido"
2. Dialog de confirmacao aparece
3. Ao confirmar:
   - localStorage['departmentAnswers'] = sampleAnswers
   - localStorage['departmentGates'] = sampleGates
   - calculateScores() -> { departmentScores, overallScore }
   - INSERT INTO assessment_snapshots (user_id, overall_score, department_scores)
   - Toast "Dados de teste preenchidos com sucesso!"
   - window.location.reload()
```

### Arquivos novos
- `src/utils/sampleAssessmentData.ts`

### Arquivos alterados
- Migration SQL (adicionar coluna role)
- `src/hooks/useAuth.ts` (buscar role do perfil, expor isAdmin)
- `src/components/dashboard/DashboardContent.tsx` (botao de teste rapido, visivel so para admin)

