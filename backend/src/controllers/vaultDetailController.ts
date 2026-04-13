import type { Request, Response } from "express";
import axios from "axios";
import { fetchVaultApyProfile } from "../services/vaultDetailService";

const ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

export async function vaultDetailController(
  req: Request,
  res: Response,
): Promise<void> {
  const chainId = Number(req.params.chainId);
  const address = req.params.address as string;

  if (!Number.isInteger(chainId) || chainId <= 0) {
    res.status(400).json({ error: "invalid_chain_id" });
    return;
  }
  if (!address || !ADDR_RE.test(address)) {
    res.status(400).json({ error: "invalid_vault_address" });
    return;
  }

  try {
    const profile = await fetchVaultApyProfile(chainId, address);
    res.json(profile);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      res.status(404).json({
        error: "vault_not_found",
        message: "No vault for this chain and address.",
      });
      return;
    }
    const message =
      err instanceof Error ? err.message : "Failed to fetch vault detail";
    res.status(502).json({
      error: "earn_vault_detail_failed",
      message,
    });
  }
}
