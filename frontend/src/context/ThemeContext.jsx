import { createContext, useState, useContext, useEffect } from "react";
import Cookie from "js-cookie";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme = null) => {
    const updatedTheme = (newTheme === "light" || newTheme === "dark")
        ? newTheme
        : (theme === "light" ? "dark" : "light");

    setTheme(updatedTheme);
    Cookie.set("theme", updatedTheme, { expires: 365 });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}
