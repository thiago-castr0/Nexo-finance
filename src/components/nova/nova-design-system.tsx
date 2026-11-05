"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  FileUp,
  Flame,
  Info,
  LayoutGrid,
  MousePointerClick,
  Palette,
  Plus,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch, ThemeSwitch } from "@/components/ui/switch";
import { ProgressBar } from "@/components/ui/progress-bar";
import { WalletHeroCard } from "@/components/nova-ui/wallet-hero-card";
import { CategoryEnvelopes } from "@/components/nova-ui/category-envelopes";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface ColorSwatchGroup {
  family: string;
  role: string;
  swatches: { step: string; hex: string; token: string }[];
}

const BRAND_SWATCH_GROUPS: ColorSwatchGroup[] = [
  {
    family: "RED (Marca Primária 2TP)",
    role: "CTAs principais, destaque ativo e identidade",
    swatches: [
      { step: "500", hex: "#DC2626", token: "--nexo-red-500" },
      { step: "400", hex: "#E85950", token: "--nexo-red-400" },
      { step: "300", hex: "#EE7870", token: "--nexo-red-300" },
      { step: "200", hex: "#F59B92", token: "--nexo-red-200" },
      { step: "100", hex: "#FACBC2", token: "--nexo-red-100" },
    ],
  },
  {
    family: "PURPLE (IA & Automação 2TP)",
    role: "Scanner IA, OCR e Modo Rascunho",
    swatches: [
      { step: "500", hex: "#692296", token: "--nexo-purple-500" },
      { step: "400", hex: "#7E32B5", token: "--nexo-purple-400" },
      { step: "300", hex: "#A466D1", token: "--nexo-purple-300" },
      { step: "200", hex: "#C59BE3", token: "--nexo-purple-200" },
      { step: "100", hex: "#DEC5EF", token: "--nexo-purple-100" },
    ],
  },
  {
    family: "SUCCESS (Entradas & Receitas)",
    role: "Saldo positivo (+ R$) e metas saudáveis",
    swatches: [
      { step: "500", hex: "#0CB853", token: "--nexo-success-500" },
      { step: "400", hex: "#13BD5B", token: "--nexo-success-400" },
      { step: "300", hex: "#46C87D", token: "--nexo-success-300" },
      { step: "200", hex: "#7BD6A0", token: "--nexo-success-200" },
      { step: "100", hex: "#BCE5CB", token: "--nexo-success-100" },
    ],
  },
  {
    family: "DANGER (Saídas & Despesas)",
    role: "Valores negativos (- R$) e exclusão",
    swatches: [
      { step: "500", hex: "#DF2929", token: "--nexo-danger-500" },
      { step: "400", hex: "#E54541", token: "--nexo-danger-400" },
      { step: "300", hex: "#EC6862", token: "--nexo-danger-300" },
      { step: "200", hex: "#F4948C", token: "--nexo-danger-200" },
      { step: "100", hex: "#F9C5BD", token: "--nexo-danger-100" },
    ],
  },
  {
    family: "ALERT (Atenção & Limites)",
    role: "Avisos de teto de gastos (80%+)",
    swatches: [
      { step: "500", hex: "#EA920F", token: "--nexo-alert-500" },
      { step: "400", hex: "#EDAD12", token: "--nexo-alert-400" },
      { step: "300", hex: "#ECC023", token: "--nexo-alert-300" },
      { step: "200", hex: "#ECD54A", token: "--nexo-alert-200" },
      { step: "100", hex: "#EDE08D", token: "--nexo-alert-100" },
    ],
  },
  {
    family: "INFO (Suporte & Sistema)",
    role: "Dicas, filtros e estados informativos",
    swatches: [
      { step: "500", hex: "#2572CE", token: "--nexo-info-500" },
      { step: "400", hex: "#448BDE", token: "--nexo-info-400" },
      { step: "300", hex: "#65A2E6", token: "--nexo-info-300" },
      { step: "200", hex: "#8CB9EB", token: "--nexo-info-200" },
      { step: "100", hex: "#BCD6F2", token: "--nexo-info-100" },
    ],
  },
];

const DEMO_ENVELOPE_TXS: TransactionRecord[] = [
  {
    id: "ds-1",
    description: "Aluguel Mensal",
    amount: 2200,
    type: "EXPENSE",
    category: "Moradia",
    transactionDate: "2026-11-01",
    status: "COMPLETED",
    source: "MANUAL",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "ds-2",
    description: "Supermercado",
    amount: 890,
    type: "EXPENSE",
    category: "Alimentação",
    transactionDate: "2026-11-02",
    status: "COMPLETED",
    source: "AI_OCR",
    createdAt: "2026-11-02T10:00:00Z",
  },
];

type StudioChapter = "ALL" | "COLORS" | "BUTTONS" | "FINTECH" | "FORMS";

export function NovaDesignSystem() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [chapter, setChapter] = React.useState<StudioChapter>("ALL");
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [simLoading, setSimLoading] = React.useState(false);
  const [demoSwitchAi, setDemoSwitchAi] = React.useState(true);
  const [demoSwitchAlert, setDemoSwitchAlert] = React.useState(true);
  const [demoInputVal, setDemoInputVal] = React.useState("1.450,00");

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  function copyHex(val: string) {
    navigator.clipboard.writeText(val);
    setCopiedToken(val);
    setTimeout(() => setCopiedToken(null), 1600);
  }

  const sidebarLinks: {
    id: StudioChapter;
    label: string;
    icon: typeof LayoutGrid;
  }[] = [
    { id: "ALL", label: "Catálogo Completo v5", icon: LayoutGrid },
    { id: "COLORS", label: "Cores & Tokens 2TP", icon: Palette },
    { id: "BUTTONS", label: "Botões Single-Line", icon: MousePointerClick },
    { id: "FINTECH", label: "Wallet Card & Envelopes", icon: CreditCard },
    { id: "FORMS", label: "Inputs, Badges & Switches", icon: Sliders },
  ];

  const showColors = chapter === "ALL" || chapter === "COLORS";
  const showButtons = chapter === "ALL" || chapter === "BUTTONS";
  const showFintech = chapter === "ALL" || chapter === "FINTECH";
  const showForms = chapter === "ALL" || chapter === "FORMS";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#09090B] text-[#F4F4F5]"
          : "bg-[#F8FAFC] text-[#18181B]"
      }`}
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* ====================================================================
            SIDEBAR DO DESIGN SYSTEM STUDIO v5.0
            ==================================================================== */}
        <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between border-r border-[#E4E4E7] bg-white px-4 py-6 dark:border-[#27272A] dark:bg-[#121216]">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-white shadow-sm">
                <Palette className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                  Nexo Studio
                </span>
                <p className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
                  Design System v5.0 (3001)
                </p>
              </div>
            </div>

            <nav aria-label="Capítulos do Design System" className="space-y-1.5">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
                Documentação Viva
              </p>
              {sidebarLinks.map((item) => {
                const Icon = item.icon;
                const active = chapter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChapter(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-gradient-to-r from-[#692296] to-[#DC2626] text-white shadow-sm"
                        : "text-[#3F3F46] hover:bg-[#F4F4F5] dark:text-[#D4D4D8] dark:hover:bg-[#1E1E24]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3 border-t border-[#E4E4E7] pt-4 dark:border-[#27272A]">
            <Link href="/" className="block">
              <Button variant="primary" size="md" icon={ArrowLeft} className="w-full">
                Voltar para Carteira
              </Button>
            </Link>
          </div>
        </aside>

        {/* ====================================================================
            ÁREA PRINCIPAL DO DESIGN SYSTEM STUDIO
            ==================================================================== */}
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/90 backdrop-blur-md dark:border-[#27272A] dark:bg-[#121216]/90">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                    Nexo Design System Studio
                  </h1>
                  <Badge variant="purple" icon={Sparkles}>
                    Proposta v5.0 • 3001
                  </Badge>
                </div>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] hidden sm:block">
                  Componentes limpos, tokens semânticos e botões de linha única
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
                <Link href="/">
                  <Button variant="primary" size="md" icon={ArrowLeft}>
                    Voltar ao App
                  </Button>
                </Link>
              </div>
            </div>

            {/* Abas Mobile */}
            <div className="flex lg:hidden overflow-x-auto gap-1.5 border-t border-[#E4E4E7] px-4 py-2 dark:border-[#27272A]">
              {sidebarLinks.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={chapter === item.id ? "primary" : "neutral"}
                  icon={item.icon}
                  onClick={() => setChapter(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-8">
            {/* 1. PALETA DE CORES & TOKENS */}
            {showColors && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-4 dark:border-[#27272A]">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                      01. Escala Cromática Oficial 2TP (Clique para copiar HEX)
                    </h2>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                      6 famílias em 5 níveis (500 a 100) + escala neutra de alto contraste
                    </p>
                  </div>
                  <Badge variant="brand" icon={Flame}>
                    38 Tokens Semânticos
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {BRAND_SWATCH_GROUPS.map((group) => (
                    <div
                      key={group.family}
                      className="rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 dark:border-[#27272A] dark:bg-[#0D0D11] space-y-3"
                    >
                      <div>
                        <h3 className="text-sm font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                          {group.family}
                        </h3>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                          {group.role}
                        </p>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {group.swatches.map((sw) => {
                          const isCopied = copiedToken === sw.hex;
                          return (
                            <button
                              key={sw.hex}
                              type="button"
                              onClick={() => copyHex(sw.hex)}
                              className="group flex flex-col items-center rounded-xl border border-[#E4E4E7] bg-white p-1.5 text-center transition hover:scale-105 dark:border-[#27272A] dark:bg-[#141418] cursor-pointer"
                              title={`Copiar ${sw.hex}`}
                            >
                              <span
                                className="h-8 w-full rounded-lg border border-black/10"
                                style={{ backgroundColor: sw.hex }}
                              />
                              <span className="mt-1 text-[10px] font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                                {sw.step}
                              </span>
                              <span className="text-[9px] font-mono text-[#71717A] dark:text-[#A1A1AA]">
                                {isCopied ? "Copiado!" : sw.hex}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. BOTÕES SINGLE-LINE & ESTADOS */}
            {showButtons && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-4 dark:border-[#27272A]">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                      02. Botões Single-Line (Lucide Icon + Texto)
                    </h2>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                      Regra estrita: nunca quebram em duas linhas, fundo sólido nítido e alvos de toque confortáveis
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Sparkles}
                    onClick={() => setSimLoading((p) => !p)}
                  >
                    {simLoading ? "Desativar Spinner" : "Testar Estado Loading"}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" icon={Plus} isLoading={simLoading}>
                    Primary (#DC2626)
                  </Button>
                  <Button variant="secondary" icon={Sparkles} isLoading={simLoading}>
                    Secondary IA (#692296)
                  </Button>
                  <Button variant="income" icon={CheckCircle2}>
                    Income (#0CB853)
                  </Button>
                  <Button variant="expense" icon={Trash2}>
                    Expense (#DF2929)
                  </Button>
                  <Button variant="warning" icon={AlertTriangle}>
                    Warning (#EA920F)
                  </Button>
                  <Button variant="neutral" icon={FileUp}>
                    Neutral Outline
                  </Button>
                  <Button variant="ghost" icon={Info}>
                    Ghost Action
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-[#E4E4E7] pt-4 dark:border-[#27272A]">
                  <Button size="sm" variant="primary" icon={Wallet}>
                    Tamanho SM (36px)
                  </Button>
                  <Button size="md" variant="primary" icon={Wallet}>
                    Tamanho MD (40px)
                  </Button>
                  <Button size="lg" variant="primary" icon={Wallet}>
                    Tamanho LG (44px Mobile Target)
                  </Button>
                </div>
              </section>
            )}

            {/* 3. COMPONENTES FINTECH v5.0 (WALLET HERO CARD & ENVELOPES) */}
            {showFintech && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418] space-y-6">
                <div className="border-b border-[#E4E4E7] pb-4 dark:border-[#27272A]">
                  <h2 className="text-lg font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                    03. Componentes Fintech v5.0 (WalletHeroCard & CategoryEnvelopes)
                  </h2>
                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                    Novos blocos reutilizáveis criados especificamente para a proposta da porta 3001
                  </p>
                </div>

                <WalletHeroCard
                  totalBalance={6510.0}
                  totalIncome={9200.0}
                  totalExpenses={2690.0}
                  transactionCount={5}
                  onOpenManualEntry={() => {}}
                  onTriggerAiSimulation={() => {}}
                />

                <CategoryEnvelopes
                  transactions={DEMO_ENVELOPE_TXS}
                  totalIncome={9200}
                  totalExpenses={3090}
                />
              </section>
            )}

            {/* 4. INPUTS, BADGES & SWITCHES */}
            {showForms && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418] space-y-6">
                <div className="border-b border-[#E4E4E7] pb-4 dark:border-[#27272A]">
                  <h2 className="text-lg font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                    04. Inputs Monetários, Switches & Badges Sólidos
                  </h2>
                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                    Campos com numerais tabulares, switches acessíveis e badges semânticos
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                        Input Monetário (tabular-nums)
                      </label>
                      <Input
                        icon={Wallet}
                        tabularNums
                        value={demoInputVal}
                        onChange={(e) => setDemoInputVal(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
                        Busca Instantânea
                      </label>
                      <Input
                        icon={Search}
                        placeholder="Filtrar por descrição ou categoria..."
                      />
                    </div>
                    <ProgressBar
                      value={68}
                      variant="gradient"
                      size="md"
                      label="Meta de Economia Mensal"
                      valueLabel="68%"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 dark:border-[#27272A] dark:bg-[#0D0D11] space-y-3">
                      <Switch
                        checked={demoSwitchAi}
                        onCheckedChange={setDemoSwitchAi}
                        variant="purple"
                        label="Leitura Automática por IA"
                        description="Extrai itens de recibos e notas fiscais"
                      />
                      <Switch
                        checked={demoSwitchAlert}
                        onCheckedChange={setDemoSwitchAlert}
                        variant="brand"
                        label="Aviso de Limite de Categoria"
                        description="Notifica quando atingir 80% do envelope"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="brand" icon={Flame}>
                        Marca 2TP
                      </Badge>
                      <Badge variant="purple" icon={Sparkles}>
                        Lido por IA
                      </Badge>
                      <Badge variant="income" icon={CheckCircle2}>
                        Entrada Confirmada
                      </Badge>
                      <Badge variant="expense" icon={AlertTriangle}>
                        Despesa
                      </Badge>
                      <Badge variant="info" icon={ShieldCheck}>
                        WCAG 2.1 AA
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
