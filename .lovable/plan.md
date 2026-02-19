
# Redesign da Tela de Recomendacoes - UI/UX Moderno

## Problema Atual

Os cards de recomendacao usam um layout accordion escuro e apertado que causa:
- Efeito de "cascata" confuso ao expandir
- Bloco escuro estranho com pouco contraste
- Textarea desabilitado que parece um elemento morto
- Conteudo expandido fica "preso" dentro do card sem respiracao visual
- Badges e botoes amontoados na mesma linha

## Nova Abordagem de Design

Trocar o modelo accordion (expandir/colapsar dentro do card) por **cards abertos e independentes**, onde cada recomendacao ja mostra suas informacoes principais visiveis, sem precisar clicar para expandir.

### Layout de Cada Card

```text
+----------------------------------------------------------+
|  [Badge Status]  [Badge IA]                    [Editar]   |
|                                                           |
|  P.01 - Titulo do Item                                    |
|  Pergunta do diagnostico em texto menor                   |
|                                                           |
|  ---- separador sutil ----                                |
|                                                           |
|  Recomendacao:                                            |
|  Texto da recomendacao ja visivel, formatado              |
|  em area legivel (nao textarea desabilitado)              |
|                                                           |
+----------------------------------------------------------+
```

Quando em modo edicao, o texto vira um Textarea editavel com botoes Salvar/Cancelar.

### Mudancas Visuais

1. **Cards abertos** - Sem accordion. Cada item e um card independente com todo conteudo visivel
2. **Fundo claro** - Usar `bg-card` com borda suave ao inves do bloco escuro
3. **Hierarquia visual** - Badge de status no topo, titulo em destaque, pergunta em texto muted, recomendacao em area separada
4. **Recomendacao como texto** - Quando nao esta editando, mostrar como texto formatado (nao textarea desabilitado)
5. **Espacamento generoso** - Padding e gaps maiores para respiracao
6. **Indicador lateral de prioridade** - Borda esquerda colorida (vermelha para inexistente, amarela para pode melhorar)

### Estado Vazio (sem recomendacao)

Mostrar um placeholder convidativo com icone e texto "Clique em Editar para adicionar uma recomendacao" ou "Gere recomendacoes com IA"

## Detalhes Tecnicos

### Arquivos a modificar

- `src/components/department/recommendation/RecommendationItem.tsx` - Reescrever completamente com novo layout de card aberto
- `src/components/department/DepartmentRecommendations.tsx` - Remover logica de expandedItems (nao precisa mais), simplificar grid

### Arquivos que NAO mudam

- `src/components/department/recommendation/useRecommendations.tsx` - Hook permanece igual, apenas `expandedItems` e `toggleItem` deixam de ser usados nos componentes

### Resumo das mudancas no RecommendationItem

- Remover ChevronDown/ChevronRight (sem accordion)
- Remover onClick de expand (tudo ja visivel)
- Badge de status posicionado no topo esquerdo do card
- Borda esquerda colorida por prioridade (4px solid red/yellow)
- Recomendacao exibida como texto `<p>` quando nao editando, `<Textarea>` quando editando
- Espacamento p-5 com gap-4 entre secoes
- Separador visual entre pergunta e recomendacao

### Resumo das mudancas no DepartmentRecommendations

- Remover props `isExpanded` e `onToggleExpand` do RecommendationItem
- Layout com `grid grid-cols-1 gap-4` (sem mudanca funcional, apenas limpeza)
