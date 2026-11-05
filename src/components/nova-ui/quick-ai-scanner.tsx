"use client";

import * as React from "react";
import {
  AlertCircle,
  FileUp,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { processSmartInputAction } from "@/app/actions/transactions";
import type { TransactionInput } from "@/lib/schemas/transaction";

export interface QuickAiScannerProps {
  onDraftExtracted: (
    items: TransactionInput[],
    fileName: string,
    mode?: "GEMINI_API" | "SMART_SIMULATION"
  ) => void;
  onOpenManualModal?: () => void;
}

export function QuickAiScanner({
  onDraftExtracted,
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
    const mockFile = new File([pdfHeader], "comprovante-novembro.pdf", {
      type: "application/pdf",
    });
    processFile(mockFile);
  }

  return (
    <div className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-5 sm:p-6 text-[#18181B] backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(105,34,150,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-white">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-extrabold text-[#18181B] dark:text-[#FFFFFF]">
          Importar Recibo com IA
        </h3>
      </div>

      {/* Área de Upload Limpa com Contraste Nítido */}
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
        className={`flex flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center transition cursor-pointer ${
          isDragging
            ? "border-[#692296] bg-[#DEC5EF]/30"
            : "border-[#D4D4D8] bg-[#F8FAFC] hover:border-[#692296] dark:border-[#3F3F46] dark:bg-[#121216]"
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

        <UploadCloud className="mb-2 h-6 w-6 text-[#692296] dark:text-[#C59BE3]" strokeWidth={1.75} />
        <p className="text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]">
          Solte sua nota ou fatura PDF aqui
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
            Enviar Arquivo
          </Button>
          <Button
            type="button"
            variant="neutral"
            size="sm"
            icon={Sparkles}
            disabled={isPending}
            onClick={handleSimulateOneClick}
          >
            Testar IA
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-[#DF2929] bg-[#F9C5BD]/40 p-3 text-xs font-bold text-[#18181B] dark:text-[#FFFFFF]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#DF2929]" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
