import type { Request, Response } from "express";
import axios from "axios";
import { fetchVaults } from "../services/vaultService";

export async function vaultsController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = await fetchVaults();
    res.json({ data, total: data.length });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error fetching vaults";
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const body = err.response?.data;
      res.status(502).json({
        error: "earn_api_error",
        message,
        status,
        details: typeof body === "object" ? body : undefined,
      });
      return;
    }
    res.status(500).json({
      error: "vaults_fetch_failed",
      message,
    });
  }
}
