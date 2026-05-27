import { Router } from "express";

const router = Router();

// Simple in-memory store for demo purposes
const audits = new Map();

// POST /audit - create a new audit job/result
router.post("/", (req, res) => {
  try {
    const payload = req.body || {};
    console.log('POST /audit content-type:', req.headers['content-type']);
    try {
      console.log('POST /audit payload (stringified):', JSON.stringify(payload));
    } catch (sErr) {
      console.log('POST /audit payload (stringify failed):', sErr && sErr.message);
    }

    const id = String(Date.now()) + Math.floor(Math.random() * 1000);
    const record = { id, createdAt: new Date().toISOString(), ...payload };
    audits.set(id, record);
    return res.status(201).json({ id, record });
  } catch (err) {
    console.error('POST /audit error', err && err.stack ? err.stack : err);
    console.error('Payload that caused error:', req.body);
    return res.status(500).json({ error: 'Unexpected server error', detail: err && err.message });
  }
});

// GET /audit/:id - fetch a specific audit
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!audits.has(id)) {
    return res.status(404).json({ error: `Audit ${id} not found` });
  }
  return res.json({ audit: audits.get(id) });
});

// GET /audit?company=<name> - search audits by company name
router.get("/", (req, res) => {
  const { company } = req.query;
  const results = [...audits.values()].filter((a) =>
    company ? String(a.company || "").toLowerCase().includes(String(company).toLowerCase()) : true
  );
  return res.json({ results });
});

export default router;
