# Ringtrace redesign — research summary

**Research date:** 02 October 2026  
**Scope:** Improve the existing analyst workstation, not replace its application architecture or workflows.

## Current UI review (rendered desktop and mobile)

The app already has the right product foundation: a persistent investigation shell; global entity search; an interactive account/person/device/IP graph; multi-hop transfer tracing; explainable risk contributors; triageable alerts; evidence detail; case timeline; and report generation. The seeded case is internally coherent for its primary story: the three transfers total ₹18.4L and the displayed risk factors sum to 94. Preserve these strengths and the existing component/data model.

Observed issues to address:

- **Graph obscured by a rendering bug.** A broad `.graph-canvas svg` selector also resizes the small `MousePointer2` SVG inside the graph hint to the full canvas, producing an oversized pointer over the network. Scope canvas sizing to the graph's direct-child SVG.
- **Overview metric clipping.** At a 1440px desktop viewport, the “Amount under review” value is ellipsized beside its secondary comparison; important financial data should never be hidden.
- **Hierarchy is overly compressed in places.** Repeated 8–9px labels and six same-weight KPI tiles make the dashboard feel dense without helping the first investigative decision. Increase legibility and distinguish case-critical evidence from secondary system totals.
- **Some pages under-use desktop width.** Alerts and report pages remain a narrow single column with substantial blank area; use that room for relevant case context or review guidance, not decorative filler.
- **External font dependency fails offline.** The browser emitted a failed Google Fonts request in the inspection environment. Keep typography deliberate but make the interface render cleanly without a remote font request.
- **Mobile baseline is sound.** At 390px, the document did not overflow horizontally and the dashboard reflowed into a single column. Keep that behavior while making graph controls, nav access, and tables comfortable at tablet/mobile widths.

The provided image-reference paths and repository asset scan contained no usable user-supplied reference image, so this redesign will use the stated aesthetic constraints and researched product patterns rather than assume an unavailable attachment.

## Product and project research

The review deliberately focused on financial-crime, graph-investigation, and compliance workflows rather than generic dashboard templates.

1. **Oracle Financial Crime and Compliance / Investigation Hub** — Oracle positions transaction monitoring, customer risk, investigation case management, graph analytics, and regulatory reporting as connected parts of a governed AML workflow. Adopt the persistent case context, traceable evidence, and investigator review step; do not imply automated findings are final.  
   https://www.oracle.com/financial-services/aml-financial-crime-compliance/

2. **FinSentry (GitHub)** — Public AML investigation project linking detection, feature explanations, graph patterns, case building, narrative, and SAR output. Its alert queue / case drill-down structure supports showing detection reasons and evidence together. Borrow the explainable case workflow—not its ML claims or visual styling.  
   https://github.com/yumazinglife-sudo/FinSentry

3. **FinGraph Fraud Analytics (GitHub)** — Graph-backed transaction model with accounts, cards, locations, merchants, multi-hop matching, and explicit circular / starburst / smurfing patterns. Reinforces treating the *network and funds movement* as the main investigative unit, with transactions inspectable at each edge.  
   https://github.com/Raisanuraan12/fingraph-fraud-analytics

4. **FinGuard (GitHub)** — Entity search across accounts, people, devices and IPs leads into an entity profile, graph exploration, targeted shared-infrastructure checks, bounded paths, and circular-flow review. Adopt this search → entity → relationship → evidence progression and keep selected-entity facts beside the graph.  
   https://github.com/gouthamkriz/finguard

5. **Linkurious / i2 analysis workflow** — Linkurious highlights graph path analysis, attribute context, graph algorithms, temporal views and reusable investigation queries. For this scope, adopt clear node/edge selection, trace highlighting, and evidence context; omit a query builder and advanced algorithms not backed by this demo's data.  
   https://linkurious.com/blog/is-linkurious-enterprise-an-alternative-to-i2/

6. **OpenSanctions + Linkurious investigation example** — Demonstrates joining an entity graph with source datasets and alert-driven case management. The useful pattern is verifiable source-to-relationship context, not a graph used as decoration.  
   https://www.opensanctions.org/articles/2022-02-25-linkurious/

7. **Public LinkedIn references** — Search-indexed practitioner articles by Vamsi Bodepudi and Joseph George describe graph context as a way to move beyond isolated transaction rules, inspect connected patterns, and support investigators with context; Joseph George also calls out false-positive burden and lifecycle checks. Emma Zhang discusses traceable fund-flow exploration, while Colin Bristow emphasizes pairing historical activity with a graphical or tabular explanation. These are workflow observations, not visual specifications.  
   https://www.linkedin.com/pulse/graph-powered-machine-learning-financial-crime-new-vamsi-bodepudi  
   https://www.linkedin.com/pulse/pre-crime-insights-flighting-financial-crime-graph-database-george  
   https://www.linkedin.com/pulse/why-graph-databases-excel-anti-money-laundering-investigations  
   https://www.linkedin.com/pulse/three-areas-where-ai-ml-can-help-aml-compliance-colin-bristow

## Design decisions

### Adopt

- Keep the current sidebar, top search, case screens, route IDs, React component boundaries, and synthetic data; improve them in place.
- Use one restrained workstation palette: charcoal/navy surfaces, subtle separators, readable neutral text, teal for positive/action states, amber for investigation attention, and red only for critical risk.
- Make the active case and its status/owner/primary entity easy to find across the shell. Keep the graph, suspicious path, risk rationale, evidence, alert state, timeline, and report visibly connected to that case.
- Treat transfers as evidence-bearing edges: retain amount, transaction identifier, time, source, destination, and an obvious path-trace state. Keep the selected entity inspector adjacent to the graph.
- Preserve additive, human-readable risk contributors and the synthetic-data disclaimer; never replace them with a mysterious model score or imply a real detection.
- Use desktop width for a readable primary investigation surface plus an adjacent context/review rail. At tablet and mobile widths, stack deliberately and preserve horizontal table scrolling where needed.

### Simplify

- Put case-critical measures first. Keep secondary totals available, but reduce the visual competition among overview KPIs and avoid repeating the same facts in multiple loud panels.
- Use fewer, more consistent surface treatments and corner radii; make borders and spacing—not colored card fills—the hierarchy.
- Keep timestamps, IDs, confidence and provenance compact, but raise microcopy from unreadably tiny sizes and provide a clear primary/secondary type scale.
- Prefer one consistent status vocabulary and controlled severity colors over decorative icon color variation.

### Remove / avoid

- The canvas-wide SVG sizing side effect, clipped financial values, and remote font dependency.
- Oversized decorative graph art, glow effects, gradient/glass treatment, repeated rounded-card stacks, and any animation that does not signal state.
- Generic AI-copilot, forecasting, or live-system claims: this is a front-end demo with synthetic records and deterministic UI behavior.
- New backend, model-inference, charting, or graph-library dependencies; the existing interactions and relationship data are sufficient for this pass.

### Strengthen

- Explainability, source traceability, and the distinction between a signal and an investigator disposition.
- Search-to-investigation flow, alert acknowledge/dismiss/review behavior, graph filters/node selection/pan/zoom, path tracing, evidence viewing, report generation, and modal feedback.
- Responsive navigation and graph readability; verify the major workspaces and their interactions after each visual pass.

## Source notes

- FinSentry, FinGraph, and FinGuard were reviewed from their public repository descriptions/README content; their patterns are references, not endorsed production systems.
- Oracle and Linkurious pages were reviewed as vendor product/workflow material.
- LinkedIn content was accessible as public/search-indexed article material; direct LinkedIn pages may impose sign-in or rendering limits.
- This summary records design patterns only. No third-party interface or artwork is copied.
