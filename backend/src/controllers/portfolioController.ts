import type { Request, Response } from "express";
import axios from "axios";
import { fetchWalletPositions } from "../services/portfolioEarnService";

export async function portfolioController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const address = String(req.params.address ?? "").trim();
    if (!address.startsWith("0x") || address.length < 42) {
      res.status(400).json({
        error: "invalid_address",
        message: "Expected a valid 0x wallet address",
      });
      return;
    }

    const positions = await fetchWalletPositions(address);
    res.json({ positions, total: positions.length });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ?? err.message;
      res.status(502).json({
        error: "earn_portfolio_failed",
        message: msg,
      });
      return;
    }
    const message =
      err instanceof Error ? err.message : "Failed to fetch portfolio";
    res.status(500).json({ error: "portfolio_failed", message });
  }
}
