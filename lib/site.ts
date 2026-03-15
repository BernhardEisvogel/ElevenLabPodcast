export interface NavItem {
  href: string;
  label: string;
}

export interface SiteCard {
  title: string;
  copy: string;
}

export interface UseCase {
  title: string;
  audience: string;
  summary: string;
  outcome: string;
}

export const siteConfig = {
  name: "Sourcewave",
  legalName: "Sourcewave Labs",
  tagline: "From source to speech, without the drift.",
  secondaryTagline: "Grounded voice products for teams building with audio.",
  description:
    "Sourcewave turns source material into polished voice products using Needle for retrieval, Featherless AI for scripts, and ElevenLabs for audio.",
  studioHref: "/studio",
  formspreeAction: "https://formspree.io/f/xjgaewza",
  navItems: [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/use-cases", label: "Use cases" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ] satisfies NavItem[],
  footerGroups: [
    {
      title: "Product",
      items: [
        { href: "/studio", label: "Studio" },
        { href: "/how-it-works", label: "How it works" },
        { href: "/use-cases", label: "Use cases" },
        { href: "/blog", label: "Blog" },
      ] satisfies NavItem[],
    },
    {
      title: "Company",
      items: [
        { href: "/careers", label: "Careers" },
        { href: "/contact", label: "Contact" },
        { href: "/privacy-policy", label: "Privacy policy" },
        { href: "/terms-and-conditions", label: "Terms and conditions" },
      ] satisfies NavItem[],
    },
  ],
};

export const homeStats = [
  {
    title: "Retrieval-first generation",
    copy: "Needle pulls the evidence before any script is written.",
  },
  {
    title: "Two-pass script control",
    copy: "Featherless drafts the conversation and rewrites it against the source.",
  },
  {
    title: "Multi-voice audio output",
    copy: "ElevenLabs renders final dialogue with live voice selection and previews.",
  },
] satisfies SiteCard[];

export const featureCards = [
  {
    title: "Website to podcast",
    copy: "Paste a public URL and generate a grounded two-host episode with transcript and audio.",
  },
  {
    title: "Voice agent briefings",
    copy: "Convert docs, product pages, and support material into short spoken briefs for agent teams.",
  },
  {
    title: "Audio explainers",
    copy: "Turn launch pages, founder notes, and internal updates into clean audio assets without a recording session.",
  },
  {
    title: "Voice previews",
    copy: "Load ElevenLabs voices live, compare hosts, and hear preview clips before generation.",
  },
  {
    title: "Grounded review",
    copy: "Inspect source input, context preview, and final transcript before trusting the rendered audio.",
  },
  {
    title: "Reusable workflows",
    copy: "Use the same stack for podcasts, demos, onboarding clips, multilingual explainers, and agent prompts.",
  },
] satisfies SiteCard[];

export const elevenLabsCapabilities = [
  {
    title: "Multi-speaker dialogue",
    copy: "Generate host A and host B audio in one flow instead of stitching clips by hand.",
  },
  {
    title: "Voice library previews",
    copy: "Browse account voices, sample previews, and choose a pair that matches the tone of the project.",
  },
  {
    title: "Brand voice assets",
    copy: "Use the same voice stack for product explainers, narrated walkthroughs, outbound demos, and internal training.",
  },
  {
    title: "Voice-agent content",
    copy: "Prepare spoken handoffs, onboarding prompts, and persona-driven responses that start from real source material.",
  },
] satisfies SiteCard[];

export const exampleFlows = [
  {
    title: "Founder site to podcast brief",
    source: "Portfolio or personal site",
    output: "2-host episode + downloadable audio",
    detail:
      "Useful when a team wants a quick spoken summary of a founder, product, or consulting practice.",
  },
  {
    title: "Docs to onboarding audio",
    source: "Knowledge base or product docs",
    output: "Short internal audio briefing",
    detail:
      "Useful for onboarding, sales enablement, or support teams that need a faster way to absorb product context.",
  },
  {
    title: "Voice-agent launch pack",
    source: "Landing page + feature docs",
    output: "Scripted demo, sample prompts, and brand-aligned voice output",
    detail:
      "Useful when shipping voice agents that need product-safe messaging and consistent spoken responses.",
  },
];

export const useCases = [
  {
    title: "Founder and portfolio audio",
    audience: "Solo founders, operators, consultants",
    summary:
      "Turn a website or project page into a polished audio summary for intros, pitches, and lightweight distribution.",
    outcome: "Move from static copy to a voice-ready asset without recording a host.",
  },
  {
    title: "Product marketing explainers",
    audience: "Startups, product marketers, launch teams",
    summary:
      "Turn launch pages, changelogs, and product notes into short narrated explainers with multiple voices.",
    outcome: "Reuse launch material across audio, demos, and sales handoffs.",
  },
  {
    title: "Customer and support training",
    audience: "Support, operations, customer success",
    summary:
      "Convert docs and playbooks into voice briefings that make dense material easier to consume.",
    outcome: "Reduce time-to-context for teams that live inside repetitive knowledge flows.",
  },
  {
    title: "Voice-agent content operations",
    audience: "AI product teams, agent builders",
    summary:
      "Prepare grounded spoken prompts, onboarding scripts, and persona packs that begin from actual source material.",
    outcome: "Keep voice agents closer to brand and closer to the truth.",
  },
  {
    title: "Thought leadership audio",
    audience: "Content teams, agencies, founders",
    summary:
      "Repurpose blog posts, essays, and research summaries into spoken content without rewriting from scratch.",
    outcome: "Extend every article into a second format with minimal production overhead.",
  },
  {
    title: "Internal briefings",
    audience: "Leadership, GTM, research teams",
    summary:
      "Turn reports, updates, and strategic notes into short internal audio summaries for fast consumption.",
    outcome: "Ship faster briefings for busy teams without asking people to read every source in full.",
  },
] satisfies UseCase[];

export const careerPrinciples = [
  "Build voice products that are actually grounded in source material.",
  "Prefer clear, debuggable systems over magic-looking AI abstractions.",
  "Design for product teams that need reliability, not just demos.",
  "Ship polished interfaces that explain complex AI workflows without hiding the tradeoffs.",
];

export const openRoles = [
  {
    title: "Founding Product Engineer",
    mode: "Remote",
    summary:
      "Own the product surface from landing pages to AI workflow UI, with equal care for speed and rigor.",
  },
  {
    title: "AI Product Designer",
    mode: "Remote",
    summary:
      "Design voice-native workflows, clarity-first AI interfaces, and brand systems that do not feel generic.",
  },
  {
    title: "Developer Relations Lead",
    mode: "Remote",
    summary:
      "Teach teams how to use Sourcewave for grounded audio content, voice agents, and product storytelling.",
  },
];

export const legalHighlights = [
  "Sourcewave processes user-submitted URLs, prompts, and contact-form data to operate the service.",
  "Audio output quality depends on third-party providers including Needle, Featherless AI, and ElevenLabs.",
  "Users are responsible for ensuring they have the right to process the source material they submit.",
];
