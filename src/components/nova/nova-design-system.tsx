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
  swatches: { step: string; hex: string }[];
}

const BRAND_SWATCH_GROUPS: ColorSwatchGroup[] = [
  {
    family: "RED (Primária)",
    swatches: [
      { step: "500", hex: "#DC2626" },
      { step: "400", hex: "#E85950" },
      { step: "300", hex: "#EE7870" },
      { step: "200", hex: "#F59B92" },
      { step: "100", hex: "#FACBC2" },
    ],
  },
  {
    family: "PURPLE (IA)",
    swatches: [
      { step: "500", hex: "#692296" },
      { step: "400", hex: "#7E32B5" },
      { step: "300", hex: "#A466D1" },
      { step: "200", hex: "#C59BE3" },
      { step: "100", hex: "#DEC5EF" },
    ],
  },
  {
    family: "SUCCESS (Entradas)",
    swatches: [
      { step: "500", hex: "#0CB853" },
      { step: "400", hex: "#13BD5B" },
      { step: "300", hex: "#46C87D" },
      { step: "200", hex: "#7BD6A0" },
      { step: "100", hex: "#BCE5CB" },
    ],
  },
  {
    family: "DANGER (Saídas)",
    swatches: [
      { step: "500", hex: "#DF2929" },
      { step: "400", hex: "#E54541" },
      { step: "300", hex: "#EC6862" },
      { step: "200", hex: "#F4948C" },
      { step: "100", hex: "#F9C5BD" },
    ],
  },
  {
    family: "ALERT (Aviso)",
    swatches: [
      { step: "500", hex: "#EA920F" },
      { step: "400", hex: "#EDAD12" },
      { step: "300", hex: "#ECC023" },
      { step: "200", hex: "#ECD54A" },
      { step: "100", hex: "#EDE08D" },
    ],
  },
  {
    family: "INFO (Suporte)",
    swatches: [
      { step: "500", hex: "#2572CE" },
      { step: "400", hex: "#448BDE" },
      { step: "300", hex: "#65A2E6" },
      { step: "200", hex: "#8CB9EB" },
      { step: "100", hex: "#BCD6F2" },
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
    { id: "ALL", label: "Visão Geral", icon: LayoutGrid },
    { id: "COLORS", label: "Cores 2TP", icon: Palette },
    { id: "BUTTONS", label: "Botões", icon: MousePointerClick },
    { id: "FINTECH", label: "Cards da Carteira", icon: CreditCard },
    { id: "FORMS", label: "Inputs & Switches", icon: Sliders },
  ];

  const showColors = chapter === "ALL" || chapter === "COLORS";
  const showButtons = chapter === "ALL" || chapter === "BUTTONS";
  const showFintech = chapter === "ALL" || chapter === "FINTECH";
  const showForms = chapter === "ALL" || chapter === "FORMS";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#0F0A19] via-[#09090B] to-[#160A0D] text-[#F4F4F5]"
          : "bg-gradient-to-br from-[#F5ECFB] via-[#FFFFFF] to-[#FDECEC] text-[#18181B]"
      }`}
    >
      {/* Fundo Mistura Suave Vermelho + Roxo + Branco */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className={`absolute -top-24 -left-16 h-[480px] w-[480px] rounded-full blur-[130px] ${
            darkMode ? "bg-[#692296]/25" : "bg-[#692296]/18"
          }`}
        />
        <div
          className={`absolute top-1/4 -right-16 h-[460px] w-[460px] rounded-full blur-[130px] ${
            darkMode ? "bg-[#DC2626]/20" : "bg-[#DC2626]/15"
          }`}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar em Vidro Branco com Alto Contraste */}
        <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:justify-between border-r border-[#E4E4E7] bg-white/88 backdrop-blur-2xl px-4 py-6 dark:border-[#27272A] dark:bg-[#18181B]/90">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-white">
                <Palette className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                Design System
              </span>
            </div>

            <nav aria-label="Capítulos" className="space-y-1">
              {sidebarLinks.map((item) => {
                const Icon = item.icon;
                const active = chapter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChapter(item.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-gradient-to-r from-[#692296] to-[#DC2626] text-white shadow-xs"
                        : "text-[#18181B] hover:bg-[#F4F4F5] dark:text-[#E4E4E7] dark:hover:bg-[#27272A]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-[#E4E4E7] pt-4 dark:border-[#27272A]">
            <Link href="/" className="block">
              <Button variant="primary" size="sm" icon={ArrowLeft} className="w-full">
                Voltar ao App
              </Button>
            </Link>
          </div>
        </aside>

        {/* Área Principal */}
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/88 backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B]/90">
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
                Nexo Design System
              </h1>

              <div className="flex items-center gap-2">
                <ThemeSwitch darkMode={darkMode} onToggle={setDarkMode} />
                <Link href="/">
                  <Button variant="primary" size="sm" icon={ArrowLeft}>
                    Voltar
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
            {/* 1. CORES */}
            {showColors && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-4">
                <h2 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                  Cores da Marca 2TP
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {BRAND_SWATCH_GROUPS.map((group) => (
                    <div
                      key={group.family}
                      className="rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 dark:border-[#27272A] dark:bg-[#121216] space-y-2.5"
                    >
                      <h3 className="text-xs font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                        {group.family}
                      </h3>

                      <div className="grid grid-cols-5 gap-1.5">
                        {group.swatches.map((sw) => {
                          const isCopied = copiedToken === sw.hex;
                          return (
                            <button
                              key={sw.hex}
                              type="button"
                              onClick={() => copyHex(sw.hex)}
                              className="flex flex-col items-center rounded-xl border border-[#E4E4E7] bg-white p-1.5 text-center transition hover:scale-105 dark:border-[#3F3F46] dark:bg-[#18181B] cursor-pointer"
                            >
                              <span
                                className="h-7 w-full rounded-lg"
                                style={{ backgroundColor: sw.hex }}
                              />
                              <span className="mt-1 text-[10px] font-bold text-[#18181B] dark:text-[#FFFFFF]">
                                {isCopied ? "OK" : sw.step}
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

            {/* 2. BOTÕES */}
            {showButtons && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                    Botões Single-Line
                  </h2>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Sparkles}
                    onClick={() => setSimLoading((p) => !p)}
                  >
                    {simLoading ? "Parar" : "Simular Loading"}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="primary" icon={Plus} isLoading={simLoading}>
                    Primary
                  </Button>
                  <Button variant="secondary" icon={Sparkles} isLoading={simLoading}>
                    Secondary IA
                  </Button>
                  <Button variant="income" icon={CheckCircle2}>
                    Income
                  </Button>
                  <Button variant="expense" icon={Trash2}>
                    Expense
                  </Button>
                  <Button variant="warning" icon={AlertTriangle}>
                    Warning
                  </Button>
                  <Button variant="neutral" icon={FileUp}>
                    Neutral
                  </Button>
                  <Button variant="ghost" icon={Info}>
                    Ghost
                  </Button>
                </div>
              </section>
            )}

            {/* 3. BLOCOS DA CARTEIRA */}
            {showFintech && (
              <section className="space-y-4">
                <WalletHeroCard
                  totalBalance={6510.0}
                  totalIncome={9200.0}
                  totalExpenses={2690.0}
                />
                <CategoryEnvelopes transactions={DEMO_ENVELOPE_TXS} />
              </section>
            )}

            {/* 4. INPUTS & SWITCHES */}
            {showForms && (
              <section className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-4">
                <h2 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
                  Inputs, Switches & Badges
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <Input
                      icon={Wallet}
                      tabularNums
                      value={demoInputVal}
                      onChange={(e) => setDemoInputVal(e.target.value)}
                    />
                    <Input icon={Search} placeholder="Buscar..." />
                    <ProgressBar
                      value={68}
                      variant="gradient"
                      size="md"
                      label="Meta Mensal"
                      valueLabel="68%"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 dark:border-[#27272A] dark:bg-[#121216] space-y-3">
                      <Switch
                        checked={demoSwitchAi}
                        onCheckedChange={setDemoSwitchAi}
                        variant="purple"
                        label="Leitura Automática IA"
                      />
                      <Switch
                        checked={demoSwitchAlert}
                        onCheckedChange={setDemoSwitchAlert}
                        variant="brand"
                        label="Alerta de Limite"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="brand" icon={Flame}>
                        2TP
                      </Badge>
                      <Badge variant="purple" icon={Sparkles}>
                        IA
                      </Badge>
                      <Badge variant="income" icon={CheckCircle2}>
                        Entrada
                      </Badge>
                      <Badge variant="expense" icon={AlertTriangle}>
                        Saída
                      </Badge>
                      <Badge variant="info" icon={ShieldCheck}>
                        Acessível
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
