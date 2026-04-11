import { Router } from "express";
import { vaultsController } from "../controllers/vaultsController";

export const vaultsRouter = Router();

vaultsRouter.get("/vaults", vaultsController);
