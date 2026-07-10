/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        surface1: "var(--bg-surface-1)",
        surface2: "var(--bg-surface-2)",
        surface3: "var(--bg-surface-3)",
        border: "var(--border)",
        borderStrong: "var(--border-strong)",
        primaryText: "var(--text-primary)",
        secondaryText: "var(--text-secondary)",
        mutedText: "var(--text-muted)",
        brand: {
          DEFAULT: "var(--brand)",
          hover: "var(--brand-hover)",
          on: "var(--on-brand)",
        },
        agent: {
          DEFAULT: "var(--agent)",
          bg: "var(--bg-agent)",
          text: "var(--text-agent)",
        },
        success: { DEFAULT: "var(--success)", bg: "var(--bg-success)" },
        warning: { DEFAULT: "var(--warning)", bg: "var(--bg-warning)" },
        critical: { DEFAULT: "var(--critical)", bg: "var(--bg-critical)" },
        info: { DEFAULT: "var(--info)", bg: "var(--bg-info)" },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        display: ["IBM Plex Sans Condensed", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
