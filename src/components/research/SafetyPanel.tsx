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
    <Card id="read-first" className="border-blue-200 bg-white dark:border-blue-300/30 dark:bg-[#0f172a]">
      <CardHeader>
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
          <div>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              Read this first
            </CardTitle>
            <CardDescription className="mt-1 text-slate-700 dark:text-white/80">
              This library is for learning, not diagnosis or treatment.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-white/80">
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
