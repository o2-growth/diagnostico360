
# Melhorar CTA "Falar com Especialista"

## O que muda

O card CTA atual e discreto demais -- fundo quase transparente, botao estatico sem animacao. Vamos tornar mais chamativo e convidativo:

### Visual do Card
- Fundo com gradiente mais vibrante e visivel (opacidade maior)
- Borda com brilho sutil esverdeado
- Icone de WhatsApp ou MessageCircle ao lado do titulo para contexto visual

### Botao "Falar com Especialista"
- Adicionar animacao de pulso sutil (`animate-pulse` ou custom) para atrair o olhar
- Sombra colorida (glow verde) ao redor do botao
- Icone de WhatsApp (MessageCircle do lucide) dentro do botao
- Efeito hover mais pronunciado com scale e brilho
- Tamanho ligeiramente maior (padding e fonte)

### Texto
- Headline mais persuasiva: "Transforme seus resultados em acao"
- Subtexto com senso de urgencia: "Nossos especialistas ja ajudaram +200 empresas..."

## Detalhes Tecnicos

### Arquivo a modificar

**`src/components/dashboard/DashboardContent.tsx`**

- Importar `MessageCircle` do `lucide-react`
- Atualizar o card CTA (linhas 97-127):
  - Gradiente de fundo com opacidade ~0.15 ao inves de 0.08
  - Borda mais visivel com cor verde
  - Headline atualizada com icone
  - Botao com classes de animacao, sombra glow, icone e tamanho maior
  - Adicionar keyframe CSS inline ou classe para pulso customizado no botao
