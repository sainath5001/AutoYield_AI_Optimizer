# AutoYield AI Optimizer

Monorepo layout for the **DeFi Mullet Hackathon** build: Next.js (App Router) frontend, Express + TypeScript API, and shared types for LI.FI Earn–powered flows.

## Structure

| Path | Role |
| --- | --- |
| `frontend/` | Next.js 16, Tailwind v4, wagmi + RainbowKit |
| `backend/` | Express API — proxies LI.FI Earn vault discovery (`GET /api/vaults`) |
| `shared/` | Shared `Vault` and `Recommendation` types |

## Setup

1. **Frontend env:** copy `frontend/.env.example` to `frontend/.env.local` and set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` from [WalletConnect Cloud](https://cloud.walletconnect.com/).

2. **Backend env:** copy `backend/.env.example` to `backend/.env`. Optional: `LIFI_API_KEY` from the [LI.FI Partner Portal](https://li.fi/plans/) for higher Earn API rate limits. Set `OPENAI_API_KEY` when you add AI routes.

3. **Frontend → backend:** ensure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points at the API (default `http://localhost:4000` matches `npm run dev` for the backend).

4. Install and run:

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

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Liveness |
| GET | `/api/vaults` | USDC vaults on Ethereum + Arbitrum (sorted by APY, from [Earn Data API](https://docs.li.fi/earn/overview)) |
| POST | `/api/recommendation` | Body: `{ vaults, preference }` — OpenAI pick + reason (heuristic fallback if `OPENAI_API_KEY` unset) |

Set **`OPENAI_API_KEY`** in `backend/.env` for live AI recommendations; without it, the API uses a deterministic fallback.

Run **both** `dev:backend` and `dev:frontend` so the dashboard can load vaults and AI.
