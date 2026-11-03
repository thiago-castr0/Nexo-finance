# File: design_system_guide.md
# Style Guide: Nexo Finance

## 1. Identidade Visual e Vibe
*   **Estilo:** Moderno, Clean e Minimalista.
*   **Formas:** Arredondadas (Soft corners). Interfaces amigáveis e leves.
*   **Bordas:** Finas e delicadas (1px solid), promovendo um visual "light".

## 2. Tipografia
*   **Fonte Principal:** **Inter** (Google Fonts).
*   **Uso:** 
    *   Títulos (Headings): Pesos `Semibold` (600) ou `Bold` (700) com tracking levemente ajustado.
    *   Corpo de Texto (Body): Peso `Regular` (400).
    *   Valores Financeiros: Utilizar recursos de numerais tabulares (tabular-nums) para que os números fiquem perfeitamente alinhados verticalmente em tabelas.

## 3. Cores (Paleta)
*   **Cores de Marca:**
    *   **Primária:** Vermelho (Red). Usado para destaques sutis de marca, logos e elementos de identidade.
    *   **Secundária:** Roxo (Purple). Usado para detalhes, ilustrações e apoios visuais.
*   **Cores Semânticas (Ações e Feedbacks):**
    *   **Positivo / Entrada:** Verde (Green) - Sucesso, receitas, saldo positivo.
    *   **Negativo / Saída / Destrutivo:** Vermelho (Red) - Despesas, erros, exclusão.
    *   **Atenção:** Amarelo (Yellow) - Alertas, pendências, faturas a vencer.
    *   **Informativo / Ações Neutras:** Azul (Blue) - Tooltips, informações adicionais, links.
*   **Cores Neutras (Backgrounds e Textos):**
    *   Fundos limpos (Branco/Off-white no Light Mode, Cinza muito escuro no Dark Mode).
    *   Textos em alto contraste, mas evitando preto puro (usar Slate-900 ou Zinc-900).

## 4. Iconografia
*   **Biblioteca Oficial:** **Lucide Icons**.
*   **Regras de Uso:** Ícones vazados, mantendo espessura de linha padrão (`strokeWidth={1.5}`).

## 5. Componentes Base
### 5.1. Botões (Buttons)
*   **Estilo Padrão:** *Outline* (Vazados). Fundo transparente com borda colorida correspondente à ação.
*   **Estrutura:** Ícone (Lucide) alinhado à esquerda + Texto.
*   **Shape:** Arredondados (ex: `rounded-full` ou `rounded-lg`).
*   **Interação:** No `hover`, o botão pode ganhar um preenchimento com opacidade bem baixa (ex: `bg-red-50` no Light Mode) para indicar interatividade sem perder o aspecto clean.

### 5.2. Inputs e Formulários
*   **Estilo Padrão:** Bordas bem finas (`border-width: 1px`), sem sombras pesadas (apenas um `shadow-sm` sutil, se necessário).
*   **Shape:** Arredondados (`rounded-lg`).
*   **Estados:** 
    *   `Focus`: Borda muda para a cor primária (ou azul semântico) com um *ring* suave.
    *   `Error`: Borda vermelha acompanhada de ícone de alerta e texto de apoio.
*   **Clean Look:** O interior do input deve ser totalmente limpo, destacando apenas o placeholder ou o texto digitado na fonte Inter.