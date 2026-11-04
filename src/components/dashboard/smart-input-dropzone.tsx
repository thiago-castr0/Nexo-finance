"use client";

import * as React from "react";
import {
  AlertTriangle,
  ClipboardPaste,
  FileText,
  PenLine,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  "Validando assinatura binária (Magic Bytes)...",
  "Protegendo documento no Supabase Storage...",
  "IA extraindo itens para a Tela de Rascunho...",
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

      const timer1 = setTimeout(() => setStepIndex(1), 300);
      const timer2 = setTimeout(() => setStepIndex(2), 650);

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

  const handleSimulateSampleStatement = () => {
    const pdfMagicBytes = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
    ]);
    const sampleFile = new File(
      [pdfMagicBytes],
      "fatura-nubank-novembro-2026.pdf",
      { type: "application/pdf" }
    );
    void handleFileSubmission(sampleFile);
  };

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
    <Card className="nexo-card-hover relative flex h-full flex-col justify-between overflow-hidden border-[#C59BE3] bg-[#FFFFFF] p-6 hover:border-[#7E32B5] dark:border-[#7E32B5] dark:bg-[#18181B]">
      {/* Faixa Superior Roxo IA -> Vermelho Marca */}
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 h-1.5"
        style={{
          background: "linear-gradient(90deg, #692296 0%, #A466D1 50%, #DC2626 100%)",
        }}
      />

      {/* Cabeçalho do Copiloto Smart Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="purple" icon={Sparkles}>
            Copiloto IA • OCR
          </Badge>
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-[#71717A] dark:text-[#D4D4D8]">
            <ClipboardPaste
              className="h-3 w-3 text-[#692296]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            Atalho{" "}
            <kbd className="rounded border border-[#D4D4D8] bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[10px] dark:border-[#3F3F46] dark:bg-[#09090B]">
              Ctrl+V
            </kbd>
          </span>
        </div>

        <h2 className="text-base font-bold tracking-tight text-[#18181B] dark:text-[#FFFFFF]">
          Smart Input Automatizado
        </h2>
        <p className="text-xs leading-relaxed text-[#71717A] dark:text-[#D4D4D8]">
          Solte extratos PDF ou prints de PIX. A IA categoriza cada item e abre
          o <strong>Modo Rascunho</strong> para sua aprovação.
        </p>
      </div>

      {/* Zona de Drop Interativa */}
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
        className={`my-4 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center transition-all duration-200 ${
          isDragging
            ? "scale-[1.01] border-[#692296] bg-[#DEC5EF]/45 dark:bg-[#692296]/25"
            : "border-[#C59BE3] bg-[#DEC5EF]/15 hover:border-[#7E32B5] hover:bg-[#DEC5EF]/30 dark:border-[#7E32B5]/60 dark:bg-[#09090B]/50"
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
            className="flex w-full flex-col items-center space-y-3 py-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A466D1] bg-[#DEC5EF]/60 text-[#692296]">
              <Sparkles
                className="h-5 w-5 animate-spin"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <p className="text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5]">
              {PROCESSING_STEPS[stepIndex]}
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E4E7] dark:bg-[#3F3F46]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#692296] to-[#DC2626] transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C59BE3] bg-[#FFFFFF] text-[#692296] shadow-2xs transition-transform duration-200 hover:scale-105 dark:border-[#7E32B5] dark:bg-[#18181B] dark:text-[#C59BE3]">
              <UploadCloud
                className="h-5 w-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-xs font-semibold text-[#18181B] dark:text-[#F4F4F5]">
              Arraste seu extrato PDF ou print aqui
            </p>
            <p className="mt-0.5 text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
              Até 10MB • PDF, PNG, JPG ou WEBP
            </p>
          </>
        )}
      </div>

      {/* Botões de Ação (Sempre em linha única com Ícone Lucide + Texto) */}
      <div className="space-y-2.5">
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            icon={Wand2}
            data-testid="simulate-ocr-btn"
            onClick={handleSimulateSampleStatement}
            className="w-full justify-center"
          >
            Simular Extrato IA (1 Clique)
          </Button>

          <Button
            type="button"
            variant="primary"
            icon={FileText}
            data-testid="select-document-btn"
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-center"
          >
            Selecionar Arquivo Local
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#71717A] dark:text-[#D4D4D8]">
          <ShieldCheck
            className="h-3.5 w-3.5 shrink-0 text-[#692296]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="truncate">
            Magic Bytes & Mascaramento de CPF ativos
          </span>
        </div>
      </div>

      {/* Fallback de Erro Amigável */}
      {errorMsg ? (
        <div
          role="alert"
          data-testid="smart-input-error"
          className="mt-3 space-y-2 rounded-xl border border-[#F4948C] bg-[#F9C5BD]/35 p-3 dark:border-[#E54541] dark:bg-[#DF2929]/15"
        >
          <div className="flex items-start gap-2 text-xs text-[#DF2929] dark:text-[#F9C5BD]">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-[#DF2929]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>{errorMsg}</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="expense"
            icon={PenLine}
            onClick={onOpenManualFallback}
            className="w-full"
          >
            Preencher Manualmente
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
