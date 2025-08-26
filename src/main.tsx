import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { registerSW } from "./pwa";
import "./global.css";
// Firebase 초기화를 위해 import
import "./firebase.js";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Service Worker 등록
// FCM과 충돌 방지를 위해 PWA 서비스 워커 등록 비활성화
// registerSW().catch(console.error);

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
