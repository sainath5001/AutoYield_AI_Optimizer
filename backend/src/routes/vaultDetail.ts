import { Router } from "express";
import { vaultDetailController } from "../controllers/vaultDetailController";

export const vaultDetailRouter = Router();

vaultDetailRouter.get(
  "/vault-detail/:chainId/:address",
  vaultDetailController,
);
