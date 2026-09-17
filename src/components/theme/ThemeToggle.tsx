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
        "group relative inline-flex items-center justify-center rounded-full border border-line bg-surface p-2.5 text-ink-muted transition hover:border-brand-300 hover:bg-brand-50 dark:border-line-dark dark:bg-surface-dark dark:text-ink-inverse dark:hover:border-brand-300/50 dark:hover:bg-brand-400/10",
        className,
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sun
          className={cn(
            "h-4 w-4 text-accent transition",
            theme === "dark" && "scale-0 opacity-0",
          )}
        />
        <Moon
          className={cn(
            "absolute h-4 w-4 text-accent-dark transition",
            theme === "light" && "-rotate-90 scale-0 opacity-0",
            theme === "dark" && "rotate-0 scale-100 opacity-100",
          )}
        />
      </span>
    </button>
  );
}
