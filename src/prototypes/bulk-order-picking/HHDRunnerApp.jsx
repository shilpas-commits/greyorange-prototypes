import { useState } from "react";

// GreyOrange brand tokens — match existing repo
const C = {
  navy:      "#1a2340",
  navyLight: "#243058",
  orange:    "#e65c00",
  orangeHov: "#cc5200",
  border:    "#d0d5df",
  muted:     "#6b7280",
  bg:        "#f4f5f7",
  green:     "#2e7d32",
  greenBg:   "#e8f5e9",
  red:       "#c62828",
  redBg:     "#ffebee",
  amber:     "#e65100",
  amberBg:   "#fff3e0",
  white:     "#ffffff",
  surface:   "#ffffff",
  surfaceAlt:"#f9fafb",
};

const TASK_QUEUE = [
  {
    id: "RC-ATL-00412",
    type: "Rollcage-A",
    order: "ORD-SAP-7821",
    flowType: "REPLEN-Emergency",
    priority: "URGENT",
    station: "STN-04",
    dockPoint: "D4-02",
    binCount: 8,
    dockStatus: "FREE",
    eta: "< 1 min",
  },
  {
    id: "RC-ATL-00413",
    type: "Rollcage-B",
    order: "ORD-SAP-7821",
    flowType: "REPLEN-Delivery (TC)",
    priority: "HIGH",
    station: "STN-04",
    dockPoint: "D4-03",
    binCount: 6,
    dockStatus: "FREE",
    eta: "~2 min",
  },
  {
    id: "RC-ATL-00414",
    type: "Rollcage-A",
    order: "ORD-SAP-7823",
    flowType: "ST02",
    priority: "NORMAL",
    station: "STN-02",
    dockPoint: "D2-01",
    binCount: 8,
    dockStatus: "OCCUPIED",
    eta: "~4 min",
  },
];

const PRIORITY_STYLE = {
  URGENT: { bg: "#ffebee", color: "#c62828", border: "#ef9a9a", label: "URGENT" },
  HIGH:   { bg: "#fff3e0", color: "#e65100", border: "#ffcc80", label: "HIGH" },
  NORMAL: { bg: "#f1f3f4", color: "#5a6270", border: "#d0d5df", label: "NORMAL" },
};

// Shell: NO back button
function HHDShell({ children, title, subtitle }) {
  return (
    <div style={{
      width: 375, height: 667, background: C.bg, borderRadius: 16,
      overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      border: `1px solid ${C.border}`,
      fontFamily: "'DM Mono', 'Courier New', monospace",
    }}>
      <div style={{
        background: C.navy, height: 28, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 16px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>09:41</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: 1 }}>▮▮▮▮ WiFi</span>
      </div>
      <div style={{
        background: C.navy, padding: "10px 16px 14px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>{title}</div>
          {subtitle && <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{
          background: C.orange, borderRadius: 6, padding: "3px 8px",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.9 }} />
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>LIVE</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

function ScreenTaskQueue({ onSelect }) {
  return (
    <HHDShell title="Build Queue" subtitle="Runner: Operator #R-07 · Shift A">
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          background: "#fff3e0", border: "1px solid #ffcc80",
          borderRadius: 8, padding: "8px 12px", marginBottom: 12,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontSize: 11, color: C.amber, fontWeight: 700 }}>1 URGENT rollcage — dock waiting</span>
        </div>
        {TASK_QUEUE.map((task, i) => {
          const ps = PRIORITY_STYLE[task.priority];
          return (
            <div key={task.id} onClick={() => onSelect(task)} style={{
              background: C.surface, borderRadius: 10, marginBottom: 10,
              border: `1.5px solid ${i === 0 ? C.orange : C.border}`,
              overflow: "hidden", cursor: "pointer",
              boxShadow: i === 0 ? "0 2px 12px rgba(230,92,0,0.15)" : "none",
            }}>
              <div style={{
                background: i === 0 ? "#fff3e0" : C.surfaceAlt,
                padding: "8px 12px", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? C.orange : C.navy, letterSpacing: 0.5 }}>{task.id}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>{ps.label}</span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <Tag label={task.type} color={C.navy} />
                  <Tag label={task.flowType} color="#1565c0" bg="#e3f2fd" border="#bbdefb" />
                </div>
                <Row label="Order" value={task.order} />
                <Row label="Station" value={`${task.station} · ${task.dockPoint}`} />
                <Row label="Bins" value={`${task.binCount} positions`} />
                <Row label="Dock" value={task.dockStatus === "FREE" ? `FREE · ${task.eta}` : `OCCUPIED · ${task.eta}`} valueColor={task.dockStatus === "FREE" ? C.green : C.amber} />
              </div>
              <div style={{ padding: "8px 12px", background: C.surfaceAlt, borderTop: `1px solid ${C.border}` }}>
                <button style={{
                  width: "100%", padding: "8px", borderRadius: 6, border: "none",
                  background: i === 0 ? C.orange : C.navy,
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5,
                }}>START BUILD →</button>
              </div>
            </div>
          );
        })}
      </div>
    </HHDShell>
  );
}

function ScreenBuildDetail({ task, onNext }) {
  return (
    <HHDShell title="Build Rollcage" subtitle={task.id}>
      <div style={{ padding: "14px 14px" }}>
        <div style={{ background: C.navy, borderRadius: 10, padding: "18px 16px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>FETCH THIS ROLLCAGE TYPE</div>
          <div style={{ color: C.orange, fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>{task.type.toUpperCase()}</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 6 }}>{task.binCount} bin positions · {task.flowType}</div>
        </div>
        <SectionHeader label="DOCK DESTINATION" />
        <InfoCard>
          <BigValueRow label="Station" value={task.station} />
          <BigValueRow label="Dock Point" value={task.dockPoint} highlight />
          <BigValueRow label="Dock Status" value={task.dockStatus} valueColor={task.dockStatus === "FREE" ? C.green : C.amber} />
          <BigValueRow label="Est. Wait" value={task.eta} />
        </InfoCard>
        <SectionHeader label="ORDER CONTEXT" />
        <InfoCard>
          <BigValueRow label="Order" value={task.order} />
          <BigValueRow label="Flow Type" value={task.flowType} />
          <BigValueRow label="Priority" value={task.priority} valueColor={PRIORITY_STYLE[task.priority].color} />
        </InfoCard>
        <SectionHeader label="BEFORE YOU DOCK" />
        <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 14, border: `1px solid ${C.border}` }}>
          {["Rollcage type matches label on cart", "Carrying units loaded (if required)", "Cart structurally intact"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${C.border}`, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
        <button onClick={onNext} style={{
          width: "100%", padding: "13px", borderRadius: 8,
          border: "none", background: C.orange, color: "#fff",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", letterSpacing: 0.5,
        }}>SCAN DOCK POINT →</button>
      </div>
    </HHDShell>
  );
}

function ScreenDockScan({ task, onSuccess, onFail }) {
  return (
    <HHDShell title="Dock Scan" subtitle={`${task.station} · ${task.dockPoint}`}>
      <div style={{ padding: "14px 14px", textAlign: "center" }}>
        <div style={{ background: C.navy, borderRadius: 12, padding: "30px 20px", marginBottom: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>SCAN DOCK POINT BARCODE</div>
          <div style={{
            width: 140, height: 140, margin: "0 auto",
            border: "2px solid rgba(230,92,0,0.6)", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(230,92,0,0.05)",
          }}>
            <span style={{ fontSize: 48 }}>▦</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 12 }}>Expected: {task.dockPoint}</div>
        </div>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 20, lineHeight: 1.6 }}>Point scanner at the dock point label on the station.<br />Validation happens automatically on scan.</div>
        <button onClick={onSuccess} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: C.green, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>✓ SIMULATE: CORRECT SCAN</button>
        <button onClick={onFail} style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1.5px solid ${C.red}`, background: "#fff", color: C.red, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✗ SIMULATE: WRONG DOCK POINT</button>
      </div>
    </HHDShell>
  );
}

function ScreenMismatch({ task, onRetry }) {
  return (
    <HHDShell title="Docking Rejected" subtitle="Validation failed">
      <div style={{ padding: "14px 14px" }}>
        <div style={{ background: C.redBg, border: `2px solid ${C.red}`, borderRadius: 10, padding: "16px 14px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✗</div>
          <div style={{ color: C.red, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>WRONG DOCK POINT</div>
          <div style={{ color: C.red, fontSize: 11, opacity: 0.8 }}>This dock point does not accept {task.type}</div>
        </div>
        <SectionHeader label="WHAT HAPPENED" />
        <InfoCard>
          <BigValueRow label="You scanned" value="D4-01" valueColor={C.red} />
          <BigValueRow label="Required dock" value={task.dockPoint} highlight valueColor={C.green} />
          <BigValueRow label="Station" value={task.station} />
          <BigValueRow label="Rollcage type" value={task.type} />
          <BigValueRow label="Dock compatibility" value="D4-01 → Rollcage-B only" valueColor={C.red} />
        </InfoCard>
        <SectionHeader label="NEXT STEP" />
        <div style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.navy, lineHeight: 1.7 }}>1. Do <strong>not</strong> dock this rollcage here.<br />2. Navigate to <strong>{task.station}</strong> dock point <strong style={{ color: C.orange }}>{task.dockPoint}</strong>.<br />3. Scan again at the correct dock point.</div>
        </div>
        <button onClick={onRetry} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: C.orange, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>SCAN CORRECT DOCK POINT →</button>
      </div>
    </HHDShell>
  );
}

function ScreenDockSuccess({ task, onDone }) {
  return (
    <HHDShell title="Rollcage Docked" subtitle={task.id}>
      <div style={{ padding: "14px 14px", textAlign: "center" }}>
        <div style={{ background: C.greenBg, border: `2px solid ${C.green}`, borderRadius: 10, padding: "24px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
          <div style={{ color: C.green, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>DOCKED SUCCESSFULLY</div>
          <div style={{ color: C.green, fontSize: 11, opacity: 0.8 }}>{task.station} · {task.dockPoint} · {task.type}</div>
        </div>
        <InfoCard>
          <BigValueRow label="Rollcage" value={task.id} />
          <BigValueRow label="Order" value={task.order} />
          <BigValueRow label="Flow type" value={task.flowType} />
          <BigValueRow label="Bins ready" value={`${task.binCount} positions active`} valueColor={C.green} />
          <BigValueRow label="Picking" value="STARTED — station live" valueColor={C.green} />
        </InfoCard>
        <div style={{ background: "#e3f2fd", borderRadius: 8, padding: "10px 12px", marginTop: 12, marginBottom: 16, border: "1px solid #bbdefb" }}>
          <div style={{ fontSize: 11, color: "#1565c0", fontWeight: 700, marginBottom: 3 }}>NEXT TASK READY</div>
          <div style={{ fontSize: 11, color: "#1565c0" }}>RC-ATL-00413 · {task.station} · D4-03 · Rollcage-B</div>
        </div>
        <button onClick={onDone} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: C.navy, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>RETURN TO QUEUE</button>
      </div>
    </HHDShell>
  );
}

function Tag({ label, color = C.navy, bg, border }) {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: bg || `${color}18`, color, border: `1px solid ${border || `${color}40`}`, letterSpacing: 0.3 }}>{label}</span>;
}
function Row({ label, value, valueColor }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}><span style={{ fontSize: 10, color: C.muted }}>{label}</span><span style={{ fontSize: 10, color: valueColor || C.navy, fontWeight: 600 }}>{value}</span></div>;
}
function SectionHeader({ label }) {
  return <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: C.muted, marginBottom: 6, marginTop: 4, textTransform: "uppercase" }}>{label}</div>;
}
function InfoCard({ children }) {
  return <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 12, border: `1px solid ${C.border}` }}>{children}</div>;
}
function BigValueRow({ label, value, highlight, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: highlight ? 700 : 600, color: valueColor || (highlight ? C.orange : C.navy), background: highlight ? "#fff3e0" : "transparent", padding: highlight ? "2px 8px" : 0, borderRadius: 4 }}>{value}</span>
    </div>
  );
}

function ScreenContainer({ label, children, active, dim }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: dim ? 0.45 : 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: active ? C.orange : C.muted, letterSpacing: 0.5, textTransform: "uppercase", padding: "4px 12px", background: active ? "#fff3e0" : "#f1f3f4", borderRadius: 20, border: `1px solid ${active ? "#ffcc80" : C.border}` }}>{label}</div>
      {children}
    </div>
  );
}
function EmptyState({ label }) {
  return <div style={{ width: 375, height: 667, background: "#f9fafb", borderRadius: 16, border: `1.5px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}><span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{label}</span></div>;
}
function FlowLegend() {
  const steps = [
    { label: "Task Queue", desc: "Prioritised rollcage build tasks by PBT", epic: "Epic 4 · Req 4.1" },
    { label: "Build Instruction", desc: "Type, dock point, station, checklist", epic: "Epic 4 · Req 4.1" },
    { label: "Dock Scan", desc: "Runner scans dock point barcode", epic: "Epic 4 · Req 4.2" },
    { label: "Validation", desc: "Match / mismatch caught instantly at scan", epic: "Epic 4 · Req 4.2" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 12, letterSpacing: 0.5 }}>FLOW COVERAGE — RUNNER HHD APP</div>
      <div style={{ display: "flex", gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <div style={{ flex: 1, height: 2, background: i === 0 ? "transparent" : C.orange }} />
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1, height: 2, background: i === steps.length - 1 ? "transparent" : C.orange }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.4 }}>{s.desc}</div>
            <div style={{ fontSize: 9, color: C.orange, fontWeight: 700, letterSpacing: 0.5 }}>{s.epic}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HHDRunnerApp() {
  const [screen, setScreen] = useState("queue");
  const [selectedTask, setSelectedTask] = useState(null);
  const handleSelect = (task) => { setSelectedTask(task); setScreen("detail"); };
  return (
    <div style={{ minHeight: "100vh", background: "#e8eaf0", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'DM Mono', monospace" }}>
      <div style={{ width: "100%", background: C.navy, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#fff", borderRadius: 5, padding: "4px 8px", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>GO</span></div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>GreyOrange</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>|</span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Runner HHD App</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: "auto" }}>Epic 4 — Rollcage Docking at PPS · EL ATL</span>
      </div>
      <div style={{ display: "flex", gap: 32, padding: "0 32px 48px", flexWrap: "wrap", justifyContent: "center" }}>
        <ScreenContainer label="Screen 1 — Task Queue" active={screen === "queue"}><ScreenTaskQueue onSelect={handleSelect} /></ScreenContainer>
        <ScreenContainer label="Screen 2 — Build Instruction" active={screen === "detail"} dim={!selectedTask}>{selectedTask ? <ScreenBuildDetail task={selectedTask} onNext={() => setScreen("scan")} /> : <EmptyState label="Select a task from Screen 1 to continue" />}</ScreenContainer>
        <ScreenContainer label="Screen 3 — Dock Scan" active={screen === "scan"} dim={screen !== "scan"}>{screen === "scan" && selectedTask ? <ScreenDockScan task={selectedTask} onSuccess={() => setScreen("success")} onFail={() => setScreen("mismatch")} /> : <EmptyState label="Navigate to Scan screen via Screen 2" />}</ScreenContainer>
        <ScreenContainer label="Screen 4 — Mismatch / Success" active={screen === "mismatch" || screen === "success"} dim={screen !== "mismatch" && screen !== "success"}>{screen === "mismatch" && selectedTask ? <ScreenMismatch task={selectedTask} onRetry={() => setScreen("scan")} /> : screen === "success" && selectedTask ? <ScreenDockSuccess task={selectedTask} onDone={() => { setSelectedTask(null); setScreen("queue"); }} /> : <EmptyState label="Outcome shown after dock scan" />}</ScreenContainer>
      </div>
      <div style={{ padding: "0 32px 48px", maxWidth: 900, width: "100%" }}><FlowLegend /></div>
    </div>
  );
}
