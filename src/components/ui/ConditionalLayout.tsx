"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import type React from "react";
import { AuthService } from "@/services/auth.service";
import { createContext, useContext } from "react";

const VALID_ROUTES = ["/", "/form", "/success"];

interface ProjectContextType {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  triggerReload: () => void;
}

export const ProjectContext = createContext<ProjectContextType>({
  selectedProjectId: null,
  setSelectedProjectId: () => {},
  triggerReload: () => {},
});

export const useProject = () => useContext(ProjectContext);

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const authService = AuthService.getInstance();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const isFormRoute = pathname.startsWith("/form");
  const isHome = pathname === "/";
  const isValidRoute = VALID_ROUTES.includes(pathname);
  const [sidebarSignal, setSidebarSignal] = useState(0);

  useEffect(() => {
    const validate = async () => {
      try {
        if (isHome || !isValidRoute) {
          setIsValidating(false);
          return;
        }

        if (isFormRoute) {
          const accessToken = AuthService.getAccessToken();
          const refreshToken = AuthService.getRefreshToken();
          const userId = AuthService.getUserId();
          const email = AuthService.getEmail();

          if (!accessToken || !refreshToken || !userId || !email) {
            throw new Error("Autenticação necessária");
          }

          const isValid = await authService.validateToken(accessToken);

          if (!isValid) {
            const newTokens = await authService.refreshToken();
            if (!newTokens) throw new Error("Falha na renovação do token");

            AuthService.saveTokensAndUserData(
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

  if (!isValidRoute) {
    return <>{children}</>;
  }

  const projectContextValue = {
    selectedProjectId,
    setSelectedProjectId,
    triggerReload: () => setSidebarSignal((prev) => prev + 1),
  };

  if (isFormRoute) {
    return (
      <ProjectContext.Provider value={projectContextValue}>
        <div className="flex h-screen">
          <Sidebar
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
            signal={sidebarSignal}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </ProjectContext.Provider>
    );
  }

  return (
    <ProjectContext.Provider value={projectContextValue}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </ProjectContext.Provider>
  );
}
