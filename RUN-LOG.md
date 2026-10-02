# RUN-LOG — preparation and event measurements

This is the audit log for commands actually run and benchmark outputs. Values marked **not measured** are not zero-valued results. Add timestamps, command lines and raw output summaries during the event; do not backfill expected results as if they were observed.

## Preparation pass — 2 October 2026 (IST)

| Check/action | Command or method | Observed result |
|---|---|---|
| Repository inventory | File scan and source inspection | Existing product is a React/Vite mock-data UI. No Python backend, FalkorDB code/Compose, synthetic generator/ground truth, MCP server, ML evaluator, Streamlit app or project test suite was found. |
| Frontend build before restoring dependencies | `npm run build` | **Failed** — `sh: 1: tsc: not found` because the excluded `node_modules` directory was absent; recovered by running `npm ci`. |
| Install frontend dependencies | `npm ci` | **Passed** — 73 packages installed; npm reported 0 vulnerabilities. |
| Frontend production build | `npm run build` | **Passed** after dependency installation — Vite 6.4.3 transformed 1,584 modules and produced the production bundle. |
| Vite dev-server route smoke check | `npm run dev`; HTTP checks for `/`, `Dashboard.tsx`, `GraphExplorer.tsx` and `styles.css` | **Passed** — Vite listened on `0.0.0.0:5173`; all checked routes returned HTTP 200. Browser automation was unavailable, so no scripted interaction/screenshot check was run. |
| Attempt Streamlit launch | `python -m streamlit run app.py` | **Failed as expected for current inventory** — `/usr/bin/python: No module named streamlit`. No module was installed as part of prep. |
| Check for a generator | `python data/generate_synthetic.py --help` | **Failed as expected for current inventory** — `data/generate_synthetic.py` does not exist. No generator was added before the event. |
| Reference review | Shallow clones and code/README inspection under `/tmp/graph-hacks-references/` | Completed for FalkorDB core, official MCP server, Skills, GraphRAG-SDK, QueryWeaver, text-to-cypher, Syndicate and AEGIS-GRAPH. Snapshot hashes/licenses are in `COMPARISON.md`. Competitor code was not copied. |
| Event schedule | Official WeMakeDevs schedule page | Hacking opens **15 Oct 2026, 12:01 AM IST**; submission deadline **18 Oct 2026, 11:59 PM IST**; other sessions TBA at review time. |

The reference repositories were reviewed as source, not installed or launched. The Vite dev server and route responses were smoke-tested; browser interaction was not automated in this environment.

## Track 01 measurements — pending event implementation

| Required output | Current status | Event result to record |
|---|---|---|
| FalkorDB graph seed/counts | Not implemented; not measured | Record pinned image, graph name, node/edge counts and seed. |
| WCC ring components | Not implemented; not measured | Record component count, sizes, known-ring membership and algorithm/query provenance. |
| PageRank ringleader | Not implemented; not measured | Record top-ranked IDs/scores and rank of the planted ringleader. |
| Broker/intermediary ranking | Not implemented; not measured | Record expected intermediaries, scores and supporting paths/edges. |
| ML precision | Not implemented; not measured | Record split, threshold, TP/FP/FN/TN and precision. |
| ML recall | Not implemented; not measured | Record split, threshold, TP/FP/FN/TN and recall. |
| Seven MCP tool smoke tests | **0/7 tools implemented; no tool calls executed** | Record a separate pass/fail/output for each of the seven tests in `RUNBOOK.md`. |
| End-to-end Compose/dashboard | Not implemented; not measured | Record clean-start command, service health, seed result and dashboard smoke check. |

## Event log template

Append one dated subsection per meaningful run. Include exact command, software/image versions, exit status, concise output and any failure/fix.

```text
### YYYY-MM-DD HH:MM IST — <short run name>
- Commit/worktree state:
- Command:
- Versions: Python / FalkorDB image / key dependencies:
- Exit status:
- Result summary:
- WCC: <count/sizes/known-ring mapping>
- PageRank: <top IDs and planted leader rank>
- ML: <split, threshold, TP/FP/FN/TN, precision, recall>
- MCP smoke: find_sinks=<pass/fail>; detect_rings=<...>; rank_leaders=<...>;
  find_brokers=<...>; trace_funds=<...>; link_identities=<...>; score_risk=<...>
- Evidence/provenance check:
- Failures and fixes:
```
