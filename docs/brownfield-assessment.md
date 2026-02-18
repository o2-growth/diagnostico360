# Diagnostico 360 - Avaliacao Brownfield Completa

**Data:** 18 de fevereiro de 2026
**Analista:** Atlas (Business Analyst Agent)
**Versao do Documento:** 1.0
**Preco do Produto:** R$197 por diagnostico

---

## 1. Resumo Executivo

O Diagnostico 360 e uma aplicacao web B2B que avalia a maturidade organizacional de PMEs em 10 departamentos distintos, atraves de aproximadamente 66 perguntas estruturadas. O produto cobra R$197 por diagnostico e oferece uma experiencia de avaliacao com perguntas de triagem (gate questions) por departamento, dashboard de resultados, graficos radar, evolucao historica e geracao de recomendacoes.

### Estado Geral

A aplicacao esta **funcional em nivel MVP**, mas apresenta **debitos tecnicos significativos** que comprometem a confiabilidade, seguranca e escalabilidade para um produto comercial a R$197. Os principais riscos sao:

1. **Dependencia critica de localStorage** como storage primario -- dados podem ser perdidos a qualquer momento
2. **Credenciais Supabase expostas** no repositorio (arquivo `.env` commitado)
3. **Zero cobertura de testes** -- nenhum teste unitario, de integracao ou e2e
4. **TypeScript com strict mode desabilitado** e uso extensivo de `as any`
5. **Perguntas incompletas** -- 15 das 66 perguntas nao possuem texto de pergunta
6. **Item duplicado** no arquivo commercial.ts (item "3.1" aparece duas vezes)
7. **PDF Export e impreciso** -- botao "Exportar PDF" apenas chama `window.print()`
8. **Funcao de IA nao utilizada** -- Edge Function existe mas o frontend usa template local
9. **Dados hardcoded de departamento** -- equipe, ferramentas e custos sao ficticios
10. **index.html ainda referencia GPT Engineer** -- meta tags e scripts de terceiros

### Metricas Rapidas

| Metrica | Valor |
|---------|-------|
| Arquivos de codigo (src/) | ~70 |
| Componentes UI (shadcn) | 47 |
| Componentes customizados | ~25 |
| Paginas | 6 |
| Hooks customizados | 5 |
| Testes automatizados | 0 |
| Departamentos avaliados | 10 |
| Total de perguntas | 66 |
| Perguntas sem texto | 15 |
| Tabelas no Supabase | 4 |
| Edge Functions | 1 |

---

## 2. Stack Tecnologica Atual

### Frontend

| Tecnologia | Versao | Proposito |
|-----------|--------|-----------|
| React | 18.3.1 | Biblioteca UI |
| TypeScript | 5.5.3 | Tipagem estatica (strict OFF) |
| Vite | 5.4.1 | Build tool + dev server |
| React Router DOM | 6.26.2 | Roteamento SPA |
| Tailwind CSS | 3.4.11 | Estilizacao utilitaria |
| shadcn/ui (Radix) | Multiplos ^1.x-2.x | Componentes UI base |
| Recharts | 2.12.7 | Graficos (Radar, Bar, Line) |
| TanStack React Query | 5.56.2 | Gerenciamento de cache/estado server |
| Lucide React | 0.451.0 | Icones |
| react-circular-progressbar | 2.1.0 | Progressbar circular |
| react-hook-form + zod | 7.53 / 3.23 | Formularios + validacao |
| date-fns | 3.6.0 | Manipulacao de datas |
| jsPDF + html2canvas | 2.5.2 / 1.4.1 | Geracao de PDF |
| sonner | 1.5.0 | Toasts/notificacoes |
| next-themes | 0.3.0 | Tema dark/light (importado mas nao usado diretamente) |
| class-variance-authority | 0.7.0 | Variantes de componentes |

### Backend / Infraestrutura

| Tecnologia | Proposito |
|-----------|-----------|
| Supabase | Auth, PostgreSQL, Edge Functions, RLS |
| Supabase Auth | Email/senha + Google OAuth (via Lovable Cloud Auth) |
| Supabase Edge Functions (Deno) | Endpoint para gerar recomendacoes com IA |
| localStorage | Storage primario de respostas do diagnostico |

### Ferramentas de Build/Dev

| Ferramenta | Versao | Proposito |
|-----------|--------|-----------|
| @vitejs/plugin-react-swc | 3.5.0 | Compilacao SWC para React |
| ESLint | 9.9.0 | Linting |
| PostCSS + Autoprefixer | 8.4.47 / 10.4.20 | Processamento CSS |
| lovable-tagger | 1.1.3 | Tag de componentes (dev only) |

### Dependencias Nao Utilizadas ou Subutilizadas

1. **react-hook-form + @hookform/resolvers + zod**: Instalados mas nao usados em nenhum formulario real. O formulario de autenticacao usa estado local com `useState`.
2. **next-themes**: Instalado mas substituido por implementacao customizada em `theme-provider.tsx`.
3. **cmdk (command menu)**: Componente UI instalado mas sem uso aparente no projeto.
4. **react-day-picker / calendar**: Componente instalado mas sem uso ativo.
5. **embla-carousel-react**: Carousel instalado sem uso ativo.
6. **input-otp**: Componente OTP instalado sem uso.
7. **react-resizable-panels**: Painel redimensionavel sem uso.
8. **vaul (drawer)**: Drawer instalado sem uso ativo.
9. **@lovable.dev/cloud-auth-js**: Usado apenas para Google OAuth.
10. **@tailwindcss/typography**: Plugin instalado em devDependencies mas nao configurado no `tailwind.config.ts`.

**Impacto**: Bundle size inflado desnecessariamente. Essas dependencias nao-tree-shakeable adicionam peso ao bundle final.

---

## 3. Estrutura do Projeto

```
diagnostico360/
├── .env                           # RISCO: Credenciais commitadas no git
├── .gitignore                     # Nao inclui .env!
├── index.html                     # RISCO: Referencia GPT Engineer
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json                  # strict: false, noImplicitAny: false
├── eslint.config.js
├── components.json                # Configuracao shadcn/ui
├── supabase/
│   ├── config.toml                # verify_jwt = false na Edge Function
│   ├── functions/
│   │   └── generate-recommendations/
│   │       └── index.ts           # Edge Function (Deno) - nao usada pelo frontend
│   └── migrations/
│       ├── 20260217..._profiles_snapshots.sql
│       ├── 20260217..._user_roles.sql
│       ├── 20260218..._user_assessments.sql
│       └── 20260218..._assign_admin.sql
└── src/
    ├── main.tsx                   # Ponto de entrada
    ├── App.tsx                    # Roteamento + providers
    ├── App.css                    # CSS legado do Vite scaffold (nao usado)
    ├── index.css                  # Tailwind + variaveis CSS customizadas
    ├── vite-env.d.ts
    ├── lib/
    │   └── utils.ts               # Utility cn() do shadcn
    ├── types/
    │   └── department.ts          # Tipos: Question, DepartmentData, EvaluationStatus
    ├── data/
    │   ├── questionsData.ts       # Re-exporta de questions/index.ts
    │   ├── evolutionData.ts       # Dados ficticios hardcoded
    │   └── questions/
    │       ├── index.ts           # Agrega todos os departamentos
    │       ├── corporate.ts       # 6 perguntas (Societario)
    │       ├── technology.ts      # 7 perguntas (Tecnologia)
    │       ├── commercial.ts      # 10 perguntas (Comercial) - TEM DUPLICATA
    │       ├── marketing.ts       # 9 perguntas (Marketing)
    │       ├── financial.ts       # 9 perguntas (Financeiro)
    │       ├── controlling.ts     # 6 perguntas (Controladoria)
    │       ├── tax.ts             # 5 perguntas (Fiscal)
    │       ├── accounting.ts      # 7 perguntas (Contabil)
    │       ├── human-capital.ts   # 4 perguntas (Capital Humano)
    │       └── planning.ts        # 3 perguntas (Planejamento)
    ├── hooks/
    │   ├── useAuth.ts             # Autenticacao + role check
    │   ├── useAssessment.ts       # Logica principal do assessment
    │   ├── useAssessmentDB.ts     # Sync localStorage <-> Supabase
    │   ├── useDepartmentData.ts   # Dados ficticios de departamento
    │   └── use-toast.ts           # Hook do shadcn toast
    ├── utils/
    │   ├── scoreCalculator.ts     # Calculo de scores por departamento
    │   ├── exportToPdf.ts         # Exportacao PDF (html2canvas + jsPDF)
    │   └── sampleAssessmentData.ts # Gerador de dados de teste
    ├── integrations/
    │   ├── supabase/
    │   │   ├── client.ts          # Cliente Supabase
    │   │   └── types.ts           # Tipos gerados do banco
    │   └── lovable/
    │       └── index.ts           # Integracao Google OAuth via Lovable
    ├── pages/
    │   ├── Auth.tsx               # Login/Cadastro
    │   ├── Home.tsx               # Pagina inicial + CTA
    │   ├── Assessment.tsx         # Redirect para OngoingAssessment (limpa dados)
    │   ├── OngoingAssessment.tsx  # Fluxo principal de perguntas
    │   ├── Index.tsx              # Dashboard principal (tabs)
    │   ├── Department.tsx         # Detalhe de departamento
    │   └── Report.tsx             # Relatorio completo
    └── components/
        ├── auth/ProtectedRoute.tsx
        ├── SidePanel.tsx           # Navegacao lateral
        ├── MetricCard.tsx          # Card com CircularProgressbar
        ├── CustomerRequests.tsx    # Radar geral do dashboard
        ├── MonthlyChart.tsx        # Grafico de linha (evolucao)
        ├── theme/
        │   ├── theme-provider.tsx  # Context de tema
        │   └── ThemeToggle.tsx     # Botao dark/light
        ├── assessment/
        │   ├── ProgressHeader.tsx
        │   ├── QuestionContent.tsx
        │   ├── NavigationButtons.tsx
        │   └── ContinueAssessment.tsx
        ├── dashboard/
        │   └── DashboardContent.tsx
        ├── departments/
        │   ├── DepartmentsList.tsx
        │   └── DepartmentItem.tsx
        ├── department/
        │   ├── DepartmentHeader.tsx
        │   ├── DepartmentOverview.tsx
        │   ├── DepartmentQuestions.tsx
        │   ├── DepartmentRecommendations.tsx
        │   ├── DepartmentRadar.tsx
        │   ├── DepartmentScores.tsx
        │   ├── DepartmentEvolution.tsx
        │   ├── question/
        │   │   ├── QuestionItem.tsx
        │   │   ├── QuestionDetails.tsx
        │   │   ├── QuestionEditForm.tsx
        │   │   ├── QuestionEvidence.tsx
        │   │   ├── ApplicableQuestion.tsx
        │   │   ├── ApplicationList.tsx
        │   │   ├── EditNotification.tsx
        │   │   ├── EvaluationSection.tsx
        │   │   ├── ExportButton.tsx
        │   │   ├── ImageUploader.tsx
        │   │   └── useQuestions.tsx
        │   └── recommendation/
        │       ├── RecommendationItem.tsx
        │       ├── ExportRecommendationsButton.tsx
        │       └── useRecommendations.tsx
        ├── evolution/
        │   └── EvolutionContent.tsx
        ├── settings/
        │   └── SettingsContent.tsx
        └── ui/
            └── (47 componentes shadcn/ui)
```

### Padroes Arquiteturais Observados

1. **Page-based routing** com React Router v6
2. **Hook-based state management** sem gerenciador global (Redux/Zustand)
3. **localStorage como source of truth** com sync assincrono para Supabase
4. **shadcn/ui component library** com Tailwind CSS
5. **Dados de perguntas hardcoded** em arquivos TypeScript
6. **Tema dark-first** com toggle light/dark via Context API

---

## 4. Fluxo do Usuario (Jornada Completa)

### 4.1. Autenticacao

1. Usuario acessa qualquer rota protegida
2. `ProtectedRoute` verifica sessao via `useAuth()`
3. Se nao autenticado, redireciona para `/auth`
4. Opcoes: Email/Senha (Supabase Auth) ou Google OAuth (Lovable Cloud Auth)
5. Apos login, redireciona para `/dashboard`
6. Hook `useAuth` verifica role `admin` na tabela `user_roles`

### 4.2. Pagina Inicial (Home)

1. Exibe titulo "Diagnostico 360" com CTA "Iniciar Diagnostico"
2. Se existir assessment em andamento (detectado via localStorage), exibe link "Continuar diagnostico em andamento"
3. Secao "Como funciona" com 3 passos

### 4.3. Iniciar Assessment

1. Rota `/assessment` limpa localStorage (`departmentAnswers`, `departmentGates`, `departmentRecommendations`)
2. Redireciona imediatamente para `/ongoing-assessment`

### 4.4. Fluxo de Perguntas (OngoingAssessment)

1. Para cada departamento, exibe primeiro uma **gate question**: "A empresa possui a area de [Departamento] estruturada?"
2. Opcoes: "Sim, possui estruturada" / "Possui parcialmente" / "Nao possui"
3. Se "Nao possui": pula todas as perguntas do departamento, marca como "NAO EXISTE" e avanca
4. Se "Sim" ou "Parcialmente": apresenta perguntas individuais do departamento
5. Para cada pergunta individual, 3 opcoes de avaliacao:
   - "EXISTE E FUNCIONA PERFEITAMENTE" (100 pontos)
   - "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)" (50 pontos)
   - "NAO EXISTE" (0 pontos)
6. Respostas salvas em localStorage e sincronizadas com Supabase via `useAssessmentDB`
7. Navegacao: Anterior / Proxima / Salvar e Sair
8. Ao finalizar: salva snapshot no Supabase e redireciona ao dashboard

### 4.5. Dashboard (/dashboard)

1. **Aba Resultado**: Radar geral + cards com score circular por departamento
2. **Aba Evolucao**: Historico de snapshots com graficos de linha e barra por departamento
3. **Aba Areas**: Lista de departamentos com barra de progresso
4. **Aba Configuracoes**: Dados da conta, progresso, acoes (limpar dados, novo diagnostico)

### 4.6. Detalhe do Departamento (/department/:id)

1. **Visao Geral**: Score, radar por questao, grafico de barras, custos (dados ficticios)
2. **Questoes**: Lista de verificacao com avaliacao, evidencias, possibilidade de edicao (admin)
3. **Recomendacoes**: Itens criticos com possibilidade de gerar recomendacoes (template local, nao IA)

### 4.7. Relatorio (/report)

1. Score geral com CircularProgressbar
2. Radar geral por departamento
3. Grid de resumo por departamento
4. Tabela detalhada por departamento com avaliacao por questao
5. Recomendacoes geradas localmente
6. Plano de acao: Itens Criticos / Para Melhoria / Pontos Fortes
7. Botoes: Imprimir e "Exportar PDF" (ambos chamam `window.print()`)

---

## 5. Debitos Tecnicos Identificados

### 5.1. CRITICO - localStorage como Storage Primario

**Arquivo(s):** `src/hooks/useAssessment.ts`, `src/hooks/useAssessmentDB.ts`, `src/utils/scoreCalculator.ts`

O diagnostico inteiro depende de `localStorage`:
- Respostas (`departmentAnswers`)
- Gates (`departmentGates`)
- Recomendacoes (`departmentRecommendations`)

**Problemas:**
- Dados podem ser perdidos ao limpar browser/cache
- Limite de ~5-10MB por dominio
- Nao ha mecanismo de recuperacao
- Sync para Supabase e "fire and forget" -- erros sao apenas logados no console
- `calculateScores()` le direto do localStorage a cada render, sem caching
- Multiplas abas podem corromper dados (race condition)

**Recomendacao:** Migrar para Supabase como source of truth, com localStorage como cache offline.

### 5.2. CRITICO - TypeScript strict mode desabilitado

**Arquivo(s):** `tsconfig.json`, `tsconfig.app.json`

```json
"strict": false,
"noImplicitAny": false,
"noUnusedParameters": false,
"noUnusedLocals": false,
"strictNullChecks": false,
"noFallthroughCasesInSwitch": false
```

**Impacto:** Bugs silenciosos em runtime. Uso extensivo de `as any` em chamadas ao Supabase (`useAssessmentDB.ts` linhas 58, 87, 113). Nulls nao verificados em todo o codebase.

### 5.3. ALTO - Dados de Perguntas Incompletos

**Arquivo(s):** `src/data/questions/marketing.ts`, `technology.ts`, `commercial.ts`, `accounting.ts`, `tax.ts`

15 perguntas nao possuem texto de pergunta (`question: ""`):
- Marketing: 4.4, 4.5, 4.6, 4.7 (4 perguntas sem texto)
- Tecnologia: 2.5, 2.6 (2 perguntas sem texto)
- Comercial: 3.2, 3.5, 3.8, 3.9 (4 perguntas -- parcialmente sem application/evidence)
- Contabil: 8.4, 8.5, 8.6 (3 perguntas sem texto)
- Fiscal: 7.4 (1 pergunta sem texto)

**Impacto direto na experiencia do cliente:** O usuario paga R$197 e encontra perguntas com apenas um titulo sem contexto. Impossivel avaliar adequadamente.

### 5.4. ALTO - Item Duplicado no Comercial

**Arquivo:** `src/data/questions/commercial.ts`

O item "3.1" aparece **duas vezes**:
- Linha 6: `item: "3.1"` - "Meta de Vendas"
- Linha 102: `item: "3.1"` - "Indicadores"

**Impacto:** O segundo sobrescreve o primeiro no localStorage. O ultimo item (Indicadores) nao sera exibido corretamente no relatorio. Score do departamento Comercial fica incorreto.

### 5.5. ALTO - Dados Hardcoded de Departamento

**Arquivo:** `src/hooks/useDepartmentData.ts`

Todos os dados de equipe, ferramentas e custos sao ficticios e hardcoded:
- Apenas "Financeiro" tem dados de equipe e ferramentas preenchidos
- Os outros 9 departamentos tem `team: []` e `tools: []`
- Custos exibidos sao inventados (ex: SAP a R$5.000/mes)

**Impacto:** Secao "Custos" no detalhe do departamento mostra R$0 para 9 de 10 departamentos. Experiencia incoerente para produto pago.

### 5.6. ALTO - Funcao de IA Nao Utilizada

**Arquivo(s):** `supabase/functions/generate-recommendations/index.ts`, `src/components/department/recommendation/useRecommendations.tsx`

A Edge Function `generate-recommendations` existe e esta configurada para chamar `ai.gateway.lovable.dev` com o modelo `google/gemini-3-flash-preview`. Porem, o frontend **nao chama esta funcao**. Em vez disso, `useRecommendations.tsx` gera recomendacoes **localmente** com templates estaticos (linhas 82-103, funcao `generateRecommendationText`).

O botao diz "Gerar Recomendacoes com IA" mas na verdade usa templates fixos com `setTimeout` de 800ms para simular processamento.

### 5.7. MEDIO - Exportacao PDF Falsa

**Arquivo(s):** `src/pages/Report.tsx` (linhas 56-63), `src/utils/exportToPdf.ts`

```typescript
const handleExportPdf = () => {
  window.print();  // Apenas abre dialogo de impressao
};
```

Existe uma funcao `exportToPdf` robusta em `src/utils/exportToPdf.ts` usando jsPDF + html2canvas, mas o botao "Exportar PDF" no relatorio **nao a utiliza**. Ambos os botoes (Imprimir e Exportar PDF) fazem a mesma coisa.

A funcao `exportToPdf()` e chamada apenas pelo SidePanel, que tenta capturar elementos `[data-department]` que podem nao existir na pagina atual.

### 5.8. MEDIO - App.css Legado do Vite

**Arquivo:** `src/App.css`

Contem CSS do scaffold padrao do Vite (`#root`, `.logo`, `.logo-spin`, `.card`, `.read-the-docs`) que **conflita** com o sistema de estilos real (Tailwind + CSS vars). O seletor `#root` aplica `max-width: 1280px`, `margin: 0 auto`, `padding: 2rem` e `text-align: center` -- o que pode causar problemas de layout inesperados.

**Nota:** O `App.css` e importado em algum lugar? Na verdade, nao -- `App.tsx` nao importa `App.css`. O arquivo e orfao mas pode confundir desenvolvedores.

### 5.9. MEDIO - index.html com Metadados Incorretos

**Arquivo:** `index.html`

```html
<title>puredesign-portal</title>
<meta name="description" content="GPT Engineer Generated Project" />
<meta name="author" content="GPT Engineer" />
<meta property="og:image" content="/og-image.svg" />
<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
```

**Problemas:**
- Titulo "puredesign-portal" nao corresponde ao produto
- Descricao e autor referenciam "GPT Engineer"
- Script externo de `cdn.gpteng.co` carregado em producao -- impacto em performance e privacidade
- og:image referencia arquivo SVG possivelmente inexistente
- `lang="en"` quando o produto e 100% em portugues

### 5.10. MEDIO - Avaliacao Pre-Preenchida nos Dados

**Arquivo(s):** `src/data/questions/corporate.ts`, `technology.ts`, `accounting.ts`, `tax.ts`, `human-capital.ts`, `planning.ts`

Varios arquivos de perguntas tem o campo `evaluation` pre-preenchido com valores como `"EXISTE E FUNCIONA PERFEITAMENTE"` ou `"EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"`. Isso significa que ao carregar a pagina de departamento, as perguntas ja aparecem como "avaliadas" antes do usuario responder.

O campo deveria estar `undefined` nos dados base -- a avaliacao so deveria vir do localStorage apos o usuario responder.

### 5.11. MEDIO - React Query Subutilizado

**Arquivo:** `src/App.tsx`

TanStack React Query esta configurado com `staleTime: 5 * 1000` e `retry: 1`, mas praticamente nenhuma chamada ao Supabase usa `useQuery`. As chamadas sao feitas com `useEffect` + `useState` manual em:
- `EvolutionContent.tsx` (fetch snapshots)
- `useAuth.ts` (fetch roles)
- `useAssessmentDB.ts` (fetch assessment)

### 5.12. BAIXO - Componente `CustomerRequests` Mal Nomeado

**Arquivo:** `src/components/CustomerRequests.tsx`

O componente exibe um **grafico radar** de scores por departamento, mas se chama "CustomerRequests" (pedidos de clientes). Provavelmente e um resquicio de um template original.

### 5.13. BAIXO - Dados de Evolucao Ficticios

**Arquivo:** `src/data/evolutionData.ts`

Contem dados hardcoded de Jan/23 a Dez/24. Nao e utilizado diretamente na tela de Evolucao (que busca snapshots reais do Supabase), mas e importado e usado em `DepartmentOverview.tsx` (passado como prop `evolutionData` que nao parece ser renderizado).

### 5.14. BAIXO - Duplicacao de Configuracao de Areas

Os mesmos 10 departamentos com IDs, nomes e cores sao definidos em pelo menos 5 locais diferentes:
- `src/hooks/useDepartmentData.ts`
- `src/components/dashboard/DashboardContent.tsx`
- `src/components/departments/DepartmentsList.tsx`
- `src/components/evolution/EvolutionContent.tsx`
- `src/data/questions/index.ts`

Qualquer alteracao precisa ser replicada manualmente em todos os arquivos.

---

## 6. Funcionalidades Incompletas ou Ausentes

### 6.1. Pagamento e Monetizacao

**Nao existe nenhuma integracao de pagamento.** Para um produto a R$197, nao ha:
- Gateway de pagamento (Stripe, PagSeguro, Mercado Pago)
- Controle de acesso baseado em compra
- Periodo de trial
- Limites por plano

Qualquer usuario autenticado pode usar o sistema gratuitamente.

### 6.2. Multi-Tenancy / Multi-Empresa

O sistema nao suporta avaliar **multiplas empresas**. Um usuario:
- Pode ter apenas um assessment in_progress por vez
- Os snapshots sao armazenados sem contexto de empresa
- Nao existe cadastro de empresa/CNPJ
- O localStorage e compartilhado entre "empresas"

### 6.3. Edicao de Perguntas pelo Admin

O botao "Editar" aparece no `DepartmentHeader` para admins, mas a funcionalidade e limitada:
- Toggle de estado `isEditing` nao grava no banco de dados
- Perguntas sao hardcoded em arquivos TS -- nao e possivel alterar via interface
- Edicao na tela de questoes salva apenas no localStorage

### 6.4. Upload de Evidencias

`ImageUploader.tsx` existe mas:
- Nao tem integracao com Supabase Storage
- Imagens nao sao persistidas
- Nao e claro onde as imagens seriam associadas

### 6.5. Recuperacao de Senha

Nao existe fluxo de "Esqueci minha senha" na tela de autenticacao.

### 6.6. Onboarding / Tutorial

Nao existe tutorial ou onboarding guiado para novos usuarios. Para um produto B2B pago, isso e critico.

### 6.7. Exportacao Real de PDF

O botao "Exportar PDF" no relatorio usa `window.print()`. A funcao real `exportToPdf()` existe mas nao e utilizada adequadamente.

### 6.8. Compartilhamento de Relatorio

Nao existe funcionalidade para:
- Gerar link de compartilhamento
- Enviar relatorio por email
- Gerar versao publica do relatorio

### 6.9. Comparativo Entre Assessments

A tela de evolucao mostra snapshots ao longo do tempo, mas nao permite comparacao detalhada entre dois diagnosticos especificos.

### 6.10. Responsividade Mobile

O layout assume tela desktop com sidebar de 256px. Nao ha:
- Menu hamburger para mobile
- Layout responsivo adequado para telas pequenas
- Media queries para esconder sidebar automaticamente
- A sidebar usa `fixed` positioning com `w-64` hardcoded

---

## 7. Problemas de UX/UI

### 7.1. Perguntas Sem Texto

15 perguntas mostram apenas o titulo sem contexto explicativo. O usuario ve algo como:
> "4.5 - Investimento em midia"
> (campo de pergunta vazio)
> Opcoes: EXISTE E FUNCIONA PERFEITAMENTE / EXISTE DE FORMA PADRONIZADA / NAO EXISTE

Impossivel para o cliente entender o que esta sendo avaliado.

### 7.2. Nomenclatura Confusa nas Opcoes

As opcoes de resposta sao em CAIXA ALTA e muito longas:
- "EXISTE E FUNCIONA PERFEITAMENTE"
- "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
- "NAO EXISTE"

Para um produto a R$197, a linguagem deveria ser mais amigavel e profissional.

### 7.3. Inconsistencia na Navegacao

- Apos login, vai para `/dashboard` (Auth.tsx)
- Home (`/`) e diferente de Dashboard (`/dashboard`)
- SidePanel navega entre tabs dentro do `/dashboard` via state
- O botao "Voltar" no Department vai para `/dashboard` com state
- Nao ha breadcrumbs consistentes

### 7.4. Botao "Finalizar" Nunca Aparece

Em `OngoingAssessment.tsx` linha 131: `isLastQuestion={false}` -- o botao de navegacao **sempre** mostra "Proxima" e nunca "Finalizar", independente de ser a ultima questao.

### 7.5. Progress Header Inconsistente

O `ProgressHeader` mostra dois textos contraditorios:
- Linha 27: `"{currentQuestionIndex} de {totalQuestions} respondidas"` (answeredCount)
- Linha 33: `"Questao atual: {currentQuestionIndex + 1} de {totalQuestions}"` (tambem answeredCount + 1)

Ambos usam o mesmo valor mas com significados diferentes. O primeiro conta respostas, o segundo deveria mostrar a posicao na sequencia.

### 7.6. Feedback Visual Ausente ao Salvar

Ao selecionar uma resposta e clicar "Proxima", nao ha feedback visual de que a resposta foi salva. O toast so aparece em caso de erro.

### 7.7. Tema Dark/Light

O ThemeToggle aparece como botao fixo no canto superior direito (`fixed top-4 right-4 z-50`) em **todas** as paginas, sobrepondo potencialmente outros elementos. Nao esta integrado na sidebar.

### 7.8. Dados de Custo Ficticios

A secao "Custos" no detalhe do departamento mostra dados inventados para Financeiro e R$0 para os demais. Sem forma de o usuario informar seus proprios custos.

### 7.9. Componente "Resultado" Duplicado

O dashboard tem um componente chamado `CustomerRequests` que mostra "Resultado" como titulo do radar, e o header da pagina tambem diz "Resultado". Nomenclatura confusa.

---

## 8. Riscos de Seguranca

### 8.1. CRITICO - Credenciais no Repositorio

**Arquivo:** `.env`

```
VITE_SUPABASE_URL="https://fjhqkhatljbwyppfbcvt.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

O arquivo `.env` esta commitado no git (nao esta no `.gitignore`). Embora a key seja a "anon key" (chave publica), a URL do projeto e o ID do projeto tambem estao expostos. O `.gitignore` **nao inclui `.env`** -- apenas `.local` e ignorado.

**Recomendacao imediata:** Adicionar `.env` ao `.gitignore` e rotacionar as chaves.

### 8.2. CRITICO - Script Externo Nao Confiavel

**Arquivo:** `index.html`

```html
<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
```

Script de terceiros carregado em producao sem:
- Subresource Integrity (SRI)
- Nenhuma politica de seguranca de conteudo (CSP)
- Sem auditoria do que o script faz

**Risco:** Supply chain attack. O script pode ser modificado a qualquer momento pelo provedor.

### 8.3. ALTO - Edge Function sem JWT Verification

**Arquivo:** `supabase/config.toml`

```toml
[functions.generate-recommendations]
verify_jwt = false
```

A Edge Function `generate-recommendations` nao verifica tokens JWT. Qualquer pessoa pode chamar a funcao diretamente, consumindo creditos de IA.

### 8.4. ALTO - RLS sem Politica de UPDATE para Snapshots

**Arquivo:** `supabase/migrations/20260217205507_...sql`

A tabela `assessment_snapshots` tem politicas para SELECT, INSERT e DELETE, mas **nao tem politica de UPDATE**. Isso impede atualizacao de snapshots (pode ser intencional, mas e bom documentar).

### 8.5. MEDIO - Tratamento Inadequado de Erros de Auth

**Arquivo:** `src/pages/Auth.tsx`

```typescript
} catch (error: any) {
  toast({ title: 'Erro', description: error.message, variant: 'destructive' });
}
```

Mensagens de erro do Supabase sao exibidas diretamente ao usuario. Podem conter informacoes tecnicas como "Invalid login credentials" sem traducao.

### 8.6. MEDIO - Admin Hardcoded por Email

**Arquivo:** `supabase/migrations/20260218180056_...sql`

```sql
IF NEW.email IN ('growth@o2inc.com.br', 'andrey.lopes@o2inc.com.br') THEN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'::app_role)
```

Logica de atribuicao de admin baseada em email hardcoded em migration. Nao ha interface para gerenciar roles.

### 8.7. BAIXO - localStorage Acessivel via Console

Todos os dados do diagnostico estao em localStorage, acessiveis via DevTools. Um usuario pode manipular respostas e scores manualmente.

---

## 9. Cobertura de Testes

### Estado Atual: ZERO TESTES

O projeto **nao possui nenhum teste automatizado**:
- Zero testes unitarios
- Zero testes de integracao
- Zero testes end-to-end
- Zero snapshots de componentes
- Nenhuma ferramenta de teste configurada (Jest, Vitest, Cypress, Playwright)
- Nenhum script de teste no `package.json`

### Impacto

Para um produto pago a R$197, a ausencia de testes e um risco grave:
- Nenhuma garantia de que calculos de score estao corretos
- Nenhuma validacao de que o fluxo de assessment funciona ponta a ponta
- Refatoracoes podem quebrar funcionalidades sem deteccao
- A logica de gate questions (pular departamentos) nao e testada
- O calculo de progresso nao e testado
- A sincronizacao localStorage <-> Supabase nao e testada

### Areas Prioritarias para Testes

1. `scoreCalculator.ts` - Calculo de scores (unitario)
2. `useAssessment.ts` - Logica de navegacao e gates (unitario)
3. `useAssessmentDB.ts` - Sincronizacao de dados (integracao)
4. Fluxo completo de assessment (e2e)
5. Autenticacao e controle de acesso (e2e)
6. Geracao de relatorio (visual/snapshot)

---

## 10. Dependencias e Vulnerabilidades

### Dependencias de Producao: 37 pacotes diretos

| Categoria | Quantidade | Observacao |
|-----------|-----------|------------|
| UI/Componentes (Radix) | 22 | Todos os primitivos Radix |
| Graficos | 2 | recharts, react-circular-progressbar |
| Estado/Data | 2 | @tanstack/react-query, react-hook-form |
| Utilitarios | 5 | clsx, tailwind-merge, cva, date-fns, zod |
| PDF | 2 | jsPDF, html2canvas |
| Backend | 2 | @supabase/supabase-js, @lovable.dev/cloud-auth-js |
| Outros | 4 | sonner, next-themes, vaul, lucide-react |

### Pacotes Nao Utilizados (candidatos a remocao)

1. `react-hook-form` + `@hookform/resolvers` - Nenhum formulario usa estes pacotes
2. `zod` - Nenhuma validacao com zod no projeto
3. `next-themes` - Substituido por implementacao customizada
4. `cmdk` - Componente de command menu sem uso
5. `react-day-picker` - Calendario sem uso
6. `embla-carousel-react` - Carousel sem uso
7. `input-otp` - OTP sem uso
8. `react-resizable-panels` - Paineis redimensionaveis sem uso
9. `vaul` - Drawer sem uso

**Estimativa de reducao de bundle:** Remover esses pacotes pode reduzir significativamente o tamanho do bundle JavaScript final.

### DevDependencies: 11 pacotes

Todas as versoes estao atualizadas. O plugin `lovable-tagger` e especifico da plataforma Lovable e pode ser removido se o projeto sair dela.

### Nota sobre Tailwind

O plugin `@tailwindcss/typography` esta em devDependencies mas **nao esta listado nos plugins** do `tailwind.config.ts`. Apenas `tailwindcss-animate` esta ativo. O plugin typography deveria ser removido ou adicionado a config.

---

## 11. Analise do Banco de Dados (Supabase)

### Tabelas

| Tabela | RLS | Proposito |
|--------|-----|-----------|
| `profiles` | Sim | Perfil do usuario (id, email, created_at) |
| `assessment_snapshots` | Sim | Snapshots finais (overall_score, department_scores) |
| `user_assessments` | Sim | Assessment completo (answers, gates, recommendations, status) |
| `user_roles` | Sim | Roles do usuario (admin, moderator, user) |

### Problemas Identificados

1. **Sem indice em `user_assessments.user_id + status`** -- consultas filtram por estes campos
2. **`user_assessments.recommendations` armazena JSONB** mas nao e necessariamente utilizado
3. **`assessment_snapshots` nao referencia `user_assessments`** -- nao ha link entre o assessment e seu snapshot
4. **Sem tabela de empresas/clientes** -- nao suporta multi-tenancy
5. **Sem tabela de pagamentos/transacoes**
6. **`profiles` duplica email** que ja existe em `auth.users`
7. **Sem auditoria/log de acoes**

---

## 12. Recomendacoes Priorizadas (Impacto x Esforco)

### Matriz de Priorizacao

```
IMPACTO ALTO + ESFORCO BAIXO (Quick Wins - Fazer Primeiro)
├── 1. Corrigir .gitignore para incluir .env
├── 2. Remover script do GPT Engineer do index.html
├── 3. Corrigir meta tags e titulo no index.html
├── 4. Corrigir item duplicado 3.1 no commercial.ts
├── 5. Setar isLastQuestion corretamente no OngoingAssessment
├── 6. Remover App.css orfao
├── 7. Remover avaliacoes pre-preenchidas dos dados base
└── 8. Renomear CustomerRequests para nome adequado

IMPACTO ALTO + ESFORCO MEDIO (Investimento Prioritario)
├── 9. Completar textos das 15 perguntas vazias
├── 10. Migrar storage primario para Supabase (nao localStorage)
├── 11. Ativar TypeScript strict mode e corrigir erros
├── 12. Integrar Edge Function de IA real nas recomendacoes
├── 13. Implementar exportacao PDF real (usar exportToPdf existente)
├── 14. Configurar Vitest e escrever testes para scoreCalculator + useAssessment
├── 15. Criar tabela de empresas para multi-tenancy
├── 16. Adicionar fluxo "Esqueci minha senha"
└── 17. Ativar verify_jwt na Edge Function

IMPACTO ALTO + ESFORCO ALTO (Investimento Estrategico)
├── 18. Implementar integracao de pagamento (Stripe/MercadoPago)
├── 19. Remover dependencias nao utilizadas e otimizar bundle
├── 20. Implementar layout responsivo/mobile
├── 21. Adicionar testes e2e com Playwright
├── 22. Permitir edicao de perguntas via interface (admin)
├── 23. Implementar upload de evidencias com Supabase Storage
├── 24. Centralizar configuracao de departamentos em arquivo unico
└── 25. Implementar onboarding/tutorial para novos usuarios

IMPACTO BAIXO + ESFORCO BAIXO (Housekeeping)
├── 26. Remover evolutionData.ts (dados ficticios)
├── 27. Remover useDepartmentData hardcoded ou tornar editavel
├── 28. Adicionar @tailwindcss/typography ao config ou remover do package
├── 29. Migrar chamadas Supabase para usar React Query
└── 30. Corrigir inconsistencia no ProgressHeader
```

### Detalhamento das Top 10 Acoes

#### 1. Corrigir .gitignore (Impacto: CRITICO | Esforco: 5 min)
Adicionar `.env` ao `.gitignore`. Rotacionar chaves do Supabase.

#### 2. Limpar index.html (Impacto: ALTO | Esforco: 10 min)
Remover script `gptengineer.js`, corrigir titulo para "Diagnostico 360", descricao, autor, lang para "pt-BR".

#### 3. Completar perguntas (Impacto: CRITICO para UX | Esforco: 2-4h)
Trabalhar com o domain expert para preencher as 15 perguntas sem texto. Isso e critico para um produto a R$197.

#### 4. Corrigir duplicata 3.1 (Impacto: ALTO | Esforco: 5 min)
Renumerar o segundo item "3.1" para "3.10" em commercial.ts.

#### 5. Migrar para Supabase como source of truth (Impacto: CRITICO | Esforco: 1-2 dias)
Refatorar `useAssessment` e `scoreCalculator` para usar `user_assessments` como source of truth, mantendo localStorage apenas como cache.

#### 6. TypeScript strict mode (Impacto: ALTO | Esforco: 1-2 dias)
Ativar gradualmente strict mode. Priorizar `strictNullChecks` e resolver os `as any`.

#### 7. Testes automatizados (Impacto: ALTO | Esforco: 2-3 dias)
Configurar Vitest. Escrever testes para `scoreCalculator.ts`, `useAssessment.ts`, e fluxo de autenticacao.

#### 8. Integrar IA real (Impacto: ALTO | Esforco: 4h)
A Edge Function ja existe. Basta chamar `supabase.functions.invoke('generate-recommendations', ...)` no `useRecommendations.tsx` em vez do template local.

#### 9. PDF real (Impacto: MEDIO | Esforco: 4h)
Conectar o botao "Exportar PDF" no relatorio a funcao `exportToPdf` ou `exportQuestionsAsPdf` existente em `src/utils/exportToPdf.ts`.

#### 10. Pagamento (Impacto: CRITICO para receita | Esforco: 3-5 dias)
Implementar checkout com Stripe ou MercadoPago. Criar tabela `payments`, middleware de verificacao, e restringir acesso ao assessment.

---

## 13. Resumo de Riscos por Severidade

| Severidade | Quantidade | Exemplos |
|-----------|-----------|----------|
| CRITICO | 5 | .env exposto, localStorage como source of truth, zero testes, sem pagamento, perguntas incompletas |
| ALTO | 8 | strict mode off, item duplicado, dados hardcoded, IA falsa, Edge Function sem JWT |
| MEDIO | 7 | PDF falso, App.css orfao, index.html incorreto, avaliacoes pre-preenchidas, React Query subutilizado |
| BAIXO | 5 | Nome de componente, dados ficticios, plugin nao configurado, duplicacao de config |

---

## 14. Conclusao

O Diagnostico 360 e um MVP funcional com boa base de UI (shadcn/ui + Tailwind) e uma estrutura de dados de perguntas bem pensada para 10 departamentos. No entanto, **nao esta pronto para uso comercial a R$197** nos seguintes aspectos:

1. **Confiabilidade**: Dados armazenados primariamente em localStorage podem ser perdidos
2. **Qualidade do Conteudo**: 23% das perguntas (15/66) estao incompletas
3. **Seguranca**: Credenciais expostas e scripts de terceiros nao auditados
4. **Monetizacao**: Nao existe integracao de pagamento
5. **Qualidade de Codigo**: TypeScript strict desabilitado e zero testes

O caminho para producao requer aproximadamente **2-3 semanas de trabalho focado** para resolver os itens criticos e altos, seguido de um sprint de 1-2 semanas para pagamento e testes e2e.

---

*Documento gerado por Atlas - Business Analyst Agent*
*Baseado na analise completa de todos os arquivos do projeto em 18/02/2026*
