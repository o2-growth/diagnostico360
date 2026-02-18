

# Historico Completo de Diagnosticos + Botao Admin de Preenchimento Rapido

## Resumo

Duas funcionalidades serao implementadas:

1. **Historico detalhado**: Salvar todas as respostas de cada diagnostico concluido no banco de dados, permitindo que o usuario clique em um diagnostico antigo e veja exatamente como a empresa estava naquele momento.

2. **Botao Admin de preenchimento rapido**: Adicionar um botao visivel apenas para administradores na pagina inicial (Home) que preenche automaticamente todos os dados com respostas simuladas e salva o snapshot, sem precisar responder pergunta por pergunta.

---

## Feature 1: Historico Detalhado

### Problema atual
A tabela `assessment_snapshots` so guarda `overall_score` e `department_scores`. Nao guarda as respostas individuais (answers, gates). Entao nao e possivel "voltar no tempo" e ver os detalhes de um diagnostico antigo.

### Solucao

**1. Alterar a tabela `assessment_snapshots`** - Adicionar colunas JSONB para guardar o estado completo:
- `answers` (JSONB) - todas as respostas individuais
- `gates` (JSONB) - respostas das perguntas de filtro

**2. Atualizar o codigo de salvamento do snapshot** - Nos pontos onde o snapshot e salvo (`useAssessment.ts` e `SettingsContent.tsx`), incluir os dados de `answers` e `gates` junto com os scores.

**3. Criar pagina de visualizacao do historico** - Uma nova rota `/history/:snapshotId` que:
- Carrega o snapshot do banco de dados
- Exibe o relatório completo daquele periodo (score geral, scores por departamento, tabela com cada pergunta e sua avaliacao)
- Mostra a data de quando foi concluido

**4. Atualizar a pagina de Evolucao** - Adicionar uma lista clicavel dos diagnosticos passados abaixo dos graficos, com:
- Data de conclusao
- Score geral
- Botao "Ver Detalhes" que navega para `/history/:snapshotId`

### Fluxo do usuario

```text
Evolucao (graficos)
    |
    v
Lista de diagnosticos anteriores
    |
    +-- [12/02/26 - Score: 65%] --> Clique --> Pagina de detalhes completa
    +-- [10/01/26 - Score: 48%] --> Clique --> Pagina de detalhes completa
```

---

## Feature 2: Botao Admin - Preenchimento Rapido

### Solucao

Adicionar na pagina Home (`src/pages/Home.tsx`) um botao visivel apenas para usuarios admin que:
- Gera respostas simuladas usando `generateSampleAnswers()` e `generateSampleGates()`
- Salva no localStorage
- Calcula os scores e salva um snapshot completo no banco (incluindo answers e gates)
- Recarrega a pagina para mostrar os resultados

O botao tera confirmacao via AlertDialog para evitar cliques acidentais.

---

## Detalhes Tecnicos

### Migracao SQL

```sql
ALTER TABLE public.assessment_snapshots
  ADD COLUMN answers JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN gates JSONB DEFAULT '{}'::jsonb;
```

### Arquivos a criar
- `src/pages/HistoryDetail.tsx` - Pagina de visualizacao de um snapshot historico

### Arquivos a modificar
- `src/integrations/supabase/types.ts` - Adicionar colunas `answers` e `gates` ao tipo `assessment_snapshots`
- `src/hooks/useAssessment.ts` - Incluir answers e gates ao salvar snapshot
- `src/components/settings/SettingsContent.tsx` - Incluir answers e gates no quick fill
- `src/components/evolution/EvolutionContent.tsx` - Adicionar lista de snapshots clicaveis
- `src/pages/Home.tsx` - Adicionar botao admin de preenchimento rapido
- `src/App.tsx` - Adicionar rota `/history/:snapshotId`

