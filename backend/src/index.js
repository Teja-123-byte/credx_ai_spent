import "dotenv/config";
import express from "express";
import cors from "cors";

import pricingRouter from "./routes/pricing.js";
import auditRouter from "./routes/audit.js";

const app = express();
const PORT = process.env.PORT;
const frontendPublicUrl = process.env.PUBLIC_URL;


app.set("trust proxy", 1);
app.use(
  cors({
    origin: frontendPublicUrl
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/pricing", pricingRouter);
app.use("/audit", auditRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(
    `✅ CredX API running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  if (frontendPublicUrl) {
    console.log(`   Share URL base: ${frontendPublicUrl}`);
  }
  console.log(`   GET  /health`);
  console.log(`   GET  /pricing/tools`);
  console.log(`   GET  /pricing/:tool`);
  console.log(`   POST /audit`);
  console.log(`   GET  /audit/:id`);
  console.log(`   GET  /audit?company=<name>`);
  console.log(`   GET  /audit/share/:shareId`);
});
