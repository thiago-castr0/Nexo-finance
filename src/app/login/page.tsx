"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithPasswordAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await loginWithPasswordAction(formData);
      if (!res.success) {
        setError(res.error || "Falha ao entrar.");
      } else {
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-x-hidden bg-gradient-to-br from-[#F5ECFB] via-[#FFFFFF] to-[#FDECEC] text-[#18181B] dark:from-[#0F0A19] dark:via-[#09090B] dark:to-[#160A0D] dark:text-[#F4F4F5]">
      {/* Luzes de fundo da marca 2TP */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-16 h-[480px] w-[480px] rounded-full blur-[130px] bg-[#692296]/20 dark:bg-[#692296]/25" />
        <div className="absolute top-1/3 -right-16 h-[460px] w-[460px] rounded-full blur-[130px] bg-[#DC2626]/18 dark:bg-[#DC2626]/20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card em Vidro Branco Translúcido */}
        <div className="rounded-3xl border border-[#E4E4E7] bg-white/88 p-8 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(105,34,150,0.12)] dark:border-[#27272A] dark:bg-[#18181B]/90">
          {/* Header da Marca */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-sm mb-2">
              <Flame className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#18181B] dark:text-white">
              Acesse sua Carteira
            </h1>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Nexo Finance • Controle Pessoal Inteligente com IA
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2.5 rounded-2xl border border-[#F4948C] bg-[#F9C5BD]/40 p-3.5 text-xs font-bold text-[#DF2929] dark:border-[#DF2929]/40 dark:bg-[#DF2929]/15 dark:text-[#EC6862]"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-[#18181B] dark:text-white mb-1.5"
              >
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                icon={Mail}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-[#18181B] dark:text-white"
                >
                  Senha
                </label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                icon={Lock}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                isLoading={isPending}
                className="w-full justify-center"
              >
                Entrar na Conta
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E4E4E7] dark:border-[#27272A] text-center">
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Ainda não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-bold text-[#DC2626] hover:underline dark:text-[#E85950]"
              >
                Criar cadastro
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/design-system"
            className="text-[11px] font-semibold text-[#71717A] hover:underline dark:text-[#A1A1AA]"
          >
            Ver Catálogo do Design System
          </Link>
        </div>
      </div>
    </div>
  );
}
