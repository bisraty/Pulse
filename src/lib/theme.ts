export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "pulse-theme";

/**
 * Executed as a raw inline script before hydration so the correct theme
 * class is on <html> before first paint (no light-flash on dark-default load).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var theme=t==='light'?'light':'dark';var r=document.documentElement;r.classList.remove('dark','light');r.classList.add(theme);r.style.colorScheme=theme;}catch(e){}})();`;
