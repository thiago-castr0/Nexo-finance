import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("nexo_session")?.value;

  // Rotas públicas que não requerem autenticação
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/design-system") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  // Se o usuário não tem sessão e tenta acessar uma rota protegida, redireciona para /login
  if (!sessionToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário já tem sessão e tenta acessar /login ou /register, redireciona para a home
  if (sessionToken && (pathname === "/login" || pathname === "/register")) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto arquivos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
