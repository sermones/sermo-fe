import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <NotificationProvider>
        <Outlet />
        <PWAInstallPrompt />
      </NotificationProvider>
    </AuthProvider>
  ),
});
