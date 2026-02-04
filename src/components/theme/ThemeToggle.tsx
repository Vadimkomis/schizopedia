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
        "group relative inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40",
        className,
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sun
          className={cn(
            "h-4 w-4 text-amber-500 transition",
            theme === "dark" && "scale-0 opacity-0",
          )}
        />
        <Moon
          className={cn(
            "absolute h-4 w-4 text-indigo-200 transition",
            theme === "light" && "-rotate-90 scale-0 opacity-0",
            theme === "dark" && "rotate-0 scale-100 opacity-100",
          )}
        />
      </span>
      <span className="uppercase tracking-[0.3em]">
        {theme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
