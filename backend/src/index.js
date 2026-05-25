import "dotenv/config";
import express from "express";
import cors from "cors";

import pricingRouter from "./routes/pricing.js";
import auditRouter from "./routes/audit.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.PUBLIC_URL }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/pricing", pricingRouter);
app.use("/audit", auditRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`✅ CredX API running on http://localhost:${PORT}`);
  console.log(`   GET  /health`);
  console.log(`   GET  /pricing/tools`);
  console.log(`   GET  /pricing/:tool`);
  console.log(`   POST /audit`);
  console.log(`   GET  /audit/:id`);
  console.log(`   GET  /audit?company=<name>`);
});