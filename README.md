# GreyMatter Prototypes

Interactive UX prototypes for GreyMatter Manager Dashboard, built alongside System PRDs for engineering handoff.

## Prototypes

| Use case | Prototype | Epic | Status |
|---|---|---|---|
| Inventory Management | Inventory Reservation & TPID Management | [GM-292020](https://greyorange-work.atlassian.net/browse/GM-292020) | WIP |

## Adding a new prototype

1. Create `src/prototypes/<use-case>/<Name>.jsx`
2. Register the route in `src/main.jsx`
3. Add a card in `src/Home.jsx`

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Connect this repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite and deploys on every push to `main`.
