/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "zen-white": "#F9F8F6",
        "zen-cream": "#F2EFE9",
        "zen-sage": "#8A9A8B",
        "zen-sage-dark": "#6B7B6C",
        "zen-wood": "#9B836A",
        "zen-wood-light": "#B8A48F",
        "surface": "#F9F8F6",
        "on-surface": "#3A3A38",
        "on-surface-variant": "#6D6D6A",
        "primary": "#8A9A8B",
        "on-primary": "#FFFFFF",
        "outline": "#D1CDC7",
        "outline-variant": "#E5E1DB",
        "surface-container": "#F2EFE9",
        "surface-container-low": "#F5F3F0",
        "surface-container-lowest": "#FFFFFF"
      },
      fontFamily: {
        "headline": ["Lora", "serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
