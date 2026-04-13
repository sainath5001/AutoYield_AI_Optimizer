# Plan: Vault auto-rebalancing (LI.FI ecosystem)

This document describes how to add **automatic or semi-automatic rebalancing** of user positions across **Earn vaults** in **AutoYield AI Optimizer**, which already uses **LI.FI Earn** (discovery + portfolio) and **LI.FI Composer** (`li.quest` quotes) for deposits.

---

## 1. Reality check: what LI.FI gives you

| Capability | LI.FI surface | Notes |
| --- | --- | --- |
| Discover vaults + APY | Earn Data API (`earn.li.fi`, e.g. `/v1/earn/vaults`) | Already used by `GET /api/vaults`. |
| See wallet positions | Earn portfolio (e.g. `/v1/earn/portfolio/{addr}/positions`) | Already used by `GET /api/portfolio/:address`. |
| Build deposit / swap / bridge txs | Composer / `li.quest` (e.g. `/v1/quote`) | Already used by `POST /api/deposit-quote`. |

**LI.FI does not provide a hosted “auto-rebalance my vault every week” product.** You orchestrate:

1. **Monitoring** (which vault is best vs where the user is).
2. **Exit** from the current position (redeem vault shares → usually USDC or an intermediate asset).
3. **Entry** into the new vault (USDC → vault via Composer where supported).

So “using LI.FI for everything” here means: **Earn for signal + portfolio**, **Composer for routable transactions**, not a single “rebalance” endpoint.

---

## 2. Target behavior (define before building)

Answer these product questions; they drive architecture:

- **Fully automatic** (cron moves funds without user click) vs **suggested rebalance** (notify + one-click batch) vs **manual only** (current app).
- **Whose keys sign txs?** Only the user’s EOA/session (safest UX) vs smart wallet / session keys (more automation, more risk and compliance).
- **Chains** (today: Ethereum + Arbitrum USDC) — rebalance **per chain** first; cross-chain adds bridge risk and latency.
- **Frequency**: weekly schedule, APY delta threshold, or both.
- **Constraints**: min move size (gas vs benefit), max slippage, protocol allowlist/blocklist, cooldown after rebalance.

---

## 3. On-chain flow (conceptual)

Typical “move from vault A to vault B” on the **same chain**:

1. **Read** position: which vault token / share balance (Earn portfolio + on-chain if needed).
2. **Exit A**: transaction(s) to redeem or zap out of A → **USDC** (or asset Composer accepts as `fromToken`).
3. **Enter B**: `fromToken = USDC`, `toToken = vault B address`, same pattern as current deposit quote.

Some vaults use **non-standard** redemption paths; Composer must return a valid route. If **no route**, the product must **degrade** (show manual steps or block auto-rebalance for that vault).

Cross-chain rebalance: exit to USDC on chain X → **bridge** → deposit on chain Y — use LI.FI **bridge/swap** quotes with explicit user consent and higher fee/slippage tolerance.

---

## 4. Proposed architecture (phased)

### Phase A — “Rebalance suggestion” (no auto-exec)

**Goal:** Close the gap with minimal risk.

- Backend job or on-demand API: compare **current portfolio** (`/api/portfolio/:address`) with **top vaults** (`/api/vaults` or direct Earn).
- If **better vault** exceeds threshold (e.g. +0.5% APY net of rough gas), return `{ suggestedVault, reason, estimatedSteps }`.
- Frontend: banner or card **“Move to higher yield”** → user runs **wizard**: quote exit → quote enter (reuse/extend `deposit-quote` patterns).

**Deliverables:** New API route(s), types, UI panel, no scheduler, no unsigned automation.

### Phase B — “One-click rebalance” (user signs once or a short sequence)

**Goal:** Bundle exit + entry UX.

- Sequence: request **exit quote** (Composer: `fromToken` = vault share token if supported, `toToken` = USDC), then **deposit quote** into B with **output amount** of step 1 as **input** to step 2 (may require allowance checks between steps).
- Frontend: wagmi `sendTransaction` for each step; clear loading/error states; optional **session** for approvals.

**Deliverables:** `composerService` extensions, `useRebalance` hook, vault share token resolution (from Earn vault detail or chain config).

### Phase C — Scheduled / automatic (high complexity)

**Goal:** Time-based or event-based execution.

- **Off-chain worker** (cron, queue): loads users who opted in, fetches APY + positions, decides rebalance.
- **Signing:**  
  - **Option 1:** Push notification → user opens app and signs (still not fully automatic).  
  - **Option 2:** Smart account + session keys / spend limits (Account Abstraction) — **security audit** and legal review.  
  - **Option 3:** **Never** custody keys server-side for mainnet production without hardened HSM and compliance.

**Deliverables:** Worker service, DB for preferences and audit log, rate limits, kill switch.

---

## 5. Backend work items (sketch)

| Item | Purpose |
| --- | --- |
| `GET` or internal use of Earn vault **detail** (if needed) | Resolve share token, redeem paths. |
| `POST /api/rebalance-quote` (or split exit/entry) | Proxy Composer for exit + deposit; validate chain/token. |
| Optional: `POST /api/rebalance-plan` | Pure planning: APY diff, est. gas, eligible/ineligible. |
| Config | Thresholds, allowed protocols, `LIFI_INTEGRATOR`, timeouts. |

Reuse **`LIFI_API_KEY`** on all `earn.li.fi` and `li.quest` calls (already pattern in `vaultService`, `composerService`, `portfolioEarnService`).

---

## 6. Frontend work items (sketch)

| Item | Purpose |
| --- | --- |
| Rebalance entry point | From portfolio row or global CTA. |
| Flow state machine | Idle → quoting exit → user sign → quoting deposit → user sign → done. |
| Allowance + balance checks | USDC and vault share approvals as required by routes. |
| Settings | Thresholds, opt-in to suggestions vs auto (future). |

---

## 7. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| APY is not guaranteed yield | Label as **indicative**; show historical/volatile disclaimer. |
| Exit liquidity / route failure | Pre-flight quote; abort with clear message. |
| Gas eats profit | Min notional; show **net benefit estimate**. |
| MEV / sandwich | Prefer private RPC or batching where applicable; document tradeoffs. |
| Regulatory | “Auto” moving user funds may touch **investment advice** or **custody** rules — get legal input before marketing automation. |

---

## 8. Using Cursor on this repo

- **Explore:** `@backend/src/services/` for Earn + Composer patterns; extend rather than fork.
- **Shared types:** Add rebalance types under `shared/` for FE/BE alignment.
- **Incremental:** Ship **Phase A** first; keep **Phase C** behind feature flags.
- **LI.FI MCP (optional):** Your Cursor `mcp.li.quest` connection helps validate parameters while designing quotes; runtime remains **your** Express + axios calls.

---

## 9. Success criteria (suggested)

- [ ] User can see **whether** rebalance is worthwhile (plan/suggestion).
- [ ] User can **execute** exit + deposit when Composer supports both legs (Phase B).
- [ ] No silent custody; **explicit** consent for each signing step until AA is introduced.
- [ ] Logs/metrics for failed quotes and user aborts.

---

## 10. Open questions

1. Share token address: always available from Earn vault list/detail, or need per-protocol adapters?
2. Do target vaults require **zap** only (Morpho/Euler) vs plain ERC4626 redeem?
3. Is **cross-chain** rebalance in scope for v1?

---

*Document version: 1.0 — aligns with AutoYield AI Optimizer stack (Next.js + Express + shared types + LI.FI Earn + Composer).*
