import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <PWAInstallPrompt />
      <TanStackRouterDevtools />
    </>
  ),
});
