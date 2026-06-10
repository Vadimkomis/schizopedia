import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-blue-300/50 dark:hover:bg-blue-400/10",
        className,
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sun
          className={cn(
            "h-4 w-4 text-blue-600 transition",
            theme === "dark" && "scale-0 opacity-0",
          )}
        />
        <Moon
          className={cn(
            "absolute h-4 w-4 text-blue-200 transition",
            theme === "light" && "-rotate-90 scale-0 opacity-0",
            theme === "dark" && "rotate-0 scale-100 opacity-100",
          )}
        />
      </span>
    </button>
  );
}
