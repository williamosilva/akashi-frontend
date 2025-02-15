"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import type React from "react";
import { AuthService } from "@/services/auth.service";

// Lista de rotas válidas
const VALID_ROUTES = ["/", "/form", "/success"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const authService = AuthService.getInstance();

  const isFormRoute = pathname.startsWith("/form");
  const isHome = pathname === "/";
  const isValidRoute = VALID_ROUTES.includes(pathname);

  useEffect(() => {
    const validate = async () => {
      try {
        if (isHome || !isValidRoute) {
          setIsValidating(false);
          return;
        }

        if (isFormRoute) {
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
            if (!newTokens) throw new Error("Falha na renovação do token");

            authService.saveTokens(
              newTokens.accessToken,
              newTokens.refreshToken,
              userId,
              email
            );
          }
        }
      } catch (error) {
        console.error("Erro de autenticação:", error);
        authService.logout();
        router.push("/");
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [pathname, router, isFormRoute, authService, isHome, isValidRoute]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log("pathname", pathname);
  console.log("isValidRoute", isValidRoute);
  // Se não for uma rota válida, retorna apenas o children sem nenhum layout
  if (!isValidRoute) {
    console.log("1");
    return <>{children}</>;
  }

  if (isFormRoute) {
    console.log("2");
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }
  console.log("3");
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
