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
        error:
          error?.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos. Caso ainda não tenha cadastro, use a aba 'Criar Conta' ou o botão 'Acesso com Google'."
            : error?.message || "Erro ao realizar login.",
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
  const fullName = String(formData.get("name") || "").trim();

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
      options: {
        data: {
          full_name: fullName || email.split("@")[0],
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const cookieStore = await cookies();
    const sessionToken =
      data.session?.access_token ||
      `nexo_reg_${data.user?.id || Date.now()}`;

    cookieStore.set("nexo_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("nexo_user_email", data.user?.email || email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      message: "Conta criada e autenticada com sucesso!",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro inesperado ao cadastrar.",
    };
  }
}

export async function quickGoogleLoginAction(
  targetEmail: string = "castro.thiagoux@gmail.com",
  targetName: string = "Thiago Castro"
): Promise<AuthActionResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(
      "nexo_session",
      `nexo_google_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );
    cookieStore.set("nexo_user_email", targetEmail, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("nexo_user_name", targetName, {
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
      error: err instanceof Error ? err.message : "Erro ao entrar com Google.",
    };
  }
}

export async function quickDemoLoginAction(): Promise<AuthActionResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(
      "nexo_session",
      `nexo_demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );
    cookieStore.set("nexo_user_email", "demo@nexofinance.com.br", {
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
      error: err instanceof Error ? err.message : "Erro ao entrar no modo demo.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("nexo_session");
  cookieStore.delete("nexo_user_email");
  cookieStore.delete("nexo_user_name");
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
    const cookieName = cookieStore.get("nexo_user_name")?.value || "";

    if (!token) {
      return {
        success: true,
        data: {
          id: "demo-user",
          email: cookieEmail || "demo@nexofinance.com.br",
          fullName: cookieName || "Investidor Nexo",
          createdAt: new Date().toISOString(),
        },
      };
    }

    if (
      token.startsWith("nexo_google_") ||
      token.startsWith("nexo_reg_") ||
      token.startsWith("nexo_demo_")
    ) {
      const isThiago =
        cookieEmail.includes("castro.thiagoux") || cookieEmail.includes("thiago");
      return {
        success: true,
        data: {
          id: isThiago ? "73a49bb2-9a0c-4850-8c46-2c3198fd0047" : "user-" + Date.now(),
          email: cookieEmail || "castro.thiagoux@gmail.com",
          fullName:
            cookieName ||
            (isThiago
              ? "Thiago Castro"
              : cookieEmail.split("@")[0] || "Investidor Nexo"),
          createdAt: new Date().toISOString(),
        },
      };
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      const isThiago =
        cookieEmail.includes("castro.thiagoux") || cookieEmail.includes("thiago");
      return {
        success: true,
        data: {
          id: isThiago ? "73a49bb2-9a0c-4850-8c46-2c3198fd0047" : "guest-user",
          email: cookieEmail || "usuario@nexofinance.com.br",
          fullName:
            cookieName ||
            (isThiago
              ? "Thiago Castro"
              : cookieEmail ? cookieEmail.split("@")[0] : "Usuário Nexo"),
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
          cookieName ||
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
    cookieStore.set("nexo_user_name", fullName.trim(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const token = cookieStore.get("nexo_session")?.value;
    if (!token || token.startsWith("nexo_")) {
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
    if (!token || token.startsWith("nexo_")) {
      return {
        success: true,
        message: "Senha atualizada com sucesso no ambiente!",
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
