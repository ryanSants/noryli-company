import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { Index } from "./routes/index";
import { AuthPage } from "./routes/auth";
import { Admin } from "./routes/_authenticated/admin";
import { supabase } from "./integrations/supabase/client";
import "./styles.css";
const queryClient = new QueryClient();
function Layout() {
  const location = useLocation();
  React.useEffect(() => {
    const privatePage = location.pathname !== "/";
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!tag) { tag = document.createElement("meta"); tag.name = "robots"; document.head.appendChild(tag); }
    tag.content = privatePage ? "noindex, nofollow" : "index, follow";
  }, [location.pathname]);
  return <Outlet />;
}
const root = createRootRoute({ component: Layout,
  notFoundComponent: () => <main className="p-8"><h1>Página não encontrada</h1><a href="/">Voltar ao início</a></main>,
  errorComponent: () => <main className="p-8"><h1>Não foi possível abrir esta página</h1><a href="/">Voltar ao início</a></main>,
});
const routes = [
  createRoute({ getParentRoute: () => root, path: "/", component: Index }),
  createRoute({ getParentRoute: () => root, path: "/auth", component: AuthPage }),
  createRoute({ getParentRoute: () => root, path: "/admin", component: Admin,
    beforeLoad: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw redirect({ to: "/auth" });
    },
  }),
];
const router = createRouter({ routeTree: root.addChildren(routes), scrollRestoration: true });
createRoot(document.getElementById("root")!).render(<QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>);
