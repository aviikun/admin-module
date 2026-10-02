export const SESSION_TTL_MS = 5 * 60 * 1000;

export const portalRoles = ["Authority Officer", "Auditor", "Administrator"] as const;
export type PortalRole = (typeof portalRoles)[number];

export type PortalSession = {
  email: string;
  role: PortalRole;
  expiresAt: number;
};

const SESSION_KEY = "satark-session";

export function getPortalSession(): PortalSession | null {
  if (typeof window === "undefined") return null;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? "null");
    if (!value || typeof value !== "object") return null;

    const session = value as Partial<PortalSession>;
    const validRole = portalRoles.includes(session.role as PortalRole);
    if (
      typeof session.email !== "string" ||
      !validRole ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now()
    ) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session as PortalSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function createPortalSession(email: string, role: PortalRole): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ email, role, expiresAt: Date.now() + SESSION_TTL_MS }),
  );
}

export function clearPortalSession(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
}