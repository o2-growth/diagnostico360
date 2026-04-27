# Plano — Remover compra e deixar acesso via Google

Vou ajustar o fluxo para que a landing page leve o usuário diretamente para a tela de login, sem checkout, sem pedido de compra e sem bloqueio por pagamento.

## O que será alterado

1. **Tela de login (`/auth`)**
   - Remover formulário de email/senha.
   - Remover cadastro por email/senha.
   - Remover “esqueci minha senha” da tela principal.
   - Manter apenas o botão **Entrar com Google**.
   - Ajustar textos para deixar claro que o acesso é feito via Google.

2. **Landing page inicial (`/`)**
   - Remover qualquer ação que abra checkout Eduzz.
   - Botões principais como **Começar Agora**, **Fazer o Diagnóstico**, **Quero meu diagnóstico** e similares passarão a levar para `/auth`.
   - Remover linguagem de compra como “Já comprei”, “preço”, “pagamento”, “garantir acesso”, “investimento único”.
   - Ajustar navegação da LP para não apontar mais para seção de preço.

3. **Bloqueio por compra/pagamento**
   - Remover a barreira visual em `ProtectedRoute` que bloqueia usuários sem `has_paid`.
   - Qualquer usuário autenticado via Google poderá acessar `/home`, `/dashboard`, assessment e relatórios.
   - Manter proteção de rota apenas para exigir login.

4. **Componentes de preço/compra**
   - Remover a seção de pricing da landing ou transformá-la em uma seção neutra de benefícios, sem checkout/pagamento.
   - Atualizar FAQ para remover menções a pagamento, Stripe/Eduzz e acesso pós-compra.

## Resultado esperado

Fluxo final:

```text
Landing Page
  -> Botão inicial
    -> /auth
      -> Entrar com Google
        -> /home
```

Sem compra, sem checkout, sem `has_paid` como requisito de acesso.

## Detalhes técnicos

Arquivos principais a ajustar:

- `src/pages/Auth.tsx`
- `src/pages/LandingPage.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/landing/LPNavbar.tsx`
- `src/components/landing/LPHero.tsx`
- `src/components/landing/LPPricing.tsx`
- `src/components/landing/LPFooter.tsx`
- `src/components/landing/LPFAQ.tsx`

Não vou alterar o backend agora. O webhook Eduzz e o campo `has_paid` podem continuar existindo no banco sem afetar o novo fluxo. Apenas deixaremos de usar isso como bloqueio de acesso no app.