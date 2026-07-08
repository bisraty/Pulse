import { create } from "zustand";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  /** Syncs store state from the class already applied by themeInitScript. */
  syncFromDom: () => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    get().setTheme(get().theme === "dark" ? "light" : "dark");
  },
  syncFromDom: () => {
    const isLight = document.documentElement.classList.contains("light");
    set({ theme: isLight ? "light" : "dark" });
  },
}));
