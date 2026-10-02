# TODO before Graph Hacks 2026 submission

**Event window:** 15 Oct 2026, 12:01 AM IST → 18 Oct 2026, 11:59 PM IST.
**State on 2 Oct:** preparation/reference review complete; core FalkorDB implementation intentionally deferred until the event opens.

Estimates are implementation planning aids, not completed work. Prioritize the P0 path; do not expand the scope with paid APIs or large rewrites without the owner's approval.

## Decisions already made

- [x] Prepare references and docs now; create the primary FalkorDB implementation during the event.
- [x] Keep FalkorDB as the primary and required graph database; no in-memory fallback that can masquerade as a successful run.
- [x] Use competitor submissions as benchmarks only. No Syndicate or AEGIS-GRAPH code is to be copied.
- [x] Keep the React/Vite prototype and add a separate Streamlit + PyVis judge-facing app; do not replace the existing UI wholesale.
- [x] Default to no paid LLM/provider. Ask the owner before introducing an API that may incur cost. The fallback plan is a deterministic, auditable MCP tool-selection loop.
- [x] Every score, ranking, verdict and agent claim must include supporting graph evidence and Cypher/algorithm provenance; abstain when evidence is insufficient.

## Before 15 October

- [ ] Recheck event instructions, exact Track 01 judging criteria and schedule updates; preserve the current Oct 15–18 window unless the official schedule changes.
- [ ] Freeze the synthetic story, ring motifs, stable IDs, separate truth-label format and expected sinks/leaders/brokers before training or evaluating a model.
- [ ] Confirm the no-paid-API agent plan is acceptable for the rubric. If an LLM is required, ask the owner for explicit provider/cost approval before adding it.
- [ ] Keep this `.env.example` config contract secret-free; during implementation align its names with the final settings module and Compose overrides.
- [ ] At implementation time, choose and pin an exact FalkorDB image and exact Python/runtime dependencies; test all algorithm procedure syntax on that pinned release.
- [ ] Do not start the primary FalkorDB graph, MCP or ML implementation early; only docs/config preparation is in scope before the event.

## P0 — event implementation path

| Order | Task / acceptance test | Estimate |
|---|---|---:|
| 1 | Build a fixed-seed synthetic generator with a separate ground-truth artifact for rings, ring members, roles, expected sinks, planted leader/brokers and benign noise. Prove same seed → same files; ensure truth fields never enter model features. | 3–4 h |
| 2 | Implement the Person/Account/Device/IP graph model and idempotent FalkorDB ingestion with unique stable IDs, required indexes and transaction time/amount properties. Seed failure must fail the run, not silently select mock data. | 4–5 h |
| 3 | Implement/validate graph-derived evidence: native WCC ring components; native PageRank leader ranking; broker/intermediary centrality; directed, bounded, time-aware money-flow tracing; shared-device/IP identity links; sink candidates. Include query/algorithm IDs and supporting graph IDs in results. | 5–7 h |
| 4 | Train a small graph-feature baseline and evaluate on a documented split. Report TP/FP/FN/TN, precision, recall, threshold and seed; ensure no label/ring-ID leakage and do not present analytics as proof of guilt. | 3–4 h |
| 5 | Build an MCP server with **exactly seven** domain tools and validated parameters: `find_sinks`, `detect_rings`, `rank_leaders`, `find_brokers`, `trace_funds`, `link_identities`, `score_risk`. No generic raw-Cypher/delete tool. Add one smoke test per tool and a test asserting registry size equals seven. | 4–6 h |
| 6 | Add the investigator loop that selects/calls those tools, records actions/results, grounds every claim in returned evidence and abstains when no support exists. Keep the no-key deterministic planner as the reliable baseline; any LLM provider needs owner approval. | 3–4 h |
| 7 | Add separate Streamlit + PyVis investigator dashboard: query seeded graph data, filter/select entities, view funds paths/evidence/provenance, show score explanations, and let an investigator accept/reject/hold a case. Preserve the current React/Vite prototype. | 4–6 h |
| 8 | Add pinned requirements, secret-free `.env.example`, health-checked Docker Compose, one-command seed/evaluate/server/dashboard path, unit/integration/end-to-end tests, clean-volume test and reproducible README instructions. | 4–6 h |

## P0 verification/reporting checklist

- [ ] Fresh clone with clean Docker volume can run the final documented command and reach the seeded dashboard without undocumented manual steps.
- [ ] FalkorDB is healthy and contains the expected deterministic seed; graph-unavailable behavior is explicit and never silently replaced by mock/in-memory data.
- [ ] WCC output and known-ground-truth ring agreement are logged.
- [ ] PageRank top results and the planted ringleader's rank are logged; a degree fallback must not be labelled PageRank.
- [ ] Broker results include algorithm, score, candidate ID and paths/edges supporting the claim.
- [ ] ML precision/recall and confusion counts are logged with split/threshold/seed; no expected or fabricated metrics are reported.
- [ ] Seven individual MCP smoke tests pass and are recorded in `RUN-LOG.md`; a registry assertion enforces exactly seven.
- [ ] Evidence provenance is tested end-to-end from MCP tool output through agent narrative to dashboard/verdict; unsupported claims abstain.
- [ ] Human verdict/disposition is separate from automated risk score and includes a visible evidence review step.
- [ ] Run `python -m pytest -q`, `npm ci`, `npm run build` and the clean Compose startup; record outputs in `RUN-LOG.md`.
- [ ] Verify no secret, local database volume or generated large dataset is committed; verify dependency and database-image versions are pinned.

## P1 — only after P0 is reliable

- [ ] Polish existing React/Vite prototype or connect it to the backend if time permits; do not disrupt the working Streamlit judge path.
- [ ] Add a small demo dataset export or static report if it improves reviewability without replacing live FalkorDB evidence.
- [ ] Prepare a concise walkthrough/video, architecture diagram and AI-use disclosure with only verified claims.
- [ ] Consider deployment only if it is reproducible and does not require unapproved paid services. Ask before creating cloud resources or incurring costs.

## Deferred / prohibited without approval

- [ ] No paid LLM, hosted embedding provider, paid cloud database, or cloud deployment account without owner approval.
- [ ] No wholesale rewrite/deletion of the React/Vite app.
- [ ] No copying from Syndicate or AEGIS-GRAPH (no repository license observed); no code reuse from text-to-cypher (no root license observed) or QueryWeaver (AGPL-3.0-or-later).
- [ ] No pushing to GitHub unless the owner explicitly asks. Work remains on the Arena session branch.
