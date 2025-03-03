import { API_CONFIG } from "@/config/api.config";
import { AuthService } from "./auth.service";

export class ApiService {
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = AuthService.getAccessToken();
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    if (!API_CONFIG.secretKey) {
      throw new Error("API secret key is not configured");
    }

    let headers: HeadersInit = {
      "Content-Type": "application/json",
      // "x-secret-key": API_CONFIG.secretKey,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 498) {
      console.warn("Token expirado. Tentando renovar...");

      const newTokens = await AuthService.refreshToken();
      if (!newTokens) {
        console.error("Falha ao renovar o token. Deslogando usuário...");
        AuthService.getInstance().logout();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const refreshToken = AuthService.getRefreshToken();
      if (!refreshToken) {
        console.error("Nenhum refreshToken disponível. Deslogando usuário...");
        AuthService.getInstance().logout();
        throw new Error(
          "Nenhum refreshToken encontrado. Faça login novamente."
        );
      }

      AuthService.saveTokens(newTokens.accessToken, refreshToken);

      headers = {
        ...headers,
        Authorization: `Bearer ${newTokens.accessToken}`,
      };

      response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        throw new Error(`Erro após renovação: ${response.statusText}`);
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return response.json();
  }
}
