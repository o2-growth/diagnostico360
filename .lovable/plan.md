
# Replicar CTA "Falar com Especialista" nas paginas de area

## O que muda

Adicionar a mesma tarja/banner de CTA que existe no dashboard ("Transforme seus resultados em acao" + botao "Falar com Especialista") no final de cada pagina de departamento (`/department/:id`).

## Abordagem

### 1. Extrair componente reutilizavel

Criar um novo componente `src/components/CtaBanner.tsx` que encapsula toda a logica e visual do CTA:
- Recebe o `overallScore` como prop (ou calcula internamente via `calculateScores()`)
- Inclui o card com gradiente verde, icone, texto com prova social (+2000 empresas), e o botao animado com link para WhatsApp
- Inclui o `<style>` do keyframe `cta-glow`

### 2. Usar no Dashboard

Substituir o bloco inline atual em `DashboardContent.tsx` pelo novo componente `<CtaBanner />`.

### 3. Usar na pagina de Departamento

Adicionar `<CtaBanner />` no final do conteudo da pagina `Department.tsx`, logo apos o fechamento do componente `<Tabs>`.

## Detalhes Tecnicos

### Novo arquivo: `src/components/CtaBanner.tsx`
- Importa `MessageCircle` de `lucide-react` e `calculateScores` de `@/utils/scoreCalculator`
- Calcula `overallScore` internamente
- Renderiza o card CTA completo (mesmo JSX que esta em `DashboardContent.tsx` linhas 99-140)
- So renderiza se `overallScore > 0`

### Arquivo modificado: `src/components/dashboard/DashboardContent.tsx`
- Remove o bloco CTA inline (linhas 97-140) e o `<style>` associado
- Substitui por `<CtaBanner />`
- Remove import de `MessageCircle` se nao for mais usado

### Arquivo modificado: `src/pages/Department.tsx`
- Importa `<CtaBanner />`
- Adiciona `<CtaBanner />` apos o `</Tabs>`, dentro do `<div className="p-8">`
