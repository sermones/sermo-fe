import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "../components/AuthPage";

export const Route = createFileRoute("/auth")({
  component: AuthRouteComponent,
});

function AuthRouteComponent() {
  return <AuthPage />;
}
