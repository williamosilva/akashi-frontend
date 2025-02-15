import { API_CONFIG } from "@/config/api.config";

export class ApiService {
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;

      // Garantindo que o secretKey não seja undefined
      if (!API_CONFIG.secretKey) {
        throw new Error("API secret key is not configured");
      }

      console.log(API_CONFIG.secretKey); // Para debug

      const headers = {
        "Content-Type": "application/json",
        "x-secret-key": API_CONFIG.secretKey, // Removido o || "" para evitar header vazio
        ...options.headers,
      };

      console.log("Request Headers:", headers); // Para debug
      console.log("Request URL:", url); // Para debug

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Melhorando o tratamento de erro para incluir o corpo da resposta
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
}
