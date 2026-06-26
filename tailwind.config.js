/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#05060A",
        ink: "#0A0C14",
        panel: "#0D0F1A",
        edge: "rgba(255,255,255,0.08)",
        agent: {
          blue: "#3B82F6",
          blue2: "#2563EB",
          purple: "#8B5CF6",
          cyan: "#22D3EE",
          violet: "#A855F7",
        },
        text: {
          primary: "#F3F4F8",
          secondary: "#9CA3B8",
          muted: "#5B6178",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "agent-gradient": "linear-gradient(120deg, #3B82F6 0%, #8B5CF6 50%, #22D3EE 100%)",
        "agent-gradient-soft": "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(34,211,238,0.15) 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.18), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(59,130,246,0.25)",
        "glow-purple": "0 0 40px rgba(139,92,246,0.25)",
        "glow-cyan": "0 0 40px rgba(34,211,238,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
