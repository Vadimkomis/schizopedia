import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function SafetyPanel() {
  return (
    <Card id="read-first" className="border-blue-200 dark:border-blue-300/30">
      <CardHeader className="px-6 pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
          <div>
            <CardTitle className="text-xl text-ink dark:text-ink-inverse">
              Read this first
            </CardTitle>
            <CardDescription className="mt-1 text-ink-muted dark:text-ink-muted-dark">
              This library is for learning, not diagnosis or treatment.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ul className="space-y-2 text-sm text-ink-muted dark:text-ink-muted-dark">
          <li>Use findings to ask better questions, not to self-diagnose.</li>
          <li>One study is rarely enough. Look for converging evidence.</li>
          <li>For personal decisions, involve a licensed clinician.</li>
          <li>
            If someone may be in immediate danger, contact local emergency
            services right away.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
