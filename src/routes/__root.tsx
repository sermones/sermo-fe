import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";
import { AuthProvider } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
      <Navbar />
      <PWAInstallPrompt />
    </AuthProvider>
  ),
});
