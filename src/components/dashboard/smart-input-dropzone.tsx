"use client";

import * as React from "react";
import {
  AlertTriangle,
  ClipboardPaste,
  FileText,
  PenLine,
  Sparkles,
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
import { processSmartInputAction } from "@/app/actions/transactions";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/lib/ai/ocr-parser";
import type { TransactionInput } from "@/lib/schemas/transaction";

interface SmartInputDropzoneProps {
  onDraftExtracted: (
    items: TransactionInput[],
    fileName: string,
    mode?: "GEMINI_API" | "SMART_SIMULATION"
  ) => void;
  onOpenManualFallback: () => void;
}

const PROCESSING_STEPS = [
  "Validando assinatura de segurança (Magic Bytes)...",
  "Enviando documento para o cofre do Supabase Storage...",
  "Nossa IA está lendo o extrato e categorizando os lançamentos...",
] as const;

export function SmartInputDropzone({
  onDraftExtracted,
  onOpenManualFallback,
}: SmartInputDropzoneProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const validateFileClientSide = (file: File): string | null => {
    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));
    const hasValidMime = (ALLOWED_MIME_TYPES as readonly string[]).includes(
      file.type
    );

    if (!hasValidExt && !hasValidMime) {
      return "Formato não suportado. Envie um extrato em PDF ou imagem (PNG, JPG, WEBP).";
    }

    if (file.size === 0) {
      return "O arquivo selecionado está vazio (0 bytes).";
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return "O arquivo excede o limite máximo de 10MB.";
    }

    return null;
  };

  const handleFileSubmission = React.useCallback(
    async (file: File) => {
      setErrorMsg(null);
      const clientValidationError = validateFileClientSide(file);
      if (clientValidationError) {
        setErrorMsg(clientValidationError);
        return;
      }

      setIsProcessing(true);
      setStepIndex(0);

      const timer1 = setTimeout(() => setStepIndex(1), 350);
      const timer2 = setTimeout(() => setStepIndex(2), 750);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await processSmartInputAction(formData);

        if (!response.success || !response.data) {
          setErrorMsg(
            response.error ||
              "Não conseguimos ler este comprovante. Deseja preencher manualmente?"
          );
          return;
        }

        onDraftExtracted(response.data, file.name, response.mode);
      } catch {
        setErrorMsg(
          "Falha de comunicação ao processar o arquivo. Deseja preencher manualmente?"
        );
      } finally {
        clearTimeout(timer1);
        clearTimeout(timer2);
        setIsProcessing(false);
      }
    },
    [onDraftExtracted]
  );

  // Suporte global a Ctrl+V (Colar print diretamente no Dashboard - skill_user_flows.md)
  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.kind === "file") {
          const pastedFile = item.getAsFile();
          if (pastedFile) {
            event.preventDefault();
            void handleFileSubmission(pastedFile);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFileSubmission]);

  return (
    <Card className="border-slate-200/90 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles
                className="h-4 w-4 text-violet-600"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Smart Input com IA (OCR Contextual)
            </CardTitle>
            <Badge variant="purple">Beta</Badge>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
            <ClipboardPaste
              className="h-3.5 w-3.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            Dica: pressione <kbd className="rounded border px-1 py-0.5 text-[11px]">Ctrl+V</kbd> para colar um print
          </span>
        </div>
        <CardDescription>
          Arraste seu extrato PDF ou foto de comprovante. A IA extrai os dados e
          abre um <strong>Rascunho (Draft)</strong> para sua revisão antes de
          afetar o saldo.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
              void handleFileSubmission(droppedFile);
            }
          }}
          className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all ${
            isDragging
              ? "border-violet-500 bg-violet-50/40 dark:bg-violet-950/20"
              : "border-slate-300 bg-slate-50/50 hover:border-rose-400 dark:border-zinc-700 dark:bg-zinc-900/40"
          }`}
        >
          <input
            ref={fileInputRef}
            data-testid="smart-input-file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                void handleFileSubmission(selected);
                e.target.value = "";
              }
            }}
          />

          {isProcessing ? (
            <div
              role="status"
              aria-live="polite"
              className="flex w-full max-w-md flex-col items-center space-y-3 py-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-300 bg-violet-50 text-violet-600">
                <Sparkles
                  className="h-5 w-5 animate-pulse"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-zinc-100">
                {PROCESSING_STEPS[stepIndex]}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-600 dark:border-zinc-700 dark:bg-zinc-800">
                <UploadCloud
                  className="h-5 w-5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-800 dark:text-zinc-200">
                Arraste e solte sua fatura PDF ou print de PIX aqui
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                PDF, PNG, JPG ou WEBP (máx. 10MB) • Validação Magic Bytes ativa
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  icon={FileText}
                  data-testid="select-document-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Selecionar Extrato ou Recibo
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Prevenção de Dead-Ends (skill_user_flows.md Regra 3 & skill_accessibility.md Regra 5) */}
        {errorMsg ? (
          <div
            role="alert"
            data-testid="smart-input-error"
            className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 sm:flex-row sm:items-center dark:border-red-900/60 dark:bg-red-950/30"
          >
            <div className="flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold">
                  Não foi possível concluir a leitura automática
                </p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="expense"
              icon={PenLine}
              onClick={onOpenManualFallback}
            >
              Preencher Manualmente
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
