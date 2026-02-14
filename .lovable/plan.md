

## Ajuste do botao "Voltar" na pagina de area

### Problema
O botao de voltar na pagina de detalhe da area (ex: `/department/contabil`) navega para a pagina inicial (`/`) em vez de voltar para a pagina de Resultado (`/dashboard`).

### Solucao
Alterar a navegacao do botao de voltar em `src/pages/Department.tsx` para ir para `/dashboard` com o tab `dashboard` ativo, assim o usuario volta diretamente para a pagina de Resultado onde estao os acelerometros.

### Detalhe tecnico
- Arquivo: `src/pages/Department.tsx`, linha 113
- De: `navigate('/', { state: { activeTab: 'areas' } })`
- Para: `navigate('/dashboard', { state: { activeTab: 'dashboard' } })`

Isso garante que ao clicar no botao voltar, o usuario retorna para a pagina de Resultado com os cards de cada area visiveis.

