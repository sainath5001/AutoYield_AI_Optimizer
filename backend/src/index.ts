import "dotenv/config";
import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health";
import { vaultsRouter } from "./routes/vaults";
import { recommendationRouter } from "./routes/recommendation";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", vaultsRouter);
app.use("/api", recommendationRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
