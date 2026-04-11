import type { Request, Response } from "express";
import {
  getAiRecommendation,
  type UserPreferenceInput,
} from "../services/aiService";
import type { Vault } from "../types/vault";

const PREFERENCES: UserPreferenceInput[] = [
  "safe",
  "balanced",
  "high_yield",
];

function isPreference(x: unknown): x is UserPreferenceInput {
  return typeof x === "string" && PREFERENCES.includes(x as UserPreferenceInput);
}

function isVaultList(x: unknown): x is Vault[] {
  return Array.isArray(x) && x.every((v) => v && typeof (v as Vault).id === "string");
}

export async function recommendationController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { vaults, preference } = req.body as {
      vaults?: unknown;
      preference?: unknown;
    };

    if (!isVaultList(vaults)) {
      res.status(400).json({
        error: "invalid_body",
        message: "Expected { vaults: Vault[], preference: string }",
      });
      return;
    }

    if (!isPreference(preference)) {
      res.status(400).json({
        error: "invalid_preference",
        message: 'preference must be "safe", "balanced", or "high_yield"',
      });
      return;
    }

    const result = await getAiRecommendation(vaults, preference);
    res.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Recommendation failed";
    res.status(500).json({
      error: "recommendation_failed",
      message,
    });
  }
}
