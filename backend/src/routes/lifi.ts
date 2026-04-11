import { Router } from "express";
import { depositQuoteController } from "../controllers/depositQuoteController";
import { portfolioController } from "../controllers/portfolioController";

export const lifiRouter = Router();

lifiRouter.post("/deposit-quote", depositQuoteController);
lifiRouter.get("/portfolio/:address", portfolioController);
