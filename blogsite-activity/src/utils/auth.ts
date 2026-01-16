export type User = {
  id: number;
  name: string;
  email: string;
};

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;

  const u = value as Record<string, unknown>;

  return (
    typeof u.id === 'number' &&
    typeof u.name === 'string' &&
    typeof u.email === 'string'
  );
}

export function getUser(): User | null {
  const data = localStorage.getItem('user');
  if (!data) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(data) as unknown;
  } catch {
    return null;
  }

  return isUser(parsed) ? parsed : null;
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

export function loginUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logoutUser(): void {
  localStorage.removeItem('user');
}
