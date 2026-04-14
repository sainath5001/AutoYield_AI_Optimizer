# AutoYield AI Optimizer

AutoYield is a **DeFi yield dashboard + demo** built for **DeFi Mullet Hackathon #1: Builder Edition**.

It uses **LI.FI Earn** for vault discovery + standardized analytics and **LI.FI Composer** for executable deposit transactions (swap/bridge/deposit). The UI also includes a **Demo Mode** that simulates an “AI optimizer” storyline without moving funds.

## Hackathon context (DeFi Mullet)

- **Hackathon:** DeFi Mullet Hackathon #1: Builder Edition
- **Builders group (Telegram):** `https://t.me/lifibuilders`
- **Earn docs:** `https://docs.li.fi/earn/overview`
- **Submission form:** `https://forms.gle/1PCvD9BymH1EyRmV8`

## What this project does

- **Discover yield vaults** (USDC) across chains (Ethereum + Arbitrum) via **LI.FI Earn Data API**
- **Visualize APY horizons** using LI.FI Earn rolling metrics (**apy1d / apy7d / apy30d** vs current)
- **AI recommendation** (optional) using OpenAI, with a deterministic fallback if no key is set
- **One-click deposit execution** via **LI.FI Composer** quote (`li.quest`) and a wallet signature
- **Portfolio view** of Earn-indexed positions for the connected wallet address
- **Demo Mode**: step-by-step rebalance simulation (no wallet interaction required for the simulated steps)

## Repo structure

| Path | Role |
| --- | --- |
| `frontend/` | Next.js (App Router) + Tailwind v4 + wagmi v2 + RainbowKit |
| `backend/` | Express + TypeScript API (proxies Earn + Composer, keeps keys server-side) |
| `shared/` | Shared TypeScript types used by frontend and backend |

## System flow (Mermaid)

```mermaid
flowchart LR
  U[User] -->|opens| FE[Next.js Frontend]
  FE -->|GET /api/vaults| BE[Express Backend]
  BE -->|GET /v1/earn/vaults| EARN[LI.FI Earn Data API\nhttps://earn.li.fi]
  FE -->|GET /api/vault-detail/:chainId/:address| BE
  BE -->|GET /v1/earn/vaults/{chainId}/{address}| EARN
  FE -->|GET /api/portfolio/:address| BE
  BE -->|GET /v1/earn/portfolio/{address}/positions| EARN
  FE -->|POST /api/recommendation| BE
  BE -->|OpenAI (optional)| OAI[OpenAI API]
  FE -->|POST /api/deposit-quote| BE
  BE -->|GET /v1/quote| QUEST[LI.FI Composer\nhttps://li.quest]
  FE -->|sign + send tx| WALLET[Wallet]
```

## API (backend)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Liveness |
| GET | `/api/vaults` | USDC vault list on Ethereum + Arbitrum (sorted by APY, Earn Data API) |
| GET | `/api/vault-detail/:chainId/:address` | Single-vault APY profile (current + apy1d/7d/30d) from Earn |
| POST | `/api/recommendation` | `{ vaults, preference }` → AI pick + reason (fallback if `OPENAI_API_KEY` unset) |
| POST | `/api/deposit-quote` | `{ fromChainId, fromToken, toToken, fromAddress, fromAmount }` → Composer quote (`li.quest`) |
| GET | `/api/portfolio/:address` | Earn-indexed positions for a wallet |

## Environment variables

### Frontend (`frontend/.env.local`)

Copy `frontend/.env.example` → `frontend/.env.local`:

- `NEXT_PUBLIC_API_URL` (local: `http://localhost:4000`; production: your Render API origin)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (WalletConnect Cloud)
- Optional RPC overrides:
  - `NEXT_PUBLIC_MAINNET_RPC_URL`
  - `NEXT_PUBLIC_ARBITRUM_RPC_URL`

### Backend (`backend/.env`)

Copy `backend/.env.example` → `backend/.env`:

- `PORT` (default `4000`)
- `LIFI_API_KEY` (optional; higher rate limits / partner features)
- `OPENAI_API_KEY` (optional; enables live AI recommendation)
- Optional: `LIFI_INTEGRATOR` (tracking label on Composer quotes)

## Run locally

Install and run both services:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:4000/api/health`

## Deploy (recommended for this monorepo)

### Backend on Render

- Deploy the `backend/` directory as a Node web service.
- Add env vars from `backend/.env.example`.
- Verify: `https://YOUR-RENDER-URL/api/health`

### Frontend on Vercel

- Deploy the `frontend/` directory as a Next.js project.
- Set `NEXT_PUBLIC_API_URL=https://YOUR-RENDER-URL` in Vercel env vars.

## Notes / limitations (Earn APY “trend”)

LI.FI Earn exposes **rolling averages** (`apy1d`, `apy7d`, `apy30d`) and current APY. It does **not** provide a per-day historical time series in the NormalizedVault schema. The APY chart in this app therefore visualizes **real LI.FI horizon metrics** (rolling windows), not synthetic daily points.

## Official LI.FI links

- **Docs:** `https://docs.li.fi`
- **Earn overview:** `https://docs.li.fi/earn/overview`
- **Composer overview:** `https://docs.li.fi/composer/overview`
- **Builders Telegram:** `https://t.me/lifibuilders`

