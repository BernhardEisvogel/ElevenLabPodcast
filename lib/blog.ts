export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  author: string;
  summary: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "project-1-from-url-to-grounded-audio",
    title: "Project 1: from a pasted URL to grounded audio",
    excerpt:
      "How Sourcewave turns a public page into a transcript and polished dialogue without letting the generation layer drift from the source.",
    category: "Product",
    date: "2026-03-15",
    readingTime: "6 min read",
    author: "Sourcewave Team",
    summary:
      "The first Sourcewave workflow solves a simple but risky problem: turning source material into audio without inventing facts along the way.",
    sections: [
      {
        heading: "Why this project exists",
        paragraphs: [
          "Most AI audio demos optimize for fluency. They sound good quickly, but they rarely tell you how much of the output is supported by the source.",
          "Sourcewave was built to narrow that gap. We wanted a workflow that could retrieve evidence first, script second, and only then render the final audio.",
        ],
      },
      {
        heading: "What the stack does",
        paragraphs: [
          "Needle handles the retrieval layer. Featherless AI handles the structured script. ElevenLabs handles the final spoken output.",
          "That separation matters because each layer can be debugged independently when something goes wrong.",
        ],
        bullets: [
          "Needle extracts and searches the source material.",
          "Featherless drafts and then rewrites against the retrieved context.",
          "ElevenLabs turns the approved dialogue into audio.",
        ],
      },
      {
        heading: "Why grounded audio is a product problem",
        paragraphs: [
          "The difference between useful audio and risky audio is rarely a single prompt. It is a workflow decision about where evidence enters and where output becomes irreversible.",
          "Once a synthetic voice says something confidently, unsupported claims become harder to notice. That is why Sourcewave keeps transcript review visible in the product.",
        ],
      },
    ],
  },
  {
    slug: "voice-agent-use-cases-that-start-with-real-source-material",
    title: "Voice-agent use cases that start with real source material",
    excerpt:
      "Voice agents do not fail only at speech. They fail when the spoken layer drifts away from the product, docs, or business logic it was supposed to represent.",
    category: "Voice agents",
    date: "2026-03-15",
    readingTime: "7 min read",
    author: "Sourcewave Team",
    summary:
      "The best voice-agent workflows begin with trustworthy source material, not with improvised spoken responses.",
    sections: [
      {
        heading: "Support handoffs",
        paragraphs: [
          "Support teams can use grounded spoken summaries to help agents explain product changes, incident context, or onboarding steps more clearly.",
          "The key is not just voice quality. It is whether the spoken content maps cleanly back to the source docs.",
        ],
      },
      {
        heading: "Sales and demo flows",
        paragraphs: [
          "Voice agents for product demos often sound impressive in isolation and weak in production.",
          "A better pattern is to generate demo narration from launch pages, docs, and objection-handling material that has already been reviewed by the team.",
        ],
      },
      {
        heading: "Internal enablement",
        paragraphs: [
          "Teams can use spoken briefings to compress long internal notes into something faster to consume during onboarding or launch week.",
          "This works especially well when the underlying material is stable enough to be retrieved, searched, and reviewed before it becomes audio.",
        ],
      },
    ],
  },
  {
    slug: "why-elevenlabs-matters-after-the-script",
    title: "Why ElevenLabs matters after the script, not before it",
    excerpt:
      "Strong voices do not make weak source handling disappear. They make the end result more convincing, which raises the bar for the earlier stages.",
    category: "Audio",
    date: "2026-03-15",
    readingTime: "5 min read",
    author: "Sourcewave Team",
    summary:
      "ElevenLabs is most valuable when it enters after retrieval and script validation, not when it is used to cover up weak generation.",
    sections: [
      {
        heading: "Voice quality changes the stakes",
        paragraphs: [
          "A realistic voice can make a small unsupported claim feel trustworthy. That is not a reason to avoid audio. It is a reason to tighten the upstream workflow.",
          "In Sourcewave, ElevenLabs is downstream by design. It should not be the layer that decides what is true.",
        ],
      },
      {
        heading: "Where ElevenLabs adds leverage",
        paragraphs: [
          "The payoff comes from speed, consistency, and breadth of output. Teams can move from transcript to multi-voice asset without recording talent every time.",
          "That opens up product explainers, onboarding clips, agent persona demos, founder podcasts, and internal briefings using the same core content pipeline.",
        ],
        bullets: [
          "Voice selection and previews",
          "Consistent brand-aligned narration",
          "Faster production for repeated content formats",
        ],
      },
    ],
  },
  {
    slug: "what-grounded-audio-means-for-ai-content-teams",
    title: "What grounded audio means for AI content teams",
    excerpt:
      "Grounded audio is less about sounding robotic and more about keeping voice output tied to what the source actually says.",
    category: "Strategy",
    date: "2026-03-15",
    readingTime: "6 min read",
    author: "Sourcewave Team",
    summary:
      "Teams shipping AI-generated voice need a more operational definition of trust than just a good prompt and a nice voice.",
    sections: [
      {
        heading: "Trust is a workflow property",
        paragraphs: [
          "If a team cannot inspect the source, retrieval, and transcript before audio render, then trust depends on faith instead of process.",
          "Grounded systems should make their evidence legible to the operator.",
        ],
      },
      {
        heading: "Distribution matters",
        paragraphs: [
          "Once content becomes audio, it can move across sales, support, onboarding, social, and internal workflows very quickly.",
          "That makes disciplined content operations more important, not less. A single script can now propagate through multiple teams in spoken form.",
        ],
      },
      {
        heading: "Why this matters now",
        paragraphs: [
          "Voice agents, synthetic narration, and audio-native products are becoming normal across product teams.",
          "The next quality bar is not whether the model can speak. It is whether the team can trust what it says when it does.",
        ],
      },
    ],
  },
];

export function getBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
