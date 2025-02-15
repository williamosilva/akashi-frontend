"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import type React from "react";
import { AuthService } from "@/services/auth.service";

// Lista de rotas válidas
const VALID_ROUTES = ["/form", "/success"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const authService = AuthService.getInstance();

  // Verifica se a rota é válida
  const isValidRoute = VALID_ROUTES.some((route) => pathname.startsWith(route));
  const isFormRoute = pathname.startsWith("/form");

  useEffect(() => {
    const validate = async () => {
      // Redireciona imediatamente para home se rota inválida
      if (!isValidRoute) {
        router.replace("/");
        return;
      }

      // Só faz validação de auth para rotas protegidas
      if (isFormRoute) {
        try {
          const accessToken = authService.getAccessToken();
          const refreshToken = authService.getRefreshToken();
          const userId = authService.getUserId();
          const email = authService.getEmail();

          if (!accessToken || !refreshToken || !userId || !email) {
            throw new Error("Autenticação necessária");
          }

          const isValid = await authService.validateToken(accessToken);

          if (!isValid) {
            const newTokens = await authService.refreshToken();
            if (!newTokens) throw new Error("Falha na renovação");

            authService.saveTokens(
              newTokens.accessToken,
              newTokens.refreshToken,
              userId,
              email
            );
          }
        } catch (error) {
          console.error("Falha na autenticação:", error);
          authService.logout();
          router.replace("/");
        }
      }

      setIsValidating(false);
    };

    validate();
  }, [pathname, router, isValidRoute, isFormRoute, authService]);

  if (!isValidRoute || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isFormRoute) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
