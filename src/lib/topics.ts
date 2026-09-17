export interface TopicLink {
  label: string;
  to: `/category/${string}`;
}

export const TOPIC_LINKS: readonly TopicLink[] = [
  { label: "Cure research", to: "/category/cure" },
  { label: "Diagnosis", to: "/category/diagnosis" },
  { label: "Treatment", to: "/category/treatment" },
  {
    label: "Prevention and early support",
    to: "/category/prevention",
  },
];
