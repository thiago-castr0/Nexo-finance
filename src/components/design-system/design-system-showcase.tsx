"use client";

import * as React from "react";
import Link from "next/link";
import {
  Palette,
  MousePointerClick,
  Shapes,
  Copy,
  Check,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  FileUp,
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Info,
  Search,
  SlidersHorizontal,
  Hash,
  Eye,
  Compass,
  Layers,
  Sliders,
  Maximize2,
  Minimize2,
  Zap,
  CheckCircle2,
  Code2,
  Activity,
  LayoutGrid,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch, ThemeSwitch } from "@/components/ui/switch";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedTabs, type TabOption } from "@/components/ui/tabs";
import { GlassPanel, type GlassSurfaceTone } from "@/components/ui/glass-panel";
import { RadialGauge } from "@/components/ui/radial-gauge";
import { StatMetricCard } from "@/components/ui/stat-metric-card";
import { KbdPill } from "@/components/ui/kbd";
import { UserStatusPill } from "@/components/ui/avatar";
import { NotificationBanner } from "@/components/ui/toast-banner";
import { SkeletonGlass } from "@/components/ui/skeleton";
import { FilterChipGroup, type FilterChipOption } from "@/components/ui/filter-chips";
import { GlassTooltip } from "@/components/ui/tooltip";

interface ColorStep {
  step: string;
  hex: string;
  cssVar: string;
  usage: string;
}

interface ColorRow {
  family: string;
  subtitle: string;
  tailwindPrefix: string;
  steps: ColorStep[];
}

const COLOR_MATRIX: ColorRow[] = [
  {
    family: "RED",
    subtitle: "Marca Primária 2TP — Identidade, CTAs principais e foco ativo",
    tailwindPrefix: "brand-red",
    steps: [
      { step: "500", hex: "#DC2626", cssVar: "--nexo-red-500", usage: "Cor base primária / Borda ativa" },
      { step: "400", hex: "#E85950", cssVar: "--nexo-red-400", usage: "Hover intenso / Destaque Dark Mode" },
      { step: "300", hex: "#EE7870", cssVar: "--nexo-red-300", usage: "Ícones / Focus Ring" },
      { step: "200", hex: "#F59B92", cssVar: "--nexo-red-200", usage: "Borda de Box Glass Vermelho" },
      { step: "100", hex: "#FACBC2", cssVar: "--nexo-red-100", usage: "Superfície de Badge / Tint Glass" },
    ],
  },
  {
    family: "PURPLE",
    subtitle: "Marca Secundária 2TP — Inteligência Artificial, OCR e Modo Rascunho",
    tailwindPrefix: "brand-purple",
    steps: [
      { step: "500", hex: "#692296", cssVar: "--nexo-purple-500", usage: "Cor base IA / Fundo Principal" },
      { step: "400", hex: "#7E32B5", cssVar: "--nexo-purple-400", usage: "Hover de ações de IA" },
      { step: "300", hex: "#A466D1", cssVar: "--nexo-purple-300", usage: "Indicadores Vision Scanner" },
      { step: "200", hex: "#C59BE3", cssVar: "--nexo-purple-200", usage: "Borda de Box Glass Roxo" },
      { step: "100", hex: "#DEC5EF", cssVar: "--nexo-purple-100", usage: "Superfície de Badge / Tint Glass" },
    ],
  },
  {
    family: "ALERT",
    subtitle: "Semântica de Atenção — Pendências de revisão e alertas preventivos",
    tailwindPrefix: "semantic-alert",
    steps: [
      { step: "500", hex: "#EA920F", cssVar: "--nexo-alert-500", usage: "Texto e ícone de alerta principal" },
      { step: "400", hex: "#EDAD12", cssVar: "--nexo-alert-400", usage: "Borda de aviso preventivo" },
      { step: "300", hex: "#ECC023", cssVar: "--nexo-alert-300", usage: "Gráfico de atenção moderada" },
      { step: "200", hex: "#ECD54A", cssVar: "--nexo-alert-200", usage: "Borda de rascunho" },
      { step: "100", hex: "#EDE08D", cssVar: "--nexo-alert-100", usage: "Surface de badge de alerta" },
    ],
  },
  {
    family: "SUCCESS",
    subtitle: "Semântica Positiva — Receitas, PIX recebidos e confirmações",
    tailwindPrefix: "semantic-success",
    steps: [
      { step: "500", hex: "#0CB853", cssVar: "--nexo-success-500", usage: "Valores positivos (+ R$) e confirmação" },
      { step: "400", hex: "#13BD5B", cssVar: "--nexo-success-400", usage: "Barras de receita em gráficos" },
      { step: "300", hex: "#46C87D", cssVar: "--nexo-success-300", usage: "Indicador de meta batida" },
      { step: "200", hex: "#7BD6A0", cssVar: "--nexo-success-200", usage: "Borda de card de receita" },
      { step: "100", hex: "#BCE5CB", cssVar: "--nexo-success-100", usage: "Badge verde sólido" },
    ],
  },
  {
    family: "ERROR / DANGER",
    subtitle: "Semântica Crítica — Despesas (- R$), exclusões e erros de validação",
    tailwindPrefix: "semantic-danger",
    steps: [
      { step: "500", hex: "#DF2929", cssVar: "--nexo-danger-500", usage: "Valores negativos (- R$) e erro crítico" },
      { step: "400", hex: "#E54541", cssVar: "--nexo-danger-400", usage: "Barras de despesa em gráficos" },
      { step: "300", hex: "#EC6862", cssVar: "--nexo-danger-300", usage: "Alerta de estouro de orçamento" },
      { step: "200", hex: "#F4948C", cssVar: "--nexo-danger-200", usage: "Borda de input inválido" },
      { step: "100", hex: "#F9C5BD", cssVar: "--nexo-danger-100", usage: "Badge de erro sólido" },
    ],
  },
  {
    family: "INFO",
    subtitle: "Semântica Informativa — Metadados, filtros ativos e dicas de sistema",
    tailwindPrefix: "semantic-info",
    steps: [
      { step: "500", hex: "#2572CE", cssVar: "--nexo-info-500", usage: "Links técnicos e badges informativos" },
      { step: "400", hex: "#448BDE", cssVar: "--nexo-info-400", usage: "Gráficos comparativos neutros" },
      { step: "300", hex: "#65A2E6", cssVar: "--nexo-info-300", usage: "Ícones de ajuda e suporte" },
      { step: "200", hex: "#8CB9EB", cssVar: "--nexo-info-200", usage: "Borda de tooltip informativo" },
      { step: "100", hex: "#BCD6F2", cssVar: "--nexo-info-100", usage: "Badge informativo sólido" },
    ],
  },
];

const NEUTRAL_PALETTE = [
  { name: "BLACK", hex: "#09090B", cssVar: "--nexo-black", role: "Fundo espacial Dark Mode / Contraste máximo", textLight: true },
  { name: "GRAY 900", hex: "#18181B", cssVar: "--nexo-gray-900", role: "Texto Primário Nítido / Superfície Dark", textLight: true },
  { name: "GRAY 700", hex: "#3F3F46", cssVar: "--nexo-gray-700", role: "Texto Secundário Forte / Subtítulos", textLight: true },
  { name: "GRAY 500", hex: "#71717A", cssVar: "--nexo-gray-500", role: "Texto Muted / Labels / Metadados", textLight: true },
  { name: "GRAY 300", hex: "#D4D4D8", cssVar: "--nexo-gray-300", role: "Bordas Sólidas de Botões Neutros", textLight: false },
  { name: "GRAY 200", hex: "#E4E4E7", cssVar: "--nexo-gray-200", role: "Borda Estrutural 1px Solid", textLight: false },
  { name: "GRAY 100", hex: "#F4F4F5", cssVar: "--nexo-gray-100", role: "Canvas Principal Light Mode", textLight: false },
  { name: "WHITE", hex: "#FFFFFF", cssVar: "--nexo-white", role: "Superfície Sólida de Botões e Inputs", textLight: false },
];

const SEMANTIC_VARIABLES = [
  { token: "--surface-canvas", category: "Canvas", light: "#F4F4F5", dark: "#09090B", desc: "Fundo base da página" },
  { token: "--surface-glass-md", category: "Box Glass", light: "rgba(255,255,255,0.85)", dark: "rgba(24,24,27,0.85)", desc: "Exclusivo para Containers e Boxes externos" },
  { token: "--surface-elevated", category: "Inner Solid", light: "#FFFFFF", dark: "#18181B", desc: "Fundo 100% sólido para Botões, Inputs e Badges" },
  { token: "--border-glass", category: "Box Border", light: "rgba(255,255,255,0.80)", dark: "rgba(255,255,255,0.15)", desc: "Borda especular externa dos containers Glass" },
  { token: "--intent-brand", category: "Brand 2TP", light: "#DC2626", dark: "#E85950", desc: "Vermelho primário da marca" },
  { token: "--intent-ai", category: "AI / OCR", light: "#692296", dark: "#A466D1", desc: "Roxo secundário de IA e Rascunho" },
  { token: "--intent-income", category: "Finance +", light: "#0CB853", dark: "#46C87D", desc: "Verde semântico de receitas" },
  { token: "--intent-expense", category: "Finance -", light: "#DF2929", dark: "#EC6862", desc: "Vermelho semântico de despesas" },
];

type SectionChapter =
  | "all"
  | "spatial"
  | "colors"
  | "components";

export function DesignSystemShowcase() {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [activeChapter, setActiveChapter] = React.useState<SectionChapter>("all");
  const [darkMode, setDarkMode] = React.useState(false);

  // Canvas & Glass Container Style Mode:
  // "PURPLE_STAGE" = Fundo Roxo/Vermelho Vibrante + Boxes em Vidro Branco ("white-glass")
  // "LIGHT_STAGE"  = Fundo Claro + Boxes em Vidro Roxo/Vermelho ("purple-glass")
  const [stageMode, setStageMode] = React.useState<"PURPLE_STAGE" | "LIGHT_STAGE">("LIGHT_STAGE");
  const [glassBlurLevel, setGlassBlurLevel] = React.useState<"sm" | "md" | "xl" | "2xl">("2xl");
  const [buttonRadius, setButtonRadius] = React.useState<"rounded-xl" | "rounded-full">("rounded-xl");
  const [tabularNums, setTabularNums] = React.useState<boolean>(true);
  const [interactiveLoading, setInteractiveLoading] = React.useState<boolean>(false);
  const [sampleAmount, setSampleAmount] = React.useState<string>("24.890,50");
  const [selectedFamily, setSelectedFamily] = React.useState<string>("ALL");

  // Interactive Component States
  const [ocrAutoApprove, setOcrAutoApprove] = React.useState(false);
  const [aiSmartCategorize, setAiSmartCategorize] = React.useState(true);
  const [zeroTrustAudit, setZeroTrustAudit] = React.useState(true);
  const [realtimeAlerts, setRealtimeAlerts] = React.useState(true);
  const [budgetSimProgress, setBudgetSimProgress] = React.useState(74);
  const [demoChipFilter, setDemoChipFilter] = React.useState<"ALL" | "AI" | "PIX">("ALL");

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  function copyValue(value: string) {
    navigator.clipboard.writeText(value);
    setCopiedToken(value);
    setTimeout(() => setCopiedToken(null), 1800);
  }

  const filteredColorMatrix =
    selectedFamily === "ALL"
      ? COLOR_MATRIX
      : COLOR_MATRIX.filter((row) => row.family === selectedFamily);

  const chapterTabs: TabOption<SectionChapter>[] = [
    { id: "all", label: "Workbench Completo", icon: LayoutGrid, badge: "v4.0" },
    { id: "spatial", label: "Containers Glass & KPIs", icon: Sparkles, badge: "10 Novos" },
    { id: "colors", label: "Paleta & Tokens", icon: Palette, badge: 38 },
    { id: "components", label: "Botões Sólidos & Inputs", icon: MousePointerClick },
  ];

  const demoFilterChips: FilterChipOption<"ALL" | "AI" | "PIX">[] = [
    { id: "ALL", label: "Todos os Eventos", icon: Layers, count: 42, intent: "brand" },
    { id: "AI", label: "Extraídos via Vision AI", icon: Sparkles, count: 28, intent: "ai" },
    { id: "PIX", label: "Liquidação Instantânea", icon: TrendingUp, count: 14, intent: "income" },
  ];

  const isPurpleStage = stageMode === "PURPLE_STAGE";
  const activeGlassTone: GlassSurfaceTone = isPurpleStage ? "white-glass" : "purple-glass";

  const showSpatial = activeChapter === "all" || activeChapter === "spatial";
  const showColors = activeChapter === "all" || activeChapter === "colors";
  const showComponents = activeChapter === "all" || activeChapter === "components";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-[#0B0B10] text-[#F4F4F5]"
          : isPurpleStage
            ? "bg-gradient-to-br from-[#F3EBF9] via-[#F6F7FB] to-[#FCEEEB] text-[#18181B]"
            : "bg-[#F6F7FB] text-[#18181B]"
      }`}
    >
      {/* Luz ambiente sutil para destacar os Boxes em Vidro Fosco */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className={`absolute -top-32 left-1/4 h-[520px] w-[520px] rounded-full blur-[150px] transition-opacity duration-500 ${
            darkMode ? "bg-[#692296]/22" : "bg-[#692296]/[0.07]"
          }`}
        />
        <div
          className={`absolute top-1/3 right-10 h-[460px] w-[460px] rounded-full blur-[150px] transition-opacity duration-500 ${
            darkMode ? "bg-[#DC2626]/16" : "bg-[#DC2626]/[0.05]"
          }`}
        />
      </div>

      {/* Header Clean em Vidro Fosco */}
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7]/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#121217]/85">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-sm">
                <Palette className="h-5 w-5" strokeWidth={1.75} />
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                  Nexo Finance <span className="font-normal text-[#71717A]">| Design System v4.0</span>
                </h1>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] hidden sm:block">
                  Catálogo de Cores, Variáveis Semânticas e Componentes Reutilizáveis
                </p>
              </div>
            </div>

            {/* Controles Superiores Clean */}
            <div className="flex flex-wrap items-center gap-2.5">
              <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

              <Link href="/">
                <Button variant="primary" size="md" icon={ArrowLeft}>
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E4E7]/70 py-2.5 dark:border-white/10">
            <SegmentedTabs
              options={chapterTabs}
              value={activeChapter}
              onChange={(next) => setActiveChapter(next)}
            />
          </div>
        </div>
      </header>

      {/* Main Workbench Clean (max-w-[1600px]) */}
      <main className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TOP HERO BOX: Controle de Containers Glass vs Elementos Sólidos */}
        <GlassPanel
          intent="ai"
          tone={activeGlassTone}
          blur={glassBlurLevel}
          topBeam
          className="p-6"
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-center">
            <div className="xl:col-span-5 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="purple" icon={Compass}>
                  Arquitetura Visual 2TP v4.0
                </Badge>
                <Badge variant="income" icon={CheckCircle2}>
                  Contraste Máximo
                </Badge>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                Boxes em Vidro Fosco + Componentes Internos Sólidos
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#3F3F46] dark:text-[#D4D4D8] leading-relaxed">
                O efeito <strong>Glassmorphism</strong> atua exclusivamente nos{" "}
                <strong>Containers e Boxes externos</strong> sobre o fundo Roxo/Vermelho da marca, enquanto todos os{" "}
                <strong>botões, pílulas, ícones e textos internos</strong> possuem fundo sólido para legibilidade imediata.
              </p>
            </div>

            {/* 4 Controles em Caixas Sólidas */}
            <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 shadow-xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                    1. Relação Fundo vs Box Glass
                  </span>
                  <SlidersHorizontal className="h-4 w-4 text-[#692296]" strokeWidth={1.75} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={isPurpleStage ? "secondary" : "neutral"}
                    size="sm"
                    icon={Sparkles}
                    onClick={() => setStageMode("PURPLE_STAGE")}
                  >
                    Fundo Roxo + Glass Branco
                  </Button>
                  <Button
                    variant={!isPurpleStage ? "primary" : "neutral"}
                    size="sm"
                    icon={Layers}
                    onClick={() => setStageMode("LIGHT_STAGE")}
                  >
                    Fundo Claro + Glass Roxo
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 shadow-xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                    2. Desfoque dos Containers (Blur)
                  </span>
                  <Sparkles className="h-4 w-4 text-[#DC2626]" strokeWidth={1.75} />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(["sm", "md", "xl", "2xl"] as const).map((lvl) => (
                    <Button
                      key={lvl}
                      variant={glassBlurLevel === lvl ? "primary" : "neutral"}
                      size="sm"
                      icon={Sliders}
                      onClick={() => setGlassBlurLevel(lvl)}
                    >
                      {lvl.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 shadow-xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                    3. Formato dos Botões Sólidos
                  </span>
                  <Shapes className="h-4 w-4 text-[#0CB853]" strokeWidth={1.75} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={buttonRadius === "rounded-xl" ? "income" : "neutral"}
                    size="sm"
                    icon={Maximize2}
                    onClick={() => setButtonRadius("rounded-xl")}
                  >
                    12px (Rounded-XL)
                  </Button>
                  <Button
                    variant={buttonRadius === "rounded-full" ? "income" : "neutral"}
                    size="sm"
                    icon={Minimize2}
                    onClick={() => setButtonRadius("rounded-full")}
                  >
                    Pílula (Full)
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 shadow-xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                    4. Spinner & Numerais Tabulares
                  </span>
                  <Eye className="h-4 w-4 text-[#2572CE]" strokeWidth={1.75} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={interactiveLoading ? "primary" : "neutral"}
                    size="sm"
                    icon={ScanLine}
                    onClick={() => setInteractiveLoading(!interactiveLoading)}
                  >
                    {interactiveLoading ? "Parar Spinner" : "Simular Loading"}
                  </Button>
                  <Button
                    variant={tabularNums ? "secondary" : "neutral"}
                    size="sm"
                    icon={Hash}
                    onClick={() => setTabularNums(!tabularNums)}
                  >
                    {tabularNums ? "Tabular: ON" : "Tabular: OFF"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* ====================================================================
            ESTRUTURA BENTO GRID DE 12 COLUNAS DO DESIGN SYSTEM
            ==================================================================== */}
        {showSpatial ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* Box Glass Esquerdo (7 Colunas): KPIs Sólidos + WatchOS Rings */}
            <GlassPanel
              intent="brand"
              tone={activeGlassTone}
              blur={glassBlurLevel}
              topBeam
              className="p-6 space-y-5 xl:col-span-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4D4D8]/80 pb-3 dark:border-white/15">
                <div>
                  <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                    01. StatMetricCards & WatchOS Health Rings (RadialGauge)
                  </h3>
                  <p className="text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
                    Cards internos brancos sólidos dentro do Container Glass para leitura perfeita dos números
                  </p>
                </div>
                <Badge variant="brand" icon={Activity}>
                  Sparklines SVG
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatMetricCard
                  title="Patrimônio Consolidado"
                  value={`R$ ${sampleAmount}`}
                  trendLabel="+18.4% Crescimento"
                  trendIcon={TrendingUp}
                  icon={Wallet}
                  intent="brand"
                  progressValue={78}
                  progressLabel="Liquidez Patrimonial"
                  progressRightLabel="78% meta"
                  sparklinePoints={[30, 45, 42, 60, 58, 82, 95]}
                />

                <StatMetricCard
                  title="Extração Vision AI"
                  value="94,8% Precisão"
                  trendLabel="OCR Automático"
                  trendIcon={Sparkles}
                  icon={ScanLine}
                  intent="ai"
                  progressValue={95}
                  progressLabel="Recibos Processados"
                  progressRightLabel="142 documentos"
                  sparklinePoints={[50, 62, 70, 78, 85, 91, 95]}
                />
              </div>

              {/* 3 Radial Gauges dentro de caixa sólida */}
              <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 place-items-center shadow-xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                <RadialGauge
                  value={86}
                  size={96}
                  strokeWidth={9}
                  variant="income"
                  label="Saúde Caixa"
                  sublabel="Excelente"
                />
                <RadialGauge
                  value={72}
                  size={96}
                  strokeWidth={9}
                  variant="ai"
                  label="Automação IA"
                  sublabel="Vision OCR"
                />
                <RadialGauge
                  value={44}
                  size={96}
                  strokeWidth={9}
                  variant="brand"
                  label="Uso do Teto"
                  sublabel="Controlado"
                />
              </div>
            </GlassPanel>

            {/* Box Glass Direito (5 Colunas): Switches, ProgressBars, FilterChips & Atalhos */}
            <GlassPanel
              intent="ai"
              tone={activeGlassTone}
              blur={glassBlurLevel}
              topBeam
              className="p-6 space-y-5 xl:col-span-5"
            >
              <div className="flex items-center justify-between border-b border-[#D4D4D8]/80 pb-3 dark:border-white/15">
                <div>
                  <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                    02. Switches, Barras & Filtros Nítidos
                  </h3>
                  <p className="text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
                    Controles táteis sólidos sobre container em vidro fosco
                  </p>
                </div>
                <GlassTooltip
                  label="Ver Regra"
                  tag="Sem Glass Interno"
                  content="Nenhum botão ou pílula interna usa blur, garantindo visibilidade total dos ícones Lucide."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-3 shadow-2xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <Switch
                    checked={aiSmartCategorize}
                    onCheckedChange={setAiSmartCategorize}
                    variant="purple"
                    label="Categorização IA"
                    description="Classifica faturas PDF"
                  />
                </div>
                <div className="rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-3 shadow-2xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <Switch
                    checked={zeroTrustAudit}
                    onCheckedChange={setZeroTrustAudit}
                    variant="success"
                    label="Magic Bytes"
                    description="Validação binária"
                  />
                </div>
                <div className="rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-3 shadow-2xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <Switch
                    checked={realtimeAlerts}
                    onCheckedChange={setRealtimeAlerts}
                    variant="brand"
                    label="Alerta de Meta"
                    description="Aviso em 80% do teto"
                  />
                </div>
                <div className="rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-3 shadow-2xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <Switch
                    checked={ocrAutoApprove}
                    onCheckedChange={setOcrAutoApprove}
                    variant="info"
                    label="Revisão Draft"
                    description="Sempre revisar IA"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 space-y-3 shadow-2xs dark:border-[#3F3F46] dark:bg-[#09090B]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-[#18181B] dark:text-[#FFFFFF]">
                    Simulador ProgressBar
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[35, 74, 92].map((pct) => (
                      <Button
                        key={pct}
                        variant={budgetSimProgress === pct ? "primary" : "neutral"}
                        size="sm"
                        icon={Activity}
                        onClick={() => setBudgetSimProgress(pct)}
                      >
                        {pct}%
                      </Button>
                    ))}
                  </div>
                </div>
                <ProgressBar
                  value={budgetSimProgress}
                  variant="gradient"
                  size="md"
                  label="Eficiência Financeira (Gradiente 2TP)"
                  valueLabel={`${budgetSimProgress}%`}
                />
                <ProgressBar
                  value={88}
                  variant="success"
                  size="md"
                  label="Receitas Confirmadas (#0CB853)"
                  valueLabel="88%"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <FilterChipGroup
                  options={demoFilterChips}
                  value={demoChipFilter}
                  onChange={setDemoChipFilter}
                />
                <UserStatusPill
                  name="Thiago Castro"
                  role="2TP Admin"
                  initials="TC"
                  status="online"
                />
              </div>

              <NotificationBanner
                title="Vision Scanner IA Pronto"
                description="Container externo em Glassmorphism + botão interno sólido."
                icon={Sparkles}
                intent="ai"
                actionLabel="Testar Ação"
                actionIcon={Eye}
                onAction={() => {}}
              />

              <SkeletonGlass lines={2} />
            </GlassPanel>
          </div>
        ) : null}

        {/* ====================================================================
            BOTÕES SÓLIDOS DE ALTA NITIDEZ & INPUTS (DENTRO DE CONTAINER GLASS)
            ==================================================================== */}
        {showComponents ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <GlassPanel
              intent="brand"
              tone={activeGlassTone}
              blur={glassBlurLevel}
              topBeam
              className="lg:col-span-7 p-6 space-y-6"
            >
              <div>
                <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF] mb-1">
                  03. Botões Sólidos (1 Linha • Ícone Lucide + Texto Visível)
                </h3>
                <p className="text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8] mb-4">
                  Fundo branco sólido (<code>#FFFFFF</code>) com borda e ícone semânticos nítidos e preenchimento total no hover.
                </p>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#D4D4D8] bg-[#F4F4F5] p-4 dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <Button variant="primary" icon={Plus} isLoading={interactiveLoading} className={buttonRadius}>
                    Primary (#DC2626)
                  </Button>
                  <Button variant="secondary" icon={Sparkles} isLoading={interactiveLoading} className={buttonRadius}>
                    Secondary IA (#692296)
                  </Button>
                  <Button variant="income" icon={Check} isLoading={interactiveLoading} className={buttonRadius}>
                    Income (#0CB853)
                  </Button>
                  <Button variant="neutral" icon={FileUp} isLoading={interactiveLoading} className={buttonRadius}>
                    Neutral Solid
                  </Button>
                  <Button variant="expense" icon={Trash2} isLoading={interactiveLoading} className={buttonRadius}>
                    Expense (#DF2929)
                  </Button>
                  <Button variant="warning" icon={AlertTriangle} isLoading={interactiveLoading} className={buttonRadius}>
                    Warning (#EA920F)
                  </Button>
                  <Button variant="info" icon={Info} isLoading={interactiveLoading} className={buttonRadius}>
                    Info (#2572CE)
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 space-y-3 dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                    Escala de Tamanhos (SM • MD • LG)
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button variant="primary" size="sm" icon={Zap} className={buttonRadius}>
                      SM (36px)
                    </Button>
                    <Button variant="primary" size="md" icon={Layers} className={buttonRadius}>
                      MD (40px)
                    </Button>
                    <Button variant="primary" size="lg" icon={ShieldCheck} className={buttonRadius}>
                      LG (44px)
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 space-y-3 dark:border-[#3F3F46] dark:bg-[#09090B]">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                    Badges Sólidos de Alto Contraste
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="brand" icon={Sparkles}>
                      RED 2TP
                    </Badge>
                    <Badge variant="purple" icon={Sparkles}>
                      PURPLE IA
                    </Badge>
                    <Badge variant="income" icon={TrendingUp}>
                      RECEITA
                    </Badge>
                    <Badge variant="expense" icon={TrendingDown}>
                      DESPESA
                    </Badge>
                    <Badge variant="warning" icon={AlertTriangle}>
                      ALERTA
                    </Badge>
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Inputs & Form Box (5 Colunas) */}
            <GlassPanel
              intent="neutral"
              tone={activeGlassTone}
              blur={glassBlurLevel}
              topBeam
              className="lg:col-span-5 p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                04. Inputs Sólidos & Atalhos de Teclado
              </h3>

              <div className="rounded-2xl border border-[#D4D4D8] bg-[#FFFFFF] p-4 space-y-4 dark:border-[#3F3F46] dark:bg-[#09090B]">
                <Input
                  label="Descrição do Lançamento"
                  placeholder="Ex: Assinatura Cloud AWS"
                  defaultValue="Infraestrutura GPU & Cloud 2TP"
                />

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                    Valor Monetário ({tabularNums ? "tabular-nums" : "normal"})
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#692296]">
                      R$
                    </span>
                    <input
                      type="text"
                      value={sampleAmount}
                      onChange={(e) => setSampleAmount(e.target.value)}
                      className={`h-10 w-full rounded-xl border-2 border-[#692296] bg-[#FFFFFF] pl-9 pr-4 text-sm font-extrabold text-[#18181B] focus:outline-none dark:bg-[#18181B] dark:text-[#FFFFFF] ${
                        tabularNums ? "tabular-nums" : ""
                      }`}
                    />
                  </div>
                </div>

                <Input
                  placeholder="Busca rápida com ícone Lucide..."
                  icon={Search}
                />

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E4E7] pt-3 dark:border-[#27272A]">
                  <span className="text-xs font-bold text-[#3F3F46] dark:text-[#D4D4D8]">
                    Atalhos Físicos (KbdPill):
                  </span>
                  <div className="flex items-center gap-2">
                    <KbdPill keys={["Ctrl", "V"]} />
                    <KbdPill keys={["⌘", "K"]} />
                    <KbdPill keys={["Esc"]} />
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        ) : null}

        {/* ====================================================================
            MATRIZ DE CORES (38 TOKENS) & VARIÁVEIS SEMÂNTICAS EM CONTAINER GLASS
            ==================================================================== */}
        {showColors ? (
          <GlassPanel
            intent="ai"
            tone={activeGlassTone}
            blur={glassBlurLevel}
            topBeam
            className="p-6 space-y-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#D4D4D8]/80 pb-4 dark:border-white/15">
              <div>
                <h2 className="text-xl font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                  05. Matriz Oficial de Cores (38 Tokens) & Variáveis Semânticas
                </h2>
                <p className="text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
                  Clique em qualquer cor ou variável para copiar o código.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {["ALL", "RED", "PURPLE", "ALERT", "SUCCESS", "ERROR / DANGER", "INFO"].map((fam) => (
                  <Button
                    key={fam}
                    variant={selectedFamily === fam ? "primary" : "neutral"}
                    size="sm"
                    icon={Palette}
                    onClick={() => setSelectedFamily(fam)}
                  >
                    {fam === "ALL" ? "Todas (30)" : fam}
                  </Button>
                ))}
              </div>
            </div>

            {/* 6x5 Color Swatches em Cards Brancos Sólidos */}
            <div className="divide-y divide-[#D4D4D8]/70 dark:divide-white/10">
              {filteredColorMatrix.map((row) => (
                <div
                  key={row.family}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="max-w-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-4 w-4 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: row.steps[0].hex }}
                      />
                      <h3 className="text-base font-extrabold tracking-wider text-[#18181B] dark:text-[#FFFFFF]">
                        {row.family}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
                      {row.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {row.steps.map((swatch) => {
                      const isCopied = copiedToken === swatch.hex;
                      return (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => copyValue(swatch.hex)}
                          className="group flex flex-col text-left rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-2 shadow-2xs transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#18181B] dark:border-[#3F3F46] dark:bg-[#09090B]"
                        >
                          <div
                            className="relative h-12 w-full sm:w-28 rounded-lg border border-black/10"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                              ) : (
                                <Copy className="h-3 w-3" strokeWidth={1.75} />
                              )}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between px-0.5">
                            <span className="font-mono text-xs font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                              {isCopied ? "COPIADO!" : swatch.hex}
                            </span>
                            <span className="text-[10px] font-bold text-[#71717A]">
                              {swatch.step}
                            </span>
                          </div>
                          <span className="mt-0.5 px-0.5 font-mono text-[10px] font-semibold text-[#692296] dark:text-[#DEC5EF] truncate">
                            {swatch.cssVar}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 8 Neutrals + Semantic Variables */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#D4D4D8]/80 sm:grid-cols-4 lg:grid-cols-8 dark:border-white/15">
              {NEUTRAL_PALETTE.map((item) => {
                const isCopied = copiedToken === item.hex;
                return (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() => copyValue(item.hex)}
                    className="group flex flex-col rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-2 text-left shadow-2xs transition-transform duration-150 hover:-translate-y-0.5 dark:border-[#3F3F46] dark:bg-[#09090B]"
                  >
                    <div
                      className="flex h-12 w-full items-end justify-between rounded-lg border border-black/15 p-2"
                      style={{ backgroundColor: item.hex }}
                    >
                      <span
                        className={`font-mono text-[10px] font-extrabold ${
                          item.textLight ? "text-white" : "text-[#18181B]"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className="mt-1.5 font-mono text-xs font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                      {isCopied ? "COPIADO!" : item.hex}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[#692296] dark:text-[#DEC5EF]">
                      {item.cssVar}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Variáveis Semânticas CSS */}
            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-[#D4D4D8]/80 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/15">
              {SEMANTIC_VARIABLES.map((v) => {
                const call = `var(${v.token})`;
                const isCopied = copiedToken === call;
                return (
                  <button
                    key={v.token}
                    type="button"
                    onClick={() => copyValue(call)}
                    className="flex flex-col justify-between rounded-xl border border-[#D4D4D8] bg-[#FFFFFF] p-3 text-left shadow-2xs transition-transform hover:-translate-y-0.5 hover:border-[#692296] dark:border-[#3F3F46] dark:bg-[#09090B]"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" icon={Code2}>
                        {v.category}
                      </Badge>
                      <span className="font-mono text-[11px] font-bold text-[#DC2626]">
                        {isCopied ? "Copiado!" : "Copiar"}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-xs font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                      {v.token}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#3F3F46] dark:text-[#D4D4D8]">
                      {v.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        ) : null}
      </main>
    </div>
  );
}
