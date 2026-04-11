import type { Vault } from "./vault";

export type UserPreference = "safe" | "balanced" | "high_yield";

/**
 * AI / rules engine output: a suggested vault for the current user context.
 */
export interface Recommendation {
  vault: Vault;
  /** Relative ranking score (0–100), semantics defined by your engine */
  score: number;
  reasoning?: string;
  preference: UserPreference;
}

export type RecommendationSource = "openai" | "fallback";

/** POST /api/recommendation */
export interface AiRecommendationResponse {
  vault: Vault;
  reason: string;
  source: RecommendationSource;
}
