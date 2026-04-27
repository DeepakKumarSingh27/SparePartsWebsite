"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark" | "system";

interface ThemeProviderContext {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark" | undefined;
}

const ThemeContext = React.createContext<ThemeProviderContext | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "class",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
}) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark" | undefined>(undefined);

  const getSystemTheme = React.useCallback(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
    root.classList.add(effectiveTheme);
    setResolvedTheme(effectiveTheme as "light" | "dark");
  }, [theme, getSystemTheme]);

  // Handle system theme changes
  React.useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      const effectiveTheme = getSystemTheme();
      root.classList.add(effectiveTheme);
      setResolvedTheme(effectiveTheme as "light" | "dark");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, getSystemTheme]);

  const setTheme = React.useCallback((newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  }, [storageKey]);

  // Inline script to prevent FOUC, injected via useServerInsertedHTML
  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('${storageKey}') || '${defaultTheme}';
                var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                if (theme === 'system') theme = supportDarkMode ? 'dark' : 'light';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            })();
          `,
        }}
      />
    );
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
