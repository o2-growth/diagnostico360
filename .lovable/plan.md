

## Recomendacoes com IA para cada area

### O que muda
Atualmente, a aba "Recomendacoes" mostra os itens criticos mas com o campo de recomendacao vazio, esperando preenchimento manual. A proposta e adicionar um botao "Gerar Recomendacoes com IA" que analisa os itens criticos da area e gera recomendacoes automaticas, breves e acionaveis.

### Experiencia do usuario
1. O usuario abre a aba "Recomendacoes" de uma area
2. Ve um botao "Gerar Recomendacoes com IA" no topo
3. Ao clicar, a IA analisa todos os itens criticos (status "NAO EXISTE" ou "PODE SER MELHORADO") daquela area
4. As recomendacoes aparecem automaticamente em cada item, com um indicador visual de que foram geradas por IA
5. O usuario pode editar as recomendacoes geradas e salvar
6. As recomendacoes ficam salvas no localStorage como ja funciona hoje

### Requisitos tecnicos

**1. Habilitar Lovable Cloud**
O projeto nao tem backend configurado. Precisamos habilitar o Lovable Cloud para criar uma edge function que chame a IA.

**2. Criar edge function `generate-recommendations`**
- Recebe: nome da area, lista de itens criticos (titulo, pergunta, status)
- Envia para Lovable AI Gateway com prompt em portugues pedindo recomendacoes breves e praticas
- Retorna: objeto com recomendacao para cada item

**3. Atualizar `DepartmentRecommendations.tsx`**
- Adicionar botao "Gerar Recomendacoes com IA" com icone de sparkles
- Estado de loading enquanto a IA processa
- Ao receber resposta, preencher as recomendacoes de cada item automaticamente

**4. Atualizar `useRecommendations.tsx`**
- Adicionar funcao `generateAIRecommendations` que chama a edge function
- Receber as recomendacoes e atualizar o estado de cada item
- Salvar no localStorage automaticamente

**5. Atualizar `RecommendationItem.tsx`**
- Adicionar badge "Gerado por IA" quando a recomendacao foi gerada automaticamente
- Manter funcionalidade de edicao manual

### Prompt da IA (backend)
A IA recebera o contexto da area e dos itens criticos, e sera instruida a gerar recomendacoes curtas (2-3 frases), praticas e orientadas a acao, em portugues do Brasil.

