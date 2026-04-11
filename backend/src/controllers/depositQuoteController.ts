import type { Request, Response } from "express";
import axios from "axios";
import { fetchDepositQuote } from "../services/composerService";

export async function depositQuoteController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const b = req.body as {
      fromChainId?: unknown;
      fromToken?: unknown;
      toToken?: unknown;
      fromAddress?: unknown;
      fromAmount?: unknown;
    };

    const fromChainId = Number(b.fromChainId);
    const fromToken = String(b.fromToken ?? "").trim();
    const toToken = String(b.toToken ?? "").trim();
    const fromAddress = String(b.fromAddress ?? "").trim();
    const fromAmount = String(b.fromAmount ?? "").trim();

    if (
      !Number.isFinite(fromChainId) ||
      !fromToken ||
      !toToken ||
      !fromAddress ||
      !fromAmount
    ) {
      res.status(400).json({
        error: "invalid_body",
        message:
          "Expected { fromChainId, fromToken, toToken, fromAddress, fromAmount }",
      });
      return;
    }

    const result = await fetchDepositQuote({
      fromChainId,
      fromToken,
      toToken,
      fromAddress,
      fromAmount,
    });

    res.json(result);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ?? err.message;
      res.status(502).json({
        error: "composer_quote_failed",
        message: msg,
      });
      return;
    }
    const message =
      err instanceof Error ? err.message : "Failed to fetch deposit quote";
    res.status(500).json({ error: "deposit_quote_failed", message });
  }
}
