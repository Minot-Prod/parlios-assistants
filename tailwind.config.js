/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "parlios-wave-01": "url('/parlios/ui/backgrounds/wave-01.png')",
        "parlios-pattern-01": "url('/parlios/ui/patterns/pattern-01.png')",
        "parlios-module-01": "url('/parlios/ui/modules/module-01.png')",
      },
      colors: {
        parlios: {
          bg: "#040819",
          bgAlt: "#0C1024",
          card: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.08)",
          text: "#FFFFFF",
          textMuted: "#C7D1E3",
          accent: "#FF3B1D",
          accentSoft: "#FF531D",
          accentDark: "#D62810",
        },
      },
      borderRadius: {
        "parlios-md": "16px",
        "parlios-lg": "22px",
        "parlios-xl": "32px",
      },
      boxShadow: {
        "parlios-soft": "0 4px 12px rgba(0,0,0,0.25)",
        "parlios-strong": "0 6px 20px rgba(0,0,0,0.4)",
        "parlios-accent": "0 0 22px rgba(255, 60, 20, 0.35)",
      },
    },
  },
  plugins: [],
};
