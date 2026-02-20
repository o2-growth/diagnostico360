
# Formatar Saida Markdown das Recomendacoes de IA

## Problema

A IA retorna texto em formato Markdown (com `**negrito**`, listas numeradas `1.`, listas com `-`, titulos com `**`), mas o componente renderiza tudo como texto plano dentro de uma tag `<p>` com `whitespace-pre-wrap`. Isso faz o markdown bruto aparecer na tela (asteriscos visiveis, sem formatacao visual).

## Solucao

Criar um parser simples de Markdown para HTML diretamente no componente, sem adicionar dependencias externas. O parser vai converter:

- `**texto**` em `<strong>texto</strong>`
- Linhas comecando com `- ` em listas `<ul><li>`
- Linhas comecando com `1. `, `2. ` em listas `<ol><li>`
- Quebras de linha duplas em paragrafos separados

O texto formatado sera renderizado via `dangerouslySetInnerHTML` dentro de uma `<div>` com classes de tipografia do Tailwind (`prose prose-sm`).

## Detalhes Tecnicos

### Arquivo a modificar

**`src/components/department/recommendation/RecommendationItem.tsx`**

- Adicionar funcao `renderMarkdown(text: string): string` que converte markdown basico em HTML
- Trocar a tag `<p>` (linha 131) por `<div>` com `dangerouslySetInnerHTML` e classes `prose prose-sm dark:prose-invert`
- Adicionar estilos inline ou classes para garantir que listas, negrito e paragrafos fiquem bem formatados

### Conversoes do parser

```text
**texto**        ->  <strong>texto</strong>
- item           ->  <ul><li>item</li></ul>
1. item          ->  <ol><li>item</li></ol>
linha vazia      ->  separador de paragrafo
```

Nenhuma dependencia nova sera adicionada. O parser e uma funcao utilitaria simples dentro do proprio componente.
