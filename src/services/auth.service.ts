import { ApiService } from "./api.service";
import { AuthResponse, LoginDto, RegisterDto } from "@/types/auth.types";

export class AuthService extends ApiService {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
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
      this.saveTokens(
        response.accessToken,
        response.refreshToken,
        response.id, // Adiciona o id do response
        response.email
      );
    } else {
      console.warn("[AuthService] No access token in register response");
    }

    return response;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
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
      this.saveTokens(
        response.accessToken,
        response.refreshToken,
        response.id,
        response.email
      );
    } else {
      console.warn("[AuthService] No access token in login response");
    }

    return response;
  }

  async validateToken(token: string): Promise<boolean> {
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

  async refreshToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const userId = this.getUserId();
      const email = localStorage.getItem("email");

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

      return {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      console.error("Falha ao renovar tokens:", error);
      return null;
    }
  }

  // Atualizado para salvar email
  public saveTokens(
    accessToken: string,
    refreshToken: string,
    userId: string,
    email: string
  ): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", email);
    }
  }

  getEmail(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("email") : null;
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  getUserId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId"); // Novo removeItem
    }
  }
}
