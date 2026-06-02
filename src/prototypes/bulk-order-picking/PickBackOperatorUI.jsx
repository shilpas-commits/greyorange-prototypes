import { useState } from "react";

const C = {
  navy:      "#1a2340",
  navyLight: "#243058",
  orange:    "#e65c00",
  border:    "#d0d5df",
  muted:     "#6b7280",
  bg:        "#f0f2f5",
  green:     "#2e7d32",
  greenBg:   "#e8f5e9",
  greenBdr:  "#a5d6a7",
  red:       "#c62828",
  redBg:     "#ffebee",
  redBdr:    "#ef9a9a",
  amber:     "#e65100",
  amberBg:   "#fff3e0",
  amberBdr:  "#ffcc80",
  blue:      "#1565c0",
  blueBg:    "#e3f2fd",
  blueBdr:   "#bbdefb",
  white:     "#ffffff",
  surface:   "#ffffff",
};

const ROLLCAGE = {
  id: "RC-ATL-00413",
  type: "Rollcage-B",
  order: "ORD-SAP-7821",
  flowType: "REPLEN-Delivery (TC)",
  station: "STN-04",
  dockPoint: "D4-03",
  totalPositions: 6,
  positions: [
    { pos: 1, level: "L1 (Bottom)", requiredType: "Tote-Standard", barcode: "TT-10042", status: "PENDING" },
    { pos: 2, level: "L1 (Bottom)", requiredType: "Tote-Standard", barcode: "TT-10043", status: "PENDING" },
    { pos: 3, level: "L2 (Mid)",    requiredType: "Tote-Standard", barcode: "TT-10044", status: "PENDING" },
    { pos: 4, level: "L2 (Mid)",    requiredType: "Tote-Standard", barcode: "TT-10045", status: "PENDING" },
    { pos: 5, level: "L3 (Top)",    requiredType: "Tote-Standard", barcode: "TT-10046", status: "PENDING" },
    { pos: 6, level: "L3 (Top)",    requiredType: "Tote-Standard", barcode: "TT-10047", status: "PENDING" },
  ],
};

const STATUS_META = {
  CONFIRMED: { label: "ACTIVE",   bg: "#e8f5e9",  color: "#2e7d32", border: "#a5d6a7", icon: "\u2713" },
  PENDING:   { label: "PENDING",  bg: "#f9fafb",  color: "#6b7280", border: "#d0d5df", icon: "\u25cb" },
  ACTIVE:    { label: "SCANNING", bg: "#fff3e0",  color: "#e65100", border: "#ffcc80", icon: "\u25b6" },
  ERROR:     { label: "ERROR",    bg: "#ffebee",  color: "#c62828", border: "#ef9a9a", icon: "\u2717" },
};

function AIOShell({ children }) {
  return (
    <div style={{
      width: 880, background: C.bg, borderRadius: 12,
      overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: "0 8px 32px rgba(0,0,0,0.16)", border: `1px solid ${C.border}`,
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ background: C.navy, height: 44, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>GO</span></div>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>GreyMatter AIO</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 20 }}>|</span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Pick-Back Operator \u00b7 STN-04 D4-03</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>Operator: PB-11</span>
          <div style={{ background: C.green, borderRadius: 4, padding: "2px 8px" }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>\u25cf ACTIVE</span></div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>09:48</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 10, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: highlight ? 700 : 600, color: highlight ? C.orange : C.navy }}>{value}</span>
    </div>
  );
}

function ScreenActivating({ onStart }) {
  return (
    <AIOShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 32, gap: 32 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", border: `2px solid ${C.orange}`, width: 300, textAlign: "center", boxShadow: "0 4px 20px rgba(230,92,0,0.12)" }}>
          <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1.5, marginBottom: 6 }}>ROLLCAGE DOCKED</div>
          <div style={{ color: C.orange, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{ROLLCAGE.id}</div>
          <div style={{ color: C.navy, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{ROLLCAGE.type}</div>
          <InfoRow label="Order" value={ROLLCAGE.order} />
          <InfoRow label="Flow" value={ROLLCAGE.flowType} />
          <InfoRow label="Station" value={`${ROLLCAGE.station} \u00b7 ${ROLLCAGE.dockPoint}`} />
          <InfoRow label="Positions" value={`${ROLLCAGE.totalPositions} to associate`} highlight />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Carrying unit association required</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>This rollcage requires <strong>Tote-Standard</strong> in all 6 positions before picking can begin.<br /><br />You will be guided through each position one at a time.<br />Scan the carrying unit barcode at each position to confirm.</div>
          </div>
          <div style={{ background: "#e3f2fd", borderRadius: 8, padding: "12px 16px", border: "1px solid #bbdefb", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16 }}>\u2139\ufe0f</span>
            <div style={{ fontSize: 11, color: C.blue, lineHeight: 1.6 }}><strong>Front-seat operator is picking on D4-02.</strong><br />Your association runs in parallel \u2014 they will not wait for you. Each confirmed bin activates immediately for picking.</div>
          </div>
          <button onClick={onStart} style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: C.orange, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>START ASSOCIATION \u2192</button>
        </div>
      </div>
    </AIOShell>
  );
}

function ScreenAssociation({ positions, activePos, onConfirm, onError }) {
  const active = positions[activePos];
  const confirmed = positions.filter(p => p.status === "CONFIRMED").length;
  return (
    <AIOShell>
      <div style={{ display: "flex", height: "calc(100% - 44px)" }}>
        <div style={{ width: 260, background: C.navy, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: 1.5 }}>ROLLCAGE POSITIONS</div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{ROLLCAGE.id}</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {positions.map((p, i) => {
              const isActive = i === activePos;
              const meta = STATUS_META[p.status] || STATUS_META.PENDING;
              return (
                <div key={i} style={{ background: isActive ? C.orange : p.status === "CONFIRMED" ? "rgba(46,125,50,0.25)" : "rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 10px", border: `1.5px solid ${isActive ? C.orange : p.status === "CONFIRMED" ? "rgba(46,125,50,0.4)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: isActive ? "#fff" : p.status === "CONFIRMED" ? "#81c784" : "rgba(255,255,255,0.35)" }}>{meta.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : p.status === "CONFIRMED" ? "#a5d6a7" : "rgba(255,255,255,0.55)" }}>Position {p.pos} \u00b7 {p.level}</div>
                    {p.status === "CONFIRMED" && <div style={{ fontSize: 9, color: "rgba(129,199,132,0.8)" }}>{p.barcode}</div>}
                  </div>
                  {isActive && <div style={{ background: "#fff", borderRadius: 3, padding: "1px 5px" }}><span style={{ fontSize: 9, fontWeight: 700, color: C.orange }}>NOW</span></div>}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Progress</span><span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{confirmed}/{ROLLCAGE.totalPositions}</span></div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}><div style={{ height: 6, borderRadius: 3, background: C.orange, width: `${(confirmed / ROLLCAGE.totalPositions) * 100}%`, transition: "width 0.4s ease" }} /></div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {active ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: C.orange, borderRadius: 8, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{active.pos}</span></div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Position {active.pos} of {ROLLCAGE.totalPositions}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{active.level} \u00b7 {ROLLCAGE.dockPoint}</div>
                </div>
                <div style={{ marginLeft: "auto" }}><div style={{ background: "#fff3e0", border: "1px solid #ffcc80", borderRadius: 6, padding: "4px 12px" }}><span style={{ fontSize: 11, fontWeight: 700, color: C.amber }}>WAITING FOR SCAN</span></div></div>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, padding: "20px 20px", border: `2px solid ${C.orange}`, display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ width: 80, height: 80, background: C.navyLight, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 32 }}>\ud83d\udce6</span>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>TOTE</span>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 4 }}>REQUIRED CARRYING UNIT</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{active.requiredType}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Scan the barcode on the carrying unit to confirm placement</div>
                </div>
              </div>
              <div style={{ background: C.navy, borderRadius: 10, padding: "20px", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>SCAN CARRYING UNIT BARCODE</div>
                <div style={{ border: "2px dashed rgba(230,92,0,0.5)", borderRadius: 10, padding: "20px", margin: "0 auto", maxWidth: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "rgba(230,92,0,0.05)" }}>
                  <span style={{ fontSize: 36 }}>\u25a6</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Expected: {active.barcode}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                <button onClick={() => onConfirm(activePos)} style={{ flex: 2, padding: "14px", borderRadius: 8, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>\u2713 SIMULATE: CORRECT SCAN \u2192 CONFIRM POSITION {active.pos}</button>
                <button onClick={() => onError(activePos)} style={{ flex: 1, padding: "14px", borderRadius: 8, border: `1.5px solid ${C.red}`, background: "#fff", color: C.red, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>\u2717 WRONG TYPE</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ background: "#e8f5e9", border: "2px solid #2e7d32", borderRadius: 12, padding: "32px", display: "inline-block", minWidth: 360 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>\u2713</div>
                <div style={{ color: C.green, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>ALL POSITIONS CONFIRMED</div>
                <div style={{ color: C.green, fontSize: 12, opacity: 0.8, marginBottom: 16 }}>{ROLLCAGE.id} \u00b7 {ROLLCAGE.totalPositions} of {ROLLCAGE.totalPositions} active</div>
                <div style={{ fontSize: 12, color: C.muted }}>All bins are now live for picking.<br />Your task for this rollcage is complete.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AIOShell>
  );
}

function ScreenError({ position, onRetry }) {
  return (
    <AIOShell>
      <div style={{ padding: "32px 32px", display: "flex", gap: 28, alignItems: "flex-start" }}>
        <div style={{ background: "#ffebee", border: "2px solid #c62828", borderRadius: 12, padding: "28px 24px", width: 340, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>\u2717</div>
          <div style={{ color: C.red, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>WRONG CARRYING UNIT TYPE</div>
          <div style={{ color: C.red, fontSize: 12, opacity: 0.8, marginBottom: 20 }}>Position {position?.pos} \u00b7 {position?.level}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1px solid #ef9a9a", textAlign: "left" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>YOU SCANNED</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>Tote-Large</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1px solid #a5d6a7", textAlign: "left" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>REQUIRED</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{position?.requiredType}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: "#fff", borderRadius: 10, padding: "20px 22px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Resolution steps</div>
            {["Remove the scanned carrying unit from the position", `Fetch a ${position?.requiredType} from the carrying unit buffer`, "Place the correct unit in Position " + position?.pos, "Scan the new carrying unit to confirm"].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{i + 1}</span></div>
                <span style={{ fontSize: 12, color: C.navy, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff3e0", borderRadius: 8, padding: "10px 14px", border: "1px solid #ffcc80", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 14 }}>\u26a0\ufe0f</span>
            <span style={{ fontSize: 11, color: C.amber, lineHeight: 1.5 }}><strong>Position {position?.pos} is blocked.</strong> Other positions are unaffected. Front-seat operator continues picking from confirmed bins.</span>
          </div>
          <button onClick={onRetry} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: C.orange, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>SCAN REPLACEMENT UNIT \u2192</button>
        </div>
      </div>
    </AIOShell>
  );
}

export default function PickBackOperatorUI() {
  const [screen, setScreen] = useState("activating");
  const [positions, setPositions] = useState(ROLLCAGE.positions.map(p => ({ ...p })));
  const [activePos, setActivePos] = useState(0);
  const [errorPos, setErrorPos] = useState(null);

  const handleConfirm = (idx) => {
    const updated = positions.map((p, i) => i === idx ? { ...p, status: "CONFIRMED" } : p);
    setPositions(updated);
    const nextIdx = updated.findIndex((p, i) => i > idx && p.status !== "CONFIRMED");
    setActivePos(nextIdx === -1 ? updated.length : nextIdx);
    setScreen("association");
  };
  const handleError = (idx) => { setErrorPos(positions[idx]); setScreen("error"); };
  const handleRetry = () => { setScreen("association"); setErrorPos(null); };

  const confirmedCount = positions.filter(p => p.status === "CONFIRMED").length;
  const SCREENS = { activating: "Screen 1 \u2014 Rollcage Docked, Flow Activating", association: activePos < positions.length ? "Screen 2 \u2014 Guided Association" : "Screen 3 \u2014 All Confirmed", error: "Screen 4 \u2014 Wrong Type Error" };

  return (
    <div style={{ minHeight: "100vh", background: "#dde1e9", fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", background: C.navy, padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#fff", borderRadius: 5, padding: "4px 8px", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>GO</span></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>GreyOrange</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>|</span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Pick-Back Operator UI</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: "auto" }}>Epic 5 \u2014 Carrying Unit Association \u00b7 EL ATL</span>
      </div>
      <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: 0.5, textTransform: "uppercase", padding: "4px 16px", background: "#fff3e0", borderRadius: 20, border: "1px solid #ffcc80" }}>{SCREENS[screen]}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{key:"activating",label:"1. Activate"},{key:"association",label:`2. Associate (${confirmedCount}/${ROLLCAGE.totalPositions})`},{key:"error",label:"3. Error flow"}].map(s => (
          <button key={s.key} onClick={() => { setScreen(s.key); if (s.key === "association") setErrorPos(null); }} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: screen === s.key ? C.orange : C.navy, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{s.label}</button>
        ))}
      </div>
      <div style={{ padding: "0 32px 48px" }}>
        {screen === "activating" && <ScreenActivating onStart={() => setScreen("association")} />}
        {screen === "association" && <ScreenAssociation positions={positions} activePos={activePos} onConfirm={handleConfirm} onError={handleError} />}
        {screen === "error" && <ScreenError position={errorPos || ROLLCAGE.positions[0]} onRetry={handleRetry} />}
      </div>
    </div>
  );
}
