import { ApiService } from "./api.service";
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UserData,
} from "@/types/auth.types";

import { API_CONFIG } from "@/config/api.config";

export class AuthService extends ApiService {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

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

  public async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.request<{ ok: boolean }>("/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error("Erro ao validar token:", error);
      return false;
    }
  }

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

  static saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  public static setAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  public static setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", token);
    }
  }

  public static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  public static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  public static getUserId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  }

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

  public logout(): void {
    AuthService.clearAuthData();
    window.location.href = "/";
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
