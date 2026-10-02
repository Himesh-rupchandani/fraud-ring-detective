# Ringtrace — Financial Crime Investigation Workspace

A frontend-only investigation dashboard for a synthetic fraud-ring detection demo. It brings graph relationships, suspicious transfer paths, explainable risk factors, evidence and analyst activity into one case workspace.

## Run locally

```bash
npm install
npm run dev
```

The Vite development server binds to `0.0.0.0` for preview environments. To create and inspect a production build:

```bash
npm run build
npm run preview
```

## Demo interactions

- Search accounts, people, devices, IP addresses, transactions and investigations from the top bar (`Ctrl/⌘ K`).
- Open **Graph explorer** to filter entity types, select connected nodes, zoom, pan or reset the relationship graph.
- Use **Trace path** to highlight the three-hop transfer sequence and inspect individual transaction records.
- Acknowledge or resolve alerts, inspect evidence detail, create a local investigation and export the report or transaction ledger.
- Navigation, filters and session actions are client-side only.

All people, accounts, amounts, identifiers and event history are fictional. The score is presented as an explainable sum of mock graph-derived signals and is not a real-world finding. No backend, live financial data or model inference is connected.
