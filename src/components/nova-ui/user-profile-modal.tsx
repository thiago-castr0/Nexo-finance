"use client";

import * as React from "react";
import {
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  X,
  Calendar,
  Save,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateUserProfileAction,
  updatePasswordAction,
  type UserProfileData,
} from "@/app/actions/auth";

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: UserProfileData;
  onProfileUpdate?: (profile: UserProfileData) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  initialProfile,
  onProfileUpdate,
}: UserProfileModalProps) {
  const [profile, setProfile] = React.useState<UserProfileData>(() => ({
    id: initialProfile?.id || "demo-user",
    email: initialProfile?.email || "usuario@nexofinance.com.br",
    fullName: initialProfile?.fullName || "Investidor Nexo",
    createdAt: initialProfile?.createdAt || new Date().toISOString(),
  }));

  const [fullNameInput, setFullNameInput] = React.useState(profile.fullName);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isPending, startTransition] = React.useTransition();

  if (!isOpen) return null;

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = new Date(profile.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await updateUserProfileAction(fullNameInput);
      if (res.success) {
        const updated = { ...profile, fullName: fullNameInput };
        setProfile(updated);
        if (onProfileUpdate) onProfileUpdate(updated);
        setFeedback({
          type: "success",
          message: res.message || "Nome atualizado com sucesso!",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Erro ao salvar perfil.",
        });
      }
    });
  }

  function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 6) {
      setFeedback({
        type: "error",
        message: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "As senhas informadas não coincidem.",
      });
      return;
    }

    startTransition(async () => {
      const res = await updatePasswordAction(newPassword);
      if (res.success) {
        setNewPassword("");
        setConfirmPassword("");
        setIsChangingPassword(false);
        setFeedback({
          type: "success",
          message: res.message || "Senha alterada com sucesso!",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Erro ao alterar senha.",
        });
      }
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-[#E4E4E7] bg-white text-[#18181B] shadow-2xl backdrop-blur-2xl dark:border-[#27272A] dark:bg-[#18181B] dark:text-[#F4F4F5] overflow-hidden">
        {/* Topo com Gradiente Sutil Nexo */}
        <div className="relative border-b border-[#E4E4E7] bg-gradient-to-r from-[#692296]/10 via-transparent to-[#DC2626]/10 px-6 py-5 dark:border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar com Iniciais */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#692296] to-[#DC2626] text-sm font-extrabold text-white shadow-md">
                {initials || "NX"}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold tracking-tight text-[#18181B] dark:text-[#FFFFFF] truncate">
                  {profile.fullName}
                </h3>
                <p className="flex items-center gap-1 text-xs text-[#71717A] dark:text-[#A1A1AA] truncate">
                  <Mail className="h-3 w-3" />
                  {profile.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-[#71717A] hover:bg-black/5 hover:text-[#18181B] dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {feedback && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                feedback.type === "success"
                  ? "bg-[#BCE5CB]/50 text-[#0CB853] dark:bg-[#0CB853]/20"
                  : "bg-[#F9C5BD]/50 text-[#DF2929] dark:bg-[#DF2929]/20"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Dados Gerais */}
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label
                htmlFor="user-fullname"
                className="block text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
              >
                Nome Completo
              </label>
              <Input
                id="user-fullname"
                icon={User}
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA] pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Membro desde {formattedDate}
              </span>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                icon={Save}
                disabled={isPending || fullNameInput === profile.fullName}
              >
                {isPending ? "Salvando..." : "Salvar Nome"}
              </Button>
            </div>
          </form>

          {/* Seção de Segurança / Senha */}
          <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5]/60 p-4 dark:border-[#27272A] dark:bg-[#121216] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#692296]" />
                <span className="text-xs font-bold text-[#18181B] dark:text-white">
                  Segurança & Senha
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="neutral"
                icon={KeyRound}
                onClick={() => setIsChangingPassword((prev) => !prev)}
              >
                {isChangingPassword ? "Cancelar" : "Alterar Senha"}
              </Button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2">
                <div>
                  <label
                    htmlFor="new-pwd"
                    className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
                  >
                    Nova Senha (mínimo 6 dígitos)
                  </label>
                  <Input
                    id="new-pwd"
                    type="password"
                    icon={Lock}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-pwd"
                    className="block text-[11px] font-bold text-[#71717A] dark:text-[#A1A1AA] mb-1"
                  >
                    Confirmar Nova Senha
                  </label>
                  <Input
                    id="confirm-pwd"
                    type="password"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={isPending || !newPassword}
                  >
                    {isPending ? "Atualizando..." : "Confirmar Nova Senha"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Selo de Proteção */}
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#692296]/5 to-[#0CB853]/5 p-3 text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
            <ShieldCheck className="h-4 w-4 text-[#0CB853] shrink-0" />
            <span>
              Seus dados e comprovantes são protegidos por Row Level Security (RLS) e criptografia em repouso no Supabase Cloud.
            </span>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end border-t border-[#E4E4E7] px-6 py-3.5 dark:border-[#27272A]">
          <Button type="button" size="sm" variant="neutral" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
