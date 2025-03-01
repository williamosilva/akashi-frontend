"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import type React from "react";
import { AuthService } from "@/services/auth.service";
import { createContext, useContext } from "react";
import LoadingComponent from "./LoadingComponent";

const VALID_ROUTES = ["/", "/form", "/success"];

interface ProjectContextType {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  triggerReload: () => void;
  openCreateProjectModal: boolean;
  setOpenCreateProjectModal: (open: boolean) => void;
}

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  fullName: string | null;
  setFullName: (fullName: string | null) => void;
  photo: string | null;
  setPhoto: (photo: string | null) => void;
  countProjects: number;
  setCountProjects: React.Dispatch<React.SetStateAction<number>>;
  plan: "free" | "premium" | "basic" | "admin" | null;
  setPlan: React.Dispatch<
    React.SetStateAction<"free" | "premium" | "basic" | "admin" | null>
  >;
}
interface hookContext {
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
  targetSection: string | null;
  setTargetSection: (section: string) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: "",
  setUserId: () => {},
  email: "",
  setEmail: () => {},
  fullName: "",
  setFullName: () => {},
  photo: "",
  setPhoto: () => {},
  countProjects: 0,
  setCountProjects: () => {},
  plan: null,
  setPlan: () => {},
});

export const ProjectContext = createContext<ProjectContextType>({
  selectedProjectId: null,
  setSelectedProjectId: () => {},
  triggerReload: () => {},
  openCreateProjectModal: false,
  setOpenCreateProjectModal: () => {},
});

export const HookContext = createContext<hookContext>({
  openAuthModal: false,
  setOpenAuthModal: () => {},
  targetSection: null,
  setTargetSection: () => {},
});

export const useUser = () => useContext(UserContext);
export const useProject = () => useContext(ProjectContext);
export const useHook = () => useContext(HookContext);

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const authService = AuthService.getInstance();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [sideBarControlled, setSideBarControlled] = useState({
    signal: false,
    message: "",
  });
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [sidebarSignal, setSidebarSignal] = useState(0);
  const [countProjects, setCountProjects] = useState(0);
  const [plan, setPlan] = useState<
    "free" | "premium" | "basic" | "admin" | null
  >(null);
  const isFormRoute = pathname.startsWith("/form");

  const isSuccessCallbackRoute = pathname.match(/^\/success\/[^\/]+$/);
  const isValidRoute =
    VALID_ROUTES.includes(pathname) || isSuccessCallbackRoute;

  const handleLogout = () => {
    setUserId(null);
    setFullName(null);
    setPhoto(null);
    setEmail(null);
    AuthService.clearAuthData();
    router.push("/");
  };

  useEffect(() => {
    const validateAndLoadUser = async () => {
      try {
        const accessToken = AuthService.getAccessToken();
        const refreshToken = AuthService.getRefreshToken();
        if (!accessToken || !refreshToken) {
          router.push("/");
          return;
        }

        const userData = await authService.getMe(accessToken);

        setPlan(userData.plan);
        setCountProjects(userData.projectCount);
        setUserId(userData.id);
        setEmail(userData.email);
        setFullName(userData.fullName);
        setPhoto(userData.photo || null);
      } catch (error) {
        console.error("Erro de autenticação:", error);
        handleLogout();
      } finally {
        setIsValidating(false);
      }
    };

    validateAndLoadUser();
  }, [pathname, router, authService]);

  useEffect(() => {
    if (plan === "free" && countProjects >= 1) {
      setSideBarControlled({
        signal: true,
        message: "You have reached the project limit for the Free plan.",
      });
    } else if (plan === "basic" && countProjects >= 5) {
      setSideBarControlled({
        signal: true,
        message: "You have reached the project limit for the Basic plan.",
      });
    } else if (plan === "premium" && countProjects >= 10) {
      setSideBarControlled({
        signal: true,
        message: "You have reached the project limit for the Premium plan.",
      });
    } else {
      setSideBarControlled({
        signal: false,
        message: "",
      });
    }
  }, [plan, countProjects]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <LoadingComponent />
      </div>
    );
  }

  if (!isValidRoute) {
    return <>{children}</>;
  }

  const userContextValue = {
    userId,
    setUserId,
    email,
    setEmail,
    fullName,
    setFullName,
    photo,
    setPhoto,
    plan,
    setPlan,
    countProjects,
    setCountProjects,
  };

  const projectContextValue = {
    selectedProjectId,
    setSelectedProjectId: (id: string | null) => {
      setSelectedProjectId(id);
    },
    triggerReload: () => {
      setSidebarSignal((prev) => prev + 1);
    },
    openCreateProjectModal,
    setOpenCreateProjectModal: (open: boolean) => {
      setOpenCreateProjectModal(open);
    },
  };

  const hookContextValue = {
    openAuthModal,
    setOpenAuthModal,
    targetSection,
    setTargetSection,
  };

  return (
    <HookContext.Provider value={hookContextValue}>
      <UserContext.Provider value={userContextValue}>
        <ProjectContext.Provider value={projectContextValue}>
          {isFormRoute ? (
            <div className="flex h-auto lg:h-screen">
              <Sidebar
                selectedProjectId={selectedProjectId}
                onProjectSelect={setSelectedProjectId}
                signal={sidebarSignal}
                openCreateProjectModal={openCreateProjectModal}
                isCreateDisabled={sideBarControlled}
                setOpenCreateProjectModal={setOpenCreateProjectModal}
              />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          ) : (
            <div className="flex flex-col min-h-screen">
              <Navbar
                openAuthModal={openAuthModal}
                setOpenAuthModal={setOpenAuthModal}
              />
              <main className="flex-1">{children}</main>
            </div>
          )}
        </ProjectContext.Provider>
      </UserContext.Provider>
    </HookContext.Provider>
  );
}
