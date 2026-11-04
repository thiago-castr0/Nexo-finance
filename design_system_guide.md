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
    *   Valores Financeiros: Utilizar recursos de numerais tabulares (`tabular-nums`) para que os números fiquem perfeitamente alinhados verticalmente em tabelas.

## 3. Cores (Paleta Oficial — Escalas de 5 Níveis + Neutros)

### 3.1. Cores de Marca (Brand)
*   **RED (Primária — Identidade e Destaques da Marca):**
    *   `500` (Base): `#DC2626`
    *   `400`: `#E85950`
    *   `300`: `#EE7870`
    *   `200`: `#F59B92`
    *   `100` (Tint): `#FACBC2`
*   **PURPLE (Secundária — IA, OCR e Detalhes Visuais):**
    *   `500` (Base): `#692296`
    *   `400`: `#7E32B5`
    *   `300`: `#A466D1`
    *   `200`: `#C59BE3`
    *   `100` (Tint): `#DEC5EF`

### 3.2. Cores Semânticas (Ações e Feedbacks Financeiros)
*   **ALERT (Atenção, Pendências e Faturas a Vencer):**
    *   `500` (Base): `#EA920F`
    *   `400`: `#EDAD12`
    *   `300`: `#ECC023`
    *   `200`: `#ECD54A`
    *   `100` (Tint): `#EDE08D`
*   **SUCCESS (Positivo, Receitas, Entradas e Saldo Positivo):**
    *   `500` (Base): `#0CB853`
    *   `400`: `#13BD5B`
    *   `300`: `#46C87D`
    *   `200`: `#7BD6A0`
    *   `100` (Tint): `#BCE5CB`
*   **ERROR / DANGER (Negativo, Despesas, Saídas, Erros e Exclusão):**
    *   `500` (Base): `#DF2929`
    *   `400`: `#E54541`
    *   `300`: `#EC6862`
    *   `200`: `#F4948C`
    *   `100` (Tint): `#F9C5BD`
*   **INFO (Informativo, Links, Lançamentos Manuais e Ações Neutras):**
    *   `500` (Base): `#2572CE`
    *   `400`: `#448BDE`
    *   `300`: `#65A2E6`
    *   `200`: `#8CB9EB`
    *   `100` (Tint): `#BCD6F2`

### 3.3. Cores Neutras (Preto, Tons de Cinza e Branco)
*   **BLACK & DARK GRAYS (Textos e Dark Mode):**
    *   `Black (950)`: `#09090B` (Fundo principal Dark Mode)
    *   `Gray 900`: `#18181B` (Texto primário em alto contraste e superfície Dark Mode)
    *   `Gray 700`: `#3F3F46` (Texto secundário forte e ícones ativos)
*   **MID & LIGHT GRAYS (Textos de Apoio, Bordas 1px e Divisores):**
    *   `Gray 500`: `#71717A` (Texto auxiliar, legendas e placeholders)
    *   `Gray 300`: `#D4D4D8` (Bordas em estado hover e controles inativos)
    *   `Gray 200`: `#E4E4E7` (Bordas finas padrão `1px solid` e linhas divisórias)
    *   `Gray 100`: `#F4F4F5` (Background off-white clean da aplicação no Light Mode)
*   **WHITE (Superfícies Limpas):**
    *   `White (0)`: `#FFFFFF` (Fundo puro de Cards, Inputs, Tabelas e Modais no Light Mode)

## 4. Iconografia
*   **Biblioteca Oficial:** **Lucide Icons**.
*   **Regras de Uso:** Ícones vazados, mantendo espessura de linha padrão (`strokeWidth={1.5}`).

## 5. Componentes Base
### 5.1. Botões (Buttons)
*   **Estilo Padrão:** *Outline* (Vazados). Fundo transparente com borda colorida correspondente à ação (`500`).
*   **Estrutura:** Ícone (Lucide) alinhado à esquerda + Texto.
*   **Shape:** Arredondados (ex: `rounded-full` ou `rounded-lg`).
*   **Interação:** No `hover`, o botão ganha um preenchimento sutil usando o nível `100` da respectiva escala (ex: `#FACBC2` / `25%` de opacidade) para indicar interatividade sem perder o aspecto clean.

### 5.2. Inputs e Formulários
*   **Estilo Padrão:** Bordas bem finas (`1px solid #E4E4E7`), fundo `#FFFFFF`, sem sombras pesadas.
*   **Shape:** Arredondados (`rounded-lg`).
*   **Estados:** 
    *   `Focus`: Borda muda para a cor primária (`#DC2626`) ou info (`#2572CE`) com um *ring* suave no tom `200`/`100`.
    *   `Error`: Borda `ERROR / DANGER 500` (`#DF2929`) acompanhada de ícone de alerta e texto de apoio.
*   **Clean Look:** O interior do input deve ser totalmente limpo, destacando apenas o placeholder (`#71717A`) ou o texto digitado (`#18181B`) na fonte Inter.
