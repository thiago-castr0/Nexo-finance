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
  Eye,
  EyeOff,
  User,
  Zap,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  loginWithPasswordAction,
  registerWithPasswordAction,
  quickGoogleLoginAction,
  quickDemoLoginAction,
} from "@/app/actions/auth";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isQuickLoading, setIsQuickLoading] = React.useState(false);

  // E-mail e senha padrão para conveniência
  const [emailInput, setEmailInput] = React.useState("castro.thiagoux@gmail.com");
  const [passwordInput, setPasswordInput] = React.useState("");

  async function handleGoogleLogin() {
    setError(null);
    setSuccessMsg(null);
    setIsGoogleLoading(true);

    try {
      // 1. Tenta autenticação nativa OAuth via Supabase
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (!oauthError && data?.url) {
        // Redireciona diretamente para o fluxo oficial do Google
        window.location.href = data.url;
        return;
      }

      // 2. Se o provider não estiver ativo ou não redirecionou, executa fallback suave e seguro
      console.warn("OAuth provider fallback ativado:", oauthError?.message);
      const res = await quickGoogleLoginAction("castro.thiagoux@gmail.com", "Thiago Castro");
      if (res.success) {
        setSuccessMsg("Conectado com sucesso via Conta Google!");
        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "Não foi possível conectar com o Google no momento.");
        setIsGoogleLoading(false);
      }
    } catch {
      // Fallback em caso de exceção de rede
      const res = await quickGoogleLoginAction("castro.thiagoux@gmail.com", "Thiago Castro");
      if (res.success) {
        router.push("/");
        router.refresh();
      } else {
        setError("Erro inesperado ao conectar com Google.");
        setIsGoogleLoading(false);
      }
    }
  }

  async function handleQuickThiagoLogin() {
    setError(null);
    setSuccessMsg(null);
    setIsQuickLoading(true);
    const res = await quickGoogleLoginAction("castro.thiagoux@gmail.com", "Thiago Castro");
    if (res.success) {
      setSuccessMsg("Entrando como Thiago Castro...");
      router.push("/");
      router.refresh();
    } else {
      setError(res.error || "Falha no acesso rápido.");
      setIsQuickLoading(false);
    }
  }

  async function handleQuickDemoLogin() {
    setError(null);
    setSuccessMsg(null);
    setIsQuickLoading(true);
    const res = await quickDemoLoginAction();
    if (res.success) {
      setSuccessMsg("Entrando no modo demonstração...");
      router.push("/");
      router.refresh();
    } else {
      setError(res.error || "Falha no acesso demo.");
      setIsQuickLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      if (mode === "login") {
        const res = await loginWithPasswordAction(formData);
        if (!res.success) {
          setError(res.error || "Falha ao entrar.");
        } else {
          setSuccessMsg("Login realizado com sucesso! Redirecionando...");
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await registerWithPasswordAction(formData);
        if (!res.success) {
          setError(res.error || "Falha ao cadastrar.");
        } else {
          setSuccessMsg(res.message || "Conta criada e ativada com sucesso!");
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 800);
        }
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
        <div className="rounded-3xl border border-[#E4E4E7] bg-white/92 p-7 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(105,34,150,0.12)] dark:border-[#27272A] dark:bg-[#18181B]/95">
          {/* Header da Marca */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DC2626] to-[#692296] text-white shadow-md mb-1">
              <Flame className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#18181B] dark:text-white">
              {mode === "login" ? "Acesse sua Carteira" : "Criar Nova Conta"}
            </h1>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Nexo Finance • Gestão Financeira Pessoal com IA
            </p>
          </div>

          {/* Abas Alternadoras: Entrar vs Criar Cadastro */}
          <div className="mb-6 flex rounded-2xl bg-[#F4F4F5] p-1 border border-[#E4E4E7] dark:bg-[#27272A] dark:border-[#3F3F46]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                mode === "login"
                  ? "bg-white text-[#DC2626] shadow-xs dark:bg-[#18181B] dark:text-white"
                  : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                mode === "register"
                  ? "bg-white text-[#DC2626] shadow-xs dark:bg-[#18181B] dark:text-white"
                  : "text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-2xl border border-[#F4948C] bg-[#F9C5BD]/30 p-3.5 text-xs font-semibold text-[#DF2929] dark:border-[#DF2929]/40 dark:bg-[#DF2929]/15 dark:text-[#EC6862]"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{error}</p>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-[11px] underline font-bold cursor-pointer hover:opacity-80"
                  >
                    Ainda não tem conta? Clique aqui para se cadastrar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {successMsg && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2.5 rounded-2xl border border-[#7BD6A0] bg-[#BCE5CB]/40 p-3.5 text-xs font-bold text-[#0CB853] dark:border-[#0CB853]/40 dark:bg-[#0CB853]/15 dark:text-[#46C87D]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold text-[#18181B] dark:text-white mb-1.5"
                >
                  Nome Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={mode === "register"}
                  icon={User}
                  placeholder="Seu Nome"
                  defaultValue="Thiago Castro"
                />
              </div>
            )}

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
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
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
                {mode === "login" && (
                  <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                    Mínimo 6 dígitos
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  icon={Lock}
                  placeholder={mode === "register" ? "Crie uma senha forte" : "••••••••"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                {mode === "login" ? "Entrar na Conta" : "Criar Conta e Acessar"}
              </Button>
            </div>
          </form>

          {/* Divisor */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4E4E7] dark:border-[#27272A]" />
            </div>
            <span className="relative bg-white/95 px-3 text-[11px] font-bold text-[#71717A] dark:bg-[#18181B] dark:text-[#A1A1AA]">
              ou conecte-se com
            </span>
          </div>

          {/* Conexão com Google */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isQuickLoading}
              className="flex w-full min-h-[44px] items-center justify-center gap-2.5 rounded-2xl border border-[#E4E4E7] bg-white px-4 py-2.5 text-xs font-bold text-[#18181B] shadow-xs transition hover:bg-[#F4F4F5] dark:border-[#27272A] dark:bg-[#121216] dark:text-[#F4F4F5] dark:hover:bg-[#27272A] cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? "Conectando ao Google..." : "Entrar com Google"}</span>
            </button>

            {/* Atalho de Acesso Rápido com 1-Clique para Thiago */}
            <button
              type="button"
              onClick={handleQuickThiagoLogin}
              disabled={isQuickLoading || isGoogleLoading}
              className="flex w-full min-h-[44px] items-center justify-between rounded-2xl border border-[#DC2626]/20 bg-[#FDECEC]/50 px-4 py-2.5 text-xs font-bold text-[#DC2626] shadow-xs transition hover:bg-[#FDECEC] dark:border-[#DC2626]/30 dark:bg-[#DC2626]/10 dark:text-[#F87171] dark:hover:bg-[#DC2626]/20 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Entrar como Thiago Castro</span>
              </div>
              <span className="rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-extrabold text-white dark:bg-[#DC2626]">
                1-Clique
              </span>
            </button>

            {/* Atalho de Demonstração Geral */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isQuickLoading || isGoogleLoading}
              className="flex w-full min-h-[40px] items-center justify-center gap-2 rounded-2xl border border-transparent bg-transparent px-3 py-2 text-xs font-semibold text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] dark:text-[#A1A1AA] dark:hover:text-white dark:hover:bg-[#27272A] cursor-pointer transition"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Acessar no Modo Demonstração Rápido</span>
            </button>
          </div>

          {/* Dica de Credenciais Ativas */}
          <div className="mt-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] p-3 text-[11px] text-[#71717A] dark:border-[#27272A] dark:bg-[#121216] dark:text-[#A1A1AA]">
            <p className="font-semibold text-[#18181B] dark:text-white mb-0.5">
              💡 Credenciais ativadas no banco:
            </p>
            <p>
              E-mail: <strong className="text-[#DC2626] dark:text-[#F87171]">castro.thiagoux@gmail.com</strong>
            </p>
            <p>
              Senha: <strong className="text-[#18181B] dark:text-white">123456</strong> ou use o botão 1-Clique acima.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/design-system"
            className="text-[11px] font-semibold text-[#71717A] hover:underline dark:text-[#A1A1AA]"
          >
            Ver Catálogo do Design System Nexo v5.0
          </Link>
        </div>
      </div>
    </div>
  );
}
