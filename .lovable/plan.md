
## Agrupamento inteligente de perguntas por area

### O que muda na experiencia

Hoje o diagnostico apresenta todas as perguntas em sequencia, mesmo que o usuario nao tenha aquela area estruturada. Isso gera frustracao -- a pessoa precisa responder "NAO EXISTE" repetidamente para 8-10 perguntas de uma area que ela nem possui.

Com a mudanca, antes de entrar nas perguntas detalhadas de cada area, o sistema fara uma **pergunta-filtro** (gate question):

> "A empresa possui a area de **Comercial** estruturada?"
> - Sim, possui estruturada
> - Possui parcialmente
> - Nao possui

Se responder **"Nao possui"**: todas as perguntas daquela area sao automaticamente marcadas como "NAO EXISTE" no localStorage, e o diagnostico pula direto para a proxima area. O usuario ve uma mensagem breve confirmando o pulo.

Se responder **"Possui parcialmente"**: segue para as perguntas individuais normalmente (a pessoa precisa detalhar o que tem e o que nao tem).

Se responder **"Sim, possui estruturada"**: segue para as perguntas individuais normalmente.

### Areas que terao pergunta-filtro

Cada grupo de perguntas tem um prefixo numerico que identifica a area:
- 1.x = Societario
- 2.x = Tecnologia
- 3.x = Comercial
- 4.x = Marketing
- 5.x = Financeiro
- 6.x = Controladoria
- 7.x = Fiscal
- 8.x = Contabil
- 9.x = Capital Humano
- 10.x = Planejamento

Todas as 10 areas receberao a pergunta-filtro.

### Detalhes tecnicos

**1. Criar estrutura de grupos de perguntas** (`src/data/questions/index.ts`)
- Exportar um array `questionGroups` com metadados de cada area (nome, prefixo, perguntas)
- Manter o export `questions` existente para compatibilidade

**2. Atualizar o hook `useAssessment.ts`**
- Adicionar estado `departmentGates` para armazenar as respostas das perguntas-filtro
- Adicionar logica no `handleNext` para:
  - Detectar quando esta numa pergunta-filtro
  - Se resposta for "Nao possui", auto-preencher todas as perguntas da area com "NAO EXISTE" no localStorage e pular para proxima area
  - Atualizar `answeredQuestions` com todos os itens pulados
- Salvar gates no localStorage para persistir entre sessoes

**3. Atualizar `OngoingAssessment.tsx`**
- Renderizar a pergunta-filtro com UI diferenciada (card com icone da area, 3 opcoes grandes)
- Mostrar feedback visual quando uma area e pulada ("Area Comercial marcada como inexistente. Pulando para a proxima area.")

**4. Atualizar `QuestionContent.tsx`**
- Adicionar suporte para renderizar perguntas-filtro com layout especial (opcoes maiores, icone da area)

**5. Atualizar calculo de progresso**
- O progresso deve considerar as perguntas puladas como respondidas para a barra progredir corretamente
