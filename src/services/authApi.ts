import { API_BASE_URL } from "../config/env";

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
}

export interface RegisterResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  role: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  role: string;
  created_at: string | null;
}

const handle = async <T>(res: Response): Promise<T> => {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      (typeof body?.detail === "string" ? body.detail : null) ||
      body?.detail?.[0]?.msg ||
      res.statusText;
    throw new Error(detail);
  }
  return body as T;
};

export const register = (payload: RegisterPayload): Promise<RegisterResponse> =>
  fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => handle<RegisterResponse>(r));

export const login = (email: string, password: string): Promise<TokenResponse> =>
  fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  }).then((r) => handle<TokenResponse>(r));

export const fetchCurrentUser = (accessToken: string): Promise<UserResponse> =>
  fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((r) => handle<UserResponse>(r));