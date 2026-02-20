import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { departmentName, criticalItems } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const itemsList = criticalItems
      .map(
        (item: { item: string; title: string; question: string; evaluation: string }) =>
          `- Item ${item.item} "${item.title}": ${item.question} (Status: ${item.evaluation})`
      )
      .join("\n");

    const systemPrompt = `Você é um consultor sênior especialista em gestão empresarial, diagnóstico organizacional e melhoria contínua de processos.

Seu papel é analisar cada item crítico no contexto específico da área e gerar recomendações **personalizadas, detalhadas e acionáveis**.

Estrutura obrigatória para CADA recomendação:

1. **Diagnóstico**: Análise breve do impacto de não ter ou ter de forma precária este processo (2-3 frases contextualizadas à área)
2. **Plano de Ação**: 3 a 5 passos concretos e específicos (não genéricos) para implementar ou melhorar
3. **Prazo Sugerido**: Estimativa realista (curto: 1-3 meses, médio: 3-6 meses, longo: 6-12 meses)
4. **Evidências Necessárias**: Documentos ou indicadores específicos que comprovam a implementação

Regras:
- Escreva em português do Brasil
- Seja específico ao contexto da área "${departmentName}" — evite recomendações genéricas que servem para qualquer departamento
- Para itens "NÃO EXISTE": foque em como construir do zero com passos práticos
- Para itens "PODE SER MELHORADO": foque em otimização e padronização do que já existe
- Use formatação markdown com **negrito** para títulos de seção
- Cada recomendação deve ter entre 150-300 palavras`;

    const userPrompt = `Área: ${departmentName}

Itens críticos que precisam de recomendações personalizadas:
${itemsList}

Para cada item, gere uma recomendação detalhada seguindo a estrutura definida (Diagnóstico, Plano de Ação, Prazo Sugerido, Evidências Necessárias).

Responda APENAS com um JSON válido no formato:
{"recommendations": {"ITEM_ID": "recomendação completa em markdown aqui", "ITEM_ID2": "recomendação completa aqui"}}

Onde ITEM_ID é o código do item (ex: "1.1", "2.3"). Não inclua nenhum texto fora do JSON.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA insuficientes. Adicione créditos na sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar recomendações" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Erro ao processar resposta da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-recommendations error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
