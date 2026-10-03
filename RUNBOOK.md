# RUNBOOK — Fraud-Ring Detective Agent

**Status as of 2 October 2026:** the commands in “Current prototype” describe the only application currently in this repository. The FalkorDB pipeline, seven MCP tools, ML evaluator, Compose stack and Streamlit app are intentionally **not implemented before the event**. Commands in “Event-period target” are the planned contract, not verified commands; update this file and `RUN-LOG.md` as each part is built and tested.

## 1. Current React/Vite prototype

Prerequisite: Node.js/npm compatible with the checked-in lockfile.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. The UI is client-side and uses fictional static data; it does not contact FalkorDB. To verify a production build:

```bash
npm run build
```

`npm ci` and `npm run build` passed on 2 October. The Vite dev server was also started on `0.0.0.0:5173`; the page and key UI modules returned HTTP 200. Browser interaction was not scripted.

## 2. Event-period judge path — planned, not runnable yet

### Intended one-command startup

After the implementation and Compose file exist, the fresh-clone path is intended to be:

```bash
cp .env.example .env
docker compose up --build
```

The Compose dependency chain should health-check FalkorDB, generate/seed the deterministic graph, run evaluation, start the seven-tool MCP server, then launch the Streamlit + PyVis dashboard. This command is a target only until it has passed on a clean environment; do not report it as working before then.

The non-container local UI target is:

```bash
python -m streamlit run streamlit_app.py
```

It also remains unavailable until the event-period app and dependencies are added.

### Reset (destructive)

If a future seeded volume is stale and a clean graph is required, the planned reset is:

```bash
docker compose down -v
docker compose up --build
```

`docker compose down -v` deletes Compose-managed volumes and the local graph data they contain. Review the target volume before using it; never run this against a non-demo or shared database.

### Planned validation commands

Final script names may change during implementation; update this runbook to match the tested entry points.

```bash
# Run generator + reproducible graph-feature evaluation (planned)
python scripts/evaluate.py --seed 42

# Run the full unit/integration suite (planned)
python -m pytest -q

# Invoke the seven MCP smoke tests separately (planned)
python -m pytest -q tests/test_mcp_tools.py::test_find_sinks
python -m pytest -q tests/test_mcp_tools.py::test_detect_rings
python -m pytest -q tests/test_mcp_tools.py::test_rank_leaders
python -m pytest -q tests/test_mcp_tools.py::test_find_brokers
python -m pytest -q tests/test_mcp_tools.py::test_trace_funds
python -m pytest -q tests/test_mcp_tools.py::test_link_identities
python -m pytest -q tests/test_mcp_tools.py::test_score_risk
```

A test is not complete just because it returns JSON: it must assert the expected seeded IDs/results and that every returned claim has graph evidence and query/algorithm provenance.

## 3. Event acceptance checklist

- [ ] From a clean checkout and empty Compose volume, the documented command seeds FalkorDB and loads the investigator dashboard without hand-running hidden setup steps.
- [ ] FalkorDB is the primary graph source; missing/unhealthy DB causes a visible error, not a silent in-memory/mock success.
- [ ] The generator is deterministic for the documented seed and exports the planted ground truth separately from model features.
- [ ] WCC component count/sizes and ring membership are recorded; PageRank top results include the known planted ringleader; broker ranking identifies the expected seeded intermediary.
- [ ] The graph-derived classifier reports precision, recall, confusion counts, evaluation split and threshold. Ground-truth/ring labels are not input features.
- [ ] The MCP server registers exactly seven domain tools: `find_sinks`, `detect_rings`, `rank_leaders`, `find_brokers`, `trace_funds`, `link_identities`, `score_risk`.
- [ ] Each of the seven listed smoke tests is run and its result recorded individually in `RUN-LOG.md`.
- [ ] Every tool output, score, ranking and verdict contains evidence IDs and Cypher/algorithm provenance; empty/weak evidence produces a clear abstention.
- [ ] Streamlit + PyVis displays seeded graph data and exposes the investigator's human review/verdict action. The React/Vite prototype remains intact.
- [ ] Dependencies and FalkorDB image are pinned; `.env.example` contains no credentials; no paid API is added without explicit owner approval.
- [ ] `README.md`, `COMPARISON.md`, this runbook, `RUN-LOG.md` and `TODO-BEFORE-SUBMISSION.md` match the tested implementation.

## 4. Safety and troubleshooting notes

- Do not put secrets in source control or `.env.example`; use a local `.env` only if a future approved integration requires credentials.
- Avoid free-form Cypher from the investigator. Tool arguments should be validated and values passed as query parameters; queries exposed to the agent should be read-only.
- Do not claim a person is a criminal or that a shared device proves identity. Report graph links as signals and keep investigator disposition separate from model output.
- If WCC/PageRank procedure syntax differs on the pinned image, verify against the matching FalkorDB release/tests, update the query and tests, and record the change. Do not substitute a local graph calculation without labeling and documenting it.
- If the dashboard is blank, first check Compose health/logs and confirm the seeded graph name matches `.env`/service configuration. Do not replace a DB error with mock graph data in the judge path.
