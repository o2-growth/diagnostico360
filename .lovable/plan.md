Plano para corrigir o erro ao cadastrar cliente

O erro exibido indica que a interface já está tentando usar a tabela `clients`, mas ela ainda não existe no banco de dados do Lovable Cloud publicado/ativo. Também confirmei que as colunas `client_id` ainda não existem em `user_assessments` e `assessment_snapshots`. Ou seja: o código da funcionalidade foi criado, mas a migração de banco ainda precisa ser aplicada no ambiente Cloud.

O que vou corrigir:

1. Aplicar a estrutura de banco para clientes dos CFOs
   - Criar a tabela `clients` com dados do cliente: nome, empresa, e-mail, telefone, observações, dono/CFO, datas de criação e atualização.
   - Ativar segurança por usuário, para que cada CFO veja apenas os próprios clientes.
   - Criar políticas de leitura, criação, edição e exclusão somente para o dono do cliente.

2. Vincular diagnósticos aos clientes
   - Adicionar `client_id` em `user_assessments`.
   - Adicionar `client_id` em `assessment_snapshots`.
   - Criar índices para melhorar a busca por cliente.
   - Manter compatibilidade com diagnósticos antigos, deixando `client_id` inicialmente opcional para não quebrar dados existentes.

3. Proteger a consistência dos dados
   - Criar uma validação no banco para impedir que um diagnóstico seja salvo em cliente de outro CFO.
   - Garantir que o histórico/evolução continue isolado por cliente selecionado.

4. Ajustar pequenos pontos de estabilidade na interface
   - Melhorar a mensagem de erro caso o cadastro falhe.
   - Corrigir o aviso de acessibilidade do modal de novo cliente adicionando descrição ao diálogo.

5. Validar após a correção
   - Conferir se a tabela `clients` existe no Cloud.
   - Conferir se `client_id` existe nas tabelas de diagnóstico.
   - Testar o fluxo: login Google → Novo Cliente → selecionar cliente → iniciar diagnóstico.
   - Rodar build para garantir que a aplicação continua funcionando.

Observação: os erros de `sentry`/`source map 404` que aparecem no console da imagem não são a causa do problema. O erro real é: `Could not find the table 'public.clients' in the schema cache`, causado pela ausência da tabela no banco.