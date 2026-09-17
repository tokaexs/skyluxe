const BASE_URL = "http://localhost:5000/api/v1";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getCookie("skyluxe_auth_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || errorData.error || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: "DELETE" }),
  download: async (endpoint: string) => {
    const token = getCookie("skyluxe_auth_token");
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    return response.blob();
  }
};
