const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://minha-api.com";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "minha-chave";

const getBearerToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    return token ? `Bearer ${token}` : "";
  }
  return "";
};

const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: unknown
) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        Authorization: getBearerToken(),
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    return null;
  }
};

export const getUserDataByToken = async (token: string) => {
  return apiRequest(`/getData?token=${token}`);
};
