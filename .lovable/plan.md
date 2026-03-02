

# Integração Eduzz + Bloqueio de Acesso por Pagamento

## Visão geral do fluxo

```text
Usuário clica CTA → Eduzz Checkout (externo)
         ↓
Eduzz envia webhook → Edge Function "eduzz-webhook"
         ↓
Edge Function:
  1. Valida x-signature (se aplicável)
  2. Extrai email do buyer
  3. Cria conta no Supabase Auth (email + senha aleatória)
  4. Marca has_paid = true na tabela profiles
  5. Envia email + senha para webhook externo
         ↓
Usuário faz login → ProtectedRoute verifica has_paid
  - Se pagou: acesso total
  - Se não pagou: tela de bloqueio com link para checkout
```

## Alterações necessárias

### 1. Banco de dados — Adicionar coluna `has_paid` na tabela `profiles`
- `ALTER TABLE profiles ADD COLUMN has_paid boolean NOT NULL DEFAULT false;`
- Usuários existentes ficam com `false` (bloqueados até serem atualizados manualmente ou recomprarem)

### 2. Edge Function — `supabase/functions/eduzz-webhook/index.ts`
- Recebe POST da Eduzz com evento `myeduzz.invoice_paid`
- Extrai `data.buyer.email` e `data.buyer.name` do body
- Usa Supabase Admin (service role) para:
  - Criar usuário via `supabase.auth.admin.createUser({ email, password: senhaAleatória, email_confirm: true })`
  - Se o usuário já existir, apenas atualiza `has_paid = true` no profiles
  - Se é novo, o trigger `handle_new_user` cria o profile, e depois atualiza `has_paid = true`
- Envia POST para `https://webhook.aio2.com.br/webhook/envio-login-diagnostico` com `{ email, password }`
- Retorna 200 para a Eduzz
- `verify_jwt = false` no config.toml (é webhook externo)

### 3. Hook `useAuth` — Adicionar campo `hasPaid`
- Após obter o user, consultar `profiles.has_paid` onde `id = user.id`
- Expor `hasPaid: boolean` no retorno do hook

### 4. `ProtectedRoute` — Verificar pagamento
- Se `user` existe mas `hasPaid === false`: renderizar tela de bloqueio com mensagem e link para checkout Eduzz
- Se `hasPaid === true`: renderizar children normalmente

### 5. Landing Page — CTAs apontam para Eduzz
- `handleCheckout` muda de `navigate("/auth")` para `window.open("https://chk.eduzz.com/60EE8Z5K03", "_blank")` (ou `window.location.href`)

### 6. Página de Auth — Permitir login mesmo sem pagamento
- Login continua funcionando normalmente; o bloqueio acontece no `ProtectedRoute`

## Segurança
- O header `x-signature` presente no payload da Eduzz será validado se houver um secret configurado. Vou pedir para você configurar o secret `EDUZZ_WEBHOOK_SECRET` caso a Eduzz exija validação HMAC.
- A edge function usa `SUPABASE_SERVICE_ROLE_KEY` (já disponível) para criar usuários via admin API.

## Detalhes técnicos
- Senha gerada: string aleatória de 12 caracteres (letras + números + símbolos)
- Se a Eduzz enviar webhook duplicado (mesmo email), a function trata idempotentemente (apenas garante `has_paid = true`)

