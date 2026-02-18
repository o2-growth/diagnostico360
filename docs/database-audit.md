# Auditoria de Banco de Dados - Diagnostico 360

**Projeto:** Diagnostico 360 - Ferramenta B2B de diagnostico organizacional para PMEs
**Supabase Project ID:** fjhqkhatljbwyppfbcvt
**Data da Auditoria:** 18/02/2026
**Auditor:** Dara (Database Architect Agent)

---

## Indice

1. [Resumo do Banco de Dados](#1-resumo-do-banco-de-dados)
2. [Schema Atual](#2-schema-atual)
3. [Politicas RLS](#3-politicas-rls)
4. [Migrations](#4-migrations)
5. [Padroes de Acesso a Dados](#5-padroes-de-acesso-a-dados)
6. [Sync localStorage e Supabase](#6-sync-localstorage-e-supabase)
7. [Integridade de Dados](#7-integridade-de-dados)
8. [Indices e Performance](#8-indices-e-performance)
9. [Problemas Identificados](#9-problemas-identificados)
10. [Recomendacoes de Melhoria](#10-recomendacoes-de-melhoria)

---

## 1. Resumo do Banco de Dados

O Diagnostico 360 utiliza **Supabase (PostgreSQL)** como backend, com autenticacao gerenciada pelo Supabase Auth. O banco possui **4 tabelas**, **1 enum**, **2 funcoes** e **2 triggers**.

A arquitetura de dados segue um padrao hibrido: os dados de respostas do diagnostico sao armazenados primariamente no **localStorage** do navegador e sincronizados de forma assincrona com o Supabase. Snapshots finais (scores calculados) sao gravados diretamente no banco.

### Visao Geral das Tabelas

| Tabela | Descricao | RLS | Linhas Estimadas |
|--------|-----------|-----|------------------|
| `profiles` | Perfis de usuarios (auto-criado via trigger) | Sim | 1:1 com auth.users |
| `assessment_snapshots` | Snapshots finais do diagnostico com scores | Sim | N por usuario |
| `user_assessments` | Respostas em andamento do diagnostico (JSONB) | Sim | 1 ativa por usuario |
| `user_roles` | Roles de usuario (admin, moderator, user) | Sim | Poucos registros |

### Enum

| Nome | Valores |
|------|---------|
| `app_role` | `admin`, `moderator`, `user` |

### Funcoes

| Funcao | Tipo | Descricao |
|--------|------|-----------|
| `handle_new_user()` | TRIGGER (SECURITY DEFINER) | Cria perfil automaticamente ao cadastrar usuario |
| `assign_admin_on_signup()` | TRIGGER (SECURITY DEFINER) | Atribui role admin para emails especificos |
| `update_updated_at_column()` | TRIGGER | Atualiza campo `updated_at` automaticamente |
| `has_role(_user_id, _role)` | SQL (SECURITY DEFINER) | Verifica se usuario possui determinado role |

---

## 2. Schema Atual

### 2.1 Tabela `profiles`

```sql
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

| Coluna | Tipo | Nullable | Default | Constraint |
|--------|------|----------|---------|------------|
| `id` | UUID | NOT NULL | - | PK, FK -> auth.users(id) ON DELETE CASCADE |
| `email` | TEXT | Nullable | - | - |
| `created_at` | TIMESTAMPTZ | NOT NULL | `now()` | - |

**Observacoes:**
- O campo `email` e nullable, mas sempre e preenchido pelo trigger `handle_new_user()`.
- Nao possui indice adicional alem da PK.
- Nao possui campo `name`, `avatar_url` ou outros metadados de perfil comuns.

### 2.2 Tabela `assessment_snapshots`

```sql
CREATE TABLE public.assessment_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  overall_score INTEGER NOT NULL DEFAULT 0,
  department_scores JSONB NOT NULL DEFAULT '{}'::jsonb
);
```

| Coluna | Tipo | Nullable | Default | Constraint |
|--------|------|----------|---------|------------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `user_id` | UUID | NOT NULL | - | FK -> auth.users(id) ON DELETE CASCADE |
| `completed_at` | TIMESTAMPTZ | NOT NULL | `now()` | - |
| `overall_score` | INTEGER | NOT NULL | `0` | - |
| `department_scores` | JSONB | NOT NULL | `'{}'::jsonb` | - |

**Estrutura do JSONB `department_scores`:**
```json
{
  "financeiro": 55,
  "tecnologia": 72,
  "planejamento": 30,
  "contabil": 45,
  "controladoria": 60,
  "fiscal": 80,
  "comercial": 40,
  "marketing": 65,
  "societario": 50,
  "capital-humano": 35
}
```

**Observacoes:**
- Nao possui indice em `user_id`.
- Nao possui constraint CHECK no `overall_score` (aceita valores negativos ou acima de 100).
- Pode haver multiplos snapshots por usuario (historico).

### 2.3 Tabela `user_assessments`

```sql
CREATE TABLE public.user_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  gates JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

| Coluna | Tipo | Nullable | Default | Constraint |
|--------|------|----------|---------|------------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `user_id` | UUID | NOT NULL | - | FK -> auth.users(id) ON DELETE CASCADE |
| `answers` | JSONB | NOT NULL | `'{}'::jsonb` | - |
| `gates` | JSONB | NOT NULL | `'{}'::jsonb` | - |
| `recommendations` | JSONB | NOT NULL | `'{}'::jsonb` | - |
| `status` | TEXT | NOT NULL | `'in_progress'` | CHECK (`in_progress`, `completed`) |
| `started_at` | TIMESTAMPTZ | NOT NULL | `now()` | - |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `now()` | Atualizado via trigger |
| `completed_at` | TIMESTAMPTZ | Nullable | - | - |

**Estrutura do JSONB `answers`:**
```json
{
  "5.1": {
    "evaluation": "EXISTE E FUNCIONA PERFEITAMENTE",
    "applicable": "SIM",
    "hasEvidence": "NAO",
    "score": 0
  },
  "5.2": {
    "evaluation": "NAO EXISTE",
    "applicable": "SIM",
    "hasEvidence": "NAO",
    "score": 0,
    "skippedByGate": true
  }
}
```

**Estrutura do JSONB `gates`:**
```json
{
  "societario": "sim",
  "tecnologia": "parcialmente",
  "comercial": "nao"
}
```

**Observacoes:**
- Nao possui indice em `user_id` nem em `status`.
- Nao possui constraint UNIQUE para limitar 1 assessment `in_progress` por usuario.
- O trigger `update_updated_at_column` atualiza `updated_at` automaticamente em cada UPDATE.

### 2.4 Tabela `user_roles`

```sql
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
```

| Coluna | Tipo | Nullable | Default | Constraint |
|--------|------|----------|---------|------------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK |
| `user_id` | UUID | NOT NULL | - | FK -> auth.users(id) ON DELETE CASCADE, UNIQUE(user_id, role) |
| `role` | `app_role` | NOT NULL | - | UNIQUE(user_id, role) |

**Observacoes:**
- A constraint UNIQUE(user_id, role) cria um indice composto automaticamente.
- Nao possui politica RLS para INSERT/UPDATE/DELETE por admins.

---

## 3. Politicas RLS

### 3.1 Tabela `profiles`

| Politica | Operacao | Condicao |
|----------|----------|----------|
| Users can view their own profile | SELECT | `auth.uid() = id` |
| Users can update their own profile | UPDATE | `auth.uid() = id` |
| Users can insert their own profile | INSERT | `auth.uid() = id` (WITH CHECK) |

**Analise:** Adequado para perfil pessoal. O INSERT e coberto pelo trigger `handle_new_user()` que roda com `SECURITY DEFINER`, entao a politica de INSERT e redundante mas nao prejudicial. **Nao existe politica para DELETE** -- o usuario nao pode deletar seu perfil diretamente (adequado, pois o CASCADE na FK cuida disso).

### 3.2 Tabela `assessment_snapshots`

| Politica | Operacao | Condicao |
|----------|----------|----------|
| Users can view their own snapshots | SELECT | `auth.uid() = user_id` |
| Users can insert their own snapshots | INSERT | `auth.uid() = user_id` (WITH CHECK) |
| Users can delete their own snapshots | DELETE | `auth.uid() = user_id` |

**Analise:** Cobertura razoavel. **Falta politica de UPDATE** -- se necessario atualizar um snapshot, sera bloqueado pelo RLS. Nao ha politica de admin para visualizar todos os snapshots, o que limita funcionalidades de dashboard administrativo.

### 3.3 Tabela `user_assessments`

| Politica | Operacao | Condicao |
|----------|----------|----------|
| Users can view their own assessments | SELECT | `auth.uid() = user_id` |
| Users can insert their own assessments | INSERT | `auth.uid() = user_id` (WITH CHECK) |
| Users can update their own assessments | UPDATE | `auth.uid() = user_id` |
| Users can delete their own assessments | DELETE | `auth.uid() = user_id` |

**Analise:** Cobertura completa (CRUD). Cada usuario so acessa seus proprios dados. **Nao ha politica para admins**, o que pode limitar funcionalidades administrativas futuras.

### 3.4 Tabela `user_roles`

| Politica | Operacao | Condicao |
|----------|----------|----------|
| Users can view their own roles | SELECT | `auth.uid() = user_id` (para `authenticated`) |

**Analise de Seguranca:**
- **CRITICO:** Nao ha politica de INSERT/UPDATE/DELETE para `user_roles`. Somente funcoes `SECURITY DEFINER` (triggers) podem inserir roles. Isso e seguro porque impede usuarios de se auto-promoverem a admin.
- Porem, **nao existe mecanismo no app para um admin gerenciar roles de outros usuarios** via interface. Qualquer mudanca requer acesso direto ao banco ou uma nova migration.
- A funcao `has_role()` com `SECURITY DEFINER` evita recursao de RLS ao verificar roles.

### 3.5 Avaliacao Geral de Seguranca RLS

| Aspecto | Status | Observacao |
|---------|--------|------------|
| Isolamento por usuario | OK | Todas as tabelas filtram por `auth.uid()` |
| Protecao contra escalacao de privilegio | OK | `user_roles` sem INSERT publico |
| Acesso admin cross-user | AUSENTE | Admins nao conseguem ver dados de outros usuarios |
| Politica service_role | N/A | Nao utilizada diretamente no app |
| Funcoes SECURITY DEFINER | OK | `search_path` definido corretamente |

---

## 4. Migrations

### Historico de Migrations

| # | Arquivo | Data | Conteudo |
|---|---------|------|----------|
| 1 | `20260217205507_1d7b956d-...sql` | 17/02/2026 | Criacao de `profiles`, `assessment_snapshots`, trigger `handle_new_user` |
| 2 | `20260217212624_b3073b6f-...sql` | 17/02/2026 | Criacao de `user_roles`, enum `app_role`, funcao `has_role()`, atribuicao de admin para `growth@o2inc.com.br` |
| 3 | `20260218000001_user_assessments.sql` | 18/02/2026 | Criacao de `user_assessments`, funcao `update_updated_at_column()` |
| 4 | `20260218180056_145a794a-...sql` | 18/02/2026 | Criacao de trigger `assign_admin_on_signup()` para auto-admin de emails especificos |

### Observacoes sobre Migrations

- Todas as migrations sao de **criacao** (DDL). Nao ha migrations de alteracao ou correcao.
- O projeto e muito recente (todas as migrations sao de 17-18/02/2026).
- A migration #4 cria um trigger `on_auth_user_created_assign_admin` que coexiste com o trigger `on_auth_user_created` da migration #1. Ambos disparam em `AFTER INSERT ON auth.users`. A ordem de execucao de triggers no PostgreSQL e **alfabetica** por nome, entao `on_auth_user_created` (profiles) executa antes de `on_auth_user_created_assign_admin` (roles).
- **Risco:** Se os triggers falharem parcialmente (ex: profiles criado mas role nao), nao ha rollback explicito entre eles.
- Os emails hardcoded para admin (`growth@o2inc.com.br`, `andrey.lopes@o2inc.com.br`) estao embutidos diretamente no SQL da migration, sem possibilidade de configuracao dinamica.

---

## 5. Padroes de Acesso a Dados

### 5.1 Fluxo de Autenticacao

**Arquivo:** `src/hooks/useAuth.ts`

```
1. supabase.auth.onAuthStateChange() -> monitora mudancas de sessao
2. supabase.auth.getSession() -> carrega sessao existente
3. Se autenticado -> checkAdminRole() via query em user_roles
4. supabase.auth.signOut() -> logout
```

**Queries:**
- `SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin' LIMIT 1` (via `.maybeSingle()`)

**Observacao:** `checkAdminRole` e chamado com `setTimeout(..., 0)` dentro do `onAuthStateChange`, o que e um anti-pattern para evitar deadlock do Supabase client, mas funciona.

### 5.2 Fluxo do Diagnostico (Assessment)

**Arquivos:** `src/hooks/useAssessment.ts`, `src/hooks/useAssessmentDB.ts`

O fluxo completo e:

```
[Inicio do Diagnostico]
  |-> Assessment.tsx: Limpa localStorage (departmentAnswers, departmentGates, departmentRecommendations)
  |-> Redireciona para OngoingAssessment

[Durante o Diagnostico]
  |-> useAssessment: Le/escreve em localStorage
  |-> useAssessmentDB.syncToDB(): Sincroniza localStorage -> Supabase (user_assessments)
  |-> Cada resposta de gate ou questao dispara syncToDB()

[Conclusao do Diagnostico]
  |-> useAssessment.saveSnapshotToDb():
  |   |-> calculateScores(): Le de localStorage, calcula scores
  |   |-> INSERT em assessment_snapshots (scores finais)
  |   |-> completeInDB(): UPDATE user_assessments SET status='completed'
  |-> Navegacao para /dashboard
```

**Queries do useAssessmentDB:**
1. **Load:** `SELECT * FROM user_assessments WHERE user_id = ? AND status = 'in_progress' ORDER BY updated_at DESC LIMIT 1`
2. **Create:** `INSERT INTO user_assessments (user_id) RETURNING id`
3. **Sync:** `UPDATE user_assessments SET answers = ?, gates = ?, recommendations = ? WHERE id = ?`
4. **Complete:** `UPDATE user_assessments SET answers = ?, gates = ?, recommendations = ?, status = 'completed', completed_at = ? WHERE id = ?`

### 5.3 Fluxo do Dashboard

**Arquivo:** `src/components/dashboard/DashboardContent.tsx`

```
[Carregamento]
  |-> calculateScores(): Le de localStorage (NAO do banco!)
  |-> Renderiza cards com scores por departamento

[Quick Fill - Apenas Admin]
  |-> Gera dados de amostra -> localStorage
  |-> calculateScores() -> calcula scores
  |-> INSERT em assessment_snapshots (scores)
  |-> Recarrega pagina
```

**Observacao CRITICA:** O dashboard le scores **diretamente do localStorage**, nao do banco. Se o localStorage estiver vazio (outro navegador, modo anonimo, dados limpos), o dashboard mostra tudo como 0% mesmo que haja snapshots no banco.

### 5.4 Fluxo do Relatorio

**Arquivo:** `src/pages/Report.tsx`

```
[Carregamento]
  |-> calculateScores(): Le de localStorage
  |-> localStorage.getItem('departmentAnswers'): Le respostas detalhadas
  |-> Gera radar chart, tabelas, recomendacoes, plano de acao
```

**Observacao:** O relatorio inteiro e baseado em localStorage. Nao consulta o banco de dados.

### 5.5 Fluxo de Departamento

**Arquivo:** `src/pages/Department.tsx`

```
[Carregamento]
  |-> Questoes definidas em src/data/questions/*.ts (hardcoded)
  |-> Merge com localStorage('departmentAnswers') para obter avaliacoes salvas
  |-> Nenhuma interacao com banco de dados
```

### 5.6 Fluxo de Edicao de Questoes e Recomendacoes

**Arquivos:** `src/components/department/question/useQuestions.tsx`, `src/components/department/recommendation/useRecommendations.tsx`

- Ambos operam **exclusivamente** via localStorage.
- Nenhum deles chama `syncToDB()` do `useAssessmentDB`.
- Alteracoes feitas na tela de departamento **nao sao sincronizadas** com o Supabase.

### 5.7 Edge Function: generate-recommendations

**Arquivo:** `supabase/functions/generate-recommendations/index.ts`

- Recebe `departmentName` e `criticalItems` via POST.
- Chama AI gateway externo (Lovable API) para gerar recomendacoes.
- `verify_jwt = false` no config -- **nao requer autenticacao**.
- Retorna JSON com recomendacoes geradas.
- **Nao grava nada no banco** -- apenas retorna para o frontend que salva em localStorage.

---

## 6. Sync localStorage e Supabase

### 6.1 Arquitetura Atual

```
localStorage (fonte primaria)     Supabase (backup secundario)
================================  ================================
departmentAnswers  <----sync----> user_assessments.answers
departmentGates    <----sync----> user_assessments.gates
departmentRecommendations <-sync-> user_assessments.recommendations

calculateScores() ---> assessment_snapshots (somente escrita final)
```

### 6.2 Direcoes de Sync

| Direcao | Quando Acontece | Componente |
|---------|-----------------|------------|
| DB -> localStorage | Ao carregar useAssessmentDB (mount) | `useAssessmentDB.loadFromDB()` |
| localStorage -> DB | Ao responder cada pergunta/gate | `useAssessmentDB.syncToDB()` |
| localStorage -> DB | Ao completar assessment | `useAssessmentDB.completeAssessment()` |

### 6.3 Analise de Riscos

#### RISCO ALTO: Perda de Dados por localStorage Limpo

**Cenario:** Usuario limpa dados do navegador, usa modo anonimo ou troca de dispositivo.

- O dashboard e relatorio leem **exclusivamente** de localStorage.
- Mesmo com dados salvos no Supabase (`user_assessments`), o dashboard mostra 0%.
- O `useAssessmentDB` faz DB -> localStorage no mount, mas **somente** se houver um assessment `in_progress`. Se o assessment ja foi completado, os dados nao sao restaurados no localStorage.
- **Resultado:** Apos completar um diagnostico e limpar o cache, o usuario perde acesso visual aos resultados.

#### RISCO ALTO: Dados de Edicao Nao Sincronizados

**Cenario:** Usuario edita respostas via tela de Departamento (useQuestions.tsx).

- As edicoes sao salvas em localStorage mas **nunca** chamam `syncToDB()`.
- Se o usuario editar uma resposta e depois o `useAssessmentDB` fizer sync, os dados editados vao para o banco.
- Mas se o usuario editar e fechar o navegador sem voltar ao fluxo de assessment, as edicoes podem ser perdidas no banco.

#### RISCO MEDIO: Conflito de Dados entre Abas

**Cenario:** Usuario abre o app em duas abas simultaneamente.

- Ambas as abas leem e escrevem no mesmo localStorage.
- Ambas as abas fazem sync independente com o banco.
- O ultimo `syncToDB()` ganha (last-write-wins sem merge).
- Nao ha deteccao de conflito.

#### RISCO MEDIO: Race Condition no ensureAssessment

**Cenario:** `syncToDB` e chamado multiplas vezes rapidamente antes de `assessmentId` ser definido.

- Se `assessmentId` e null, `ensureAssessment()` faz INSERT.
- Chamadas concorrentes podem criar multiplos assessments `in_progress`.
- Nao ha constraint UNIQUE(user_id, status) para `in_progress`.

#### RISCO BAIXO: Recomendacoes Nao Sincronizadas pelo useRecommendations

- `useRecommendations.tsx` salva em localStorage e nao chama sync.
- Porem `syncToDB()` le `departmentRecommendations` do localStorage ao sincronizar.
- Entao se o fluxo de assessment for retomado apos a edicao, as recomendacoes acabam sincronizadas eventualmente. Mas nao de forma garantida.

### 6.4 Resumo do Fluxo de Dados

```
ESCRITA:
  Questionnaire -> localStorage -> syncToDB() -> user_assessments
  Departamento  -> localStorage (SEM sync!)
  Quick Fill    -> localStorage -> assessment_snapshots (direto, sem user_assessments)
  Completion    -> localStorage -> assessment_snapshots + user_assessments.status='completed'

LEITURA:
  Dashboard     -> localStorage (NUNCA le do banco)
  Relatorio     -> localStorage (NUNCA le do banco)
  Departamento  -> localStorage (NUNCA le do banco)
  OnMount       -> user_assessments -> localStorage (apenas in_progress)
```

---

## 7. Integridade de Dados

### 7.1 Constraints Existentes

| Tabela | Constraint | Tipo |
|--------|-----------|------|
| `profiles` | PK(id), FK(id -> auth.users) CASCADE | PK, FK |
| `assessment_snapshots` | PK(id), FK(user_id -> auth.users) CASCADE | PK, FK |
| `user_assessments` | PK(id), FK(user_id -> auth.users) CASCADE, CHECK(status) | PK, FK, CHECK |
| `user_roles` | PK(id), FK(user_id -> auth.users) CASCADE, UNIQUE(user_id, role) | PK, FK, UNIQUE |

### 7.2 Constraints Ausentes

| Tabela | Constraint Sugerida | Risco |
|--------|---------------------|-------|
| `assessment_snapshots` | `CHECK (overall_score BETWEEN 0 AND 100)` | Score pode ser negativo ou >100 |
| `user_assessments` | `UNIQUE (user_id) WHERE status = 'in_progress'` (partial unique index) | Multiplos assessments in_progress por usuario |
| `profiles` | `NOT NULL` no campo `email` | Email pode ser null (embora trigger sempre preencha) |
| `assessment_snapshots` | Indice em `user_id` | Queries por usuario sem indice |

### 7.3 Validacao de JSONB

Nenhuma das colunas JSONB possui validacao de schema no banco:

- `assessment_snapshots.department_scores` -- aceita qualquer JSON valido
- `user_assessments.answers` -- aceita qualquer JSON valido
- `user_assessments.gates` -- aceita qualquer JSON valido
- `user_assessments.recommendations` -- aceita qualquer JSON valido

A validacao ocorre apenas no frontend (TypeScript), o que significa que dados malformados podem ser inseridos via API direta ou bugs no frontend.

### 7.4 Integridade Referencial

- Todas as FKs apontam para `auth.users(id)` com `ON DELETE CASCADE`.
- Isso significa que ao deletar um usuario do Supabase Auth, **todos** os dados associados sao automaticamente removidos (profiles, snapshots, assessments, roles).
- Nao ha integridade referencial entre `user_assessments` e `assessment_snapshots` -- um snapshot pode existir sem um assessment correspondente (como no Quick Fill).

### 7.5 Consistencia entre localStorage e Banco

| Aspecto | Status |
|---------|--------|
| Respostas durante assessment | Sincronizado (com delay) |
| Respostas editadas em Departamento | NAO sincronizado |
| Recomendacoes | Sincronizado indiretamente |
| Scores no dashboard | NAO le do banco |
| Scores no relatorio | NAO le do banco |
| Assessment completado | localStorage pode nao refletir dados do banco |

---

## 8. Indices e Performance

### 8.1 Indices Existentes

| Tabela | Indice | Tipo | Criacao |
|--------|--------|------|---------|
| `profiles` | `profiles_pkey` | PK (btree em `id`) | Automatico |
| `assessment_snapshots` | `assessment_snapshots_pkey` | PK (btree em `id`) | Automatico |
| `user_assessments` | `user_assessments_pkey` | PK (btree em `id`) | Automatico |
| `user_roles` | `user_roles_pkey` | PK (btree em `id`) | Automatico |
| `user_roles` | `user_roles_user_id_role_key` | UNIQUE (btree em `user_id, role`) | Automatico (UNIQUE constraint) |

### 8.2 Indices Ausentes (Recomendados)

| Tabela | Indice Sugerido | Justificativa |
|--------|-----------------|---------------|
| `assessment_snapshots` | `CREATE INDEX idx_assessment_snapshots_user_id ON assessment_snapshots(user_id)` | Queries filtram por `user_id`; sem indice, faz seq scan |
| `user_assessments` | `CREATE INDEX idx_user_assessments_user_id_status ON user_assessments(user_id, status)` | Query principal filtra por `user_id` E `status = 'in_progress'` |
| `user_assessments` | `CREATE UNIQUE INDEX idx_user_assessments_unique_in_progress ON user_assessments(user_id) WHERE status = 'in_progress'` | Garante no maximo 1 assessment ativo por usuario |

### 8.3 Analise de Queries

| Query | Frequencia | Custo Estimado | Indice Utilizado |
|-------|-----------|----------------|------------------|
| `SELECT * FROM user_assessments WHERE user_id=? AND status='in_progress'` | A cada page load | Baixo (seq scan) | Nenhum |
| `SELECT role FROM user_roles WHERE user_id=? AND role='admin'` | A cada login | Baixo (index scan) | `user_roles_user_id_role_key` |
| `INSERT INTO assessment_snapshots (...)` | A cada conclusao | Baixo | N/A |
| `UPDATE user_assessments SET ... WHERE id=?` | A cada resposta | Baixo (PK index scan) | `user_assessments_pkey` |

### 8.4 Consideracoes de Performance

- **Volume atual:** Muito baixo. A aplicacao esta em fase inicial com poucos usuarios.
- **Projecao:** Com centenas de usuarios, a ausencia de indice em `assessment_snapshots.user_id` e `user_assessments(user_id, status)` causara degradacao progressiva.
- **JSONB:** Os campos JSONB nao possuem indices GIN, mas nao sao consultados/filtrados por conteudo no banco (somente lidos integralmente), entao nao ha necessidade atual.
- **N+1 Queries:** Nao ha problemas de N+1 no codigo atual, pois a maioria das operacoes e 1 query simples.
- **Tamanho do JSONB:** O campo `answers` pode crescer significativamente (atualmente 10 departamentos x ~9 perguntas cada = ~90 chaves). Cada sync reescreve o objeto inteiro (nao usa JSONB patch), mas o tamanho e aceitavel.

---

## 9. Problemas Identificados

### Severidade CRITICA

#### P1: Dashboard e Relatorio nao consultam o banco de dados

**Descricao:** O dashboard (`DashboardContent.tsx`), relatorio (`Report.tsx`) e pagina de departamento (`Department.tsx`) leem exclusivamente de `localStorage`. Se o localStorage estiver vazio (novo navegador, cache limpo, dispositivo diferente), todas essas paginas mostram dados zerados, mesmo que o banco tenha os dados completos.

**Impacto:** Usuario perde acesso aos resultados do diagnostico ao trocar de dispositivo ou limpar cache.

**Arquivos afetados:**
- `/src/components/dashboard/DashboardContent.tsx` (linha 33)
- `/src/pages/Report.tsx` (linhas 44-48)
- `/src/pages/Department.tsx` (linhas 41-43)
- `/src/utils/scoreCalculator.ts` (linhas 11-12)

#### P2: Edicoes em Departamento nao sincronizam com Supabase

**Descricao:** Os hooks `useQuestions.tsx` e `useRecommendations.tsx` salvam em localStorage mas nunca chamam `syncToDB()`. Dados editados nestas telas podem ser perdidos.

**Impacto:** Edicoes de respostas feitas fora do fluxo principal de assessment nao sao persistidas no banco.

**Arquivos afetados:**
- `/src/components/department/question/useQuestions.tsx` (linha 86)
- `/src/components/department/recommendation/useRecommendations.tsx` (linha 61)

### Severidade ALTA

#### P3: Possibilidade de multiplos assessments in_progress por usuario

**Descricao:** Nao ha constraint no banco que impeca a criacao de multiplos registros em `user_assessments` com `status = 'in_progress'` para o mesmo `user_id`. O codigo usa `LIMIT 1` e `ORDER BY updated_at DESC` para pegar o mais recente, mas os anteriores ficam orfaos.

**Impacto:** Dados inconsistentes e registros orfaos no banco.

#### P4: Ausencia de indices em colunas de busca

**Descricao:** As tabelas `assessment_snapshots` e `user_assessments` nao possuem indices em `user_id`, que e usado em todas as queries de filtragem.

**Impacto:** Degradacao de performance com crescimento de dados.

#### P5: Sem validacao de score no banco

**Descricao:** `assessment_snapshots.overall_score` aceita qualquer INTEGER, incluindo valores negativos ou acima de 100.

**Impacto:** Dados inconsistentes caso haja bug no calculo ou manipulacao direta.

### Severidade MEDIA

#### P6: Edge Function sem autenticacao

**Descricao:** A edge function `generate-recommendations` tem `verify_jwt = false`, permitindo que qualquer pessoa chame a funcao sem autenticacao.

**Impacto:** Possivel abuso de creditos de IA (a funcao chama API externa com LOVABLE_API_KEY).

#### P7: Emails de admin hardcoded em migrations

**Descricao:** Os emails `growth@o2inc.com.br` e `andrey.lopes@o2inc.com.br` estao hardcoded na migration #4 como admins automaticos.

**Impacto:** Para mudar admins, e necessario criar nova migration. Nao ha interface administrativa.

#### P8: Uso de `as any` em chamadas Supabase

**Descricao:** Varias chamadas ao Supabase usam `as any` para contornar erros de tipo TypeScript.

**Impacto:** Perde-se a seguranca de tipo oferecida pelo `types.ts` gerado automaticamente.

**Arquivos afetados:**
- `/src/hooks/useAssessmentDB.ts` (linhas 59, 88, 113)
- `/src/hooks/useAssessment.ts` (linha 227)

#### P9: Falta de politica RLS para acesso admin

**Descricao:** Nenhuma tabela possui politicas RLS que permitam admins visualizarem dados de outros usuarios.

**Impacto:** Impossivel construir dashboard administrativo com visao de todos os diagnosticos sem alterar as politicas RLS.

### Severidade BAIXA

#### P10: Tabela profiles subutilizada

**Descricao:** A tabela `profiles` contém apenas `id`, `email` e `created_at`. Nao armazena nome, empresa, cargo ou outros dados relevantes para uma ferramenta B2B.

**Impacto:** Dados de empresa nao sao capturados, limitando funcionalidades B2B.

#### P11: Campo email nullable em profiles

**Descricao:** O campo `email` em `profiles` e nullable, embora o trigger sempre preencha.

**Impacto:** Risco teorico de profile sem email.

#### P12: Quick Fill cria snapshot sem user_assessment

**Descricao:** A funcionalidade Quick Fill no Dashboard (`handleQuickFill`) insere diretamente em `assessment_snapshots` sem criar/atualizar um `user_assessment`.

**Impacto:** Inconsistencia entre tabelas -- snapshot existe sem assessment correspondente.

---

## 10. Recomendacoes de Melhoria

### Prioridade 1 (Imediata)

#### R1: Fazer dashboard e relatorio lerem do banco de dados

Substituir a leitura direta de localStorage por uma estrategia hibrida:

1. Tentar ler de localStorage (rapido, offline-first).
2. Se vazio, consultar `assessment_snapshots` e/ou `user_assessments` do banco.
3. Hidratar localStorage com dados do banco para uso subsequente.

```typescript
// Exemplo de abordagem sugerida
const loadScores = async () => {
  // Tenta localStorage primeiro
  const localScores = calculateScoresFromLocalStorage();
  if (localScores.overallScore > 0) return localScores;

  // Fallback: ultimo snapshot do banco
  const { data } = await supabase
    .from('assessment_snapshots')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) return {
    overallScore: data.overall_score,
    departmentScores: data.department_scores
  };

  return { overallScore: 0, departmentScores: {} };
};
```

#### R2: Adicionar sincronizacao nas telas de Departamento

Injetar `syncToDB` do `useAssessmentDB` nos hooks `useQuestions` e `useRecommendations`, chamando-o apos cada `saveChanges()`.

#### R3: Criar partial unique index para in_progress

```sql
CREATE UNIQUE INDEX idx_user_assessments_unique_in_progress
ON public.user_assessments(user_id)
WHERE status = 'in_progress';
```

### Prioridade 2 (Curto Prazo)

#### R4: Adicionar indices de busca

```sql
CREATE INDEX idx_assessment_snapshots_user_id
ON public.assessment_snapshots(user_id);

CREATE INDEX idx_user_assessments_user_id_status
ON public.user_assessments(user_id, status);
```

#### R5: Adicionar constraint CHECK no score

```sql
ALTER TABLE public.assessment_snapshots
ADD CONSTRAINT chk_overall_score CHECK (overall_score BETWEEN 0 AND 100);
```

#### R6: Habilitar JWT na Edge Function

```toml
# supabase/config.toml
[functions.generate-recommendations]
verify_jwt = true
```

#### R7: Remover `as any` e corrigir tipos

Atualizar o `types.ts` com `supabase gen types typescript` e remover casts `as any`.

### Prioridade 3 (Medio Prazo)

#### R8: Adicionar politicas RLS para admin

```sql
CREATE POLICY "Admins can view all snapshots"
ON public.assessment_snapshots FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view all assessments"
ON public.user_assessments FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
);
```

#### R9: Expandir tabela profiles para dados B2B

```sql
ALTER TABLE public.profiles
ADD COLUMN full_name TEXT,
ADD COLUMN company_name TEXT,
ADD COLUMN company_size TEXT,
ADD COLUMN position TEXT,
ADD COLUMN phone TEXT;
```

#### R10: Implementar lock otimista no sync

Adicionar campo `version` na tabela `user_assessments` e verificar antes de UPDATE para evitar conflitos de sync entre abas.

```sql
ALTER TABLE public.user_assessments ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
```

#### R11: Adicionar NOT NULL ao email em profiles

```sql
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
```

#### R12: Criar tabela de historico de assessments

Para suportar multiplos diagnosticos completos com visualizacao historica, considerar mover `assessment_snapshots` para ser a fonte autoritativa de dados e criar relacao com `user_assessments`:

```sql
ALTER TABLE public.assessment_snapshots
ADD COLUMN assessment_id UUID REFERENCES public.user_assessments(id) ON DELETE SET NULL;
```

### Prioridade 4 (Longo Prazo)

#### R13: Migrar de localStorage para Supabase como fonte primaria

A arquitetura ideal seria:
1. Supabase como fonte unica de verdade (single source of truth).
2. React Query ou similar para cache local com invalidacao automatica.
3. Eliminacao do localStorage como store de dados (manter apenas para preferencias de UI como tema).
4. Suporte a offline via Service Worker + IndexedDB se necessario.

#### R14: Implementar Supabase Realtime

Para suportar colaboracao e atualizacoes em tempo real entre abas/dispositivos:

```typescript
supabase
  .channel('user-assessment')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'user_assessments',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Atualizar estado local
  })
  .subscribe();
```

#### R15: Validacao de schema JSONB

Implementar funcoes de validacao no PostgreSQL ou usar check constraints com jsonpath:

```sql
ALTER TABLE public.user_assessments
ADD CONSTRAINT chk_valid_status_values
CHECK (status IN ('in_progress', 'completed'));

-- Para PostgreSQL 12+, considerar jsonpath para validar estrutura do JSONB
```

---

## Apendice A: Diagrama de Tabelas

```
auth.users (Supabase Auth)
    |
    |-- 1:1 --> profiles (id = auth.users.id)
    |
    |-- 1:N --> assessment_snapshots (user_id)
    |
    |-- 1:N --> user_assessments (user_id)
    |
    |-- 1:N --> user_roles (user_id)
```

## Apendice B: Mapa de localStorage Keys

| Chave | Tipo de Dado | Usado Por | Sincronizado com DB |
|-------|-------------|-----------|---------------------|
| `departmentAnswers` | JSON (Record<string, AnswerData>) | useAssessment, useAssessmentDB, useQuestions, scoreCalculator, Report, Department, exportToPdf, Settings | Sim (via useAssessmentDB.syncToDB) |
| `departmentGates` | JSON (Record<string, GateAnswer>) | useAssessment, useAssessmentDB | Sim (via useAssessmentDB.syncToDB) |
| `departmentRecommendations` | JSON (Record<string, string>) | useRecommendations, useAssessmentDB | Parcial (lido pelo syncToDB, mas escrito sem trigger de sync) |
| `vite-ui-theme` | string (`dark`/`light`/`system`) | theme-provider | Nao (preferencia local) |

## Apendice C: Funcoes e Triggers

### handle_new_user()
```sql
-- Trigger: on_auth_user_created (AFTER INSERT ON auth.users)
-- Cria profile automaticamente com id e email do novo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;
```

### assign_admin_on_signup()
```sql
-- Trigger: on_auth_user_created_assign_admin (AFTER INSERT ON auth.users)
-- Atribui role admin para emails especificos
CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN
  IF NEW.email IN ('growth@o2inc.com.br', 'andrey.lopes@o2inc.com.br') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
```

### update_updated_at_column()
```sql
-- Trigger: update_user_assessments_updated_at (BEFORE UPDATE ON user_assessments)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

### has_role()
```sql
-- Funcao SQL pura para verificar roles (evita recursao RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

---

*Documento gerado em 18/02/2026 por Dara (Database Architect Agent).*
