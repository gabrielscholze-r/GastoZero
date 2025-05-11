export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        yellow: "var(--color-yellow)",
        gold: "var(--color-gold)",
        grayLight: "var(--color-gray-light)",
        grayDark: "var(--color-gray-dark)",
        black: "var(--color-black)",
        bgdark: "var(--color-bgdark)",
        bglight: "var(--color-bglight)",
        containerbg: "var(--color-containerbg)",
        textcontainerbg: "var(--color-textcontainerbg)",
        text: "var(--color-text)",
        blue100: "var(--color-blue-100)",
        blue300: "var(--color-blue-300)",
        blue500: "var(--color-blue-500)",
        blue700: "var(--color-blue-700)",
        blue900: "var(--color-blue-900)",
      },
      fontFamily: {
        display: ["JetBrains Mono", "monospace"],
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [],
}