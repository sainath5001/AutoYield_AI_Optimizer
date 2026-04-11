import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController";

export const recommendationRouter = Router();

recommendationRouter.post("/recommendation", recommendationController);
