import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeName = "light" | "dark";

type ThemeContextValue = {
	theme: ThemeName;
	setTheme: (t: ThemeName) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "scf_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<ThemeName>(() => {
		const saved = typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
		return (saved as ThemeName) || "light";
	});

	useEffect(() => {
		localStorage.setItem(THEME_KEY, theme);
		const root = document.documentElement;
		root.setAttribute("data-theme", theme);
		root.classList.toggle("dark", theme === "dark");
	}, [theme]);

	const setTheme = (t: ThemeName) => setThemeState(t);
	const toggleTheme = () => setThemeState((prev) => (prev === "light" ? "dark" : "light"));

	const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
