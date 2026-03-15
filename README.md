# Sourcewave

Sourcewave is a Next.js App Router app for grounded voice products. It turns a pasted URL or topic into a short two-host audio asset using Needle for retrieval, Featherless AI for script generation, and ElevenLabs for audio.

## Required APIs

Add these values to `.env.local`:

```bash
NEEDLE_API_KEY=
FEATHERLESS_API_KEY=
FEATHERLESS_MODEL=Qwen/Qwen2.5-7B-Instruct
ELEVENLABS_API_KEY=
ELEVENLABS_MODEL_ID=eleven_v3
ELEVENLABS_VOICE_ID_HOST_A=
ELEVENLABS_VOICE_ID_HOST_B=
```

What each one does:

- `NEEDLE_API_KEY`: extracts and semantically searches public URLs.
- `FEATHERLESS_API_KEY`: generates the structured two-host script.
- `FEATHERLESS_MODEL`: optional model override for Featherless.
- `ELEVENLABS_API_KEY`: lists voices, exposes previews, and renders the final dialogue audio.
- `ELEVENLABS_VOICE_ID_HOST_A` and `ELEVENLABS_VOICE_ID_HOST_B`: optional defaults if you do not want to pick voices in the UI.

## Contact flow

The contact page submits to Formspree using:

```bash
https://formspree.io/f/xjgaewza
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main routes

- `/`: marketing landing page
- `/studio`: live generator studio
- `/how-it-works`: product workflow explanation
- `/use-cases`: applied use cases
- `/blog`: seeded blog index
- `/contact`: Formspree-backed contact form
- `/careers`: brand and hiring page
- `/privacy-policy`: privacy page
- `/terms-and-conditions`: terms page

## Main files

- `app/api/generate/route.ts`: end-to-end orchestration
- `app/api/voices/route.ts`: loads available ElevenLabs voices for the UI
- `lib/needle.ts`: URL extraction and retrieval helper
- `lib/script.ts`: Featherless AI script generation
- `lib/elevenlabs.ts`: voice listing and dialogue audio generation
- `components/podcast-studio.tsx`: studio UI

## Testing

```bash
npm run lint
npm run build
npm run test:e2e
```
