import { ApiService } from "./api.service";
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UserData,
} from "@/types/auth.types";

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
    console.log("[AuthService] Register request:", data);

    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("[AuthService] Register response:", response);

    if (response.accessToken) {
      AuthService.saveTokensAndUserData(
        response.accessToken,
        response.refreshToken
      );
    } else {
      console.warn("[AuthService] No access token in register response");
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
  public async login(data: LoginDto): Promise<AuthResponse> {
    console.log("[AuthService] Login request:", data);

    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("[AuthService] Login response:", response);

    if (response.accessToken) {
      AuthService.saveTokensAndUserData(
        response.accessToken,
        response.refreshToken
      );
    } else {
      console.warn("[AuthService] No access token in login response");
    }

    return response;
  }

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
  public async refreshToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const userId = AuthService.getUserId();
      const email = AuthService.getEmail();

      if (!userId || !email) {
        throw new Error("Dados do usuário não encontrados");
      }

      const response = await this.request<AuthResponse>("/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }),
      });

      console.log("[AuthService] Refresh token response:", response);
      if (response.accessToken && response.refreshToken) {
        AuthService.setAccessToken(response.accessToken);
        AuthService.setRefreshToken(response.refreshToken);

        return {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        };
      } else {
        throw new Error("Tokens não recebidos na resposta");
      }
    } catch (error) {
      console.error("Falha ao renovar tokens:", error);
      return null;
    }
  }

  /**
   * Realiza logout do usuário removendo dados do localStorage
   */
  public logout(): void {
    AuthService.clearAuthData();
  }

  // ===== MÉTODOS ESTÁTICOS PARA GERENCIAMENTO DE TOKENS E DADOS DO USUÁRIO =====

  /**
   * Salva tokens e dados do usuário no localStorage
   */
  public static saveTokensAndUserData(
    accessToken: string,
    refreshToken: string
  ): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
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
