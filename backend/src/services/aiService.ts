import OpenAI from "openai";
import type { Vault } from "../types/vault";

export type UserPreferenceInput = "safe" | "balanced" | "high_yield";

export type AiRecommendationResult = {
  vault: Vault;
  reason: string;
  source: "openai" | "fallback";
};

function pickFallbackVault(
  preference: UserPreferenceInput,
  vaults: Vault[],
): Vault {
  if (vaults.length === 0) {
    throw new Error("vaults array is empty");
  }
  const sortedByApy = [...vaults].sort((a, b) => b.apyPercent - a.apyPercent);
  if (preference === "high_yield") {
    return sortedByApy[0]!;
  }
  if (preference === "safe") {
    const low = vaults.filter((v) => v.riskLevel === "low");
    const pool = low.length > 0 ? low : vaults;
    return [...pool].sort((a, b) => b.apyPercent - a.apyPercent)[0]!;
  }
  const medium = vaults.filter((v) => v.riskLevel === "medium");
  if (medium.length > 0) {
    return [...medium].sort((a, b) => b.apyPercent - a.apyPercent)[0]!;
  }
  return sortedByApy[Math.floor(sortedByApy.length / 2)]!;
}

function fallbackReason(
  vault: Vault,
  preference: UserPreferenceInput,
): string {
  return `Selected using your "${preference}" profile: ${vault.protocol} on ${vault.chainName} balances ${preference === "safe" ? "lower risk" : preference === "high_yield" ? "maximum headline APY" : "risk and yield"}. (OpenAI unavailable — heuristic pick.)`;
}

function compactVaults(vaults: Vault[]) {
  return vaults.map((v) => ({
    id: v.id,
    protocol: v.protocol,
    chainName: v.chainName,
    chainId: v.chainId,
    apyPercent: v.apyPercent,
    riskLevel: v.riskLevel,
    tokenSymbol: v.tokenSymbol,
  }));
}

type OpenAiPick = { vaultId: string; reason: string };

function parseOpenAiJson(content: string): OpenAiPick {
  const parsed = JSON.parse(content) as unknown;
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("vaultId" in parsed) ||
    !("reason" in parsed)
  ) {
    throw new Error("Invalid AI JSON shape");
  }
  const vaultId = (parsed as { vaultId: unknown }).vaultId;
  const reason = (parsed as { reason: unknown }).reason;
  if (typeof vaultId !== "string" || typeof reason !== "string") {
    throw new Error("Invalid AI field types");
  }
  return { vaultId, reason };
}

/**
 * Uses OpenAI when `OPENAI_API_KEY` is set; otherwise deterministic fallback.
 */
export async function getAiRecommendation(
  vaults: Vault[],
  preference: UserPreferenceInput,
): Promise<AiRecommendationResult> {
  if (vaults.length === 0) {
    throw new Error("No vaults to analyze");
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    const vault = pickFallbackVault(preference, vaults);
    return {
      vault,
      reason: fallbackReason(vault, preference),
      source: "fallback",
    };
  }

  const openai = new OpenAI({ apiKey });

  const system = `You are a conservative DeFi yield analyst. You receive USDC vault opportunities from LI.FI Earn (already filtered). The user preference is one of: "safe" (prioritize low risk and sustainability), "balanced" (mix risk and APY), "high_yield" (maximize APY, accept higher risk or exotic strategies if listed).
You must respond with a single JSON object only, no markdown, with exactly these keys:
- "vaultId": string — must be copied exactly from the input list (field "id")
- "reason": string — 2–4 sentences explaining why this vault fits the user, mentioning protocol, chain, APY, and risk trade-offs.`;

  const userPayload = JSON.stringify({
    preference,
    vaults: compactVaults(vaults),
  });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPayload },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty OpenAI response");
    }

    const { vaultId, reason } = parseOpenAiJson(raw);
    const vault = vaults.find((v) => v.id === vaultId);
    if (!vault) {
      throw new Error(`AI picked unknown vaultId: ${vaultId}`);
    }

    return { vault, reason: reason.trim(), source: "openai" };
  } catch {
    const vault = pickFallbackVault(preference, vaults);
    return {
      vault,
      reason: fallbackReason(vault, preference),
      source: "fallback",
    };
  }
}
