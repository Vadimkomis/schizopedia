export interface GuideCallout {
  tone: "info" | "warning";
  text: string;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: GuideCallout;
}

export interface Guide {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  readingMinutes: number;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    id: "what-is-schizophrenia",
    title: "What is schizophrenia, actually?",
    shortTitle: "What it is",
    description:
      "A plain-language explanation of what schizophrenia is, what it isn't, and why it's more treatable than you've heard.",
    readingMinutes: 6,
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          "Schizophrenia is a brain condition that changes how a person perceives reality. It can cause hallucinations (seeing or hearing things others don't), delusions (firm beliefs that don't match reality), disorganized thinking, and a pulling-away from daily life.",
          "It affects roughly 1 in 100 people worldwide, across every country and culture. It usually appears in late adolescence or early adulthood — often between 18 and 25 for men, and 25 and 35 for women.",
          "Most importantly: it is treatable. Many people with schizophrenia work, study, have relationships, and live full lives, especially when treatment starts early.",
        ],
      },
      {
        heading: "What it is not",
        paragraphs: [
          "Decades of movies and headlines have attached myths to this word. Letting go of them is the first real step.",
        ],
        bullets: [
          "It is not a \"split personality.\" That confusion comes from the word's Greek roots; multiple personalities are a completely different (and rare) condition.",
          "It does not make someone violent. People with schizophrenia are far more likely to be victims of violence than to commit it.",
          "It is not caused by bad parenting, weakness, or anything you or they did wrong.",
          "It is not hopeless. Outcomes have improved dramatically, and early treatment changes the trajectory.",
        ],
      },
      {
        heading: "Positive and negative symptoms (confusing names, simple idea)",
        paragraphs: [
          "Doctors split symptoms into two groups with unhelpful names. \"Positive\" symptoms are experiences that are added — hallucinations, delusions, disorganized speech. \"Negative\" symptoms are things that are taken away — motivation, emotional expression, pleasure, social energy.",
          "Negative symptoms often look like laziness or depression from the outside. They're not a choice. Knowing this can save a family a lot of conflict.",
        ],
      },
      {
        heading: "Why did this happen?",
        paragraphs: [
          "There is no single cause. Genetics play a large role — the condition runs in families — combined with differences in brain development and environmental stressors. Heavy cannabis use in adolescence is a known risk factor for vulnerable people.",
          "What the research is clear about: nobody causes someone else's schizophrenia. Guilt is a very common feeling for parents and partners, and it is misplaced.",
        ],
        callout: {
          tone: "info",
          text: "Everything on this site links to peer-reviewed research. When you're ready to go deeper, the research feed shows the newest studies on diagnosis, treatment, and prevention.",
        },
      },
      {
        heading: "The reason for hope",
        paragraphs: [
          "The single most consistent research finding of the last two decades: the earlier treatment starts, the better the long-term outcome. Modern care — medication plus therapy plus family support — helps most people reduce or eliminate psychotic symptoms.",
          "Recovery rarely means the condition vanishes. It means symptoms become manageable and life opens back up. That is a realistic goal, not wishful thinking.",
        ],
      },
    ],
  },
  {
    id: "early-warning-signs",
    title: "Early warning signs",
    shortTitle: "Warning signs",
    description:
      "The changes that often appear months before a first episode — and how to tell them apart from ordinary teenage or young-adult behavior.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Why early matters",
        paragraphs: [
          "Schizophrenia rarely appears out of nowhere. Most people go through a gradual lead-up phase — researchers call it the prodrome — that can last months or years. Catching it during this window matters, because the time between first symptoms and first treatment is one of the strongest predictors of long-term outcome.",
          "You are not overreacting by paying attention. Acting early is the most protective thing a family can do.",
        ],
      },
      {
        heading: "Common early changes",
        paragraphs: [
          "No single sign means schizophrenia. What matters is a cluster of changes, a clear departure from who the person used to be, lasting weeks or months:",
        ],
        bullets: [
          "Withdrawing from friends, family, and activities they used to love",
          "A slide in school or work performance that doesn't bounce back",
          "Trouble concentrating, following conversations, or thinking clearly",
          "Suspiciousness or unease around people they previously trusted",
          "Saying things that are hard to follow, or beliefs that seem off (\"people are watching me\", special messages meant just for them)",
          "Hearing or seeing things others don't — or seeming to react to things that aren't there",
          "Neglecting hygiene and sleep; days and nights flipped",
          "Flat or inappropriate emotional reactions; speaking less, in fewer words",
        ],
      },
      {
        heading: "Normal adolescence vs. cause for concern",
        paragraphs: [
          "Teenagers withdraw, sleep odd hours, and guard their privacy — that alone is not a warning sign. The differences that matter are degree, duration, and direction: ordinary moodiness comes and goes, while a prodrome tends to deepen over months. A teen who skips family dinner but keeps their friends is being a teen; one who loses every friendship and stops leaving their room is signaling something else.",
          "Trust your knowledge of the person. The most reliable early signal families report is simply: \"they stopped being themselves.\"",
        ],
      },
      {
        heading: "What to do if you're seeing this",
        paragraphs: [
          "Don't wait for a crisis, and don't try to diagnose at home. A family doctor or a first-episode psychosis clinic can do a proper assessment — and assessments are not commitments; the worst case is reassurance.",
          "When you raise it with your loved one, lead with care, not labels: \"I've noticed you seem really stressed and I'm worried about you\" lands much better than naming a diagnosis. Offer to book and attend the appointment with them.",
        ],
        callout: {
          tone: "warning",
          text: "If someone is talking about harming themselves or others, or is in acute crisis, treat it as an emergency now — in the U.S., call or text 988; elsewhere, contact your local emergency number or crisis line.",
        },
      },
    ],
  },
  {
    id: "getting-help",
    title: "How to get help",
    shortTitle: "Getting help",
    description:
      "Who to call first, what an assessment actually involves, and how to navigate the system when your loved one isn't sure they want help.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Where to start",
        paragraphs: [
          "The system is confusing, so here is the simple version: start with a family doctor (GP/primary care) or, if your area has one, a first-episode psychosis program — these specialized early-intervention clinics exist in many countries and are designed exactly for this situation.",
          "If symptoms are severe or escalating quickly, an emergency department can do a psychiatric evaluation the same day.",
        ],
      },
      {
        heading: "What an assessment looks like",
        paragraphs: [
          "There is no blood test or brain scan that diagnoses schizophrenia. A psychiatrist diagnoses by talking — about experiences, history, and timeline — usually across more than one visit, while ruling out other causes (drug effects, thyroid problems, other conditions that can mimic psychosis).",
          "Expect uncertainty at first. Clinicians often start with a broader label like \"first-episode psychosis\" before anyone commits to the word schizophrenia. That's careful practice, not evasion.",
        ],
      },
      {
        heading: "If they don't want help",
        paragraphs: [
          "This is the hardest and most common situation. A person in psychosis often genuinely cannot tell that their experiences aren't real — it's a symptom called anosognosia, not stubbornness.",
          "What tends to work: stay on their side. Argue less about what's real, and connect more over what they're feeling (\"that sounds exhausting\"). Look for a door they will walk through — they may refuse a psychiatrist but accept help with sleep or stress from a family doctor.",
          "Many families find the LEAP approach (Listen, Empathize, Agree, Partner) genuinely useful. And if safety is at risk, every region has a legal route to an involuntary evaluation — a last resort, but one you should know exists.",
        ],
        callout: {
          tone: "info",
          text: "You can usually share information with a clinician even when privacy laws prevent them from sharing back. Writing down what you've observed, with dates, is one of the most useful things a family member can do.",
        },
      },
      {
        heading: "Build your own support too",
        paragraphs: [
          "Organizations like NAMI (in the U.S.) and similar family associations elsewhere run free programs for families — peer support from people who have stood exactly where you're standing. You do not have to learn all of this alone.",
        ],
      },
    ],
  },
  {
    id: "treatment-explained",
    title: "What treatment looks like",
    shortTitle: "Treatment",
    description:
      "Antipsychotics, therapy, and early-intervention programs explained without jargon — including the honest parts about side effects and finding the right fit.",
    readingMinutes: 8,
    sections: [
      {
        heading: "The three pillars",
        paragraphs: [
          "Modern schizophrenia care stands on three legs: medication to quiet psychotic symptoms, talk-based therapies to rebuild skills and manage stress, and social support — family, housing, school or work — to give recovery somewhere to happen. The combination works far better than any piece alone.",
        ],
      },
      {
        heading: "Antipsychotic medication, honestly",
        paragraphs: [
          "Antipsychotics are the foundation of treatment for most people. They are genuinely effective against hallucinations and delusions — for many people the change is dramatic within weeks.",
          "The honest part: the first medication tried isn't always the right one, and side effects (weight gain, sleepiness, restlessness) are real. Finding the right drug at the right dose can take patience and a few adjustments. This trial period is normal, not a sign treatment is failing.",
          "Long-acting injections — one dose every few weeks instead of daily pills — remove the daily remembering-to-take-it battle and are an underused option worth asking about. For treatment-resistant cases, clozapine is a specific, well-evidenced option clinicians sometimes delay too long.",
        ],
        callout: {
          tone: "warning",
          text: "Stopping medication abruptly is the most common trigger for relapse. Any change should happen with the prescriber, gradually.",
        },
      },
      {
        heading: "Therapy and skills",
        paragraphs: [
          "Cognitive behavioral therapy for psychosis (CBTp) helps people examine distressing beliefs and reduce the power of voices. Cognitive remediation rebuilds attention and memory. Family psychoeducation — where you learn alongside your loved one — measurably reduces relapse rates. Supported employment and education programs help people return to real life, which is itself therapeutic.",
        ],
      },
      {
        heading: "What recovery realistically looks like",
        paragraphs: [
          "Recovery is usually a zigzag, not a straight line — good months, setbacks, adjustments. A relapse is a detour, not a verdict.",
          "The realistic, evidence-backed expectation: with sustained treatment, most people achieve substantial symptom control, and a meaningful portion reach long-term remission. The research feed on this site tracks the treatments still being developed — there is a steady pipeline of genuinely new approaches.",
        ],
      },
    ],
  },
  {
    id: "caring-for-yourself",
    title: "Caring for yourself as a caregiver",
    shortTitle: "For caregivers",
    description:
      "Burnout, guilt, and grief are part of this — here's how to carry it without it breaking you.",
    readingMinutes: 6,
    sections: [
      {
        heading: "Your wellbeing is part of the treatment plan",
        paragraphs: [
          "This is not a platitude. Family environment measurably affects relapse rates, and an exhausted, frightened caregiver helps no one — least of all the person they love. Looking after yourself is a clinical intervention, not selfishness.",
        ],
      },
      {
        heading: "The feelings nobody warns you about",
        paragraphs: [
          "Caregivers consistently report the same set of feelings, usually in secret: guilt (\"did I cause this?\" — you didn't), grief for the future you'd imagined, anger at the person and then shame about the anger, and loneliness as friends quietly drop away.",
          "All of these are normal. Saying them out loud — to a therapist, a support group, or another caregiver — is reliably what makes them lighter.",
        ],
      },
      {
        heading: "Practical protections",
        paragraphs: ["A few things experienced caregivers say they wish they'd done sooner:"],
        bullets: [
          "Join a family support group (NAMI Family-to-Family or your local equivalent) — peer knowledge is gold and it's free",
          "Keep one activity and one friendship that have nothing to do with caregiving, and defend them",
          "Share the load: make a list of what others can do, and actually hand tasks over when people offer",
          "Keep a simple log of symptoms, medications, and appointments — it reduces mental load and makes every clinical visit more useful",
          "Decide in advance what a crisis plan looks like: who you call, which hospital, what you tell siblings or children",
          "Get your own therapist if you can. You're absorbing a lot; you deserve a place to put it down",
        ],
      },
      {
        heading: "The long view",
        paragraphs: [
          "Families who do well over the long run tend to land in the same place: they stop fighting the diagnosis, learn everything they can, set sustainable boundaries, and rebuild a relationship with the person as they are now. It takes time to get there, and there is no deadline.",
          "You are doing something hard and decent. The fact that you're reading this at all says your loved one has an advantage many people never get.",
        ],
        callout: {
          tone: "info",
          text: "If you ever have thoughts of harming yourself under the weight of caregiving, that is a crisis in its own right — in the U.S., call or text 988. Caregivers count too.",
        },
      },
    ],
  },
];

export function getGuide(id: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.id === id);
}

export function getAdjacentGuides(id: string): {
  previous: Guide | undefined;
  next: Guide | undefined;
} {
  const index = GUIDES.findIndex((guide) => guide.id === id);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: index > 0 ? GUIDES[index - 1] : undefined,
    next: index < GUIDES.length - 1 ? GUIDES[index + 1] : undefined,
  };
}
