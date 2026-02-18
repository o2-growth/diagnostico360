

## Tornar andrey.lopes@o2inc.com.br admin automaticamente

### Problema
A migration atual insere o role admin buscando o usuario na tabela `auth.users`. Como `andrey.lopes@o2inc.com.br` ainda nao tem conta, o INSERT nao encontra nada. Precisamos de um mecanismo que atribua admin automaticamente quando esse email se cadastrar.

### Solucao

**1. Criar trigger que atribui admin ao cadastro**

Uma nova migration SQL que:
- Cria uma funcao `handle_admin_assignment()` que roda apos um novo usuario ser inserido em `auth.users`
- Verifica se o email do novo usuario esta numa lista de emails admin (`growth@o2inc.com.br`, `andrey.lopes@o2inc.com.br`)
- Se sim, insere automaticamente uma linha em `user_roles` com role `admin`
- Anexa um trigger na tabela `auth.users` que dispara essa funcao

**2. Migration SQL**

```text
CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email IN ('growth@o2inc.com.br', 'andrey.lopes@o2inc.com.br') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on auth.users for new signups
CREATE OR REPLACE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_on_signup();
```

Assim, quando `andrey.lopes@o2inc.com.br` criar a conta (via Google ou email), o trigger automaticamente atribui o role admin. Funciona tambem para qualquer futuro admin — basta adicionar o email na lista dentro da funcao.

### Arquivos alterados
- Nova migration SQL (trigger + funcao)

### Nenhuma alteracao de codigo frontend necessaria
O hook `useAuth` ja busca o role de `user_roles` e expoe `isAdmin`. Vai funcionar automaticamente.
