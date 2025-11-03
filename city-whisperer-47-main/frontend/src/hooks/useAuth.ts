export type User = { id: string; name: string; email: string; role: string };

const TOKEN_KEY = "scf_token";
const USER_KEY = "scf_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || undefined;
}

export function setToken(token?: string) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): User | undefined {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : undefined;
}

export function setUser(user?: User) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function logout() {
  setToken(undefined);
  setUser(undefined);
}


