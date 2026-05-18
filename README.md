# Kashef Ai Web

Saudi-ready Next.js frontend for the Kashef Ai industrial predictive maintenance and safety platform.

## What This Repo Contains

- Executive dashboard
- Asset registry and asset detail pages
- Machine health, work orders, incidents, safety, reports
- Admin users, intake, and settings workspaces
- English and Arabic runtime locale switch with RTL support
- Secure server-side agent assistant route for OpenAI + Kashef tool orchestration

## Recommended GitHub Repo Name

- `kashefai-web`

## Upload To GitHub

Upload the contents of this folder:

- `apps/web`

Upload these first:

1. `package.json`
2. `package-lock.json`
3. `next.config.ts`
4. `tsconfig.json`
5. `tailwind.config.ts`
6. `postcss.config.js`
7. `.env.example`
8. `app/`
9. `components/`
10. `lib/`
11. `tests/`
12. `Dockerfile`
13. `README.md`

Do not upload:

- `node_modules/`
- `.next/`
- `.env.local`

## Vercel Deployment

This repo is suitable for Vercel.

Required environment variables:

- `NEXT_PUBLIC_API_URL`
- `KASHEF_BASE_URL`
- `KASHEF_AGENT_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Local Run

```bash
npm install
npm run dev
```

Default app URL:

- `http://localhost:3000`

## Important Note

This frontend depends on the Kashef Ai backend API. Deploy the backend separately and point `NEXT_PUBLIC_API_URL` and `KASHEF_BASE_URL` to that live backend.
