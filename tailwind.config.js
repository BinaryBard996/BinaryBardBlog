/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        serif: ['"Noto Serif SC"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        cute: ['"ZCOOL KuaiLe"', "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        anime: {
          gold: "#d4a44c",
          "gold-light": "#f0c66e",
          "gold-dark": "#b8922e",
          sky: "#7eb8da",
          "sky-light": "#a5d0e8",
          lavender: "#9b8ec4",
          crimson: "#c45c5c",
          emerald: "#68b87a",
          dark: "#0b0e1a",
          "dark-mid": "#111528",
          "dark-light": "#161b33",
          panel: "#1a1f38",
          "panel-light": "#222845",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-gold": "0 0 15px rgba(212,164,76,0.15), 0 0 45px rgba(212,164,76,0.06)",
        "glow-gold-strong": "0 0 20px rgba(212,164,76,0.3), 0 0 60px rgba(212,164,76,0.12)",
        "glow-sky": "0 0 15px rgba(126,184,218,0.15), 0 0 45px rgba(126,184,218,0.06)",
        "panel-dark": "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,164,76,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(212,164,76,0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "breath-glow": "breathGlow 3s ease-in-out infinite",
        "bounce-slow": "bounceSlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(212,164,76,0.12)" },
          "50%": { boxShadow: "0 0 30px rgba(212,164,76,0.3)" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
