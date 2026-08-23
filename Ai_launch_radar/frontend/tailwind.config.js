/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B0F0E",
        panel: "#121917",
        "panel-raised": "#171F1C",
        line: "#22302B",
        signal: "#6EE7B0",
        alert: "#FF8A5B",
        ink: "#E8F0EC",
        muted: "#7C8F87",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseIn: {
          "0%": { boxShadow: "0 0 0 0 rgba(110,231,176,0.55)" },
          "100%": { boxShadow: "0 0 0 10px rgba(110,231,176,0)" },
        },
      },
      animation: {
        sweep: "sweep 4s linear infinite",
        pulseIn: "pulseIn 1.2s ease-out 1",
      },
    },
  },
  plugins: [],
};
