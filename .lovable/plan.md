

## Analise do novo payload Eduzz

O payload mudou completamente de formato. Vou comparar o que o webhook atual espera vs. o que realmente chega:

### Formato atual (incorreto)
```text
body.event = "myeduzz.invoice_paid"
body.data.buyer.email
body.data.buyer.name
```

### Formato real (novo payload)
```text
event_name = "invoice_open" | "invoice_paid" | etc.
trans_status = 1 (aberto), 3 (pago), etc.
student_email = "andreylopes.ia@gmail.com"
student_name = "andrey lopes"
cus_email = "andreylopes.ia@gmail.com" (comprador)
cus_name = "JOAO VICTOR PEREIRA" (comprador)
```

### Observacoes importantes

1. O payload que voce enviou tem `event_name: "invoice_open"` e `trans_status: 1` -- isso e uma fatura **aberta** (boleto gerado), nao paga ainda. O evento de pagamento confirmado seria `event_name: "invoice_paid"` com `trans_status: 3`.

2. O `student_email` e o email do aluno (quem recebe acesso). O `cus_email` e do comprador. Neste caso sao iguais.

3. O payload vem como objeto direto, nao aninhado em `body.data`.

### Alteracoes no `supabase/functions/eduzz-webhook/index.ts`

- Extrair `event_name` diretamente do payload (em vez de `body.event`)
- Aceitar `event_name === "invoice_paid"` como evento de pagamento confirmado
- Extrair email de `student_email` (quem recebe acesso) com fallback para `cus_email`
- Extrair nome de `student_name` com fallback para `cus_name`
- Manter todo o resto do fluxo igual (criar usuario, atualizar `has_paid`, enviar credenciais para webhook externo)

### Pergunta

O acesso deve ser liberado para o `student_email` (aluno: andreylopes.ia@gmail.com) ou para o `cus_email` (comprador: andreylopes.ia@gmail.com)? Neste caso sao iguais, mas podem ser diferentes. Vou usar `student_email` como padrao pois e quem recebe o acesso ao produto.

