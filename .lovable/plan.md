

## Problemas identificados

Dois problemas separados:

### 1. "Link inválido" na página de reset de senha
A página `/reset-password` mostra "Link inválido" porque o Supabase processa o token da URL **antes** do componente React montar. Quando o componente checa `window.location.hash`, o hash já foi consumido e o evento `PASSWORD_RECOVERY` pode ter disparado antes do listener ser registrado.

**Correção:** Ao montar, também verificar se já existe uma sessão ativa (o que indica que o link de recovery funcionou e logou o usuário automaticamente). Adicionar um estado de loading inicial enquanto verifica.

### 2. "You do not have access to this project"
Isso acontece porque o link de recuperação redireciona para a **URL de preview do Lovable** (`5efc5336...lovableproject.com`), que é restrita a membros do projeto. Usuários finais precisam usar a **URL publicada**: `https://diagnostico360.lovable.app`.

**Correção:** Você precisa acessar o app pela URL publicada (`https://diagnostico360.lovable.app/auth`) e não pela URL de preview. Ao usar a URL publicada, o link de recovery vai redirecionar para a URL correta.

---

## Alterações técnicas

### `src/pages/ResetPassword.tsx`
- Adicionar estado `checking = true` inicial
- No `useEffect`, checar `supabase.auth.getSession()` — se existe sessão, mostrar o formulário de nova senha
- Também checar hash e query params da URL por `type=recovery`
- Só mostrar "Link inválido" depois de confirmar que **não** há sessão e **não** há token de recovery

Isso resolve o problema de timing onde o Supabase já processou o token antes do React montar.

