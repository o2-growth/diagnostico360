

## Pagina Evolucao funcional com dados reais

### Resumo

Implementar autenticacao (email/senha + Google), banco de dados para armazenar snapshots dos diagnosticos, e conectar a pagina Evolucao a dados reais do usuario.

### Fluxo do usuario

1. Usuario faz cadastro/login (email+senha ou Google)
2. Responde o diagnostico normalmente
3. Ao concluir, o sistema calcula os scores de cada area e salva automaticamente no banco como um "snapshot" com a data atual
4. Na pagina Evolucao, os graficos mostram os snapshots reais ao longo do tempo
5. Cada novo diagnostico concluido gera um novo ponto no grafico

### Mudancas necessarias

**1. Autenticacao**
- Criar pagina `/auth` com formulario de login/cadastro (email+senha)
- Adicionar botao "Login com Google" usando Lovable Cloud managed OAuth
- Proteger rotas: redirecionar para `/auth` se nao estiver logado
- Adicionar botao de logout no SidePanel

**2. Banco de dados (2 tabelas)**

Tabela `profiles`:
- `id` (uuid, FK para auth.users)
- `email` (text)
- `created_at` (timestamp)
- RLS: usuario so ve seu proprio perfil

Tabela `assessment_snapshots`:
- `id` (uuid, PK)
- `user_id` (uuid, FK para profiles)
- `completed_at` (timestamp, default now())
- `overall_score` (integer) -- score geral
- `department_scores` (jsonb) -- ex: `{"financeiro": 75, "tecnologia": 45, ...}`
- RLS: usuario so ve seus proprios snapshots

Trigger para criar profile automaticamente no signup.

**3. Salvar snapshot ao concluir diagnostico**
- No `useAssessment.ts`, quando o diagnostico e concluido (todas as perguntas respondidas):
  - Calcular score de cada area baseado nas respostas do localStorage
  - Inserir um registro na tabela `assessment_snapshots`
  - Score por area: % de perguntas com "EXISTE E FUNCIONA PERFEITAMENTE" ou "EXISTE DE FORMA PADRONIZADA"

**4. Atualizar pagina Evolucao**
- `EvolutionContent.tsx`: buscar snapshots do banco via Supabase client
- Grafico principal (MonthlyChart): cada ponto = `overall_score` de um snapshot, eixo X = data
- Graficos por area: cada ponto = score daquela area no snapshot
- MetricCard: mostrar o score do ultimo snapshot
- Se nao houver dados, mostrar estado vazio com CTA para iniciar diagnostico

### Arquivos novos
- `src/pages/Auth.tsx` -- pagina de login/cadastro
- `src/hooks/useAuth.ts` -- hook de autenticacao
- `src/components/auth/AuthForm.tsx` -- formulario
- `src/components/auth/ProtectedRoute.tsx` -- wrapper de rota protegida

### Arquivos alterados
- `src/App.tsx` -- adicionar rota `/auth` e proteger rotas
- `src/hooks/useAssessment.ts` -- salvar snapshot no banco ao concluir
- `src/components/evolution/EvolutionContent.tsx` -- buscar dados reais
- `src/components/MonthlyChart.tsx` -- receber dados como prop em vez de hardcoded
- `src/components/SidePanel.tsx` -- adicionar botao de logout
- Migracao SQL para criar tabelas, trigger e RLS

### Detalhe tecnico

Estrutura do `department_scores` (jsonb):
```text
{
  "financeiro": 75,
  "tecnologia": 45,
  "planejamento": 35,
  "contabil": 55,
  "controladoria": 40,
  "fiscal": 60,
  "comercial": 70,
  "marketing": 50,
  "societario": 45,
  "capital-humano": 55
}
```

Calculo do score por area:
- Contar perguntas com evaluation = "EXISTE E FUNCIONA PERFEITAMENTE" (peso 100%) ou "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)" (peso 50%)
- Dividir pelo total de perguntas da area
- Multiplicar por 100

Overall score = media dos scores de todas as areas

