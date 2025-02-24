import { ApiService } from "./api.service";
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UserData,
} from "@/types/auth.types";

import { API_CONFIG } from "@/config/api.config";
import { useRouter } from "next/navigation";

/**
 * Serviço de autenticação que gerencia operações relacionadas a login,
 * registro e gerenciamento de tokens.
 */
export class AuthService extends ApiService {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  /**
   * Retorna a instância singleton do AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Registra um novo usuário
   * @param data Dados de registro (nome, email, senha, etc)
   */
  public async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.accessToken) {
      AuthService.saveTokens(response.accessToken, response.refreshToken);
    } else {
      console.warn("[AuthService] No access token in register response");
    }

    return response;
  }
  public async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.accessToken) {
      AuthService.saveTokens(response.accessToken, response.refreshToken);
    } else {
      console.warn("[AuthService] No access token in login response");
    }

    return response;
  }

  public async getMe(token: string): Promise<UserData> {
    return this.request<UserData>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  /**
   * Realiza login do usuário
   * @param data Dados de login (email, senha)
   */

  /**
   * Valida se um token é válido
   * @param token Token a ser validado
   */
  public async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.request<{ ok: boolean }>("/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Atualiza o token de acesso usando o refresh token
   */
  static async refreshToken(): Promise<{ accessToken: string } | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (data.accessToken) {
        this.saveTokens(data.accessToken, refreshToken);
        return data;
      }

      return null;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return null;
    }
  }

  /**
   * Realiza logout do usuário removendo dados do localStorage
   */

  // ===== MÉTODOS ESTÁTICOS PARA GERENCIAMENTO DE TOKENS E DADOS DO USUÁRIO =====

  /**
   * Salva tokens e dados do usuário no localStorage
   */
  static saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  /**
   * Salva o token de acesso no localStorage
   */
  public static setAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  /**
   * Salva o token de refresh no localStorage
   */
  public static setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", token);
    }
  }

  /**
   * Obtém o token de acesso do localStorage
   */
  public static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  /**
   * Obtém o token de refresh do localStorage
   */
  public static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  /**
   * Obtém o ID do usuário do localStorage
   */
  public static getUserId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  }

  /**
   * Obtém o email do usuário do localStorage
   */
  public static getEmail(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("email");
    }
    return null;
  }

  public static getFullName(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fullName");
    }
    return null;
  }

  public static getPhoto(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("photo");
    }
    return null;
  }

  /**
   * Limpa todos os dados de autenticação do localStorage
   */
  public logout(): void {
    AuthService.clearAuthData();
    window.location.href = "/"; // Redireciona para a Home
  }

  public static clearAuthData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("fullName");
      localStorage.removeItem("photo");
      localStorage.removeItem("user");
    }
  }
}
