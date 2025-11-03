import { useTheme } from "@/theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	return (
		<Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="transition-colors duration-300">
			{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
		</Button>
	);
}
