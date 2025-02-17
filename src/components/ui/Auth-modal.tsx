"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import { authService } from "@/services";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/config/api.config";
import { AuthService } from "@/services/auth.service";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  initialView = "register",
}: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // AuthModal.tsx - handleSocialLogin
  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    setError("");

    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const url = `${API_CONFIG.baseURL}/auth/${provider}`;
    const popup = window.open(
      url,
      "SocialLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageListener = (event: MessageEvent) => {
      // Debug: Log all incoming messages
      console.log("Received message:", event);

      // Verificar se a origem é confiável
      const allowedOrigins = [
        API_CONFIG.baseURL,
        process.env.NEXT_PUBLIC_FRONTEND_URL,
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn("Message from untrusted origin:", event.origin);
        return;
      }

      try {
        if (event.data.type === "oauth-success") {
          const { accessToken, refreshToken, user } = event.data.payload;

          // Salvar tokens e dados do usuário
          AuthService.setAccessToken(accessToken);
          AuthService.setRefreshToken(refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          // Se quiser salvar também o ID e email do usuário
          if (user && user.id && user.email) {
            AuthService.saveTokensAndUserData(
              accessToken,
              refreshToken,
              user.id,
              user.email
            );
          }

          onClose();
          router.push("/form");
        } else if (event.data.type === "oauth-error") {
          setError(event.data.payload?.message || "Social login failed");
        }
      } catch (error) {
        console.error("Error handling message:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        popup?.close();
        setIsLoading(false);
      }
    };

    window.addEventListener("message", messageListener);

    // Fallback: Verificar se o popup foi redirecionado
    const checkPopup = () => {
      try {
        if (popup?.closed) {
          clearInterval(checkInterval);
          window.removeEventListener("message", messageListener);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Popup check security error", error);
      }
    };

    const checkInterval = setInterval(checkPopup, 500);
  };

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (view === "register") {
        await authService.register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        });
      } else {
        await authService.login({
          email: formData.email,
          password: formData.password,
        });
      }

      onClose();
      router.push("/form");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={cn(
              "relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 p-6",
              montserrat.variable,
              jetbrainsMono.variable
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h2
              className={cn(
                "text-2xl font-bold text-zinc-100 mb-6",
                montserrat.className
              )}
            >
              {view === "register" ? "Sign Up" : "Login"}
            </h2>

            {error && (
              <div className="mb-4 p-3 text-sm bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === "register" && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 text-zinc-100"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 text-zinc-100"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-500/50 text-zinc-100"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-500 text-zinc-900 rounded-lg font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Please wait..." : "Continue"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-zinc-500 bg-zinc-900">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 border border-emerald-500/20 rounded-lg text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Ícone do Google */}
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 border border-emerald-500/20 rounded-lg text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Ícone do GitHub */}
                Continue with GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-400">
              {view === "register"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setView(view === "register" ? "login" : "register");
                  setError("");
                  setFormData({ fullName: "", email: "", password: "" });
                }}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {view === "register" ? "Log in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
