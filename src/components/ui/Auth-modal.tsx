"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { montserrat, jetbrainsMono } from "@/styles/fonts";
import { authService } from "@/services";
import { useRouter } from "next/navigation";

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
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 border border-emerald-500/20 rounded-lg text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
              <button
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 border border-emerald-500/20 rounded-lg text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                  />
                </svg>
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
