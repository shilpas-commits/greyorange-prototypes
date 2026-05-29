import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── time helpers
const B = Date.now();
const ms = n => n * 60000;

function fmtTTL(expiresAt, now) {
  const rem = expiresAt - now;
  if (rem <= 0) return { text: "Expired", u: "expired" };
  const s = Math.floor(rem / 1000), mi = Math.floor(s / 60), hr = Math.floor(mi / 60);
  if (hr >= 1) return { text: `${hr}h ${mi % 60}m`, u: "ok" };
  if (mi >= 15) return { text: `${mi}m`, u: "warn" };
  return { text: mi > 0 ? `${mi}m ${s % 60}s` : `${s}s`, u: "crit" };
}

function fmtPBT(ts) {
  const d = new Date(ts), diff = ts - Date.now();
  const abs = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" });
  const am = Math.round(diff / 60000);
  if (am < 0) return { abs, rel: "overdue", cls: "red" };
  const h = Math.floor(am / 60), rm = am % 60;
  return { abs, rel: `in ${h > 0 ? h + "h " : ""}${rm}m`, cls: am < 30 ? "red" : am < 60 ? "amber" : "green" };
}

function localDT(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ── dataset
const DATA = [
  { rowId:0, tpid:"TP-2203-KB-A",   sku:"SKU-9021-MB", name:"KB Masterbox 52×38mm",
    tags:[{k:"subsystem",v:"TTP"},{k:"channel",v:"ecom"}],
    attrs:[{k:"Dim Type",v:"KB"},{k:"Model",v:"PRISM-52"},{k:"Pack Qty",v:"12"}],
    area:"forward", uom:"Outer", damaged:0, status:"active", total:1200,
    reserved:[{id:"ANON-ENQ-8821",inqLineId:"IQL-00021",type:"anon", qty:120,status:"created",   pri:"normal",  channel:"ecom",  pbt:B+ms(45),  exAt:B+ms(28),  src:"Enquiry API"},
              {id:"ORD-10041",    inqLineId:"IQL-00022",type:"named",qty:240,status:"inprogress",pri:"critical",channel:"ecom",  pbt:B+ms(30),  exAt:B+ms(72),  src:"SAP"}],
    hard:[{id:"ORD-9988",inqLineId:"IQL-00023",qty:180,status:"inprogress",pri:"normal",pbt:B+ms(120)}]},

  { rowId:1, tpid:"TP-1891-RB20-F", sku:"SKU-7741-RB", name:"RB20 Masterbox 58×44mm",
    tags:[{k:"subsystem",v:"Relay"},{k:"channel",v:"retail"}],
    attrs:[{k:"Dim Type",v:"RB20"},{k:"Model",v:"LUXE-58"},{k:"Pack Qty",v:"6"}],
    area:"forward", uom:"Outer", damaged:0, status:"active", total:1800,
    reserved:[{id:"ORD-10044",inqLineId:"IQL-00031",type:"named",qty:200,status:"created",   pri:"normal",  channel:"retail",pbt:B+ms(180),exAt:B+ms(105),src:"SAP"},
              {id:"ORD-10055",inqLineId:"IQL-00032",type:"named",qty:180,status:"inprogress",pri:"critical",channel:"retail",pbt:B+ms(60), exAt:B+ms(40), src:"SAP"},
              {id:"ORD-10061",inqLineId:"IQL-00033",type:"named",qty:100,status:"completed", pri:"normal",  channel:"retail",pbt:B+ms(120),exAt:B+ms(15), src:"SAP"}],
    hard:[{id:"ORD-9971",inqLineId:"IQL-00036",qty:360,status:"inprogress",pri:"critical",pbt:B+ms(50)},
          {id:"ORD-9980",inqLineId:"IQL-00037",qty:200,status:"inprogress",pri:"normal",  pbt:B+ms(90)}]},

  { rowId:2, tpid:"TP-0447-RB41-R", sku:"SKU-8832-RB", name:"RB41 Masterbox 65×50mm",
    tags:[{k:"subsystem",v:"Manual"}],
    attrs:[{k:"Dim Type",v:"RB41"},{k:"Model",v:"PRISM-65"},{k:"Pack Qty",v:"24"}],
    area:"reserve", uom:"Outer", damaged:12, status:"active", total:2400,
    reserved:[{id:"ANON-ENQ-9103",inqLineId:"IQL-00041",type:"anon",qty:240,status:"created",pri:"normal",channel:"export",pbt:B+ms(90),exAt:B+ms(50),src:"Enquiry API"}],
    hard:[]},

  { rowId:3, tpid:"TP-3341-KB-R",   sku:"SKU-9021-MB", name:"KB Masterbox 52×38mm",
    tags:[{k:"subsystem",v:"Manual"}],
    attrs:[{k:"Dim Type",v:"KB"},{k:"Model",v:"PRISM-52"},{k:"Pack Qty",v:"12"}],
    area:"reserve", uom:"Outer", damaged:0, status:"active", total:1800,
    reserved:[{id:"ORD-10072",inqLineId:"IQL-00051",type:"named",qty:360,status:"created",   pri:"critical",channel:"retail",pbt:B+ms(120),exAt:B+ms(80),src:"SAP"},
              {id:"ORD-10089",inqLineId:"IQL-00052",type:"named",qty:240,status:"inprogress",pri:"normal",  channel:"retail",pbt:B+ms(90), exAt:B+ms(55),src:"SAP"}],
    hard:[{id:"ORD-10001",inqLineId:"IQL-00053",qty:480,status:"inprogress",pri:"critical",pbt:B+ms(45)}]},

  { rowId:4, tpid:"TP-0012-KB-R2",  sku:"SKU-9021-MB", name:"KB Masterbox 52×38mm",
    tags:[{k:"subsystem",v:"Manual"}],
    attrs:[{k:"Dim Type",v:"KB"},{k:"Model",v:"FRAME-52"},{k:"Pack Qty",v:"12"}],
    area:"reserve", uom:"Outer", damaged:0, status:"blocked", total:1800,
    reserved:[],
    hard:[{id:"ORD-9955",inqLineId:"IQL-00043",qty:340,status:"inprogress",pri:"normal",pbt:B+ms(200)}]},

  { rowId:5, tpid:"TP-2290-RB20-R", sku:"SKU-7741-RB", name:"RB20 Masterbox 58×44mm",
    tags:[{k:"subsystem",v:"Manual"}],
    attrs:[{k:"Dim Type",v:"RB20"},{k:"Model",v:"LUXE-58"},{k:"Pack Qty",v:"6"}],
    area:"reserve", uom:"Outer", damaged:0, status:"active", total:1800,
    reserved:[{id:"ORD-10091",inqLineId:"IQL-00061",type:"named",qty:180,status:"created",   pri:"critical",channel:"ecom",pbt:B+ms(25), exAt:B+ms(22), src:"SAP"},
              {id:"ORD-10095",inqLineId:"IQL-00062",type:"named",qty:200,status:"inprogress",pri:"normal",  channel:"ecom",pbt:B+ms(60), exAt:B+ms(35), src:"SAP"},
              {id:"ORD-10098",inqLineId:"IQL-00063",type:"named",qty:180,status:"created",   pri:"normal",  channel:"ecom",pbt:B+ms(90), exAt:B+ms(90), src:"SAP"},
              {id:"ORD-10102",inqLineId:"IQL-00064",type:"named",qty:160,status:"completed", pri:"normal",  channel:"ecom",pbt:B+ms(150),exAt:B+ms(120),src:"SAP"}],
    hard:[{id:"ORD-9991",inqLineId:"IQL-00065",qty:360,status:"inprogress",pri:"normal",pbt:B+ms(75)}]},

  { rowId:6, tpid:"TP-9911-RB41-F", sku:"SKU-8832-RB", name:"RB41 Masterbox 65×50mm",
    tags:[{k:"subsystem",v:"RTP"}],
    attrs:[{k:"Dim Type",v:"RB41"},{k:"Model",v:"VISION-65"},{k:"Pack Qty",v:"24"}],
    area:"forward", uom:"Outer", damaged:8, status:"active", total:1000,
    reserved:[{id:"ANON-ENQ-9241",inqLineId:"IQL-00071",type:"anon", qty:80, status:"created",   pri:"normal",channel:"retail",pbt:B+ms(180),exAt:B+ms(180),src:"Enquiry API"},
              {id:"ORD-10108",    inqLineId:"IQL-00072",type:"named",qty:100,status:"inprogress",pri:"normal",channel:"retail",pbt:B+ms(60), exAt:B+ms(95), src:"SAP"}],
    hard:[{id:"ORD-9999",inqLineId:"IQL-00073",qty:475,status:"inprogress",pri:"critical",pbt:B+ms(30)}]},

  { rowId:7, tpid:"TP-1122-RB41-F2",sku:"SKU-8832-RB", name:"RB41 Masterbox 65×50mm",
    tags:[{k:"subsystem",v:"TTP"}],
    attrs:[{k:"Dim Type",v:"RB41"},{k:"Model",v:"VISION-65"},{k:"Pack Qty",v:"24"}],
    area:"forward", uom:"Outer", damaged:0, status:"active", total:2000,
    reserved:[{id:"ORD-10112",inqLineId:"IQL-00081",type:"named",qty:210,status:"created",   pri:"normal",  channel:"ecom",pbt:B+ms(150),exAt:B+ms(65),src:"SAP"},
              {id:"ORD-10119",inqLineId:"IQL-00082",type:"named",qty:250,status:"inprogress",pri:"critical",channel:"ecom",pbt:B+ms(40), exAt:B+ms(30),src:"SAP"},
              {id:"ORD-10124",inqLineId:"IQL-00083",type:"named",qty:170,status:"created",   pri:"critical",channel:"ecom",pbt:B+ms(15), exAt:B+ms(6), src:"SAP"}],
    hard:[{id:"ORD-10005",inqLineId:"IQL-00085",qty:300,status:"inprogress",pri:"normal",pbt:B+ms(80)}]},
];

// ── colour tokens
const C = { navy:"#1a2340", orange:"#e65c00", red:"#c62828", green:"#2e7d32", teal:"#00897b",
  amber:"#e65c00", blue:"#1565c0", purple:"#4527a0", border:"#e0e3ea", bg:"#f4f5f7",
  text:"#1a2340", muted:"#5a6270", hint:"#9ca3af" };

const TTL_U = {
  ok:      { bg:"#e8f5e9", color:"#2e7d32", border:"#c8e6c9" },
  warn:    { bg:"#fff3e0", color:"#e65c00", border:"#ffe0b2" },
  crit:    { bg:"#ffebee", color:"#c62828", border:"#ef9a9a" },
  expired: { bg:"#f1f3f4", color:"#9ca3af", border:"#e0e3ea" },
};

const TYPE_U = {
  anon:  { bg:"#e3f2fd", color:"#1565c0", border:"#bbdefb", label:"ANON" },
  named: { bg:"#ede7f6", color:"#4527a0", border:"#d1c4e9", label:"NAMED" },
};

function TTLBadge({ exAt, now, pulse }) {
  const { text, u } = fmtTTL(exAt, now);
  const s = TTL_U[u] || TTL_U.ok;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:700, border:`1px solid ${s.border}`, background:s.bg, color:s.color,
      animation: u === "crit" && pulse ? "pulse-ttl 1.2s ease-in-out infinite" : undefined, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.color, flexShrink:0 }} />
      {text}
    </span>
  );
}

function TypeBadge({ type }) {
  const s = TYPE_U[type] || TYPE_U.named;
  return <span style={{ display:"inline-block", fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:3, background:s.bg, color:s.color, border:`1px solid ${s.border}`, letterSpacing:"0.05em" }}>{s.label}</span>;
}

function StatusBadge({ status }) {
  const m = { created:   { bg:"#e3f2fd", color:"#1565c0", b:"#bbdefb", label:"Reserved for Picking" },
               inprogress:{ bg:"#fff3e0", color:"#e65c00", b:"#ffe0b2", label:"Picking" },
               completed: { bg:"#f1f3f4", color:"#5a6270", b:"#d0d5df", label:"Reservation Released" } };
  const s = m[status] || m.created;
  return <span style={{ display:"inline-block", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:3, background:s.bg, color:s.color, border:`1px solid ${s.b}`, whiteSpace:"nowrap" }}>{s.label}</span>;
}

function PriBadge({ pri }) {
  return pri === "critical"
    ? <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:3, background:"#ffebee", color:"#c62828", border:"1px solid #ef9a9a" }}>Critical</span>
    : <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:3, background:"#f1f3f4", color:"#5a6270", border:"1px solid #e0e3ea" }}>Normal</span>;
}

function AreaBadge({ area }) {
  return area === "forward"
    ? <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:3, background:"#e8f5e9", color:"#2e7d32", border:"1px solid #c8e6c9", textTransform:"uppercase", letterSpacing:"0.04em" }}>Forward</span>
    : <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:3, background:"#ede7f6", color:"#4527a0", border:"1px solid #d1c4e9", textTransform:"uppercase", letterSpacing:"0.04em" }}>Reserve</span>;
}

function Btn({ children, onClick, disabled, variant="secondary", style: sx }) {
  const variants = {
    primary:  { border:`1px solid ${C.orange}`, background:C.orange, color:"#fff" },
    secondary:{ border:"1px solid #e0e3ea",    background:"#fff",    color:C.muted },
    danger:   { border:"1px solid #ef9a9a",    background:"#ffebee", color:C.red },
  };
  return <button onClick={onClick} disabled={disabled} style={{ padding:"7px 16px", borderRadius:5, fontSize:13, fontWeight:600, fontFamily:"inherit", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.45:1, transition:"all 0.15s", ...variants[variant], ...sx }}>{children}</button>;
}

// ── INVENTORY LISTING PAGE  (unified inventory — Jasmine / GM-276447 design)
function InventoryListingPage({ onTpidClick, onTabChange, now, setToast }) {
  const [srch, setSrch] = useState("");
  const [areaF, setAreaF] = useState("");
  const [sysF, setSysF]   = useState("");

  const SC = {
    TTP:    { bg:"#e0f2f1", color:"#00695c", border:"#b2dfdb" },
    Relay:  { bg:"#fff3e0", color:"#e65c00", border:"#ffe0b2" },
    RTP:    { bg:"#ede7f6", color:"#4527a0", border:"#d1c4e9" },
    "RTP+": { bg:"#fce4ec", color:"#880e4f", border:"#f48fb1" },
    Manual: { bg:"#f1f3f4", color:"#5a6270", border:"#d0d5df" },
  };
  const CH = { ecom:{bg:"#e3f2fd",color:"#1565c0",border:"#bbdefb"}, retail:{bg:"#f3e5f5",color:"#6a1b9a",border:"#ce93d8"}, export:{bg:"#e8f5e9",color:"#2e7d32",border:"#c8e6c9"} };
  const UC = { Outer:{bg:"#e0f2f1",color:"#00695c",border:"#b2dfdb"}, Inner:{bg:"#fff3e0",color:"#e65c00",border:"#ffe0b2"}, Each:{bg:"#e3f2fd",color:"#1565c0",border:"#bbdefb"} };

  const filtered = DATA.filter(r => {
    if (areaF && r.area !== areaF) return false;
    if (sysF) { const s = r.tags.find(t=>t.k==="subsystem")?.v; if (s !== sysF) return false; }
    if (srch) { const q = srch.toLowerCase(); if (!r.tpid.toLowerCase().includes(q) && !r.sku.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q)) return false; }
    return true;
  });

  const totOH  = filtered.reduce((s,r)=>s+r.total,0);
  const totRes = filtered.reduce((s,r)=>s+r.reserved.reduce((a,o)=>a+o.qty,0),0);
  const totHA  = filtered.reduce((s,r)=>s+r.hard.reduce((a,o)=>a+o.qty,0),0);
  const totFree= totOH - totRes - totHA;

  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", fontSize:13, background:C.bg, minHeight:"100vh", color:C.text }}>
      <style>{`.listing-row:hover{background:#f8f9fb!important;cursor:pointer}.act-btn:hover{background:#f4f5f7!important}`}</style>

      <div style={{ background:C.navy, display:"flex", alignItems:"center", padding:"0 20px", height:52, gap:16, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:"#fff", borderRadius:6, padding:"4px 8px", display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>GO</span></div>
            <span style={{ fontSize:13, fontWeight:700, color:C.orange }}>GreyOrange</span>
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <div><div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Manager Dashboard</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.45)" }}>Version 7.8.0.2</div></div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#4fc3f7" }}>EssilorLuxottica</span>
          <span style={{ fontSize:9, background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", padding:"1px 5px", borderRadius:3, border:"1px solid rgba(255,255,255,0.15)" }}>ATL</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => navigate("/")} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:5, color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>
            ← All Prototypes
          </button>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>US/Eastern</span>
        </div>
      </div>
      <div style={{ background:C.navy, borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", padding:"0 20px" }}>
        {["Analytics","Outbound","Inbound","Audit","Process Exceptions","Inventory","System","Users","Reports","Notification"].map(n=>(
          <div key={n} style={{ padding:"10px 18px", fontSize:12, fontWeight:600, letterSpacing:"0.04em", color:n==="Inventory"?"#fff":"rgba(255,255,255,0.55)", cursor:"pointer", borderBottom:n==="Inventory"?"3px solid #e65c00":"3px solid transparent", whiteSpace:"nowrap", textTransform:"uppercase" }}>{n}</div>
        ))}
      </div>
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, display:"flex", padding:"0 20px" }}>
        {[["Inventory Listing",true],["Bin Overview",false],["SKU Master",false],["Inventory Reservation",false],["Audit Log",false],["Damaged Stock",false]].map(([t,active])=>(
          <div key={t} onClick={()=>t==="Inventory Reservation"&&onTabChange("reservation")} style={{ padding:"10px 20px", fontSize:13, color:active?C.orange:C.muted, cursor:"pointer", borderBottom:active?`2px solid ${C.orange}`:"2px solid transparent", fontWeight:active?600:400, whiteSpace:"nowrap" }}>{t}</div>
        ))}
      </div>

      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>

        {/* summary */}
        <div style={{ display:"flex", alignItems:"center", background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"9px 16px", flexWrap:"wrap", gap:4 }}>
          <span style={{ fontSize:13, fontWeight:600 }}>Inventory Listing</span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          <span style={{ fontSize:13, color:C.muted }}>TPIDs: <strong style={{ color:C.text }}>{filtered.length} of {DATA.length}</strong></span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          <span style={{ fontSize:13, color:C.muted }}>On-Hand: <strong style={{ color:C.text }}>{totOH.toLocaleString()}</strong></span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          <span style={{ fontSize:13, color:C.muted }}>Reserved: <strong style={{ color:C.orange }}>{totRes.toLocaleString()}</strong></span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          <span style={{ fontSize:13, color:C.muted }}>Hard Alloc: <strong style={{ color:C.red }}>{totHA.toLocaleString()}</strong></span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          <span style={{ fontSize:13, color:C.muted }}>Free: <strong style={{ color:C.teal }}>{totFree.toLocaleString()}</strong></span>
        </div>

        {/* filters */}
        <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, border:`1px solid ${C.border}`, borderRadius:4, padding:"5px 10px", background:"#fff", minWidth:240 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search TPID, SKU or product…" style={{ border:"none", outline:"none", background:"none", fontSize:13, fontFamily:"inherit", color:C.text, width:"100%" }} />
          </div>
          <div style={{ width:1, height:20, background:C.border }} />
          <select value={areaF} onChange={e=>setAreaF(e.target.value)} style={{ border:`1px solid ${areaF?C.orange:C.border}`, borderRadius:4, padding:"5px 10px", fontSize:12, fontFamily:"inherit", color:areaF?C.orange:C.muted, background:areaF?"#fff5f0":"#fff", cursor:"pointer", outline:"none" }}>
            <option value="">All Areas</option><option value="forward">Forward</option><option value="reserve">Reserve</option>
          </select>
          <select value={sysF} onChange={e=>setSysF(e.target.value)} style={{ border:`1px solid ${sysF?C.orange:C.border}`, borderRadius:4, padding:"5px 10px", fontSize:12, fontFamily:"inherit", color:sysF?C.orange:C.muted, background:sysF?"#fff5f0":"#fff", cursor:"pointer", outline:"none" }}>
            <option value="">All Subsystems</option>
            {["TTP","Relay","RTP","RTP+","Manual"].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={()=>{setSrch("");setAreaF("");setSysF("");}} style={{ marginLeft:"auto", background:"none", border:"none", fontSize:12, color:C.hint, cursor:"pointer", fontFamily:"inherit" }}>Clear all</button>
        </div>

        {/* table */}
        <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8f9fb", borderBottom:`1px solid ${C.border}` }}>
                  {[["TPID",148],["SKU",170],["Tags",160],["Area",88],["UoM",68],["On-Hand",88],["Reserved",100],["Hard Alloc",105],["Free Qty",88],["Actions",80]].map(([lbl,w])=>(
                    <th key={lbl} style={{ minWidth:w, padding:"10px 12px", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", textAlign:["On-Hand","Reserved","Hard Alloc","Free Qty"].includes(lbl)?"right":"left", whiteSpace:"nowrap" }}>{lbl}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row=>{
                  const sys  = row.tags.find(t=>t.k==="subsystem")?.v;
                  const sc   = SC[sys]||SC.Manual;
                  const uc   = UC[row.uom]||UC.Outer;
                  const rQty = row.reserved.reduce((a,o)=>a+o.qty,0);
                  const hQty = row.hard.reduce((a,o)=>a+o.qty,0);
                  const fQty = row.total - rQty - hQty;
                  const rPct = row.total>0?(rQty/row.total)*100:0;
                  const hPct = row.total>0?(hQty/row.total)*100:0;
                  return (
                    <tr key={row.rowId} className="listing-row" style={{ borderBottom:`1px solid #f0f1f4` }} onClick={()=>onTpidClick(row.rowId)}>
                      <td style={{ padding:"9px 12px" }}>
                        <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, fontWeight:700, color:"#00695c", background:"#e0f2f1", border:"1px solid #b2dfdb", borderRadius:3, padding:"2px 7px", whiteSpace:"nowrap" }}>{row.tpid}</span>
                      </td>
                      <td style={{ padding:"9px 12px" }}>
                        <div style={{ fontFamily:"'Courier New',monospace", fontSize:12, fontWeight:700 }}>{row.sku}</div>
                        <div style={{ fontSize:11, color:C.hint, marginTop:2 }}>{row.name}</div>
                      </td>
                      <td style={{ padding:"9px 12px" }}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                          {row.tags.map(t=>{
                            const cc = CH[t.v]||{bg:"#f1f3f4",color:"#5a6270",border:"#d0d5df"};
                            return t.k==="subsystem"
                              ? <span key={t.k} style={{ fontSize:11, fontWeight:700, padding:"1px 7px", borderRadius:3, letterSpacing:"0.05em", background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>{t.v}</span>
                              : <span key={t.k} style={{ fontSize:10, fontWeight:600, padding:"1px 6px", borderRadius:3, background:cc.bg, color:cc.color, border:`1px solid ${cc.border}` }}>{t.v}</span>;
                          })}
                        </div>
                      </td>
                      <td style={{ padding:"9px 12px" }}><AreaBadge area={row.area} /></td>
                      <td style={{ padding:"9px 12px" }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:"1px 7px", borderRadius:3, background:uc.bg, color:uc.color, border:`1px solid ${uc.border}` }}>{row.uom||"Outer"}</span>
                      </td>
                      <td style={{ padding:"9px 12px", textAlign:"right", fontSize:13, fontWeight:600 }}>{row.total.toLocaleString()}</td>
                      <td style={{ padding:"9px 12px", textAlign:"right" }}>
                        {rQty>0
                          ? <div><div style={{ fontSize:13, fontWeight:600, color:C.orange }}>{rQty.toLocaleString()}</div><div style={{ height:3, borderRadius:2, background:"#ffe0b2", marginTop:3, width:50, overflow:"hidden", marginLeft:"auto" }}><div style={{ height:"100%", borderRadius:2, background:C.orange, width:`${rPct}%` }}/></div></div>
                          : <span style={{ fontSize:13, color:C.hint }}>—</span>}
                      </td>
                      <td style={{ padding:"9px 12px", textAlign:"right" }}>
                        {hQty>0
                          ? <div><div style={{ fontSize:13, fontWeight:600, color:C.red }}>{hQty.toLocaleString()}</div><div style={{ height:3, borderRadius:2, background:"#ffcdd2", marginTop:3, width:50, overflow:"hidden", marginLeft:"auto" }}><div style={{ height:"100%", borderRadius:2, background:C.red, width:`${hPct}%` }}/></div></div>
                          : <span style={{ fontSize:13, color:C.hint }}>—</span>}
                      </td>
                      <td style={{ padding:"9px 12px", textAlign:"right", fontSize:13, fontWeight:600, color:C.teal }}>{fQty.toLocaleString()}</td>
                      <td style={{ padding:"9px 12px" }} onClick={e=>e.stopPropagation()}>
                        <button className="act-btn" onClick={()=>onTpidClick(row.rowId)} style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:4, border:`1px solid ${C.border}`, background:"#fff", color:C.muted, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Manage →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", borderTop:`1px solid ${C.border}`, background:"#fff", fontSize:12, color:C.muted }}>
            <span>{filtered.length} TPIDs</span>
            <div style={{ display:"flex", gap:4 }}>
              {["‹","1","2","3","›"].map((p,i)=>(
                <button key={i} style={{ minWidth:28, height:28, padding:"0 6px", border:`1px solid ${C.border}`, borderRadius:4, background:p==="1"?C.orange:"#fff", color:p==="1"?"#fff":C.muted, fontSize:12, fontFamily:"inherit", cursor:"pointer", fontWeight:p==="1"?700:400 }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TPID DETAIL PAGE
function TpidDetailPage({ row, onBack, onNavReservation, now, setToast }) {
  const [tab, setTab]             = useState("overview");
  const [tags, setTags]           = useState(JSON.parse(JSON.stringify(row.tags)));
  const [blocked, setBlocked]     = useState(false);
  const [modal, setModal]         = useState(null);
  const [editTag, setEditTag]     = useState({ k:"", v:"", reason:"", err:false });
  const [blockReason, setBlockR]  = useState(""); const [blockErr, setBlockE] = useState(false);
  const [adjMode, setAdjMode]     = useState("+");
  const [adjQty, setAdjQty]       = useState(""); const [adjReason, setAdjR] = useState(""); const [adjErr, setAdjE] = useState({});
  const [auditType, setAuditType] = useState("count");

  const rQty = row.reserved.reduce((a,o)=>a+o.qty,0);
  const hQty = row.hard.reduce((a,o)=>a+o.qty,0);
  const fQty = row.total - rQty - hQty;
  const hasActiveRes = row.reserved.some(o => o.status !== "completed");
  const dimAttr   = row.attrs?.find(a=>a.k==="Dim Type");
  const modelAttr = row.attrs?.find(a=>a.k==="Model");
  const packAttr  = row.attrs?.find(a=>a.k==="Pack Qty");

  const audits = [
    { date:"May 20, 2026", type:"Count Check",  result:"Count match",     qty:row.total,     by:"ops-sup-01", pass:true },
    { date:"May 06, 2026", type:"Damage Check", result:"No damage found", qty:row.total,     by:"ops-sup-02", pass:true },
    { date:"Apr 18, 2026", type:"Count Check",  result:"Short −8 units",  qty:row.total-8,   by:"ops-sup-01", pass:false },
    { date:"Mar 31, 2026", type:"Count Check",  result:"Count match",     qty:row.total-8,   by:"ops-sup-03", pass:true },
  ];
  const tagHist = [
    { date:"May 15, 2026", field:"channel", from:"export",   to:"ecom",    by:"admin",  reason:"Reallocation per EL ATL wave plan" },
    { date:"Apr 10, 2026", field:"lot",     from:"L2024-08", to:"L2024-11",by:"system", reason:"Auto-updated on put-away (FEFO rule)" },
    { date:"Mar 02, 2026", field:"channel", from:"retail",   to:"export",  by:"admin",  reason:"Channel re-assignment — Q1 demand shift" },
  ];

  function openTagEdit(t) { setEditTag({ k:t.k, v:t.v, reason:"", err:false }); setModal("tag"); }
  function saveTag() {
    if (!editTag.reason.trim()) { setEditTag(e=>({...e,err:true})); return; }
    setTags(ts => ts.map(t => t.k===editTag.k ? {...t,v:editTag.v} : t));
    setModal(null); setToast(`Tag updated: ${editTag.k} → ${editTag.v}`);
  }
  function confirmBlock() {
    if (!blockReason.trim()) { setBlockE(true); return; }
    setBlocked(b=>!b); setModal(null);
    setToast(blocked ? "TPID unblocked — available for picks and puts" : `TPID blocked — ${row.tpid} excluded from new tasks`);
  }
  function confirmAdj() {
    const e = {};
    if (!adjQty || isNaN(+adjQty) || +adjQty <= 0) e.qty = true;
    if (!adjReason.trim()) e.reason = true;
    if (Object.keys(e).length) { setAdjE(e); return; }
    setModal(null); setToast(`Inventory ${adjMode==="+"?"increased":"decreased"} by ${adjQty} units — ${row.tpid}`);
  }

  const MODAL_OVERLAY = { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 };
  const MODAL_BOX = { background:"#fff", borderRadius:8, width:460, maxWidth:"94vw", boxShadow:"0 8px 32px rgba(0,0,0,0.18)" };
  const MODAL_HDR = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 20px", borderBottom:`1px solid ${C.border}` };
  const MODAL_FTR = { display:"flex", justifyContent:"flex-end", gap:8, padding:"12px 20px", borderTop:`1px solid ${C.border}` };
  const CLOSE_BTN = { background:"none", border:"none", cursor:"pointer", color:C.hint, padding:2, lineHeight:0 };
  const XSVG      = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;

  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", fontSize:13, background:C.bg, minHeight:"100vh", color:C.text }}>
      <style>{`
        @keyframes pulse-ttl { 0%,100%{opacity:1} 50%{opacity:0.55} }
        @keyframes expiring-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(198,40,40,0.3)} 50%{box-shadow:0 0 0 6px rgba(198,40,40,0)} }
        .tpid-tab-btn:hover { color:#1a2340 !important; }
        .tpid-tag-row:hover { background:#f0f1f4 !important; }
        .act-btn:hover { background:#f4f5f7 !important; }
      `}</style>

      {/* ── nav header (same branding) */}
      <div style={{ background:C.navy, display:"flex", alignItems:"center", padding:"0 20px", height:52, gap:16, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:"#fff", borderRadius:6, padding:"4px 8px", display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>GO</span>
            </div>
            <span style={{ fontSize:13, fontWeight:700, color:C.orange }}>GreyOrange</span>
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Manager Dashboard</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)" }}>Version 7.8.0.2</div>
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#4fc3f7" }}>EssilorLuxottica</span>
          <span style={{ fontSize:9, background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", padding:"1px 5px", borderRadius:3, border:"1px solid rgba(255,255,255,0.15)" }}>ATL</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => navigate("/")} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:5, color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>
            ← All Prototypes
          </button>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>US/Eastern</span>
        </div>
      </div>

      {/* ── secondary nav */}
      <div style={{ background:C.navy, borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", padding:"0 20px" }}>
        {["Analytics","Outbound","Inbound","Audit","Process Exceptions","Inventory","System","Users","Reports","Notification"].map(n => (
          <div key={n} style={{ padding:"10px 18px", fontSize:12, fontWeight:600, letterSpacing:"0.04em", color: n==="Inventory"?"#fff":"rgba(255,255,255,0.55)", cursor:"pointer", borderBottom: n==="Inventory"?"3px solid #e65c00":"3px solid transparent", whiteSpace:"nowrap", textTransform:"uppercase" }}>{n}</div>
        ))}
      </div>
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, display:"flex", padding:"0 20px" }}>
        {["Inventory Listing","Bin Overview","SKU Master","Inventory Reservation","Audit Log","Damaged Stock"].map(t => (
          <div key={t} onClick={() => {
              if (t==="Inventory Listing") onBack();
              else if (t==="Inventory Reservation") onNavReservation();
            }} style={{ padding:"10px 20px", fontSize:13, color: t==="Inventory Listing"?C.orange:C.muted, cursor:(t==="Inventory Listing"||t==="Inventory Reservation")?"pointer":"default", borderBottom: t==="Inventory Listing"?`2px solid ${C.orange}`:"2px solid transparent", fontWeight: t==="Inventory Listing"?600:400, whiteSpace:"nowrap" }}>{t}</div>
        ))}
      </div>

      {/* ── breadcrumb */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, padding:"8px 20px", display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.muted }}>
        <span>Inventory</span>
        <span style={{ color:C.hint }}>›</span>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.orange, fontSize:12, fontFamily:"inherit", fontWeight:500, padding:0 }}>Inventory Listing</button>
        <span style={{ color:C.hint }}>›</span>
        <span style={{ color:C.text, fontWeight:600, fontFamily:"'Courier New',monospace" }}>{row.tpid}</span>
      </div>

      {/* ── page body */}
      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>

        {/* ── TPID identity + actions */}
        <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:20, fontWeight:700, color:"#00695c" }}>{row.tpid}</span>
                <AreaBadge area={row.area} />
                {blocked && <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:3, background:"#ffebee", color:C.red, border:"1px solid #ef9a9a", letterSpacing:"0.04em" }}>BLOCKED</span>}
                {hasActiveRes && <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:3, background:"#fff3e0", color:C.orange, border:"1px solid #ffe0b2" }}>Has reservations</span>}
              </div>
              <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{row.sku} <span style={{ color:C.muted, fontWeight:400, fontSize:13 }}>— {row.name}</span></div>
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                {dimAttr  && <span style={{ fontSize:11, padding:"1px 7px", borderRadius:3, background:"#e8f5e9", color:"#2e7d32", border:"1px solid #c8e6c9", fontWeight:700 }}>{dimAttr.v}</span>}
                {modelAttr && <span style={{ fontSize:11, padding:"1px 7px", borderRadius:3, background:"#f1f3f4", color:C.muted, border:`1px solid ${C.border}`, fontFamily:"'Courier New',monospace" }}>{modelAttr.v}</span>}
                {packAttr  && <span style={{ fontSize:11, padding:"1px 7px", borderRadius:3, background:"#f1f3f4", color:C.muted, border:`1px solid ${C.border}` }}>Pk {packAttr.v}</span>}
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-start" }}>
              <button onClick={() => { setEditTag({k:tags[0]?.k||"channel",v:tags[0]?.v||"",reason:"",err:false}); setModal("tag"); }} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${C.border}`, background:"#fff", color:C.text, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Change Tags</button>
              <button onClick={() => setModal("audit")} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${C.border}`, background:"#fff", color:C.text, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Initiate Audit</button>
              <button onClick={() => { setBlockR(""); setBlockE(false); setModal("block"); }} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${blocked?"#c8e6c9":"#ef9a9a"}`, background:blocked?"#e8f5e9":"#ffebee", color:blocked?"#2e7d32":C.red, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {blocked ? "Unblock TPID" : "Block TPID"}
              </button>
              <button onClick={() => { setAdjMode("+"); setAdjQty(""); setAdjR(""); setAdjE({}); setModal("adjust"); }} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${C.orange}`, background:"#fff5f0", color:C.orange, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Adjust Inventory</button>
            </div>
          </div>
        </div>

        {/* ── stats bar */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {[["On-Hand", row.total, C.text], ["Reserved", rQty, C.orange], ["Hard Allocated", hQty, C.red], ["Free Qty", fQty, C.teal], ["Damaged", row.damaged||0, C.muted]].map(([label,val,col]) => (
            <div key={label} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"12px 16px" }}>
              <div style={{ fontSize:10, color:C.hint, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>{label}</div>
              <div style={{ fontSize:24, fontWeight:700, color:col }}>{val.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* ── tabbed content */}
        <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
          {/* tab bar */}
          <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, padding:"0 16px" }}>
            {[["overview","Overview"],["reservations",`Reservations (${row.reserved.length})`],["audit","Audit History"],["taghistory","Tag History"]].map(([id,label]) => (
              <button key={id} className="tpid-tab-btn" onClick={() => setTab(id)} style={{ padding:"11px 18px", fontSize:13, fontWeight:tab===id?600:400, color:tab===id?C.orange:C.muted, border:"none", borderBottom:`2px solid ${tab===id?C.orange:"transparent"}`, background:"none", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", whiteSpace:"nowrap" }}>{label}</button>
            ))}
          </div>

          <div style={{ padding:"20px" }}>

            {/* ── OVERVIEW TAB */}
            {tab === "overview" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

                {/* Inventory Tags — editable */}
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>Inventory Tags</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {tags.map(t => (
                      <div key={t.k} className="tpid-tag-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", background:"#f8f9fb", borderRadius:5, border:`1px solid ${C.border}`, transition:"background 0.12s" }}>
                        <div>
                          <span style={{ fontSize:10, color:C.hint, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginRight:10 }}>{t.k}</span>
                          <span style={{ fontSize:13, fontWeight:600 }}>{t.v}</span>
                        </div>
                        <button onClick={() => openTagEdit(t)} style={{ fontSize:11, padding:"3px 10px", borderRadius:3, border:`1px solid ${C.border}`, background:"#fff", color:C.muted, cursor:"pointer", fontFamily:"inherit" }}>Edit</button>
                      </div>
                    ))}
                    <button onClick={() => setEditTag({k:"",v:"",reason:"",err:false}) || setModal("tag-new")} style={{ padding:"7px 12px", borderRadius:5, border:`1px dashed ${C.border}`, background:"transparent", color:C.hint, fontSize:12, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>+ Add tag</button>
                    {hasActiveRes && (
                      <div style={{ display:"flex", gap:8, background:"#fff3e0", border:"1px solid #ffcc80", borderRadius:5, padding:"9px 12px", fontSize:12, color:"#bf360c", lineHeight:1.5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
                        Active reservations exist. Tag changes will be queued and applied once all reservations for this TPID clear.
                      </div>
                    )}
                  </div>
                </div>

                {/* PDFA Attributes — read-only */}
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>PDFA Attributes</div>
                  <div style={{ fontSize:11, color:C.hint, marginBottom:12 }}>Managed via Item Master — not editable here</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {row.attrs?.map(a => (
                      <div key={a.k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", background:"#fafbfc", borderRadius:5, border:`1px solid ${C.border}` }}>
                        <span style={{ fontSize:10, color:C.hint, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{a.k}</span>
                        <span style={{ fontSize:13, fontWeight:600, fontFamily:"'Courier New',monospace", color:C.text }}>{a.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:12, fontSize:12, color:C.hint }}>
                    To edit: <button onClick={() => setToast("→ SKU Master: " + row.sku)} style={{ background:"none", border:"none", color:C.orange, cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:500, padding:0 }}>SKU Master → {row.sku} →</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── RESERVATIONS TAB */}
            {tab === "reservations" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <span style={{ fontSize:13, color:C.muted }}>{row.reserved.length} reservation{row.reserved.length!==1?"s":""} · TPID {row.tpid}</span>
                  <button onClick={onNavReservation} style={{ background:"none", border:"none", color:C.orange, cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:500 }}>View all reservations →</button>
                </div>
                {row.reserved.length === 0
                  ? <p style={{ fontSize:13, color:C.hint, fontStyle:"italic" }}>No active reservations for this TPID.</p>
                  : <div style={{ border:`1px solid ${C.border}`, borderRadius:5, overflow:"hidden" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ background:"#f8f9fb", borderBottom:`1px solid ${C.border}` }}>
                            {["Reservation ID","Order ID","Type","Channel","PBT","Priority","Status","Qty"].map(h => (
                              <th key={h} style={{ padding:"7px 12px", fontSize:11, fontWeight:600, color:"#8a93a8", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:h==="Qty"?"right":"left", whiteSpace:"nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {row.reserved.map(o => {
                            const pbt = fmtPBT(o.pbt);
                            return (
                              <tr key={o.id} style={{ borderBottom:`1px solid #f0f1f4` }}>
                                <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:11, color:"#8a93a8" }}>{o.inqLineId}</td>
                                <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:12, fontWeight:600, color:C.blue, textDecoration:"underline", textDecorationStyle:"dotted", cursor:"pointer" }}
                                    onClick={() => setToast(`→ Order Details: ${o.id}`)}>{o.id}</td>
                                <td style={{ padding:"8px 12px" }}><TypeBadge type={o.type} /></td>
                                <td style={{ padding:"8px 12px" }}><span style={{ fontSize:11, fontWeight:600, padding:"1px 7px", borderRadius:3, background:"#e3f2fd", color:"#1565c0", border:"1px solid #bbdefb" }}>{o.channel}</span></td>
                                <td style={{ padding:"8px 12px" }}>
                                  <div style={{ fontSize:12 }}>{pbt.abs} ET</div>
                                  <div style={{ fontSize:11, color:pbt.cls==="red"?C.red:pbt.cls==="amber"?C.orange:C.green }}>{pbt.rel}</div>
                                </td>
                                <td style={{ padding:"8px 12px" }}><PriBadge pri={o.pri} /></td>
                                <td style={{ padding:"8px 12px" }}><StatusBadge status={o.status} /></td>
                                <td style={{ padding:"8px 12px", textAlign:"right", fontSize:13, fontWeight:700, color:C.orange }}>{o.qty.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>}
              </div>
            )}

            {/* ── AUDIT HISTORY TAB */}
            {tab === "audit" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <span style={{ fontSize:13, color:C.muted }}>Last 90 days — {row.tpid}</span>
                  <button onClick={() => setModal("audit")} style={{ padding:"5px 12px", borderRadius:4, border:`1px solid ${C.orange}`, background:"#fff5f0", color:C.orange, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Initiate Audit</button>
                </div>
                <div style={{ border:`1px solid ${C.border}`, borderRadius:5, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#f8f9fb", borderBottom:`1px solid ${C.border}` }}>
                        {["Date","Type","Result","Qty Counted","Inspector","Outcome"].map(h => (
                          <th key={h} style={{ padding:"7px 12px", fontSize:11, fontWeight:600, color:"#8a93a8", textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {audits.map((a,i) => (
                        <tr key={i} style={{ borderBottom:`1px solid #f0f1f4` }}>
                          <td style={{ padding:"8px 12px", fontSize:12 }}>{a.date}</td>
                          <td style={{ padding:"8px 12px", fontSize:12 }}>{a.type}</td>
                          <td style={{ padding:"8px 12px", fontSize:12, color:a.pass?C.green:C.red }}>{a.result}</td>
                          <td style={{ padding:"8px 12px", fontSize:12 }}>{a.qty.toLocaleString()}</td>
                          <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:11, color:C.muted }}>{a.by}</td>
                          <td style={{ padding:"8px 12px" }}>
                            <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:3, background:a.pass?"#e8f5e9":"#ffebee", color:a.pass?"#2e7d32":C.red, border:`1px solid ${a.pass?"#c8e6c9":"#ef9a9a"}` }}>{a.pass?"Passed":"Failed"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAG HISTORY TAB */}
            {tab === "taghistory" && (
              <div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>All tag changes on {row.tpid}, most recent first.</div>
                <div style={{ border:`1px solid ${C.border}`, borderRadius:5, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#f8f9fb", borderBottom:`1px solid ${C.border}` }}>
                        {["Date","Field","Previous","New Value","Changed By","Reason"].map(h => (
                          <th key={h} style={{ padding:"7px 12px", fontSize:11, fontWeight:600, color:"#8a93a8", textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tagHist.map((t,i) => (
                        <tr key={i} style={{ borderBottom:`1px solid #f0f1f4` }}>
                          <td style={{ padding:"8px 12px", fontSize:12 }}>{t.date}</td>
                          <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:11, fontWeight:700, color:C.text }}>{t.field}</td>
                          <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:12, color:C.red, textDecoration:"line-through" }}>{t.from}</td>
                          <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:12, color:C.green, fontWeight:700 }}>{t.to}</td>
                          <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:11, color:C.muted }}>{t.by}</td>
                          <td style={{ padding:"8px 12px", fontSize:12, color:C.muted }}>{t.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CHANGE TAG MODAL */}
      {(modal === "tag" || modal === "tag-new") && (
        <div style={MODAL_OVERLAY}>
          <div style={MODAL_BOX}>
            <div style={MODAL_HDR}><span style={{ fontSize:15, fontWeight:700 }}>{modal==="tag"?"Edit Tag":"Add Tag"}</span><button style={CLOSE_BTN} onClick={() => setModal(null)}>{XSVG}</button></div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#f8f9fb", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 12px" }}>
                <div style={{ fontSize:12, color:C.hint, marginBottom:2 }}>TPID</div>
                <div style={{ fontFamily:"'Courier New',monospace", fontSize:13, fontWeight:700, color:"#00695c" }}>{row.tpid}</div>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Tag key <span style={{ color:C.red }}>*</span></div>
                <input value={editTag.k} onChange={e => setEditTag(t=>({...t,k:e.target.value}))} placeholder="e.g. channel" style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>New value <span style={{ color:C.red }}>*</span></div>
                <input value={editTag.v} onChange={e => setEditTag(t=>({...t,v:e.target.value}))} placeholder="e.g. retail" style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
                {editTag.k === "subsystem" && (
                  <div style={{ marginTop:6, fontSize:11, color:C.muted, background:"#f8f9fb", padding:"7px 10px", borderRadius:4, border:`1px solid ${C.border}`, lineHeight:1.6 }}>
                    <strong>Valid values for this TPID's area ({row.area}):</strong>
                    {row.area === "forward"
                      ? " TTP · Relay · RTP · RTP+"
                      : " Manual"}
                  </div>
                )}
              </div>
              {hasActiveRes && (
                <div style={{ display:"flex", gap:8, background:"#fff3e0", border:"1px solid #ffcc80", borderRadius:5, padding:"9px 12px", fontSize:12, color:"#bf360c" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
                  Active reservations on this TPID. Change will queue and apply once all reservations clear.
                </div>
              )}
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Reason <span style={{ color:C.red }}>*</span></div>
                <textarea value={editTag.reason} onChange={e => setEditTag(t=>({...t,reason:e.target.value,err:false}))} placeholder="e.g. Reallocation per wave plan..." rows={3}
                  style={{ width:"100%", border:`1px solid ${editTag.err&&!editTag.reason.trim()?C.red:C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box" }} />
                {editTag.err && !editTag.reason.trim() && <div style={{ fontSize:11, color:C.red, marginTop:3 }}>Reason is required for audit trail.</div>}
              </div>
            </div>
            <div style={MODAL_FTR}><Btn onClick={() => setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={saveTag}>Save Tag</Btn></div>
          </div>
        </div>
      )}

      {/* ── BLOCK / UNBLOCK MODAL */}
      {modal === "block" && (
        <div style={MODAL_OVERLAY}>
          <div style={MODAL_BOX}>
            <div style={MODAL_HDR}><span style={{ fontSize:15, fontWeight:700 }}>{blocked?"Unblock TPID":"Block TPID"}</span><button style={CLOSE_BTN} onClick={() => setModal(null)}>{XSVG}</button></div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#f8f9fb", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 12px" }}>
                <div style={{ fontSize:12, color:C.hint, marginBottom:2 }}>TPID</div>
                <div style={{ fontFamily:"'Courier New',monospace", fontSize:13, fontWeight:700, color:"#00695c" }}>{row.tpid}</div>
              </div>
              {!blocked && (
                <div style={{ display:"flex", gap:8, background:"#ffebee", border:"1px solid #ef9a9a", borderRadius:5, padding:"9px 12px", fontSize:12, color:"#c62828" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Blocking this TPID will prevent new pick tasks and put-away tasks. Existing in-progress picks will complete. Active reservations will remain until they expire or are released.
                </div>
              )}
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Reason <span style={{ color:C.red }}>*</span></div>
                <textarea value={blockReason} onChange={e => { setBlockR(e.target.value); setBlockE(false); }} placeholder={blocked ? "e.g. Maintenance complete — returning to active" : "e.g. TPID damaged — awaiting inspection"} rows={3}
                  style={{ width:"100%", border:`1px solid ${blockErr&&!blockReason.trim()?C.red:C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box" }} />
                {blockErr && !blockReason.trim() && <div style={{ fontSize:11, color:C.red, marginTop:3 }}>Reason is required.</div>}
              </div>
            </div>
            <div style={MODAL_FTR}>
              <Btn onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant={blocked?"primary":"danger"} onClick={confirmBlock}>{blocked?"Confirm Unblock":"Confirm Block"}</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── ADJUST INVENTORY MODAL */}
      {modal === "adjust" && (
        <div style={MODAL_OVERLAY}>
          <div style={MODAL_BOX}>
            <div style={MODAL_HDR}><span style={{ fontSize:15, fontWeight:700 }}>Adjust Inventory</span><button style={CLOSE_BTN} onClick={() => setModal(null)}>{XSVG}</button></div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#f8f9fb", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 12px", display:"flex", gap:20 }}>
                {[["TPID", row.tpid], ["Current On-Hand", row.total.toLocaleString()]].map(([k,v]) => (
                  <div key={k}><div style={{ fontSize:11, color:C.hint, marginBottom:2 }}>{k}</div><div style={{ fontSize:13, fontWeight:700, fontFamily:"'Courier New',monospace" }}>{v}</div></div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:6 }}>Adjustment direction</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[["+","Positive (add stock)"],["−","Negative (remove stock)"]].map(([mode,label]) => (
                    <label key={mode} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", flex:1, padding:"8px 12px", borderRadius:5, border:`1px solid ${adjMode===mode?C.orange:C.border}`, background:adjMode===mode?"#fff5f0":"#fff", fontSize:12, fontWeight:500, color:adjMode===mode?C.orange:C.text }}>
                      <input type="radio" name="adjMode" value={mode} checked={adjMode===mode} onChange={() => setAdjMode(mode)} style={{ accentColor:C.orange }} />
                      <span style={{ fontWeight:700, marginRight:4 }}>{mode}</span>{label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Quantity <span style={{ color:C.red }}>*</span></div>
                <input type="number" min="1" value={adjQty} onChange={e => { setAdjQty(e.target.value); setAdjE({}); }} placeholder="Enter qty"
                  style={{ width:"100%", border:`1px solid ${adjErr.qty?C.red:C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
                {adjErr.qty && <div style={{ fontSize:11, color:C.red, marginTop:3 }}>Enter a valid quantity greater than 0.</div>}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Reason <span style={{ color:C.red }}>*</span></div>
                <textarea value={adjReason} onChange={e => { setAdjR(e.target.value); setAdjE({}); }} placeholder="e.g. Damaged units removed after count check" rows={3}
                  style={{ width:"100%", border:`1px solid ${adjErr.reason?C.red:C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box" }} />
                {adjErr.reason && <div style={{ fontSize:11, color:C.red, marginTop:3 }}>Reason is required for audit trail.</div>}
              </div>
            </div>
            <div style={MODAL_FTR}><Btn onClick={() => setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={confirmAdj}>Confirm Adjustment</Btn></div>
          </div>
        </div>
      )}

      {/* ── INITIATE AUDIT MODAL */}
      {modal === "audit" && (
        <div style={MODAL_OVERLAY}>
          <div style={MODAL_BOX}>
            <div style={MODAL_HDR}><span style={{ fontSize:15, fontWeight:700 }}>Initiate Audit</span><button style={CLOSE_BTN} onClick={() => setModal(null)}>{XSVG}</button></div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#f8f9fb", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 12px" }}>
                <div style={{ fontSize:12, color:C.hint, marginBottom:2 }}>TPID</div>
                <div style={{ fontFamily:"'Courier New',monospace", fontSize:13, fontWeight:700, color:"#00695c" }}>{row.tpid}</div>
              </div>
              {hasActiveRes && (
                <div style={{ display:"flex", gap:8, background:"#fff3e0", border:"1px solid #ffcc80", borderRadius:5, padding:"9px 12px", fontSize:12, color:"#bf360c" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
                  Active reservations exist. This TPID will audit unreserved qty only — reserved qty ({rQty} units) is excluded per site preference.
                </div>
              )}
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:6 }}>Audit type</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[["count","Count Check — verify physical qty against system record"],["damage","Damage Check — inspect for damaged or defective units"],["full","Full Audit — count + damage in one pass"]].map(([v,label]) => (
                    <label key={v} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"8px 12px", borderRadius:5, border:`1px solid ${auditType===v?C.orange:C.border}`, background:auditType===v?"#fff5f0":"#fff", fontSize:12 }}>
                      <input type="radio" name="auditType" value={v} checked={auditType===v} onChange={() => setAuditType(v)} style={{ accentColor:C.orange }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={MODAL_FTR}>
              <Btn onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => { setModal(null); setToast(`Audit queued: ${auditType} check on ${row.tpid}`); }}>Queue Audit</Btn>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {setToast && null}
    </div>
  );
}


// ── RESERVATION PAGE  (order-centric — one row per reservation order)
function ReservationPage({ onTpidClick, onTabChange, lastRefreshed, setLastRefreshed, now, setToast }) {
  const [skuF,    setSkuF]    = useState("");
  const [ordF,    setOrdF]    = useState("");
  const [inqF,    setInqF]    = useState("");
  const [areaF,   setAreaF]   = useState("");
  const [statusF, setStatusF] = useState("");
  const [checked, setChecked] = useState({});
  const [modal,   setModal]   = useState(null);
  const [activeO, setActiveO] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [relReasonCode, setRelCode] = useState(""); const [relNote, setRelNote] = useState(""); const [relErr, setRelE] = useState(false);
  const [pbtVal, setPbtVal]   = useState(""); const [pbtReason, setPbtR] = useState(""); const [pbtErr, setPbtE] = useState({});

  const UC = { Outer:{bg:"#e0f2f1",color:"#00695c",border:"#b2dfdb"}, Inner:{bg:"#fff3e0",color:"#e65c00",border:"#ffe0b2"}, Each:{bg:"#e3f2fd",color:"#1565c0",border:"#bbdefb"} };
  const CH = { ecom:{bg:"#e3f2fd",color:"#1565c0",border:"#bbdefb"}, retail:{bg:"#f3e5f5",color:"#6a1b9a",border:"#ce93d8"}, export:{bg:"#e8f5e9",color:"#2e7d32",border:"#c8e6c9"} };

  // Flatten all reservation orders across all TPIDs
  const ALL = DATA.flatMap(row =>
    row.reserved.map(o => ({ ...o, tpid:row.tpid, rowId:row.rowId, sku:row.sku, name:row.name, area:row.area, uom:row.uom }))
  );

  const filtered = ALL.filter(r => {
    if (areaF   && r.area !== areaF) return false;
    if (statusF && r.status !== statusF) return false;
    if (skuF) { const q = skuF.toLowerCase(); if (!r.sku.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q)) return false; }
    if (ordF) { const q = ordF.toLowerCase(); if (!r.id.toLowerCase().includes(q)) return false; }
    if (inqF) { const q = inqF.toLowerCase(); if (!r.inqLineId?.toLowerCase().includes(q)) return false; }
    return true;
  });

  const totalQty    = filtered.reduce((s,r)=>s+r.qty,0);
  const checkedIds  = Object.keys(checked).filter(k=>checked[k]);
  const allChecked  = filtered.length > 0 && filtered.every(r => !!checked[r.id]);
  const someChecked = filtered.some(r => !!checked[r.id]) && !allChecked;

  function openRel(o)  { setActiveO(o); setRelCode(""); setRelNote(""); setRelE(false); setModal("rel"); }
  function openPbt(o)  { setActiveO(o); setPbtVal(o.pbt ? localDT(o.pbt) : ""); setPbtR(""); setPbtE({}); setModal("pbt"); }
  const REL_REASONS = [
    { code:"pbt_expired",        label:"Pick window expired",        desc:"PBT has passed — reservation is no longer valid for this order" },
    { code:"reallocation",       label:"Reallocate to priority order", desc:"Freeing inventory for a higher-priority order in the queue" },
    { code:"created_in_error",   label:"Created in error",            desc:"Duplicate or incorrectly raised reservation" },
    { code:"inventory_discrepancy", label:"Inventory discrepancy",    desc:"Physical count mismatch — releasing for reconciliation" },
    { code:"audit_required",     label:"Audit required",              desc:"TPID needs physical audit before inventory can be committed" },
    { code:"operational_override", label:"Operational override",      desc:"Manual release for warehouse operational reasons" },
  ];

  function confirmRel() {
    if (!relReasonCode) { setRelE(true); return; }
    const label = REL_REASONS.find(r => r.code === relReasonCode)?.label || relReasonCode;
    if (modal === "bulk") {
      const count = checkedIds.length;
      setModal(null); setChecked({});
      setToast(`${count} reservation${count !== 1 ? "s" : ""} released — ${label}`);
    } else {
      setModal(null);
      setToast(`Released: ${activeO?.inqLineId || activeO?.id} — ${label}`);
    }
  }
  function confirmPbt() {
    const e = {};
    if (!pbtVal) e.pbt = true;
    else if (new Date(pbtVal) < new Date()) e.pbt = true;
    if (!pbtReason.trim()) e.reason = true;
    if (Object.keys(e).length) { setPbtE(e); return; }
    setModal(null); setToast(`PBT updated: ${activeO.inqLineId||activeO.id}`);
  }

  const OVERLAY = { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 };
  const MBOX    = { background:"#fff", borderRadius:8, width:460, maxWidth:"94vw", boxShadow:"0 8px 32px rgba(0,0,0,0.18)" };
  const MHDR    = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 20px", borderBottom:`1px solid ${C.border}` };
  const MFTR    = { display:"flex", justifyContent:"flex-end", gap:8, padding:"12px 20px", borderTop:`1px solid ${C.border}` };
  const XBTN    = { background:"none", border:"none", cursor:"pointer", color:C.hint, padding:2, lineHeight:0 };
  const XSVG    = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;

  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", fontSize:13, background:C.bg, minHeight:"100vh", color:C.text }}>
      <style>{`
        .res-row:hover{background:#f8f9fb!important;cursor:default}
        .act-btn:hover{background:#f4f5f7!important}
        .act-btn-danger:hover{background:#ffebee!important}
      `}</style>

      {/* header */}
      <div style={{ background:C.navy, display:"flex", alignItems:"center", padding:"0 20px", height:52, gap:16, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:"#fff", borderRadius:6, padding:"4px 8px", display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>GO</span></div>
            <span style={{ fontSize:13, fontWeight:700, color:C.orange }}>GreyOrange</span>
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <div><div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Manager Dashboard</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.45)" }}>Version 7.8.0.2</div></div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#4fc3f7" }}>EssilorLuxottica</span>
          <span style={{ fontSize:9, background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", padding:"1px 5px", borderRadius:3, border:"1px solid rgba(255,255,255,0.15)" }}>ATL</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => navigate("/")} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:5, color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>
            ← All Prototypes
          </button>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>US/Eastern</span>
        </div>
      </div>
      <div style={{ background:C.navy, borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", padding:"0 20px" }}>
        {["Analytics","Outbound","Inbound","Audit","Process Exceptions","Inventory","System","Users","Reports","Notification"].map(n=>(
          <div key={n} style={{ padding:"10px 18px", fontSize:12, fontWeight:600, letterSpacing:"0.04em", color:n==="Inventory"?"#fff":"rgba(255,255,255,0.55)", cursor:"pointer", borderBottom:n==="Inventory"?"3px solid #e65c00":"3px solid transparent", whiteSpace:"nowrap", textTransform:"uppercase" }}>{n}</div>
        ))}
      </div>
      <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, display:"flex", padding:"0 20px" }}>
        {[["Inventory Listing",false],["Bin Overview",false],["SKU Master",false],["Inventory Reservation",true],["Audit Log",false],["Damaged Stock",false]].map(([t,active])=>(
          <div key={t} onClick={()=>t==="Inventory Listing"&&onTabChange("listing")} style={{ padding:"10px 20px", fontSize:13, color:active?C.orange:C.muted, cursor:"pointer", borderBottom:active?`2px solid ${C.orange}`:"2px solid transparent", fontWeight:active?600:400, whiteSpace:"nowrap" }}>{t}</div>
        ))}
      </div>

      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>

        {/* bulk bar */}
        {checkedIds.length > 0 && (
          <div style={{ background:"#1a2340", borderRadius:6, padding:"9px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:12, color:"#fff" }}>{checkedIds.length} selected</span>
            <button onClick={()=>{ setModal("bulk"); setRelCode(""); setRelNote(""); setRelE(false); }} style={{ padding:"5px 14px", borderRadius:4, border:"1px solid #ef9a9a", background:"#c62828", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Release selected</button>
            <button onClick={()=>setChecked({})} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:12, cursor:"pointer", fontFamily:"inherit", marginLeft:"auto" }}>Clear selection</button>
          </div>
        )}

        {/* summary */}
        <div style={{ display:"flex", alignItems:"center", background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"9px 16px", flexWrap:"wrap", gap:4 }}>
          <span style={{ fontSize:13, fontWeight:600 }}>Inventory Reservation</span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          <span style={{ fontSize:13, color:C.muted }}>Showing: <strong style={{ color:C.text }}>{filtered.length} of {ALL.length}</strong></span>
          <span style={{ color:"#c0c5d0", margin:"0 8px" }}>|</span>
          {/* qty breakdown by reservation status */}
          {[
            { key:"created",    label:"Reserved for Picking", bg:"#e3f2fd", color:"#1565c0", border:"#bbdefb" },
            { key:"inprogress", label:"Picking",              bg:"#fff3e0", color:"#e65c00", border:"#ffe0b2" },
            { key:"completed",  label:"Released",             bg:"#f1f3f4", color:"#5a6270", border:"#d0d5df" },
          ].map(s => {
            const qty = filtered.filter(r => r.status === s.key).reduce((a, r) => a + r.qty, 0);
            return qty > 0 ? (
              <span key={s.key} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, padding:"2px 10px", borderRadius:4, background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontWeight:600 }}>
                {s.label}: <strong>{qty.toLocaleString()}</strong>
              </span>
            ) : null;
          })}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
            {lastRefreshed && (
              <span style={{ fontSize:11, color:C.hint }}>
                Last refreshed: <strong style={{ color:C.muted }}>{lastRefreshed.toLocaleTimeString("en-US",{ hour:"2-digit", minute:"2-digit", second:"2-digit", timeZone:"America/New_York" })} ET</strong>
              </span>
            )}
            <button onClick={()=>{ setLastRefreshed(new Date()); }} style={{ display:"flex", alignItems:"center", gap:5, background:"none", border:`1px solid ${C.border}`, borderRadius:4, padding:"4px 10px", fontSize:12, color:C.muted, cursor:"pointer", fontFamily:"inherit" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              Refresh
            </button>
          </div>
        </div>

        {/* filters */}
        <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          {[["SKU / Product","skuF",skuF,setSkuF,"e.g. SKU-9021"],["Order ID","ordF",ordF,setOrdF,"e.g. ORD-10041"],["Reservation ID","inqF",inqF,setInqF,"e.g. IQL-00021"]].map(([label,,val,setter,ph])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:7, border:`1px solid ${val?C.orange:C.border}`, borderRadius:4, padding:"5px 10px", background:val?"#fff5f0":"#fff", minWidth:160 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={{ border:"none", outline:"none", background:"none", fontSize:12, fontFamily:"inherit", color:C.text, width:"100%" }} />
            </div>
          ))}
          <div style={{ width:1, height:20, background:C.border }} />
          <select value={areaF} onChange={e=>setAreaF(e.target.value)} style={{ border:`1px solid ${areaF?C.orange:C.border}`, borderRadius:4, padding:"5px 10px", fontSize:12, fontFamily:"inherit", color:areaF?C.orange:C.muted, background:areaF?"#fff5f0":"#fff", cursor:"pointer", outline:"none" }}>
            <option value="">All Areas</option><option value="forward">Forward</option><option value="reserve">Reserve</option>
          </select>
          <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{ border:`1px solid ${statusF?C.orange:C.border}`, borderRadius:4, padding:"5px 10px", fontSize:12, fontFamily:"inherit", color:statusF?C.orange:C.muted, background:statusF?"#fff5f0":"#fff", cursor:"pointer", outline:"none" }}>
            <option value="">All Statuses</option><option value="created">Reserved for Picking</option><option value="inprogress">Picking</option><option value="completed">Reservation Released</option>
          </select>
          <button onClick={()=>{setSkuF("");setOrdF("");setInqF("");setAreaF("");setStatusF("");}} style={{ marginLeft:"auto", background:"none", border:"none", fontSize:12, color:C.hint, cursor:"pointer", fontFamily:"inherit" }}>Clear all</button>
        </div>

        {/* table */}
        <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8f9fb", borderBottom:`1px solid ${C.border}` }}>
                  <th style={{ width:36, padding:"10px 12px" }}>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={el => { if (el) el.indeterminate = someChecked; }}
                      onChange={() => {
                        if (allChecked) { setChecked({}); }
                        else { const m = {}; filtered.forEach(r => { m[r.id] = true; }); setChecked(m); }
                      }}
                      style={{ cursor:"pointer" }}
                    />
                  </th>
                  {[["Reservation ID",130],["Order ID",110],["Order Attributes",140],["SKU",160],["TPID",145],["Area",85],["UoM",70],["PBT",130],["Priority",80],["Res. Status",115],["Qty",70],["Actions",48]].map(([lbl,w])=>(
                    <th key={lbl} style={{ minWidth:w, padding:"10px 12px", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", textAlign:["Qty"].includes(lbl)?"right":"left", whiteSpace:"nowrap" }}>{lbl}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r=>{
                  const pbt = fmtPBT(r.pbt);
                  const uc  = UC[r.uom]||UC.Outer;
                  const cc  = CH[r.channel]||{bg:"#f1f3f4",color:"#5a6270",border:"#d0d5df"};
                  return (
                    <tr key={`${r.id}-${r.tpid}`} className="res-row" style={{ borderBottom:`1px solid #f0f1f4` }}>
                      <td style={{ padding:"8px 12px", textAlign:"center" }}>
                        <input type="checkbox" checked={!!checked[r.id]} onChange={e => setChecked(c => ({ ...c, [r.id]: e.target.checked }))} style={{ cursor:"pointer" }} />
                      </td>
                      <td style={{ padding:"8px 12px", fontFamily:"'Courier New',monospace", fontSize:11, color:"#8a93a8" }}>{r.inqLineId}</td>
                      <td style={{ padding:"8px 12px" }}>
                        <a href="#" onClick={e=>{e.preventDefault();setToast(`→ Order Details: ${r.id}`)}} style={{ fontFamily:"'Courier New',monospace", fontSize:12, fontWeight:600, color:C.blue, textDecoration:"underline", textDecorationStyle:"dotted" }}>{r.id}</a>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          <TypeBadge type={r.type} />
                          <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px", borderRadius:3, background:cc.bg, color:cc.color, border:`1px solid ${cc.border}` }}>{r.channel}</span>
                        </div>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ fontFamily:"'Courier New',monospace", fontSize:11, fontWeight:700 }}>{r.sku}</div>
                        <div style={{ fontSize:10, color:C.hint, marginTop:1 }}>{r.name}</div>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <button onClick={()=>onTpidClick(r.rowId)} style={{ fontFamily:"'Courier New',monospace", fontSize:11, fontWeight:700, color:"#00695c", background:"#e0f2f1", border:"1px solid #b2dfdb", borderRadius:3, padding:"2px 7px", cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted" }}>{r.tpid}</button>
                      </td>
                      <td style={{ padding:"8px 12px" }}><AreaBadge area={r.area} /></td>
                      <td style={{ padding:"8px 12px" }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:"1px 7px", borderRadius:3, background:uc.bg, color:uc.color, border:`1px solid ${uc.border}` }}>{r.uom||"Outer"}</span>
                      </td>
                      <td style={{ padding:"8px 12px" }}>
                        <div style={{ fontSize:12, fontWeight:500 }}>{pbt.abs} ET</div>
                        <div style={{ fontSize:11, marginTop:1, color:pbt.cls==="red"?C.red:pbt.cls==="amber"?C.orange:C.green }}>{pbt.rel}</div>
                      </td>
                      <td style={{ padding:"8px 12px" }}><PriBadge pri={r.pri} /></td>
                      <td style={{ padding:"8px 12px" }}><StatusBadge status={r.status} /></td>
                      <td style={{ padding:"8px 12px", textAlign:"right", fontSize:13, fontWeight:600, color:C.text }}>{r.qty.toLocaleString()}</td>
                      <td style={{ padding:"8px 12px", position:"relative" }} onClick={e=>e.stopPropagation()}>
                        <button
                          onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                          style={{ width:28, height:28, borderRadius:4, border:`1px solid ${C.border}`, background:openMenu===r.id?"#f4f5f7":"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, fontFamily:"inherit", fontSize:16, lineHeight:1 }}
                          title="Actions"
                        >⋮</button>
                        {openMenu === r.id && (
                          <div style={{ position:"absolute", right:6, top:38, zIndex:80, background:"#fff", border:`1px solid ${C.border}`, borderRadius:6, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", minWidth:168, overflow:"hidden" }}>
                            <button onClick={()=>{ setOpenMenu(null); setToast(`History: ${r.inqLineId}`); }} style={{ width:"100%", padding:"9px 14px", display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.text, fontFamily:"inherit", textAlign:"left" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#f8f9fb"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              View History
                            </button>
                            <div style={{ height:1, background:C.border, margin:"0 10px" }} />
                            <button onClick={()=>{ setOpenMenu(null); openPbt(r); }} style={{ width:"100%", padding:"9px 14px", display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.text, fontFamily:"inherit", textAlign:"left" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#f8f9fb"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              Edit PBT
                            </button>
                            <div style={{ height:1, background:C.border, margin:"0 10px" }} />
                            <button onClick={()=>{ setOpenMenu(null); openRel(r); }} style={{ width:"100%", padding:"9px 14px", display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.red, fontFamily:"inherit", textAlign:"left" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#fff5f5"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                              Release Reservation
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.border}`, fontSize:12, color:C.muted }}>
            {filtered.length} reservations
          </div>
        </div>
      </div>

      {/* Release modal */}
      {(modal==="rel"||modal==="bulk") && (
        <div style={OVERLAY}>
          <div style={MBOX}>
            <div style={MHDR}><span style={{ fontSize:15, fontWeight:700 }}>{modal==="bulk"?`Release ${checkedIds.length} reservations`:`Release Reservation`}</span><button style={XBTN} onClick={()=>setModal(null)}>{XSVG}</button></div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", gap:8, background:"#ffebee", border:"1px solid #ef9a9a", borderRadius:5, padding:"9px 12px", fontSize:12, color:"#c62828" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {modal==="bulk" ? `Releasing ${checkedIds.length} reservations. Inventory will return to free pool immediately.` : `Releasing ${activeO?.inqLineId}. Inventory will return to free pool immediately.`}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:8 }}>Reason for release <span style={{ color:C.red }}>*</span></div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {REL_REASONS.map(r => (
                    <label key={r.code} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 12px", borderRadius:5, border:`1px solid ${relReasonCode===r.code?C.red:"#e0e3ea"}`, background:relReasonCode===r.code?"#fff5f5":"#fff", cursor:"pointer", transition:"all 0.12s" }}>
                      <input type="radio" name="relReason" value={r.code} checked={relReasonCode===r.code} onChange={()=>{ setRelCode(r.code); setRelE(false); }} style={{ marginTop:2, accentColor:C.red, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.label}</div>
                        <div style={{ fontSize:11, color:C.hint, marginTop:1 }}>{r.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {relErr && !relReasonCode && <div style={{ fontSize:11, color:C.red, marginTop:6 }}>Select a reason to continue.</div>}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Additional note <span style={{ fontSize:11, fontWeight:400 }}>(optional)</span></div>
                <input value={relNote} onChange={e=>setRelNote(e.target.value)} placeholder="Any extra context for the audit trail…" style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
              </div>
            </div>
            <div style={MFTR}><Btn onClick={()=>setModal(null)}>Cancel</Btn><Btn variant="danger" onClick={confirmRel}>Confirm Release</Btn></div>
          </div>
        </div>
      )}

      {/* Edit PBT modal */}
      {modal==="pbt" && (
        <div style={OVERLAY}>
          <div style={MBOX}>
            <div style={MHDR}><span style={{ fontSize:15, fontWeight:700 }}>Edit Pick-Before Time</span><button style={XBTN} onClick={()=>setModal(null)}>{XSVG}</button></div>
            <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#f8f9fb", border:`1px solid ${C.border}`, borderRadius:5, padding:"9px 12px", display:"flex", gap:20 }}>
                {[["Reservation ID", activeO?.inqLineId],["Order ID", activeO?.id],["TPID", activeO?.tpid]].map(([k,v])=>(
                  <div key={k}><div style={{ fontSize:11, color:C.hint, marginBottom:2 }}>{k}</div><div style={{ fontSize:12, fontWeight:700, fontFamily:"'Courier New',monospace" }}>{v}</div></div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>New PBT <span style={{ color:C.red }}>*</span></div>
                <input type="datetime-local" value={pbtVal} onChange={e=>{setPbtVal(e.target.value);setPbtE({});}} style={{ width:"100%", border:`1px solid ${pbtErr.pbt?C.red:C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
                {pbtErr.pbt&&<div style={{ fontSize:11, color:C.red, marginTop:3 }}>Enter a valid future datetime.</div>}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.muted, marginBottom:5 }}>Reason <span style={{ color:C.red }}>*</span></div>
                <textarea value={pbtReason} onChange={e=>{setPbtR(e.target.value);setPbtE({});}} placeholder="e.g. Carrier delay — extending pick window" rows={3} style={{ width:"100%", border:`1px solid ${pbtErr.reason?C.red:C.border}`, borderRadius:5, padding:"8px 10px", fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box" }} />
                {pbtErr.reason&&<div style={{ fontSize:11, color:C.red, marginTop:3 }}>Reason is required.</div>}
              </div>
            </div>
            <div style={MFTR}><Btn onClick={()=>setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={confirmPbt}>Update PBT</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN
export default function InventoryReservationApp() {
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState({});
  const [skuF, setSkuF] = useState("");
  const [ordF, setOrdF] = useState("");
  const [areaF, setAreaF] = useState("");
  const [resF, setResF] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [tpidDetail, setTpidDetail] = useState(null);
  const [currentView, setCurrentView] = useState("listing"); // "listing" | "reservation"
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [inqF, setInqF] = useState("");

  // release modal state
  const [relSel, setRelSel] = useState(null);
  const [relAll, setRelAll] = useState(false);
  const [relReason, setRelReason] = useState("");
  const [relErr, setRelErr] = useState(false);

  // pbt modal state
  const [pbtVal, setPbtVal] = useState("");
  const [pbtReason, setPbtReason] = useState("");
  const [pbtErr, setPbtErr] = useState({});

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(null), 3200); return () => clearTimeout(id); }}, [toast]);

  // ── TPID detail route — back always goes to Inventory Listing
  if (tpidDetail !== null) {
    const row = DATA.find(r => r.rowId === tpidDetail);
    return (
      <div>
        <TpidDetailPage row={row} onBack={() => { setTpidDetail(null); setCurrentView("listing"); }} onNavReservation={() => { setTpidDetail(null); setCurrentView("reservation"); }} now={now} setToast={setToast} />
        {toast && (
          <div style={{ position:"fixed", top:16, right:20, zIndex:400, background:"#fff", border:"1px solid #e0e3ea", borderRadius:6, padding:"11px 16px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#1a2340", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#2e7d32", flexShrink:0 }} />{toast}
          </div>
        )}
      </div>
    );
  }

  // ── Inventory Listing route (default)
  if (currentView === "listing") {
    return (
      <div>
        <InventoryListingPage
          onTpidClick={id => setTpidDetail(id)}
          onTabChange={view => setCurrentView(view)}
          now={now}
          setToast={setToast}
        />
        {toast && (
          <div style={{ position:"fixed", top:16, right:20, zIndex:400, background:"#fff", border:"1px solid #e0e3ea", borderRadius:6, padding:"11px 16px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#1a2340", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#2e7d32", flexShrink:0 }} />{toast}
          </div>
        )}
      </div>
    );
  }
  // ── Inventory Reservation route
  if (currentView === "reservation") {
    return (
      <div>
        <ReservationPage
          onTpidClick={id => { setTpidDetail(id); }}
          onTabChange={view => setCurrentView(view)}
          lastRefreshed={lastRefreshed}
          setLastRefreshed={setLastRefreshed}
          now={now}
          setToast={setToast}
        />
        {toast && (
          <div style={{ position:"fixed", top:16, right:20, zIndex:400, background:"#fff", border:"1px solid #e0e3ea", borderRadius:6, padding:"11px 16px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#1a2340", boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#2e7d32", flexShrink:0 }} />{toast}
          </div>
        )}
      </div>
    );
  }

  return null;
}

function rQtyFor(row) { return row.reserved.reduce((a,o)=>a+o.qty,0); }
