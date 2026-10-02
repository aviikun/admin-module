import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  Navigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { PortalShell } from "../components/satark/portal";
import { Toaster } from "../components/ui/sonner";
import { clearPortalSession, getPortalSession, type PortalSession } from "../lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Satark Drishti" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@600;700&display=swap" },
      { rel: "icon", href: "/logo.jpg", type: "image/jpeg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionGate />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

function SessionGate() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [session, setSession] = useState<PortalSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const validate = () => {
      const currentSession = getPortalSession();
      setSession(currentSession);
      setChecked(true);
      return currentSession;
    };

    const currentSession = validate();
    const expiryTimer = currentSession
      ? window.setTimeout(validate, Math.max(0, currentSession.expiresAt - Date.now()))
      : undefined;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "satark-session") validate();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      if (expiryTimer !== undefined) window.clearTimeout(expiryTimer);
      window.removeEventListener("storage", handleStorage);
    };
  }, [pathname, session?.expiresAt]);

  if (!checked) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Checking session...</div>;
  }

  if (pathname === "/login") {
    return session ? <Navigate to="/" replace /> : <Outlet />;
  }

  if (!session) return <Navigate to="/login" replace />;

  return (
    <PortalShell session={session} onLogout={() => {
      clearPortalSession();
      setSession(null);
    }}>
      <Outlet />
    </PortalShell>
  );
}
