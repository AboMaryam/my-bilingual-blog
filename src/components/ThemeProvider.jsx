"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  resolvedTheme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");

    setResolvedTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const setTheme = (newTheme) => {
    setResolvedTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}