"use client";

import {
  FileSpreadsheet,
  PlusCircle,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL } from "@/lib/finance";
import type { TransactionRecord } from "@/lib/schemas/transaction";

interface TransactionsTableProps {
  transactions: TransactionRecord[];
  onDeleteTransaction: (id: string) => void;
  onOpenManualEntry: () => void;
  onTriggerUpload: () => void;
}

export function TransactionsTable({
  transactions,
  onDeleteTransaction,
  onOpenManualEntry,
  onTriggerUpload,
}: TransactionsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-zinc-800">
        <div>
          <CardTitle className="text-base">Histórico de Lançamentos</CardTitle>
          <CardDescription>
            Valores alinhados com numerais tabulares para leitura contábil
            precisa
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="primary"
          icon={PlusCircle}
          data-testid="open-manual-modal-btn"
          onClick={onOpenManualEntry}
        >
          Novo Lançamento Manual
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {transactions.length === 0 ? (
          /* Onboarding Silencioso (Zero State - skill_user_flows.md Regra 1) */
          <div
            data-testid="empty-state"
            className="flex flex-col items-center justify-center px-6 py-14 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-200 bg-violet-50/70 text-violet-600 dark:border-violet-900 dark:bg-violet-950/40">
              <FileSpreadsheet
                className="h-6 w-6"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h4 className="mt-4 text-base font-semibold text-slate-900 dark:text-zinc-100">
              Seu controle financeiro começa aqui
            </h4>
            <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-zinc-400">
              Faça o upload do seu primeiro extrato PDF ou print de comprovante
              para a IA categorizar automaticamente, ou adicione um lançamento
              manual.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                icon={UploadCloud}
                onClick={onTriggerUpload}
              >
                Faça o upload do seu primeiro extrato
              </Button>
              <Button
                type="button"
                variant="neutral"
                icon={PlusCircle}
                onClick={onOpenManualEntry}
              >
                Adicionar manualmente
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              data-testid="transactions-table"
              className="w-full border-collapse text-left text-sm"
            >
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 dark:border-zinc-800">
                  <th className="px-6 py-3.5 font-medium">Descrição</th>
                  <th className="px-6 py-3.5 font-medium">Categoria</th>
                  <th className="px-6 py-3.5 font-medium">Origem</th>
                  <th className="px-6 py-3.5 font-medium">Data</th>
                  <th className="px-6 py-3.5 text-right font-medium">Valor</th>
                  <th className="px-6 py-3.5 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {transactions.map((tx) => {
                  const isIncome = tx.type === "INCOME";
                  return (
                    <tr
                      key={tx.id}
                      data-testid="transaction-row"
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-zinc-100">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral">{tx.category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {tx.source === "AI_OCR" ? (
                          <Badge variant="purple" icon={Sparkles}>
                            IA OCR
                          </Badge>
                        ) : (
                          <Badge variant="info">Manual</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 tabular-nums dark:text-zinc-400">
                        {tx.transactionDate.split("-").reverse().join("/")}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold tabular-nums ${
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isIncome ? "+ " : "- "}
                        {formatCurrencyBRL(tx.amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={`Excluir transação ${tx.description}`}
                          onClick={() => onDeleteTransaction(tx.id)}
                        >
                          <Trash2
                            className="h-4 w-4 text-slate-400 hover:text-red-600"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
