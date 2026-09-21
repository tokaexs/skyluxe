const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function getAuthToken(): string | null {
  return getCookie("skyluxe_auth_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getCookie("skyluxe_auth_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || errorData.error || `API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (err: any) {
    // If the configured BASE_URL is an external host (e.g. localhost:5000) and fails with network error, fallback to relative /api/v1
    if (BASE_URL !== "/api/v1" && !endpoint.startsWith("http")) {
      try {
        const fallbackRes = await fetch(`/api/v1${endpoint}`, {
          ...options,
          headers,
        });
        if (fallbackRes.ok) {
          return fallbackRes.json();
        }
      } catch {
        // Fallback also failed, rethrow original error
      }
    }
    throw err;
  }
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
