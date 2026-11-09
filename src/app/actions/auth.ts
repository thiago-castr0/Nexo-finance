"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function loginWithPasswordAction(
  formData: FormData
): Promise<AuthActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return { success: false, error: "Preencha e-mail e senha." };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return {
        success: false,
        error: error?.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : (error?.message || "Erro ao realizar login."),
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("nexo_session", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });
    cookieStore.set("nexo_user_email", data.user.email || "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro inesperado ao autenticar.",
    };
  }
}

export async function registerWithPasswordAction(
  formData: FormData
): Promise<AuthActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return { success: false, error: "Preencha e-mail e senha." };
  }

  if (password.length < 6) {
    return { success: false, error: "A senha deve ter no mínimo 6 caracteres." };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.session) {
      const cookieStore = await cookies();
      cookieStore.set("nexo_session", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      cookieStore.set("nexo_user_email", data.user?.email || "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return {
      success: true,
      message: data.session
        ? "Conta criada com sucesso!"
        : "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro inesperado ao cadastrar.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("nexo_session");
  cookieStore.delete("nexo_user_email");
  redirect("/login");
}

export interface UserProfileData {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export async function getUserProfileAction(): Promise<{
  success: boolean;
  data?: UserProfileData;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    const cookieEmail = cookieStore.get("nexo_user_email")?.value || "";

    if (!token) {
      return {
        success: true,
        data: {
          id: "demo-user",
          email: cookieEmail || "demo@nexofinance.com.br",
          fullName: "Investidor Nexo",
          createdAt: new Date().toISOString(),
        },
      };
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return {
        success: true,
        data: {
          id: "demo-user",
          email: cookieEmail || "demo@nexofinance.com.br",
          fullName: "Investidor Nexo",
          createdAt: new Date().toISOString(),
        },
      };
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email || cookieEmail,
        fullName:
          (data.user.user_metadata?.full_name as string) ||
          data.user.email?.split("@")[0] ||
          "Investidor Nexo",
        createdAt: data.user.created_at,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Erro ao carregar perfil do usuário.",
    };
  }
}

export async function updateUserProfileAction(
  fullName: string
): Promise<AuthActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    if (!token) {
      return { success: true, message: "Nome atualizado localmente!" };
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: "Perfil atualizado com sucesso!" };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Erro ao atualizar dados do perfil.",
    };
  }
}

export async function updatePasswordAction(
  newPassword: string
): Promise<AuthActionResult> {
  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      error: "A nova senha deve ter pelo menos 6 caracteres.",
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    if (!token) {
      return {
        success: false,
        error: "Faça login com uma conta real para alterar a senha.",
      };
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: "Senha alterada com sucesso!" };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Erro ao atualizar a senha.",
    };
  }
}
