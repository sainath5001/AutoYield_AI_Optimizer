import "dotenv/config";
import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health";
import { vaultsRouter } from "./routes/vaults";
import { recommendationRouter } from "./routes/recommendation";
import { lifiRouter } from "./routes/lifi";
import { vaultDetailRouter } from "./routes/vaultDetail";

const app = express();
const port = Number(process.env.PORT) || 4000;

const corsOptions: cors.CorsOptions = {
  origin: true,
  methods: ["GET", "POST", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", vaultsRouter);
app.use("/api", recommendationRouter);
app.use("/api", lifiRouter);
app.use("/api", vaultDetailRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
