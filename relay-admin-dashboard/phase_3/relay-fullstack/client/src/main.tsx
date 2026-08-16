import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* ThemeProvider outside AuthProvider — theme has nothing to do with
        auth state, so there's no reason to nest one inside the other;
        this ordering just means the theme applies even on the login
        screen before any session exists. */}
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
