"use client";

import * as React from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Plus,
  CreditCard,
  Target,
  PieChart,
  X,
  FilePlus,
  Sparkles,
  User,
} from "lucide-react";
import type { WorkspaceTab } from "@/components/nova/nexo-nova-app";

export interface MobileBottomNavProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onOpenManualEntry: () => void;
  onOpenScanner: () => void;
  onOpenProfile: () => void;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onOpenManualEntry,
  onOpenScanner,
  onOpenProfile,
}: MobileBottomNavProps) {
  const [isActionSheetOpen, setIsActionSheetOpen] = React.useState(false);

  return (
    <>
      {/* ====================================================================
          BARRA INFERIOR MOBILE COM BOTÃO CENTRAL FLUTUANTE (THUMB ZONE)
          ==================================================================== */}
      <nav
        aria-label="Navegação Mobile Principal"
        className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden items-center justify-around border-t border-[#E4E4E7] bg-white/92 px-3 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.04)] dark:border-[#27272A] dark:bg-[#18181B]/95"
      >
        {/* Aba 1: Início */}
        <button
          type="button"
          onClick={() => onTabChange("OVERVIEW")}
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "OVERVIEW"
              ? "text-[#DC2626] dark:text-[#E85950]"
              : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
          }`}
          aria-label="Ir para Início"
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={activeTab === "OVERVIEW" ? 2.25 : 1.75} />
          <span>Início</span>
        </button>

        {/* Aba 2: Extrato */}
        <button
          type="button"
          onClick={() => onTabChange("TIMELINE")}
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "TIMELINE"
              ? "text-[#DC2626] dark:text-[#E85950]"
              : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
          }`}
          aria-label="Ir para Extrato"
        >
          <ListOrdered className="h-4 w-4 shrink-0" strokeWidth={activeTab === "TIMELINE" ? 2.25 : 1.75} />
          <span>Extrato</span>
        </button>

        {/* BOTÃO CENTRAL ELEVADO (FAB / Quick Action) */}
        <div className="relative -top-3">
          <button
            type="button"
            onClick={() => setIsActionSheetOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#DC2626] to-[#692296] text-white shadow-[0_8px_20px_-4px_rgba(105,34,150,0.45)] transition active:scale-95 cursor-pointer"
            title="Ações Rápidas"
            aria-label="Abrir menu de ações rápidas"
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Aba 3: Cartões */}
        <button
          type="button"
          onClick={() => onTabChange("CARDS")}
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "CARDS"
              ? "text-[#DC2626] dark:text-[#E85950]"
              : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
          }`}
          aria-label="Ir para Cartões de Crédito"
        >
          <CreditCard className="h-4 w-4 shrink-0" strokeWidth={activeTab === "CARDS" ? 2.25 : 1.75} />
          <span>Cartões</span>
        </button>

        {/* Aba 4: Metas & Cofrinhos */}
        <button
          type="button"
          onClick={() => onTabChange("GOALS")}
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "GOALS"
              ? "text-[#DC2626] dark:text-[#E85950]"
              : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
          }`}
          aria-label="Ir para Metas"
        >
          <Target className="h-4 w-4 shrink-0" strokeWidth={activeTab === "GOALS" ? 2.25 : 1.75} />
          <span>Metas</span>
        </button>
      </nav>

      {/* ====================================================================
          ACTION SHEET INFERIOR (BOTTOM SHEET GESTUAL ESTILO IOS)
          ==================================================================== */}
      {isActionSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 lg:hidden"
          onClick={() => setIsActionSheetOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl border-t border-[#E4E4E7] bg-white p-5 pb-8 text-[#18181B] shadow-2xl dark:border-[#27272A] dark:bg-[#18181B] dark:text-white animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Puxador da Sheet */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#E4E4E7] dark:bg-[#3F3F46]" />

            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <span className="text-sm font-extrabold text-[#18181B] dark:text-white">
                Ações Rápidas
              </span>
              <button
                type="button"
                onClick={() => setIsActionSheetOpen(false)}
                className="rounded-full p-1 text-[#71717A] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
                aria-label="Fechar ações"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid de Opções com Touch Targets Confortáveis */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {/* Opção 1: Novo Lançamento Manual */}
              <button
                type="button"
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenManualEntry();
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 text-center transition active:scale-98 hover:border-[#DC2626]/40 dark:border-[#27272A] dark:bg-[#121216]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#DC2626]/20">
                  <FilePlus className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#18181B] dark:text-white">
                    Novo Lançamento
                  </span>
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                    Receita ou Despesa
                  </span>
                </div>
              </button>

              {/* Opção 2: Escanear com IA */}
              <button
                type="button"
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenScanner();
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 text-center transition active:scale-98 hover:border-[#692296]/40 dark:border-[#27272A] dark:bg-[#121216]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#692296]/10 text-[#692296] dark:bg-[#692296]/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#18181B] dark:text-white">
                    Escanear Recibo IA
                  </span>
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                    Gemini 2.5 Flash
                  </span>
                </div>
              </button>

              {/* Opção 3: Gastos por Categoria */}
              <button
                type="button"
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onTabChange("ENVELOPES");
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 text-center transition active:scale-98 dark:border-[#27272A] dark:bg-[#121216]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2572CE]/10 text-[#2572CE] dark:bg-[#2572CE]/20">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#18181B] dark:text-white">
                    Categorias & Limites
                  </span>
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                    Gráfico & Envelopes
                  </span>
                </div>
              </button>

              {/* Opção 4: Perfil & Segurança */}
              <button
                type="button"
                onClick={() => {
                  setIsActionSheetOpen(false);
                  onOpenProfile();
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] p-4 text-center transition active:scale-98 dark:border-[#27272A] dark:bg-[#121216]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0CB853]/10 text-[#0CB853] dark:bg-[#0CB853]/20">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#18181B] dark:text-white">
                    Meu Perfil
                  </span>
                  <span className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                    Conta e Senha
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
