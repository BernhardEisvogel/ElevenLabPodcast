export type HostId = "hostA" | "hostB";
export type EpisodeLanguage = "en" | "de";

export interface EpisodeHost {
  id: HostId;
  name: string;
  role: string;
}

export interface EpisodeDialogueLine {
  speaker: HostId;
  text: string;
}

export interface EpisodeCitation {
  claim: string;
  sourceUrl: string;
  sourceLabel: string;
  evidence: string;
}

export interface PodcastEpisode {
  title: string;
  hook: string;
  summary: string;
  directAnswer: string;
  checklist: string[];
  citations: EpisodeCitation[];
  hosts: EpisodeHost[];
  dialogue: EpisodeDialogueLine[];
}

export interface EpisodeAudio {
  base64: string;
  mimeType: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  previewUrl: string | null;
  category: string | null;
}

export interface RetrievedSource {
  url: string;
  label: string;
}

export interface GeneratePodcastResponse {
  source: string;
  sourceType: "topic" | "url";
  userIntent: string | null;
  language: EpisodeLanguage;
  contextPreview: string;
  retrievalContext: string;
  contextLength: number;
  relevantSources: RetrievedSource[];
  episode: PodcastEpisode & {
    estimatedCharacters: number;
    usageWarning: string | null;
  };
  audio: EpisodeAudio;
}
