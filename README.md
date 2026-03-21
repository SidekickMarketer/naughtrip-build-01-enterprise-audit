# Enterprise Audit Demo

Interactive demo site showcasing a VP-level digital marketing and MarTech vision for a large insurance intermediary.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Anthropic SDK (for the `/tool` content engine API route)

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment config:

```bash
cp .env.example .env.local
```

3. Set `ANTHROPIC_API_KEY` in `.env.local`.

4. Start local dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start dev server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - run production server

## Data notes

- Real Lighthouse summary data is stored in `data/lighthouse-summary.json`.
- Platform Health (`/platform-health`) reads from `data/platform-health-data.json`.
- Content Performance tab on `/platform-health` is intentionally illustrative and labeled as such in the UI.

## Refresh dashboard data

Use the refresh script to update live platform metrics using:
- Google PageSpeed API for Lighthouse-style performance scores and vitals.
- Live website signal detection for MarTech markers (HubSpot, GA/GTM, OneTrust, platform hints).
- Deep website audit signals (CTA clarity, contact forms, schema markup, social links, Meta Pixel, analytics coverage).
- Optional Anthropic summaries for executive-ready website audit notes.

```bash
npm run refresh:platform-health
```

Optional env var:
- `PAGESPEED_API_KEY` (or `GOOGLE_PAGESPEED_API_KEY`) for higher PageSpeed quota.
- `ANTHROPIC_API_KEY` to generate AI-enhanced website audit summaries during refresh.

## Deploy

Configured for Vercel deployment. Make sure `ANTHROPIC_API_KEY` is set in Vercel project environment variables.
