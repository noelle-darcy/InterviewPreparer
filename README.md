# InterviewMate — AI Interviewer (scaffold)

This is a minimal React + Vite + TypeScript + Tailwind scaffold for InterviewMate — an AI interviewer that uses Gemini (AI), ElevenLabs (voice), and Cloudflare Pages for hosting. Backend endpoints are stubbed and marked with TODOs.

Environment variables (set in Cloudflare Pages or .env):
- VITE_GEMINI_API_KEY
- VITE_ELEVENLABS_API_KEY

Getting started (locally):

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

Deployment (Cloudflare Pages):

1. Push this repo to GitHub.
2. In Cloudflare Pages, connect the GitHub repo and set the build command to `npm run build` and the publish directory to `dist`.
3. Add environment variables in the Pages project settings (VITE_GEMINI_API_KEY, VITE_ELEVENLABS_API_KEY).

Notes:
- API calls are mocked in `src/api/api.ts`. Replace with real fetch requests to your backend endpoints:
  - POST /api/generate -> generateInterview
  - POST /api/voice -> getVoice
  - POST /api/evaluate -> evaluateAnswer
  - POST /api/mint -> mintBadge
- Tailwind is configured in `tailwind.config.cjs`.

Next steps:
- Wire up real backend endpoints and secure API keys on the server-side.
- Add auth/session management and persisted storage for interview sessions.
