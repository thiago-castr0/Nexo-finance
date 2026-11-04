'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  Type,
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
  ToggleLeft,
  Sliders,
  Maximize2,
  Minimize2,
  Zap,
  Bell,
  Lock,
  CheckCircle2,
  Code2,
  Activity,
  BarChart3,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch, ThemeSwitch } from '@/components/ui/switch';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SegmentedTabs, type TabOption } from '@/components/ui/tabs';

interface ColorStep {
  step: string;
  hex: string;
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
    family: 'RED',
    subtitle: 'Marca Primária 2TP — Identidade, CTAs principais e foco ativo',
    tailwindPrefix: 'brand-red',
    steps: [
      { step: '500', hex: '#DC2626', usage: 'Cor base primária / Borda ativa' },
      { step: '400', hex: '#E85950', usage: 'Hover intenso / Destaque secundário' },
      { step: '300', hex: '#EE7870', usage: 'Ícones / Gráficos secundários' },
      { step: '200', hex: '#F59B92', usage: 'Bordas suaves / Focus ring' },
      { step: '100', hex: '#FACBC2', usage: 'Fundo de hover / Badge surface' },
    ],
  },
  {
    family: 'PURPLE',
    subtitle: 'Marca Secundária 2TP — Inteligência Artificial, OCR e Modo Rascunho',
    tailwindPrefix: 'brand-purple',
    steps: [
      { step: '500', hex: '#692296', usage: 'Cor base IA / Borda Draft Mode' },
      { step: '400', hex: '#7E32B5', usage: 'Hover de ações de IA' },
      { step: '300', hex: '#A466D1', usage: 'Indicadores de leitura OCR' },
      { step: '200', hex: '#C59BE3', usage: 'Bordas tracejadas Smart Input' },
      { step: '100', hex: '#DEC5EF', usage: 'Fundo sutil de revisão de rascunho' },
    ],
  },
  {
    family: 'ALERT',
    subtitle: 'Semântica de Atenção — Pendências de revisão e alertas preventivos',
    tailwindPrefix: 'semantic-alert',
    steps: [
      { step: '500', hex: '#EA920F', usage: 'Texto e ícone de alerta principal' },
      { step: '400', hex: '#EDAD12', usage: 'Borda de aviso preventivo' },
      { step: '300', hex: '#ECC023', usage: 'Gráfico de atenção moderada' },
      { step: '200', hex: '#ECD54A', usage: 'Realce de linha pendente' },
      { step: '100', hex: '#EDE08D', usage: 'Surface de badge de rascunho' },
    ],
  },
  {
    family: 'SUCCESS',
    subtitle: 'Semântica Positiva — Receitas, PIX recebidos e confirmações',
    tailwindPrefix: 'semantic-success',
    steps: [
      { step: '500', hex: '#0CB853', usage: 'Valores positivos (+ R$) e confirmação' },
      { step: '400', hex: '#13BD5B', usage: 'Barras de receita em gráficos' },
      { step: '300', hex: '#46C87D', usage: 'Indicador de meta batida' },
      { step: '200', hex: '#7BD6A0', usage: 'Borda de card de receita' },
      { step: '100', hex: '#BCE5CB', usage: 'Surface de confirmação / Hover verde' },
    ],
  },
  {
    family: 'ERROR / DANGER',
    subtitle: 'Semântica Crítica — Despesas (- R$), exclusões e erros de validação',
    tailwindPrefix: 'semantic-danger',
    steps: [
      { step: '500', hex: '#DF2929', usage: 'Valores negativos (- R$) e erro crítico' },
      { step: '400', hex: '#E54541', usage: 'Barras de despesa em gráficos' },
      { step: '300', hex: '#EC6862', usage: 'Alerta de estouro de orçamento' },
      { step: '200', hex: '#F4948C', usage: 'Borda de input inválido' },
      { step: '100', hex: '#F9C5BD', usage: 'Surface de erro / Hover destrutivo' },
    ],
  },
  {
    family: 'INFO',
    subtitle: 'Semântica Informativa — Metadados, filtros ativos e dicas de sistema',
    tailwindPrefix: 'semantic-info',
    steps: [
      { step: '500', hex: '#2572CE', usage: 'Links técnicos e badges informativos' },
      { step: '400', hex: '#448BDE', usage: 'Gráficos comparativos neutros' },
      { step: '300', hex: '#65A2E6', usage: 'Ícones de ajuda e suporte' },
      { step: '200', hex: '#8CB9EB', usage: 'Borda de tooltip informativo' },
      { step: '100', hex: '#BCD6F2', usage: 'Surface de notificação de sistema' },
    ],
  },
];

const NEUTRAL_PALETTE = [
  { name: 'BLACK', hex: '#09090B', role: 'Fundo principal Dark Mode / Contraste máximo', textLight: true },
  { name: 'GRAY 900', hex: '#18181B', role: 'Texto Primário (Títulos e Valores em Light Mode)', textLight: true },
  { name: 'GRAY 700', hex: '#3F3F46', role: 'Texto Secundário Forte / Subtítulos', textLight: true },
  { name: 'GRAY 500', hex: '#71717A', role: 'Texto Muted / Labels / Metadados', textLight: true },
  { name: 'GRAY 300', hex: '#D4D4D8', role: 'Bordas de Inputs em Foco Neutro / Divisores', textLight: false },
  { name: 'GRAY 200', hex: '#E4E4E7', role: 'Borda Padrão de Cards 1px Solid (Outline Style)', textLight: false },
  { name: 'GRAY 100', hex: '#F4F4F5', role: 'Background Principal da Aplicação (Off-white)', textLight: false },
  { name: 'WHITE', hex: '#FFFFFF', role: 'Superfície Pura de Cards, Modais e Inputs', textLight: false },
];

type SectionChapter = 'all' | 'colors' | 'components' | 'interactive' | 'typography' | 'icons';

export function DesignSystemShowcase() {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [activeChapter, setActiveChapter] = React.useState<SectionChapter>('all');
  const [darkMode, setDarkMode] = React.useState(false);

  // Interactive Playground States
  const [buttonRadius, setButtonRadius] = React.useState<'rounded-xl' | 'rounded-full'>('rounded-xl');
  const [iconStroke, setIconStroke] = React.useState<number>(1.5);
  const [tabularNums, setTabularNums] = React.useState<boolean>(true);
  const [interactiveLoading, setInteractiveLoading] = React.useState<boolean>(false);
  const [sampleAmount, setSampleAmount] = React.useState<string>('15.480,90');
  const [selectedFamily, setSelectedFamily] = React.useState<string>('ALL');

  // Interactive Switch Demo States
  const [ocrAutoApprove, setOcrAutoApprove] = React.useState(false);
  const [aiSmartCategorize, setAiSmartCategorize] = React.useState(true);
  const [zeroTrustAudit, setZeroTrustAudit] = React.useState(true);
  const [realtimeAlerts, setRealtimeAlerts] = React.useState(true);
  const [budgetSimProgress, setBudgetSimProgress] = React.useState(68);
  const [previewTab, setPreviewTab] = React.useState<'overview' | 'tokens' | 'a11y'>('overview');

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  function copyHex(value: string) {
    navigator.clipboard.writeText(value);
    setCopiedToken(value);
    setTimeout(() => setCopiedToken(null), 1800);
  }

  const filteredColorMatrix =
    selectedFamily === 'ALL'
      ? COLOR_MATRIX
      : COLOR_MATRIX.filter((row) => row.family === selectedFamily);

  const chapterTabs: TabOption<SectionChapter>[] = [
    { id: 'all', label: 'Catálogo Completo', icon: LayoutGrid, badge: '6 Módulos' },
    { id: 'colors', label: 'Matriz de Cores', icon: Palette, badge: 38 },
    { id: 'interactive', label: 'Switches & Barras', icon: ToggleLeft, badge: 'Novo' },
    { id: 'components', label: 'Botões & Inputs', icon: MousePointerClick },
    { id: 'typography', label: 'Tipografia & Escala', icon: Type },
    { id: 'icons', label: 'Ícones Lucide', icon: Shapes },
  ];

  const previewSubTabs: TabOption<'overview' | 'tokens' | 'a11y'>[] = [
    { id: 'overview', label: 'Visão Executiva', icon: Activity },
    { id: 'tokens', label: 'Design Tokens CSS', icon: Code2 },
    { id: 'a11y', label: 'Acessibilidade WCAG', icon: ShieldCheck },
  ];

  const showColors = activeChapter === 'all' || activeChapter === 'colors';
  const showInteractive = activeChapter === 'all' || activeChapter === 'interactive';
  const showComponents = activeChapter === 'all' || activeChapter === 'components';
  const showTypography = activeChapter === 'all' || activeChapter === 'typography';
  const showIcons = activeChapter === 'all' || activeChapter === 'icons';

  return (
    <div className="min-h-screen bg-[#F4F4F5] dark:bg-[#09090B] text-[#18181B] dark:text-[#F4F4F5] transition-colors duration-200">
      {/* Top Ambient Brand Accent Bar (2TP Signature) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#DC2626] via-[#692296] to-[#0CB853]" />

      {/* Top Sticky Command Header — Zero Duplicate Actions, Full-Width Panoramic */}
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] dark:border-[#27272A] bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3.5">
            {/* Brand Identity + 2TP Ecosystem Tag */}
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#692296] bg-gradient-to-br from-[#DEC5EF]/45 via-white to-[#FACBC2]/45 dark:from-[#692296]/30 dark:via-[#18181B] dark:to-[#DC2626]/20 text-[#692296] shadow-sm">
                <Palette className="h-5 w-5" strokeWidth={1.5} />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#692296] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#692296] border-2 border-white dark:border-[#09090B]" />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-md border border-[#692296]/40 bg-[#DEC5EF]/30 text-[#692296] dark:text-[#C59BE3]">
                    2TP Design Studio
                  </span>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
                    Nexo Finance <span className="font-normal text-[#71717A]">| Design System v3.0</span>
                  </h1>
                  <Badge variant="purple">
                    <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                    Outline 1px Architecture
                  </Badge>
                </div>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] hidden sm:block">
                  38 Tokens Cromáticos • Componentes Interativos • Padrão Botão Linha Única (Ícone Lucide + Texto)
                </p>
              </div>
            </div>

            {/* Right Controls — Single-line Icon + Text + Dedicated ThemeSwitch */}
            <div className="flex items-center gap-2.5 overflow-x-auto py-1">
              <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />

              <Link href="/">
                <Button variant="primary" size="md">
                  <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span>Voltar ao Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Sub-Header Bar: Chapter Segmented Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E4E7]/80 dark:border-[#27272A]/80 py-2.5">
            <SegmentedTabs
              options={chapterTabs}
              value={activeChapter}
              onChange={(next) => setActiveChapter(next)}
            />

            <div className="hidden xl:flex items-center gap-2 text-xs text-[#71717A] dark:text-[#A1A1AA]">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5] dark:bg-[#18181B] px-2.5 py-1 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#0CB853]" strokeWidth={1.5} />
                WCAG 2.1 AA Ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5] dark:bg-[#18181B] px-2.5 py-1 font-mono">
                Stroke: {iconStroke}px
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Panoramic Studio Canvas */}
      <main className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Banner + Live Token Inspector */}
        <section className="relative overflow-hidden rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#692296]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-32 -bottom-20 h-56 w-56 rounded-full bg-[#DC2626]/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-12 items-center">
            <div className="xl:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DC2626]/40 bg-[#FACBC2]/25 dark:bg-[#DC2626]/15 px-3 py-1 text-xs font-semibold text-[#DC2626]">
                <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
                2TP Soluções em Tecnologia • Padrão Visual Unificado
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
                Arquitetura de Componentes Outline 1px & Escala Cromática
              </h2>
              <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                Inspirado na identidade técnica do ecossistema <strong>2TP (Nexo Metrics, Portfólio & Site TDK)</strong>:
                superfícies limpas com bordas estruturais de <code>1px solid</code>, botões sempre em linha única com{' '}
                <code>Ícone Lucide + Texto</code>, switch dedicado de tema e feedback tátil em 150ms.
              </p>
            </div>

            {/* Live Studio Controls — Every button strictly Icon + Text on 1 single line */}
            <div className="xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/70 dark:bg-[#09090B]/60 p-4">
              {/* Control 1: Border Radius */}
              <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                    1. Raio de Borda (Botões)
                  </span>
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#692296]" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={buttonRadius === 'rounded-xl' ? 'primary' : 'neutral'}
                    size="sm"
                    onClick={() => setButtonRadius('rounded-xl')}
                  >
                    <Maximize2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                    <span>12px (Rounded-XL)</span>
                  </Button>
                  <Button
                    variant={buttonRadius === 'rounded-full' ? 'primary' : 'neutral'}
                    size="sm"
                    onClick={() => setButtonRadius('rounded-full')}
                  >
                    <Minimize2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                    <span>Pílula (Full)</span>
                  </Button>
                </div>
              </div>

              {/* Control 2: Stroke Width */}
              <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                    2. Espessura Lucide ({iconStroke}px)
                  </span>
                  <Shapes className="h-3.5 w-3.5 text-[#DC2626]" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2">
                  {[1.25, 1.5, 1.75, 2].map((val) => (
                    <Button
                      key={val}
                      variant={iconStroke === val ? 'secondary' : 'neutral'}
                      size="sm"
                      onClick={() => setIconStroke(val)}
                      className="px-2.5"
                    >
                      <Sliders className="h-3 w-3 shrink-0" strokeWidth={val} />
                      <span>{val}px</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Control 3: Tabular Nums */}
              <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                    3. Precisão Monetária
                  </span>
                  <Hash className="h-3.5 w-3.5 text-[#0CB853]" strokeWidth={1.5} />
                </div>
                <Button
                  variant={tabularNums ? 'income' : 'neutral'}
                  size="sm"
                  onClick={() => setTabularNums(!tabularNums)}
                  className="w-full"
                >
                  <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                  <span>{tabularNums ? 'tabular-nums: ATIVO' : 'tabular-nums: INATIVO'}</span>
                </Button>
              </div>

              {/* Control 4: Loading Simulation */}
              <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                    4. Simulador de Spinner
                  </span>
                  <Eye className="h-3.5 w-3.5 text-[#2572CE]" strokeWidth={1.5} />
                </div>
                <Button
                  variant={interactiveLoading ? 'primary' : 'neutral'}
                  size="sm"
                  onClick={() => setInteractiveLoading(!interactiveLoading)}
                  className="w-full"
                >
                  <Zap className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                  <span>{interactiveLoading ? 'Desativar Loading' : 'Simular Loading'}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: COLOR MATRIX (6x5 + 8 NEUTRALS) */}
        {showColors && (
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#DC2626] bg-[#FACBC2]/30 text-xs font-bold text-[#DC2626]">
                    01
                  </span>
                  <h2 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">
                    Matriz Cromática Oficial (6 Escalas de 5 Tons + 8 Neutros)
                  </h2>
                </div>
                <p className="mt-1 text-sm text-[#71717A] dark:text-[#A1A1AA]">
                  Clique em qualquer bloco para copiar o código HEX. Todos os tokens estão sincronizados com o{' '}
                  <code>tailwind.config.ts</code> e variáveis CSS.
                </p>
              </div>

              {/* Family Filter Pills — Every button strictly Icon + Text on 1 line */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['ALL', 'RED', 'PURPLE', 'ALERT', 'SUCCESS', 'ERROR / DANGER', 'INFO'].map((fam) => (
                  <Button
                    key={fam}
                    variant={selectedFamily === fam ? 'primary' : 'neutral'}
                    size="sm"
                    onClick={() => setSelectedFamily(fam)}
                  >
                    <Palette className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                    <span>{fam === 'ALL' ? 'Todas (30)' : fam}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 6x5 Color Swatch Rows */}
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
              {filteredColorMatrix.map((row) => (
                <div
                  key={row.family}
                  className="py-5 first:pt-0 last:pb-0 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="max-w-sm">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: row.steps[0].hex }}
                      />
                      <h3 className="text-base font-bold tracking-[0.06em] text-[#18181B] dark:text-[#F4F4F5]">
                        {row.family}
                      </h3>
                      <span className="rounded-md border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5] dark:bg-[#09090B] px-2 py-0.5 font-mono text-[11px] text-[#71717A]">
                        {row.tailwindPrefix}-*
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#71717A] dark:text-[#A1A1AA]">{row.subtitle}</p>
                  </div>

                  {/* 5 Swatches */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {row.steps.map((swatch) => {
                      const isCopied = copiedToken === swatch.hex;
                      return (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => copyHex(swatch.hex)}
                          className="group flex flex-col text-left rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/50 dark:bg-[#09090B]/60 p-2 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#18181B] dark:hover:border-[#F4F4F5]"
                          title={`${swatch.usage} — Clique para copiar ${swatch.hex}`}
                        >
                          <div
                            className="relative h-14 w-full sm:w-28 rounded-lg border border-black/10 transition-transform"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/35 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                              ) : (
                                <Copy className="h-3 w-3" strokeWidth={1.5} />
                              )}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between px-0.5">
                            <span className="font-mono text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                              {isCopied ? 'COPIADO!' : swatch.hex}
                            </span>
                            <span className="text-[10px] font-semibold text-[#71717A]">
                              {swatch.step}
                            </span>
                          </div>
                          <span className="mt-0.5 px-0.5 text-[10px] text-[#71717A] line-clamp-1">
                            {swatch.usage}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 8 Neutral Tokens */}
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#18181B] dark:text-[#F4F4F5]">
                    Escala de Cinzas, Branco Puro e Preto (8 Fundações Neutras)
                  </h3>
                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                    Superfícies arquiteturais para contraste tipográfico e bordas estruturais de 1px.
                  </p>
                </div>
                <Badge variant="neutral">
                  <Layers className="h-3 w-3" strokeWidth={1.5} />8 Tokens Neutros
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {NEUTRAL_PALETTE.map((item) => {
                  const isCopied = copiedToken === item.hex;
                  return (
                    <button
                      key={item.hex}
                      type="button"
                      onClick={() => copyHex(item.hex)}
                      className="group flex flex-col rounded-xl border border-[#E4E4E7] dark:border-[#27272A] p-2.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#DC2626]"
                    >
                      <div
                        className="flex h-16 w-full items-end justify-between rounded-lg border border-[#E4E4E7] dark:border-[#27272A] p-2"
                        style={{ backgroundColor: item.hex }}
                      >
                        <span
                          className={`font-mono text-[10px] font-bold ${
                            item.textLight ? 'text-white' : 'text-[#18181B]'
                          }`}
                        >
                          {item.name}
                        </span>
                        {isCopied ? (
                          <Check
                            className={`h-3.5 w-3.5 ${item.textLight ? 'text-white' : 'text-[#18181B]'}`}
                            strokeWidth={2}
                          />
                        ) : (
                          <Copy
                            className={`h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 ${
                              item.textLight ? 'text-white' : 'text-[#18181B]'
                            }`}
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <span className="mt-2 font-mono text-xs font-bold text-[#18181B] dark:text-[#F4F4F5]">
                        {isCopied ? 'COPIADO!' : item.hex}
                      </span>
                      <span className="mt-0.5 text-[11px] leading-snug text-[#71717A] dark:text-[#A1A1AA] line-clamp-2">
                        {item.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: NEW INTERACTIVE COMPONENTS (SWITCHES, THEME SWITCH, PROGRESS BARS, SEGMENTED TABS) */}
        {showInteractive && (
          <section className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#692296] bg-[#DEC5EF]/30 text-xs font-bold text-[#692296]">
                  02
                </span>
                <h2 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  Componentes Interativos Avançados (Switches, ThemeSwitch, ProgressBars & Tabs)
                </h2>
              </div>
              <p className="mt-1 text-sm text-[#71717A] dark:text-[#A1A1AA]">
                Novos componentes construídos para enriquecer a experiência tátil do Nexo Finance com microinterações em 150ms.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Interactive Switches Showcase */}
              <div className="lg:col-span-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-[#27272A] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DC2626] bg-[#FACBC2]/25 text-[#DC2626]">
                      <ToggleLeft className="h-4 w-4" strokeWidth={iconStroke} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                        Switches Semânticos & Seletor de Tema
                      </h3>
                      <p className="text-xs text-[#71717A]">
                        Acessíveis via teclado (<code>role=&quot;switch&quot;</code>) com 4 variantes cromáticas
                      </p>
                    </div>
                  </div>
                  <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/60 dark:bg-[#09090B]/60 p-3.5">
                    <Switch
                      checked={aiSmartCategorize}
                      onCheckedChange={setAiSmartCategorize}
                      variant="purple"
                      label="Categorização IA Automática"
                      description="Classifica faturas PDF via LLM"
                    />
                  </div>

                  <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/60 dark:bg-[#09090B]/60 p-3.5">
                    <Switch
                      checked={zeroTrustAudit}
                      onCheckedChange={setZeroTrustAudit}
                      variant="success"
                      label="Validação Magic Bytes"
                      description="Bloqueia arquivos falsificados"
                    />
                  </div>

                  <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/60 dark:bg-[#09090B]/60 p-3.5">
                    <Switch
                      checked={realtimeAlerts}
                      onCheckedChange={setRealtimeAlerts}
                      variant="brand"
                      label="Alerta de Limite Mensal"
                      description="Notifica ao atingir 80% da meta"
                    />
                  </div>

                  <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/60 dark:bg-[#09090B]/60 p-3.5">
                    <Switch
                      checked={ocrAutoApprove}
                      onCheckedChange={setOcrAutoApprove}
                      variant="info"
                      label="Modo Revisão Obrigatória"
                      description="Sempre passa pela Tela de Rascunho"
                    />
                  </div>
                </div>
              </div>

              {/* Animated Progress Bars + Interactive Simulator */}
              <div className="lg:col-span-6 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] dark:border-[#27272A] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#0CB853] bg-[#BCE5CB]/30 text-[#0CB853]">
                      <BarChart3 className="h-4 w-4" strokeWidth={iconStroke} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                        Barras de Progresso Financeiras (ProgressBar)
                      </h3>
                      <p className="text-xs text-[#71717A]">
                        Indicadores animados com suporte a gradiente 2TP e tabular-nums
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[35, 68, 92].map((pct) => (
                      <Button
                        key={pct}
                        variant={budgetSimProgress === pct ? 'primary' : 'neutral'}
                        size="sm"
                        onClick={() => setBudgetSimProgress(pct)}
                      >
                        <Activity className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                        <span>{pct}%</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <ProgressBar
                    value={budgetSimProgress}
                    variant="gradient"
                    size="md"
                    label="Índice de Eficiência Financeira (Gradiente 2TP)"
                    valueLabel={`${budgetSimProgress}% otimizado`}
                  />
                  <ProgressBar
                    value={82}
                    variant="success"
                    size="md"
                    label="Meta de Receitas Confirmadas (#0CB853)"
                    valueLabel="R$ 8.500,00 (82%)"
                  />
                  <ProgressBar
                    value={46}
                    variant="purple"
                    size="md"
                    label="Automação via Smart Input OCR (#692296)"
                    valueLabel="14 recibos lidos (46%)"
                  />
                  <ProgressBar
                    value={budgetSimProgress > 80 ? 92 : 38}
                    variant={budgetSimProgress > 80 ? 'danger' : 'alert'}
                    size="md"
                    label="Comprometimento do Orçamento Mensal"
                    valueLabel={budgetSimProgress > 80 ? 'Crítico (92%)' : 'Saudável (38%)'}
                  />
                </div>
              </div>

              {/* Segmented Tabs Interactive Demo */}
              <div className="lg:col-span-12 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] dark:border-[#27272A] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                      Navegação em Abas Segmentadas (SegmentedTabs)
                    </h3>
                    <p className="text-xs text-[#71717A]">
                      Substitui menus laterais pesados por navegação horizontal compacta em linha única com ícone Lucide + texto.
                    </p>
                  </div>
                  <SegmentedTabs
                    options={previewSubTabs}
                    value={previewTab}
                    onChange={(next) => setPreviewTab(next)}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {previewTab === 'overview' && (
                    <>
                      <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] p-4">
                        <span className="text-xs font-semibold uppercase text-[#DC2626]">Regra 01 • Botões</span>
                        <p className="mt-1 text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                          Linha Única Obrigatória
                        </p>
                        <p className="mt-1 text-xs text-[#71717A]">
                          Todos os botões usam <code>whitespace-nowrap shrink-0 flex-nowrap</code> para jamais quebrar em duas linhas.
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] p-4">
                        <span className="text-xs font-semibold uppercase text-[#692296]">Regra 02 • Semântica</span>
                        <p className="mt-1 text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                          Ícone Lucide + Texto
                        </p>
                        <p className="mt-1 text-xs text-[#71717A]">
                          Toda ação combina ícone vetorial <code>strokeWidth={iconStroke}</code> com rótulo textual claro.
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#E4E4E7] dark:border-[#27272A] p-4">
                        <span className="text-xs font-semibold uppercase text-[#0CB853]">Regra 03 • Layout</span>
                        <p className="mt-1 text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                          Aproveitamento Panorâmico
                        </p>
                        <p className="mt-1 text-xs text-[#71717A]">
                          Sem menu lateral volumoso e sem repetição de botões entre cabeçalho e seções internas.
                        </p>
                      </div>
                    </>
                  )}

                  {previewTab === 'tokens' && (
                    <div className="md:col-span-3 rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#09090B] p-4 font-mono text-xs text-[#F4F4F5] overflow-x-auto">
                      <p className="text-[#A466D1]">
                        {'/* Variáveis Oficiais Nexo Finance v3.0 — 2TP Soluções em Tecnologia */'}
                      </p>
                      <p className="mt-1 text-[#7BD6A0]">
                        --nexo-red-500: #DC2626; --nexo-purple-500: #692296; --nexo-success-500: #0CB853; --nexo-danger-500: #DF2929;
                      </p>
                      <p className="mt-1 text-[#8CB9EB]">
                        --nexo-alert-500: #EA920F; --nexo-info-500: #2572CE; --nexo-gray-200: #E4E4E7; --nexo-gray-100: #F4F4F5;
                      </p>
                    </div>
                  )}

                  {previewTab === 'a11y' && (
                    <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#0CB853]/40 bg-[#BCE5CB]/20 dark:bg-[#0CB853]/10 p-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-[#0CB853]" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-bold text-[#18181B] dark:text-[#F4F4F5]">
                            Conformidade WCAG 2.1 AA Verificada
                          </p>
                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                            Alvos de toque mínimos de 40-44px, anéis de foco visíveis via Tab e sinalização dupla (sinal +/- + cor + ícone).
                          </p>
                        </div>
                      </div>
                      <Badge variant="income">
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        100% Acessível por Teclado
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: OUTLINE 1PX BUTTONS & INPUTS */}
        {showComponents && (
          <section className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#EA920F] bg-[#EDE08D]/40 text-xs font-bold text-[#EA920F]">
                  03
                </span>
                <h2 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">
                  Botões Outline 1px (Linha Única + Ícone Lucide) & Inputs
                </h2>
              </div>
              <p className="mt-1 text-sm text-[#71717A] dark:text-[#A1A1AA]">
                Todos os botões têm fundo transparente/branco, borda sólida de <code>1px</code>, texto nunca quebrado em duas linhas e ícone Lucide alinhado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Buttons Showcase */}
              <div className="lg:col-span-7 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
                    7 Variantes Oficiais (Sempre 1 Linha • Ícone Lucide + Texto)
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" isLoading={interactiveLoading} className={buttonRadius}>
                      <Plus className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Primary (RED #DC2626)</span>
                    </Button>

                    <Button variant="secondary" isLoading={interactiveLoading} className={buttonRadius}>
                      <Sparkles className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Secondary / IA (PURPLE #692296)</span>
                    </Button>

                    <Button variant="income" isLoading={interactiveLoading} className={buttonRadius}>
                      <Check className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Income / Success (#0CB853)</span>
                    </Button>

                    <Button variant="neutral" isLoading={interactiveLoading} className={buttonRadius}>
                      <FileUp className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Neutral Outline</span>
                    </Button>

                    <Button variant="expense" isLoading={interactiveLoading} className={buttonRadius}>
                      <Trash2 className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Expense / Danger (#DF2929)</span>
                    </Button>

                    <Button variant="warning" isLoading={interactiveLoading} className={buttonRadius}>
                      <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Warning (#EA920F)</span>
                    </Button>

                    <Button variant="ghost" isLoading={interactiveLoading} className={buttonRadius}>
                      <Info className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Ghost Subtle</span>
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[#E4E4E7] dark:border-[#27272A] pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
                    Escala de Tamanhos & Estados (SM 36px • MD 40px • LG 44px)
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" size="sm" className={buttonRadius}>
                      <Zap className="h-3.5 w-3.5 shrink-0" strokeWidth={iconStroke} />
                      <span>Tamanho SM (36px)</span>
                    </Button>
                    <Button variant="primary" size="md" className={buttonRadius}>
                      <Layers className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Tamanho MD (40px)</span>
                    </Button>
                    <Button variant="primary" size="lg" className={buttonRadius}>
                      <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Tamanho LG (44px)</span>
                    </Button>
                    <Button variant="primary" size="md" isLoading className={buttonRadius}>
                      <span>Processando OCR</span>
                    </Button>
                    <Button variant="neutral" size="md" disabled className={buttonRadius}>
                      <Lock className="h-4 w-4 shrink-0" strokeWidth={iconStroke} />
                      <span>Desabilitado</span>
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[#E4E4E7] dark:border-[#27272A] pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
                    Badges Semânticos (1px Solid Border + Ícone + Texto em 1 Linha)
                  </h3>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="brand">
                      <Sparkles className="h-3 w-3" strokeWidth={iconStroke} />
                      RED • Marca 2TP
                    </Badge>
                    <Badge variant="purple">
                      <Sparkles className="h-3 w-3" strokeWidth={iconStroke} />
                      PURPLE • IA & OCR
                    </Badge>
                    <Badge variant="warning">
                      <AlertTriangle className="h-3 w-3" strokeWidth={iconStroke} />
                      ALERT • Rascunho Pendente
                    </Badge>
                    <Badge variant="income">
                      <TrendingUp className="h-3 w-3" strokeWidth={iconStroke} />
                      SUCCESS • Receita Confirmada
                    </Badge>
                    <Badge variant="expense">
                      <TrendingDown className="h-3 w-3" strokeWidth={iconStroke} />
                      DANGER • Despesa Fixa
                    </Badge>
                    <Badge variant="info">
                      <Info className="h-3 w-3" strokeWidth={iconStroke} />
                      INFO • Sistema RLS
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Inputs & Form Controls */}
              <div className="lg:col-span-5 rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                  Inputs de Formulário & Simulador Monetário
                </h3>

                <Input
                  label="Descrição do Lançamento (Padrão)"
                  placeholder="Ex: Assinatura Cloud AWS / Supermercado"
                  defaultValue="Assinatura Google Workspace Enterprise"
                />

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#18181B] dark:text-[#F4F4F5]">
                    Simulador de Alinhamento Monetário ({tabularNums ? 'tabular-nums' : 'normal'})
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
                      R$
                    </span>
                    <input
                      type="text"
                      value={sampleAmount}
                      onChange={(e) => setSampleAmount(e.target.value)}
                      className={`h-10 w-full rounded-xl border border-[#692296] bg-white dark:bg-[#09090B] pl-9 pr-4 text-sm font-bold text-[#18181B] dark:text-[#F4F4F5] ring-2 ring-[#DEC5EF]/50 focus:outline-none ${
                        tabularNums ? 'tabular-nums' : ''
                      }`}
                    />
                  </div>
                </div>

                <Input
                  label="Validação de Erro Crítico (ERROR / DANGER #DF2929)"
                  defaultValue="R$ -99.999,00"
                  error="Valor excede o limite de segurança configurado para lançamentos sem comprovante."
                />

                <div className="relative pt-1">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]"
                    strokeWidth={iconStroke}
                  />
                  <input
                    type="text"
                    placeholder="Busca rápida com ícone Lucide integrado..."
                    className="h-10 w-full rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-[#F4F4F5]/60 dark:bg-[#09090B] pl-10 pr-4 text-sm text-[#18181B] dark:text-[#F4F4F5] placeholder:text-[#71717A] focus:border-[#DC2626] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: TYPOGRAPHY & TABULAR NUMS */}
        {showTypography && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#0CB853] bg-[#BCE5CB]/30 text-xs font-bold text-[#0CB853]">
                04
              </span>
              <h2 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">
                Hierarquia Tipográfica & Alinhamento Tabular
              </h2>
            </div>

            <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-6 divide-y divide-[#E4E4E7] dark:divide-[#27272A]">
              <div className="pb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#DC2626] font-semibold">
                    Display KPI • 30px / Bold / Tabular-Nums
                  </span>
                  <p
                    className={`mt-1 text-3xl font-bold tracking-tight text-[#18181B] dark:text-[#F4F4F5] ${
                      tabularNums ? 'tabular-nums' : ''
                    }`}
                  >
                    R$ {sampleAmount}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold text-[#0CB853] ${tabularNums ? 'tabular-nums' : ''}`}
                  >
                    + R$ 8.500,00
                  </span>
                  <span
                    className={`text-lg font-bold text-[#DF2929] ${tabularNums ? 'tabular-nums' : ''}`}
                  >
                    - R$ 3.195,80
                  </span>
                </div>
              </div>

              <div className="py-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#692296] font-semibold">
                    Heading H1 • 24px / Semibold
                  </span>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
                    Fluxo de Caixa Mensal & Inteligência Artificial
                  </p>
                </div>
                <span className="text-xs font-mono text-[#71717A]">font-semibold tracking-tight</span>
              </div>

              <div className="pt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#71717A]">
                    Body & Caption • 14px / 12px
                  </span>
                  <p className="mt-1 text-sm text-[#18181B] dark:text-[#F4F4F5]">
                    Transações extraídas via OCR permanecem em modo Rascunho até sua validação explícita.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#71717A]">leading-relaxed</span>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: LUCIDE ICONS GALLERY */}
        {showIcons && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#2572CE] bg-[#BCD6F2]/40 text-xs font-bold text-[#2572CE]">
                05
              </span>
              <h2 className="text-xl font-bold text-[#18181B] dark:text-[#F4F4F5]">
                Biblioteca de Ícones Lucide (Stroke {iconStroke}px)
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
              {[
                { icon: Wallet, name: 'Wallet', color: '#DC2626' },
                { icon: TrendingUp, name: 'TrendingUp', color: '#0CB853' },
                { icon: TrendingDown, name: 'TrendingDown', color: '#DF2929' },
                { icon: Sparkles, name: 'Sparkles', color: '#692296' },
                { icon: FileUp, name: 'FileUp', color: '#692296' },
                { icon: ShieldCheck, name: 'ShieldCheck', color: '#2572CE' },
                { icon: AlertTriangle, name: 'AlertTriangle', color: '#EA920F' },
                { icon: Plus, name: 'Plus', color: '#DC2626' },
                { icon: Trash2, name: 'Trash2', color: '#DF2929' },
                { icon: Bell, name: 'Bell', color: '#EA920F' },
                { icon: Type, name: 'Type', color: '#71717A' },
                { icon: MousePointerClick, name: 'Click', color: '#2572CE' },
              ].map(({ icon: IconComponent, name, color }) => (
                <div
                  key={name}
                  className="group flex flex-col items-center justify-center rounded-xl border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#DC2626]"
                >
                  <IconComponent
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                    style={{ color }}
                    strokeWidth={iconStroke}
                  />
                  <span className="mt-2 font-mono text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
