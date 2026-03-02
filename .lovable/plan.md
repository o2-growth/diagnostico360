

# Adicionar botão "Já comprei" na Landing Page

## Alterações

### `src/components/landing/LPNavbar.tsx`
- Adicionar botão **"Já comprei"** (ou "Fazer Diagnóstico") com estilo outline (borda branca/verde, fundo transparente) ao lado do CTA verde "Começar Agora"
- Ao clicar, navega para `/auth` via `useNavigate`

### `src/components/landing/LPHero.tsx`
- Adicionar um terceiro botão ou link abaixo dos CTAs existentes, tipo: **"Já comprou? Faça login aqui"**
- Navega para `/auth`

Ambos os botões servem como ponto de entrada para quem já pagou e precisa acessar a plataforma com suas credenciais.

