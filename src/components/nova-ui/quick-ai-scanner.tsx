"use client";

import * as React from "react";
import {
  AlertCircle,
  FileUp,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { processSmartInputAction } from "@/app/actions/transactions";
import type { TransactionInput } from "@/lib/schemas/transaction";

export interface QuickAiScannerProps {
  onDraftExtracted: (
    items: TransactionInput[],
    fileName: string,
    mode?: "GEMINI_API" | "SMART_SIMULATION"
  ) => void;
  onOpenManualModal: () => void;
}

export function QuickAiScanner({
  onDraftExtracted,
  onOpenManualModal,
}: QuickAiScannerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function processFile(file: File) {
    setErrorMsg(null);
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await processSmartInputAction(formData);
      if (!result.success || !result.data) {
        setErrorMsg(result.error ?? "Não foi possível ler este comprovante.");
        return;
      }
      onDraftExtracted(result.data, file.name, result.mode);
    });
  }

  function handleSimulateOneClick() {
    setErrorMsg(null);
    const pdfHeader = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
    ]);
    const mockFile = new File([pdfHeader], "fatura-cartao-novembro.pdf", {
      type: "application/pdf",
    });
    processFile(mockFile);
  }

  return (
    <div className="rounded-3xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#27272A] dark:bg-[#141418] space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-white">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
              Scanner IA de Comprovantes
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Extraia notas, recibos PIX ou faturas PDF
            </p>
          </div>
        </div>
        <Badge variant="purple" icon={Sparkles}>
          Automático
        </Badge>
      </div>

      {/* Dropzone Tátil Compacto */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) processFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition cursor-pointer ${
          isDragging
            ? "border-[#692296] bg-[#DEC5EF]/25"
            : "border-[#D4D4D8] bg-[#F8FAFC] hover:border-[#692296] dark:border-[#3F3F46] dark:bg-[#0D0D11]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
            e.target.value = "";
          }}
        />

        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DEC5EF]/45 text-[#692296] dark:bg-[#692296]/25 dark:text-[#C59BE3]">
          <UploadCloud className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
          Solte seu arquivo aqui ou clique para enviar
        </p>
        <p className="mt-0.5 text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
          PDF, PNG, JPG ou WEBP (até 5 MB)
        </p>

        <div
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={FileUp}
            isLoading={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            Escolher Arquivo
          </Button>
          <Button
            type="button"
            variant="neutral"
            size="sm"
            icon={Sparkles}
            disabled={isPending}
            onClick={handleSimulateOneClick}
          >
            Testar Exemplo IA
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[#DF2929] bg-[#F9C5BD]/30 p-3 text-xs font-medium text-[#18181B] dark:text-[#F4F4F5]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#DF2929]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Rodapé de Entrada Manual Rápida */}
      <div className="flex items-center justify-between rounded-2xl border border-[#E4E4E7] bg-[#F8FAFC] px-4 py-3 dark:border-[#27272A] dark:bg-[#0D0D11]">
        <span className="text-xs font-semibold text-[#3F3F46] dark:text-[#D4D4D8]">
          Prefere digitar uma despesa avulsa?
        </span>
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenManualModal}
        >
          Digitar
        </Button>
      </div>
    </div>
  );
}
