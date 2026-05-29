# GreyMatter Prototypes

Interactive UX prototypes for GreyMatter Manager Dashboard, built alongside System PRDs for engineering handoff.

## Prototypes

| Use case | Prototype | Epic | Status |
|---|---|---|---|
| Inventory Management | Inventory Reservation & TPID Management | [GM-292020](https://greyorange-work.atlassian.net/browse/GM-292020) | WIP |

## Adding a new prototype

Every prototype needs three manual edits. Here's the full checklist:

### 1. Create the component file

```
src/prototypes/<use-case>/<PrototypeName>.jsx
```

Example: `src/prototypes/order-management/OrderPickingPrototype.jsx`

### 2. Register the route — `src/main.jsx`

Import your component and add a `<Route>`:

```jsx
import OrderPickingPrototype from './prototypes/order-management/OrderPickingPrototype'

// inside <Routes>:
<Route path="/order/picking" element={<OrderPickingPrototype />} />
```

### 3. Add a card — `src/Home.jsx`

Add an entry to the `PROTOTYPES` array. If the use-case category already exists, add to its `items` array. Otherwise add a new category object:

```js
{
  category: "Order Management",
  icon: "📋",
  items: [
    {
      title: "Order Picking Flow",
      description: "Short description of what screens and flows this covers.",
      status: "WIP",           // "WIP" | "Complete" | "Draft"
      epic: "GM-XXXXXX",
      epicUrl: "https://greyorange-work.atlassian.net/browse/GM-XXXXXX",
      prdUrl:  "https://greyorange-work.atlassian.net/wiki/...",
      customer: "Customer Name",
      path: "/order/picking",  // must match the route in main.jsx
      screens: ["Screen 1", "Screen 2"],
    },
  ],
},
```

### 4. Push to main

```bash
git add .
git commit -m "feat: <PrototypeName> — <one-line description>"
git push origin main
```

Vercel auto-deploys on every push. The new prototype will appear as a card on the Home dashboard and open at its route.

---

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Connect this repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Vite and deploys on every push to `main`.
