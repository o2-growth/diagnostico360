
# Corrigir Persistencia de Dados no Banco de Dados

## Problema Identificado

A tabela `user_assessments` foi removida do banco de dados, mas o codigo ainda tenta acessá-la. Isso causa erros 404 repetidos. Os dados do diagnostico (respostas, gates, recomendacoes) ficam apenas no localStorage do navegador, ou seja:

- Se trocar de dispositivo ou limpar o navegador, perde tudo
- O historico aparece na aba "Evolucao" porque os snapshots vao para a tabela `assessment_snapshots` (que existe), mas as respostas detalhadas nao ficam salvas
- Dashboard e areas aparecem vazios em dispositivos diferentes

## O Que Sera Feito

### 1. Recriar a tabela `user_assessments` no banco de dados

Criar novamente a tabela com as colunas necessarias:
- `id` (UUID, chave primaria)
- `user_id` (UUID, referencia ao usuario)
- `answers` (JSONB - todas as respostas)
- `gates` (JSONB - respostas de filtro por area)
- `recommendations` (JSONB - recomendacoes)
- `status` (texto: 'in_progress' ou 'completed')
- `started_at`, `updated_at`, `completed_at` (timestamps)

Incluir politicas de seguranca (RLS) para que cada usuario so acesse seus proprios dados.

### 2. Atualizar o arquivo de tipos

Adicionar a definicao da tabela `user_assessments` no arquivo de tipos para que o codigo funcione sem erros.

### 3. Resultado Esperado

- As respostas do diagnostico serao salvas no banco de dados
- Ao fazer login em outro dispositivo, os dados serao carregados automaticamente
- O dashboard e areas mostrarao os dados corretos
- Os erros 404 desaparecerao

## Detalhes Tecnicos

### Migracao SQL

```sql
CREATE TABLE public.user_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  gates JSONB DEFAULT '{}'::jsonb,
  recommendations JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON public.user_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.user_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON public.user_assessments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON public.user_assessments FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_assessments_updated_at
  BEFORE UPDATE ON public.user_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Arquivos a modificar

- `src/integrations/supabase/types.ts` - Adicionar tipagem da tabela (sera regenerado automaticamente)
- Nenhuma mudanca de codigo necessaria - o `useAssessmentDB.ts` ja esta implementado corretamente, so precisa da tabela existir
