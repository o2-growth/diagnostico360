# Revisao Arquitetural - Diagnostico 360

**Data:** 18/02/2026
**Versao:** 1.0
**Autor:** Aria (System Architect Agent)
**Projeto:** Diagnostico 360 - Ferramenta de avaliacao diagnostica B2B para PMEs
**Preco:** R$197 por diagnostico

---

## Indice

1. [Resumo da Arquitetura Atual](#1-resumo-da-arquitetura-atual)
2. [Diagrama de Fluxo de Dados](#2-diagrama-de-fluxo-de-dados)
3. [Padroes Utilizados](#3-padroes-utilizados)
4. [Analise de Escalabilidade](#4-analise-de-escalabilidade)
5. [Analise de Seguranca](#5-analise-de-seguranca)
6. [Performance e Otimizacao](#6-performance-e-otimizacao)
7. [Gestao de Estado](#7-gestao-de-estado)
8. [Arquitetura de Componentes](#8-arquitetura-de-componentes)
9. [Pontos de Melhoria Arquitetural](#9-pontos-de-melhoria-arquitetural)
10. [Recomendacoes](#10-recomendacoes)

---

## 1. Resumo da Arquitetura Atual

### Stack Tecnologico

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| Framework UI | React | 18.3.1 |
| Linguagem | TypeScript | 5.5.3 |
| Build Tool | Vite (SWC) | 5.4.1 |
| Estilizacao | Tailwind CSS | 3.4.11 |
| Componentes UI | shadcn/ui (Radix primitives) | Diversos |
| Backend/Auth | Supabase | 2.95.3 |
| Graficos | Recharts + react-circular-progressbar | 2.12.7 / 2.1.0 |
| Roteamento | React Router DOM | 6.26.2 |
| Data Fetching | TanStack React Query | 5.56.2 |
| Exportacao PDF | jsPDF + html2canvas | 2.5.2 / 1.4.1 |
| Formularios | React Hook Form + Zod | 7.53.0 / 3.23.8 |
| OAuth | @lovable.dev/cloud-auth-js | 0.0.3 |

### Visao Geral

O Diagnostico 360 eh uma Single Page Application (SPA) React que implementa uma ferramenta de avaliacao empresarial cobrindo 10 departamentos (Societario, Tecnologia, Comercial, Marketing, Financeiro, Controladoria, Fiscal, Contabil, Capital Humano, Planejamento) com aproximadamente 60 questoes no total.

A aplicacao utiliza um **modelo hibrido de persistencia**: localStorage como armazenamento primario de respostas e Supabase como backend de sincronizacao/persistencia de longo prazo. A autenticacao eh gerenciada via Supabase Auth com suporte a email/senha e Google OAuth (via Lovable).

### Estrutura de Diretorios

```
src/
  App.tsx                    # Raiz: providers + rotas
  main.tsx                   # Entry point
  components/
    assessment/              # Componentes do fluxo de avaliacao
    auth/                    # ProtectedRoute
    dashboard/               # DashboardContent
    department/              # Componentes de visualizacao por departamento
    departments/             # Lista de departamentos
    evolution/               # Visualizacao de evolucao temporal
    settings/                # Pagina de configuracoes
    theme/                   # ThemeProvider + ThemeToggle
    ui/                      # shadcn/ui primitives (~50 componentes)
    CustomerRequests.tsx      # Radar chart principal
    MetricCard.tsx           # Card de metrica individual
    MonthlyChart.tsx         # Grafico de evolucao mensal
    SidePanel.tsx            # Navegacao lateral
  data/
    questions/               # Questoes por departamento (10 arquivos)
    questionsData.ts         # Dados legados (possivelmente nao utilizado)
    evolutionData.ts         # Dados mock de evolucao
  hooks/
    useAssessment.ts         # Logica central do fluxo de avaliacao
    useAssessmentDB.ts       # Sincronizacao localStorage <-> Supabase
    useAuth.ts               # Autenticacao e verificacao de roles
    useDepartmentData.ts     # Dados estaticos de departamentos
  integrations/
    lovable/                 # OAuth via Lovable Cloud
    supabase/                # Cliente Supabase + tipos
  pages/
    Auth.tsx                 # Login/Cadastro
    Home.tsx                 # Pagina inicial
    Index.tsx                # Dashboard (hub de abas)
    Assessment.tsx           # Redirect: limpa dados e redireciona
    OngoingAssessment.tsx    # Fluxo de avaliacao passo-a-passo
    Report.tsx               # Relatorio completo com graficos
    Department.tsx           # Visao detalhada de departamento
  types/
    department.ts            # Tipos de dominio
  utils/
    exportToPdf.ts           # Exportacao para PDF
    sampleAssessmentData.ts  # Dados de teste
    scoreCalculator.ts       # Calculo de scores
```

### Rotas da Aplicacao

| Rota | Componente | Protegida | Descricao |
|------|-----------|-----------|-----------|
| `/auth` | Auth | Nao | Login / cadastro |
| `/` | Home | Sim | Pagina inicial, inicio do diagnostico |
| `/dashboard` | Index | Sim | Dashboard com abas (resultado, evolucao, areas, config) |
| `/department/:id` | Department | Sim | Detalhe de departamento |
| `/assessment` | Assessment | Sim | Limpa dados e redireciona para ongoing-assessment |
| `/ongoing-assessment` | OngoingAssessment | Sim | Fluxo de avaliacao passo-a-passo |
| `/report` | Report | Sim | Relatorio completo |

---

## 2. Diagrama de Fluxo de Dados

### Fluxo Principal de Dados

```
                          +------------------+
                          |    Supabase Auth  |
                          |  (email/Google)   |
                          +--------+---------+
                                   |
                                   v
+----------+    auth state    +---------+    session    +------------------+
|   Auth   | --------------> | useAuth | ------------> | ProtectedRoute   |
|  (page)  |                 |  (hook) |               | (wrapper)        |
+----------+                 +---------+               +--------+---------+
                                   |                            |
                          isAdmin check                         v
                          (user_roles)               +------------------+
                                                     |  App Routes      |
                                                     +--------+---------+
                                                              |
                    +-----------------------------------------+
                    |                    |                     |
                    v                    v                     v
           +---------------+  +------------------+  +------------------+
           |     Home      |  | OngoingAssessment|  |   Dashboard      |
           | (start/resume)|  |  (assessment)    |  | (results/report) |
           +-------+-------+  +--------+---------+  +--------+---------+
                   |                    |                      |
                   |                    v                      v
                   |         +------------------+    +-----------------+
                   |         |  useAssessment   |    | scoreCalculator |
                   |         |    (hook)        |    |   (util)        |
                   |         +--------+---------+    +--------+--------+
                   |                  |                        |
                   |          +-------+--------+               |
                   |          |                |               |
                   v          v                v               v
             +----------+ +-------+  +-----------------+ +----------+
             |localStorage| |Gates | |    Answers      | |localStorage|
             |(check)    | |(JSON)| |    (JSON)       | |(read)    |
             +----------+ +---+---+ +--------+--------+ +----------+
                              |              |
                              v              v
                     +------------------+
                     | useAssessmentDB  |
                     |   syncToDB()     |
                     +--------+---------+
                              |
                              v
                     +------------------+
                     | Supabase         |
                     | user_assessments |
                     | (answers, gates, |
                     |  recommendations)|
                     +------------------+
                              |
               (on complete)  v
                     +------------------+
                     | assessment_      |
                     | snapshots        |
                     | (scores finais)  |
                     +------------------+
```

### Fluxo de Sincronizacao localStorage <-> Supabase

```
CARREGAMENTO (mount):
  Supabase (user_assessments) ---> localStorage
  [DB eh source of truth no carregamento]

DURANTE AVALIACAO:
  Usuario responde ---> localStorage (imediato)
                   ---> Supabase (async, via syncToDB)
  [localStorage eh source of truth durante uso]

CONCLUSAO:
  localStorage ---> Supabase (user_assessments: status=completed)
               ---> Supabase (assessment_snapshots: scores calculados)
```

### Modelo de Dados no Supabase

```
+-------------------+     +---------------------+     +------------------+
| profiles          |     | user_assessments    |     | assessment_      |
|-------------------|     |---------------------|     | snapshots        |
| id (PK, FK auth)  |     | id (PK, UUID)       |     |------------------|
| email             |     | user_id (FK auth)   |     | id (PK, UUID)    |
| created_at        |     | answers (JSONB)     |     | user_id (FK auth)|
+-------------------+     | gates (JSONB)       |     | completed_at     |
                          | recommendations     |     | overall_score    |
+-------------------+     |   (JSONB)           |     | department_scores|
| user_roles        |     | status (TEXT)       |     |   (JSONB)        |
|-------------------|     | started_at          |     +------------------+
| id (PK, UUID)     |     | updated_at          |
| user_id (FK auth) |     | completed_at        |
| role (app_role)   |     +---------------------+
+-------------------+
```

---

## 3. Padroes Utilizados

### 3.1 Padroes Identificados

| Padrao | Implementacao | Aderencia a Best Practices |
|--------|--------------|---------------------------|
| Component Composition | Pages > Layout > Feature Components | PARCIAL - boa separacao em alguns pontos, monolitico em outros |
| Custom Hooks | useAssessment, useAssessmentDB, useAuth, useDepartmentData | BOA - logica de negocio extraida para hooks |
| Provider Pattern | ThemeProvider, QueryClientProvider, TooltipProvider | BOA |
| Protected Routes | ProtectedRoute wrapper component | BOA |
| Barrel Exports | data/questions/index.ts | PARCIAL - nao consistente |
| Static Data Pattern | Questoes definidas em arquivos TS | BOA para o caso de uso |
| Hybrid Persistence | localStorage + Supabase sync | PROBLEMATICA - veja analise abaixo |

### 3.2 Divergencias de Best Practices

#### 3.2.1 Ausencia de Contexto Global para Estado do Assessment

**Problema:** O hook `useAssessment` eh instanciado independentemente em cada componente que o utiliza. Em `Home.tsx` (linha 17), o hook completo eh instanciado apenas para verificar `hasOngoingAssessment`, criando side-effects desnecessarios como a instanciacao de `useNavigate`, `useToast`, e `useAssessmentDB`.

**Arquivo:** `/src/pages/Home.tsx` linha 17
```typescript
const { hasOngoingAssessment: checkOngoingAssessment } = useAssessment(questions);
```

**Best Practice:** Utilizar React Context para compartilhar estado do assessment entre componentes, ou separar a logica de verificacao em um hook menor e independente.

#### 3.2.2 Dados de Departamento Hardcoded no Hook

**Problema:** O hook `useDepartmentData` contem um objeto gigante com dados estaticos de todos os departamentos dentro do `useState` initializer. Isso mistura dados de configuracao com logica de estado.

**Arquivo:** `/src/hooks/useDepartmentData.ts` linhas 7-151
```typescript
const [departmentInfo, setDepartmentInfo] = useState<DepartmentData>(() => {
  const departments: Record<string, DepartmentData> = {
    'financeiro': { ... },
    // ... 10 departamentos com dados hardcoded
  };
```

**Best Practice:** Extrair dados estaticos para um arquivo de configuracao separado. O hook deveria apenas consumir esses dados, nao defini-los.

#### 3.2.3 Duplicacao de Configuracoes de Departamentos

**Problema:** A configuracao de departamentos (ids, nomes, cores) esta duplicada em pelo menos 5 locais:
- `src/hooks/useDepartmentData.ts`
- `src/components/dashboard/DashboardContent.tsx` (array `areas`, linhas 36-46)
- `src/components/CustomerRequests.tsx` (objeto `AREA_CONFIG`, linhas 6-17)
- `src/components/evolution/EvolutionContent.tsx` (objeto `AREA_CONFIG`, linhas 19-30)
- `src/data/questions/index.ts` (array `questionGroups`, linhas 21-32)

**Best Practice:** Single source of truth para configuracao de departamentos, consumida por todos os componentes.

#### 3.2.4 Mapeamento de Questao para Departamento via Prefixo de String

**Problema:** Em `useAssessment.ts` (linhas 326-344), o mapeamento de questao para departamento eh feito via analise do primeiro caractere do ID da questao, com tratamento especial para o prefixo "10".

```typescript
const getDepartmentFromQuestion = (questionId: string): string | null => {
  const prefix = questionId.charAt(0);
  switch (prefix) {
    case '1': return 'societario';
    // ...
    case '0':
      if (questionId.startsWith('10')) return 'planejamento';
```

**Best Practice:** Usar o `questionGroups` para fazer o lookup inverso, ou adicionar a referencia do grupo diretamente no tipo `Question`.

#### 3.2.5 Nao Utilizacao do React Query para Dados do Supabase

**Problema:** Apesar de `@tanstack/react-query` estar instalado e o `QueryClientProvider` estar configurado no `App.tsx`, nenhum componente utiliza `useQuery` ou `useMutation`. Todas as chamadas ao Supabase sao feitas diretamente via `useEffect` + `useState`.

**Exemplos:**
- `EvolutionContent.tsx`: fetch manual de snapshots (linhas 37-48)
- `useAssessmentDB.ts`: operacoes CRUD manuais
- `useAuth.ts`: fetch manual de roles

**Best Practice:** Utilizar React Query para gerenciamento de cache, revalidacao automatica, estados de loading/error, e deduplicacao de requests.

#### 3.2.6 Uso de `as any` para Contornar Tipos

**Problema:** O hook `useAssessmentDB.ts` utiliza `as any` em multiplas operacoes do Supabase (linhas 59, 85-89, 108-114), indicando que os tipos gerados do Supabase estao incompletos ou desatualizados.

```typescript
await supabase.from('user_assessments').insert({ user_id: user.id } as any)
```

**Best Practice:** Manter os tipos do Supabase sincronizados com o schema do banco, ou utilizar overrides tipados ao inves de `as any`.

---

## 4. Analise de Escalabilidade

### 4.1 Gargalos Identificados

#### CRITICO: localStorage como Storage Primario

**Impacto:** ALTO
**Componentes afetados:** useAssessment, useAssessmentDB, scoreCalculator, Report, Department, SettingsContent, DashboardContent, CustomerRequests, exportToPdf

O localStorage eh utilizado como fonte primaria de dados em TODA a aplicacao. Isso cria multiplos problemas de escalabilidade:

1. **Limite de 5-10MB por dominio:** Com 60 questoes e respostas, o volume atual eh pequeno. Porem, se o produto evoluir para multiplos diagnosticos por usuario, evidencias com imagens, ou observacoes textuais longas, o limite sera atingido.

2. **Sem suporte multi-dispositivo:** Um usuario que inicia no desktop e tenta continuar no celular nao tera acesso aos dados ate que o sync com Supabase ocorra.

3. **Sem suporte multi-aba:** Duas abas abertas podem causar conflitos de escrita no localStorage.

4. **Dados perdidos ao limpar navegador:** Se o usuario limpar dados do navegador antes do sync, todo o progresso eh perdido.

5. **Leitura sincrona:** `localStorage.getItem` eh sincrono e bloqueia a thread principal. Com objetos JSON grandes, isso pode causar jank na UI.

#### MEDIO: Ausencia de Paginacao nos Snapshots

**Arquivo:** `src/components/evolution/EvolutionContent.tsx` linhas 39-42
```typescript
const { data, error } = await supabase
  .from('assessment_snapshots')
  .select('*')
  .order('completed_at', { ascending: true });
```

Todos os snapshots sao carregados de uma vez. Com multiplos diagnosticos ao longo do tempo, esse volume crescera indefinidamente.

#### MEDIO: Recalculo de Scores em Cada Render

**Arquivo:** `src/utils/scoreCalculator.ts`

A funcao `calculateScores()` eh chamada diretamente em componentes como `DashboardContent`, `CustomerRequests`, e `Report`, lendo do localStorage e fazendo parse de JSON em cada chamada. Nao ha memoizacao ou cache.

#### BAIXO: Dados Mock Hardcoded

**Arquivo:** `src/data/evolutionData.ts`

Dados de evolucao mock estao hardcoded e importados em `Department.tsx` (linha 11), misturando dados reais com dados ficticios de demonstracao.

### 4.2 Limites de Escala Estimados

| Metrica | Limite Atual | Gargalo |
|---------|-------------|---------|
| Usuarios simultaneos | Ilimitado (SPA + Supabase) | OK |
| Diagnosticos por usuario | ~1 ativo (design atual) | localStorage nao suporta multiplos |
| Questoes por diagnostico | ~200 antes de lentidao | JSON parse sincrono |
| Historico de snapshots | ~100 antes de lentidao no grafico | Ausencia de paginacao |
| Departamentos | 10 (hardcoded) | Adicionando requer mudancas em 5+ arquivos |

---

## 5. Analise de Seguranca

### 5.1 Postura Geral: MODERADA

A aplicacao implementa algumas boas praticas de seguranca, mas apresenta vulnerabilidades significativas.

### 5.2 Pontos Positivos

#### RLS (Row Level Security) Implementado em Todas as Tabelas

Todas as 4 tabelas possuem RLS habilitado com policies adequadas:

- **profiles:** SELECT/UPDATE/INSERT restritos ao proprio usuario (`auth.uid() = id`)
- **assessment_snapshots:** SELECT/INSERT/DELETE restritos ao proprio usuario
- **user_assessments:** SELECT/INSERT/UPDATE/DELETE restritos ao proprio usuario
- **user_roles:** SELECT restrito ao proprio usuario

#### Funcao `has_role` com SECURITY DEFINER

A funcao `has_role` utiliza `SECURITY DEFINER` para evitar recursao de RLS ao verificar roles, o que eh uma boa pratica.

#### Auth Session Persistence

O cliente Supabase esta configurado com `persistSession: true` e `autoRefreshToken: true`, garantindo sessoes persistentes e renovacao automatica.

### 5.3 Vulnerabilidades e Riscos

#### CRITICO: Dados Sensiveis no localStorage

**Risco:** Os dados completos do assessment (respostas, gates, recomendacoes) ficam em texto puro no localStorage, acessiveis via DevTools, extensoes de navegador, ou qualquer JavaScript executado na pagina (XSS).

**Impacto:** Em um produto B2B onde empresas estao compartilhando informacoes sobre suas fragilidades organizacionais, a exposicao desses dados eh um risco significativo de compliance e confianca.

**Mitigacao recomendada:** Migrar o armazenamento primario para Supabase, usando localStorage apenas como cache temporario com TTL curto.

#### ALTO: Ausencia de Validacao Server-Side dos Dados

**Risco:** Os dados de assessment sao enviados como JSONB diretamente do cliente para o Supabase sem nenhuma validacao server-side. Um usuario mal-intencionado poderia:
- Inserir dados arbitrarios nos campos JSONB
- Manipular scores enviando respostas invalidas
- Inserir payloads excessivamente grandes

**Mitigacao recomendada:** Criar Supabase Edge Functions ou Database Functions com validacao de schema antes de aceitar inserts/updates.

#### ALTO: Exposicao de Chaves no Client-Side

**Arquivo:** `src/integrations/supabase/client.ts` linhas 5-6
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

Embora a chave `anon` do Supabase seja projetada para ser publica, a combinacao com RLS como unica camada de seguranca significa que qualquer vulnerabilidade no RLS expoe todos os dados. Nao ha camada intermediaria (API/Edge Function).

#### MEDIO: Admin Hardcoded por Email em Migration

**Arquivo:** `supabase/migrations/20260218180056_*.sql` linhas 9
```sql
IF NEW.email IN ('growth@o2inc.com.br', 'andrey.lopes@o2inc.com.br') THEN
```

Emails de admin estao hardcoded na migration. Adicionar novos admins requer nova migration ou acesso direto ao banco.

#### MEDIO: Verificacao de Admin no Client-Side

**Arquivo:** `src/hooks/useAuth.ts` linhas 11-23

A verificacao de admin eh feita no client-side via query ao Supabase. Embora o RLS proteja os dados, funcionalidades de admin (como "Preencher Teste Rapido") dependem apenas da verificacao client-side, que pode ser burlada.

#### BAIXO: CSRF em OAuth

O fluxo de Google OAuth via Lovable nao possui implementacao visivel de state parameter ou PKCE flow verification, embora isso possa estar encapsulado na biblioteca `@lovable.dev/cloud-auth-js`.

### 5.4 Matriz de Seguranca

| Controle | Status | Observacao |
|----------|--------|-----------|
| Autenticacao | OK | Supabase Auth (email + Google OAuth) |
| Autorizacao (RLS) | OK | Implementado em todas as tabelas |
| Autorizacao (client) | PARCIAL | Admin check apenas no frontend |
| Criptografia em transito | OK | HTTPS via Supabase |
| Criptografia em repouso | AUSENTE | localStorage em texto puro |
| Validacao de input (server) | AUSENTE | JSONB aceita qualquer payload |
| Validacao de input (client) | PARCIAL | Opcoes fixas de radio button |
| Rate Limiting | AUSENTE | Sem controle de abuso |
| Audit Trail | PARCIAL | Timestamps em user_assessments |
| CORS | OK | Gerenciado pelo Supabase |

---

## 6. Performance e Otimizacao

### 6.1 Analise de Bundle

#### Dependencias Pesadas Identificadas

| Pacote | Tamanho Estimado (gzip) | Uso | Otimizavel? |
|--------|------------------------|-----|-------------|
| recharts | ~85KB | Radar/Bar charts | Considerar lazy loading |
| jsPDF | ~35KB | Export PDF | Lazy load (uso ocasional) |
| html2canvas | ~40KB | Export PDF | Lazy load (uso ocasional) |
| @radix-ui/* (~20 pacotes) | ~60KB total | shadcn/ui | Maioria eh tree-shakeable |
| react-circular-progressbar | ~5KB | Report page | Lazy load |
| date-fns | Tree-shakeable | Formatacao de datas | OK |

**Problema:** jsPDF e html2canvas sao carregados no bundle principal mesmo sendo usados apenas em exportacao (acao rara). Isso adiciona ~75KB ao bundle inicial.

#### Recomendacao: Code Splitting por Rota

O `App.tsx` importa todos os componentes de pagina de forma sincrona:

```typescript
import Home from "./pages/Home";
import Index from "./pages/Index";
import Department from "./pages/Department";
import Assessment from "./pages/Assessment";
import OngoingAssessment from "./pages/OngoingAssessment";
import Auth from "./pages/Auth";
import Report from "./pages/Report";
```

**Best Practice:** Utilizar `React.lazy()` + `Suspense` para code splitting por rota.

### 6.2 Re-renders Desnecessarios

#### `calculateScores()` Chamado em Multiplos Componentes

A funcao `calculateScores()` eh chamada diretamente (sem memoizacao) em:
- `DashboardContent.tsx` (linha 33)
- `CustomerRequests.tsx` (linha 23)
- `Report.tsx` (linha 44)

Cada chamada faz `localStorage.getItem()` + `JSON.parse()` + iteracao sobre todas as questoes. Como `DashboardContent` e `CustomerRequests` sao renderizados juntos na mesma pagina, os scores sao calculados DUAS VEZES no dashboard.

#### `useAuth()` Instanciado Multiplas Vezes

O hook `useAuth()` eh instanciado independentemente em:
- `ProtectedRoute.tsx` (toda rota protegida)
- `SidePanel.tsx`
- `DashboardContent.tsx`
- `Department.tsx`
- `SettingsContent.tsx`
- `Auth.tsx`

Cada instancia cria seu proprio `onAuthStateChange` listener e faz sua propria chamada `getSession()`. Isso significa 3-4 listeners simultaneos e 3-4 calls ao `getSession()` por pagina.

**Impacto:** Multiplas chamadas desnecessarias ao Supabase Auth e `user_roles` table a cada navegacao.

**Solucao:** Transformar `useAuth` em um AuthContext/Provider que eh instanciado uma unica vez no topo da arvore de componentes.

### 6.3 Renderizacao da Pagina Report

**Arquivo:** `src/pages/Report.tsx`

A pagina Report (~500 linhas) renderiza TODO o conteudo de uma vez:
- Circular progress bar
- Radar chart com 10 departamentos
- 10 cards de resumo
- 10 tabelas detalhadas com todas as questoes
- 3 tabelas de plano de acao (critico, melhoria, pontos fortes)

Sem nenhuma virtualizacao ou lazy rendering, paginas com muitos dados podem ter First Contentful Paint lento.

### 6.4 Componente SidePanel e Tabs

**Arquivo:** `src/components/SidePanel.tsx`

O SidePanel utiliza o componente `Tabs` do Radix para navegacao, mas a implementacao mistura navegacao de rotas com controle de abas. O `getCurrentTab()` (linhas 49-60) eh recalculado a cada render e depende de `location.state`, que pode ser `undefined`.

---

## 7. Gestao de Estado

### 7.1 Mapa de Estado da Aplicacao

```
+-------------------------------------------+
|            Estado da Aplicacao             |
+-------------------------------------------+
|                                           |
|  SERVIDOR (Supabase):                     |
|  - auth.users (sessao)                    |
|  - profiles (perfil)                      |
|  - user_roles (permissoes)                |
|  - user_assessments (respostas sync)      |
|  - assessment_snapshots (historico)        |
|                                           |
|  CLIENTE (localStorage):                  |
|  - departmentAnswers (respostas)          |
|  - departmentGates (portoes)              |
|  - departmentRecommendations (rec.)       |
|  - app-theme (tema dark/light)            |
|  - supabase auth tokens                   |
|                                           |
|  CLIENTE (React State local):             |
|  - currentStepIndex (avaliacao)           |
|  - currentAnswer (resposta atual)         |
|  - answeredQuestions (lista respondidas)   |
|  - gates (portoes da sessao)              |
|  - isMenuExpanded (sidebar)               |
|  - activeTab (aba ativa)                  |
|  - isEditing (modo edicao dept)           |
|  - user, session, isAdmin (auth)          |
|                                           |
|  NENHUM estado global compartilhado       |
|  (sem Context, sem Redux, sem Zustand)    |
+-------------------------------------------+
```

### 7.2 Problemas na Gestao de Estado

#### 7.2.1 Nenhuma State Management Library/Context para Dados Globais

A aplicacao nao utiliza NENHUM mecanismo de estado global. Dados que sao necessarios em multiplos componentes (scores, respostas, dados de usuario) sao:
- Recarregados do localStorage em cada componente que precisa
- Recalculados (scores) a cada render
- Re-fetched (auth/roles) em cada componente

#### 7.2.2 Inconsistencia Temporal entre localStorage e State

O hook `useAssessment` mantem `gates` e `answeredQuestions` em React state, mas a fonte de verdade eh o localStorage. Se outro componente modifica o localStorage (ex: `handleClearData` em SettingsContent), o estado do `useAssessment` fica stale.

#### 7.2.3 Fluxo de Sync Unidirecional Inconsistente

O `useAssessmentDB` implementa sync bidirecional:
- **Load:** DB -> localStorage (on mount)
- **Save:** localStorage -> DB (on answer)

Porem, nao ha mecanismo de deteccao de conflitos. Se o usuario abrir a aplicacao em dois dispositivos e responder questoes diferentes, o ultimo a sincronizar sobrescreve o outro.

#### 7.2.4 Estado de Navegacao Disperso

O controle de abas no dashboard eh feito via combinacao de:
- `location.state?.activeTab` (React Router state)
- `useState` em `Index.tsx`
- Callbacks `onTabChange` passados como props

Esse padrao eh fragil: reload da pagina perde o `location.state`, e deep links nao funcionam para abas especificas.

---

## 8. Arquitetura de Componentes

### 8.1 Hierarquia de Componentes

```
App
  ThemeProvider
    QueryClientProvider
      TooltipProvider
        BrowserRouter
          Routes
            Auth
            ProtectedRoute
              Home
                SidePanel
              Index (Dashboard)
                SidePanel
                DashboardContent
                  CustomerRequests (RadarChart)
                  MetricCard[]
                DepartmentsList
                  DepartmentItem[]
                EvolutionContent
                  MonthlyChart
                  MetricCard
                  AreaChart[]
                SettingsContent
              Department
                SidePanel
                DepartmentHeader
                DepartmentOverview
                DepartmentQuestions
                  QuestionItem[]
                DepartmentRecommendations
                  RecommendationItem[]
              OngoingAssessment
                SidePanel
                ProgressHeader
                QuestionContent
                NavigationButtons
              Report
                SidePanel
                CircularProgressbar
                RadarChart
                DepartmentCards[]
                DetailedTables[]
                ActionPlanTables[]
```

### 8.2 Analise de Responsabilidades

#### SidePanel: Componente com Responsabilidade Excessiva

**Arquivo:** `src/components/SidePanel.tsx`

O SidePanel acumula responsabilidades de:
1. Layout (sidebar colapsavel)
2. Navegacao (React Router navigation)
3. Controle de estado de abas (tab management)
4. Exportacao PDF (via botao)
5. Logout (via botao)

**Best Practice:** Separar em NavigationSidebar (layout/collapse), NavigationItems (links), e ActionButtons (export/logout).

#### Report: Componente Monolitico

**Arquivo:** `src/pages/Report.tsx` (~500 linhas)

O Report.tsx eh o maior componente da aplicacao e contem:
- Logica de calculo de scores
- Logica de classificacao
- Logica de cores
- Logica de geracao de recomendacoes
- Rendering de 5 secoes distintas
- Logica de formatacao de data

**Best Practice:** Extrair em sub-componentes: ReportHeader, ScoreOverview, RadarOverview, DepartmentSummaryGrid, DepartmentDetailSection, ActionPlanSection.

#### Department: Importacoes Diretas de Todos os Modulos de Questoes

**Arquivo:** `src/pages/Department.tsx` linhas 15-24

```typescript
import { marketingQuestions } from '@/data/questions/marketing';
import { financialQuestions } from '@/data/questions/financial';
// ... 8 mais importacoes
```

Seguido por um switch-case (linhas 88-113) para selecionar o array correto baseado no `id`. Isso cria coupling direto entre a pagina e todos os modulos de dados.

**Best Practice:** Usar o `questionGroups` (que ja existe em `data/questions/index.ts`) para fazer lookup por ID, eliminando as 10 importacoes e o switch-case.

### 8.3 Padrao de Comunicacao entre Componentes

A comunicacao segue um padrao misto:
- **Props drilling:** `onTabChange`, `onMenuToggle`, `isMenuExpanded` sao passados como props por multiplos niveis
- **Hooks compartilhados:** `useAuth`, `useAssessment` sao instanciados localmente
- **Eventos:** Nenhum event bus ou pub/sub
- **Context:** Apenas ThemeProvider (tema visual)

A ausencia de estado global e o excesso de props drilling tornam a arvore de componentes rigida e dificil de refatorar.

---

## 9. Pontos de Melhoria Arquitetural

### Prioridade CRITICA

| # | Ponto | Impacto | Esforco |
|---|-------|---------|---------|
| 1 | Migrar armazenamento primario de localStorage para Supabase | Seguranca, escalabilidade, multi-dispositivo | Alto |
| 2 | Criar AuthContext para centralizar autenticacao | Performance (elimina ~4 listeners duplicados por pagina) | Medio |
| 3 | Implementar validacao server-side dos dados de assessment | Seguranca | Medio |

### Prioridade ALTA

| # | Ponto | Impacto | Esforco |
|---|-------|---------|---------|
| 4 | Implementar React.lazy() para code splitting por rota | Performance (reducao ~40% do bundle inicial) | Baixo |
| 5 | Utilizar React Query para todas as chamadas ao Supabase | Cache, deduplicacao, melhor UX | Medio |
| 6 | Centralizar configuracao de departamentos (single source of truth) | Manutenibilidade | Baixo |
| 7 | Extrair logica de scores para hook memoizado ou contexto | Performance | Baixo |

### Prioridade MEDIA

| # | Ponto | Impacto | Esforco |
|---|-------|---------|---------|
| 8 | Refatorar Report.tsx em sub-componentes | Manutenibilidade, testabilidade | Medio |
| 9 | Implementar lazy loading para jsPDF/html2canvas | Performance (reducao ~75KB no bundle) | Baixo |
| 10 | Adicionar paginacao em snapshots (EvolutionContent) | Escalabilidade | Baixo |
| 11 | Corrigir tipos do Supabase (eliminar `as any`) | Type safety | Baixo |
| 12 | Implementar Error Boundaries | Resiliencia | Baixo |
| 13 | Adicionar testes unitarios e de integracao | Qualidade, confianca em refactoring | Alto |

### Prioridade BAIXA

| # | Ponto | Impacto | Esforco |
|---|-------|---------|---------|
| 14 | Remover dados mock (evolutionData.ts) | Limpeza de codigo | Baixo |
| 15 | Implementar PWA para acesso offline | UX | Medio |
| 16 | Adicionar Sentry/error tracking | Observabilidade | Baixo |
| 17 | Implementar i18n (se expansao internacional) | Escalabilidade de mercado | Alto |

---

## 10. Recomendacoes

### 10.1 Curto Prazo (1-2 semanas)

#### R1. Implementar Code Splitting por Rota

**Impacto:** Reducao significativa do bundle inicial
**Esforco:** Baixo

Alterar `App.tsx` para usar `React.lazy()`:

```typescript
const Home = React.lazy(() => import('./pages/Home'));
const Index = React.lazy(() => import('./pages/Index'));
const Report = React.lazy(() => import('./pages/Report'));
// etc.

// Envolver Routes com Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>...</Routes>
</Suspense>
```

#### R2. Criar AuthContext

**Impacto:** Elimina ~12 listeners duplicados e ~12 chamadas desnecessarias ao Supabase por sessao
**Esforco:** Baixo-Medio

Transformar `useAuth` em um provider:

```typescript
const AuthProvider = ({ children }) => {
  // ... logica atual do useAuth
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>
};
```

#### R3. Centralizar Configuracao de Departamentos

**Impacto:** Elimina duplicacao em 5+ arquivos
**Esforco:** Baixo

Criar `src/data/departments.ts` como single source of truth, e derivar todas as configuracoes a partir dele.

#### R4. Lazy Load de jsPDF e html2canvas

**Impacto:** Reducao de ~75KB no bundle inicial
**Esforco:** Baixo

```typescript
const exportToPdf = async () => {
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');
  // ... restante da logica
};
```

### 10.2 Medio Prazo (2-6 semanas)

#### R5. Migrar de localStorage para Supabase como Fonte Primaria

**Impacto:** Seguranca, multi-dispositivo, escalabilidade
**Esforco:** Alto

Redesenhar o fluxo de dados:
1. Supabase eh a fonte de verdade
2. React Query gerencia cache no client
3. localStorage eh usado apenas como fallback offline (opcional)
4. Otimistic updates para manter a experiencia responsiva

#### R6. Implementar React Query em Todas as Interacoes com Supabase

**Impacto:** Cache automatico, deduplicacao de requests, melhor UX com estados loading/error
**Esforco:** Medio

```typescript
// Exemplo para snapshots
const useSnapshots = () => useQuery({
  queryKey: ['snapshots'],
  queryFn: () => supabase.from('assessment_snapshots').select('*').order('completed_at'),
});

// Exemplo para salvar resposta
const useSaveAnswer = () => useMutation({
  mutationFn: (data) => supabase.from('user_assessments').update(data),
  onSuccess: () => queryClient.invalidateQueries(['assessment']),
});
```

#### R7. Adicionar Validacao Server-Side

**Impacto:** Seguranca
**Esforco:** Medio

Opcoes:
1. **Supabase Database Functions:** Criar funcoes PL/pgSQL que validam o schema dos campos JSONB antes de inserir
2. **Supabase Edge Functions:** Criar endpoints intermediarios que validam com Zod antes de repassar ao banco
3. **Check Constraints:** Adicionar constraints no banco para validar campos obrigatorios do JSONB

#### R8. Refatorar Report.tsx

**Impacto:** Manutenibilidade, possibilidade de testes unitarios
**Esforco:** Medio

Extrair em:
- `ReportScoreOverview` - Score geral + circular progress
- `ReportRadarChart` - Radar de departamentos
- `ReportDepartmentGrid` - Grid de cards resumidos
- `ReportDepartmentDetail` - Tabela detalhada por departamento
- `ReportActionPlan` - Matriz de prioridades
- `useReportData` - Hook com toda a logica de calculo

#### R9. Implementar Error Boundaries

**Impacto:** Resiliencia
**Esforco:** Baixo

Adicionar Error Boundaries em niveis estrategicos:
- Em torno de cada rota
- Em torno de componentes de grafico (Recharts pode falhar com dados invalidos)
- Em torno do PDF export

### 10.3 Longo Prazo (1-3 meses)

#### R10. Migrar para Arquitetura Feature-Based

Reorganizar a estrutura de pastas de "tipo-based" para "feature-based":

```
src/
  features/
    assessment/
      components/
      hooks/
      utils/
      types.ts
    dashboard/
      components/
      hooks/
    report/
      components/
      hooks/
    department/
      components/
      hooks/
    auth/
      components/
      hooks/
  shared/
    components/ui/
    hooks/
    utils/
    types/
```

**Impacto:** Melhor modularidade, facilita code splitting natural, e permite que diferentes desenvolvedores trabalhem em features sem conflitos.

#### R11. Implementar Multi-Assessment

Redesenhar o sistema para suportar multiplos diagnosticos por usuario:
- Cada assessment tem seu proprio ID
- Comparacao side-by-side entre assessments
- Historico completo de evolucao

Isso requer eliminar a dependencia de localStorage e adotar Supabase como fonte unica de dados.

#### R12. Adicionar Suite de Testes

**Cobertura minima sugerida:**

| Tipo | Ferramenta | Cobertura |
|------|-----------|-----------|
| Unitarios | Vitest | scoreCalculator, useAssessment logic |
| Componentes | React Testing Library | QuestionContent, NavigationButtons, ProtectedRoute |
| Integracao | Vitest + MSW | Fluxo completo de assessment |
| E2E | Playwright ou Cypress | Login -> Assessment -> Report |

#### R13. Implementar Observabilidade

- **Error Tracking:** Sentry ou similar para captura de erros em producao
- **Analytics:** Mixpanel ou similar para entender funil de conversao do diagnostico (inicio -> conclusao)
- **Performance Monitoring:** Web Vitals tracking para medir LCP, FID, CLS

#### R14. Considerar Backend API Layer

Para evolucoes futuras (integracao com IA para recomendacoes, multi-tenancy, faturamento), considerar adicionar uma camada de API:
- Supabase Edge Functions para logica de negocio complexa
- Ou API separada (Node.js/Fastify) se a complexidade justificar

---

## Conclusao

O Diagnostico 360 possui uma base solida com boas escolhas tecnologicas (React 18, TypeScript, Supabase, shadcn/ui) e uma arquitetura funcional para seu estagio atual de MVP. As principais preocupacoes sao:

1. **Dependencia excessiva de localStorage** como storage primario, comprometendo seguranca, escalabilidade e experiencia multi-dispositivo
2. **Ausencia de gestao de estado global**, causando duplicacao de logica e re-renders desnecessarios
3. **Ausencia de validacao server-side**, criando riscos de seguranca
4. **Componentes monoliticos** (Report, SidePanel) que dificultam manutencao

As recomendacoes de curto prazo (code splitting, AuthContext, centralizacao de config) podem ser implementadas com baixo esforco e impacto imediato. A migracao do localStorage para Supabase como storage primario (medio prazo) eh a mudanca arquitetural mais importante para a evolucao sustentavel do produto.

---

*Documento gerado por Aria (System Architect Agent) em 18/02/2026.*
