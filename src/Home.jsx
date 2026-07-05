import { useNavigate } from 'react-router-dom';

const C = {
  navy:   "#1a2340",
  orange: "#e65c00",
  border: "#e0e3ea",
  muted:  "#6b7280",
  bg:     "#f4f5f7",
};

const STATUS_COLORS = {
  "WIP":       { bg:"#fff3e0", color:"#e65c00", border:"#ffe0b2" },
  "Complete":  { bg:"#e8f5e9", color:"#2e7d32", border:"#c8e6c9" },
  "Draft":     { bg:"#f1f3f4", color:"#5a6270", border:"#d0d5df" },
};

const PROTOTYPES = [
  {
    category: "Inventory Management",
    icon: "\ud83d\udce6",
    items: [
      {
        title: "Inventory Reservation \u2014 Manager Dashboard",
        description: "Reservation-first WM view: reservation rows with expandable order sub-rows, ATP per SKU with low-stock warnings, clickable Total / Needs Attention filter tiles, full filter bar (Status, Res. ID, Order ID, SKU, Res. Age, ATP, Reserved Qty range), Release and View History actions. Covers Epic 4 (GM-286559).",
        status: "WIP",
        epic: "GM-286559",
        epicUrl: "https://greyorange-work.atlassian.net/browse/GM-286559",
        prdUrl: "https://greyorange-work.atlassian.net/wiki/spaces/GRYMTTR/pages/155156881",
        customer: "Essilor Luxottica",
        path: "/inv-reservation-md.html",
        screens: ["Reservation Table", "Order Sub-rows", "ATP Column", "Needs Attention Filter", "Release Modal", "History Drawer"],
        external: true,
      },
    ],
  },
  {
    category: "Reserve-Pick Flow",
    icon: "\ud83d\udd01",
    items: [
      {
        title: "Replen Pick \u2014 HHD App",
        description: "Handheld replenishment pick flow: prioritised pick queue (Replen Critical / Replen Normal), scan rollcage and tote, bin assignment on new rollcage/tote, printer scan, and carrying-unit-full handling.",
        status: "Complete",
        path: "/replen-pick-hhd.html",
        external: true,
      },
    ],
  },
  {
    category: "Bulk Order Picking \u2014 System-Guided Rollcage Orchestration",
    icon: "\ud83d\uded2",
    items: [
      {
        title: "Runner HHD App \u2014 Dock Assignment",
        description: "Four-screen flow on a handheld device: Build queue (PBT-prioritised tasks) \u2192 Build instruction (rollcage type, dock point, checklist) \u2192 Dock scan (barcode validation) \u2192 Mismatch error / success. Covers Epic 4 (req 4.1, 4.2).",
        status: "WIP",
        epic: "Epic 4",
        epicUrl: "https://greyorange-work.atlassian.net/wiki/x/8YBACQ",
        prdUrl: "https://greyorange-work.atlassian.net/wiki/x/8YBACQ",
        customer: "Essilor Luxottica",
        path: "/bulk-order/hhd-runner",
        screens: ["Task Queue", "Build Instruction", "Dock Scan", "Mismatch / Success"],
      },
      {
        title: "Pick-Back Operator UI \u2014 Carrying Unit Association",
        description: "AIO tablet flow: Rollcage docked \u2192 guided association activates automatically \u2192 one position at a time with required carrying unit type shown \u2192 scan confirmation \u2192 progressive bin activation \u2192 wrong-type error handling. Covers Epic 5 (req 5.1\u20135.4).",
        status: "WIP",
        epic: "Epic 5",
        epicUrl: "https://greyorange-work.atlassian.net/wiki/x/8YBACQ",
        prdUrl: "https://greyorange-work.atlassian.net/wiki/x/8YBACQ",
        customer: "Essilor Luxottica",
        path: "/bulk-order/pick-back",
        screens: ["Flow Activating", "Guided Association", "All Confirmed", "Wrong Type Error"],
      },
      {
        title: "Manager Dashboard \u2014 Bulk Order Outbound View",
        description: "Accordion table: parent order \u2192 rollcage rows \u2192 bin fill progress. Rollcage ID, Carrying Unit ID, label scan status, dock point, real-time fill progress. Filter by flow type, PBT, status. Covers Epic 6 req 6.5 + Epic 7 req 7.1.",
        status: "WIP",
        epic: "Epic 6 + 7",
        epicUrl: "https://greyorange-work.atlassian.net/wiki/x/8YBACQ",
        prdUrl: "https://greyorange-work.atlassian.net/wiki/x/8YBACQ",
        customer: "Essilor Luxottica",
        path: "/bulk-order/md-outbound",
        screens: ["Order Accordion", "Rollcage Breakdown", "Carrying Unit IDs", "Bin Fill Progress"],
      },
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", background:C.bg, minHeight:"100vh" }}>
      <div style={{ background:C.navy, padding:"0 32px", height:56, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ background:"#fff", borderRadius:6, padding:"4px 10px", display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:20, height:20, borderRadius:"50%", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:10, fontWeight:700 }}>GO</span>
          </div>
          <span style={{ fontSize:14, fontWeight:700, color:C.orange }}>GreyOrange</span>
        </div>
        <span style={{ color:"rgba(255,255,255,0.3)", fontSize:18 }}>|</span>
        <span style={{ color:"#fff", fontSize:14, fontWeight:600 }}>GreyMatter Prototypes</span>
        <a href="https://github.com/shilpas-commits/greyorange-prototypes" target="_blank" rel="noreferrer"
           style={{ marginLeft:"auto", color:"rgba(255,255,255,0.55)", fontSize:12, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
      <div style={{ padding:"40px 32px 24px", maxWidth:900 }}>
        <h1 style={{ margin:"0 0 8px", fontSize:26, fontWeight:700, color:C.navy }}>UX Prototypes</h1>
        <p style={{ margin:0, fontSize:14, color:C.muted, lineHeight:1.6 }}>Interactive prototypes built alongside System PRDs \u2014 each maps to a Jira Epic and is ready for engineering handoff.</p>
      </div>
      <div style={{ padding:"0 32px 48px" }}>
        {PROTOTYPES.map(cat => (
          <div key={cat.category} style={{ marginBottom:40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:20 }}>{cat.icon}</span>
              <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:C.navy }}>{cat.category}</h2>
              <div style={{ flex:1, height:1, background:C.border }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(360px, 1fr))", gap:16 }}>
              {cat.items.map(p => {
                const sc = STATUS_COLORS[p.status] || STATUS_COLORS["Draft"];
                return (
                  <div key={p.path} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:8, padding:"20px 24px", display:"flex", flexDirection:"column", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                      <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:C.navy, lineHeight:1.4 }}>{p.title}</h3>
                      <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:12, whiteSpace:"nowrap", background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>{p.status}</span>
                    </div>
                    <p style={{ margin:0, fontSize:13, color:C.muted, lineHeight:1.6 }}>{p.description}</p>
                    {p.screens && p.screens.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {p.screens.map(s => (<span key={s} style={{ fontSize:11, padding:"1px 8px", borderRadius:3, background:"#f4f5f7", color:C.muted, border:`1px solid ${C.border}` }}>{s}</span>))}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:4 }}>
                      {p.epicUrl && <a href={p.epicUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.orange, textDecoration:"none", fontWeight:600 }}>{p.epic} \u2197</a>}
                      {p.prdUrl && <a href={p.prdUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.muted, textDecoration:"none" }}>System PRD \u2197</a>}
                      {p.customer && <span style={{ fontSize:11, padding:"1px 8px", borderRadius:3, background:"#e3f2fd", color:"#1565c0", border:"1px solid #bbdefb", marginLeft:"auto" }}>{p.customer}</span>}
                      {p.external
                        ? <a href={p.path} target="_blank" rel="noreferrer" style={{ marginLeft: p.customer ? undefined : "auto", padding:"6px 18px", borderRadius:5, border:"none", background:C.orange, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textDecoration:"none" }}>Open \u2192</a>
                        : <button onClick={() => navigate(p.path)} style={{ marginLeft: p.customer ? undefined : "auto", padding:"6px 18px", borderRadius:5, border:"none", background:C.orange, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Open \u2192</button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
