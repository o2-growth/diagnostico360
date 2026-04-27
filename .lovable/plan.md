Plano para organizar o “teste rápido” e corrigir duplicidade

1. Separar teste rápido dos clientes reais
- O botão “Preencher Teste Rápido” não usará mais o cliente que estiver selecionado.
- Ao clicar, o sistema vai criar ou reutilizar automaticamente um cliente fictício da própria conta do CFO, por exemplo: “Cliente Fictício - Teste Diagnóstico 360”.
- Esse cliente ficará salvo na carteira daquele usuário, igual aconteceria para qualquer CFO usando a plataforma.

2. Garantir apenas 1 diagnóstico de teste por clique
- Corrigir a função atual de teste rápido, que hoje insere snapshot sem `client_id` e pode gerar duplicação/resultado repetido.
- O fluxo passará a:
  - localizar/criar o cliente fictício;
  - selecionar esse cliente no `localStorage`;
  - limpar dados locais do diagnóstico anterior;
  - gerar respostas simuladas;
  - salvar exatamente um snapshot vinculado ao cliente fictício;
  - recarregar/ir para o dashboard já com o resultado desse cliente de teste.

3. Evitar duplicidade visual no histórico
- Adicionar proteção no botão para impedir duplo clique enquanto está preenchendo.
- Ajustar a lista de históricos, se necessário, para mostrar só registros vinculados ao cliente selecionado e evitar registros antigos sem cliente aparecendo junto.

4. Refletir o comportamento para todos os CFOs
- A correção será feita no fluxo padrão da plataforma, não apenas no seu usuário.
- Cada CFO que usar a ferramenta terá seu próprio cliente fictício de teste dentro da própria conta, isolado dos clientes reais e dos outros usuários.

5. Opcional de limpeza dos dados já duplicados
- Identifiquei no banco um cliente “Empresa teste 01” com 3 diagnósticos recentes: dois com score 61% e um com 38%.
- Se você aprovar, posso incluir uma migração/ajuste de limpeza para remover duplicados antigos desse caso específico, mantendo apenas o diagnóstico mais recente por resultado duplicado. Se preferir, deixo os dados antigos intactos e apenas corrijo o comportamento daqui para frente.

Detalhes técnicos
- Arquivos principais a alterar:
  - `src/components/settings/SettingsContent.tsx`
  - `src/utils/sampleAssessmentData.ts` ou novo utilitário para cliente fictício/teste
  - possivelmente `src/utils/clientAssessmentState.ts`
- O insert em `assessment_snapshots` passará a sempre enviar `client_id` no teste rápido.
- Usarei `upsert`/busca por nome fixo e `owner_id` para não criar vários clientes fictícios por usuário.
- Não vou alterar os arquivos auto-gerados da integração do banco.