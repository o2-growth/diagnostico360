

# Ajustar posição do badge "Melhor custo-benefício"

O badge está posicionado com `absolute -top-4` e sobrepõe o primeiro item da lista de benefícios.

## Alteração

### `src/components/landing/LPPricing.tsx`
- Adicionar `pt-8` (padding-top) no container interno (`relative z-10`) para criar espaço abaixo do badge, evitando sobreposição com o primeiro benefício.

