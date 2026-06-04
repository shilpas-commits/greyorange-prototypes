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

function AIOHeader() {
  return (
    <div style={{ background: C.navy, padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>GO</span>
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>GreyMatter AIO</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Pick-Back · STN-04 D4-03 · PB-11</div>
      </div>
      <div style={{ marginLeft: "auto", background: C.green, borderRadius: 4, padding: "3px 10px" }}>
        <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>● ACTIVE</span>
      </div>
    </div>
  );
}

// ── Screen 1: Rollcage docked overview
function ScreenActivating({ onStart }) {
  return (
    <div style={{ minHeight: "100%", background: C.bg, display: "flex", flexDirection: "column" }}>
      <AIOHeader />
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "16px 20px" }}>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Rollcage Docked</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.orange, fontFamily: "'Courier New', monospace" }}>{ROLLCAGE.id}</div>
        <div style={{ fontSize: 13, color: C.navy, fontWeight: 600, marginBottom: 10 }}>{ROLLCAGE.type} · {ROLLCAGE.flowType}</div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.muted }}>
          <span>Order <strong style={{ color: C.navy }}>{ROLLCAGE.order}</strong></span>
          <span>Station <strong style={{ color: C.navy }}>{ROLLCAGE.station} · {ROLLCAGE.dockPoint}</strong></span>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: "14px 16px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Carrying unit association required</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
            Scan <strong style={{ color: C.navy }}>Tote-Standard</strong> into all {ROLLCAGE.totalPositions} positions before picking begins. You will be guided one position at a time.
          </div>
        </div>
        <div style={{ background: C.blueBg, borderRadius: 8, padding: "12px 16px", border: `1px solid ${C.blueBdr}`, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <div style={{ fontSize: 12, color: C.blue, lineHeight: 1.6 }}>
            <strong>Front-seat operator is already picking on D4-02.</strong><br />
            Each bin you confirm activates immediately — they will not wait for you.
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {ROLLCAGE.totalPositions} positions to associate
          </div>
          <div style={{ display: "flex" }}>
            {ROLLCAGE.positions.map((p, i) => (
              <div key={i} style={{ flex: 1, padding: "10px 0", textAlign: "center", borderRight: i < ROLLCAGE.positions.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "#f0f2f5", border: `1px solid ${C.border}`, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>{p.pos}</span>
                </div>
                <div style={{ fontSize: 9, color: C.muted }}>{p.level.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px", background: "#fff", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button onClick={onStart} style={{ width: "100%", padding: "15px", borderRadius: 8, border: "none", background: C.orange, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          START ASSOCIATION →
        </button>
      </div>
    </div>
  );
}

// ── Screen 2: One position at a time — focused scan flow
function ScreenAssociation({ positions, activePos, onConfirm, onError }) {
  const active = positions[activePos];
  const confirmed = positions.filter(p => p.status === "CONFIRMED").length;

  if (activePos >= positions.length) {
    return (
      <div style={{ minHeight: "100%", background: C.bg, display: "flex", flexDirection: "column" }}>
        <AIOHeader />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
          <div style={{ background: C.greenBg, border: `2px solid ${C.green}`, borderRadius: 16, padding: "36px 28px", textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✓</div>
            <div style={{ color: C.green, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>All Positions Confirmed</div>
            <div style={{ color: C.green, fontSize: 12, opacity: 0.8, marginBottom: 16 }}>{ROLLCAGE.id} · {ROLLCAGE.totalPositions}/{ROLLCAGE.totalPositions} active</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>All bins are now live for picking.<br />Your task for this rollcage is complete.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100%", background: C.bg, display: "flex", flexDirection: "column" }}>
      <AIOHeader />

      {/* Progress */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "12px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Position {active.pos} of {ROLLCAGE.totalPositions}</span>
          <span style={{ fontSize: 11, color: C.muted }}>{confirmed} confirmed</span>
        </div>
        <div style={{ height: 6, background: "#e8eaf0", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 3, background: C.orange, width: `${(confirmed / ROLLCAGE.totalPositions) * 100}%`, transition: "width 0.3s ease" }} />
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {positions.map((p, i) => (
            <div key={i} style={{
              width: 30, height: 30, borderRadius: 6,
              background: p.status === "CONFIRMED" ? C.green : i === activePos ? C.orange : "#e8eaf0",
              border: `2px solid ${p.status === "CONFIRMED" ? C.green : i === activePos ? C.orange : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: (p.status === "CONFIRMED" || i === activePos) ? "#fff" : C.muted }}>
                {p.status === "CONFIRMED" ? "✓" : p.pos}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Position + unit card */}
        <div style={{ background: "#fff", borderRadius: 10, border: `2px solid ${C.orange}`, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{active.pos}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{active.level}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Dock point {ROLLCAGE.dockPoint}</div>
            </div>
            <div style={{ marginLeft: "auto", background: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: 5, padding: "3px 10px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.amber }}>SCAN REQUIRED</span>
            </div>
          </div>
          <div style={{ background: "#f8f9fb", borderRadius: 6, padding: "10px 12px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>📦</span>
            <div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Required carrying unit</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{active.requiredType}</div>
            </div>
          </div>
        </div>

        {/* Scan zone */}
        <div style={{ background: C.navy, borderRadius: 12, padding: "20px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Scan barcode on carrying unit</div>
          <div style={{ width: 150, height: 150, border: "2px dashed rgba(230,92,0,0.6)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(230,92,0,0.04)" }}>
            <span style={{ fontSize: 44, color: "rgba(255,255,255,0.6)" }}>▦</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Place barcode in frame</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Expected: <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Courier New', monospace" }}>{active.barcode}</span></div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "12px 20px 20px", background: "#fff", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={() => onError(activePos)} style={{ flex: 1, padding: "13px", borderRadius: 8, border: `1.5px solid ${C.red}`, background: "#fff", color: C.red, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✗ Wrong Type</button>
        <button onClick={() => onConfirm(activePos)} style={{ flex: 2, padding: "13px", borderRadius: 8, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Confirm Position {active.pos}</button>
      </div>
    </div>
  );
}

// ── Screen 3: Wrong type error
function ScreenError({ position, onRetry }) {
  return (
    <div style={{ minHeight: "100%", background: C.bg, display: "flex", flexDirection: "column" }}>
      <AIOHeader />
      <div style={{ background: C.redBg, borderBottom: `2px solid ${C.red}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>✗</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.red }}>Wrong Carrying Unit Type</div>
          <div style={{ fontSize: 11, color: C.red, opacity: 0.8 }}>Position {position?.pos} · {position?.level}</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "14px 16px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>You scanned</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.red }}>Tote-Large</div>
            </div>
            <div style={{ padding: "14px 16px", background: C.greenBg }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Required</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.green }}>{position?.requiredType}</div>
            </div>
          </div>
        </div>
        <div style={{ background: C.amberBg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.amberBdr}`, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
            <strong>Position {position?.pos} is blocked.</strong> All other confirmed positions remain active — front-seat operator is unaffected.
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Resolution steps</div>
          {[
            "Remove the scanned carrying unit",
            `Fetch a ${position?.requiredType} from the buffer`,
            `Place it in Position ${position?.pos}`,
            "Scan the new unit to confirm",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 12, color: C.navy, lineHeight: 1.5, paddingTop: 2 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 20px 20px", background: "#fff", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button onClick={onRetry} style={{ width: "100%", padding: "15px", borderRadius: 8, border: "none", background: C.orange, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          SCAN REPLACEMENT UNIT →
        </button>
      </div>
    </div>
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
  const SCREENS = {
    activating:  "Screen 1 — Rollcage Docked",
    association: activePos < positions.length ? "Screen 2 — Association" : "Screen 3 — All Confirmed",
    error:       "Screen 4 — Wrong Type",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#dde1e9", fontFamily: "'Segoe UI', Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", background: C.navy, padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#fff", borderRadius: 5, padding: "4px 8px", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>GO</span></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>GreyOrange</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>|</span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Pick-Back Operator UI</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: "auto" }}>Epic 5 — Carrying Unit Association · EL ATL</span>
      </div>
      <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: 0.5, textTransform: "uppercase", padding: "4px 16px", background: "#fff3e0", borderRadius: 20, border: "1px solid #ffcc80" }}>{SCREENS[screen]}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { key: "activating",  label: "1. Activate" },
          { key: "association", label: `2. Associate (${confirmedCount}/${ROLLCAGE.totalPositions})` },
          { key: "error",       label: "3. Error flow" },
        ].map(s => (
          <button key={s.key} onClick={() => { setScreen(s.key); if (s.key === "association") setErrorPos(null); }}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: screen === s.key ? C.orange : C.navy, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {s.label}
          </button>
        ))}
      </div>
      {/* Phone frame */}
      <div style={{ width: 390, background: "#fff", borderRadius: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden", border: "8px solid #1a2340" }}>
        <div style={{ height: 28, background: C.navy, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>09:48</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>▮▮▮▮ WiFi</span>
        </div>
        <div style={{ height: 640, overflowY: "auto" }}>
          {screen === "activating" && <ScreenActivating onStart={() => setScreen("association")} />}
          {screen === "association" && <ScreenAssociation positions={positions} activePos={activePos} onConfirm={handleConfirm} onError={handleError} />}
          {screen === "error" && <ScreenError position={errorPos || ROLLCAGE.positions[0]} onRetry={handleRetry} />}
        </div>
      </div>
      <div style={{ marginTop: 24, padding: "0 32px 48px", maxWidth: 500, textAlign: "center", fontSize: 11, color: "#8a93a8", lineHeight: 1.6 }}>
        Screens match the RTP pick-back flow: one task per screen, single scan zone, position progress dots, immediate error resolution.
      </div>
    </div>
  );
}
