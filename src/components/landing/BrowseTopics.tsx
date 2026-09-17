import { ClipboardList, FlaskConical, HeartHandshake, Pill, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { TOPIC_LINKS } from "@/lib/topics";

const topicDetails: Record<string, { icon: LucideIcon; description: string }> = {
  "/category/cure": {
    icon: FlaskConical,
    description: "Explore research into the causes of schizophrenia and the search for a cure.",
  },
  "/category/diagnosis": {
    icon: ClipboardList,
    description: "Understand how schizophrenia is identified and what researchers are studying.",
  },
  "/category/treatment": {
    icon: Pill,
    description: "Browse evidence on medications, therapies, and approaches to ongoing care.",
  },
  "/category/prevention": {
    icon: HeartHandshake,
    description: "Learn about early intervention, risk reduction, and support for families.",
  },
};

export function BrowseTopics() {
  return (
    <section
      id="topics"
      aria-labelledby="topics-heading"
      className="mx-auto max-w-[1280px] scroll-mt-32 px-5 pt-4 sm:px-8 lg:px-12 lg:pt-8"
    >
      <h2 id="topics-heading" className="sr-only">Topics</h2>
      <ul className="grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-9 lg:grid-cols-4 lg:gap-8">
        {TOPIC_LINKS.map((topic) => {
          const { icon: Icon, description } = topicDetails[topic.to];
          return (
            <li key={topic.to}>
              <Link
                to={topic.to}
                aria-label={topic.label}
                className="group block rounded-lg"
              >
                <div className="flex min-h-12 items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/[0.06] text-accent transition group-hover:bg-accent/10 dark:bg-accent-dark/10 dark:text-accent-dark">
                    <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold leading-6 text-ink transition group-hover:text-accent dark:text-ink-inverse dark:group-hover:text-accent-dark">
                    {topic.label}
                  </h3>
                </div>
                <p className="mt-3 text-base leading-7 text-ink-muted dark:text-ink-muted-dark">
                  {description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
