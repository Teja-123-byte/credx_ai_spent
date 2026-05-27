# Automated Tests

All automated tests I added for this task live in `backend/test/auditEngine.test.js`.

| Test | Filename | What it covers | How to run |
| --- | --- | --- | --- |
| `calcToolCost returns catalog pricing and delta for known tools` | `backend/test/auditEngine.test.js` | Verifies catalog price lookup, display name mapping, and overpayment delta math for a priced plan. | `npm --prefix backend test` |
| `runAudit includes downgrade and annual billing savings in totals` | `backend/test/auditEngine.test.js` | Confirms the audit report totals, recommendation ordering, annual-billing savings, and generated timestamp for a single-tool audit. | `npm --prefix backend test` |
| `runAudit flags excess seats using the catalog seat price` | `backend/test/auditEngine.test.js` | Checks that unused seats produce an `excess_seats` recommendation with the expected monthly and annual savings. | `npm --prefix backend test` |
| `runAudit detects overlapping coding tools` | `backend/test/auditEngine.test.js` | Ensures the engine flags duplicate coding assistants and estimates savings from consolidating them. | `npm --prefix backend test` |
| `runAudit detects overlapping general AI assistants` | `backend/test/auditEngine.test.js` | Ensures the engine flags duplicate general-purpose assistants and reports the overlap savings. | `npm --prefix backend test` |
| `runAudit falls back gracefully when pricing data is missing` | `backend/test/auditEngine.test.js` | Verifies unknown tools do not crash the audit and fall back to the reported spend with no false savings. | `npm --prefix backend test` |
| `runAudit returns a zero savings percentage when spend is zero` | `backend/test/auditEngine.test.js` | Covers the zero-spend edge case so the report returns `0` instead of dividing by zero or producing `NaN`. | `npm --prefix backend test` |

To run the full set locally:

```bash
npm --prefix backend test
```
