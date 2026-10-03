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

## UI redesign pass — 3 October 2026 (IST)

| Check/action | Command or method | Observed result |
|---|---|---|
| Top command-bar redesign | `src/components/Layout.tsx`, appended block in `src/styles.css`, new `src/assets/anjali-deshmukh.jpg` + `src/vite-env.d.ts`, design reference `docs/design/topbar-implemented.png` | **Implemented** — active-case identity restated as a two-line block (label over `FR-2026-1042` + risk pill); global search promoted to a centred 44px pill-shaped hero; right cluster ordered status chip → alert bell → divider → investigator identity last, now a circular photo avatar with presence dot, name and role. Styles are appended last in `styles.css` with their own responsive rules so the cascade and narrow widths stay predictable. |
| Back navigation | `src/App.tsx` (`viewHistory` stack, `goBack`), `src/components/Layout.tsx` (`.topbar-back`), appended CSS block | **Implemented** — a `Back` control now occupies the far top-left corner, before the mobile menu button. It walks a real view-history stack (sidebar navigation, global search selection and alert→account jumps all push history), is disabled with an explanatory tooltip when no previous view exists, collapses to an icon-only 36/34px square at ≤700/460px, and is also bound to `Alt + ←`. |
| Visual verification | Headless-browser screenshot attempt | **Not run — unavailable in this sandbox.** Chromium could not be installed (no Docker/apt access; only the npm registry is reachable, so the prebuilt binary's `libnspr4`/`libnss3` dependencies were unavailable). `docs/design/topbar-implemented.png` is therefore an exact-geometry reference render of the implemented header, not a screenshot of the running app. |
| Frontend production build | `npm run build` | **Passed** — TypeScript build clean; Vite 6.4.3 transformed 1,585 modules; bundle now also emits `dist/assets/anjali-deshmukh-*.jpg` (107.9 kB). |
| Dev-server asset/markup check | `npm run dev`; HTTP fetches for `/`, `src/components/Layout.tsx`, `src/App.tsx`, `src/assets/anjali-deshmukh.jpg`, `src/styles.css` | **Passed** — Vite listened on `0.0.0.0:5173`; the rewritten modules were served with the avatar import resolved and the `topbar-back` control plus the `viewHistory`/`goBack`/`canGoBack` history logic present; the JPEG returned HTTP 200 `image/jpeg` (107,869 bytes); the served stylesheet contains the new top-bar and back-navigation blocks. No dev-server errors logged. |

## Detection hero pass — 3 October 2026 (IST)

| Check/action | Command or method | Observed result |
|---|---|---|
| Hero rebuilt in the reference layout | `src/components/Dashboard.tsx` (`OverviewIntelligenceBanner`), appended `hero-*` block in `src/styles.css`, reference render `docs/design/hero-implemented.png` | **Implemented** — badge + gradient headline + copy + two CTAs + three case facts; connected-node orbit around a shielded case graph; dark "Fraud Risk Intelligence" snapshot with traced-value trend and three metric tiles; full-width navy band of four review principles with a Detect → Trace → Verify tagline. |
| Copy corrected to this project | Source values read from `src/data/mockData.ts` | **Done** — the reference's Finlatics/stock-market copy was replaced with this workspace's own wording and figures: case `FR-2026-1042`, updated `10:53 IST`, `18 entities`, `27` linked transfers, `₹18.4L` traced value, `316` evidence items, `93%` average confidence, `03` new alerts, seven explainable factors. No partnership, stock-market, price or return claims were carried over; the trend is labelled "Illustrative trend · synthetic records". |
| Frontend production build | `npm run build` | **Passed** — TypeScript clean; Vite 6.4.3 transformed 1,585 modules; CSS bundle 202.6 kB (39.9 kB gzip). |
| Dev-server check | `npm run dev`; HTTP fetches for `/`, `src/components/Dashboard.tsx`, `src/styles.css` | **Passed** — page 200; the served module contains `hero-banner`/`hero-copy`/`hero-orbit`/`hero-intel`/`hero-band`, the corrected headline and CTA copy, and the served stylesheet contains the new hero block. |
| Visual verification | Headless-browser screenshot attempt | **Not run — unavailable in this sandbox** (no Docker/apt access; only the npm registry is reachable). `docs/design/hero-implemented.png` is an exact-geometry reference render of the implemented hero, not a screenshot. |

| Hero constellation rebuild | `src/components/Dashboard.tsx` (7 icon tiles, constellation arcs, shield asset, chart grid + value pill), appended CSS block, new `src/assets/hero-shield.png`, design reference `docs/design/hero-final.png` | **Implemented** — replaced the flat rounded-square core with an AI-generated 3D shield on a glowing pedestal, matched to the supplied reference art; expanded the six flat icon squares into seven white rounded tiles (records, analytics, trend, account holders, linked entities, alerts, automation) over constellation arcs with dot and sparkle nodes. The dark snapshot card gained chart grid lines and a framed value pill. Geometry follows the `.hero-node-*` position rules so the render and the live layout stay in sync. |
| KPI row redesign | `src/components/Dashboard.tsx` (`StatCard` only), appended CSS blocks, design reference `docs/design/kpi-row.png` | **Implemented — presentation only.** The five `.stat-card` tiles now match the supplied reference: solid colour icon discs with white glyphs, label → value + green trend → supporting line, and a trailing chevron affordance; soft per-card pastel tints with matching hairline borders and an 12px radius. Existing values, labels, trend copy and foot notes still come from `overviewMetrics` (+ the live "New fraud alerts" tile); no data, handler or state logic was touched. Density tuned so label/value/trend stay on one line at the real dashboard width, with ellipsis safety so the trend never collides with the chevron. Responsive: 5 across, then 3 at 1180px, 2 at 820px, 1 at 520px. |
| Recent fraud alerts panel | `src/components/Dashboard.tsx` (`AlertListPanel` only), appended CSS block, design reference `docs/design/alerts-panel.png` | **Implemented — presentation only.** The dashboard alert panel now matches the supplied reference: red alert mark beside a "Recent fraud alerts" heading with a live "N new" chip, "View all ->" retained, and rows carrying a severity-tinted circular glyph, a rounded severity badge, the account identifier, a single-line description, a right rail with the timestamp over the existing acknowledge/dismiss controls, and a chevron affordance. Row separators are hairlines with a subtle hover wash. Severity (Critical/High/Medium/Low) keeps its own colour rather than collapsing to three. Data, props, filters, severity logic and handlers are untouched; styling is scoped to `.alert-panel` so the full Alerts workspace keeps its layout, and container queries drop the description/timestamp only when the rail itself is too narrow. |
| Fraud Ring Connections graph | `src/components/GraphExplorer.tsx` (node rendering + control placement), appended CSS block, design reference `docs/design/graph-panel.png` | **Implemented — presentation only.** Nodes are now solid colour discs with white glyphs keyed to entity type (account green / person blue / device orange / IP purple), the first account carrying the crimson emphasis of the reference centre node, with a white ring on selection instead of a glow. Identifiers sit under each disc in mono with a white halo (`paint-order: stroke`) so they stay readable where edges cross. The zoom/fit group moved out of the filter bar into a floating vertical stack on the canvas's right edge, with a small zoom readout under it; the dot grid was lightened and the legend is now colour-keyed to the node palette, as are the filter chips. Full-page graph keeps its eyebrow, subtitle, tracing button and provenance line. Graph data, pan/zoom, filtering, node selection, path tracing and the detail inspector are unchanged. |
| Investigation Summary panel | `src/components/GraphExplorer.tsx` (`EntityDetailPanel` dashboard branch), appended CSS block, design reference `docs/design/summary-panel.png` | **Implemented — presentation only.** The dashboard's summary panel now follows the supplied reference: a compact header (title + case id) with a dynamic risk pill driven by the existing `investigations[0].risk`, an entity block (type-coloured glyph disc, identifier + owner/status line) with a 72px donut that draws the real `riskScore` on a `pathLength=100` dash arc, a tab strip (Details / Linked IDs / Transactions / Behavior) whose tabs still switch the panel body, compact label/value rows built only from existing fields (linked/device/IP counts, `transactionCount`, `riskScore`, `formatMoney(suspiciousAmount)`, location, opened), a green-check "Key findings" list taken from the explainable `riskFactors`, and the existing report handler promoted to a full-width blue "View Full Report" button above the retained entity-record link. Every figure is a real workspace value — `FR-2026-1042`, `ACC-849201` / Rahul Mehta · Critical, score 94, `₹18.4L`, Mumbai IN, 19 Feb 2025 — never the reference's example values. Selection, tab state, navigation and the report callback are unchanged, and the graph rail's embedded inspector keeps its own denser layout. |
| Visual verification (summary panel) | ImageMagick render at exact CSS geometry (`/tmp/summary_render.py`), values read from `src/data/mockData.ts`, four iterations | **Done by render loop, not a screenshot** — headless Chromium remains unavailable in this sandbox (no Docker/apt access; only the npm registry is reachable), so `docs/design/summary-panel.png` is an exact-geometry reference render of the implemented panel. Iterations fixed the donut arc geometry (`pathLength`/dash pair instead of a quarter-circle approximation), made the in-ring caption legible without touching the ring (72px donut, 6-unit caption), re-centred the entity row around the taller donut, and corrected the rows to the real data (`6` links, `₹18.4L`) instead of the reference's example amounts. |

| Sidebar restyle | `src/components/Layout.tsx` (brand lockup, `navigationGroups` rendering, promo card), appended CSS block, design reference `docs/design/sidebar-panel.png` + `docs/design/reference-sidebar.png` | **Implemented — presentation only.** The existing sidebar now follows the supplied reference: a deep-navy rail (268px, unchanged width) with the blue-shield brand tile and the product subtitle taken from the app's own title ("Investigation workspace"), colour-tiled icon containers keyed to each route, one blue-violet gradient pill for the active route (still driven by `activeView` through `aria-current`), the Alerts badge from the live `notificationCount`, hairline separators between the existing `Monitor` / `Dashboards` / `Signals` groups, a collapsible "Dashboards" parent row with the same six children indented beneath it, and the existing promo copy ("Safer banking. / Stronger tomorrow.", "Evidence-led fraud review") rebuilt as the reference's blue card with a shield mark, decorative shapes and a circular arrow. Every route, the workspace switcher, "New investigation" action, demo footer, settings shortcut, graph live dot and the mobile off-canvas open/close are untouched. |
| Visual verification (sidebar) | ImageMagick render at exact CSS geometry (`/tmp/sidebar_render.py`) with lucide paths extracted from `node_modules`, three iterations | **Done by render loop, not a screenshot** — headless Chromium remains unavailable in this sandbox (no Docker/apt access). `docs/design/sidebar-panel.png` is an exact-geometry render of the implemented sidebar. The loop fixed a rotated-gradient crop that let a white corner show through the promo card, removed the legacy amber brand dot for a clean logo tile, tightened the workspace chip so the navigation starts higher, and compact-sized the alert badge. |

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
