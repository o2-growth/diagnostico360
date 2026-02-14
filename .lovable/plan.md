

## Melhoria de UX nos itens de Recomendacao

### Analise do problema (visao de especialista UX)

A tarja vermelha com o status completo ("EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)") e redundante e causa ruido visual. O usuario ja sabe que o item e critico porque esta na aba de Recomendacoes -- repetir isso com uma barra vermelha agressiva nao agrega valor e polui a interface. Alem disso, o label "Item" antes da pergunta e desnecessario.

### O que sera feito

**Remover a tarja vermelha do status** (linhas 103-107 do `RecommendationItem.tsx`)
- Ela nao traz informacao nova ao usuario neste contexto
- Reduz ruido visual e melhora a hierarquia de informacao

**Substituir por um badge discreto no header do item**
- Adicionar um pequeno badge colorido ao lado do titulo indicando a severidade:
  - Vermelho/destrutivo para "NAO EXISTE"
  - Amarelo/aviso para "PODE SER MELHORADO"
- Isso mantem a informacao acessivel sem ser intrusiva

**Remover o label "Item" acima da pergunta**
- A pergunta ja e autoexplicativa, o label e redundante
- Exibir a pergunta diretamente com estilo mais limpo

**Melhorar espacamento e hierarquia visual**
- Dar mais destaque a recomendacao (que e o conteudo principal)
- Reduzir padding desnecessario

### Arquivo alterado
- `src/components/department/recommendation/RecommendationItem.tsx`

### Detalhe tecnico
- Linhas 96-131: Reestruturar o conteudo expandido
- Remover o bloco `div` com `bg-red-500/10` (linhas 103-107)
- Remover o label "Item" (linha 99)
- Adicionar um `Badge` no header com cor condicional baseada em `item.evaluation`:
  - `"NAO EXISTE"` -> badge vermelho com texto "Inexistente"
  - `"EXISTE DE FORMA PADRONIZADA..."` -> badge amarelo com texto "Pode melhorar"
- Manter a pergunta como texto descritivo sutil acima da textarea de recomendacao

