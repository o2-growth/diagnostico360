

# Remover valor do botão e bloco de preço

## Alterações

### 1. `src/components/landing/LPPricing.tsx`
- Remover o bloco de exibição de preço (R$497 riscado, R$197 grande, "pagamento único · acesso imediato") — linhas 48-55
- Botão: de `"Garantir meu acesso — R$197"` para `"Garantir meu acesso"`
- Loading: de `"Redirecionando para o pagamento..."` para `"Redirecionando..."`

### 2. `src/components/landing/LPHero.tsx`
- Botão: de `"Fazer o Diagnóstico — R$197"` para `"Fazer o Diagnóstico"`

### 3. `src/components/landing/LPFooter.tsx`
- Botão: de `"Quero meu diagnóstico — R$197"` para `"Quero meu diagnóstico"`
- Remover texto `"Garantia de 7 dias · Pagamento seguro via Stripe"` abaixo do botão

