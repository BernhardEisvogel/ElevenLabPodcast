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
  tagline: "Turn any page into a grounded podcast briefing.",
  secondaryTagline: "Website to podcast, with a reviewable workflow before audio render.",
  description:
    "Sourcewave turns websites, docs, and product notes into grounded podcasts and voice briefings you can inspect before audio is rendered.",
  studioHref: "/studio",
  chromeExtensionHref: "/chrome-extension",
  extensionDownloadHref: "/downloads/sourcewave-chrome-extension.zip",
  formspreeAction: "https://formspree.io/f/xjgaewza",
  navItems: [
    { href: "/how-it-works", label: "How it works" },
    { href: "/chrome-extension", label: "Chrome extension" },
    { href: "/contact", label: "Contact" },
  ] satisfies NavItem[],
  footerGroups: [
    {
      title: "Product",
      items: [
        { href: "/studio", label: "Studio" },
        { href: "/chrome-extension", label: "Chrome extension" },
        { href: "/how-it-works", label: "How it works" },
        { href: "/use-cases", label: "Use cases" },
        { href: "/blog", label: "Blog" },
      ] satisfies NavItem[],
    },
    {
      title: "Company",
      items: [
        { href: "/contact", label: "Contact" },
        { href: "/careers", label: "Careers" },
        { href: "/privacy-policy", label: "Privacy policy" },
        { href: "/terms-and-conditions", label: "Terms and conditions" },
      ] satisfies NavItem[],
    },
  ],
};

export const homeWorkflow = [
  {
    title: "Capture the page",
    copy: "Paste a URL in the studio or send the current tab from the Chrome extension.",
  },
  {
    title: "Review the grounded answer",
    copy: "Sourcewave retrieves context, writes the briefing, and shows evidence before audio becomes the trusted output.",
  },
  {
    title: "Render and share audio",
    copy: "Choose voices, export the finished file, and reuse the same flow for explainers, onboarding, or research briefs.",
  },
] satisfies SiteCard[];

export const featureCards = [
  {
    title: "Website to podcast",
    copy: "Turn any public page into a two-host briefing with a transcript, summary, and downloadable audio.",
  },
  {
    title: "Focused intent capture",
    copy: "Guide broad sites with a specific question so the answer stays tighter and more relevant.",
  },
  {
    title: "Grounded review surface",
    copy: "Inspect direct answers, citations, transcript lines, and the source context before you trust the audio.",
  },
  {
    title: "Chrome extension handoff",
    copy: "Grab the page you are already reading and open Sourcewave with the URL prefilled and ready to generate.",
  },
] satisfies SiteCard[];

export const extensionBenefits = [
  {
    title: "Stay in the tab you found",
    copy: "Capture the current page without copying links around or reopening the workflow from scratch.",
  },
  {
    title: "Start with the right source",
    copy: "The extension passes the exact page into Sourcewave Studio so the generation flow begins with the page you chose.",
  },
  {
    title: "Keep the review step",
    copy: "The extension speeds up capture, but the final answer, transcript, and audio still happen inside the same grounded studio workflow.",
  },
] satisfies SiteCard[];

export const extensionInstallSteps = [
  "Download the Sourcewave Chrome extension files.",
  "Unzip the downloaded archive on your computer.",
  "Open chrome://extensions in Chrome.",
  "Turn on Developer mode in the top-right corner.",
  "Click Load unpacked.",
  "Select the unzipped Sourcewave extension folder.",
  "Pin the extension from the Chrome toolbar.",
  "Open any public site and click Create podcast.",
] as const;

export const extensionHowToSteps = [
  "Open any public page you want to turn into a podcast or briefing.",
  "Click the Sourcewave extension icon to confirm the current page.",
  "Choose Create podcast to open Sourcewave Studio with the URL prefilled.",
  "Add intent if needed, review the grounded output, then render audio.",
] as const;

export const extensionTrustNotes = [
  "The extension reads only the active tab you choose when you open it.",
  "No content scripts or background site crawling are required for the v1 flow.",
  "Audio generation still happens on the Sourcewave site, not inside the browser extension.",
] as const;

export const exampleFlows = [
  {
    title: "Founder site to short audio briefing",
    source: "Portfolio or personal site",
    output: "Two-host briefing + downloadable audio",
    detail:
      "Useful when a founder, consultant, or operator wants a fast spoken summary from an existing page.",
  },
  {
    title: "Docs to onboarding audio",
    source: "Knowledge base or product docs",
    output: "Short internal voice briefing",
    detail:
      "Useful for onboarding, support, and sales teams that need fast context from existing written material.",
  },
  {
    title: "Launch page to voice-ready explainer",
    source: "Landing page + release notes",
    output: "Narrated walkthrough and shareable audio",
    detail:
      "Useful when a team wants cleaner spoken output without recording a host from scratch.",
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
