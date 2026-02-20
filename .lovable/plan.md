
# Conectar Recomendacoes a IA Real

## Problema

O botao "Gerar Recomendacoes com IA" nao usa IA de verdade. Ele gera texto template identico para todos os itens (sempre os mesmos 5 passos genericos). A edge function `generate-recommendations` ja existe e esta configurada corretamente com o gateway de IA, mas nunca e chamada pelo frontend.

## O Que Muda

1. O hook `useRecommendations.tsx` vai passar a chamar a edge function real via `supabase.functions.invoke('generate-recommendations')`
2. A edge function vai receber os itens criticos com contexto (nome do departamento, titulo, pergunta, avaliacao) e devolver recomendacoes personalizadas geradas pela IA
3. O prompt da edge function sera melhorado para gerar recomendacoes mais ricas e detalhadas (com plano de acao, prazos sugeridos e evidencias)
4. Erros de rate limit (429) e creditos (402) serao tratados e exibidos como toasts ao usuario

## Fluxo

```text
Usuario clica "Gerar Recomendacoes com IA"
    |
    v
useRecommendations chama supabase.functions.invoke('generate-recommendations')
    |
    v
Edge function envia itens criticos para o gateway de IA (Gemini Flash)
    |
    v
IA analisa cada item no contexto do departamento e gera recomendacao personalizada
    |
    v
Resposta volta como JSON { recommendations: { "1.1": "texto...", "1.2": "texto..." } }
    |
    v
Cards sao atualizados com as recomendacoes reais da IA
```

## Detalhes Tecnicos

### Arquivos a modificar

**`src/components/department/recommendation/useRecommendations.tsx`**
- Importar `supabase` do client
- Reescrever `generateAIRecommendations` para chamar a edge function real
- Enviar `departmentName` (nome legivel, ex: "Planejamento") e `criticalItems` (array com item, title, question, evaluation)
- Tratar erros 429 e 402 com mensagens especificas em toasts
- Manter fallback: se a chamada falhar, usar o template local como backup
- Remover o `generateRecommendationText` (ou manter apenas como fallback)

**`supabase/functions/generate-recommendations/index.ts`**
- Melhorar o prompt para gerar recomendacoes mais ricas e detalhadas
- Pedir a IA que inclua: diagnostico do problema, plano de acao com 3-5 passos concretos, prazo sugerido, e evidencias necessarias
- Aumentar o limite de 2-3 frases para recomendacoes mais completas e uteis

### Nenhuma mudanca no banco de dados - tudo ja esta configurado
