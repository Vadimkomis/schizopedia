import { useId, useState } from "react";
import { Mail } from "lucide-react";
import { isValidEmail } from "@/lib/email";
import { cn } from "@/lib/utils";

type SubmitState = "idle" | "invalid" | "submitted";

export interface SubscribeFormProps {
  compact?: boolean;
  className?: string;
}

// UI-only for now: no provider is wired up, so the success state is an
// honest "launching soon" message and the address is never stored.
export function SubscribeForm({ compact = false, className }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const inputId = useId();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState(isValidEmail(email) ? "submitted" : "invalid");
  }

  if (state === "submitted") {
    return (
      <p
        role="status"
        className={cn(
          "text-sm text-slate-600 dark:text-slate-300",
          className,
        )}
      >
        Email delivery is launching soon — your address wasn&apos;t stored.
        Until then, new studies land right here every Monday.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("flex flex-col gap-2", className)}
    >
      <label
        htmlFor={inputId}
        className={cn("text-sm font-medium text-slate-700 dark:text-slate-200", compact && "sr-only")}
      >
        Email address
      </label>
      <div className={cn("flex gap-2", compact ? "max-w-xs" : "max-w-md")}>
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === "invalid") setState("idle");
          }}
          aria-invalid={state === "invalid"}
          className={cn(
            "w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500",
            compact ? "py-2" : "py-3",
            state === "invalid" && "border-red-400 dark:border-red-400/70",
          )}
        />
        <button
          type="submit"
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
            compact ? "py-2" : "py-3",
          )}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Subscribe
        </button>
      </div>
      {state === "invalid" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-300">
          Enter a valid email address.
        </p>
      )}
    </form>
  );
}
