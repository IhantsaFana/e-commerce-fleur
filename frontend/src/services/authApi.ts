import { API_BASE_URL } from "../config/env";

export interface RegisterPayload {
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  telephone: string;
}

export interface RegisterResponse {
  id: number;
  lastname: string;
  firstname: string;
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
  lastname: string;
  firstname: string;
  email: string;
  telephone: string | null;
  role: string;
}

const getErrorMessage = (body: unknown, fallback: string): string => {
  // Si le backend renvoie directement une chaîne de caractères.
  if (typeof body === "string") {
    return body;
  }

  if (!body || typeof body !== "object") {
    return fallback;
  }

  const data = body as Record<string, unknown>;

  // Exemples acceptés :
  // { message: "Nom deja utiliser" }
  // { error: "Nom deja utiliser" }
  // { detail: "Nom deja utiliser" }
  // { code: "NOM_DEJA_UTILISE" }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data.code === "string") {
    return data.code;
  }

  // Cas courant avec FastAPI / Pydantic :
  // { detail: [{ msg: "..." }] }
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const firstError = data.detail[0];

    if (
      firstError &&
      typeof firstError === "object" &&
      "msg" in firstError &&
      typeof firstError.msg === "string"
    ) {
      return firstError.msg;
    }
  }

  // Cas possible :
  // { detail: { message: "Nom deja utiliser" } }
  if (data.detail && typeof data.detail === "object") {
    const detail = data.detail as Record<string, unknown>;

    if (typeof detail.message === "string") {
      return detail.message;
    }

    if (typeof detail.error === "string") {
      return detail.error;
    }

    if (typeof detail.code === "string") {
      return detail.code;
    }
  }

  return fallback;
};

const handle = async <T>(res: Response): Promise<T> => {
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = getErrorMessage(body, res.statusText || "Une erreur est survenue");
    throw new Error(message);
  }

  return body as T;
};

export const register = (
  payload: RegisterPayload
): Promise<RegisterResponse> =>
  fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => handle<RegisterResponse>(response));

export const login = (
  email: string,
  password: string
): Promise<TokenResponse> =>
  fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password,
    }),
  }).then((response) => handle<TokenResponse>(response));

export const fetchCurrentUser = (
  accessToken: string
): Promise<UserResponse> =>
  fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => handle<UserResponse>(response));