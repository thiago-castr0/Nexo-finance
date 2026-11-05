"use client";

import * as React from "react";
import {
  AlertTriangle,
  FileText,
  PenLine,
  ScanLine,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
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

export function SmartInputDropzone({
  onDraftExtracted,
  onOpenManualFallback,
}: SmartInputDropzoneProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const validateFileClientSide = (file: File): string | null => {
    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));
    const hasValidMime = (ALLOWED_MIME_TYPES as readonly string[]).includes(
      file.type
    );

    if (!hasValidExt && !hasValidMime) {
      return "Envie um arquivo PDF ou imagem (PNG, JPG).";
    }

    if (file.size === 0) {
      return "O arquivo selecionado está vazio.";
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return "O arquivo excede 10MB.";
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

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await processSmartInputAction(formData);

        if (!response.success || !response.data) {
          setErrorMsg(
            response.error || "Não conseguimos ler este comprovante."
          );
          return;
        }

        onDraftExtracted(response.data, file.name, response.mode);
      } catch {
        setErrorMsg("Erro ao ler o arquivo. Tente novamente.");
      } finally {
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
    <GlassPanel
      intent="ai"
      blur="xl"
      topBeam
      className="flex h-full flex-col justify-between p-5 sm:p-6"
    >
      {/* Cabeçalho Simples e Direto */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#692296]/10 text-[#692296] dark:bg-[#692296]/25 dark:text-[#DEC5EF]">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#18181B] dark:text-[#FFFFFF]">
            Importar com IA
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Envie fatura PDF ou foto de recibo
          </p>
        </div>
      </div>

      {/* Área de Drop Clean */}
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
        onClick={() => fileInputRef.current?.click()}
        className={`my-3 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-4 text-center transition-all duration-150 ${
          isDragging
            ? "border-[#692296] bg-[#DEC5EF]/25"
            : "border-[#D4D4D8] bg-white/90 hover:border-[#692296] dark:border-white/15 dark:bg-[#1C1C22]"
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
            className="flex flex-col items-center space-y-2 py-2"
          >
            <ScanLine
              className="h-6 w-6 animate-pulse text-[#692296]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <p className="text-xs font-medium text-[#18181B] dark:text-[#FFFFFF]">
              Lendo comprovante...
            </p>
          </div>
        ) : (
          <>
            <UploadCloud
              className="h-6 w-6 text-[#692296] dark:text-[#C59BE3]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <p className="mt-2 text-xs font-semibold text-[#18181B] dark:text-[#FFFFFF]">
              Toque para enviar ou solte o arquivo
            </p>
          </>
        )}
      </div>

      {/* 2 Botões Simples em Linha Única */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          icon={Wand2}
          data-testid="simulate-ocr-btn"
          onClick={handleSimulateSampleStatement}
          className="w-full"
        >
          Testar IA
        </Button>

        <Button
          type="button"
          size="sm"
          variant="primary"
          icon={FileText}
          data-testid="select-document-btn"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          Escolher Arquivo
        </Button>
      </div>

      {errorMsg ? (
        <div
          role="alert"
          data-testid="smart-input-error"
          className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-[#DF2929]/40 bg-[#F9C5BD]/25 px-3 py-2 text-xs text-[#DF2929]"
        >
          <span className="inline-flex items-center gap-1.5 truncate">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {errorMsg}
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            icon={PenLine}
            onClick={onOpenManualFallback}
          >
            Manual
          </Button>
        </div>
      ) : null}
    </GlassPanel>
  );
}
