import { useEffect, useState } from "react";

const STORAGE_KEY = "zensar.appTheme";
type Theme = "dark" | "light";

export function getStoredTheme(): Theme {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" ? "light" : "dark"; // dark is default for app shell
}

export function useAppTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme());

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
