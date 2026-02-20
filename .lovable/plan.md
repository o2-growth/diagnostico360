
# Landing Page Completa — Diagnóstico 360 by O2 Inc. + Stripe

## Visão Geral

Criar uma LP de alto nível no estilo premium das melhores SaaS/consultoria do mercado (inspirado no design da própria O2 Inc.: fundo escuro, verde neon como cor de destaque, tipografia bold de impacto, prova social forte). A LP será a rota `/` quando o usuário não está logado, e o fluxo termina em checkout Stripe pelo preço de R$197.

---

## Arquitetura de Rotas

- **`/`** — Landing Page pública (não requer login)
- **`/auth`** — Tela de login/cadastro (após compra ou acesso direto)
- **`/dashboard`** — App interno (protegido, apenas pós-login)

A rota `/` atualmente redireciona para Home (que é protegida). Vamos separar a LP pública da Home autenticada.

---

## Estrutura da Landing Page

### 1. Navbar fixa
- Logo O2 Inc. + "Diagnóstico 360"
- Links: Como funciona | Resultados | Preço
- CTA: "Começar Agora" (verde neon)

### 2. Hero Section
- Badge: "Powered by O2 Inc. · Porto Alegre"
- H1 impactante em duas linhas:
  - *"Descubra onde sua empresa* 
  - *está deixando dinheiro na mesa."*
- Subtítulo: em 30 minutos, você terá um diagnóstico completo das 10 áreas críticas da sua empresa
- CTA primário: "Fazer o Diagnóstico — R$197"
- CTA secundário: "Ver como funciona ↓"
- Social proof imediata: +2.000 empresas | NPS 88 | +R$2BI em operações

### 3. Logos/Credenciais (Social Proof Strip)
- Faixa com: "Confiado por empresas como…" + logos genéricos de setores

### 4. Como Funciona (3 passos)
- Cards em grid 3 colunas com ícones
- Passo 1: Responda 69 perguntas sobre as 10 áreas da empresa (~30 min)
- Passo 2: Receba seu score de 0-100% por departamento
- Passo 3: Plano de ação priorizado com recomendações de especialistas

### 5. O que você vai descobrir (10 áreas)
- Grid visual com as 10 áreas: Financeiro, Tecnologia, Planejamento, Contábil, Controladoria, Fiscal, Comercial, Marketing, Societário, Capital Humano
- Cada card com ícone temático e descrição curta

### 6. Prova Social — Depoimentos
- 3 depoimentos fictícios mas realistas de PMEs brasileiras
- Formato: foto (avatar), nome, cargo, empresa, cidade

### 7. Seção de Resultados (Preview do produto)
- Mockup visual do dashboard com score
- "Você vai sair com isso em mãos"
- Lista: Score Geral, Score por área, Plano de Ação, Relatório PDF exportável

### 8. Pricing / Oferta (Anchor da compra)
- Card de preço único centralizado
- Preço riscado: ~~R$497~~ → R$197
- Lista de benefícios inclusos (checkmarks verdes)
- Garantia 7 dias
- Botão Stripe: "Garantir meu acesso — R$197"
- Selos: Pagamento seguro, Stripe, Garantia

### 9. FAQ
- 5-6 perguntas frequentes em accordion
- "Para quem é?", "Quanto tempo leva?", "E se eu não gostar?", "É só uma vez?", etc.

### 10. Footer CTA Final
- Repetição do CTA com urgência
- Footer simples: © O2 Inc. + links

---

## Identidade Visual

Seguindo o site oficial da O2 Inc. (o2inc.com.br):
- **Background**: `#0A0A0A` (preto profundo)
- **Verde principal**: `#7EBF8E` (do sistema atual) com acento mais vibrante `#4CAF50` nos CTAs
- **Verde neon destaque** (hover/destaque): `#00E676`
- **Cinza texto**: `#A0A0A0` para textos secundários
- **Cards**: `rgba(255,255,255,0.04)` com borda `rgba(255,255,255,0.08)`
- **Tipografia**: font-weight 800-900 para headlines, bold limpo sem serifa
- Gradientes sutis em seções alternadas

---

## Integração Stripe

### Setup
1. Habilitar Stripe no projeto via ferramenta nativa do Lovable
2. Criar produto "Diagnóstico 360" com preço de R$197 (BRL, pagamento único)
3. Edge Function `create-checkout` que gera sessão de pagamento Stripe Checkout
4. Após pagamento bem-sucedido → redirecionar para `/auth?plan=paid` que cria conta e libera acesso

### Fluxo de compra
```
LP → Clica "Garantir Acesso" → Stripe Checkout (nova aba/redirect) → Pagamento OK → /auth (criar conta) → /dashboard
```

### Edge Function
- `supabase/functions/create-checkout/index.ts`
- Cria sessão Stripe com `success_url` e `cancel_url`
- Produto: preço único R$197

---

## Arquivos a criar/modificar

| Arquivo | Ação |
|---|---|
| `src/pages/LandingPage.tsx` | **CRIAR** — LP completa |
| `src/components/landing/LPNavbar.tsx` | **CRIAR** — navbar fixa |
| `src/components/landing/LPHero.tsx` | **CRIAR** — hero section |
| `src/components/landing/LPHowItWorks.tsx` | **CRIAR** — 3 passos |
| `src/components/landing/LPAreas.tsx` | **CRIAR** — 10 áreas |
| `src/components/landing/LPTestimonials.tsx` | **CRIAR** — depoimentos |
| `src/components/landing/LPPricing.tsx` | **CRIAR** — preço + Stripe |
| `src/components/landing/LPFAQ.tsx` | **CRIAR** — accordion FAQ |
| `src/components/landing/LPFooter.tsx` | **CRIAR** — footer |
| `src/App.tsx` | **EDITAR** — rota `/` = LP pública, `/home` = Home autenticada |
| `supabase/functions/create-checkout/index.ts` | **CRIAR** — edge function Stripe |

---

## Ordem de Execução

1. Habilitar Stripe e configurar produto R$197
2. Criar edge function `create-checkout`
3. Criar todos os componentes da LP
4. Montar `LandingPage.tsx` com todos os componentes
5. Ajustar rotas em `App.tsx`

---

## Nota sobre Stripe

A ativação do Stripe requer sua chave secreta. O próximo passo após aprovação será solicitar isso de forma segura pelo sistema nativo do Lovable.
