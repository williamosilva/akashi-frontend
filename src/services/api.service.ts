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
      "x-secret-key": API_CONFIG.secretKey,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.warn("Token expirado. Tentando renovar...");

      const newTokens = await AuthService.refreshToken();
      if (!newTokens) {
        throw new Error("Falha ao renovar o token.");
      }

      console.log("Novos tokens:", newTokens);
      // Salvar novos tokens antes de refazer a requisição
      AuthService.saveTokens(newTokens.accessToken, newTokens.refreshToken);

      // Criar novos headers para evitar mutações inesperadas
      headers = {
        ...headers,
        Authorization: `Bearer ${newTokens.accessToken}`,
      };

      // Refazer a requisição original com os novos headers
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
