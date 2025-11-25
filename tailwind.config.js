/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },
    extend: {
      colors: {
        brand: {
          forest: "#414b3b",
          copper: "#ab8742",
          sage: "#8ca87c",
          rose: "#b68e8c",
          cream: "#fff9f3",
          earth: "#5d5340",
          mist: "#ecefea",
          sand: "#f7f1e6",
          ocean: "#6db0d4",
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        belleza: ["Belleza", "serif"],
      },
      keyframes: {
        "accordion-slide-in": {
          "0%": { transform: "translateX(-20%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "accordion-slide-in-right": {
          "0%": { transform: "translateX(10%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "accordion-slide-up": {
          "0%": { transform: "translateY(-20%)" },
          "100%": { transform: "translateY(0)" },
        },
        "booking-slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "gallery-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "review-spin-x": {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(360deg)" },
        },
        "review-spin-y": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "service-text-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-slide-in": "accordion-slide-in 0.5s ease-in both",
        "accordion-slide-in-right":
          "accordion-slide-in-right 0.5s ease-in both",
        "accordion-slide-up": "accordion-slide-up 0.5s ease-in both",
        "booking-slide-in": "booking-slide-in 0.3s ease-out both",
        "gallery-fade-in": "gallery-fade-in 1s ease forwards",
        "review-spin-x": "review-spin-x 3s ease-in-out forwards",
        "review-spin-y": "review-spin-y 3s ease-in-out forwards",
        "service-text": "service-text-in 0.45s ease-out both",
      },
      boxShadow: {
        "accordion-panel": "-2px 0 10px rgba(0, 0, 0, 0.2)",
        "booking-panel": "-2px 0 10px rgba(0, 0, 0, 0.5)",
      },
      transitionTimingFunction: {
        accordion: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
      transitionProperty: {
        accordion: "flex-basis, flex-grow, min-width, transform",
        booking: "transform, opacity",
      },
    },
  },
  plugins: [],
};
