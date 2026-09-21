/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        sidebar: "var(--bg-sidebar)",
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
          soft: "var(--brand-soft)",
          on: "var(--on-brand)",
        },
        agent: {
          DEFAULT: "var(--agent)",
          bg: "var(--bg-agent)",
          text: "var(--text-agent)",
        },
        remediation: {
          DEFAULT: "var(--remediation)",
          bg: "var(--bg-remediation)",
          text: "var(--text-remediation)",
        },
        success: {
          DEFAULT: "var(--success)",
          bg: "var(--bg-success)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          bg: "var(--bg-warning)",
        },
        critical: {
          DEFAULT: "var(--critical)",
          bg: "var(--bg-critical)",
        },
        info: {
          DEFAULT: "var(--info)",
          bg: "var(--bg-info)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
