import Cookies from "js-cookie";
import { API_BASE_URL } from "./config";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("accessToken") || localStorage.getItem("accessToken");
};

export const setTokens = (accessToken: string, refreshToken?: string) => {
  Cookies.set("accessToken", accessToken, { expires: 1 });
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = token;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, config);

  // Attempt refresh token if 401 Unauthorized
  if (response.status === 401 && !endpoint.includes("/auth/login")) {
    const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: refreshToken,
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData?.data?.accessToken || refreshData?.accessToken;
          if (newToken) {
            setTokens(newToken);
            headers["Authorization"] = newToken;
            response = await fetch(url, { ...config, headers });
          }
        } else {
          clearTokens();
        }
      } catch (err) {
        clearTokens();
      }
    }
  }

  const resData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      resData?.message || resData?.error || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  // Backend standard response format: { success, message, data, meta }
  if (resData && typeof resData === "object" && "data" in resData) {
    return resData.data;
  }

  return resData as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
