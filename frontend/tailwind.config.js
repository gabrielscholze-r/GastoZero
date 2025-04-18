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
        containerbg: "var(--color-containerbg)", // nova cor
        textcontainerbg: "var(--color-textcontainerbg)", // nova cor
      },
      fontFamily: {
        display: ["JetBrains Mono", "monospace"],
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [],
}
