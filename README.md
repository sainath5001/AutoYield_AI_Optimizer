# AutoYield AI Optimizer

Monorepo layout for the **DeFi Mullet Hackathon** build: Next.js (App Router) frontend, Express + TypeScript API, and shared types for LI.FI Earn–powered flows.

## Structure

| Path | Role |
| --- | --- |
| `frontend/` | Next.js 16, Tailwind v4, wagmi + RainbowKit |
| `backend/` | Express API (OpenAI + Earn integration next) |
| `shared/` | Shared `Vault` and `Recommendation` types |

## Setup

1. **Frontend env:** copy `frontend/.env.example` to `frontend/.env.local` and set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` from [WalletConnect Cloud](https://cloud.walletconnect.com/).

2. **Backend env:** copy `backend/.env.example` to `backend/.env` and set `OPENAI_API_KEY` when you add AI routes.

3. Install and run:

```bash
cd frontend && npm install && npm run dev
```

```bash
cd backend && npm install && npm run dev
```

From the repo root you can use:

```bash
npm run dev:frontend
npm run dev:backend
```

## Health check

With the API running: `GET http://localhost:4000/api/health`
