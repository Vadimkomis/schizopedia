import {
  Activity,
  BookOpen,
  BarChart3,
  Globe,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="container pb-16 scroll-mt-20 lg:pb-24">
      <div className="grid items-center gap-8 rounded-3xl border border-teal-border bg-teal-surface px-6 py-10 dark:border-emerald-500/20 dark:bg-emerald-900/15 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-12 lg:py-14">
        <AboutIllustration />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
            About Schizopedia
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-3xl">
            Making Research Accessible. Empowering Minds.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Schizopedia is an independent educational platform dedicated to
            helping everyone understand the latest research on schizophrenia.
            We translate complex scientific discoveries into clear, reliable,
            and accessible information for patients, families, caregivers,
            students, and professionals.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <ValueProp
              icon={ShieldCheck}
              title="Evidence-Based"
              body="We provide content grounded in peer-reviewed research."
            />
            <ValueProp
              icon={Users}
              title="Accessible for All"
              body="Clear explanations for every reader."
            />
            <ValueProp
              icon={Globe}
              title="Independent & Trusted"
              body="We are committed to accuracy and transparency."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueProp({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-300">
        <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
      </span>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
      </div>
    </div>
  );
}

function AboutIllustration() {
  const satellites: {
    icon: typeof BookOpen;
    position: string;
  }[] = [
    { icon: BookOpen, position: "top-0 left-1/2 -translate-x-1/2" },
    { icon: Users, position: "top-1/4 -left-2" },
    { icon: Heart, position: "top-1/4 -right-2" },
    { icon: BarChart3, position: "bottom-0 left-1/2 -translate-x-1/2" },
  ];

  return (
    <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
      <svg
        viewBox="0 0 240 240"
        className="absolute inset-0 h-full w-full text-emerald-400/60 dark:text-emerald-300/40"
        aria-hidden="true"
      >
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-emerald-500/70 bg-white shadow-lg dark:bg-emerald-900/40">
        <Activity
          className="h-10 w-10 text-emerald-600 dark:text-emerald-300"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      {satellites.map(({ icon: Icon, position }, i) => (
        <span
          key={i}
          className={`absolute flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/60 bg-white text-emerald-600 shadow-sm dark:border-emerald-400/30 dark:bg-emerald-900/30 dark:text-emerald-200 ${position}`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}
