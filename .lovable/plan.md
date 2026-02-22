
# Dar Vida a Landing Page -- Animacoes e Efeitos Interativos

## Visao Geral

Transformar a LP de estatica para dinamica com 5 camadas de movimento: (1) particulas flutuantes no fundo que reagem ao mouse, (2) elementos que aparecem ao rolar a pagina (scroll-reveal), (3) micro-interacoes nos cards e botoes, (4) contadores animados nos numeros, e (5) efeito parallax sutil no hero.

Tudo feito com CSS puro + hooks React nativos -- sem dependencias externas como framer-motion.

---

## Camadas de Animacao

### 1. Particulas Flutuantes com Interacao do Mouse (Hero)

Um componente `FloatingParticles` que renderiza ~20 circulos verdes translucidos (`#7EBF8E`) flutuando lentamente. Ao mover o mouse, as particulas mais proximas se afastam suavemente (efeito repulsao).

- Implementado com `useRef` + `requestAnimationFrame` em um `<canvas>`
- Responsivo: desabilita em telas menores que 768px
- Performance: usa `will-change: transform` e `pointer-events: none`

### 2. Scroll-Reveal (Intersection Observer)

Criar um hook `useScrollReveal` que aplica animacoes de entrada conforme elementos entram no viewport:

- Sections: fade-in + translateY de 40px para 0
- Cards (areas, steps, testimonials): staggered entry -- cada card entra 100ms depois do anterior
- Deliverables (Results): slide-in da esquerda

Implementacao com `IntersectionObserver` nativo e classes CSS de transicao.

### 3. Contadores Animados (Count-Up)

Os numeros do hero (+2.000, NPS 88, +R\$2BI) e o score mockup (78%) animam de 0 ate o valor final quando entram no viewport.

- Hook `useCountUp` com `requestAnimationFrame`
- Duracao: ~2 segundos com easing cubic-bezier
- Ativa apenas quando o elemento esta visivel (Intersection Observer)

### 4. Glow que Segue o Mouse (Hero + Pricing)

O radial glow verde do hero acompanha sutilmente a posicao do mouse com um delay suave (lerp). O mesmo efeito no card de pricing -- um brilho na borda que segue o cursor.

- `onMouseMove` no container com `useState` para posicao
- CSS `radial-gradient` atualizado via `style` inline
- Transicao suave com CSS `transition` de 300ms

### 5. Micro-Interacoes Aprimoradas

- **Botao CTA principal**: pulse glow continuo + scale no hover
- **Cards de area**: rotate3d sutil no hover (tilt effect de 2-3 graus)
- **Social proof badges**: marquee infinito horizontal (auto-scroll)
- **Scroll indicator do hero**: bounce animation suave

---

## Detalhes Tecnicos

### Novos Arquivos

| Arquivo | Descricao |
|---|---|
| `src/components/landing/FloatingParticles.tsx` | Canvas de particulas com repulsao ao mouse |
| `src/hooks/useScrollReveal.ts` | Hook para animacoes de entrada no scroll |
| `src/hooks/useCountUp.ts` | Hook para animacao de numeros |
| `src/hooks/useMousePosition.ts` | Hook para tracking de posicao do mouse |

### Arquivos Modificados

| Arquivo | Mudancas |
|---|---|
| `src/components/landing/LPHero.tsx` | Adicionar FloatingParticles, mouse glow, count-up nos stats, bounce no scroll indicator |
| `src/components/landing/LPSocialProof.tsx` | Marquee auto-scroll infinito nos badges |
| `src/components/landing/LPHowItWorks.tsx` | Scroll-reveal staggered nos cards de steps |
| `src/components/landing/LPAreas.tsx` | Scroll-reveal staggered + tilt hover nos cards |
| `src/components/landing/LPResults.tsx` | Scroll-reveal + count-up nas barras de progresso (animam de 0 ao valor) |
| `src/components/landing/LPTestimonials.tsx` | Scroll-reveal staggered |
| `src/components/landing/LPPricing.tsx` | Mouse glow na borda do card + scroll-reveal |
| `src/components/landing/LPFAQ.tsx` | Scroll-reveal |
| `src/components/landing/LPFooter.tsx` | Scroll-reveal no CTA final |
| `src/index.css` | Adicionar keyframes: bounce, marquee, glow-pulse |

### Performance

- Canvas de particulas usa `requestAnimationFrame` com cleanup no unmount
- Intersection Observer com `threshold: 0.15` e `triggerOnce: true`
- Todas as animacoes respeitam `prefers-reduced-motion`
- `will-change` apenas durante a animacao, removido apos completar
