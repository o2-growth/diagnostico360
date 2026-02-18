# PRD - Diagnostico 360: Melhorias do Produto

**Data:** 18/02/2026
**Versao:** 1.0
**Autor:** Morgan (Product Manager Agent)
**Produto:** Diagnostico 360 - Ferramenta B2B de diagnostico organizacional para PMEs
**Preco:** R$197 por diagnostico

---

## Indice

1. [Declaracao do Problema](#1-declaracao-do-problema)
2. [Visao do Produto](#2-visao-do-produto)
3. [Personas de Usuario](#3-personas-de-usuario)
4. [Metricas de Sucesso (KPIs)](#4-metricas-de-sucesso-kpis)
5. [Epicos de Melhoria (Priorizados por MoSCoW)](#5-epicos-de-melhoria-priorizados-por-moscow)
6. [Restricoes Tecnicas](#6-restricoes-tecnicas)
7. [Riscos e Mitigacoes](#7-riscos-e-mitigacoes)
8. [Sugestao de Cronograma](#8-sugestao-de-cronograma)

---

## 1. Declaracao do Problema

### Contexto

O Diagnostico 360 e uma ferramenta B2B que avalia a maturidade organizacional de Pequenas e Medias Empresas (PMEs) em 10 departamentos, cobrando R$197 por diagnostico. O produto existe como um MVP funcional, mas apresenta debitos tecnicos e lacunas funcionais que comprometem a proposta de valor e impedem sua comercializacao efetiva.

### Problemas Centrais

**Para o cliente (empresa PME):**

1. **Risco de perda de dados:** As respostas do diagnostico sao armazenadas primariamente no `localStorage` do navegador. Limpar o cache, trocar de dispositivo ou de navegador resulta em perda completa do progresso e dos resultados -- inaceitavel para um produto pago a R$197.

2. **Conteudo incompleto:** 15 das 66 perguntas (23%) nao possuem texto explicativo. O cliente paga R$197 e encontra campos vazios, sem saber o que esta sendo avaliado. Isso destroi a credibilidade do diagnostico.

3. **Recomendacoes falsas de IA:** O botao diz "Gerar Recomendacoes com IA", mas na verdade gera textos a partir de templates estaticos locais com um `setTimeout` de 800ms para simular processamento. Existe uma Edge Function real configurada no Supabase com modelo Gemini, porem o frontend nao a utiliza. O cliente recebe recomendacoes genericas que nao justificam o preco.

4. **Sem conversao para especialista:** A visao do fundador e clara: o diagnostico deve terminar com um CTA para falar com especialista. Atualmente, nao existe nenhum mecanismo de conversao no final do relatorio.

5. **Exportacao PDF inexistente:** O botao "Exportar PDF" apenas abre a caixa de dialogo de impressao do navegador (`window.print()`). Existe uma funcao real de exportacao PDF (`exportToPdf.ts` usando jsPDF + html2canvas), mas nao esta conectada ao botao.

6. **Bug no botao Finalizar:** O parametro `isLastQuestion` esta hardcoded como `false`, fazendo com que o botao "Finalizar" nunca apareca. O usuario nao tem indicacao clara de que completou o diagnostico.

**Para o negocio:**

7. **Dados hardcoded de departamento:** Informacoes de equipe, ferramentas e custos sao ficticios (apenas o departamento Financeiro tem dados preenchidos). Os outros 9 departamentos mostram R$0 em custos. Isso compromete a percepcao de qualidade.

8. **Item duplicado:** O item "3.1" aparece duas vezes no departamento Comercial, causando sobrescrita de dados e score incorreto.

9. **Metadados incorretos:** O `index.html` ainda referencia "puredesign-portal" e "GPT Engineer", com scripts de terceiros carregados em producao.

### Declaracao Sintetica

> O Diagnostico 360 precisa evoluir de um MVP com dados volateis, conteudo incompleto e IA simulada para um produto confiavel que justifique R$197 -- entregando persistencia segura de dados, perguntas completas, analise real de IA, relatorio profissional exportavel e um funil claro de conversao para consultoria especializada.

---

## 2. Visao do Produto

### Declaracao do Fundador

> "Diagnostico basico que mostre o estado atual da empresa por setor e um score geral, onde a pessoa veja os pontos criticos dela de possiveis melhorias com uma analise de IA e que com isso tenha no final um CTA para ela falar com especialista."

### Visao Expandida

O Diagnostico 360 sera a ferramenta de referencia para PMEs que desejam entender a maturidade dos seus processos organizacionais de forma rapida, objetiva e acionavel. Por R$197, o empresario recebera:

1. **Avaliacao estruturada** em 10 departamentos com perguntas claras e contextualizadas
2. **Score geral e por setor** visualizado em dashboard interativo com graficos radar
3. **Identificacao de pontos criticos** com classificacao por severidade
4. **Recomendacoes personalizadas geradas por IA** baseadas nos dados reais da empresa
5. **Relatorio profissional exportavel em PDF** para compartilhar com socios e equipe
6. **CTA claro para agendar conversa com especialista** como proximo passo natural apos ver os pontos de melhoria

### Proposta de Valor

| Elemento | Como Entrega Valor |
|----------|-------------------|
| Score por departamento | Visao objetiva e comparavel da maturidade organizacional |
| Pontos criticos identificados | Sabe exatamente onde precisa agir primeiro |
| Recomendacoes de IA | Recebe orientacao personalizada, nao generica |
| Relatorio PDF profissional | Pode compartilhar com socios, diretores e equipe |
| CTA para especialista | Tem o proximo passo claro para resolver os problemas identificados |

### O que Justifica R$197

A combinacao de diagnostico estruturado + analise de IA personalizada + relatorio profissional cria um pacote que seria cobrado a partir de R$500-1.000 por uma consultoria tradicional. O preco de R$197 e competitivo se o produto entregar qualidade percebida equivalente:

- **Perguntas completas e bem formuladas** (nao campos vazios)
- **Dados persistidos de forma segura** (nao perdidos ao limpar cache)
- **Recomendacoes reais de IA** (nao templates estaticos)
- **PDF profissional** (nao `window.print()`)
- **Caminho claro para proximo passo** (CTA para especialista)

---

## 3. Personas de Usuario

### Persona 1: Carlos - Empresario de PME

| Atributo | Detalhe |
|----------|---------|
| **Nome** | Carlos Oliveira |
| **Papel** | Socio-diretor de uma empresa com 15-80 funcionarios |
| **Idade** | 35-55 anos |
| **Perfil tecnico** | Baixo a medio; usa computador e celular no dia a dia, mas nao e tecnico |
| **Motivacao** | Quer entender onde sua empresa esta falhando e o que priorizar para crescer |
| **Dor principal** | Sabe que tem problemas, mas nao sabe dimensionar nem por onde comecar |
| **Expectativa ao pagar R$197** | Receber um diagnostico profissional, claro e acionavel que justifique o investimento |
| **Frustracao critica** | Pagar e encontrar perguntas vazias, perder dados ao trocar de navegador, ou receber recomendacoes genericas |

**Cenario de uso:**
Carlos ouviu falar do Diagnostico 360 por indicacao ou anuncio. Ele paga R$197, faz o cadastro, e comeca a responder as perguntas. Ele quer completar em 30-45 minutos, receber o resultado imediato com os pontos criticos, baixar um PDF para mostrar ao socio, e se os problemas forem serios o suficiente, agendar uma conversa com um especialista.

### Persona 2: Mariana - Consultora/Admin

| Atributo | Detalhe |
|----------|---------|
| **Nome** | Mariana Santos |
| **Papel** | Consultora de gestao / administradora da plataforma |
| **Idade** | 28-45 anos |
| **Perfil tecnico** | Medio; familiarizada com ferramentas SaaS |
| **Motivacao** | Usar o diagnostico como ferramenta de entrada para vender consultoria |
| **Dor principal** | Precisa que o diagnostico gere leads qualificados com dados reais sobre as necessidades do cliente |
| **Expectativa** | Ver relatorios dos clientes, identificar os mais criticos, e receber contatos via CTA |

**Cenario de uso:**
Mariana envia o link do Diagnostico 360 para potenciais clientes como primeiro passo do funil de vendas. Apos o cliente completar e ver seus pontos criticos, ele clica no CTA "Falar com Especialista". Mariana recebe a notificacao e ja sabe exatamente quais departamentos do cliente estao criticos, permitindo uma abordagem consultiva direcionada.

---

## 4. Metricas de Sucesso (KPIs)

### KPIs de Produto

| KPI | Meta | Como Medir |
|-----|------|-----------|
| **Taxa de conclusao do diagnostico** | >= 70% | Usuarios que iniciam vs. que completam todas as perguntas |
| **Tempo medio para conclusao** | 25-40 minutos | Timestamp de inicio vs. conclusao no banco |
| **Taxa de clique no CTA "Falar com Especialista"** | >= 15% | Cliques no CTA / total de diagnosticos completos |
| **Taxa de download do PDF** | >= 50% | Downloads de PDF / total de diagnosticos completos |
| **NPS pos-diagnostico** | >= 40 | Pesquisa rapida apos conclusao (futuro) |
| **Taxa de retorno** | >= 10% | Usuarios que fazem um segundo diagnostico em 90 dias |

### KPIs de Qualidade

| KPI | Meta | Como Medir |
|-----|------|-----------|
| **Perda de dados reportada** | 0 incidentes | Tickets de suporte + monitoramento de erros |
| **Perguntas com texto completo** | 100% (66/66) | Auditoria nos arquivos de perguntas |
| **Recomendacoes geradas por IA real** | 100% | Monitoramento da Edge Function |
| **Erros de score/calculo** | 0 | Testes automatizados no scoreCalculator |

### KPIs de Negocio

| KPI | Meta | Como Medir |
|-----|------|-----------|
| **Receita mensal** | Crescimento mes a mes | Vendas x R$197 |
| **Custo por diagnostico (IA)** | < R$2 por diagnostico | Consumo de creditos da API de IA |
| **Conversao CTA -> contato efetivo** | >= 30% do clique | Agendamentos realizados vs. cliques no CTA |
| **Churn de interesse** | < 30% de abandono | Usuarios que iniciam mas nao completam |

---

## 5. Epicos de Melhoria (Priorizados por MoSCoW)

### Visao Geral da Priorizacao

```
MUST HAVE (Lancamento bloqueado sem estes):
  E1. Fluxo Core do Diagnostico Confiavel
  E2. Analise e Recomendacoes Reais com IA
  E3. CTA para Contato com Especialista

SHOULD HAVE (Aumentam significativamente o valor):
  E4. Exportacao Profissional de PDF
  E5. Limpeza de Dados Hardcoded e Mock

COULD HAVE (Nice to have, se houver tempo):
  E6. Envio de Relatorio por Email

WON'T HAVE (Nesta versao):
  E7. Multi-tenant / White-label / Pagamento integrado
```

---

### MUST HAVE

---

### E1. Fluxo Core do Diagnostico Confiavel

**Prioridade:** MUST HAVE
**Estimativa:** 5-8 dias de desenvolvimento
**Justificativa:** Sem persistencia confiavel e conteudo completo, o produto nao vale R$197. Este e o alicerce de tudo.

#### Objetivo

Garantir que o fluxo completo do diagnostico (inicio -> perguntas -> finalizacao -> visualizacao de resultados) funcione de forma confiavel, com dados persistidos no banco de dados, perguntas completas, scoring correto e navegacao clara.

#### User Stories

**US1.1 - Persistencia no banco de dados**
> Como Carlos (empresario), eu quero que minhas respostas sejam salvas de forma segura no servidor para que eu nao perca meu progresso se fechar o navegador, trocar de dispositivo ou limpar o cache.

Criterios de aceite:
- Supabase (`user_assessments`) e a fonte primaria de dados
- localStorage funciona apenas como cache local para performance
- Ao carregar qualquer pagina (dashboard, relatorio, departamento), os dados sao buscados do banco se o localStorage estiver vazio
- O `scoreCalculator` pode calcular scores a partir dos dados do banco, nao apenas localStorage
- Ao responder cada pergunta, a resposta e salva no banco em ate 3 segundos
- Se a sincronizacao falhar, o usuario recebe feedback visual e os dados sao retentados

**US1.2 - Perguntas completas**
> Como Carlos (empresario), eu quero que todas as perguntas tenham texto explicativo claro para que eu entenda exatamente o que esta sendo avaliado em cada item.

Criterios de aceite:
- Todas as 66 perguntas possuem campo `question` preenchido com texto descritivo
- Correcao das 15 perguntas vazias: Marketing (4.4, 4.5, 4.6, 4.7), Tecnologia (2.5, 2.6), Comercial (3.2, 3.5, 3.8, 3.9), Contabil (8.4, 8.5, 8.6), Fiscal (7.4)
- Correcao do item duplicado "3.1" no Comercial (renumerar para "3.10")
- Remocao de avaliacoes pre-preenchidas dos dados base (campo `evaluation` deve ser `undefined`)
- Revisao geral da qualidade textual com domain expert

**US1.3 - Botao Finalizar funcional**
> Como Carlos (empresario), eu quero ver um botao "Finalizar" quando chego na ultima pergunta para que eu saiba claramente que completei o diagnostico.

Criterios de aceite:
- `isLastQuestion` e calculado corretamente baseado na posicao real do usuario no fluxo
- Ao clicar em "Finalizar", o assessment e marcado como `completed` no banco
- Um snapshot de scores e criado em `assessment_snapshots`
- O usuario e redirecionado ao dashboard com seus resultados visiveis
- Feedback visual de conclusao (toast de sucesso ou tela de confirmacao)

**US1.4 - Progresso claro durante o diagnostico**
> Como Carlos (empresario), eu quero ver claramente meu progresso (quantas perguntas ja respondi e quantas faltam) para que eu saiba quanto tempo ainda preciso investir.

Criterios de aceite:
- O `ProgressHeader` mostra informacao consistente e nao contraditoria
- Barra de progresso reflete o avanco real (perguntas respondidas / total aplicavel)
- Feedback visual ao salvar cada resposta (confirmacao sutil, nao intrusiva)

**US1.5 - Retomar diagnostico em andamento**
> Como Carlos (empresario), eu quero poder fechar o navegador e continuar o diagnostico de onde parei, mesmo em outro dispositivo, para que eu tenha flexibilidade de horario.

Criterios de aceite:
- Ao acessar a Home com um assessment `in_progress` no banco, o botao "Continuar diagnostico" aparece
- Ao clicar, o usuario retoma da ultima pergunta nao respondida
- Funciona mesmo se o localStorage estiver vazio (dados sao carregados do banco)

**US1.6 - Dashboard e Relatorio lerem do banco**
> Como Carlos (empresario), eu quero que meus resultados estejam disponiveis mesmo apos limpar o cache do navegador para que eu possa consultar meu diagnostico a qualquer momento.

Criterios de aceite:
- Dashboard, Relatorio e pagina de Departamento tentam ler localStorage primeiro (performance)
- Se localStorage estiver vazio, buscam dados de `user_assessments` e/ou `assessment_snapshots` do banco
- Scores sao recalculados a partir dos dados do banco quando necessario
- Nenhuma pagina mostra 0% se existirem dados no banco

#### Dependencias Tecnicas

- Refatoracao do `useAssessment.ts` e `useAssessmentDB.ts`
- Refatoracao do `scoreCalculator.ts` para aceitar dados como parametro (nao ler direto do localStorage)
- Criacao de indice `idx_user_assessments_user_id_status` no banco
- Criacao de partial unique index para garantir no maximo 1 assessment `in_progress` por usuario
- Colaboracao com domain expert para textos das perguntas

---

### E2. Analise e Recomendacoes Reais com IA

**Prioridade:** MUST HAVE
**Estimativa:** 2-3 dias de desenvolvimento
**Justificativa:** As recomendacoes personalizadas de IA sao o principal diferencial de valor que justifica R$197. Sem elas, o diagnostico e apenas um questionario com pontuacao.

#### Objetivo

Conectar o frontend a Edge Function `generate-recommendations` existente no Supabase para gerar recomendacoes reais com IA (modelo Gemini via Lovable Gateway), substituindo os templates estaticos atuais.

#### User Stories

**US2.1 - Recomendacoes reais de IA por departamento**
> Como Carlos (empresario), eu quero receber recomendacoes personalizadas baseadas nas minhas respostas reais para que eu saiba exatamente o que fazer para melhorar cada area critica.

Criterios de aceite:
- Ao clicar em "Gerar Recomendacoes com IA", o frontend chama a Edge Function `generate-recommendations`
- Os itens criticos (score 0 ou 50) do departamento sao enviados como contexto para a IA
- As recomendacoes retornadas sao exibidas na secao de Recomendacoes do departamento
- As recomendacoes sao salvas no banco (`user_assessments.recommendations`)
- Tempo de resposta aceitavel: < 10 segundos com feedback visual de loading

**US2.2 - Recomendacoes no relatorio final**
> Como Carlos (empresario), eu quero ver as recomendacoes de IA integradas ao meu relatorio final para que o documento seja completo e acionavel.

Criterios de aceite:
- A secao de Recomendacoes no Relatorio (`Report.tsx`) exibe recomendacoes geradas pela IA
- Se recomendacoes ja foram geradas para um departamento, sao exibidas diretamente
- Se ainda nao foram geradas, exibe opcao de gerar ou mostra indicacao de que estao pendentes
- O Plano de Acao usa as recomendacoes de IA (nao templates estaticos)

**US2.3 - Tratamento de erros da IA**
> Como Carlos (empresario), eu quero receber feedback claro se a geracao de recomendacoes falhar para que eu nao fique esperando indefinidamente.

Criterios de aceite:
- Se a Edge Function retornar erro (429, 402, 500), o usuario recebe mensagem amigavel em portugues
- Opcao de "Tentar novamente" apos falha
- Se a IA estiver indisponivel, as recomendacoes anteriores (se existirem) continuam visiveis
- Log de erros no console para debugging

#### Dependencias Tecnicas

- Ativar `verify_jwt = true` na Edge Function (seguranca)
- Refatorar `useRecommendations.tsx` para chamar `supabase.functions.invoke('generate-recommendations', ...)`
- Remover funcao `generateRecommendationText` (template local)
- Garantir que o frontend envia o token JWT na chamada

---

### E3. CTA para Contato com Especialista

**Prioridade:** MUST HAVE
**Estimativa:** 1-2 dias de desenvolvimento
**Justificativa:** Este e o objetivo final do funil descrito pelo fundador. Sem o CTA, o diagnostico e um fim em si mesmo, sem conversao comercial.

#### Objetivo

Criar um Call-to-Action claro e persuasivo no final do relatorio e no dashboard, direcionando o cliente que identificou pontos criticos para agendar uma conversa com um especialista.

#### User Stories

**US3.1 - CTA no final do relatorio**
> Como Carlos (empresario), eu quero ter a opcao de falar com um especialista apos ver meus resultados para que eu tenha ajuda profissional para resolver os problemas identificados.

Criterios de aceite:
- Secao proeminente no final do Relatorio com CTA "Falar com Especialista"
- A secao destaca os top 3 pontos criticos do diagnostico como motivacao
- O CTA abre um dos canais de contato: WhatsApp, formulario de agendamento, ou email
- O CTA inclui contexto (ex: "Seus departamentos X, Y e Z precisam de atencao urgente")
- Estilo visual destacado -- deve ser a acao mais visivel da pagina

**US3.2 - CTA no dashboard**
> Como Carlos (empresario), eu quero ver um lembrete para falar com especialista no meu dashboard para que eu nao esqueca de dar o proximo passo.

Criterios de aceite:
- Card ou banner no dashboard com CTA para especialista
- Aparece somente apos ter pelo menos 1 diagnostico completo
- Personalizacao baseada no score geral (ex: "Seu score e 45% - vamos melhorar?")
- Menos agressivo que o CTA do relatorio (e um lembrete, nao uma venda)

**US3.3 - CTA no PDF exportado**
> Como Carlos (empresario), eu quero que o PDF do relatorio tambem tenha o contato do especialista para que quando eu compartilhar com meus socios, eles tambem vejam como buscar ajuda.

Criterios de aceite:
- O PDF exportado inclui secao final com dados de contato do especialista
- Inclui QR code ou link para WhatsApp/agendamento
- Design profissional e coerente com o restante do relatorio

#### Configuracao do CTA

O canal de contato deve ser configuravel (nao hardcoded). Sugestao inicial:
- **WhatsApp Business:** Link `wa.me/55XXXXXXXXXXX?text=Olá, fiz o Diagnóstico 360 e gostaria de falar com um especialista`
- **Texto padrao:** Incluir score geral e departamentos criticos na mensagem pre-preenchida

---

### SHOULD HAVE

---

### E4. Exportacao Profissional de PDF

**Prioridade:** SHOULD HAVE
**Estimativa:** 2-3 dias de desenvolvimento
**Justificativa:** O PDF e o entregavel tangivel que o cliente recebe por R$197. Um PDF mal formatado (ou inexistente) reduz drasticamente a percepcao de valor.

#### Objetivo

Implementar exportacao real de PDF do relatorio completo, utilizando a infraestrutura ja existente (jsPDF + html2canvas) e gerando um documento profissional com branding.

#### User Stories

**US4.1 - Exportar relatorio como PDF**
> Como Carlos (empresario), eu quero baixar meu relatorio como um arquivo PDF profissional para que eu possa compartilhar com meus socios e guardar como referencia.

Criterios de aceite:
- O botao "Exportar PDF" no Relatorio gera um arquivo PDF real (nao `window.print()`)
- O PDF inclui: capa com nome da empresa e data, score geral, radar chart, scores por departamento, perguntas com avaliacoes, recomendacoes de IA, plano de acao, CTA para especialista
- Formatacao profissional com branding (logo, cores, tipografia consistente)
- Tamanho do arquivo razoavel (< 5MB)
- Feedback visual durante geracao (loading/progress)
- Nome do arquivo: `diagnostico-360-[data].pdf`

**US4.2 - Exportar departamento individual como PDF**
> Como Carlos (empresario), eu quero exportar o detalhe de um departamento especifico como PDF para que eu possa compartilhar com o responsavel daquela area.

Criterios de aceite:
- Botao de exportar PDF na pagina de detalhe do departamento
- PDF inclui: nome do departamento, score, perguntas com avaliacoes, recomendacoes de IA
- Formatacao coerente com o relatorio geral

#### Dependencias Tecnicas

- Conectar botao "Exportar PDF" do `Report.tsx` a funcao `exportToPdf` existente em `src/utils/exportToPdf.ts`
- Revisar e ajustar `exportToPdf.ts` para capturar corretamente todas as secoes do relatorio
- Considerar usar Lazy Loading para jsPDF e html2canvas (reducao de ~75KB no bundle inicial)

---

### E5. Limpeza de Dados Hardcoded e Mock

**Prioridade:** SHOULD HAVE
**Estimativa:** 1-2 dias de desenvolvimento
**Justificativa:** Dados ficticios de equipe, ferramentas e custos (R$0 para 9 de 10 departamentos) prejudicam a credibilidade. O `index.html` com referencias a "GPT Engineer" e um problema de imagem.

#### User Stories

**US5.1 - Remover dados ficticios de departamento**
> Como Carlos (empresario), eu quero que as informacoes exibidas no diagnostico reflitam apenas os dados que eu forneci para que eu confie na precisao do relatorio.

Criterios de aceite:
- Remover ou esconder secao "Custos" com dados ficticios do `useDepartmentData.ts`
- Remover dados de equipe e ferramentas hardcoded (ou transformar em campos editaveis futuros)
- Remover `evolutionData.ts` (dados ficticios de Jan/23 a Dez/24)
- A secao de "Visao Geral" do departamento exibe apenas informacoes reais do diagnostico

**US5.2 - Corrigir metadados do produto**
> Como Carlos (empresario), eu quero que o produto tenha identidade profissional propria para que eu confie que estou usando uma ferramenta seria.

Criterios de aceite:
- `index.html`: titulo atualizado para "Diagnostico 360", `lang="pt-BR"`, remocao de meta tags "GPT Engineer"
- Remocao do script `cdn.gpteng.co/gptengineer.js`
- Open Graph tags corretas com descricao do produto
- Remocao de `App.css` orfao (nao utilizado)
- Renomear componente `CustomerRequests` para nome semantico (ex: `RadarChartOverview`)

**US5.3 - Centralizar configuracao de departamentos**
> Como Mariana (consultora/admin), eu quero que a configuracao de departamentos seja centralizada para que futuras alteracoes sejam simples e consistentes.

Criterios de aceite:
- Criar arquivo unico `src/data/departments.ts` como fonte de verdade
- Migrar IDs, nomes, cores e prefixos de pelo menos 5 arquivos duplicados para este arquivo unico
- Todos os componentes que usam configuracao de departamentos importam desta fonte unica

---

### COULD HAVE

---

### E6. Envio de Relatorio por Email

**Prioridade:** COULD HAVE
**Estimativa:** 2-3 dias de desenvolvimento
**Justificativa:** Facilita compartilhamento e cria uma comunicacao profissional pos-diagnostico. Pode ser implementado como extensao da Edge Function.

#### User Stories

**US6.1 - Receber relatorio por email**
> Como Carlos (empresario), eu quero receber meu relatorio por email apos completar o diagnostico para que eu tenha um registro permanente e facil de encontrar.

Criterios de aceite:
- Ao finalizar o diagnostico, opcao de "Enviar por email"
- Email com resumo dos resultados (score geral, top pontos criticos)
- PDF do relatorio em anexo
- CTA para especialista no corpo do email
- Email enviado via Supabase Edge Function + provedor de email (ex: Resend)

**US6.2 - Compartilhar relatorio com terceiros**
> Como Carlos (empresario), eu quero enviar meu relatorio para o email de um socio ou gestor para que ele tambem veja os resultados.

Criterios de aceite:
- Campo para inserir email de destinatario
- Email com mensagem personalizada + link ou PDF
- Sem necessidade de cadastro do destinatario

---

### WON'T HAVE (Nesta Versao)

Os seguintes itens foram deliberadamente excluidos desta versao para manter foco no MVP comercializavel:

| Item | Razao da Exclusao |
|------|-------------------|
| **Multi-tenant (multiplas empresas por usuario)** | Complexidade alta; o modelo atual de 1 diagnostico ativo por vez e suficiente para validar o produto |
| **White-label** | Foco atual e na marca propria; white-label e uma evolucao pos-product-market-fit |
| **Integracao de pagamento** | Sera tratada em fase separada apos o produto estar funcionalmente completo; inicialmente a cobranca pode ser feita externamente (link de pagamento) |
| **Edicao de perguntas via interface admin** | Perguntas serao corrigidas diretamente no codigo nesta fase; interface de edicao e uma evolucao futura |
| **Upload de evidencias** | Funcionalidade complexa com Supabase Storage; nao essencial para a proposta de valor core |
| **Responsividade mobile completa** | Diagnostico e uma atividade de desktop/tablet; mobile pode ser tratado na proxima fase |
| **Testes automatizados completos** | Sera iniciado com testes criticos (scoreCalculator, fluxo de assessment), mas cobertura completa sera progressiva |
| **Multi-idioma / i18n** | Produto 100% em portugues; internacionalizacao nao e prioridade |
| **Dashboard administrativo cross-user** | Requer politicas RLS adicionais; sera tratado quando houver volume de usuarios |

---

## 6. Restricoes Tecnicas

### Arquitetura Atual (Manter)

| Componente | Tecnologia | Observacao |
|-----------|-----------|-----------|
| Frontend | React 18 + TypeScript + Vite | Manter; stack moderna e adequada |
| UI | Tailwind CSS + shadcn/ui (Radix) | Manter; boa base de componentes |
| Backend | Supabase (Auth, PostgreSQL, Edge Functions) | Manter e ampliar uso |
| IA | Edge Function + Lovable AI Gateway (Gemini) | Manter; ja existe e funciona |
| Graficos | Recharts | Manter; adequado para radar e barras |
| PDF | jsPDF + html2canvas | Manter; ja existe codigo funcional |

### Restricoes de Design

1. **TypeScript strict mode desabilitado:** O `tsconfig.json` tem `strict: false` e `noImplicitAny: false`. Idealmente deve ser habilitado progressivamente, mas nao e bloqueador para esta fase. Priorizar `strictNullChecks` para evitar bugs criticos.

2. **Zero testes automatizados:** Nenhuma ferramenta de teste configurada. Recomendacao: configurar Vitest e escrever testes minimamente para `scoreCalculator.ts` e fluxo de assessment antes de refatorar.

3. **React Query subutilizado:** O TanStack React Query esta instalado e configurado, mas nenhuma chamada ao Supabase o utiliza. A migracao para Supabase como fonte primaria deve usar React Query para cache, deduplicacao e estados de loading/error.

4. **Dependencias nao utilizadas:** 9+ pacotes instalados sem uso (react-hook-form, zod, next-themes, cmdk, etc.). Inflam o bundle desnecessariamente. Devem ser removidos progressivamente.

5. **Componente Report.tsx monolitico:** ~500 linhas com logica de calculo, classificacao, cores e rendering. Deve ser refatorado em sub-componentes antes de adicionar novas secoes (CTA).

6. **SidePanel com responsabilidade excessiva:** Acumula layout, navegacao, tabs, exportacao PDF e logout. Deve ser dividido se houver mudancas significativas na navegacao.

### Restricoes de Infraestrutura

1. **Edge Function sem JWT:** A funcao `generate-recommendations` tem `verify_jwt = false`. Deve ser ativado antes de ir para producao para evitar abuso de creditos de IA.

2. **Ausencia de indices no banco:** As tabelas `assessment_snapshots` e `user_assessments` nao possuem indices em `user_id` e `status`. Devem ser criados para performance adequada.

3. **JSONB sem validacao server-side:** Os campos JSONB aceitam qualquer payload. Validacao deve ser implementada minimamente via Edge Function ou database function.

4. **RLS sem acesso admin cross-user:** Nenhuma tabela permite admins verem dados de outros usuarios. Limitacao para dashboard administrativo futuro.

### Restricoes de Seguranca

1. **`.env` commitado no git:** O arquivo `.env` com credenciais Supabase esta no repositorio. Deve ser adicionado ao `.gitignore` imediatamente e as chaves rotacionadas.

2. **Script de terceiros em producao:** O `index.html` carrega `gptengineer.js` de CDN externo sem SRI. Risco de supply chain attack. Deve ser removido.

---

## 7. Riscos e Mitigacoes

### Riscos de Produto

| # | Risco | Probabilidade | Impacto | Mitigacao |
|---|-------|--------------|---------|-----------|
| R1 | **Perda de dados do cliente** ao migrar de localStorage para Supabase | Media | Critico | Implementar migracao gradual: ler de ambas as fontes durante transicao; manter localStorage como fallback por 30 dias |
| R2 | **Qualidade das recomendacoes de IA** insuficiente para justificar R$197 | Media | Alto | Testar extensivamente com dados reais de 5+ empresas antes do lancamento; refinar prompts da Edge Function; ter fallback para templates melhorados |
| R3 | **Custo da IA por diagnostico** acima do esperado (> R$5/diagnostico) | Baixa | Medio | Monitorar consumo; o modelo Gemini Flash e de baixo custo; cachear recomendacoes ja geradas |
| R4 | **Perguntas sem texto** nao serem preenchidas a tempo por falta de domain expert | Media | Alto | Priorizar as 15 perguntas vazias como primeira tarefa; se necessario, usar IA para gerar textos iniciais e revisar com domain expert |
| R5 | **Cliente nao entende o valor** e pede reembolso | Media | Medio | Investir na experiencia pos-diagnostico (relatorio bonito, recomendacoes uteis, CTA claro); considerar satisfacao garantida |

### Riscos Tecnicos

| # | Risco | Probabilidade | Impacto | Mitigacao |
|---|-------|--------------|---------|-----------|
| R6 | **Regressao ao refatorar useAssessment/useAssessmentDB** | Alta | Critico | Escrever testes para o fluxo atual ANTES de refatorar; validar com testes manuais extensivos |
| R7 | **Edge Function de IA indisponivel** em producao | Baixa | Alto | Implementar fallback: se IA falhar, usar templates melhorados como plano B; cache de recomendacoes |
| R8 | **Performance do PDF** com conteudo extenso | Media | Medio | Usar lazy loading para jsPDF/html2canvas; testar com diagnosticos completos (10 departamentos, 66 perguntas) |
| R9 | **Conflito de dados** entre localStorage e banco durante transicao | Media | Alto | Definir regra clara: banco tem prioridade; localStorage e apenas cache; timestamp de ultima atualizacao como desempate |
| R10 | **Credenciais expostas no .env** serem exploradas | Baixa | Critico | Corrigir .gitignore IMEDIATAMENTE; rotacionar chaves; usar apenas anon key no frontend (ja e o caso) |

### Riscos de Negocio

| # | Risco | Probabilidade | Impacto | Mitigacao |
|---|-------|--------------|---------|-----------|
| R11 | **CTA nao converte** (< 5% de cliques) | Media | Alto | A/B testar posicionamento e texto do CTA; personalizar com dados do diagnostico; testar diferentes canais (WhatsApp vs. formulario) |
| R12 | **Tempo de desenvolvimento** excede estimativa | Media | Medio | Priorizar rigorosamente MUST HAVE; cortar SHOULD HAVE se necessario; entregar incrementalmente |

---

## 8. Sugestao de Cronograma

### Fase 1: Fundacao (Semana 1-2)

**Objetivo:** Corrigir problemas criticos que bloqueiam a experiencia basica.

| Dia | Tarefa | Epico |
|-----|--------|-------|
| D1 | Corrigir `.gitignore` (adicionar `.env`), limpar `index.html` (meta tags, script GPT), remover `App.css` orfao | E5 |
| D1 | Corrigir item duplicado "3.1" no Comercial, remover avaliacoes pre-preenchidas | E1 |
| D1 | Corrigir `isLastQuestion` para calculo dinamico real | E1 |
| D2-D3 | Preencher textos das 15 perguntas vazias (com domain expert) | E1 |
| D3-D4 | Configurar Vitest + escrever testes para `scoreCalculator.ts` | E1 |
| D4-D7 | Migrar storage primario para Supabase: refatorar `useAssessment`, `useAssessmentDB`, `scoreCalculator` | E1 |
| D7-D8 | Criar migrations de banco: indices, partial unique index, CHECK constraint de score | E1 |
| D8-D9 | Garantir Dashboard, Relatorio e Departamento leiam do banco como fallback | E1 |
| D9-D10 | Corrigir `ProgressHeader` para informacao consistente; feedback visual ao salvar | E1 |

**Entrega da Fase 1:** Diagnostico funcional com dados persistidos no banco, perguntas completas, navegacao correta.

### Fase 2: Valor de IA (Semana 2-3)

**Objetivo:** Ativar recomendacoes reais de IA e criar o funil de conversao.

| Dia | Tarefa | Epico |
|-----|--------|-------|
| D11 | Ativar `verify_jwt = true` na Edge Function | E2 |
| D11-D12 | Refatorar `useRecommendations.tsx` para chamar Edge Function real | E2 |
| D12-D13 | Integrar recomendacoes de IA no Relatorio e Plano de Acao | E2 |
| D13 | Tratamento de erros e loading states na geracao de recomendacoes | E2 |
| D14 | Implementar secao CTA no final do Relatorio (design + funcionalidade) | E3 |
| D14-D15 | Implementar card CTA no Dashboard (pos-diagnostico) | E3 |
| D15 | Testar recomendacoes de IA com 3-5 diagnosticos reais completos | E2 |

**Entrega da Fase 2:** Diagnostico com recomendacoes reais de IA e CTA para especialista.

### Fase 3: Polimento (Semana 3-4)

**Objetivo:** Entregar o produto com qualidade profissional percebida.

| Dia | Tarefa | Epico |
|-----|--------|-------|
| D16-D17 | Implementar exportacao real de PDF no Relatorio (conectar `exportToPdf`) | E4 |
| D17-D18 | Garantir que o PDF inclui CTA, recomendacoes de IA, e branding | E4 |
| D18-D19 | Limpeza de dados hardcoded: remover `useDepartmentData` ficticios, `evolutionData.ts` | E5 |
| D19 | Centralizar configuracao de departamentos em arquivo unico | E5 |
| D19-D20 | Renomear componentes mal nomeados (`CustomerRequests`) e remover dependencias nao utilizadas | E5 |
| D20 | Testes manuais do fluxo completo: cadastro -> diagnostico -> resultado -> PDF -> CTA | Todos |

**Entrega da Fase 3:** Produto pronto para comercializacao com experiencia profissional completa.

### Fase 4 (Opcional): Extras (Semana 4+)

| Tarefa | Epico |
|--------|-------|
| Envio de relatorio por email (Edge Function + Resend) | E6 |
| Exportacao de departamento individual como PDF | E4 |
| Testes e2e com Playwright para fluxo completo | Qualidade |
| Code splitting por rota (React.lazy) | Performance |
| Lazy loading de jsPDF/html2canvas | Performance |
| AuthContext para centralizar autenticacao | Performance |

### Resumo do Cronograma

| Fase | Duracao | Entregavel Principal |
|------|---------|---------------------|
| Fase 1: Fundacao | 10 dias uteis | Diagnostico confiavel com dados no banco e perguntas completas |
| Fase 2: Valor de IA | 5 dias uteis | Recomendacoes reais de IA + CTA para especialista |
| Fase 3: Polimento | 5 dias uteis | PDF profissional + limpeza de dados ficticios |
| **Total MUST + SHOULD** | **~20 dias uteis (4 semanas)** | **Produto pronto para venda a R$197** |
| Fase 4: Extras | Sob demanda | Email, testes e2e, performance |

---

## Apendice A: Inventario de Perguntas a Completar

| Departamento | Item | Titulo Existente | Status |
|-------------|------|-----------------|--------|
| Marketing | 4.4 | - | Sem texto de pergunta |
| Marketing | 4.5 | Investimento em midia | Sem texto de pergunta |
| Marketing | 4.6 | - | Sem texto de pergunta |
| Marketing | 4.7 | - | Sem texto de pergunta |
| Tecnologia | 2.5 | - | Sem texto de pergunta |
| Tecnologia | 2.6 | - | Sem texto de pergunta |
| Comercial | 3.1 | Meta de Vendas / Indicadores | Item duplicado -- renumerar segundo para 3.10 |
| Comercial | 3.2 | - | Parcialmente incompleto |
| Comercial | 3.5 | - | Parcialmente incompleto |
| Comercial | 3.8 | - | Parcialmente incompleto |
| Comercial | 3.9 | - | Parcialmente incompleto |
| Contabil | 8.4 | - | Sem texto de pergunta |
| Contabil | 8.5 | - | Sem texto de pergunta |
| Contabil | 8.6 | - | Sem texto de pergunta |
| Fiscal | 7.4 | - | Sem texto de pergunta |

## Apendice B: Estrutura da Edge Function de IA (Existente)

A Edge Function `generate-recommendations` ja esta implementada em `supabase/functions/generate-recommendations/index.ts` e funciona da seguinte forma:

1. Recebe `departmentName` e `criticalItems` via POST
2. Monta prompt de sistema (consultor de gestao empresarial) e prompt de usuario (itens criticos)
3. Chama `ai.gateway.lovable.dev` com modelo `google/gemini-3-flash-preview`
4. Retorna JSON com recomendacoes por item ID

**Alteracoes necessarias:**
- Ativar `verify_jwt = true` no `supabase/config.toml`
- Considerar expandir o prompt para incluir contexto do gate (departamento estruturado vs. parcial vs. inexistente)
- Considerar adicionar o score geral como contexto adicional

## Apendice C: Mapa de Arquivos Impactados por Epico

| Epico | Arquivos Principais |
|-------|-------------------|
| E1 - Fluxo Core | `useAssessment.ts`, `useAssessmentDB.ts`, `scoreCalculator.ts`, `OngoingAssessment.tsx`, `DashboardContent.tsx`, `Report.tsx`, `Department.tsx`, arquivos `data/questions/*.ts` |
| E2 - IA Real | `useRecommendations.tsx`, `supabase/config.toml`, `Report.tsx` |
| E3 - CTA | `Report.tsx`, `DashboardContent.tsx`, `exportToPdf.ts` |
| E4 - PDF | `Report.tsx`, `exportToPdf.ts`, `Department.tsx` |
| E5 - Limpeza | `index.html`, `useDepartmentData.ts`, `evolutionData.ts`, `CustomerRequests.tsx`, `App.css`, `DashboardContent.tsx`, `DepartmentsList.tsx`, `EvolutionContent.tsx`, `questions/index.ts` |
| E6 - Email | Nova Edge Function, `Report.tsx` |

---

*Documento gerado por Morgan (Product Manager Agent) em 18/02/2026.*
*Baseado na analise dos documentos de Phase 0: brownfield-assessment.md (Atlas), architecture-review.md (Aria), database-audit.md (Dara).*
