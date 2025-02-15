// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_ROUTES = ["/", "/form", "/success"];

// O middleware é executado para cada requisição ao servidor
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Primeiro, ignora arquivos do sistema e APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next(); // Deixa passar
  }

  // Verifica se a rota é válida
  const isValidRoute = VALID_ROUTES.some((route) => pathname.startsWith(route));

  // Se não for válida, retorna 404
  if (!isValidRoute) {
    return new NextResponse(null, { status: 404 });
  }
}

export const config = {
  matcher: [
    // Exclui arquivos estáticos e rotas da API
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
