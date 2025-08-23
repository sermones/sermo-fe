import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";
import { AuthProvider } from "../contexts/AuthContext";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
      <PWAInstallPrompt />
    </AuthProvider>
  ),
});
