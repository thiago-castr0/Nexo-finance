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
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithPasswordAction } from "@/app/actions/auth";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  async function handleGoogleLogin() {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(oauthError.message || "Erro ao conectar com Google.");
        setIsGoogleLoading(false);
      }
    } catch {
      setError("Erro inesperado ao conectar com Google.");
      setIsGoogleLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await registerWithPasswordAction(formData);
      if (!res.success) {
        setError(res.error || "Falha ao criar conta.");
      } else {
        setSuccessMsg(res.message || "Conta criada!");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
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
              Crie sua Conta
            </h1>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Comece a controlar suas finanças com IA em segundos
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

          {successMsg && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2.5 rounded-2xl border border-[#7BD6A0] bg-[#BCE5CB]/40 p-3.5 text-xs font-bold text-[#0CB853] dark:border-[#0CB853]/40 dark:bg-[#0CB853]/15 dark:text-[#46C87D]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
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
              <label
                htmlFor="password"
                className="block text-xs font-bold text-[#18181B] dark:text-white mb-1.5"
              >
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                icon={Lock}
                placeholder="Mínimo 6 caracteres"
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
                Cadastrar Grátis
              </Button>
            </div>
          </form>

          {/* Divisor */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4E4E7] dark:border-[#27272A]" />
            </div>
            <span className="relative bg-white/90 px-3 text-[11px] font-bold text-[#71717A] dark:bg-[#18181B] dark:text-[#A1A1AA]">
              ou cadastre-se com
            </span>
          </div>

          {/* Botão Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex w-full min-h-[44px] items-center justify-center gap-2.5 rounded-2xl border border-[#E4E4E7] bg-white px-4 py-2.5 text-xs font-bold text-[#18181B] shadow-xs transition hover:bg-[#F4F4F5] dark:border-[#27272A] dark:bg-[#121216] dark:text-[#F4F4F5] dark:hover:bg-[#27272A] cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? "Conectando ao Google..." : "Cadastrar com Google"}</span>
          </button>

          <div className="mt-6 pt-6 border-t border-[#E4E4E7] dark:border-[#27272A] text-center">
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-bold text-[#DC2626] hover:underline dark:text-[#E85950]"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
